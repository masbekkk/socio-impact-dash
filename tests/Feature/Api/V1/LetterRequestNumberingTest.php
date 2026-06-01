<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Enums\UserRole;
use App\Models\Division;
use App\Models\DivisionCode;
use App\Models\LetterCode;
use App\Models\LetterDivision;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class LetterRequestNumberingTest extends TestCase
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

        // Ensure the ID of division matches divisionCode for the test to bypass the inconsistency
        $this->division->id = $this->divisionCode->id;
        $this->division->save();

        $this->letterCode = LetterCode::create(['description' => 'Surat Pengantar', 'code' => 'SPeng']);
        $this->letterDivision = LetterDivision::create(['description' => 'BOD', 'code' => 'BOD']);
    }

    public function test_sequential_numbering_without_backdate(): void
    {
        $this->actingAs($this->user);

        // First request: March 31, 2026
        // Base start for Socim.id is 247 (as per controller)
        $response1 = $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id,
            'letter_date' => '2026-03-31',
            'recipient' => 'Test Recipient',
            'subject' => 'Test Subject 1',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
        ]);

        $response1->assertStatus(201);
        $this->assertEquals('247/SPeng.BOD/Socim.id/3-2026', $response1->json('data.letter_number'));

        // Second request: April 1, 2026 (Forward date)
        $response2 = $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id,
            'letter_date' => '2026-04-01',
            'recipient' => 'Test Recipient',
            'subject' => 'Test Subject 2',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
        ]);

        $response2->assertStatus(201);
        $this->assertEquals('248/SPeng.BOD/Socim.id/4-2026', $response2->json('data.letter_number'));
    }

    public function test_backdate_numbering_with_alphabet_suffix(): void
    {
        $this->actingAs($this->user);

        // 1. Create a letter for March 31, 2026 -> sequence 247
        $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id,
            'letter_date' => '2026-03-31',
            'recipient' => 'Test',
            'subject' => 'Main Letter',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
        ]);

        // 2. Create a backdated letter for March 1, 2026
        // Current behavior (FAIL): generates 248
        // Expected behavior (SUCCESS): generates 247.A
        $response = $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id,
            'letter_date' => '2026-03-01',
            'recipient' => 'Test',
            'subject' => 'Backdated Letter',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
        ]);

        $response->assertStatus(201);
        $this->assertEquals('247.A/SPeng.BOD/Socim.id/3-2026', $response->json('data.letter_number'));

        // 3. Create another backdated letter for March 15, 2026
        // Expected: 247.B
        $response2 = $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id,
            'letter_date' => '2026-03-15',
            'recipient' => 'Test',
            'subject' => 'Another Backdated Letter',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
        ]);

        $response2->assertStatus(201);
        $this->assertEquals('247.B/SPeng.BOD/Socim.id/3-2026', $response2->json('data.letter_number'));
    }

    public function test_mixed_flow_numbering(): void
    {
        $this->actingAs($this->user);

        // March 31 -> 247
        $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id, 'letter_date' => '2026-03-31', 'recipient' => 'T', 'subject' => 'S',
            'division_id' => $this->divisionCode->id, 'letter_code_id' => $this->letterCode->id, 'letter_division_id' => $this->letterDivision->id,
        ]);

        // March 1 (Backdate) -> 247.A
        $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id, 'letter_date' => '2026-03-01', 'recipient' => 'T', 'subject' => 'S',
            'division_id' => $this->divisionCode->id, 'letter_code_id' => $this->letterCode->id, 'letter_division_id' => $this->letterDivision->id,
        ]);

        // April 1 (Normal) -> 248
        $response = $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id, 'letter_date' => '2026-04-01', 'recipient' => 'T', 'subject' => 'S',
            'division_id' => $this->divisionCode->id, 'letter_code_id' => $this->letterCode->id, 'letter_division_id' => $this->letterDivision->id,
        ]);
        $this->assertEquals('248/SPeng.BOD/Socim.id/4-2026', $response->json('data.letter_number'));

        // March 20 (Backdate relative to April 1) -> 248.A
        $response2 = $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id, 'letter_date' => '2026-03-20', 'recipient' => 'T', 'subject' => 'S',
            'division_id' => $this->divisionCode->id, 'letter_code_id' => $this->letterCode->id, 'letter_division_id' => $this->letterDivision->id,
        ]);
        $this->assertEquals('248.A/SPeng.BOD/Socim.id/3-2026', $response2->json('data.letter_number'));
    }

    public function test_create_letter_request_with_status(): void
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id,
            'letter_date' => '2026-03-31',
            'recipient' => 'Test Recipient',
            'subject' => 'Test Subject',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
            'status' => 'used',
        ]);

        $response->assertStatus(201);
        $this->assertEquals('used', $response->json('data.status'));
    }

    public function test_update_letter_request_status(): void
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/v1/letter-requests', [
            'project_id' => $this->project->id,
            'letter_date' => '2026-03-31',
            'recipient' => 'Test Recipient',
            'subject' => 'Test Subject',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
        ]);

        $response->assertStatus(201);
        $this->assertEquals('unused', $response->json('data.status'));

        $id = $response->json('data.id');

        $updateResponse = $this->putJson("/api/v1/letter-requests/{$id}", [
            'project_id' => $this->project->id,
            'letter_date' => '2026-03-31',
            'recipient' => 'Updated Recipient',
            'subject' => 'Updated Subject',
            'division_id' => $this->divisionCode->id,
            'letter_code_id' => $this->letterCode->id,
            'letter_division_id' => $this->letterDivision->id,
            'status' => 'used',
        ]);

        $updateResponse->assertStatus(200);
        $this->assertEquals('used', $updateResponse->json('data.status'));
    }
}
