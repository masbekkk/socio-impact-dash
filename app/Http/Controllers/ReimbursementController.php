<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\V1\Reimbursement\ReimbursementResource;
use App\Models\Project;
use App\Models\Reimbursement;
use App\Services\ReimbursementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

final readonly class ReimbursementController
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
            'division_id' => $request->get('division_id'),
        ];

        $perPage = $request->integer('per_page', 10);
        $reimbursements = $this->reimbursementService->listReimbursements($user, $filters, $perPage);

        return Inertia::render('Reimbursements/Index', [
            'reimbursements' => ReimbursementResource::collection($reimbursements)->response()->getData(true),
            'filters' => [
                'type' => $request->get('type', ''),
                'status' => $request->get('status', ''),
                'search' => $request->get('search', ''),
                'start_date' => $request->get('start_date', ''),
                'end_date' => $request->get('end_date', ''),
                'sort_by' => $request->get('sort_by', 'created_at'),
                'sort_dir' => $request->get('sort_dir', 'desc'),
                'division_id' => $request->get('division_id', ''),
                'per_page' => $perPage,
            ],
            'divisions' => \App\Models\Division::with('divisionCode')->get(),
        ]);
    }

    public function createATR(Request $request): \Inertia\Response
    {
        $projects = Project::with(['division', 'pic', 'head', 'budgetDetails'])
            ->where('status', 'active')
            ->get()
            ->map(fn (Project $project): array => [
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
                'budget_details' => $project->budgetDetails->map(fn (\App\Models\ProjectBudgetDetail $detail): array => [
                    'id' => $detail->id,
                    'item_name' => $detail->item_name ?? $detail->notes ?? '-',
                    'notes' => $detail->notes,
                    'amount' => (float) $detail->amount,
                    'amount_pelaksanaan' => (float) $detail->amount_pelaksanaan,
                    'used_amount' => (float) $detail->used_amount,
                    'remaining_amount' => (float) $detail->remaining_amount,
                ])->values()->all(),
            ]);

        $approversGrouped = \App\Models\User::query()->role(['head', 'hr', 'finance', 'direktur'])
            ->get()
            ->groupBy(fn (\App\Models\User $user) => $user->roles->first()->name)
            ->map(fn (\Illuminate\Database\Eloquent\Collection $users) => $users->map(fn (\App\Models\User $u): array => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
            ])->values()->all());

        $user = $request->user();
        $user->load('division');

        return Inertia::render('Reimbursements/CreateATR', [
            'authUser' => [
                'name' => $user->name,
                'nip' => $user->nip ?? '-',
                'email' => $user->email,
                'division_name' => $user->division?->name ?? '-',
                'position' => $user->getRoleNames()->first() ?? '-',
                'join_date' => $user->created_at?->format('Y-m-d') ?? '-',
            ],
            'projects' => $projects,
            'approvers' => $approversGrouped,
            'expenseTypes' => array_map(fn (\App\Enums\ExpenseType $e): array => [
                'value' => $e->value,
                'label' => $e->value,
            ], \App\Enums\ExpenseType::cases()),
            'users' => \App\Models\User::query()->select('id', 'name', 'email', 'nip')->get(),
        ]);
    }

    public function createEER(Request $request): \Inertia\Response
    {
        $atrs = Reimbursement::with(['project.division', 'project.pic', 'project.head', 'approvals', 'items.budgetDetail'])
            ->where('user_id', $request->user()->id)
            ->where('type', 'atr')
            ->where('status', 'transferred')
            ->get()
            ->map(fn (Reimbursement $atr): array => [
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
                'items' => $atr->items->where('parent_item_id', null)->map(fn (\App\Models\ReimbursementItem $item): array => [
                    'id' => $item->id,
                    'item_name' => $item->item_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'amount' => (float) $item->amount,
                    'expense_type' => $item->expense_type?->value,
                    'activity_name' => $item->budgetDetail?->item_name ?? $item->budgetDetail?->notes ?? '-',
                    'activity_id' => $item->project_budget_detail_id,
                    'used_eer_amount' => (float) $item->children()->whereHas('reimbursement', function ($q): void {
                        $q->where('type', 'eer')->whereNotIn('status', ['rejected', 'draft']);
                    })->sum('amount'),
                ])->values()->all(),
            ]);

        $approversGrouped = \App\Models\User::query()->role(['head', 'hr', 'finance', 'direktur'])
            ->get()
            ->groupBy(fn (\App\Models\User $user) => $user->roles->first()->name)
            ->map(fn (\Illuminate\Database\Eloquent\Collection $users) => $users->map(fn (\App\Models\User $u): array => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
            ])->values()->all());

        $user = $request->user();
        $user->load('division');

        return Inertia::render('Reimbursements/CreateEER', [
            'authUser' => [
                'name' => $user->name,
                'nip' => $user->nip ?? '-',
                'email' => $user->email,
                'division_name' => $user->division?->name ?? '-',
                'position' => $user->getRoleNames()->first() ?? '-',
                'join_date' => $user->created_at?->format('Y-m-d') ?? '-',
            ],
            'atrs' => $atrs,
            'approvers' => $approversGrouped,
            'expenseTypes' => array_map(fn (\App\Enums\ExpenseType $e): array => [
                'value' => $e->value,
                'label' => $e->value,
            ], \App\Enums\ExpenseType::cases()),
            'users' => \App\Models\User::query()->select('id', 'name', 'email', 'nip')->get(),
        ]);
    }

    public function createAllowance(Request $request): \Inertia\Response
    {
        $projects = Project::with(['division', 'pic', 'head'])
            ->where('status', 'active')
            ->get()
            ->map(fn (Project $project): array => [
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
                'head' => \App\Models\User::query()->role('head')->get(['id', 'name', 'email']),
                'hr' => \App\Models\User::query()->role('hr')->get(['id', 'name', 'email']),
                'direktur' => \App\Models\User::query()->role('direktur')->get(['id', 'name', 'email']),
            ],
            'users' => \App\Models\User::query()->select('id', 'name', 'email', 'nip')->get(),
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
    public function store(): void
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int|string $id): \Inertia\Response
    {
        $projects = Project::query()->select('id', 'name', 'code', 'operational_budget', 'allowance_budget', 'division_id', 'pic_id')
            ->with(['division:id,name', 'pic:id,name'])
            ->get()
            ->map(fn ($project): array => [
                'id' => $project->id,
                'name' => $project->name,
                'code' => $project->code,
                'operational_budget' => (float) $project->operational_budget,
                'allowance_budget' => (float) $project->allowance_budget,
                'division_name' => $project->division?->name ?? 'Tidak ada divisi',
                'pic_name' => $project->pic?->name ?? 'Belum ada PIC',
            ]);

        $users = \App\Models\User::query()->select('id', 'name')->get();

        return Inertia::render('Reimbursements/Show', [
            'id' => $id,
            'projects' => $projects,
            'users' => $users,
            'expenseTypes' => collect(\App\Enums\ExpenseType::cases())->map(fn ($type): array => [
                'value' => $type->value,
                'label' => $type->value,
            ])->all(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id, Request $request): \Inertia\Response
    {
        $reimbursement = Reimbursement::with(['items.budgetDetail', 'project.division', 'project.pic', 'project.head', 'atrBudgetSelecteds.budgetDetail', 'approvals'])->findOrFail($id);
        $user = $request->user();

        // Security: only owner can edit draft
        if ($reimbursement->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        if ($reimbursement->status->value !== 'draft') {
            return Inertia::render('Reimbursements/Show', [
                'id' => $id,
                // Add any other props needed by Show.tsx if it's rendered directly
            ]);
        }

        $commonData = [
            'isEdit' => true,
            'reimbursement' => new ReimbursementResource($reimbursement),
            'expenseTypes' => array_map(fn (\App\Enums\ExpenseType $e): array => [
                'value' => $e->value,
                'label' => $e->value,
            ], \App\Enums\ExpenseType::cases()),
            'users' => \App\Models\User::query()->select('id', 'name', 'email', 'nip')->get(),
        ];

        if ($reimbursement->type->value === 'atr') {
            $projects = Project::with(['division', 'pic', 'head', 'budgetDetails'])
                ->where('status', 'active')
                ->get()
                ->map(fn (Project $project): array => [
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
                    'budget_details' => $project->budgetDetails->map(fn (\App\Models\ProjectBudgetDetail $detail): array => [
                        'id' => $detail->id,
                        'item_name' => $detail->item_name ?? $detail->notes ?? '-',
                        'notes' => $detail->notes,
                        'amount' => (float) $detail->amount,
                        'amount_pelaksanaan' => (float) $detail->amount_pelaksanaan,
                        'used_amount' => (float) $detail->used_amount,
                        'remaining_amount' => (float) $detail->remaining_amount,
                    ])->values()->all(),
                ]);

            $approversGrouped = \App\Models\User::query()->role(['head', 'hr', 'finance', 'direktur'])
                ->get()
                ->groupBy(fn (\App\Models\User $user) => $user->roles->first()->name)
                ->map(fn (\Illuminate\Database\Eloquent\Collection $users) => $users->map(fn (\App\Models\User $u): array => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                ])->values()->all());

            return Inertia::render('Reimbursements/CreateATR', array_merge($commonData, [
                'projects' => $projects,
                'approvers' => $approversGrouped,
            ]));
        }

        if ($reimbursement->type->value === 'eer') {
            $atrs = Reimbursement::with(['project.division', 'project.pic', 'project.head', 'approvals', 'items.budgetDetail'])
                ->where('user_id', $user->id)
                ->where('type', 'atr')
                ->where('status', 'transferred')
                ->get()
                ->map(fn (Reimbursement $atr): array => [
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
                    'items' => $atr->items->where('parent_item_id', null)->map(fn (\App\Models\ReimbursementItem $item): array => [
                        'id' => $item->id,
                        'item_name' => $item->item_name,
                        'quantity' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'amount' => (float) $item->amount,
                        'expense_type' => $item->expense_type?->value,
                        'activity_name' => $item->budgetDetail?->item_name ?? $item->budgetDetail?->notes ?? '-',
                        'activity_id' => $item->project_budget_detail_id,
                        'used_eer_amount' => (float) $item->children()->whereHas('reimbursement', function ($q): void {
                            $q->where('type', 'eer')->whereNotIn('status', ['rejected', 'draft']);
                        })->sum('amount'),
                    ])->values()->all(),
                ]);

            $approversGrouped = \App\Models\User::query()->role(['head', 'hr', 'finance', 'direktur'])
                ->get()
                ->groupBy(fn (\App\Models\User $user) => $user->roles->first()->name)
                ->map(fn (\Illuminate\Database\Eloquent\Collection $users) => $users->map(fn (\App\Models\User $u): array => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                ])->values()->all());

            return Inertia::render('Reimbursements/CreateEER', array_merge($commonData, [
                'atrs' => $atrs,
                'approvers' => $approversGrouped,
            ]));
        }

        if ($reimbursement->type->value === 'allowance') {
            $projects = Project::with(['division', 'pic', 'head'])
                ->where('status', 'active')
                ->get()
                ->map(fn (Project $project): array => [
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

            return Inertia::render('Reimbursements/CreateAllowance', array_merge($commonData, [
                'projects' => $projects,
                'approvers' => [
                    'head' => \App\Models\User::query()->role('head')->get(['id', 'name', 'email']),
                    'hr' => \App\Models\User::query()->role('hr')->get(['id', 'name', 'email']),
                    'direktur' => \App\Models\User::query()->role('direktur')->get(['id', 'name', 'email']),
                ],
                'authUser' => [
                    'name' => $user->name,
                    'nip' => $user->nip ?? '-',
                    'email' => $user->email,
                    'division_name' => $user->division?->name ?? '-',
                    'position' => $user->getRoleNames()->first() ?? '-',
                    'join_date' => $user->created_at?->format('Y-m-d') ?? '-',
                ],
            ]));
        }

        abort(404);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(): void
    {
        //
    }

    public function approve(): \Illuminate\Http\RedirectResponse
    {
        // Logic to approve
        return back();
    }

    public function reject(): \Illuminate\Http\RedirectResponse
    {
        // Logic to reject
        return back();
    }
}
