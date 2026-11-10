<?php

declare(strict_types=1);

use App\Enums\ReimbursementStatus;
use App\Enums\ReimbursementType;
use App\Models\Reimbursement;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    foreach (['finance', 'direktur', 'pegawai', 'head'] as $role) {
        Role::query()->firstOrCreate(['name' => $role]);
    }
    Storage::fake('public');
    $this->withoutVite();
});

test('reimbursable EER requires director approval between finance approval and transfer', function (bool $bulk): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');
    $director = User::factory()->create();
    $director->assignRole('direktur');
    $eer = Reimbursement::factory()->create([
        'type' => ReimbursementType::EER,
        'eer_type' => 'reimbursement',
        'status' => ReimbursementStatus::HeadApproved,
        'transfer_proof_path' => null,
        'transferred_at' => null,
    ]);
    $eer->approvals()->create(['role' => 'finance', 'approver_id' => $finance->id, 'status' => 'pending']);

    $this->actingAs($director)->postJson("/api/v1/reimbursements/{$eer->id}/status", [
        'action' => 'approved', 'role' => 'direktur',
    ])->assertUnprocessable();
    expect($eer->fresh()->status)->toBe(ReimbursementStatus::HeadApproved);

    $this->postJson(route('reimbursements.bulk-approve'), ['ids' => [$eer->id], 'role' => 'direktur'])->assertUnprocessable();

    $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$eer->id}/status", [
        'action' => 'approved', 'role' => 'finance',
    ])->assertOk();

    $this->postJson("/api/v1/reimbursements/{$eer->id}/status", [
        'action' => 'transferred',
        'transfer_proof' => UploadedFile::fake()->create('proof.pdf', 1, 'application/pdf'),
    ])->assertUnprocessable();
    expect(Storage::disk('public')->allFiles())->toBeEmpty();

    $this->actingAs($director)->get(route('dashboard'))->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('approvalItems.direktur_reimbursements', function ($items) use ($eer): bool {
                $item = collect($items)->firstWhere('id', $eer->id);

                return $item !== null && $item['can_approve'] === true;
            })->etc());

    if ($bulk) {
        $this->post(route('reimbursements.bulk-approve'), ['ids' => [$eer->id], 'role' => 'direktur'])->assertRedirect();
    } else {
        $this->postJson("/api/v1/reimbursements/{$eer->id}/status", ['action' => 'approved', 'role' => 'direktur'])->assertOk();
    }

    expect($eer->fresh()->status)->toBe(ReimbursementStatus::Approved)
        ->and($eer->fresh()->transfer_proof_path)->toBeNull()
        ->and($eer->fresh()->transferred_at)->toBeNull();
    expect($eer->approvals()->where('role', 'finance')->first()->updated_by)->toBe($finance->id);

    $this->get(route('dashboard'))->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->where('approvalItems.direktur_reimbursements', fn ($items): bool => ! collect($items)->pluck('id')->contains($eer->id))->etc());

    $this->postJson("/api/v1/reimbursements/{$eer->id}/status", [
        'action' => 'transferred',
        'transfer_proof' => UploadedFile::fake()->create('proof.pdf', 1, 'application/pdf'),
    ])->assertForbidden();

    if ($bulk) {
        $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$eer->id}/status", [
            'action' => 'request_fund', 'role' => 'finance',
        ])->assertOk();
        expect($eer->fresh()->status)->toBe(ReimbursementStatus::Requested);
    }

    $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$eer->id}/status", [
        'action' => 'transferred',
        'transfer_proof' => UploadedFile::fake()->create('proof.pdf', 1, 'application/pdf'),
        'transferred_amount' => 100000,
    ])->assertOk();
    expect($eer->fresh()->status)->toBe(ReimbursementStatus::Closed)
        ->and($eer->fresh()->transferred_at)->not->toBeNull();
    Storage::disk('public')->assertExists($eer->fresh()->transfer_proof_path);
})->with([false, true]);

test('finance cannot bypass director approval using combined approval upload, role spoofing or proof replacement', function (string $attempt): void {
    $finance = User::factory()->create();
    $finance->assignRole('finance');
    $eer = Reimbursement::factory()->create([
        'type' => ReimbursementType::EER,
        'eer_type' => 'reimbursement',
        'status' => ReimbursementStatus::FinanceApproved,
        'transfer_proof_path' => 'old.pdf',
    ]);
    Storage::disk('public')->put('old.pdf', 'old');
    $eer->approvals()->create(['role' => 'finance', 'approver_id' => $finance->id, 'status' => 'approved']);
    $payload = ['action' => 'approved', 'role' => 'finance'];
    $endpoint = 'status';
    if ($attempt === 'spoof') {
        $payload['role'] = 'direktur';
    } elseif ($attempt === 'transfer') {
        $payload['action'] = 'transferred';
    } elseif ($attempt === 'request_fund') {
        $payload['action'] = 'request_fund';
    } else {
        $payload['transfer_proof'] = UploadedFile::fake()->create('proof.pdf', 1, 'application/pdf');
        if ($attempt === 'replace') {
            $endpoint = 'transfer-proof';
        }
    }

    $this->actingAs($finance)->postJson("/api/v1/reimbursements/{$eer->id}/{$endpoint}", $payload)->assertUnprocessable();
    expect($eer->fresh()->status)->toBe(ReimbursementStatus::FinanceApproved)
        ->and($eer->fresh()->transfer_proof_path)->toBe('old.pdf');
    expect(Storage::disk('public')->allFiles())->toBe(['old.pdf']);
})->with(['upload', 'spoof', 'transfer', 'request_fund', 'replace']);

test('reimbursable EER cannot include transfer proof on creation or resubmission', function (bool $resubmit): void {
    $owner = User::factory()->create();
    $owner->assignRole('pegawai');
    $payload = [
        'type' => 'eer',
        'eer_type' => 'reimbursement',
        'status' => 'draft',
        'amount' => 100000,
        'approver_head_id' => $owner->id,
        'transfer_proof' => UploadedFile::fake()->create('proof.pdf', 1, 'application/pdf'),
    ];
    $url = '/api/v1/reimbursements';
    if ($resubmit) {
        $eer = Reimbursement::factory()->create([
            'user_id' => $owner->id,
            'type' => ReimbursementType::EER,
            'eer_type' => 'reimbursement',
            'status' => ReimbursementStatus::Revision,
        ]);
        $url .= "/{$eer->id}/resubmit";
    }

    $this->actingAs($owner)->postJson($url, $payload)->assertUnprocessable()->assertJsonValidationErrors('transfer_proof');
    expect(Storage::disk('public')->allFiles())->toBeEmpty();
})->with([false, true]);
