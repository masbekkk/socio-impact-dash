import axios from 'axios';
import type { ReimbursementPayload } from '@/types/reimbursement';

const API_URL = '/api/v1/reimbursements';

export async function storeReimbursement(payload: ReimbursementPayload): Promise<any> {
    const formData = buildFormData(payload);

    const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
}

function buildFormData(payload: ReimbursementPayload): FormData {
    const fd = new FormData();

    fd.append('type', payload.type);

    if (payload.project_id) fd.append('project_id', payload.project_id);
    if (payload.amount) fd.append('amount', payload.amount.toString());
    if (payload.bank_name) fd.append('bank_name', payload.bank_name);
    if (payload.bank_account) fd.append('bank_account', payload.bank_account);
    if (payload.account_holder) fd.append('account_holder', payload.account_holder);
    if (payload.usage_plan) fd.append('usage_plan', payload.usage_plan);
    if (payload.urgency) fd.append('urgency', payload.urgency);
    if (payload.eer_type) fd.append('eer_type', payload.eer_type);
    if (payload.atr_id) fd.append('atr_id', payload.atr_id.toString());
    if (payload.approver_head_id) fd.append('approver_head_id', payload.approver_head_id);
    if (payload.approver_finance_id) fd.append('approver_finance_id', payload.approver_finance_id);
    if (payload.approver_direktur_id) fd.append('approver_direktur_id', payload.approver_direktur_id);
    if (payload.approver_hr_id) fd.append('approver_hr_id', payload.approver_hr_id);
    if (payload.start_date) fd.append('start_date', payload.start_date);
    if (payload.end_date) fd.append('end_date', payload.end_date);
    if (payload.replacement_pic_id) fd.append('replacement_pic_id', payload.replacement_pic_id);

    payload.documents?.forEach((doc, index) => {
        fd.append(`documents[${index}][file]`, doc.file);
        fd.append(`documents[${index}][type]`, doc.type);
    });

    payload.selected_budget_details?.forEach((budget, index) => {
        fd.append(`selected_budget_details[${index}][project_budget_detail_id]`, budget.project_budget_detail_id.toString());
        fd.append(`selected_budget_details[${index}][amount]`, budget.amount.toString());
    });

    payload.items?.forEach((item, index) => {
        fd.append(`items[${index}][project_budget_detail_id]`, item.project_budget_detail_id.toString());
        fd.append(`items[${index}][item_name]`, item.item_name);
        fd.append(`items[${index}][quantity]`, item.quantity.toString());
        fd.append(`items[${index}][unit_price]`, item.unit_price.toString());
        fd.append(`items[${index}][amount]`, item.amount.toString());
        if (item.parent_item_id) fd.append(`items[${index}][parent_item_id]`, item.parent_item_id.toString());
        if (item.expense_type) fd.append(`items[${index}][expense_type]`, item.expense_type);
        if (item.receipt) fd.append(`items[${index}][receipt]`, item.receipt);
        if (item.notes) fd.append(`items[${index}][notes]`, item.notes);
    });

    return fd;
}
