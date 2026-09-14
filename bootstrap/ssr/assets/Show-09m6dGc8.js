import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { A as AppSidebarLayout, g as Avatar, h as AvatarFallback } from "./app-sidebar-layout-BRoV_jj3.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-DAjHeOuX.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
import { M as MoneyInput } from "./MoneyInput-Y8EKpX5J.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { D as DatePicker } from "./DatePicker-DtmT1I-q.js";
import { S as Separator } from "./separator-CjIBof9L.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { R as RadioGroup, a as RadioGroupItem } from "./radio-group-fhmmkZJ4.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { S as ScrollArea } from "./scroll-area-BShF3M_R.js";
import { Loader2, FileText, ArrowLeft, XCircle, AlertCircle, CheckCircle, DollarSign, Clock, Plus, Calendar, Briefcase, Building2, ChevronUp, ChevronDown, X, Upload, Receipt, Download, FileSpreadsheet, CreditCard, Edit, Info, Image, User } from "lucide-react";
import { F as FileUploadDropzone } from "./FileUploadDropzone-BPjPwanR.js";
import { u as updateItemReceipt, r as resubmitReimbursement } from "./reimbursement-service-CMPJzIka.js";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "clsx";
import "tailwind-merge";
import "react-number-format";
import "@radix-ui/react-separator";
import "radix-ui";
import "@radix-ui/react-label";
import "@radix-ui/react-popover";
const STATUS_CONFIG = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700 border-gray-200", icon: FileText },
  submitted: { label: "Diajukan", className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  approved: { label: "Disetujui", className: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  head_approved: { label: "Head Approved", className: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100", icon: CheckCircle },
  hr_approved: { label: "HR Approved", className: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100", icon: CheckCircle },
  finance_approved: { label: "Finance Approved", className: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100", icon: CheckCircle },
  request_fund: { label: "Request Fund", className: "bg-orange-50 text-orange-600 hover:bg-orange-50 border-orange-100", icon: DollarSign },
  transferred: { label: "Sudah Ditransfer", className: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle },
  closed: { label: "Ditutup", className: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: CheckCircle },
  revision: { label: "Revisi", className: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertCircle },
  rejected: { label: "Ditolak", className: "bg-red-100 text-red-700 border-red-200", icon: XCircle }
};
const TYPE_LABELS = {
  atr: "Advance Travel Request",
  eer: "Employee Expense Report",
  allowance: "Allowance"
};
const URGENCY_LABELS = {
  mendesak: { label: "Mendesak", variant: "destructive" },
  tinggi: { label: "Tinggi", variant: "destructive" },
  normal: { label: "Normal", variant: "default" },
  rendah: { label: "Rendah", variant: "outline" }
};
function Show() {
  const {
    id: id$1,
    auth,
    expenseTypes = [],
    projects: propsProjects = [],
    users: propsUsers = [],
    approvers: propsApprovers = {}
  } = usePage().props;
  const [projects, setProjects] = useState(propsProjects);
  const [users, setUsers] = useState(propsUsers);
  const [approvers, setApprovers] = useState(propsApprovers);
  const { hasRole, hasPermission } = usePermission();
  auth?.user?.role_name || "pegawai";
  const userId = auth?.user?.id || 0;
  const [data, setData] = useState(null);
  const totalEerSpent = useMemo(() => {
    if (!data || data.type !== "eer") return 0;
    return (data.items || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [data]);
  const totalAtrAmount = useMemo(() => {
    if (!data || data.type !== "eer") return 0;
    return data.atr_items?.total_amount || 0;
  }, [data]);
  const eerDifference = useMemo(() => {
    return Math.abs(totalAtrAmount - totalEerSpent);
  }, [totalAtrAmount, totalEerSpent]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [revisiDialogOpen, setRevisiDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadingItemId, setUploadingItemId] = useState(null);
  const handleItemReceiptUpload = async (itemId, file) => {
    if (!data) return;
    try {
      setActionLoading(true);
      await updateItemReceipt(data.id, itemId, file);
      window.location.reload();
    } catch (error2) {
      console.error("Failed to upload receipt:", error2);
      alert("Gagal mengupload kwitansi. Silakan coba lagi.");
    } finally {
      setActionLoading(false);
      setUploadingItemId(null);
    }
  };
  const [rejectionReason, setRejectionReason] = useState("");
  const [revisiReason, setRevisiReason] = useState("");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferProof, setTransferProof] = useState(null);
  const [transferredAmount, setTransferredAmount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentImage, setCommentImage] = useState(null);
  const [commentImagePreview, setCommentImagePreview] = useState(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetEdits, setBudgetEdits] = useState({});
  const [pendingAllowanceAmount, setPendingAllowanceAmount] = useState(0);
  const [savingBudget, setSavingBudget] = useState(false);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [savingCode, setSavingCode] = useState(false);
  const [revisionEditing, setRevisionEditing] = useState(false);
  const [revisionForm, setRevisionForm] = useState({
    project_id: "",
    replacement_pic_id: "",
    urgency: "normal",
    usage_plan: "",
    start_date: "",
    end_date: "",
    start_time: "08:00",
    end_time: "17:00",
    revision_note: "",
    approver_head_id: "",
    eer_type: "refund",
    refund_reimburse_amount: 0,
    selected_activities: [],
    eer_items: [],
    notes: "",
    transfer_proof: null,
    documents: []
  });
  const [resubmitLoading, setResubmitLoading] = useState(false);
  hasRole("pegawai") && !hasRole("superadmin");
  const canEditBudget = hasPermission("edit_atr_budget") || hasRole(["finance", "superadmin"]);
  const isCreator = data?.user?.id === userId;
  const isRevisionStatus = data?.status === "revision";
  const isFinanceOrAdmin = hasRole(["finance", "superadmin"]);
  const isHrOrAdmin = hasRole(["hr", "superadmin"]);
  const [editingPartitions, setEditingPartitions] = useState(false);
  const [partitionOps, setPartitionOps] = useState(0);
  const [partitionMgmt, setPartitionMgmt] = useState(0);
  const [partitionAllow, setPartitionAllow] = useState(0);
  const [savingPartitions, setSavingPartitions] = useState(false);
  const commentsEndRef = useRef(null);
  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/reimbursements/${id$1}`);
      setData(response.data.data);
      if (response.data.projects) setProjects(response.data.projects);
      if (response.data.users) setUsers(response.data.users);
      if (response.data.approvers) setApprovers(response.data.approvers);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("Data pengajuan tidak ditemukan.");
      } else {
        setError("Terjadi kesalahan saat mengambil data.");
      }
    } finally {
      setLoading(false);
    }
  }, [id$1]);
  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.comments]);
  useEffect(() => {
    if (data?.type === "eer" && data?.atr_items?.total_amount !== void 0) {
      const totalClaim = revisionForm.eer_items.reduce((sum, item) => sum + (item.amount || 0), 0);
      const atrTotal = data.atr_items.total_amount;
      const diff = totalClaim - atrTotal;
      let newType = "balance";
      if (diff > 0) newType = "reimbursement";
      else if (diff < 0) newType = "refund";
      const newAmount = Math.abs(diff);
      if (revisionForm.eer_type !== newType || revisionForm.refund_reimburse_amount !== newAmount) {
        setRevisionForm((prev) => ({
          ...prev,
          eer_type: newType,
          refund_reimburse_amount: newAmount
        }));
      }
    }
  }, [revisionForm.eer_items, data?.atr_items?.total_amount, data?.type]);
  const getCurrentUserRole = () => {
    if (!auth?.user?.role_name) return "pegawai";
    const roles = auth.user.role_name.split(",").map((r) => r.trim());
    if (roles.includes("superadmin")) return "superadmin";
    if (roles.includes("direktur")) return "direktur";
    if (roles.includes("finance")) return "finance";
    if (roles.includes("hr")) return "hr";
    if (roles.includes("head")) return "head";
    return roles[0] || "pegawai";
  };
  const resetApproveDialog = () => {
    setApproveDialogOpen(false);
  };
  const resetRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectionReason("");
  };
  const resetRevisiDialog = () => {
    setRevisiDialogOpen(false);
    setRevisiReason("");
  };
  const resetTransferDialog = () => {
    setTransferDialogOpen(false);
    setTransferProof(null);
    setTransferredAmount(0);
  };
  const handleRequestFund = async () => {
    if (!data) return;
    setActionLoading(true);
    try {
      const role = getCurrentUserRole();
      const payload = { action: "request_fund" };
      if (role) payload.role = role;
      await axios.post(`/api/v1/reimbursements/${data.id}/status`, payload);
      await fetchDetail();
    } catch {
      alert("Gagal memproses request fund.");
    } finally {
      setActionLoading(false);
    }
  };
  const handleApprove = async () => {
    if (!data) return;
    setActionLoading(true);
    try {
      const role = getCurrentUserRole();
      const payload = { action: "approved" };
      if (role) payload.role = role;
      if (role === "hr" && data.type === "allowance") {
        payload.amount = pendingAllowanceAmount;
      }
      await axios.post(`/api/v1/reimbursements/${data.id}/status`, payload);
      resetApproveDialog();
      await fetchDetail();
    } catch {
      alert("Gagal menyetujui pengajuan.");
    } finally {
      setActionLoading(false);
    }
  };
  const handleReject = async () => {
    if (!data || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      const role = getCurrentUserRole();
      const payload = {
        action: "rejected",
        notes: rejectionReason,
        role
      };
      if (role) payload.role = role;
      await axios.post(`/api/v1/reimbursements/${data.id}/status`, payload);
      resetRejectDialog();
      await fetchDetail();
    } catch {
      alert("Gagal menolak pengajuan.");
    } finally {
      setActionLoading(false);
    }
  };
  const handleRevisi = async () => {
    if (!data || !revisiReason.trim()) return;
    setActionLoading(true);
    try {
      const role = getCurrentUserRole();
      const payload = {
        action: "revision",
        notes: revisiReason,
        role
      };
      if (role) payload.role = role;
      await axios.post(`/api/v1/reimbursements/${data.id}/status`, payload);
      resetRevisiDialog();
      await fetchDetail();
    } catch {
      alert("Gagal meminta revisi.");
    } finally {
      setActionLoading(false);
    }
  };
  const handleTransfer = async () => {
    if (!data || !transferProof && !data?.transfer_proof_path && data?.type?.toLowerCase() !== "allowance") return;
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("action", "transferred");
      if (transferProof) formData.append("transfer_proof", transferProof);
      const finalTransferredAmount = transferredAmount || (data?.amount ?? 0);
      if (finalTransferredAmount > 0) formData.append("transferred_amount", finalTransferredAmount.toString());
      const role = getCurrentUserRole();
      if (role) formData.append("role", role);
      await axios.post(`/api/v1/reimbursements/${data.id}/status`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      resetTransferDialog();
      await fetchDetail();
    } catch {
      alert("Gagal menyelesaikan transfer.");
    } finally {
      setActionLoading(false);
    }
  };
  const handleCommentImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCommentImage(file);
      setCommentImagePreview(URL.createObjectURL(file));
    }
  };
  const removeCommentImage = () => {
    setCommentImage(null);
    if (commentImagePreview) {
      URL.revokeObjectURL(commentImagePreview);
      setCommentImagePreview(null);
    }
  };
  const submitComment = async () => {
    if (!data) return;
    if (!newComment.trim() && !commentImage) return;
    setCommentLoading(true);
    try {
      const formData = new FormData();
      if (newComment.trim()) {
        formData.append("comment", newComment);
      }
      if (commentImage) {
        formData.append("image", commentImage);
      }
      await axios.post(`/api/v1/reimbursements/${data.id}/comments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setNewComment("");
      setCommentImage(null);
      if (commentImagePreview) {
        URL.revokeObjectURL(commentImagePreview);
        setCommentImagePreview(null);
      }
      await fetchDetail();
    } catch {
      alert("Gagal mengirim komentar.");
    } finally {
      setCommentLoading(false);
    }
  };
  const handleEditBudgetClick = () => {
    if (data?.atr_budget_selecteds) {
      const edits = {};
      data.atr_budget_selecteds.forEach((b) => {
        edits[b.id] = b.amount;
      });
      setBudgetEdits(edits);
    }
    setIsEditingBudget(true);
  };
  const handleSaveBudgets = async () => {
    if (!data) return;
    setSavingBudget(true);
    try {
      const payload = {
        budgets: Object.entries(budgetEdits).map(([id2, amount]) => ({
          id: parseInt(id2),
          amount
        }))
      };
      await axios.post(`/api/v1/reimbursements/${data.id}/budgets`, payload);
      setIsEditingBudget(false);
      await fetchDetail();
    } catch {
      alert("Gagal menyimpan perubahan budget.");
    } finally {
      setSavingBudget(false);
    }
  };
  const handleUpdateCode = async () => {
    if (!data || !newCode.trim()) return;
    setSavingCode(true);
    try {
      await axios.patch(`/api/v1/reimbursements/${data.id}/code`, {
        code: newCode.trim()
      });
      setIsEditingCode(false);
      await fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengupdate kode reimbursement.");
    } finally {
      setSavingCode(false);
    }
  };
  const handleStartRevisionEdit = () => {
    if (!data) return;
    const selected_activities = [];
    const eer_items = [];
    if (data.type === "eer") {
      (data.items ?? []).forEach((item) => {
        eer_items.push({
          id: item.id,
          project_budget_detail_id: item.activity_id,
          item_name: item.item_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
          expense_type: item.expense_type ?? "",
          receipt: null,
          receipt_path: item.receipt_path,
          notes: item.notes ?? ""
        });
      });
      if (eer_items.length === 0) {
        eer_items.push({
          id: crypto.randomUUID(),
          project_budget_detail_id: "",
          item_name: "",
          quantity: 1,
          unit_price: 0,
          amount: 0,
          expense_type: "",
          receipt: null,
          notes: ""
        });
      }
    } else {
      if (data.atr_budget_selecteds) {
        data.atr_budget_selecteds.forEach((abs) => {
          const children = (data.items ?? []).filter((item) => item.activity_id === abs.project_budget_detail_id && !item.parent_item_id).map((item) => ({
            id: item.id,
            item_name: item.item_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
            expense_type: item.expense_type ?? "",
            receipt: null,
            receipt_path: item.receipt_path,
            notes: item.notes ?? ""
          }));
          selected_activities.push({
            budget_detail_id: abs.project_budget_detail_id,
            expanded: true,
            activity_name: abs.activity_name,
            detail_aktivitas: abs.notes ?? "",
            children: children.length > 0 ? children : [{
              id: crypto.randomUUID(),
              item_name: "",
              quantity: 1,
              unit_price: 0,
              amount: 0,
              expense_type: "",
              receipt: null,
              notes: ""
            }]
          });
        });
      }
    }
    setRevisionForm({
      project_id: data.project?.id?.toString() ?? "",
      replacement_pic_id: "",
      urgency: data.urgency ?? "normal",
      usage_plan: data.usage_plan ?? "",
      start_date: data.start_date ?? "",
      end_date: data.end_date ?? "",
      start_time: data.start_time ?? "08:00",
      end_time: data.end_time ?? "17:00",
      revision_note: "",
      approver_head_id: data.approvals?.find((a) => a.role === "head")?.approver_id?.toString() ?? "",
      eer_type: data.eer_type ?? "refund",
      refund_reimburse_amount: data.refund_reimburse_amount ?? 0,
      selected_activities,
      eer_items,
      notes: data.notes ?? "",
      transfer_proof: null,
      documents: data.documents ? data.documents.map((d) => ({
        id: crypto.randomUUID(),
        db_id: d.id,
        type: d.type || "other",
        file: null,
        original_name: d.original_name
      })) : []
    });
    setRevisionEditing(true);
  };
  const handleExcelChangeRevision = (file) => {
    setRevisionForm((prev) => {
      const filtered = prev.documents.filter((d) => d.type !== "excel");
      if (file) {
        return {
          ...prev,
          documents: [...filtered, { id: crypto.randomUUID(), type: "excel", file, original_name: file.name }]
        };
      }
      return {
        ...prev,
        documents: filtered
      };
    });
  };
  const handleNominalChangeRevision = (value) => {
    setRevisionForm((prev) => {
      let budgetDetailId = "";
      if (data?.items && data.items[0]) {
        budgetDetailId = data.items[0].activity_id;
      }
      const firstItem = prev.eer_items[0] || {
        id: crypto.randomUUID(),
        project_budget_detail_id: budgetDetailId,
        item_name: "Pengeluaran EER",
        quantity: 1,
        unit_price: 0,
        amount: 0,
        expense_type: data?.items?.[0]?.expense_type || "other",
        receipt: null,
        notes: ""
      };
      return {
        ...prev,
        eer_items: [{
          ...firstItem,
          unit_price: value,
          amount: value
        }]
      };
    });
  };
  const updateItemEerRevision = (id2, field, value) => {
    setRevisionForm((prev) => ({
      ...prev,
      eer_items: prev.eer_items.map((item) => {
        if (item.id !== id2) return item;
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unit_price") {
          updated.amount = (Number(updated.quantity) || 0) * (Number(updated.unit_price) || 0);
        }
        return updated;
      })
    }));
  };
  const handleResubmitRevision = async () => {
    if (!data) return;
    if (data.type === "eer") {
      const firstItem = revisionForm.eer_items[0];
      if (!firstItem || firstItem.amount <= 0) {
        alert("Nominal pengeluaran wajib diisi dan harus lebih besar dari 0.");
        return;
      }
      if (!firstItem.receipt && !firstItem.receipt_path) {
        alert("Kwitansi / Bukti Pembayaran wajib diunggah.");
        return;
      }
      const excelDoc = revisionForm.documents.find((d) => d.type === "excel");
      if (!excelDoc || !excelDoc.file && !excelDoc.original_name) {
        alert("File Excel (Detail Breakdown) wajib diunggah.");
        return;
      }
    } else {
      for (const act of revisionForm.selected_activities) {
        if (act.children.length === 0) {
          alert("Setiap kegiatan minimal harus memiliki 1 item.");
          return;
        }
        for (const child of act.children) {
          if (!child.item_name.trim()) {
            alert("Nama item tidak boleh kosong.");
            return;
          }
        }
      }
    }
    setResubmitLoading(true);
    try {
      const items = [];
      const selected_budget_details = [];
      const payload = {
        action: "revision",
        ...revisionForm.project_id && { project_id: revisionForm.project_id },
        ...revisionForm.replacement_pic_id && { replacement_pic_id: revisionForm.replacement_pic_id },
        ...revisionForm.urgency && { urgency: revisionForm.urgency }
      };
      if (data.type === "eer") {
        const totalsByActivity = {};
        revisionForm.eer_items.forEach((item) => {
          items.push({
            project_budget_detail_id: item.project_budget_detail_id,
            item_name: item.item_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
            expense_type: item.expense_type,
            receipt: item.receipt ?? void 0,
            receipt_path: item.receipt_path ?? void 0,
            notes: item.notes
          });
          const actId = Number(item.project_budget_detail_id);
          totalsByActivity[actId] = (totalsByActivity[actId] || 0) + item.amount;
        });
        Object.entries(totalsByActivity).forEach(([actId, total]) => {
          selected_budget_details.push({
            project_budget_detail_id: Number(actId),
            amount: total,
            notes: ""
            // Legacy notes not needed here
          });
        });
      } else {
        revisionForm.selected_activities.forEach((act) => {
          let actTotal = 0;
          act.children.forEach((child) => {
            items.push({
              project_budget_detail_id: act.budget_detail_id,
              item_name: child.item_name,
              quantity: child.quantity,
              unit_price: child.unit_price,
              amount: child.quantity * child.unit_price,
              expense_type: child.expense_type,
              receipt: child.receipt ?? void 0,
              receipt_path: child.receipt_path ?? void 0,
              notes: child.notes
            });
            actTotal += child.quantity * child.unit_price;
          });
          selected_budget_details.push({
            project_budget_detail_id: act.budget_detail_id,
            amount: actTotal,
            notes: act.detail_aktivitas
          });
        });
      }
      const resubmitData = {
        action: "revision",
        type: data.type,
        ...revisionForm.project_id && { project_id: revisionForm.project_id },
        ...revisionForm.replacement_pic_id && { replacement_pic_id: revisionForm.replacement_pic_id },
        ...revisionForm.approver_head_id && { approver_head_id: revisionForm.approver_head_id },
        ...revisionForm.urgency && { urgency: revisionForm.urgency },
        usage_plan: revisionForm.notes,
        start_date: revisionForm.start_date || null,
        end_date: revisionForm.end_date || null,
        revision_note: revisionForm.revision_note || "Pengajuan telah direvisi dan diajukan kembali.",
        eer_type: data.type === "eer" ? revisionForm.eer_type : void 0,
        refund_reimburse_amount: data.type === "eer" ? revisionForm.refund_reimburse_amount : void 0,
        ...data.type === "eer" && revisionForm.eer_type === "refund" && revisionForm.transfer_proof && { transfer_proof: revisionForm.transfer_proof },
        documents: revisionForm.documents.map((d) => ({
          ...d.db_id ? { id: d.db_id } : {},
          type: d.type,
          file: d.file || void 0
        }))
      };
      if (data.type === "eer") {
        Object.assign(resubmitData, { items });
      } else {
        Object.assign(resubmitData, { selected_budget_details, items });
      }
      await resubmitReimbursement(data.id, resubmitData);
      setRevisionEditing(false);
      await fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengirim ulang revisi.");
    } finally {
      setResubmitLoading(false);
    }
  };
  const addChildItemRevision = (budgetDetailId) => {
    setRevisionForm((prev) => ({
      ...prev,
      selected_activities: prev.selected_activities.map((a) => {
        if (a.budget_detail_id !== budgetDetailId) return a;
        return {
          ...a,
          children: [...a.children, {
            id: crypto.randomUUID(),
            item_name: "",
            quantity: 1,
            unit_price: 0,
            amount: 0,
            expense_type: "",
            receipt: null,
            notes: ""
          }]
        };
      })
    }));
  };
  const removeChildItemRevision = (budgetDetailId, itemId) => {
    setRevisionForm((prev) => ({
      ...prev,
      selected_activities: prev.selected_activities.map((a) => {
        if (a.budget_detail_id !== budgetDetailId) return a;
        return {
          ...a,
          children: a.children.filter((c) => c.id !== itemId)
        };
      })
    }));
  };
  const updateChildItemRevision = (budgetDetailId, itemId, field, value) => {
    setRevisionForm((prev) => ({
      ...prev,
      selected_activities: prev.selected_activities.map((a) => {
        if (a.budget_detail_id !== budgetDetailId) return a;
        return {
          ...a,
          children: a.children.map((c) => {
            if (c.id !== itemId) return c;
            const updated = { ...c, [field]: value };
            if (field === "quantity" || field === "unit_price") {
              updated.amount = updated.quantity * updated.unit_price;
            }
            return updated;
          })
        };
      })
    }));
  };
  const updateActivityDetailRevision = (budgetDetailId, detail) => {
    setRevisionForm((prev) => ({
      ...prev,
      selected_activities: prev.selected_activities.map(
        (a) => a.budget_detail_id === budgetDetailId ? { ...a, detail_aktivitas: detail } : a
      )
    }));
  };
  const toggleActivityRevision = (budgetDetailId) => {
    setRevisionForm((prev) => ({
      ...prev,
      selected_activities: prev.selected_activities.map(
        (a) => a.budget_detail_id === budgetDetailId ? { ...a, expanded: !a.expanded } : a
      )
    }));
  };
  const addActivityRevision = (budgetDetailId) => {
    if (revisionForm.selected_activities.find((a) => a.budget_detail_id === budgetDetailId)) return;
    const activity = data?.project?.budget_details?.find((bd) => bd.id === budgetDetailId);
    if (!activity) return;
    setRevisionForm((prev) => ({
      ...prev,
      selected_activities: [...prev.selected_activities, {
        budget_detail_id: budgetDetailId,
        expanded: true,
        activity_name: activity.item_name,
        detail_aktivitas: "",
        children: [{
          id: crypto.randomUUID(),
          item_name: "",
          quantity: 1,
          unit_price: 0,
          amount: 0,
          expense_type: "",
          receipt: null,
          notes: ""
        }]
      }]
    }));
  };
  const removeActivityRevision = (budgetDetailId) => {
    setRevisionForm((prev) => ({
      ...prev,
      selected_activities: prev.selected_activities.filter((a) => a.budget_detail_id !== budgetDetailId)
    }));
  };
  const availableActivitiesRevision = React__default.useMemo(() => {
    if (!data?.project?.budget_details) return [];
    return data.project.budget_details.filter(
      (bd) => !revisionForm.selected_activities.find((a) => a.budget_detail_id === bd.id) && bd.remaining_amount > 0
    );
  }, [data?.project?.budget_details, revisionForm.selected_activities]);
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Keuangan", href: "/reimbursements" },
    { title: data ? `Detail ${data.type.toUpperCase()}` : "Detail", href: "#" }
  ];
  if (loading) {
    return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
      /* @__PURE__ */ jsx(Head, { title: "Detail Keuangan" }),
      /* @__PURE__ */ jsxs("div", { className: "flex h-[50vh] flex-col items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Memuat data..." })
      ] })
    ] });
  }
  if (error || !data) {
    return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
      /* @__PURE__ */ jsx(Head, { title: "Detail Keuangan" }),
      /* @__PURE__ */ jsxs("div", { className: "flex h-[50vh] flex-col items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-muted p-4 rounded-full", children: /* @__PURE__ */ jsx(FileText, { className: "h-8 w-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-muted-foreground", children: error ?? "Data tidak ditemukan" }),
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxs(Link, { href: "/reimbursements", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          " Kembali ke Daftar"
        ] }) })
      ] })
    ] });
  }
  const statusCfg = STATUS_CONFIG[data.status] ?? { label: data.status, className: "bg-gray-100 text-gray-600", icon: Clock };
  const StatusIcon = statusCfg.icon;
  const canApproveReject = data.can_approve;
  const formatTime = (time) => {
    if (!time) return null;
    const [hour, minute] = time.split(":");
    return `${hour}:${minute}`;
  };
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: `Detail ${data.type.toUpperCase()} - ${data.code}` }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 space-y-6 w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", asChild: true, className: "h-10 w-10", children: /* @__PURE__ */ jsx(Link, { href: "/reimbursements", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-tight", children: [
                "Detail ",
                TYPE_LABELS[data.type] ?? data.type.toUpperCase()
              ] }),
              /* @__PURE__ */ jsxs(Badge, { className: `gap-1 px-3 py-1 ${statusCfg.className}`, children: [
                /* @__PURE__ */ jsx(StatusIcon, { className: "h-3.5 w-3.5" }),
                statusCfg.label
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground mt-1 text-sm font-mono", children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }),
              isEditingCode ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: newCode,
                    onChange: (e) => setNewCode(e.target.value),
                    className: "h-7 w-48 text-xs font-mono",
                    placeholder: "Nomor baru..."
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    className: "h-7 px-2",
                    onClick: handleUpdateCode,
                    disabled: savingCode,
                    children: savingCode ? /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin" }) : "Simpan"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    className: "h-7 px-2",
                    onClick: () => setIsEditingCode(false),
                    disabled: savingCode,
                    children: "Batal"
                  }
                )
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                data.code,
                isFinanceOrAdmin && /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "h-6 w-6 p-0 ml-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50",
                    onClick: () => {
                      setNewCode(data.code);
                      setIsEditingCode(true);
                    },
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3 rotate-45" }),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Edit Code" }),
                      /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-pencil", children: [
                        /* @__PURE__ */ jsx("path", { d: "M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }),
                        /* @__PURE__ */ jsx("path", { d: "m15 5 4 4" })
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("span", { className: "mx-1", children: "•" }),
              /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5" }),
              format(new Date(data.created_at), "dd MMMM yyyy, HH:mm", { locale: id })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          canApproveReject && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700",
                onClick: () => setRejectDialogOpen(true),
                children: [
                  /* @__PURE__ */ jsx(XCircle, { className: "mr-2 h-4 w-4" }),
                  " Tolak"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: "border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700",
                onClick: () => setRevisiDialogOpen(true),
                children: [
                  /* @__PURE__ */ jsx(AlertCircle, { className: "mr-2 h-4 w-4" }),
                  " Revisi"
                ]
              }
            ),
            hasRole("finance") && !hasRole("direktur") && (data.status === "head_approved" || data.type === "allowance" && data.status === "hr_approved") ? /* @__PURE__ */ jsxs(
              Button,
              {
                className: "bg-indigo-600 hover:bg-indigo-700 text-white",
                onClick: () => setApproveDialogOpen(true),
                disabled: actionLoading,
                children: [
                  actionLoading ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle, { className: "mr-2 h-4 w-4" }),
                  "Finance Approved"
                ]
              }
            ) : /* @__PURE__ */ jsxs(
              Button,
              {
                className: "bg-green-600 hover:bg-green-700 text-white",
                onClick: () => {
                  if (data.type === "allowance") {
                    setPendingAllowanceAmount(data.amount || 0);
                  }
                  setApproveDialogOpen(true);
                },
                children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "mr-2 h-4 w-4" }),
                  " Setujui"
                ]
              }
            )
          ] }),
          isFinanceOrAdmin && /* @__PURE__ */ jsxs(Fragment, { children: [
            data.status === "approved" && /* @__PURE__ */ jsxs(
              Button,
              {
                className: "bg-indigo-600 hover:bg-indigo-700 text-white",
                onClick: handleRequestFund,
                disabled: actionLoading,
                children: [
                  actionLoading ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(DollarSign, { className: "mr-2 h-4 w-4" }),
                  "Request Fund"
                ]
              }
            ),
            data.status === "request_fund" && /* @__PURE__ */ jsxs(
              Button,
              {
                className: "bg-emerald-600 hover:bg-emerald-700 text-white",
                onClick: () => setTransferDialogOpen(true),
                disabled: actionLoading,
                children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "mr-2 h-4 w-4" }),
                  " Transferred"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { className: "shadow-sm", children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxs(CardTitle, { children: [
                "Detail Pengajuan ",
                data.type.toUpperCase()
              ] }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Informasi lengkap mengenai pengajuan ini." })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-8", children: [
              data.project && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase", children: "Nama Project" }),
                /* @__PURE__ */ jsxs("div", { className: "font-medium text-lg flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Briefcase, { className: "h-5 w-5 text-muted-foreground" }),
                  data.project.code,
                  " - ",
                  data.project.name
                ] }),
                data.project.division_name && /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }),
                  " Divisi: ",
                  data.project.division_name
                ] })
              ] }),
              data.project && hasRole(["finance", "hr", "superadmin"]) && /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-muted/40 p-4 rounded-lg border border-muted/60", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-teal-700 uppercase tracking-wider", children: "Budget Operasional" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-bold font-mono text-slate-900", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.project.operational_budget || 0) })
                  ] }),
                  (() => {
                    const totalOps = data.project.operational_budget || 0;
                    const usedATR = data.project.used_operational_budget || 0;
                    const usedEER = data.project.used_eer_budget || 0;
                    const totalUsed = usedATR + usedEER;
                    const remaining = totalOps - totalUsed;
                    const pctATR = totalOps > 0 ? usedATR / totalOps * 100 : 0;
                    const pctEER = totalOps > 0 ? usedEER / totalOps * 100 : 0;
                    return /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("div", { className: "w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-3", children: /* @__PURE__ */ jsxs("div", { className: "h-full flex", children: [
                        /* @__PURE__ */ jsx("div", { className: "bg-teal-500 transition-all", style: { width: `${Math.min(pctATR, 100)}%` } }),
                        /* @__PURE__ */ jsx("div", { className: "bg-blue-500 transition-all", style: { width: `${Math.min(pctEER, 100 - pctATR)}%` } })
                      ] }) }),
                      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
                        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                            /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-teal-500" }),
                            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-muted-foreground uppercase", children: "ATR (Advance)" })
                          ] }),
                          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold font-mono text-slate-900", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(usedATR) })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                            /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-blue-500" }),
                            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-muted-foreground uppercase", children: "EER Total" })
                          ] }),
                          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold font-mono text-slate-900", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(usedEER) }),
                          (data.project.used_eer_refund_budget !== null || data.project.used_eer_reimbursement_budget !== null) && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground space-y-0.5 mt-0.5 pl-3.5", children: [
                            /* @__PURE__ */ jsxs("p", { children: [
                              "Refund: ",
                              /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-slate-700", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.project.used_eer_refund_budget || 0) })
                            ] }),
                            /* @__PURE__ */ jsxs("p", { children: [
                              "Reimbursement: ",
                              /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-slate-700", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.project.used_eer_reimbursement_budget || 0) })
                            ] })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-muted-foreground uppercase", children: "Total Terpakai" }),
                          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold font-mono text-orange-600", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalUsed) })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-muted-foreground uppercase", children: "Sisa Budget" }),
                          /* @__PURE__ */ jsx("p", { className: `text-sm font-bold font-mono ${remaining < 0 ? "text-red-600" : "text-green-700"}`, children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(remaining) })
                        ] })
                      ] })
                    ] });
                  })()
                ] }),
                data.project.allowance_budget != null && data.project.allowance_budget > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-amber-50/60 p-4 rounded-lg border border-amber-100/80", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-amber-700 uppercase tracking-wider", children: "Budget Allowance" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-bold font-mono text-slate-900", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.project.allowance_budget) })
                  ] }),
                  (() => {
                    const totalAllow = data.project.allowance_budget || 0;
                    const usedAllow = data.project.used_allowance_budget || 0;
                    const remainAllow = totalAllow - usedAllow;
                    const pctAllow = totalAllow > 0 ? usedAllow / totalAllow * 100 : 0;
                    return /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("div", { className: "w-full h-2.5 bg-amber-100 rounded-full overflow-hidden mb-3", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-amber-500 transition-all", style: { width: `${Math.min(pctAllow, 100)}%` } }) }),
                      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                            /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-amber-500" }),
                            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-muted-foreground uppercase", children: "Terpakai" })
                          ] }),
                          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold font-mono text-slate-900", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(usedAllow) })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-muted-foreground uppercase", children: "Sisa Budget" }),
                          /* @__PURE__ */ jsx("p", { className: `text-sm font-bold font-mono ${remainAllow < 0 ? "text-red-600" : "text-green-700"}`, children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(remainAllow) })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-muted-foreground uppercase", children: "Persentase" }),
                          /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold font-mono text-amber-700", children: [
                            pctAllow.toFixed(1),
                            "%"
                          ] })
                        ] })
                      ] })
                    ] });
                  })()
                ] })
              ] }),
              data.project && isFinanceOrAdmin && /* @__PURE__ */ jsxs("div", { className: "mt-4 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 p-5 rounded-xl border border-blue-100/80", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-blue-900", children: "Pembagian Anggaran Proyek" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-blue-700/70 mt-0.5", children: [
                      "Total Pagu: ",
                      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.project.budget_total || 0)
                    ] })
                  ] }),
                  !editingPartitions ? /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => {
                    setPartitionOps(data.project?.operational_budget || 0);
                    setPartitionMgmt(data.project?.management_budget || 0);
                    setPartitionAllow(data.project?.allowance_budget || 0);
                    setEditingPartitions(true);
                  }, className: "text-blue-700 border-blue-200 hover:bg-blue-50", children: "Edit Pembagian" }) : /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => setEditingPartitions(false), disabled: savingPartitions, children: "Batal" }),
                    /* @__PURE__ */ jsx(Button, { size: "sm", onClick: async () => {
                      if (!data.project?.uuid) return;
                      setSavingPartitions(true);
                      try {
                        await axios.put(`/api/v1/projects/${data.project.uuid}`, {
                          operational_budget: partitionOps,
                          management_budget: partitionMgmt,
                          allowance_budget: partitionAllow
                        });
                        setEditingPartitions(false);
                        fetchDetail();
                      } catch (e) {
                        console.error("Failed to save partitions", e);
                        alert(e?.response?.data?.message || "Gagal menyimpan pembagian anggaran");
                      } finally {
                        setSavingPartitions(false);
                      }
                    }, disabled: savingPartitions, children: savingPartitions ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Simpan" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "p-3 bg-white rounded-lg border shadow-sm space-y-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-teal-700 uppercase tracking-wider", children: "Operasional" }),
                    editingPartitions ? /* @__PURE__ */ jsx(
                      MoneyInput,
                      {
                        value: partitionOps,
                        onValueChange: (v) => {
                          const val = v.floatValue || 0;
                          setPartitionOps(val);
                          const allowance = (data.project?.budget_total || 0) - val - partitionMgmt;
                          setPartitionAllow(allowance > 0 ? allowance : 0);
                        },
                        placeholder: "0",
                        className: "h-9 text-sm"
                      }
                    ) : /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-slate-900", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.project.operational_budget || 0) }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                      data.project.budget_total ? (((editingPartitions ? partitionOps : data.project.operational_budget) || 0) / data.project.budget_total * 100).toFixed(1) : 0,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-3 bg-white rounded-lg border shadow-sm space-y-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-purple-700 uppercase tracking-wider", children: "Manajemen" }),
                    editingPartitions ? /* @__PURE__ */ jsx(
                      MoneyInput,
                      {
                        value: partitionMgmt,
                        onValueChange: (v) => {
                          const val = v.floatValue || 0;
                          setPartitionMgmt(val);
                          const allowance = (data.project?.budget_total || 0) - partitionOps - val;
                          setPartitionAllow(allowance > 0 ? allowance : 0);
                        },
                        placeholder: "0",
                        className: "h-9 text-sm"
                      }
                    ) : /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-slate-900", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.project.management_budget || 0) }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                      data.project.budget_total ? (((editingPartitions ? partitionMgmt : data.project.management_budget) || 0) / data.project.budget_total * 100).toFixed(1) : 0,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-3 bg-white rounded-lg border shadow-sm space-y-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-amber-700 uppercase tracking-wider", children: "Allowance" }),
                    editingPartitions ? /* @__PURE__ */ jsx(
                      MoneyInput,
                      {
                        value: partitionAllow,
                        onValueChange: (v) => setPartitionAllow(v.floatValue || 0),
                        placeholder: "0",
                        className: "h-9 text-sm"
                      }
                    ) : /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-slate-900", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(data.project.allowance_budget || 0) }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                      data.project.budget_total ? (((editingPartitions ? partitionAllow : data.project.allowance_budget) || 0) / data.project.budget_total * 100).toFixed(1) : 0,
                      "%"
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                data.type === "atr" && data.urgency && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase", children: "Urgensi" }),
                  /* @__PURE__ */ jsx("div", { className: "font-medium flex items-center gap-2", children: /* @__PURE__ */ jsx(Badge, { variant: URGENCY_LABELS[data.urgency]?.variant ?? "default", className: "capitalize px-3", children: URGENCY_LABELS[data.urgency]?.label ?? data.urgency }) })
                ] }),
                data.type === "eer" && data.eer_type && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase", children: "Tipe EER" }),
                  /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: cn(
                        "capitalize px-3 border",
                        data.eer_type === "refund" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : data.eer_type === "balance" ? "bg-slate-50 text-slate-700 border-slate-200" : "bg-blue-50 text-blue-700 border-blue-200"
                      ),
                      children: data.eer_type === "balance" ? "balance (sesuai budget)" : data.eer_type
                    }
                  ) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase", children: "Tanggal Pengajuan" }),
                  /* @__PURE__ */ jsx("div", { className: "font-medium text-lg", children: format(new Date(data.created_at), "dd MMMM yyyy", { locale: id }) })
                ] }),
                data.amount != null && (data.amount > 0 || data.type === "eer" && data.eer_type === "balance") && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase", children: data.type === "eer" ? data.eer_type === "refund" ? "Nominal Refund" : data.eer_type === "balance" ? "Penyelesaian" : "Nominal Reimburse" : "Total Biaya" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "font-bold text-xl text-green-700 font-mono", children: [
                      "Rp ",
                      data.type === "eer" && data.atr_items ? eerDifference.toLocaleString("id-ID") : (data.amount || 0).toLocaleString("id-ID")
                    ] }),
                    data.transferred_amount != null && data.transferred_amount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-blue-700", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-tighter opacity-70", children: "Ditransfer:" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono font-bold", children: [
                        "Rp ",
                        data.transferred_amount.toLocaleString("id-ID")
                      ] })
                    ] })
                  ] })
                ] })
              ] }),
              (data.start_date || data.end_date) && /* @__PURE__ */ jsxs("div", { className: cn(
                "p-4 rounded-lg border space-y-2",
                data.type === "allowance" ? "bg-emerald-50/50 border-emerald-100" : "bg-blue-50/50 border-blue-100"
              ), children: [
                /* @__PURE__ */ jsxs("div", { className: cn(
                  "flex items-center gap-2 font-medium text-sm",
                  data.type === "allowance" ? "text-emerald-800" : "text-blue-800"
                ), children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
                  data.type === "atr" ? "Tanggal Penggunaan Dana" : data.type === "allowance" ? "Informasi Keberangkatan" : "Jadwal Penggunaan Dana"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
                  data.start_date && /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs block", children: data.type === "atr" ? "Tanggal Penggunaan" : data.type === "allowance" ? "Tanggal Berangkat" : "Tanggal Mulai" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                      format(new Date(data.start_date), "dd MMMM yyyy", { locale: id }),
                      data.start_time && /* @__PURE__ */ jsx("span", { className: cn(
                        "ml-2 text-xs px-1.5 py-0.5 rounded font-mono",
                        data.type === "allowance" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      ), children: data.start_time })
                    ] })
                  ] }),
                  data.end_date && data.type !== "atr" && /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs block", children: data.type === "allowance" ? "Tanggal Pulang" : "Tanggal Selesai" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                      format(new Date(data.end_date), "dd MMMM yyyy", { locale: id }),
                      data.end_time && /* @__PURE__ */ jsx("span", { className: cn(
                        "ml-2 text-xs px-1.5 py-0.5 rounded font-mono",
                        data.type === "allowance" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      ), children: data.end_time })
                    ] })
                  ] })
                ] })
              ] }),
              isRevisionStatus && isCreator && /* @__PURE__ */ jsxs("div", { className: "bg-orange-50/50 p-4 rounded-lg border border-orange-200 space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-orange-800 font-medium text-sm", children: [
                    /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
                    " Pengajuan Perlu Revisi"
                  ] }),
                  !revisionEditing && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "gap-1 border-orange-300 text-orange-700 hover:bg-orange-100", onClick: handleStartRevisionEdit, children: "Edit & Ajukan Ulang" })
                ] }),
                revisionEditing && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
                    (data.type === "atr" || data.type === "allowance") && /* @__PURE__ */ jsxs("div", { className: "space-y-4 md:col-span-full", children: [
                      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                          /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold uppercase tracking-tight text-slate-500", children: "Project" }),
                          /* @__PURE__ */ jsx(
                            SearchableSelect,
                            {
                              options: projects.map((p) => ({ value: p.id.toString(), label: `${p.code} - ${p.name}` })),
                              value: revisionForm.project_id || "none",
                              onValueChange: (v) => {
                                const pId = v === "none" ? "" : v;
                                const proj = projects.find((p) => p.id.toString() === pId);
                                setRevisionForm({
                                  ...revisionForm,
                                  project_id: pId,
                                  // Auto-update head if project has one
                                  ...proj?.head_id && { approver_head_id: proj.head_id.toString() }
                                });
                              },
                              placeholder: "Pilih Project"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                          /* @__PURE__ */ jsxs(Label, { className: "text-sm font-semibold uppercase tracking-tight text-slate-500", children: [
                            "Head Approver ",
                            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                          ] }),
                          /* @__PURE__ */ jsx(
                            SearchableSelect,
                            {
                              options: (approvers.head || []).map((u) => ({ value: u.id.toString(), label: u.name })),
                              value: revisionForm.approver_head_id || "none",
                              onValueChange: (v) => setRevisionForm({ ...revisionForm, approver_head_id: v === "none" ? "" : v }),
                              placeholder: "Pilih Head Approver"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                          /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold uppercase tracking-tight text-slate-500", children: "Pengganti PIC (Opsional)" }),
                          /* @__PURE__ */ jsx(
                            SearchableSelect,
                            {
                              options: users.map((u) => ({ value: u.id.toString(), label: u.name })),
                              value: revisionForm.replacement_pic_id || "none",
                              onValueChange: (v) => setRevisionForm({ ...revisionForm, replacement_pic_id: v === "none" ? "" : v }),
                              placeholder: "Pilih Pengganti PIC"
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold uppercase tracking-tight text-slate-500", children: "Urgensi" }),
                        /* @__PURE__ */ jsxs(
                          RadioGroup,
                          {
                            className: "flex space-x-4 mt-1",
                            value: revisionForm.urgency,
                            onValueChange: (v) => setRevisionForm({ ...revisionForm, urgency: v }),
                            children: [
                              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                                /* @__PURE__ */ jsx(RadioGroupItem, { value: "normal", id: "rev-urgency-normal" }),
                                /* @__PURE__ */ jsx(Label, { htmlFor: "rev-urgency-normal", className: "font-normal", children: "Normal" })
                              ] }),
                              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                                /* @__PURE__ */ jsx(RadioGroupItem, { value: "tinggi", id: "rev-urgency-tinggi" }),
                                /* @__PURE__ */ jsx(Label, { htmlFor: "rev-urgency-tinggi", className: "font-normal", children: "Tinggi" })
                              ] }),
                              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                                /* @__PURE__ */ jsx(RadioGroupItem, { value: "mendesak", id: "rev-urgency-mendesak" }),
                                /* @__PURE__ */ jsx(Label, { htmlFor: "rev-urgency-mendesak", className: "font-normal text-red-600", children: "Mendesak" })
                              ] })
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-full", children: [
                      /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium", children: "Tanggal Penggunaan" }),
                      /* @__PURE__ */ jsx(
                        DatePicker,
                        {
                          value: revisionForm.start_date,
                          onChange: (v) => setRevisionForm((p) => ({ ...p, start_date: v }))
                        }
                      )
                    ] }),
                    data.type === "allowance" && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium", children: "Tanggal Selesai" }),
                      /* @__PURE__ */ jsx(
                        DatePicker,
                        {
                          value: revisionForm.end_date,
                          onChange: (v) => setRevisionForm((p) => ({ ...p, end_date: v }))
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium", children: "Keterangan / Rencana Penggunaan" }),
                    /* @__PURE__ */ jsx(
                      Textarea,
                      {
                        className: "min-h-[80px] text-sm resize-none",
                        value: revisionForm.notes,
                        onChange: (e) => setRevisionForm((p) => ({ ...p, notes: e.target.value })),
                        placeholder: "Update rencana penggunaan..."
                      }
                    )
                  ] }),
                  (data.type === "atr" || data.type === "eer") && /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-2 border-t mt-4", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: data.type === "eer" ? "Form Pengeluaran EER" : "Item & Rincian Kegiatan ATR" }),
                    data.type === "eer" ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: (() => {
                      const firstItem = revisionForm.eer_items[0] || {
                        id: crypto.randomUUID(),
                        unit_price: 0,
                        receipt: null,
                        notes: ""
                      };
                      const excelDoc = revisionForm.documents.find((d) => d.type === "excel");
                      return /* @__PURE__ */ jsx("div", { className: "border rounded-xl bg-slate-50/30 p-4 md:p-6 transition-all hover:border-blue-200 hover:shadow-sm space-y-6 text-left", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                            /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1", children: [
                              "Nominal Pengeluaran ",
                              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                            ] }),
                            /* @__PURE__ */ jsx(
                              MoneyInput,
                              {
                                value: firstItem.unit_price,
                                onValueChange: (v) => handleNominalChangeRevision(v.floatValue ?? 0),
                                placeholder: "Masukkan nominal total pengeluaran...",
                                className: "h-11 text-base bg-white font-bold"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                            /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500", children: "Catatan Tambahan" }),
                            /* @__PURE__ */ jsx(
                              Textarea,
                              {
                                value: firstItem.notes || "",
                                onChange: (e) => updateItemEerRevision(firstItem.id, "notes", e.target.value),
                                placeholder: "Keterangan tambahan mengenai pengeluaran...",
                                className: "min-h-[148px] text-sm resize-none bg-white font-normal text-slate-800"
                              }
                            )
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                            /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1", children: [
                              "Upload File Excel Only ",
                              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                            ] }),
                            /* @__PURE__ */ jsx(
                              FileUploadDropzone,
                              {
                                className: "bg-white h-[96px] overflow-hidden rounded-lg",
                                multiple: false,
                                accept: ".xlsx,.xls",
                                labelText: "Klik untuk upload Excel (.xlsx, .xls)",
                                helperText: "Hanya menerima file format spreadsheet Excel",
                                onFilesChange: (files) => handleExcelChangeRevision(files[0] ?? null)
                              }
                            ),
                            excelDoc?.file && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-100", children: [
                              /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3" }),
                              " Terlampir: ",
                              excelDoc.file.name
                            ] }),
                            !excelDoc?.file && excelDoc?.original_name && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-blue-600 bg-blue-50 p-1.5 rounded mt-1 border border-blue-100", children: [
                              /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3" }),
                              " Excel Tersimpan: ",
                              /* @__PURE__ */ jsx("span", { className: "font-bold", children: excelDoc.original_name })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                            /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1", children: [
                              "Receipt / Kwitansi (PDF/JPEG) ",
                              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                            ] }),
                            /* @__PURE__ */ jsx(
                              FileUploadDropzone,
                              {
                                className: "bg-white h-[96px] overflow-hidden rounded-lg",
                                multiple: false,
                                accept: "image/*,.pdf",
                                labelText: "Klik untuk upload Receipt (PDF, JPEG, PNG)",
                                helperText: "Hanya menerima format gambar atau dokumen PDF",
                                onFilesChange: (files) => updateItemEerRevision(firstItem.id, "receipt", files[0] ?? null)
                              }
                            ),
                            firstItem.receipt && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-100", children: [
                              /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3" }),
                              " Terlampir: ",
                              firstItem.receipt.name
                            ] }),
                            !firstItem.receipt && firstItem.receipt_path && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-blue-600 bg-blue-50 p-1.5 rounded mt-1 border border-blue-100", children: [
                              /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3" }),
                              " Kwitansi Tersimpan: ",
                              /* @__PURE__ */ jsx("a", { href: firstItem.receipt_path, target: "_blank", rel: "noopener noreferrer", className: "underline font-bold", children: "Lihat File" })
                            ] })
                          ] })
                        ] })
                      ] }) });
                    })() }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                      revisionForm.selected_activities.map((activity) => {
                        const activityName = data.items?.find((i) => i.activity_id === activity.budget_detail_id)?.activity_name || data.project?.budget_details?.find((bd) => bd.id === activity.budget_detail_id)?.item_name || "Kegiatan";
                        const subtotal = activity.children.reduce((s, c) => s + c.quantity * c.unit_price, 0);
                        return /* @__PURE__ */ jsxs("div", { className: "border rounded-lg overflow-hidden shadow-sm bg-white", children: [
                          /* @__PURE__ */ jsxs(
                            "div",
                            {
                              className: "flex items-center justify-between p-3 bg-slate-50 border-b cursor-pointer",
                              onClick: () => toggleActivityRevision(activity.budget_detail_id),
                              children: [
                                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                                  activity.expanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-slate-500" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-slate-500" }),
                                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm text-slate-800", children: activityName })
                                ] }),
                                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-emerald-700 font-mono text-right", children: [
                                    "Rp ",
                                    subtotal.toLocaleString("id-ID")
                                  ] }),
                                  /* @__PURE__ */ jsx(
                                    Button,
                                    {
                                      type: "button",
                                      variant: "ghost",
                                      size: "icon",
                                      className: "h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50",
                                      onClick: (e) => {
                                        e.stopPropagation();
                                        removeActivityRevision(activity.budget_detail_id);
                                      },
                                      children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                                    }
                                  )
                                ] })
                              ]
                            }
                          ),
                          activity.expanded && /* @__PURE__ */ jsxs("div", { className: "p-3 space-y-4", children: [
                            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                              /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-medium text-muted-foreground uppercase", children: "Detail Aktivitas" }),
                              /* @__PURE__ */ jsx(
                                Input,
                                {
                                  value: activity.detail_aktivitas,
                                  onChange: (e) => updateActivityDetailRevision(activity.budget_detail_id, e.target.value),
                                  placeholder: "Detail aktivitas...",
                                  className: "h-8 text-sm"
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                              activity.children.map((child, idx) => /* @__PURE__ */ jsxs("div", { className: "border rounded-md p-3 space-y-3 bg-slate-50/40 relative", children: [
                                activity.children.length > 1 && /* @__PURE__ */ jsx(
                                  Button,
                                  {
                                    type: "button",
                                    variant: "ghost",
                                    size: "icon",
                                    className: "h-5 w-5 text-red-500 absolute top-2 right-2",
                                    onClick: () => removeChildItemRevision(activity.budget_detail_id, child.id),
                                    children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
                                  }
                                ),
                                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3", children: [
                                  /* @__PURE__ */ jsxs("div", { className: "md:col-span-12 lg:col-span-5 space-y-1", children: [
                                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold uppercase tracking-tight text-slate-500", children: "Nama Item" }),
                                    /* @__PURE__ */ jsx(
                                      Input,
                                      {
                                        value: child.item_name,
                                        onChange: (e) => updateChildItemRevision(activity.budget_detail_id, child.id, "item_name", e.target.value),
                                        placeholder: "Nama item...",
                                        className: "h-8 text-sm"
                                      }
                                    )
                                  ] }),
                                  /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 lg:col-span-1 space-y-1", children: [
                                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold uppercase tracking-tight text-slate-500", children: "Qty" }),
                                    /* @__PURE__ */ jsx(
                                      Input,
                                      {
                                        type: "number",
                                        min: 1,
                                        value: child.quantity,
                                        onChange: (e) => updateChildItemRevision(activity.budget_detail_id, child.id, "quantity", parseInt(e.target.value) || 1),
                                        className: "h-8 text-sm px-2"
                                      }
                                    )
                                  ] }),
                                  /* @__PURE__ */ jsxs("div", { className: "md:col-span-5 lg:col-span-3 space-y-1", children: [
                                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold uppercase tracking-tight text-slate-500", children: "Nominal" }),
                                    /* @__PURE__ */ jsx(
                                      MoneyInput,
                                      {
                                        value: child.unit_price,
                                        onValueChange: (v) => updateChildItemRevision(activity.budget_detail_id, child.id, "unit_price", v.floatValue || 0),
                                        className: "h-8 text-sm"
                                      }
                                    )
                                  ] }),
                                  /* @__PURE__ */ jsxs("div", { className: "md:col-span-5 lg:col-span-3 space-y-1", children: [
                                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold uppercase tracking-tight text-slate-500", children: "Jenis" }),
                                    /* @__PURE__ */ jsx(
                                      SearchableSelect,
                                      {
                                        options: expenseTypes.filter((et) => et.value !== "").map((et) => ({ value: et.value, label: et.label })),
                                        value: child.expense_type,
                                        onValueChange: (v) => updateChildItemRevision(activity.budget_detail_id, child.id, "expense_type", v),
                                        placeholder: "Pilih...",
                                        className: "h-8 text-xs px-2"
                                      }
                                    )
                                  ] })
                                ] })
                              ] }, child.id)),
                              /* @__PURE__ */ jsxs(
                                Button,
                                {
                                  type: "button",
                                  variant: "outline",
                                  size: "sm",
                                  onClick: () => addChildItemRevision(activity.budget_detail_id),
                                  className: "w-full gap-1 border-dashed h-8 text-xs text-muted-foreground hover:text-primary",
                                  children: [
                                    /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" }),
                                    " Tambah Item"
                                  ]
                                }
                              )
                            ] })
                          ] })
                        ] }, activity.budget_detail_id);
                      }),
                      availableActivitiesRevision.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2", children: [
                        /* @__PURE__ */ jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Pilih & Tambah Kegiatan Baru" }),
                        /* @__PURE__ */ jsx(
                          SearchableSelect,
                          {
                            options: availableActivitiesRevision.map((bd) => ({
                              value: bd.id.toString(),
                              label: `${bd.item_name} — Sisa: Rp ${bd.remaining_amount.toLocaleString("id-ID")}`
                            })),
                            onValueChange: (v) => addActivityRevision(parseInt(v)),
                            placeholder: "Pilih kegiatan lain...",
                            className: "h-9"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex justify-between items-center", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-emerald-900", children: [
                        "Total ",
                        data.type === "eer" ? "EER" : "Pengajuan",
                        " Baru"
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-emerald-900 font-mono", children: [
                        "Rp ",
                        (data.type === "eer" ? revisionForm.eer_items.reduce((s, i) => s + i.amount, 0) : revisionForm.selected_activities.reduce((s, a) => s + a.children.reduce((c_s, c) => c_s + c.quantity * c.unit_price, 0), 0)).toLocaleString("id-ID")
                      ] })
                    ] }),
                    data.type === "eer" && /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 border rounded-xl bg-slate-50/50 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                        /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Hasil Kalkulasi EER (Otomatis)" }),
                        /* @__PURE__ */ jsx("div", { className: cn(
                          "flex items-center space-x-2 p-3 rounded-lg border shadow-sm",
                          revisionForm.eer_type === "refund" ? "bg-emerald-50/30 border-emerald-200" : revisionForm.eer_type === "balance" ? "bg-slate-50/30 border-slate-200" : "bg-blue-50/30 border-blue-200"
                        ), children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                          /* @__PURE__ */ jsx("div", { className: cn(
                            "font-bold text-[11px]",
                            revisionForm.eer_type === "refund" ? "text-emerald-900" : revisionForm.eer_type === "balance" ? "text-slate-900" : "text-blue-900"
                          ), children: revisionForm.eer_type === "balance" ? "⚖️ BALANCE (Sesuai Budget)" : revisionForm.eer_type === "refund" ? "💰 REFUND (Pengembalian Kelebihan)" : "💳 REIMBURSEMENT (Kekurangan Dana)" }),
                          /* @__PURE__ */ jsx("div", { className: cn(
                            "text-[10px] mt-0.5 leading-relaxed",
                            revisionForm.eer_type === "refund" ? "text-emerald-700" : revisionForm.eer_type === "balance" ? "text-slate-600" : "text-blue-700"
                          ), children: revisionForm.eer_type === "refund" ? "Total klaim lebih kecil dari limit ATR. Selisih dana wajib dikembalikan ke kantor." : revisionForm.eer_type === "balance" ? "Total klaim sesuai dengan budget ATR. Tidak ada pengembalian atau penambahan dana." : "Total klaim melampaui limit ATR. Kantor akan membayarkan selisihnya." })
                        ] }) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: revisionForm.eer_type === "balance" ? "Selisih Nominal" : `Nominal ${revisionForm.eer_type === "refund" ? "Refund" : "Reimburse"}` }),
                        /* @__PURE__ */ jsxs("div", { className: cn(
                          "h-10 text-sm font-black flex items-center px-4 rounded-xl text-white shadow-inner",
                          revisionForm.eer_type === "refund" ? "bg-emerald-600" : revisionForm.eer_type === "balance" ? "bg-slate-600" : "bg-blue-600"
                        ), children: [
                          "Rp ",
                          revisionForm.refund_reimburse_amount.toLocaleString("id-ID")
                        ] }),
                        /* @__PURE__ */ jsx("p", { className: "text-[9px] text-muted-foreground italic leading-tight", children: "* Dikalkulasi otomatis dari selisih limit ATR dan total rincian klaim di atas." })
                      ] })
                    ] }) })
                  ] }),
                  data.type === "eer" && revisionForm.eer_type === "refund" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-2 border-t mt-4", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(Upload, { className: "h-3 w-3" }),
                      " Update Bukti Refund (Opsional)"
                    ] }),
                    /* @__PURE__ */ jsx(
                      FileUploadDropzone,
                      {
                        className: "bg-white h-[80px] overflow-hidden rounded-lg",
                        onFilesChange: (files) => setRevisionForm((p) => ({ ...p, transfer_proof: files[0] ?? null }))
                      }
                    ),
                    revisionForm.transfer_proof ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-100 italic", children: [
                      /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3" }),
                      " Baru: ",
                      revisionForm.transfer_proof.name
                    ] }) : data.transfer_proof_path ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-blue-600 bg-blue-50 p-1.5 rounded mt-1 border border-blue-100 italic", children: [
                      /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3" }),
                      " Sudah ada file sebelumnya. Kosongkan jika tidak ingin mengubah."
                    ] }) : null
                  ] }),
                  data.type !== "eer" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t mt-4 text-left", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Dokumen Pendukung / Tambahan" }),
                      /* @__PURE__ */ jsxs(
                        Button,
                        {
                          type: "button",
                          variant: "outline",
                          size: "sm",
                          className: "h-7 text-[10px] gap-1",
                          onClick: () => setRevisionForm((p) => ({
                            ...p,
                            documents: [...p.documents, { id: crypto.randomUUID(), type: "other", file: null }]
                          })),
                          children: [
                            /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" }),
                            " Tambah"
                          ]
                        }
                      )
                    ] }),
                    revisionForm.documents.filter((d) => d.type !== "excel").length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: revisionForm.documents.filter((d) => d.type !== "excel").map((doc) => /* @__PURE__ */ jsxs("div", { className: "p-3 border rounded-lg bg-slate-50/50 relative space-y-3", children: [
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "icon",
                          className: "h-6 w-6 absolute top-1 right-1 text-red-500 hover:bg-red-100",
                          onClick: () => setRevisionForm((p) => ({
                            ...p,
                            documents: p.documents.filter((d) => d.id !== doc.id)
                          })),
                          children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 pr-6", children: [
                        /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Nama / Jenis Dokumen" }),
                        /* @__PURE__ */ jsx(
                          Input,
                          {
                            value: doc.type,
                            onChange: (e) => setRevisionForm((p) => ({
                              ...p,
                              documents: p.documents.map((d) => d.id === doc.id ? { ...d, type: e.target.value } : d)
                            })),
                            className: "h-8 text-xs bg-white",
                            placeholder: "Contoh: Invoice, TOR"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "File Dokumen" }),
                        /* @__PURE__ */ jsx(
                          FileUploadDropzone,
                          {
                            className: "h-16 bg-white shrink-0",
                            onFilesChange: (files) => setRevisionForm((p) => ({
                              ...p,
                              documents: p.documents.map((d) => d.id === doc.id ? { ...d, file: files[0] ?? null } : d)
                            }))
                          }
                        ),
                        doc.file ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 italic", children: [
                          /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 shrink-0" }),
                          " ",
                          /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                            "Baru: ",
                            doc.file.name
                          ] })
                        ] }) : doc.original_name ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 italic", children: [
                          /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 shrink-0" }),
                          " ",
                          /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                            "Lama: ",
                            doc.original_name
                          ] })
                        ] }) : null
                      ] })
                    ] }, doc.id)) }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground text-center italic p-4 border border-dashed rounded bg-slate-50/50", children: "Tidak ada dokumen pendukung tambahan." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1 pb-2 border-t pt-4", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium", children: "Catatan Revisi untuk Approver" }),
                    /* @__PURE__ */ jsx(
                      Textarea,
                      {
                        className: "min-h-[60px] text-sm resize-none",
                        value: revisionForm.revision_note,
                        onChange: (e) => setRevisionForm((p) => ({ ...p, revision_note: e.target.value })),
                        placeholder: "Jelaskan perubahan yang Anda lakukan..."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
                    /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => setRevisionEditing(false), disabled: resubmitLoading, children: "Batal" }),
                    /* @__PURE__ */ jsx(Button, { size: "sm", className: "bg-orange-600 hover:bg-orange-700", onClick: handleResubmitRevision, disabled: resubmitLoading, children: resubmitLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "mr-1 h-3.5 w-3.5 animate-spin" }),
                      " Mengirim..."
                    ] }) : "Ajukan Ulang" })
                  ] })
                ] })
              ] }),
              data.items && data.items.length > 0 && data.type === "atr" && (() => {
                const atrItems = data.items.filter((i) => !i.parent_item_id);
                const grouped = {};
                atrItems.forEach((item) => {
                  if (!grouped[item.activity_id]) {
                    const budgetSelected = data.atr_budget_selecteds?.find((abs) => abs.project_budget_detail_id === item.activity_id);
                    grouped[item.activity_id] = {
                      name: item.activity_name,
                      notes: budgetSelected?.notes || "",
                      items: []
                    };
                  }
                  grouped[item.activity_id].items.push(item);
                });
                return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase", children: "Item Kegiatan ATR" }),
                  Object.entries(grouped).map(([actId, group]) => /* @__PURE__ */ jsxs("div", { className: "border rounded-xl overflow-hidden", children: [
                    /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 border-b space-y-1", children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-slate-900", children: group.name }),
                      group.notes && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground italic leading-relaxed", children: group.notes })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
                      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b bg-muted/30", children: [
                        /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium text-muted-foreground text-xs", children: "Nama Item" }),
                        /* @__PURE__ */ jsx("th", { className: "text-center p-3 font-medium text-muted-foreground text-xs w-16", children: "Qty" }),
                        /* @__PURE__ */ jsx("th", { className: "text-right p-3 font-medium text-muted-foreground text-xs", children: "Nominal" }),
                        /* @__PURE__ */ jsx("th", { className: "text-right p-3 font-medium text-muted-foreground text-xs", children: "Jumlah" }),
                        /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-medium text-muted-foreground text-xs", children: "Jenis" })
                      ] }) }),
                      /* @__PURE__ */ jsx("tbody", { children: group.items.map((item) => /* @__PURE__ */ jsxs("tr", { className: "border-b last:border-0 hover:bg-muted/20", children: [
                        /* @__PURE__ */ jsx("td", { className: "p-3 font-medium", children: item.item_name }),
                        /* @__PURE__ */ jsx("td", { className: "p-3 text-center", children: item.quantity }),
                        /* @__PURE__ */ jsxs("td", { className: "p-3 text-right font-mono", children: [
                          "Rp ",
                          item.unit_price.toLocaleString("id-ID")
                        ] }),
                        /* @__PURE__ */ jsxs("td", { className: "p-3 text-right font-mono font-semibold", children: [
                          "Rp ",
                          item.amount.toLocaleString("id-ID")
                        ] }),
                        /* @__PURE__ */ jsx("td", { className: "p-3", children: item.expense_type && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] px-1.5 bg-slate-50", children: item.expense_type }) })
                      ] }, item.id)) }),
                      /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50", children: [
                        /* @__PURE__ */ jsx("td", { colSpan: 3, className: "p-3 text-right font-medium text-xs text-muted-foreground uppercase", children: "Subtotal" }),
                        /* @__PURE__ */ jsxs("td", { className: "p-3 text-right font-mono font-bold text-emerald-700", children: [
                          "Rp ",
                          group.items.reduce((s, i) => s + i.amount, 0).toLocaleString("id-ID")
                        ] }),
                        /* @__PURE__ */ jsx("td", {})
                      ] }) })
                    ] }) })
                  ] }, actId))
                ] });
              })(),
              data.type === "eer" && (() => {
                const eerItems = data.items || [];
                const atrItems = data.atr_items?.items || [];
                const activityClaimTotals = {};
                eerItems.forEach((item) => {
                  if (item.project_budget_detail_id) {
                    activityClaimTotals[item.project_budget_detail_id] = (activityClaimTotals[item.project_budget_detail_id] || 0) + item.amount;
                  }
                });
                const groupedAtr = {};
                atrItems.forEach((item) => {
                  if (!groupedAtr[item.activity_id]) {
                    const budgetSelected = data.atr_budget_selecteds?.find((abs) => abs.project_budget_detail_id === item.activity_id);
                    groupedAtr[item.activity_id] = {
                      name: item.activity_name,
                      notes: budgetSelected?.notes || "",
                      items: [],
                      plannedAmount: 0
                    };
                  }
                  groupedAtr[item.activity_id].items.push(item);
                  groupedAtr[item.activity_id].plannedAmount += item.amount;
                });
                return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                  data.atr_items && /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm mb-6", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center", children: /* @__PURE__ */ jsx(Receipt, { className: "h-4 w-4 text-white" }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Ringkasan Biaya EER" }),
                        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-medium", children: "Kalkulasi Penggunaan Dana" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 pb-2 border-b md:border-b-0 md:border-r md:pb-0 border-slate-200", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-tight", children: "Total Dana ATR" }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 justify-center md:justify-start text-slate-900 font-mono", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-400", children: "Rp" }),
                          /* @__PURE__ */ jsx("span", { className: "text-lg font-black", children: totalAtrAmount.toLocaleString("id-ID") })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 pb-2 border-b md:border-b-0 md:border-r md:pb-0 border-slate-200", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-tight", children: "Total Pengeluaran (Actual)" }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 justify-center md:justify-start text-slate-600 font-mono", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-400", children: "Rp" }),
                          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold", children: totalEerSpent.toLocaleString("id-ID") })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: cn(
                        "space-y-1.5 p-3 rounded-lg border",
                        data.eer_type === "refund" ? "bg-emerald-50 border-emerald-100" : data.eer_type === "balance" ? "bg-slate-100 border-slate-200" : "bg-blue-50 border-blue-100"
                      ), children: [
                        /* @__PURE__ */ jsx("span", { className: cn(
                          "text-[10px] font-bold uppercase tracking-tight",
                          data.eer_type === "refund" ? "text-emerald-700" : data.eer_type === "balance" ? "text-slate-600" : "text-blue-700"
                        ), children: data.eer_type === "refund" ? "Total Refund (ATR - EER)" : data.eer_type === "balance" ? "Penyelesaian" : "Total Reimburse (EER - ATR)" }),
                        /* @__PURE__ */ jsxs("div", { className: cn(
                          "flex items-baseline gap-1 justify-center md:justify-start font-mono",
                          data.eer_type === "refund" ? "text-emerald-900" : data.eer_type === "balance" ? "text-slate-900" : "text-blue-900"
                        ), children: [
                          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: "Rp" }),
                          /* @__PURE__ */ jsx("span", { className: cn(
                            "text-xl font-black",
                            data.eer_type === "balance" && "text-slate-500"
                          ), children: eerDifference.toLocaleString("id-ID") })
                        ] }),
                        data.eer_type === "balance" && /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-500 font-medium", children: "EER Balance" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-left", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Detail Pengeluaran EER" }),
                    /* @__PURE__ */ jsx("div", { className: "border rounded-2xl bg-white shadow-sm overflow-hidden p-6 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
                        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Nominal Klaim" }),
                          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-black text-slate-900 font-mono", children: [
                            "Rp ",
                            totalEerSpent.toLocaleString("id-ID")
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Kwitansi / Bukti Pembayaran" }),
                          eerItems[0]?.receipt_path ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3.5 bg-slate-50 border rounded-xl hover:bg-slate-100/80 transition-colors", children: [
                            /* @__PURE__ */ jsx("div", { className: "bg-rose-50 p-2.5 rounded-lg text-rose-600", children: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }) }),
                            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800 truncate", children: "Kwitansi Pengeluaran" }),
                              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Format Image / PDF" })
                            ] }),
                            /* @__PURE__ */ jsxs(
                              "a",
                              {
                                href: `/storage/${eerItems[0].receipt_path}`,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100",
                                children: [
                                  /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }),
                                  " LIHAT FILE"
                                ]
                              }
                            )
                          ] }) : /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-400 italic bg-slate-50 border rounded-xl p-4 text-center", children: "Belum ada kwitansi yang diunggah." })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
                        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "File Spreadsheet Excel (Detail Breakdown)" }),
                          (() => {
                            const excelDoc = data.documents?.find((d) => d.type === "excel");
                            return excelDoc ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3.5 bg-emerald-50/20 border border-emerald-100 rounded-xl hover:bg-emerald-50/40 transition-colors", children: [
                              /* @__PURE__ */ jsx("div", { className: "bg-emerald-500 p-2.5 rounded-lg text-white", children: /* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-5 w-5" }) }),
                              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-emerald-950 truncate", children: excelDoc.original_name }),
                                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-emerald-700", children: "Format Microsoft Excel Spreadsheet" })
                              ] }),
                              /* @__PURE__ */ jsxs(
                                "a",
                                {
                                  href: `/storage/${excelDoc.path}`,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm",
                                  children: [
                                    /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }),
                                    " DOWNLOAD"
                                  ]
                                }
                              )
                            ] }) : /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-400 italic bg-slate-50 border rounded-xl p-4 text-center", children: "Belum ada file Excel detail breakdown." });
                          })()
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Catatan Tambahan" }),
                          /* @__PURE__ */ jsx("div", { className: "p-4 bg-slate-50 border rounded-xl min-h-[90px] text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap", children: eerItems[0]?.notes || /* @__PURE__ */ jsx("span", { className: "text-slate-400 italic", children: "Tidak ada catatan tambahan." }) })
                        ] })
                      ] })
                    ] }) })
                  ] }),
                  atrItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxs("label", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-slate-400" }),
                      " Referensi Persetujuan ATR"
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: Object.entries(groupedAtr).map(([actId, group]) => {
                      const actualClaim = activityClaimTotals[parseInt(actId)] || 0;
                      const isClaimed = actualClaim > 0;
                      return /* @__PURE__ */ jsxs("div", { className: cn(
                        "border rounded-xl transition-all overflow-hidden",
                        isClaimed ? "border-emerald-200 bg-emerald-50/20 shadow-sm" : "border-slate-200 bg-white opacity-60"
                      ), children: [
                        /* @__PURE__ */ jsxs("div", { className: cn(
                          "p-3 border-b flex items-center justify-between",
                          isClaimed ? "bg-emerald-50" : "bg-slate-50"
                        ), children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                            isClaimed ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-emerald-600" }) : /* @__PURE__ */ jsx("div", { className: "h-4 w-4 rounded-full border-2 border-slate-300" }),
                            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                              /* @__PURE__ */ jsx("h4", { className: cn("font-bold text-sm", isClaimed ? "text-emerald-900" : "text-slate-600"), children: group.name }),
                              group.notes && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground italic leading-relaxed", children: group.notes })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground uppercase font-bold tracking-tighter", children: "Budget ATR" }),
                            /* @__PURE__ */ jsxs("p", { className: "text-sm font-mono font-bold text-slate-700", children: [
                              "Rp ",
                              group.plannedAmount.toLocaleString("id-ID")
                            ] })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
                          /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: group.items.map((atrItem) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs", children: [
                            /* @__PURE__ */ jsxs("span", { className: "text-slate-500", children: [
                              "• ",
                              atrItem.item_name
                            ] }),
                            /* @__PURE__ */ jsxs("span", { className: "font-mono text-slate-400", children: [
                              "Rp ",
                              atrItem.amount.toLocaleString("id-ID")
                            ] })
                          ] }, atrItem.id)) }),
                          isClaimed && /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 border-t border-emerald-100 flex justify-between items-center", children: [
                            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-emerald-700 uppercase", children: "Total Aktual (EER)" }),
                            /* @__PURE__ */ jsxs("span", { className: "text-sm font-mono font-bold text-emerald-800", children: [
                              "Rp ",
                              actualClaim.toLocaleString("id-ID")
                            ] })
                          ] })
                        ] })
                      ] }, actId);
                    }) })
                  ] })
                ] });
              })(),
              data.atr_budget_selecteds && data.atr_budget_selecteds.length > 0 && (!data.items || data.items.length === 0) && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase", children: "Rincian Anggaran Dipilih" }),
                  canEditBudget && (!isEditingBudget ? /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: handleEditBudgetClick, children: "Edit Nominal" }) : /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => setIsEditingBudget(false), disabled: savingBudget, children: "Batal" }),
                    /* @__PURE__ */ jsx(Button, { size: "sm", onClick: handleSaveBudgets, disabled: savingBudget, children: savingBudget ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Simpan" })
                  ] }))
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-2", children: data.atr_budget_selecteds.map((budget) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg bg-slate-50", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: budget.notes }),
                  isEditingBudget ? /* @__PURE__ */ jsx("div", { className: "w-1/3", children: /* @__PURE__ */ jsx(
                    MoneyInput,
                    {
                      value: budgetEdits[budget.id] ?? budget.amount,
                      onValueChange: (val) => setBudgetEdits((prev) => ({ ...prev, [budget.id]: val.floatValue || 0 })),
                      className: "h-8 text-sm"
                    }
                  ) }) : /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-slate-900 font-mono", children: [
                    "Rp ",
                    budget.amount.toLocaleString("id-ID")
                  ] })
                ] }, budget.id)) })
              ] }),
              data.type === "allowance" && (data.start_date || data.end_date) && /* @__PURE__ */ jsxs("div", { className: "bg-amber-50/50 p-6 rounded-xl border border-amber-200/60 shadow-sm space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-amber-800 font-bold text-sm uppercase tracking-tight", children: [
                    /* @__PURE__ */ jsx(Calendar, { className: "h-5 w-5 text-amber-600" }),
                    " Periode Allowance"
                  ] }),
                  data.start_date && data.end_date && (() => {
                    const start = new Date(data.start_date);
                    const end = new Date(data.end_date);
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24)) + 1;
                    return /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "bg-white border-amber-200 text-amber-700 font-bold px-3 py-1", children: [
                      diffDays,
                      " Hari"
                    ] });
                  })()
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 relative", children: [
                  /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-px bg-amber-200 z-0" }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg border border-amber-100 shadow-sm relative z-10 flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Mulai Perjalanan" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-slate-800", children: data.start_date && format(new Date(data.start_date), "dd MMMM yyyy", {
                        locale: id
                      }) }),
                      formatTime(data.start_time) && /* @__PURE__ */ jsx("span", { className: "text-xs font-mono font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded", children: formatTime(data.start_time) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg border border-amber-100 shadow-sm relative z-10 flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Selesai Perjalanan" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-slate-800", children: data.end_date && format(new Date(data.end_date), "dd MMMM yyyy", {
                        locale: id
                      }) }),
                      formatTime(data.end_time) && /* @__PURE__ */ jsx("span", { className: "text-xs font-mono font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded", children: formatTime(data.end_time) })
                    ] })
                  ] })
                ] })
              ] }),
              data.notes && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase", children: "Keterangan / Rencana Penggunaan" }),
                /* @__PURE__ */ jsx("div", { className: "p-4 bg-muted/40 rounded-lg text-sm leading-relaxed border border-muted/60", children: data.notes })
              ] }),
              (data.bank_name || data.bank_account) && /* @__PURE__ */ jsxs("div", { className: "bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-blue-800 font-medium text-sm", children: [
                  /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4" }),
                  " Informasi Pembayaran"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
                  data.bank_name && /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs block", children: "Bank" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: data.bank_name })
                  ] }),
                  data.bank_account && /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs block", children: "No. Rekening" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium font-mono", children: data.bank_account })
                  ] }),
                  data.account_holder && /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs block", children: "Atas Nama" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: data.account_holder })
                  ] }),
                  data.bank_branch && /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs block", children: "Cabang Pembuka" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: data.bank_branch })
                  ] })
                ] })
              ] }),
              ((data.approvals?.some((a) => a.role === "direktur" && ["approved", "request_fund"].includes(a.status)) || data.type === "eer" && data.eer_type === "refund" && !data.transfer_proof_path) && !["draft", "rejected", "transferred", "closed"].includes(data.status) && isFinanceOrAdmin || data.type === "allowance" && isHrOrAdmin && data.approvals?.some((a) => a.role === "direktur" && ["approved", "request_fund"].includes(a.status)) && !["draft", "rejected", "transferred", "closed"].includes(data.status)) && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-4 pt-4 border-t", children: /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: () => setTransferDialogOpen(true),
                  className: "bg-blue-600 hover:bg-blue-700",
                  children: [
                    /* @__PURE__ */ jsx(Upload, { className: "mr-2 h-4 w-4" }),
                    " Selesaikan & Transfer"
                  ]
                }
              ) }),
              data.status === "rejected" && data.rejection_reason && /* @__PURE__ */ jsxs("div", { className: "bg-red-50/50 p-4 rounded-lg border border-red-200 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-red-800 font-medium text-sm", children: [
                  /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
                  " Alasan Penolakan"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: data.rejection_reason })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase", children: "Dokumen Lampiran" }),
                data.documents && data.documents.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: data.documents.map((doc) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group", children: [
                  /* @__PURE__ */ jsx("div", { className: "bg-red-50 p-2 rounded text-red-600", children: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: doc.original_name }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground capitalize", children: doc.type })
                  ] }),
                  /* @__PURE__ */ jsx("a", { href: `/storage/${doc.path}`, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 text-muted-foreground", children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }) }) })
                ] }, doc.id)) }) : /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground italic", children: "Tidak ada dokumen dilampirkan." })
              ] }),
              data.transfer_proof_path && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground uppercase", children: data.eer_type === "refund" ? "Bukti Refund (User)" : "Bukti Transfer (Finance/HR)" }),
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: cn("text-xs", data.eer_type === "refund" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"), children: data.eer_type === "refund" ? "User" : "Finance/HR" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: cn("p-4 rounded-lg border space-y-3", data.eer_type === "refund" ? "bg-emerald-50/50 border-emerald-200" : "bg-blue-50/50 border-blue-200"), children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-2 font-medium text-sm", data.eer_type === "refund" ? "text-emerald-800" : "text-blue-800"), children: [
                      /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
                      data.eer_type === "refund" ? "Refund Telah Dilakukan" : "Transfer Telah Dilakukan"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsx("a", { href: `/storage/${data.transfer_proof_path}`, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", className: cn("gap-1.5", data.eer_type === "refund" ? "text-emerald-700 border-emerald-300 hover:bg-emerald-100" : "text-blue-700 border-blue-300 hover:bg-blue-100"), children: [
                        /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }),
                        " Lihat Bukti"
                      ] }) }),
                      (isFinanceOrAdmin || data.type === "allowance" && isHrOrAdmin) && /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => setTransferDialogOpen(true), className: "gap-1.5 text-orange-700 border-orange-300 hover:bg-orange-100", children: [
                        /* @__PURE__ */ jsx(Edit, { className: "h-3.5 w-3.5" }),
                        " Edit"
                      ] })
                    ] })
                  ] }),
                  data.transferred_at && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground italic", children: [
                    data.eer_type === "refund" ? "Diunggah" : "Ditransfer",
                    " pada: ",
                    format(new Date(data.transferred_at), "dd MMMM yyyy, HH:mm", { locale: id })
                  ] })
                ] })
              ] }),
              data.type === "eer" && data.eer_type === "refund" && !["transferred", "closed"].includes(data.status) && isFinanceOrAdmin && /* @__PURE__ */ jsxs("div", { className: "bg-rose-50/50 p-4 rounded-lg border border-rose-100 space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-rose-800 font-medium text-sm", children: [
                  /* @__PURE__ */ jsx(Info, { className: "h-4 w-4" }),
                  " Rekening Refund (Reminder)"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-xs", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-rose-700 italic", children: "Harap pastikan transfer dilakukan ke salah satu rekening di bawah ini:" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "p-2 bg-white rounded border border-rose-100 shadow-sm", children: [
                      /* @__PURE__ */ jsx("p", { className: "font-bold text-rose-800", children: "BCA 5035288896" }),
                      /* @__PURE__ */ jsx("p", { className: "text-rose-600", children: "Rek Socim - PT Dampak Sosial Indonesia" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "p-2 bg-white rounded border border-rose-100 shadow-sm", children: [
                      /* @__PURE__ */ jsx("p", { className: "font-bold text-rose-800", children: "BNI 2023999001" }),
                      /* @__PURE__ */ jsx("p", { className: "text-rose-600", children: "Rek Lestari - Yayasan Biru Hijau lestari" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "p-2 bg-white rounded border border-rose-100 shadow-sm", children: [
                      /* @__PURE__ */ jsx("p", { className: "font-bold text-rose-800", children: "BNI 2024111915" }),
                      /* @__PURE__ */ jsx("p", { className: "text-rose-600", children: "Rek Sustim - Yayasan Dampak Keberlanjutan Indonesia" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "p-2 bg-white rounded border border-rose-100 shadow-sm", children: [
                      /* @__PURE__ */ jsx("p", { className: "font-bold text-rose-800", children: "BCA 5035880001" }),
                      /* @__PURE__ */ jsx("p", { className: "text-rose-600", children: "Rek Bamboo - PT Bamboo Karya Mandiri" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "p-2 bg-white rounded border border-rose-100 shadow-sm", children: [
                      /* @__PURE__ */ jsx("p", { className: "font-bold text-rose-800", children: "Mandiri 1410055445050" }),
                      /* @__PURE__ */ jsx("p", { className: "text-rose-600", children: "Rek EBLI - Ekosistem Berdaya Lestari Indonesia" })
                    ] })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "shadow-sm", children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Diskusi & Revisi" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Catatan dari approver dan pemohon." })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsx(ScrollArea, { className: "h-[300px] w-full rounded-md border p-4 bg-muted/10", children: data.comments && data.comments.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                data.comments.map((comment) => {
                  const isCreator2 = comment.user_id === data.user?.id;
                  return /* @__PURE__ */ jsxs("div", { className: `flex gap-3 ${isCreator2 ? "flex-row-reverse" : ""}`, children: [
                    /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsx(AvatarFallback, { className: isCreator2 ? "bg-primary/20 text-primary uppercase" : "bg-muted text-muted-foreground uppercase", children: comment.user_name.substring(0, 2) }) }),
                    /* @__PURE__ */ jsxs("div", { className: `flex flex-col gap-1 max-w-[80%] ${isCreator2 ? "items-end" : "items-start"}`, children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground font-medium flex items-center gap-1", children: [
                        isCreator2 ? "Pemohon" : comment.user_name,
                        /* @__PURE__ */ jsx("span", { className: "opacity-50 font-normal text-[10px] ml-1", children: format(new Date(comment.created_at), "dd MMM HH:mm") })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: `rounded-lg px-3 py-2 text-sm ${isCreator2 ? "bg-primary text-primary-foreground" : "bg-white border text-foreground"}`, children: [
                        comment.comment && /* @__PURE__ */ jsx("p", { children: comment.comment }),
                        comment.image_path && /* @__PURE__ */ jsx("div", { className: "mt-2 rounded-md overflow-hidden max-w-xs border border-muted/50", children: /* @__PURE__ */ jsx("a", { href: `/storage/${comment.image_path}`, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: `/storage/${comment.image_path}`,
                            alt: "Lampiran diskusi",
                            className: "w-full h-auto object-cover max-h-[160px] hover:scale-105 transition-transform duration-200"
                          }
                        ) }) })
                      ] })
                    ] })
                  ] }, comment.id);
                }),
                /* @__PURE__ */ jsx("div", { ref: commentsEndRef })
              ] }) : /* @__PURE__ */ jsx("div", { className: "h-full flex flex-col items-center justify-center text-muted-foreground text-sm italic", children: "Mulai diskusi terkait pengajuan ini." }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2", children: [
                commentImagePreview && /* @__PURE__ */ jsxs("div", { className: "relative inline-block border rounded-md p-1 bg-muted/10", children: [
                  /* @__PURE__ */ jsx("img", { src: commentImagePreview, alt: "Preview lampiran", className: "h-20 w-auto object-contain rounded-sm" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: removeCommentImage,
                      className: "absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors",
                      children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-end", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 relative space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "comment-input", className: "sr-only", children: "Tambah Komentar" }),
                    /* @__PURE__ */ jsx(
                      Textarea,
                      {
                        id: "comment-input",
                        placeholder: "Tulis pesan atau tanggapan...",
                        className: "min-h-[80px] pr-10 resize-none",
                        value: newComment,
                        onChange: (e) => setNewComment(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            submitComment();
                          }
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "absolute right-3 bottom-3 flex items-center", children: /* @__PURE__ */ jsxs("label", { htmlFor: "comment-image-upload", className: "cursor-pointer text-muted-foreground hover:text-primary transition-colors p-1 rounded-full hover:bg-muted/50", children: [
                      /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "file",
                          id: "comment-image-upload",
                          accept: "image/*",
                          className: "hidden",
                          onChange: handleCommentImageChange
                        }
                      )
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      className: "h-[80px]",
                      disabled: commentLoading || !newComment.trim() && !commentImage,
                      onClick: submitComment,
                      children: commentLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Kirim"
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Informasi Karyawan" }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg", children: data.user?.name?.charAt(0) ?? "?" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-base", children: data.user?.name ?? "-" }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: data.project?.division_name ?? "Karyawan" })
              ] })
            ] }) })
          ] }),
          data.approvals && data.approvals.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Daftar Approver" }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: [...data.approvals].sort((a, b) => {
              const p = { head: 1, hr: 2, finance: 3, direktur: 4 };
              return (p[a.role] || 99) - (p[b.role] || 99);
            }).map((approval) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground uppercase font-medium", children: approval.role }),
                /* @__PURE__ */ jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-[10px] px-1.5 py-0 h-4 ${approval.status === "approved" ? "bg-green-50 text-green-700 border-green-200" : approval.status === "rejected" ? "bg-red-50 text-red-700 border-red-200" : approval.status === "revision" ? "bg-orange-50 text-orange-700 border-orange-200" : approval.status === "revised" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200"}`,
                    children: approval.status === "revised" ? "sudah direvisi" : approval.status
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                "approver_name" in approval ? String(approval.approver_name) : "-"
              ] }),
              approval.approved_at && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 text-green-600" }),
                format(new Date(approval.approved_at), "dd MMM yyyy, HH:mm", { locale: id })
              ] }),
              approval.notes && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mt-1 italic bg-muted/40 p-2 rounded border", children: [
                '"',
                approval.notes,
                '"'
              ] })
            ] }, approval.id)) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Ringkasan" }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Kode" }),
                /* @__PURE__ */ jsx("span", { className: "font-mono font-medium", children: data.code })
              ] }),
              /* @__PURE__ */ jsx(Separator, {}),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Tipe" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium uppercase", children: data.type })
              ] }),
              /* @__PURE__ */ jsx(Separator, {}),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Status" }),
                /* @__PURE__ */ jsxs(Badge, { className: `${statusCfg.className} gap-1`, children: [
                  /* @__PURE__ */ jsx(StatusIcon, { className: "h-3 w-3" }),
                  statusCfg.label
                ] })
              ] }),
              data.amount != null && data.amount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Separator, {}),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-green-700 font-mono", children: [
                    "Rp ",
                    data.amount.toLocaleString("id-ID")
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: approveDialogOpen, onOpenChange: (open) => {
      if (!open) resetApproveDialog();
    }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-lg", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-green-700", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5" }),
          "Konfirmasi Persetujuan"
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Apakah Anda yakin ingin menyetujui pengajuan ",
          /* @__PURE__ */ jsx("strong", { children: data.type.toUpperCase() }),
          " dengan kode ",
          /* @__PURE__ */ jsx("strong", { className: "font-mono", children: data.code }),
          "?"
        ] })
      ] }),
      hasRole("hr") && data.type === "allowance" && /* @__PURE__ */ jsx("div", { className: "space-y-3 py-4 border-y my-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold text-slate-500 uppercase", children: [
          "Input Nominal Allowance ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          MoneyInput,
          {
            value: pendingAllowanceAmount,
            onValueChange: (v) => setPendingAllowanceAmount(v.floatValue || 0),
            autoFocus: true,
            className: "text-lg font-bold text-green-700 h-12"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground italic", children: "* Khusus role HR wajib memastikan nominal allowance sudah sesuai sebelum disetujui." })
      ] }) }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: resetApproveDialog, disabled: actionLoading, children: "Tidak" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "bg-green-600 hover:bg-green-700",
            disabled: actionLoading,
            onClick: handleApprove,
            children: actionLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Memproses..."
            ] }) : /* @__PURE__ */ jsx(Fragment, { children: "Ya, Setujui" })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: rejectDialogOpen, onOpenChange: (open) => {
      if (!open) resetRejectDialog();
    }, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-red-700", children: [
          /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5" }),
          "Konfirmasi Penolakan"
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Apakah Anda yakin ingin menolak pengajuan ",
          /* @__PURE__ */ jsx("strong", { children: data.type.toUpperCase() }),
          " dengan kode ",
          /* @__PURE__ */ jsx("strong", { className: "font-mono", children: data.code }),
          " dari ",
          /* @__PURE__ */ jsx("strong", { children: data.user?.name }),
          "?"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 py-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "rejection_reason_show", children: [
          "Alasan Penolakan ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "rejection_reason_show",
            placeholder: "Jelaskan alasan penolakan pengajuan ini...",
            className: "min-h-[100px] resize-none",
            value: rejectionReason,
            onChange: (e) => setRejectionReason(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Alasan penolakan akan dikirim ke pemohon" })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: resetRejectDialog, disabled: actionLoading, children: "Batal" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "bg-red-600 hover:bg-red-700",
            disabled: !rejectionReason.trim() || actionLoading,
            onClick: handleReject,
            children: actionLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Memproses..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(XCircle, { className: "mr-2 h-4 w-4" }),
              " Ya, Tolak"
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: revisiDialogOpen, onOpenChange: (open) => {
      if (!open) resetRevisiDialog();
    }, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-orange-700", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5" }),
          "Minta Revisi Pengajuan"
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Kirimkan catatan revisi kepada ",
          /* @__PURE__ */ jsx("strong", { children: data.user?.name }),
          " terkait pengajuan ",
          /* @__PURE__ */ jsx("strong", { children: data.type.toUpperCase() }),
          " ini."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 py-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "revisi_reason_show", children: [
          "Catatan Revisi ",
          /* @__PURE__ */ jsx("span", { className: "text-orange-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "revisi_reason_show",
            placeholder: "Tuliskan bagian mana yang perlu diperbaiki...",
            className: "min-h-[100px] resize-none",
            value: revisiReason,
            onChange: (e) => setRevisiReason(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: resetRevisiDialog, disabled: actionLoading, children: "Batal" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "bg-orange-600 hover:bg-orange-700",
            disabled: !revisiReason.trim() || actionLoading,
            onClick: handleRevisi,
            children: actionLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Memproses..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "mr-2 h-4 w-4" }),
              " Minta Revisi"
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: transferDialogOpen, onOpenChange: (open) => {
      if (!open) resetTransferDialog();
    }, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-blue-700", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5" }),
          "Selesaikan & Transfer"
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Unggah bukti transfer untuk menyelesaikan reimbursement ",
          /* @__PURE__ */ jsx("strong", { children: data?.type?.toUpperCase() }),
          " dengan kode ",
          /* @__PURE__ */ jsx("strong", { className: "font-mono", children: data?.code }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
        data?.eer_type === "refund" && data?.transfer_proof_path && /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 p-4 rounded-lg border border-emerald-200 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-emerald-800 font-medium text-sm", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
            " Bukti Refund Tersedia"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-700", children: 'Pihak pengaju telah melampirkan bukti transfer refund. Silakan tekan tombol di bawah untuk memverifikasi dan menandai sebagai "Transferred".' }),
          /* @__PURE__ */ jsx("a", { href: `/storage/${data.transfer_proof_path}`, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", size: "sm", className: "w-full text-emerald-700 border-emerald-300 hover:bg-emerald-100", children: [
            /* @__PURE__ */ jsx(Download, { className: "h-3 w-3 mr-2" }),
            " Lihat Bukti Terlampir"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { children: [
            "Bukti Transfer (Image/PDF) ",
            data?.type?.toLowerCase() === "allowance" || data?.transfer_proof_path ? /* @__PURE__ */ jsx("span", { className: "text-muted-foreground italic font-normal", children: "(Opsional)" }) : /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "file",
              accept: ".jpg,.jpeg,.png,.pdf",
              onChange: (e) => {
                if (e.target.files && e.target.files[0]) {
                  setTransferProof(e.target.files[0]);
                }
              }
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Maksimal 5MB." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold text-slate-500 uppercase", children: [
            "Nominal Ditransfer ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            MoneyInput,
            {
              value: transferredAmount || (data?.amount ?? 0),
              onValueChange: (v) => setTransferredAmount(v.floatValue || 0),
              className: "text-lg font-bold text-blue-700 h-12"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground italic", children: "* Masukkan nominal aktual yang ditransfer ke penerima." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: resetTransferDialog, disabled: actionLoading, children: "Batal" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: cn(
              data?.eer_type === "refund" && data?.transfer_proof_path ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
            ),
            disabled: !data?.transfer_proof_path && !transferProof && data?.type?.toLowerCase() !== "allowance" || actionLoading || transferredAmount <= 0 && !(data?.amount ?? 0),
            onClick: handleTransfer,
            children: actionLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Memproses..."
            ] }) : data?.eer_type === "refund" && data?.transfer_proof_path ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "mr-2 h-4 w-4" }),
              " Verifikasi & Selesai"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Upload, { className: "mr-2 h-4 w-4" }),
              " Upload & Selesai"
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: fileInputRef,
        className: "hidden",
        accept: "image/*,application/pdf",
        onChange: (e) => {
          const file = e.target.files?.[0];
          if (file && uploadingItemId) {
            handleItemReceiptUpload(uploadingItemId, file);
          }
          e.target.value = "";
        }
      }
    )
  ] });
}
export {
  Show as default
};
