<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Enums\UserRole;
use App\Models\Division;
use App\Models\DivisionCode;
use App\Models\LetterCode;
use App\Models\LetterDivision;
use App\Models\LetterRequest;
use App\Models\LetterRequestLog;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class LetterRequestLogTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Project $project;

    private DivisionCode $divisionCode;

    private Division $division;

    private LetterCode $letterCode;

    private LetterDivision $letterDivision;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);

        $this->user = User::factory()->create();
        $this->user->assignRole(UserRole::Superadmin->value);

        $this->project = Project::factory()->create();
        $this->divisionCode = DivisionCode::create(['name' => 'Socio Impact', 'code' => 'Socim.id']);
        $this->division = Division::create([
            'division_code_id' => $this->divisionCode->id,
            'name' => 'Socio Impact Division',
        ]);
        $this->division->id = $this->divisionCode->id;
        $this->division->save();

        $this->letterCode = LetterCode::create(['description' => 'Surat Pengantar', 'code' => 'SPeng']);
        $this->letterDivision = LetterDivision::create(['description' => 'PM', 'code' => 'PM']);
    }

    public function test_creates_log_on_letter_request_creation(): void
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id,
            'letter_date' => '2026-08-10',
            'recipient' => 'PT Pelindo',
            'subject' => 'Surat Pengantar',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
        ]);

        $response->assertStatus(201);
        $letterRequestId = $response->json('data.id');

        $this->assertDatabaseHas('letter_request_logs', [
            'letter_request_id' => $letterRequestId,
            'user_id' => $this->user->id,
            'action' => 'created',
        ]);
    }

    public function test_creates_log_with_reason_and_diff_on_update(): void
    {
        $this->actingAs($this->user);

        $createResponse = $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id,
            'letter_date' => '2026-08-10',
            'recipient' => 'PT Pelindo',
            'subject' => 'Surat Pengantar Awal',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
        ]);

        $id = $createResponse->json('data.id');

        // Update date and subject with a reason
        $updateResponse = $this->putJson("/api/v1/letter-requests/{$id}", [
            'project_id' => $this->project->id,
            'letter_date' => '2026-08-21',
            'recipient' => 'PT Pelindo',
            'subject' => 'Surat Pengantar Revisi',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
            'reason' => 'Diundur sesuai kesepakatan mitra',
        ]);

        $updateResponse->assertStatus(200);

        $log = LetterRequestLog::query()
            ->where('letter_request_id', $id)
            ->where('action', 'updated')
            ->first();

        $this->assertNotNull($log);
        $this->assertEquals('Diundur sesuai kesepakatan mitra', $log->reason);
        $this->assertArrayHasKey('letter_date', $log->changes);
        $this->assertArrayHasKey('subject', $log->changes);
        $this->assertStringContainsString('Tanggal surat diubah', $log->note);
    }

    public function test_creates_log_on_status_update(): void
    {
        $this->actingAs($this->user);

        $letterRequest = LetterRequest::create([
            'project_id' => $this->project->id,
            'requester_id' => $this->user->id,
            'pic_id' => $this->user->id,
            'letter_date' => '2026-08-10',
            'recipient' => 'PT Pelindo',
            'subject' => 'Surat Undangan',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
            'letter_number' => '100/SU.PM/Socim.id/8-2026',
            'status' => 'used',
        ]);

        $response = $this->patchJson("/api/v1/letter-requests/{$letterRequest->id}/status", [
            'status' => 'unused',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('letter_request_logs', [
            'letter_request_id' => $letterRequest->id,
            'action' => 'status_changed',
        ]);
    }

    public function test_show_endpoint_includes_logs_with_user(): void
    {
        $this->actingAs($this->user);

        $createResponse = $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id,
            'letter_date' => '2026-08-10',
            'recipient' => 'PT Pelindo',
            'subject' => 'Surat Pengantar Awal',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
        ]);

        $id = $createResponse->json('data.id');

        $showResponse = $this->getJson("/api/v1/letter-requests/{$id}");
        $showResponse->assertStatus(200);
        $showResponse->assertJsonStructure([
            'data' => [
                'id',
                'logs' => [
                    '*' => [
                        'id',
                        'action',
                        'note',
                        'user' => [
                            'id',
                            'name',
                        ],
                    ],
                ],
            ],
        ]);
    }
}
