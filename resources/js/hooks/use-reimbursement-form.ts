import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { storeReimbursement, resubmitReimbursement } from '@/services/reimbursement-service';
import type { Project, ProjectAutoFill, ReimbursementPayload } from '@/types/reimbursement';
import type { SharedData } from '@/types';

export function useReimbursementForm(projects: Project[]) {
    const { props } = usePage<SharedData>();
    const authUser = props.auth?.user;

    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
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
        setUploadProgress(0);
        setErrors({});

        const onUploadProgress = (progressEvent: any) => {
            if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        };

        try {
            if (payload.is_edit && payload.reimbursement_id) {
                await resubmitReimbursement(Number(payload.reimbursement_id), payload, onUploadProgress);
            } else {
                await storeReimbursement(payload, onUploadProgress);
            }
            router.visit('/reimbursements');
            return true;
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                setErrors({ _general: [error.response?.data?.message ?? 'Terjadi kesalahan saat menyimpan.'] });
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        authUser,
        loading,
        uploadProgress,
        errors,
        setErrors,
        getAutoFill,
        clearFieldError,
        submitReimbursement,
    };
}
