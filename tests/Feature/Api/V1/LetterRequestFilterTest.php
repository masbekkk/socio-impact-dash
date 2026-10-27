<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Enums\UserRole;
use App\Models\LetterCode;
use App\Models\LetterDivision;
use App\Models\LetterRequest;
use App\Models\Project;
use App\Models\User;
use Tests\TestCase;

final class LetterRequestFilterTest extends TestCase
{
    public function test_filters_letter_number_division_code_search_and_date_before_pagination(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(UserRole::Superadmin->value);
        $project = Project::factory()->create(['name' => 'Alpha Project']);
        $otherProject = Project::factory()->create(['name' => 'Beta Project']);
        $division = LetterDivision::query()->create(['code' => 'PM', 'description' => 'Project Management']);
        $otherDivision = LetterDivision::query()->create(['code' => 'FA', 'description' => 'Finance']);
        $code = LetterCode::query()->create(['code' => 'SPeng', 'description' => 'Surat Pengantar']);
        $otherCode = LetterCode::query()->create(['code' => 'INV', 'description' => 'Invoice']);

        $matching = $this->createLetter($admin, $project, $division, $code, '1278/SPeng.PM/2026', '2026-10-27');
        $secondMatching = $this->createLetter($admin, $project, $division, $code, '1279/SPeng.PM/2026', '2026-10-27');
        $this->createLetter($admin, $project, $otherDivision, $code, '1278/SPeng.FA/2026', '2026-10-27');
        $this->createLetter($admin, $project, $division, $otherCode, '1278/INV.PM/2026', '2026-10-27');
        $this->createLetter($admin, $otherProject, $division, $code, '1278/SPeng.PM/2025', '2025-10-27');

        $this->actingAs($admin);

        $this->getJson('/api/v1/letter-requests?letter_number=1278/SPeng.PM/2026')
            ->assertOk()
            ->assertJsonPath('data.total', 1)
            ->assertJsonPath('data.data.0.id', $matching->id);

        $this->getJson('/api/v1/letter-requests?letter_number=1278')
            ->assertOk()
            ->assertJsonPath('data.total', 4);

        $this->getJson("/api/v1/letter-requests?letter_division_id={$division->id}")
            ->assertOk()
            ->assertJsonPath('data.total', 4);

        $this->getJson("/api/v1/letter-requests?letter_code_id={$code->id}")
            ->assertOk()
            ->assertJsonPath('data.total', 4);

        $parameters = http_build_query([
            'letter_number' => '12',
            'letter_division_id' => $division->id,
            'letter_code_id' => $code->id,
            'search' => 'Alpha',
            'date_from' => '2026-10-01',
            'date_to' => '2026-10-31',
            'per_page' => 1,
            'page' => 2,
        ]);

        $response = $this->getJson("/api/v1/letter-requests?{$parameters}")
            ->assertOk()
            ->assertJsonPath('data.total', 2)
            ->assertJsonPath('data.current_page', 2)
            ->assertJsonCount(1, 'data.data');

        $this->assertContains($response->json('data.data.0.id'), [$matching->id, $secondMatching->id]);

        $this->getJson("/api/v1/letter-requests?letter_number=missing&letter_division_id={$division->id}")
            ->assertOk()
            ->assertJsonPath('data.total', 0);
    }

    public function test_filters_respect_existing_requester_and_head_visibility(): void
    {
        $head = User::factory()->create();
        $head->assignRole(UserRole::Head->value);
        $member = User::factory()->create(['head_id' => $head->id]);
        $member->assignRole(UserRole::Pegawai->value);
        $other = User::factory()->create();
        $other->assignRole(UserRole::Pegawai->value);
        $finance = User::factory()->create();
        $finance->assignRole(UserRole::Finance->value);
        $director = User::factory()->create();
        $director->assignRole(UserRole::Direktur->value);
        $project = Project::factory()->create();
        $division = LetterDivision::query()->create(['code' => 'PM']);
        $code = LetterCode::query()->create(['code' => 'SPeng']);

        $headLetter = $this->createLetter($head, $project, $division, $code, '777/SPeng.PM/2026', '2026-10-27');
        $memberLetter = $this->createLetter($member, $project, $division, $code, '778/SPeng.PM/2026', '2026-10-27');
        $otherLetter = $this->createLetter($other, $project, $division, $code, '779/SPeng.PM/2026', '2026-10-27');
        $url = "/api/v1/letter-requests?letter_number=SPeng&letter_division_id={$division->id}&letter_code_id={$code->id}";

        $this->actingAs($member)->getJson($url)
            ->assertOk()
            ->assertJsonPath('data.total', 1)
            ->assertJsonPath('data.data.0.id', $memberLetter->id);

        $headResponse = $this->actingAs($head)->getJson($url)
            ->assertOk()
            ->assertJsonPath('data.total', 2);
        $this->assertEqualsCanonicalizing(
            [$headLetter->id, $memberLetter->id],
            array_column($headResponse->json('data.data'), 'id'),
        );

        foreach ([$finance, $director] as $user) {
            $response = $this->actingAs($user)->getJson($url)
                ->assertOk()
                ->assertJsonPath('data.total', 3);
            $this->assertContains($otherLetter->id, array_column($response->json('data.data'), 'id'));
        }
    }

    private function createLetter(
        User $requester,
        Project $project,
        LetterDivision $division,
        LetterCode $code,
        string $number,
        string $date,
    ): LetterRequest {
        return LetterRequest::query()->create([
            'requester_id' => $requester->id,
            'project_id' => $project->id,
            'letter_division_id' => $division->id,
            'letter_code_id' => $code->id,
            'letter_number' => $number,
            'letter_date' => $date,
            'recipient' => 'Recipient',
            'subject' => 'Test subject',
            'approval_status' => 'pending',
            'status' => 'used',
        ]);
    }
}
