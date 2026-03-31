import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { r as resubmitReimbursement, s as storeReimbursement } from "./reimbursement-service-BqypCIIo.js";
function useReimbursementForm(projects) {
  const { props } = usePage();
  const authUser = props.auth?.user;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const getAutoFill = (projectId) => {
    const selected = projects.find((p) => p.id === parseInt(projectId));
    return {
      division: selected?.division_name ?? "",
      pic: selected?.pic_name ?? "",
      approver_name: selected?.head_name ?? "",
      approver_position: selected?.head_role ?? "",
      approver_email: selected?.head_email ?? ""
    };
  };
  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };
  const submitReimbursement = async (payload) => {
    setLoading(true);
    setErrors({});
    try {
      if (payload.is_edit && payload.reimbursement_id) {
        await resubmitReimbursement(Number(payload.reimbursement_id), payload);
      } else {
        await storeReimbursement(payload);
      }
      router.visit("/reimbursements");
      return true;
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors ?? {});
      } else {
        setErrors({ _general: [error.response?.data?.message ?? "Terjadi kesalahan saat menyimpan."] });
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
    submitReimbursement
  };
}
export {
  useReimbursementForm as u
};
