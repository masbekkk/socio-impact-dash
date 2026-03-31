import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { Head, Link } from "@inertiajs/react";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { C as Card, f as CardFooter } from "./card-DAjHeOuX.js";
import { ArrowLeft, Building2, FileText, AlertCircle, Loader2, Save } from "lucide-react";
import { F as FileUploadDropzone } from "./FileUploadDropzone-Cbnvbv0c.js";
import { S as Separator } from "./separator-CjIBof9L.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { D as DatePicker } from "./DatePicker-DAaV_rdH.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { u as useReimbursementForm } from "./use-reimbursement-form-D2Cjn_Sa.js";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "axios";
import "date-fns";
import "date-fns/locale";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-separator";
import "react-number-format";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "./reimbursement-service-BqypCIIo.js";
const URGENCY_MAP = {
  low: "rendah",
  normal: "normal",
  high: "tinggi",
  urgent: "mendesak"
};
function CreateAllowance({ projects, approvers, authUser, users, reimbursement, isEdit = false }) {
  const { loading, errors, setErrors, getAutoFill, clearFieldError, submitReimbursement } = useReimbursementForm(projects);
  const { hasRole } = usePermission();
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    user_id: "",
    name: authUser?.name ?? "",
    nip: authUser?.nip ?? "",
    division_name: authUser?.division_name ?? "",
    position: authUser?.position ?? "",
    join_date: authUser?.join_date ?? "",
    project_id: "",
    divisi: "",
    pic_project: "",
    approver_head_id: "",
    usage_plan: "",
    amount: 0,
    urgency: "normal",
    start_date: "",
    end_date: "",
    start_time: "08:00",
    end_time: "17:00",
    replacement_pic_id: ""
  });
  useEffect(() => {
    if (isEdit && reimbursement) {
      const data = reimbursement.data || reimbursement;
      const projectID = data.project?.id?.toString() ?? "";
      const autoFill = projectID ? getAutoFill(projectID) : { division: "", pic: "" };
      setFormData({
        code: data.code || "",
        user_id: data.user?.id?.toString() ?? "",
        name: data.user?.name || "",
        nip: data.nip || "",
        division_name: data.project?.division_name || authUser?.division_name || "",
        position: data.user?.position || authUser?.position || "",
        // Assuming role/position mapping
        join_date: data.user?.join_date || authUser?.join_date || "",
        project_id: projectID,
        divisi: autoFill.division || data.project?.division_name || "",
        pic_project: autoFill.pic || data.project?.pic_name || "",
        approver_head_id: data.approvals?.find((a) => a.role === "head")?.approver_id?.toString() ?? "",
        usage_plan: data.usage_plan || "",
        amount: data.amount || 0,
        urgency: Object.keys(URGENCY_MAP).find((key) => URGENCY_MAP[key] === data.urgency) || "normal",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        start_time: data.start_time || "08:00",
        end_time: data.end_time || "17:00",
        replacement_pic_id: data.replacement_pic_id?.toString() ?? ""
      });
    }
  }, [isEdit, reimbursement]);
  const [totalDays, setTotalDays] = useState(0);
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (start <= end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24)) + 1;
        setTotalDays(diffDays);
      } else {
        setTotalDays(0);
      }
    } else {
      setTotalDays(0);
    }
  }, [formData.start_date, formData.end_date]);
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Keuangan", href: "/reimbursements" },
    { title: "Buat Allowance", href: "/reimbursements/create/allowance" }
  ];
  const handleProjectChange = (value) => {
    const autoFill = getAutoFill(value);
    setFormData((prev) => ({
      ...prev,
      project_id: value,
      divisi: autoFill.division,
      pic_project: autoFill.pic
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };
  const handleUserChange = (userId) => {
    const selectedUser = users.find((u) => u.id.toString() === userId);
    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        user_id: userId,
        name: selectedUser.name,
        nip: selectedUser.nip ?? "-"
      }));
    }
    clearFieldError("user_id");
  };
  const handleValueChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };
  const handleSubmit = async (status = "submitted") => {
    if (status === "submitted") {
      if (!formData.project_id) {
        setErrors({ project_id: ["Pilih project terlebih dahulu."] });
        return;
      }
      if (!formData.approver_head_id) {
        setErrors({ _general: ["Persetujuan Head wajib dipilih."] });
        return;
      }
      if (!formData.start_date || !formData.end_date) {
        setErrors({ _general: ["Tanggal berangkat dan kembali wajib diisi."] });
        return;
      }
      if (!attachmentFile) {
        setErrors({ _general: ["Dokumen pendukung wajib diunggah."] });
        return;
      }
      const selected = projects.find((p) => p.id === parseInt(formData.project_id));
      if (selected) {
        const remaining = (selected.allowance_budget ?? 0) - (selected.used_allowance_budget ?? 0);
        if (formData.amount > remaining) {
          setErrors({ amount: ["Nominal pengajuan melebihi sisa pagu allowance proyek."] });
          return;
        }
      }
    }
    const documents = [];
    if (attachmentFile) documents.push({ file: attachmentFile, type: "other" });
    await submitReimbursement({
      code: formData.code,
      type: "allowance",
      status,
      project_id: formData.project_id,
      amount: formData.amount,
      usage_plan: formData.usage_plan,
      urgency: "normal",
      documents,
      approver_head_id: formData.approver_head_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      replacement_pic_id: formData.replacement_pic_id,
      user_id: formData.user_id || void 0,
      is_edit: isEdit,
      reimbursement_id: isEdit ? reimbursement.data?.id || reimbursement.id : void 0
    });
  };
  const selectedProject = useMemo(() => {
    if (!formData.project_id) return null;
    return projects.find((p) => p.id === parseInt(formData.project_id)) ?? null;
  }, [formData.project_id, projects]);
  const remainingBudget = useMemo(() => {
    if (!selectedProject) return null;
    return (selectedProject.allowance_budget ?? 0) - (selectedProject.used_allowance_budget ?? 0);
  }, [selectedProject]);
  remainingBudget !== null && formData.amount > remainingBudget;
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Buat Allowance" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "-ml-2", children: /* @__PURE__ */ jsx(Link, { href: "/reimbursements", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight", children: isEdit ? "Edit Draft Allowance" : "Form Pengajuan Allowance" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: isEdit ? "Perbarui data draf tunjangan proyek Anda." : "Lengkapi data untuk mengajukan uang saku atau tunjangan proyek." })
        ] })
      ] }),
      errors._general && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700", children: errors._general[0] }),
      /* @__PURE__ */ jsx(Card, { className: "border-none shadow-sm rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        handleSubmit();
      }, children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Data Pemohon" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Informasi data diri Anda saat ini." }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-3 space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "code", children: "Nomor Allowance" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "code",
                  name: "code",
                  placeholder: "Masukkan Nomor Allowance (opsional)",
                  className: cn("h-10", errors.code ? "border-red-500" : ""),
                  value: formData.code,
                  onChange: handleChange
                }
              ),
              errors.code && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.code[0] })
            ] }),
            hasRole(["hr", "superadmin"]) && /* @__PURE__ */ jsxs("div", { className: "md:col-span-3 space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "user_id", children: "Pilih Pegawai (Pemohon)" }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: users.map((u) => ({ value: u.id.toString(), label: `${u.nip ?? "-"} - ${u.name}` })),
                  value: formData.user_id,
                  onValueChange: handleUserChange,
                  placeholder: "Cari pegawai..."
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Opsi ini hanya muncul untuk peran HR." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Nama Lengkap" }),
              /* @__PURE__ */ jsx(Input, { value: formData.name, readOnly: true, className: "bg-muted/50 border-transparent font-medium" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "NIP" }),
              /* @__PURE__ */ jsx(Input, { value: formData.nip, readOnly: true, className: "bg-muted/50 border-transparent font-medium" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Tanggal Bergabung" }),
              /* @__PURE__ */ jsx(Input, { value: formData.join_date, readOnly: true, className: "bg-muted/50 border-transparent font-medium" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Posisi / Jabatan" }),
              /* @__PURE__ */ jsx(Input, { value: formData.position, readOnly: true, className: "bg-muted/50 border-transparent font-medium" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Divisi" }),
              /* @__PURE__ */ jsx(Input, { value: formData.division_name, readOnly: true, className: "bg-muted/50 border-transparent font-medium" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Detail Pengajuan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Pilih proyek dan tentukan nominal allowance yang diajukan." }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "project_id", children: [
                  "Nama Project ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  SearchableSelect,
                  {
                    options: projects.map((p) => ({ value: p.id.toString(), label: `${p.code} - ${p.name}` })),
                    value: formData.project_id,
                    onValueChange: handleProjectChange,
                    placeholder: "Pilih project"
                  }
                ),
                errors.project_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.project_id[0] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "divisi", children: "Divisi Project" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Building2, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsx(Input, { id: "divisi", name: "divisi", className: "pl-9 h-10 bg-muted/30", value: formData.divisi, readOnly: true, placeholder: "Divisi project otomatis terisi" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 lg:col-span-1 border-r pr-4", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "start_date", children: [
                  "Tanggal Berangkat ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  DatePicker,
                  {
                    value: formData.start_date,
                    onChange: (v) => handleValueChange("start_date", v),
                    error: !!errors.start_date
                  }
                ),
                errors.start_date && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.start_date[0] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 lg:col-span-1", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "start_time", children: [
                  "Jam ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "time",
                    id: "start_time",
                    name: "start_time",
                    value: formData.start_time,
                    onChange: handleChange,
                    className: "h-10"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 lg:col-span-1 border-r pr-4", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "end_date", children: [
                  "Tanggal Kembali ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  DatePicker,
                  {
                    value: formData.end_date,
                    onChange: (v) => handleValueChange("end_date", v),
                    error: !!errors.end_date
                  }
                ),
                errors.end_date && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.end_date[0] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 lg:col-span-1", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "end_time", children: [
                  "Jam ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "time",
                    id: "end_time",
                    name: "end_time",
                    value: formData.end_time,
                    onChange: handleChange,
                    className: "h-10"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 text-blue-700 px-4 py-2.5 rounded-md flex items-center justify-between border border-blue-100 h-10 lg:col-span-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Durasi:" }),
                /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
                  totalDays,
                  " Hari"
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Rencana Penggunaan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Jelaskan keperluan allowance dan tingkat urgensi." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "usage_plan", children: [
              "Keterangan Keperluan ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(Textarea, { id: "usage_plan", name: "usage_plan", placeholder: "Jelaskan detail agenda dan tujuan perjalanan...", className: "min-h-[120px] resize-y", value: formData.usage_plan, onChange: handleChange }),
            errors.usage_plan && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.usage_plan[0] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold mb-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-muted-foreground" }),
            " Dokumen Pendukung ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Unggah dokumen pendukung untuk allowance." }),
          /* @__PURE__ */ jsx(FileUploadDropzone, { className: "w-full", onFilesChange: (files) => setAttachmentFile(files[0] ?? null) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-4 italic", children: "Format: PDF, JPG, PNG (Max 5MB). Lampirkan bukti pendukung jika ada." })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Persetujuan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Pilih pihak yang akan menyetujui pengajuan ini." }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "approver_head_id", children: [
              "Head Approver ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              SearchableSelect,
              {
                options: (approvers["head"] || []).map((u) => ({ value: u.id.toString(), label: u.name })),
                value: formData.approver_head_id,
                onValueChange: (val) => handleValueChange("approver_head_id", val),
                placeholder: "Pilih Head Divisi"
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "px-6 md:px-8 pb-8 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-amber-800 font-medium mb-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
            " Catatan Penting:"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-700 leading-relaxed", children: "Pastikan nominal allowance yang diajukan sudah sesuai dengan rencana penggunaan dan plafon anggaran proyek yang tersedia. Dokumen pendukung akan membantu mempercepat proses peninjauan oleh pihak penyetuju." })
        ] }) }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: loading && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
            " Menyimpan..."
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", disabled: loading, onClick: () => handleSubmit("draft"), children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
              " ",
              isEdit ? "Update Draft" : "Simpan Draft"
            ] }) }),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, className: "bg-sidebar hover:bg-sidebar/90 min-w-[180px]", children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
              " ",
              isEdit ? "Update & Ajukan Allowance" : "Ajukan Allowance"
            ] }) })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  CreateAllowance as default
};
