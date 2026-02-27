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

    payload.documents?.forEach((doc, index) => {
        fd.append(`documents[${index}][file]`, doc.file);
        fd.append(`documents[${index}][type]`, doc.type);
    });

    return fd;
}
