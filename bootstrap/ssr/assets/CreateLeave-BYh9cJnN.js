import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { C as Card, f as CardFooter } from "./card-DAjHeOuX.js";
import { ArrowLeft, FileText, Loader2, Save } from "lucide-react";
import { S as Separator } from "./separator-CjIBof9L.js";
import { F as FileUploadDropzone } from "./FileUploadDropzone-Cbnvbv0c.js";
import { D as DatePicker } from "./DatePicker-DAaV_rdH.js";
import axios from "axios";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "./use-permission-D0a8sZAO.js";
import "date-fns";
import "date-fns/locale";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "@radix-ui/react-separator";
import "react-number-format";
const LEAVE_TYPES = [
  { label: "Cuti Tahunan", value: "annual" },
  { label: "Cuti Sakit", value: "sick" },
  { label: "Cuti Menikah", value: "wedding" },
  { label: "Cuti Melahirkan", value: "birth" },
  { label: "Cuti Berduka", value: "berduka" },
  { label: "Cuti Alasan Penting", value: "important" },
  { label: "Cuti Tanpa Gaji", value: "unpaid" }
];
function CreateLeave({ authUser, projects, users, approvers }) {
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Cuti", href: "/leaves" },
    { title: "Pengajuan Cuti", href: "/leaves/create" }
  ];
  const [formData, setFormData] = useState({
    project_id: "",
    lokasi: "",
    phone: "",
    replacement_pic_id: "",
    type: "annual",
    start_date: "",
    end_date: "",
    approver_head_id: "",
    reason: ""
  });
  const [totalDays, setTotalDays] = useState(0);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (start <= end) {
        let days = 0;
        const date = new Date(start);
        while (date <= end) {
          if (date.getDay() !== 0 && date.getDay() !== 6) {
            days++;
          }
          date.setDate(date.getDate() + 1);
        }
        setTotalDays(days);
      } else {
        setTotalDays(0);
      }
    } else {
      setTotalDays(0);
    }
  }, [formData.start_date, formData.end_date]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleValueChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const fd = new FormData();
      fd.append("type", formData.type);
      fd.append("start_date", formData.start_date);
      fd.append("end_date", formData.end_date);
      if (formData.project_id) fd.append("project_id", formData.project_id);
      if (formData.replacement_pic_id) fd.append("replacement_pic_id", formData.replacement_pic_id);
      if (formData.approver_head_id) fd.append("approver_head_id", formData.approver_head_id);
      if (formData.phone) fd.append("phone", formData.phone);
      if (formData.lokasi) fd.append("lokasi", formData.lokasi);
      if (formData.reason) fd.append("reason", formData.reason);
      if (attachmentFile) fd.append("attachment", attachmentFile);
      await axios.post("/api/v1/leaves", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      router.visit("/leaves");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        setErrors(error.response.data.errors ?? {});
      } else if (axios.isAxiosError(error)) {
        setErrors({ _general: [error.response?.data?.message ?? "Terjadi kesalahan."] });
      }
      setLoading(false);
    }
  };
  const isExceedingQuota = formData.type === "annual" && typeof authUser.remaining_annual_leaves === "number" && totalDays > authUser.remaining_annual_leaves;
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Ajukan Cuti" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "-ml-2", children: /* @__PURE__ */ jsx(Link, { href: "/leaves", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight", children: "Form Pengajuan Cuti" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Lengkapi data di bawah ini untuk mengajukan cuti." })
        ] })
      ] }),
      errors._general && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700", children: errors._general[0] }),
      /* @__PURE__ */ jsx(Card, { className: "border-none shadow-sm rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Data Pemohon" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Informasi data diri Anda saat ini." }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Nama Lengkap" }),
              /* @__PURE__ */ jsx(Input, { value: authUser.name, readOnly: true, className: "bg-muted/50 border-transparent font-medium" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "NIP / NIK" }),
              /* @__PURE__ */ jsx(Input, { value: authUser.nip, readOnly: true, className: "bg-muted/50 border-transparent font-medium" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Tanggal Bergabung" }),
              /* @__PURE__ */ jsx(Input, { value: authUser.join_date, readOnly: true, className: "bg-muted/50 border-transparent font-medium" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Posisi / Jabatan" }),
              /* @__PURE__ */ jsx(Input, { value: authUser.position, readOnly: true, className: "bg-muted/50 border-transparent font-medium" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Divisi" }),
              /* @__PURE__ */ jsx(Input, { value: authUser.division_name, readOnly: true, className: "bg-muted/50 border-transparent font-medium" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Detail Pengajuan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Isi detail lengkap mengenai rencana cuti Anda." }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "type", children: [
                  "Jenis Cuti ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  SearchableSelect,
                  {
                    options: LEAVE_TYPES,
                    value: formData.type,
                    onValueChange: (val) => handleSelectChange("type", val),
                    placeholder: "Pilih jenis cuti"
                  }
                ),
                errors.type && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.type[0] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "project_id", children: "Nama Project (Jika ada)" }),
                /* @__PURE__ */ jsx(
                  SearchableSelect,
                  {
                    options: projects.map((p) => ({ label: `${p.code} - ${p.name}`, value: p.id.toString() })),
                    value: formData.project_id,
                    onValueChange: (val) => handleSelectChange("project_id", val),
                    placeholder: "Pilih project"
                  }
                ),
                errors.project_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.project_id[0] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 items-end", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "start_date", children: [
                  "Tanggal Mulai ",
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
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "end_date", children: [
                  "Tanggal Selesai ",
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
              /* @__PURE__ */ jsx("div", { className: `bg-blue-50 text-blue-700 px-4 py-2.5 rounded-md flex flex-col justify-center border h-10 ${isExceedingQuota ? "border-red-300 bg-red-50 text-red-700" : "border-blue-100"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Total Cuti:" }),
                /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
                  totalDays,
                  " Hari"
                ] })
              ] }) })
            ] }),
            isExceedingQuota && /* @__PURE__ */ jsxs("div", { className: "text-xs text-red-500 font-medium", children: [
              "Total hari cuti melebihi sisa kuota Cuti Tahunan Anda (",
              authUser.remaining_annual_leaves,
              " Hari)."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "replacement_pic_id", children: [
                  "Pengganti PIC Cuti ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  SearchableSelect,
                  {
                    options: users.map((u) => ({ value: u.id.toString(), label: u.name })),
                    value: formData.replacement_pic_id,
                    onValueChange: (val) => handleSelectChange("replacement_pic_id", val),
                    placeholder: "Pilih pengganti PIC"
                  }
                ),
                errors.replacement_pic_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.replacement_pic_id[0] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "phone", children: [
                  "No. HP (Dapat dihubungi) ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(Input, { id: "phone", name: "phone", placeholder: "Contoh: 08123456789", value: formData.phone, onChange: handleChange, className: "h-10" }),
                errors.phone && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.phone[0] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              authUser.is_pegawai && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "approver_head_id", children: [
                  "Head Approver ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  SearchableSelect,
                  {
                    options: (approvers["head"] || []).map((u) => ({ value: u.id.toString(), label: u.name })),
                    value: formData.approver_head_id,
                    onValueChange: (val) => handleSelectChange("approver_head_id", val),
                    placeholder: "Pilih Head Divisi Anda"
                  }
                ),
                errors.approver_head_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.approver_head_id[0] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "lokasi", children: [
                  "Alamat Selama Cuti ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(Input, { id: "lokasi", name: "lokasi", placeholder: "Alamat lengkap tempat anda menghabiskan cuti", value: formData.lokasi, onChange: handleChange, className: "h-10" }),
                errors.lokasi && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.lokasi[0] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "reason", children: [
                "Alasan Cuti ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(Textarea, { id: "reason", name: "reason", placeholder: "Jelaskan secara rinci alasan pengajuan cuti Anda...", value: formData.reason, onChange: handleChange, className: "min-h-[100px] resize-y" }),
              errors.reason && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.reason[0] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
                " Dokumen Pendukung (Opsional)"
              ] }),
              /* @__PURE__ */ jsx(FileUploadDropzone, { className: "w-full", onFilesChange: (files) => setAttachmentFile(files[0] ?? null) }),
              errors.attachment && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.attachment[0] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Format: PDF, JPG, PNG (Max 5MB). Lampirkan surat dokter jika cuti sakit." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-800 font-medium mb-1", children: "Catatan Penting:" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-700", children: "Jika didalam masa cuti terdapat tanggal merah/ libur dari perusahaan, harap memisahkan pengajuan cuti, contoh: range cuti 2-5 Februari, pada tanggal 3 februari terdapat tanggal merah/ libur perusahaan, maka ajukan cuti tanggal 2 dan ajukan lagi untuk tanggal 4-5" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: loading && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
            " Menyimpan..."
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, size: "lg", children: /* @__PURE__ */ jsx(Link, { href: "/leaves", children: "Batal" }) }),
            /* @__PURE__ */ jsx(Button, { type: "submit", size: "lg", disabled: loading || totalDays <= 0 || isExceedingQuota, className: "bg-sidebar hover:bg-sidebar/90 min-w-[150px]", children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
              " Ajukan Cuti"
            ] }) })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  CreateLeave as default
};
