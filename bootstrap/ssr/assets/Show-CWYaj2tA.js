import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { Link, Head, router } from "@inertiajs/react";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DAjHeOuX.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { Loader2, ArrowLeft, FileText, Calendar, Trash2, Edit, CheckCircle, XCircle, Save, X, Briefcase, Plane, MapPin, Phone, Download } from "lucide-react";
import { S as StatusBadge } from "./StatusBadge-Bj9jreC2.js";
import { F as FileUploadDropzone } from "./FileUploadDropzone-Cbnvbv0c.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { D as DatePicker } from "./DatePicker-DAaV_rdH.js";
import axios from "axios";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
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
import "@radix-ui/react-label";
import "./badge-Bu5jvMvW.js";
import "react-number-format";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
const LEAVE_TYPES = [
  { label: "Cuti Tahunan", value: "annual" },
  { label: "Cuti Sakit", value: "sick" },
  { label: "Cuti Menikah", value: "wedding" },
  { label: "Cuti Melahirkan", value: "birth" },
  { label: "Cuti Berduka", value: "berduka" },
  { label: "Cuti Alasan Penting", value: "important" },
  { label: "Cuti Tanpa Gaji", value: "unpaid" }
];
const LEAVE_TYPE_LABELS = Object.fromEntries(LEAVE_TYPES.map((t) => [t.value, t.label]));
function durationDays(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  if (s > e) return 0;
  let days = 0;
  const curr = new Date(s);
  while (curr <= e) {
    const day = curr.getDay();
    if (day !== 0 && day !== 6) days++;
    curr.setDate(curr.getDate() + 1);
  }
  return days;
}
function LeaveShow({ leaveCode, authUser, submitterRemainingLeaves, projects, users, approvers }) {
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: null
  });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [notes, setNotes] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    type: "",
    project_id: "",
    replacement_pic_id: "",
    approver_head_id: "",
    start_date: "",
    end_date: "",
    phone: "",
    lokasi: "",
    reason: ""
  });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editErrors, setEditErrors] = useState({});
  const fetchLeave = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/leaves/${leaveCode}`);
      const data = res.data.data;
      setLeave(data);
      setEditForm({
        type: data.type ?? "",
        project_id: data.project?.id?.toString() ?? "",
        replacement_pic_id: data.replacement_pic?.id?.toString() ?? "",
        approver_head_id: data.approvals?.find((a) => a.role === "head")?.approver?.id?.toString() ?? "",
        start_date: data.start_date ?? "",
        end_date: data.end_date ?? "",
        phone: data.phone ?? "",
        lokasi: data.lokasi ?? "",
        reason: data.reason ?? ""
      });
    } catch {
      setLeave(null);
    } finally {
      setLoading(false);
    }
  }, [leaveCode]);
  useEffect(() => {
    fetchLeave();
  }, [fetchLeave]);
  const { hasRole, hasPermission } = usePermission();
  const isTravel = leave?.type === "travel" || !!leave?.destination;
  const canRevisionEdit = authUser.is_owner && leave?.status === "revision";
  const canAction = (() => {
    if (authUser.is_owner) return false;
    if (!hasPermission(["approve_leaves", "reject_leaves"])) return false;
    const status = leave?.status ?? "";
    if (["rejected"].includes(status)) return false;
    const hasCompletedAction = leave?.approvals?.some((a) => a.approver?.id === authUser.id && ["approved", "rejected"].includes(a.status));
    if (hasCompletedAction) return false;
    if (hasRole(["superadmin", "direktur"])) return true;
    if (hasRole("hr")) {
      if (status === "hr_approved") return false;
      const direkturApproval = leave?.approvals?.find((a) => a.role === "direktur");
      if (direkturApproval && direkturApproval.status !== "approved") ;
      else {
        return true;
      }
    }
    if (hasRole("head")) {
      if (["submitted", "revision", "revised"].includes(status)) return true;
    }
    return false;
  })();
  const handleActionConfirm = async () => {
    if (!actionDialog.type || !leave) return;
    setActionLoading(true);
    try {
      await axios.post(`/api/v1/leaves/${leave.code}/status`, {
        action: actionDialog.type,
        notes: notes || null
      });
      setActionDialog({ open: false, type: null });
      setNotes("");
      await fetchLeave();
    } catch {
    } finally {
      setActionLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!leave) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/v1/leaves/${leave.code}`);
      router.visit("/leaves");
    } catch {
      setDeleteDialog(false);
    } finally {
      setActionLoading(false);
    }
  };
  const handleEditSubmit = async () => {
    if (!leave) return;
    setEditLoading(true);
    setEditErrors({});
    try {
      const fd = new FormData();
      fd.append("type", editForm.type);
      fd.append("start_date", editForm.start_date);
      fd.append("end_date", editForm.end_date);
      if (editForm.project_id) fd.append("project_id", editForm.project_id);
      if (editForm.replacement_pic_id) fd.append("replacement_pic_id", editForm.replacement_pic_id);
      if (editForm.approver_head_id) fd.append("approver_head_id", editForm.approver_head_id);
      if (editForm.phone) fd.append("phone", editForm.phone);
      if (editForm.lokasi) fd.append("lokasi", editForm.lokasi);
      if (editForm.reason) fd.append("reason", editForm.reason);
      if (attachmentFile) fd.append("attachment", attachmentFile);
      fd.append("_method", "PUT");
      await axios.post(`/api/v1/leaves/${leave.code}`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setEditMode(false);
      await fetchLeave();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        setEditErrors(err.response.data.errors ?? {});
      }
    } finally {
      setEditLoading(false);
    }
  };
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Cuti & Dinas", href: "/leaves" },
    { title: isTravel ? "Detail Dinas Luar" : "Detail Cuti", href: "#" }
  ];
  if (loading) {
    return /* @__PURE__ */ jsx(AppSidebarLayout, { breadcrumbs, children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-20", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) });
  }
  if (!leave) {
    return /* @__PURE__ */ jsx(AppSidebarLayout, { breadcrumbs, children: /* @__PURE__ */ jsxs("div", { className: "p-10 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Data Tidak Ditemukan" }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4", variant: "outline", children: /* @__PURE__ */ jsx(Link, { href: "/leaves", children: "Kembali" }) })
    ] }) });
  }
  const duration = durationDays(leave.start_date, leave.end_date);
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: `Detail ${isTravel ? "Dinas Luar" : "Cuti"} - ${leave.user?.name ?? "Unknown"}` }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 w-full mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "-ml-2", children: /* @__PURE__ */ jsx(Link, { href: "/leaves", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: isTravel ? "Detail Dinas Luar" : "Detail Cuti" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-sm mt-1", children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }),
              " ",
              leave.code,
              /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "|" }),
              /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5" }),
              " ",
              format(new Date(leave.created_at), "dd MMM yyyy HH:mm", { locale: id })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsx(StatusBadge, { status: leave.status }),
          authUser.can_delete && /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "h-9 px-4 border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 gap-2",
              onClick: () => setDeleteDialog(true),
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Hapus" })
              ]
            }
          ),
          canRevisionEdit && !editMode && /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "h-9 px-4 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 gap-2",
              onClick: () => setEditMode(true),
              children: [
                /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Edit & Resubmit" })
              ]
            }
          ),
          canAction && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            authUser.can_approve && /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: "h-9 px-4 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 gap-2",
                onClick: () => setActionDialog({ open: true, type: "approve" }),
                disabled: actionLoading,
                children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Setujui" })
                ]
              }
            ),
            authUser.can_approve && /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: "h-9 px-4 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 gap-2",
                onClick: () => setActionDialog({ open: true, type: "revision" }),
                disabled: actionLoading,
                children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Revisi" })
                ]
              }
            ),
            authUser.can_reject && /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: "h-9 px-4 border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 gap-2",
                onClick: () => setActionDialog({ open: true, type: "reject" }),
                disabled: actionLoading,
                children: [
                  /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Tolak" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      canRevisionEdit && /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-amber-600 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-amber-800", children: "Pengajuan ini memerlukan revisi." }),
          leave.approvals?.find((a) => a.status === "revision")?.notes && /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-700 mt-0.5", children: [
            "Catatan: ",
            leave.approvals.find((a) => a.status === "revision")?.notes
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
          editMode ? /* @__PURE__ */ jsxs(Card, { className: "border-amber-200", children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg text-amber-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Edit, { className: "h-5 w-5" }),
              " Edit Pengajuan Cuti"
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Project (Optional)" }),
                  /* @__PURE__ */ jsx(
                    SearchableSelect,
                    {
                      options: projects.map((p) => ({ label: `${p.code} - ${p.name}`, value: p.id.toString() })),
                      value: editForm.project_id,
                      onValueChange: (v) => setEditForm((p) => ({ ...p, project_id: v })),
                      placeholder: "Pilih project"
                    }
                  ),
                  editErrors.project_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: editErrors.project_id[0] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Pengganti PIC *" }),
                  /* @__PURE__ */ jsx(
                    SearchableSelect,
                    {
                      options: users.map((u) => ({ label: u.name, value: u.id.toString() })),
                      value: editForm.replacement_pic_id,
                      onValueChange: (v) => setEditForm((p) => ({ ...p, replacement_pic_id: v })),
                      placeholder: "Pilih PIC pengganti"
                    }
                  ),
                  editErrors.replacement_pic_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: editErrors.replacement_pic_id[0] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Jenis Cuti *" }),
                  /* @__PURE__ */ jsx(
                    SearchableSelect,
                    {
                      options: LEAVE_TYPES,
                      value: editForm.type,
                      onValueChange: (v) => setEditForm((p) => ({ ...p, type: v })),
                      placeholder: "Pilih jenis cuti"
                    }
                  ),
                  editErrors.type && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: editErrors.type[0] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "No. HP *" }),
                  /* @__PURE__ */ jsx(Input, { value: editForm.phone, onChange: (e) => setEditForm((p) => ({ ...p, phone: e.target.value })), placeholder: "08xxx" }),
                  editErrors.phone && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: editErrors.phone[0] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Tanggal Mulai *" }),
                  /* @__PURE__ */ jsx(DatePicker, { value: editForm.start_date, onChange: (v) => setEditForm((p) => ({ ...p, start_date: v })) }),
                  editErrors.start_date && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: editErrors.start_date[0] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Tanggal Selesai *" }),
                  /* @__PURE__ */ jsx(DatePicker, { value: editForm.end_date, onChange: (v) => setEditForm((p) => ({ ...p, end_date: v })) }),
                  editErrors.end_date && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: editErrors.end_date[0] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Alamat Selama Cuti *" }),
                /* @__PURE__ */ jsx(Input, { value: editForm.lokasi, onChange: (e) => setEditForm((p) => ({ ...p, lokasi: e.target.value })), placeholder: "Alamat lengkap" }),
                editErrors.lokasi && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: editErrors.lokasi[0] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Alasan Cuti" }),
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    value: editForm.reason,
                    onChange: (e) => setEditForm((p) => ({ ...p, reason: e.target.value })),
                    placeholder: "Jelaskan alasan cuti...",
                    className: "min-h-[80px]"
                  }
                ),
                editErrors.reason && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: editErrors.reason[0] })
              ] }),
              authUser.is_pegawai && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Pilih Atasan Direct *" }),
                /* @__PURE__ */ jsx(
                  SearchableSelect,
                  {
                    options: (approvers.head || []).map((u) => ({ label: u.name, value: u.id.toString() })),
                    value: editForm.approver_head_id,
                    onValueChange: (v) => setEditForm((p) => ({ ...p, approver_head_id: v })),
                    placeholder: "Pilih atasan"
                  }
                ),
                editErrors.approver_head_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: editErrors.approver_head_id[0] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Lampiran Dokumen (Opsional)" }),
                /* @__PURE__ */ jsx(
                  FileUploadDropzone,
                  {
                    className: "w-full",
                    onFilesChange: (files) => setAttachmentFile(files[0] || null)
                  }
                ),
                editErrors.attachment && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: editErrors.attachment[0] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    onClick: handleEditSubmit,
                    disabled: editLoading,
                    className: "bg-amber-600 hover:bg-amber-700 text-white gap-2",
                    children: [
                      editLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
                      "Simpan & Resubmit"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setEditMode(false), disabled: editLoading, className: "gap-2", children: [
                  /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
                  " Batal"
                ] })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: isTravel ? "Detail Perjalanan Dinas" : "Detail Pengajuan Cuti" }),
              leave.type === "annual" && /* @__PURE__ */ jsxs("div", { className: "mt-2 bg-emerald-50 border border-emerald-100 rounded-md py-1.5 px-3 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-emerald-700", children: "Sisa Cuti Pemohon" }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-emerald-800", children: [
                  submitterRemainingLeaves,
                  " Hari"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
              leave.project && /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: "Nama Project" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-medium text-base", children: [
                  /* @__PURE__ */ jsx(Briefcase, { className: "h-4 w-4 text-primary" }),
                  leave.project.name
                ] })
              ] }),
              isTravel ? /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: "Kota / Negara Tujuan" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-medium text-base", children: [
                  /* @__PURE__ */ jsx(Plane, { className: "h-4 w-4 text-primary" }),
                  leave.destination
                ] })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: "Jenis Cuti" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-medium text-base", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-primary" }),
                  LEAVE_TYPE_LABELS[leave.type] ?? leave.type
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: isTravel ? "Tanggal Berangkat" : "Tanggal Mulai" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: format(new Date(leave.start_date), "dd MMMM yyyy", { locale: id }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: isTravel ? "Tanggal Kembali" : "Tanggal Selesai" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: format(new Date(leave.end_date), "dd MMMM yyyy", { locale: id }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: isTravel ? "Total Hari" : "Durasi" }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium", children: [
                  duration,
                  " Hari"
                ] })
              ] }),
              leave.reason && /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: isTravel ? "Agenda / Keperluan" : "Alasan Cuti" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed bg-muted/30 p-4 rounded-lg border", children: leave.reason })
              ] }),
              leave.lokasi && /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: isTravel ? "Alamat Penginapan / Tujuan" : "Alamat Selama Cuti" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2 text-sm text-foreground/80", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 mt-0.5 text-muted-foreground" }),
                  leave.lokasi
                ] })
              ] }),
              leave.replacement_pic && /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: "Pengganti PIC" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: leave.replacement_pic.name })
              ] }),
              leave.phone && /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: "No. HP" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
                  /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 text-muted-foreground" }),
                  leave.phone
                ] })
              ] }),
              leave.attachment_path && /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: "Dokumen Pendukung" }),
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `/storage/${leave.attachment_path}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-primary/5 px-4 py-3 rounded-lg border border-primary/10 w-fit",
                    children: [
                      /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
                      "Unduh Lampiran"
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          leave.approvals && leave.approvals.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Riwayat Persetujuan" }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: leave.approvals.map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 rounded-lg border bg-muted/30", children: [
              a.status === "approved" && /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-emerald-600 mt-0.5" }),
              a.status === "rejected" && /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5 text-rose-600 mt-0.5" }),
              a.status === "revision" && /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-amber-600 mt-0.5" }),
              a.status === "pending" && /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 text-blue-600 mt-0.5 animate-spin" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
                  a.status === "approved" && "Disetujui",
                  a.status === "rejected" && "Ditolak",
                  a.status === "revision" && "Revisi",
                  a.status === "pending" && "Menunggu Persetujuan",
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground ml-2", children: [
                    "(",
                    a.role,
                    ")"
                  ] })
                ] }),
                a.approver && /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
                  "oleh ",
                  a.approver.name
                ] }),
                a.approved_at && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: format(new Date(a.approved_at), "dd MMM yyyy HH:mm", { locale: id }) }),
                a.notes && /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 border-t", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Catatan:" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm", children: a.notes })
                ] })
              ] })
            ] }, a.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Informasi Karyawan" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg", children: leave.user?.name?.charAt(0) ?? "U" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold", children: leave.user?.name ?? "Unknown User" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: leave.user?.email ?? "-" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Timeline" }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Pengajuan Dibuat" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: format(new Date(leave.created_at), "dd MMM yyyy HH:mm", { locale: id }) })
                ] })
              ] }),
              leave.approvals?.map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsxs("div", { className: `h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${a.status === "approved" ? "bg-emerald-100 text-emerald-600" : a.status === "rejected" ? "bg-rose-100 text-rose-600" : a.status === "revision" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`, children: [
                  a.status === "approved" && /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
                  a.status === "rejected" && /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
                  a.status === "revision" && /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
                  a.status === "pending" && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
                    a.status === "approved" && "Disetujui",
                    a.status === "rejected" && "Ditolak",
                    a.status === "revision" && "Revisi",
                    a.status === "pending" && "Menunggu Persetujuan",
                    " ",
                    "(",
                    a.role,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: a.approved_at ? format(new Date(a.approved_at), "dd MMM yyyy HH:mm", { locale: id }) : "-" })
                ] })
              ] }, a.id))
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: actionDialog.open, onOpenChange: (open) => !open && setActionDialog((prev) => ({ ...prev, open: false })), children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          actionDialog.type === "approve" ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-emerald-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5 text-rose-600" }),
          "Konfirmasi Aksi"
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Apakah Anda yakin ingin ",
          actionDialog.type === "approve" ? "menyetujui" : actionDialog.type === "reject" ? "menolak" : "mengembalikan (revisi)",
          " ",
          isTravel ? "perjalanan dinas" : "cuti",
          " dari ",
          /* @__PURE__ */ jsx("b", { children: leave.user?.name }),
          "?"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          isTravel ? `Tujuan: ${leave.destination}` : `Jenis: ${LEAVE_TYPE_LABELS[leave.type] ?? leave.type}`,
          /* @__PURE__ */ jsx("br", {}),
          "Durasi: ",
          format(new Date(leave.start_date), "dd MMM yyyy", { locale: id }),
          " - ",
          format(new Date(leave.end_date), "dd MMM yyyy", { locale: id }),
          " (",
          duration,
          " Hari)"
        ] }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            placeholder: actionDialog.type === "reject" ? "Alasan penolakan..." : actionDialog.type === "revision" ? "Catatan revisi yang diperlukan..." : "Catatan persetujuan (opsional)",
            className: "mt-4",
            value: notes,
            onChange: (e) => setNotes(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setActionDialog((prev) => ({ ...prev, open: false })), disabled: actionLoading, children: "Batal" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: actionDialog.type === "approve" ? "default" : "destructive",
            onClick: handleActionConfirm,
            className: "gap-2",
            disabled: actionLoading,
            children: actionLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
              " Memproses..."
            ] }) : actionDialog.type === "approve" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
              " Setujui"
            ] }) : actionDialog.type === "reject" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
              " Tolak"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
              " Revisi"
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: deleteDialog, onOpenChange: setDeleteDialog, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-rose-700", children: [
          /* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5" }),
          " Hapus Data Cuti"
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Tindakan ini tidak dapat dibatalkan. Data cuti ",
          /* @__PURE__ */ jsx("b", { children: leave.code }),
          " dari ",
          /* @__PURE__ */ jsx("b", { children: leave.user?.name }),
          " akan dihapus permanen dan kuota cuti akan dikembalikan."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDeleteDialog(false), disabled: actionLoading, children: "Batal" }),
        /* @__PURE__ */ jsxs(Button, { variant: "destructive", onClick: handleDelete, disabled: actionLoading, className: "gap-2", children: [
          actionLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
          "Ya, Hapus"
        ] })
      ] })
    ] }) })
  ] });
}
export {
  LeaveShow as default
};
