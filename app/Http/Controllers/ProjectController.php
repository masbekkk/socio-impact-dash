<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

final class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        if ($request->user()->hasProjectReportingOnlyAccess()) {
            return Inertia::render('Projects/EmployeeIndex', [
                'projects' => Project::query()
                    ->where('status', ProjectStatus::Active)
                    ->orderBy('code')
                    ->get(['uuid', 'code', 'initial_project', 'name']),
            ]);
        }

        return Inertia::render('Projects/Index', [
            'filters' => $request->only(['search', 'status', 'division', 'start_date', 'end_date']),
            'divisions' => \App\Models\Division::with('divisionCode')->get(),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_if($request->user()->hasProjectReportingOnlyAccess(), 403);

        $totalManagementBudget = Project::where('project_type', '!=', 'non-project')->sum('management_budget');
        $usedNonProjectBudget = Project::where('project_type', 'non-project')->sum('budget_total');

        return Inertia::render('Projects/Create', [
            'divisions' => \App\Models\Division::with('divisionCode')->get(),
            'employees' => User::with('roles')->get(),
            'available_management_budget' => max(0, $totalManagementBudget - $usedNonProjectBudget),
        ]);
    }

    public function show(Request $request, Project $project): Response
    {
        if ($request->user()->hasProjectReportingOnlyAccess()) {
            abort_unless($project->status === ProjectStatus::Active, 404);

            return Inertia::render('Projects/EmployeeShow', [
                'project' => $project->only(['uuid', 'code', 'initial_project', 'name']),
                'monitorings' => $project->monitorings()
                    ->with(['creator', 'documents'])
                    ->latest('report_date')
                    ->get()
                    ->map(fn ($monitoring): array => [
                        'id' => $monitoring->id,
                        'report_date' => $monitoring->report_date,
                        'notes' => $monitoring->notes,
                        'creator_name' => $monitoring->creator?->name,
                        'documents' => $monitoring->documents->map(fn ($document): array => [
                            'id' => $document->id,
                            'title' => $document->title,
                            'original_name' => $document->original_name,
                            'url' => $document->upload_status === 'completed' ? $document->url : null,
                            'upload_status' => $document->upload_status,
                        ]),
                    ]),
            ]);
        }

        return Inertia::render('Projects/Show', [
            'project_slug' => $project->uuid,
        ]);
    }

    public function termins(Request $request, Project $project): Response
    {
        abort_unless($request->user()->hasAnyRole(['finance', 'superadmin']), 403);

        return Inertia::render('Projects/TerminUpload', [
            'project' => $project->only(['uuid', 'code', 'initial_project', 'name']),
            'termins' => $project->terminPayments()
                ->orderBy('due_date')
                ->get()
                ->map(fn ($term): array => [
                    'id' => $term->id,
                    'nominal' => (float) $term->nominal,
                    'due_date' => $term->due_date?->toDateString(),
                    'notes' => $term->notes,
                    'nomor_surat' => $term->nomor_surat,
                    'tertuju' => $term->tertuju,
                    'verified_by' => $term->verified_by,
                    'billing_document_url' => $term->billing_document_url,
                    'proof_payment_url' => $term->proof_payment_url,
                ]),
        ]);
    }

    public function edit(Request $request, Project $project): Response
    {
        abort_if($request->user()->hasProjectReportingOnlyAccess(), 403);

        $totalManagementBudget = Project::where('project_type', '!=', 'non-project')->sum('management_budget');
        $usedNonProjectBudget = Project::where('project_type', 'non-project')->where('id', '!=', $project->id)->sum('budget_total');

        return Inertia::render('Projects/Edit', [
            'project_slug' => $project->uuid,
            'divisions' => \App\Models\Division::with('divisionCode')->get(),
            'employees' => User::with('roles')->get(),
            'available_management_budget' => max(0, $totalManagementBudget - $usedNonProjectBudget),
        ]);
    }
}
