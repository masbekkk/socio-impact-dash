<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreReimbursementRequest;
use App\Http\Requests\UpdateReimbursementRequest;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Services\ReimbursementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

    public function createATR(Request $request): \Inertia\Response
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
                    'item_name' => $detail->item_name ?? $detail->notes ?? '-',
                    'notes' => $detail->notes,
                    'amount' => (float) $detail->amount,
                    'amount_pelaksanaan' => (float) $detail->amount_pelaksanaan,
                    'used_amount' => (float) $detail->used_amount,
                    'remaining_amount' => (float) $detail->remaining_amount,
                ])->values()->all(),
            ]);

        $approversGrouped = \App\Models\User::role(['head', 'hr', 'finance', 'direktur'])
            ->get()
            ->groupBy(fn (\App\Models\User $user) => $user->roles->first()->name)
            ->map(fn (\Illuminate\Database\Eloquent\Collection $users) => $users->map(fn (\App\Models\User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
            ])->values()->all());

        $user = $request->user();
        $user->load('division');

        return Inertia::render('Reimbursements/CreateATR', [
            'authUser' => [
                'name'          => $user->name,
                'nip'           => $user->nip ?? '-',
                'email'         => $user->email,
                'division_name' => $user->division?->name ?? '-',
                'position'      => $user->getRoleNames()->first() ?? '-',
                'join_date'     => $user->created_at?->format('Y-m-d') ?? '-',
            ],
            'projects' => $projects,
            'approvers' => $approversGrouped,
            'expenseTypes' => array_map(fn (\App\Enums\ExpenseType $e) => [
                'value' => $e->value,
                'label' => $e->value,
            ], \App\Enums\ExpenseType::cases()),
        ]);
    }

    public function createEER(Request $request): \Inertia\Response
    {
        $atrs = Reimbursement::with(['project.division', 'project.pic', 'project.head', 'approvals', 'items.budgetDetail'])
            ->where('user_id', $request->user()->id)
            ->where('type', 'atr')
            ->where('status', 'LIKE', '%approve%')
            ->get()
            ->map(fn (Reimbursement $atr) => [
                'id' => $atr->id,
                'code' => $atr->code,
                'amount' => (float) $atr->amount,
                'usage_plan' => $atr->usage_plan,
                'project_id' => $atr->project_id,
                'project_name' => $atr->project?->name ?? '-',
                'project_code' => $atr->project?->code ?? '-',
                'division_name' => $atr->project?->division?->name ?? '-',
                'pic_name' => $atr->project?->pic?->name ?? '-',
                'head_name' => $atr->project?->head?->name ?? '-',
                'head_email' => $atr->project?->head?->email ?? '-',
                'head_role' => $atr->project?->head?->role?->value ?? '-',
                'approver_head_id' => $atr->approvals->where('role', \App\Enums\ApprovalRole::Head)->first()?->approver_id,
                'approver_finance_id' => $atr->approvals->where('role', \App\Enums\ApprovalRole::Finance)->first()?->approver_id,
                'approver_direktur_id' => $atr->approvals->where('role', 'direktur')->first()?->approver_id,
                'items' => $atr->items->where('parent_item_id', null)->map(fn (\App\Models\ReimbursementItem $item) => [
                    'id' => $item->id,
                    'item_name' => $item->item_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'amount' => (float) $item->amount,
                    'expense_type' => $item->expense_type?->value,
                    'activity_name' => $item->budgetDetail?->item_name ?? $item->budgetDetail?->notes ?? '-',
                    'activity_id' => $item->project_budget_detail_id,
                    'used_eer_amount' => (float) $item->children()->whereHas('reimbursement', function ($q) {
                        $q->where('type', 'eer')->whereNotIn('status', ['rejected', 'draft']);
                    })->sum('amount'),
                ])->values()->all(),
            ]);

        $approversGrouped = \App\Models\User::role(['head', 'hr', 'finance', 'direktur'])
            ->get()
            ->groupBy(fn (\App\Models\User $user) => $user->roles->first()->name)
            ->map(fn (\Illuminate\Database\Eloquent\Collection $users) => $users->map(fn (\App\Models\User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
            ])->values()->all());

        $user = $request->user();
        $user->load('division');

        return Inertia::render('Reimbursements/CreateEER', [
            'authUser' => [
                'name'          => $user->name,
                'nip'           => $user->nip ?? '-',
                'email'         => $user->email,
                'division_name' => $user->division?->name ?? '-',
                'position'      => $user->getRoleNames()->first() ?? '-',
                'join_date'     => $user->created_at?->format('Y-m-d') ?? '-',
            ],
            'atrs' => $atrs,
            'approvers' => $approversGrouped,
            'expenseTypes' => array_map(fn (\App\Enums\ExpenseType $e) => [
                'value' => $e->value,
                'label' => $e->value,
            ], \App\Enums\ExpenseType::cases()),
        ]);
    }

    public function createAllowance(Request $request): \Inertia\Response
    {
        $projects = Project::with(['division', 'pic', 'head'])
            ->where('status', 'active')
            ->get()
            ->map(fn (Project $project) => [
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

        $user = $request->user();
        $user->load('division');

        return Inertia::render('Reimbursements/CreateAllowance', [
            'authUser' => [
                'name' => $user->name,
                'nip' => $user->nip ?? '-',
                'email' => $user->email,
                'division_name' => $user->division?->name ?? '-',
                'position' => $user->getRoleNames()->first() ?? '-',
                'join_date' => $user->created_at?->format('Y-m-d') ?? '-',
            ],
            'projects' => $projects,
            'approvers' => [
                'head' => \App\Models\User::role('head')->get(['id', 'name', 'email']),
                'hr' => \App\Models\User::role('hr')->get(['id', 'name', 'email']),
                'direktur' => \App\Models\User::role('direktur')->get(['id', 'name', 'email']),
            ],
            'users' => \App\Models\User::where('id', '!=', $user->id)->get(['id', 'name', 'email']),
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
