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
    public function index(Request $request)
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

    public function createATR()
    {
        $projects = Project::with(['division', 'pic', 'head'])
            ->where('status', 'active')
            ->get()
            ->map(fn (Project $project) => [
                'id' => $project->id,
                'name' => $project->name,
                'code' => $project->code,
                'operational_budget' => (float) $project->operational_budget,
                'used_operational_budget' => 0,
                'division_name' => $project->division?->name ?? '-',
                'pic_name' => $project->pic?->name ?? '-',
                'head_name' => $project->head?->name ?? '-',
                'head_email' => $project->head?->email ?? '-',
                'head_role' => $project->head?->role?->value ?? '-',
            ]);

        return Inertia::render('Reimbursements/CreateATR', [
            'projects' => $projects,
        ]);
    }



    public function createEER()
    {
        $projects = Project::with(['division', 'pic', 'head'])
            ->where('status', 'active')
            ->get()
            ->map(fn (Project $project) => [
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

    public function createAllowance()
    {
        $projects = Project::with(['division', 'pic', 'head'])
            ->where('status', 'active')
            ->get()
            ->map(fn (Project $project) => [
                'id' => $project->id,
                'name' => $project->name,
                'code' => $project->code,
                'allowance_budget' => (float) $project->allowance_budget,
                'used_allowance_budget' => 0,
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

    public function approvals()
    {
        return Inertia::render('Reimbursements/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReimbursementRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($code)
    {
        return Inertia::render('Reimbursements/Show', [
            'code' => $code,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reimbursement $reimbursement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReimbursementRequest $request, Reimbursement $reimbursement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reimbursement $reimbursement)
    {
        //
    }

    public function approve(Reimbursement $reimbursement)
    {
        // Logic to approve
        return back();
    }

    public function reject(Reimbursement $reimbursement)
    {
        // Logic to reject
        return back();
    }
}
