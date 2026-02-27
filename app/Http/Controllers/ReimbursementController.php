<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreReimbursementRequest;
use App\Http\Requests\UpdateReimbursementRequest;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Enums\ReimbursementType;
use App\Services\ReimbursementService;
use Inertia\Inertia;
use Illuminate\Http\Request;

final class ReimbursementController
{
    public function __construct(
        private ReimbursementService $reimbursementService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Inertia\Response
    {
        $user = $request->user();

        $filters = [
            'type' => $request->get('type'),
            'status' => $request->get('status'),
            'search' => $request->get('search'),
            'start_date' => $request->get('start_date'),
            'end_date' => $request->get('end_date'),
            'sort_by' => $request->get('sort_by', 'created_at'),
            'sort_dir' => $request->get('sort_dir', 'desc'),
        ];

        $perPage = $request->integer('per_page', 10);
        $reimbursements = $this->reimbursementService->listReimbursements($user, $filters, $perPage);

        return Inertia::render('Reimbursements/Index', [
            'reimbursements' => $reimbursements,
            'filters' => [
                'type' => $request->get('type', ''),
                'status' => $request->get('status', ''),
                'search' => $request->get('search', ''),
                'start_date' => $request->get('start_date', ''),
                'end_date' => $request->get('end_date', ''),
                'sort_by' => $request->get('sort_by', 'created_at'),
                'sort_dir' => $request->get('sort_dir', 'desc'),
                'per_page' => $perPage,
            ],
        ]);
    }

    public function createATR(): \Inertia\Response
    {
        $projects = Project::with(['division', 'pic', 'head', 'budgetDetails'])
            ->where('status', 'active')
            ->get()
            ->map(fn (Project $project) => [
                'id' => $project->id,
                'name' => $project->name,
                'code' => $project->code,
                'operational_budget' => (float) $project->operational_budget,
                'used_operational_budget' => (float) $project->reimbursements()
                    ->where('type', 'atr')
                    ->whereNotIn('status', ['rejected', 'submitted', 'draft'])
                    ->sum('amount'),
                'division_name' => $project->division?->name ?? '-',
                'pic_name' => $project->pic?->name ?? '-',
                'head_name' => $project->head?->name ?? '-',
                'head_email' => $project->head?->email ?? '-',
                'head_role' => $project->head?->role?->value ?? '-',
                'budget_details' => $project->budgetDetails->map(fn (\App\Models\ProjectBudgetDetail $detail) => [
                    'id' => $detail->id,
                    'notes' => $detail->notes,
                    'amount' => (float) $detail->amount,
                ])->values()->all(),
            ]);

        $approversGrouped = \App\Models\User::role(['head', 'finance', 'direktur'])
            ->get()
            ->groupBy(fn (\App\Models\User $user) => $user->roles->first()->name)
            ->map(fn (\Illuminate\Database\Eloquent\Collection $users) => $users->map(fn (\App\Models\User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
            ])->values()->all());

        return Inertia::render('Reimbursements/CreateATR', [
            'projects' => $projects,
            'approvers' => $approversGrouped,
        ]);
    }



    public function createEER(): \Inertia\Response
    {
        $projects = Project::with(['division', 'pic', 'head'])
            ->where('status', 'active')
            ->get()
            ->map(fn (\App\Models\Project $project) => [
                'id' => $project->id,
                'name' => $project->name,
                'code' => $project->code,
                'division_name' => $project->division?->name ?? '-',
                'pic_name' => $project->pic?->name ?? '-',
                'head_name' => $project->head?->name ?? '-',
                'head_email' => $project->head?->email ?? '-',
                'head_role' => $project->head?->role?->value ?? '-',
            ]);

        return Inertia::render('Reimbursements/CreateEER', [
            'projects' => $projects,
        ]);
    }

    public function createAllowance(): \Inertia\Response
    {
        $projects = Project::with(['division', 'pic', 'head'])
            ->where('status', 'active')
            ->get()
            ->map(fn (\App\Models\Project $project) => [
                'id' => $project->id,
                'name' => $project->name,
                'code' => $project->code,
                'allowance_budget' => (float) $project->allowance_budget,
                'used_allowance_budget' => (float) $project->reimbursements()
                    ->where('type', 'allowance')
                    ->whereNotIn('status', ['rejected', 'submitted', 'draft'])
                    ->sum('amount'),
                'division_name' => $project->division?->name ?? '-',
                'pic_name' => $project->pic?->name ?? '-',
                'head_name' => $project->head?->name ?? '-',
                'head_email' => $project->head?->email ?? '-',
                'head_role' => $project->head?->role?->value ?? '-',
            ]);

        return Inertia::render('Reimbursements/CreateAllowance', [
            'projects' => $projects,
        ]);
    }

    public function approvals(): \Inertia\Response
    {
        return Inertia::render('Reimbursements/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): void
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReimbursementRequest $request): void
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code): \Inertia\Response
    {
        return Inertia::render('Reimbursements/Show', [
            'code' => $code,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reimbursement $reimbursement): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReimbursementRequest $request, Reimbursement $reimbursement): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reimbursement $reimbursement): void
    {
        //
    }

    public function approve(Reimbursement $reimbursement): \Illuminate\Http\RedirectResponse
    {
        // Logic to approve
        return back();
    }

    public function reject(Reimbursement $reimbursement): \Illuminate\Http\RedirectResponse
    {
        // Logic to reject
        return back();
    }
}
