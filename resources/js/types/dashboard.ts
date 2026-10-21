export interface InternalProjectBudget {
    uuid: string;
    code: string | null;
    name: string;
    budget_total: number;
    pending_atr: number;
    used_eer: number;
    used_allowance: number;
    remaining_budget: number;
}

export interface ManagementBudgetOverview {
    total_management_budget: number;
    allocated_budget: number;
    available_budget: number;
    overallocated_budget: number;
    total_expenses: number;
    projects: InternalProjectBudget[];
}
