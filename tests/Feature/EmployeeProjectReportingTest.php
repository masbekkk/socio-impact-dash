<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\ProjectMonitoring;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

final class EmployeeProjectReportingTest extends TestCase
{
    public function test_pegawai_sees_reporting_pages_and_limited_project_data(): void
    {
        $employee = User::factory()->withRole(UserRole::Pegawai)->create();
        $project = Project::factory()->create(['status' => 'active', 'budget_total' => 90000000]);
        $draft = Project::factory()->create(['status' => 'draft']);

        $this->actingAs($employee)->get('/projects')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Projects/EmployeeIndex')->etc())
            ->assertSee($project->uuid)
            ->assertDontSee($draft->uuid);

        $this->actingAs($employee)->get("/projects/{$project->uuid}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Projects/EmployeeShow')->etc());

        $this->actingAs($employee)->getJson("/api/v1/projects/{$project->uuid}")
            ->assertOk()
            ->assertJsonPath('data.name', $project->name)
            ->assertJsonMissingPath('data.budget_total');

        $this->actingAs($employee)->postJson("/api/v1/projects/{$project->uuid}/monitorings", [
            'report_date' => now()->toDateString(),
            'notes' => 'Progres pekerjaan minggu ini',
        ])->assertCreated();

        $this->actingAs($employee)->get("/projects/{$project->uuid}")
            ->assertOk()
            ->assertSee('Progres pekerjaan minggu ini');

        $monitoring = ProjectMonitoring::query()->where('project_id', $project->id)->firstOrFail();
        $monitoring->documents()->create([
            'title' => 'Laporan kemajuan Oktober',
            'original_name' => 'laporan-oktober.pdf',
            'path' => 'projects/laporan-oktober.pdf',
            'mime' => 'application/pdf',
            'size' => 1024,
            'upload_status' => 'completed',
        ]);
        $monitoring->documents()->create([
            'title' => 'Foto kegiatan',
            'original_name' => 'foto-kegiatan.jpg',
            'path' => '',
            'mime' => 'image/jpeg',
            'size' => 1024,
            'upload_status' => 'pending',
        ]);

        $this->actingAs($employee)->get("/projects/{$project->uuid}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Projects/EmployeeShow')
                ->where('monitorings.0.documents.0.title', 'Laporan kemajuan Oktober')
                ->where('monitorings.0.documents.0.url', '/storage/projects/laporan-oktober.pdf')
                ->where('monitorings.0.documents.1.title', 'Foto kegiatan')
                ->where('monitorings.0.documents.1.url', null)
                ->etc());

        $this->actingAs($employee)->deleteJson("/api/v1/projects/{$project->uuid}/monitorings/{$monitoring->id}")
            ->assertForbidden();

        $this->actingAs($employee)->get("/projects/{$project->uuid}/edit")->assertForbidden();
        $this->actingAs($employee)->get("/projects/{$draft->uuid}")->assertNotFound();
        $this->actingAs($employee)->postJson("/api/v1/projects/{$draft->uuid}/monitorings", [
            'report_date' => now()->toDateString(),
        ])->assertNotFound();
    }

    public function test_finance_role_takes_priority_and_can_update_a_termin(): void
    {
        $user = User::factory()->withRole(UserRole::Finance)->create();
        $user->assignRole(UserRole::Pegawai->value);
        $project = Project::factory()->create(['status' => 'active']);
        $term = $project->terminPayments()->create([
            'nominal' => 1000000,
            'due_date' => now()->addWeek(),
        ]);

        $this->actingAs($user)->get('/projects')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Projects/Index')->etc());

        $this->actingAs($user)->get("/projects/{$project->uuid}/termins")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Projects/TerminUpload')
                ->where('termins.0.nominal', 1000000)
                ->etc());

        $this->actingAs($user)->getJson("/api/v1/projects/{$project->uuid}")
            ->assertOk()
            ->assertJsonPath('data.budget_total', (float) $project->budget_total);

        Storage::fake('public');
        $this->actingAs($user)->postJson("/api/v1/projects/{$project->uuid}/termins/{$term->id}", [
            'billing_file' => UploadedFile::fake()->create('tagihan.pdf', 10, 'application/pdf'),
        ])->assertOk();

        $this->assertNotNull($term->fresh()->billing_document);

        $employee = User::factory()->withRole(UserRole::Pegawai)->create();
        $this->actingAs($employee)->get("/projects/{$project->uuid}/termins")
            ->assertForbidden();
        $this->actingAs($employee)->postJson("/api/v1/projects/{$project->uuid}/termins/{$term->id}", [
            'is_verified' => true,
        ])->assertForbidden();
    }
}
