import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { storeReimbursement } from '@/services/reimbursement-service';
import type { Project, ProjectAutoFill, ReimbursementPayload } from '@/types/reimbursement';
import type { SharedData } from '@/types';

export function useReimbursementForm(projects: Project[]) {
    const { props } = usePage<SharedData>();
    const authUser = props.auth?.user;

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const getAutoFill = (projectId: string): ProjectAutoFill => {
        const selected = projects.find(p => p.id === parseInt(projectId));
        return {
            division: selected?.division_name ?? '',
            pic: selected?.pic_name ?? '',
            approver_name: selected?.head_name ?? '',
            approver_position: selected?.head_role ?? '',
            approver_email: selected?.head_email ?? '',
        };
    };

    const clearFieldError = (field: string) => {
        if (errors[field]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const submitReimbursement = async (payload: ReimbursementPayload): Promise<boolean> => {
        setLoading(true);
        setErrors({});

        try {
            await storeReimbursement(payload);
            router.visit('/reimbursements');
            return true;
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                setErrors({ _general: [error.response?.data?.message ?? 'Terjadi kesalahan saat menyimpan.'] });
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        authUser,
        loading,
        errors,
        setErrors,
        getAutoFill,
        clearFieldError,
        submitReimbursement,
    };
}
