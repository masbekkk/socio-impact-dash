export interface Project {
    id: number;
    name: string;
    code: string;
    operational_budget?: number;
    used_operational_budget?: number;
    allowance_budget?: number;
    used_allowance_budget?: number;
    division_name: string;
    pic_name: string;
    head_name: string;
    head_email: string;
    head_role: string;
    budget_details?: {
        id: number;
        notes: string;
        amount: number;
    }[];
}

export interface ProjectAutoFill {
    division: string;
    pic: string;
    approver_name: string;
    approver_position: string;
    approver_email: string;
}

export type ReimbursementType = 'atr' | 'eer' | 'allowance';

export interface ReimbursementPayload {
    type: ReimbursementType;
    project_id?: string;
    amount?: number;
    bank_name?: string;
    bank_account?: string;
    account_holder?: string;
    usage_plan?: string;
    urgency?: string;
    eer_type?: string;
    documents?: { file: File; type: string }[];
    selected_budget_details?: {
        project_budget_detail_id: number;
        amount: number;
    }[];
}
