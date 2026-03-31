import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useState, useMemo } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { Head, Link } from "@inertiajs/react";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { C as Card, f as CardFooter } from "./card-DAjHeOuX.js";
import { ArrowLeft, User, UserCheck, Building2, Trash2, CheckCircle, Plus, Save, Info, Upload, Briefcase, Loader2 } from "lucide-react";
import { F as FileUploadDropzone } from "./FileUploadDropzone-Cbnvbv0c.js";
import { M as MoneyInput } from "./MoneyInput-Y8EKpX5J.js";
import { S as Separator } from "./separator-CjIBof9L.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
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
import "react-number-format";
import "@radix-ui/react-separator";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "./reimbursement-service-BqypCIIo.js";
const fmt = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
function CreateEER({ atrs = [], approvers = {}, users = [], expenseTypes = [], reimbursement, isEdit = false }) {
  const { authUser, loading, errors, setErrors, clearFieldError, submitReimbursement } = useReimbursementForm([]);
  const { hasRole } = usePermission();
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    user_id: "",
    name: authUser?.name ?? "",
    nip: authUser?.nip ?? "",
    atr_id: "",
    project_id: "",
    project_name: "",
    division: "",
    pic: "",
    approver_head_id: "",
    description: "",
    eer_type: "refund",
    refund_reimburse_amount: 0
  });
  const [transferProof, setTransferProof] = useState(null);
  React__default.useEffect(() => {
    if (isEdit && reimbursement) {
      const data = reimbursement.data || reimbursement;
      setFormData({
        code: data.code || "",
        user_id: data.user?.id?.toString() ?? "",
        name: data.user?.name || "",
        nip: data.nip || "",
        atr_id: data.atr_id?.toString() ?? "",
        project_id: data.project?.id?.toString() ?? "",
        project_name: data.project?.name || "",
        division: data.project?.division_name || "",
        pic: data.project?.pic_name || "",
        approver_head_id: data.approvals?.find((a) => a.role === "head")?.approver_id?.toString() ?? "",
        description: data.usage_plan || "",
        eer_type: data.eer_type || "refund",
        refund_reimburse_amount: data.amount || 0
      });
      if (data.items && data.items.length > 0) {
        setItems(data.items.map((item) => ({
          id: item.id?.toString() || crypto.randomUUID(),
          project_budget_detail_id: item.activity_id,
          item_name: item.item_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
          expense_type: item.expense_type || "",
          receipt: null,
          // Keep receipt as null since we can't easily repopulate File object from URL
          notes: item.notes || ""
        })));
      }
    }
  }, [isEdit, reimbursement]);
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Keuangan", href: "/reimbursements" },
    { title: "Buat EER", href: "/reimbursements/create/eer" }
  ];
  const handleAtrChange = (value) => {
    const selected = atrs.find((a) => a.id.toString() === value);
    if (!selected) return;
    clearFieldError("atr_id");
    setItems([{
      id: crypto.randomUUID(),
      project_budget_detail_id: "",
      item_name: "",
      quantity: 1,
      unit_price: 0,
      amount: 0,
      expense_type: "",
      receipt: null,
      notes: ""
    }]);
    setFormData((prev) => ({
      ...prev,
      atr_id: value,
      project_id: selected.project_id?.toString() ?? "",
      project_name: selected.project_name ?? "-",
      division: selected.division_name ?? "",
      pic: selected.pic_name ?? "",
      approver_head_id: selected.approver_head_id?.toString() ?? "",
      description: selected.usage_plan ?? ""
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
  const selectedAtr = useMemo(() => {
    if (!formData.atr_id) return null;
    return atrs.find((a) => a.id.toString() === formData.atr_id) ?? null;
  }, [formData.atr_id, atrs]);
  const availableActivities = useMemo(() => {
    if (!selectedAtr) return [];
    const map = /* @__PURE__ */ new Map();
    selectedAtr.items.forEach((item) => {
      if (!map.has(item.activity_id)) {
        map.set(item.activity_id, { id: item.activity_id, name: item.activity_name });
      }
    });
    return Array.from(map.values());
  }, [selectedAtr]);
  const addItem = () => {
    setItems((prev) => [...prev, {
      id: crypto.randomUUID(),
      project_budget_detail_id: "",
      item_name: "",
      quantity: 1,
      unit_price: 0,
      amount: 0,
      expense_type: "",
      receipt: null,
      notes: ""
    }]);
  };
  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };
  const updateItem = (id, field, value) => {
    setItems((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      const updated = { ...i, [field]: value };
      if (field === "quantity" || field === "unit_price") {
        updated.amount = (updated.quantity || 1) * (updated.unit_price || 0);
      }
      return updated;
    }));
  };
  const totalEerAmount = useMemo(() => {
    return items.reduce((sum, i) => sum + (i.amount || 0), 0);
  }, [items]);
  const eerCalculation = useMemo(() => {
    if (!selectedAtr) return { type: "refund", amount: 0 };
    const diff = totalEerAmount - selectedAtr.amount;
    return {
      type: diff > 0 ? "reimbursement" : "refund",
      amount: Math.abs(diff)
    };
  }, [totalEerAmount, selectedAtr]);
  const handleSubmit = async (status = "submitted") => {
    if (status === "submitted") {
      if (items.length === 0 || totalEerAmount <= 0) {
        setErrors({ _general: ["Tambahkan minimal 1 item pengeluaran."] });
        return;
      }
      const isInvalid = items.some(
        (i) => !i.project_budget_detail_id || !i.item_name.trim() || i.quantity <= 0 || i.unit_price <= 0 || !i.expense_type || !i.receipt
      );
      if (isInvalid) {
        setErrors({ _general: ["Semua detail item (Kegiatan, Nama, Qty, Harga, Jenis, Kwitansi) wajib diisi."] });
        return;
      }
      if (eerCalculation.type === "refund" && !transferProof) {
        setErrors({ _general: ["Bukti transfer refund wajib diunggah."] });
        return;
      }
      if (!formData.approver_head_id) {
        setErrors({ _general: ["Head Approver wajib dipilih."] });
        return;
      }
    }
    const payloadItems = items.map((i) => ({
      project_budget_detail_id: Number(i.project_budget_detail_id),
      item_name: i.item_name,
      quantity: i.quantity,
      unit_price: i.unit_price,
      amount: i.amount,
      expense_type: i.expense_type,
      receipt: i.receipt ?? void 0,
      notes: i.notes || void 0
    }));
    await submitReimbursement({
      code: formData.code,
      type: "eer",
      status,
      eer_type: eerCalculation.type,
      refund_reimburse_amount: eerCalculation.amount,
      atr_id: formData.atr_id,
      project_id: formData.project_id,
      approver_head_id: formData.approver_head_id,
      amount: totalEerAmount,
      usage_plan: formData.description,
      items: payloadItems,
      transfer_proof: transferProof,
      user_id: formData.user_id || void 0,
      is_edit: isEdit,
      reimbursement_id: isEdit ? reimbursement.data?.id || reimbursement.id : void 0
    });
  };
  !!formData.atr_id;
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Buat EER" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "-ml-2", children: /* @__PURE__ */ jsx(Link, { href: "/reimbursements", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight", children: isEdit ? "Edit Draft EER" : "Pengajuan EER (Baru)" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Employee Expense Report — klaim biaya aktual berdasarkan limit ATR." })
        ] })
      ] }),
      errors._general && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700", children: errors._general[0] }),
      /* @__PURE__ */ jsx(Card, { className: "border-none shadow-sm rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        handleSubmit();
      }, children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Informasi Karyawan & ATR" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Pilih ATR yang akan diselesaikan menggunakan EER." }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-3 space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "code", children: "Nomor EER" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "code",
                  name: "code",
                  placeholder: "Masukkan Nomor EER (opsional)",
                  className: cn("h-10", errors.code ? "border-red-500" : ""),
                  value: formData.code,
                  onChange: handleChange
                }
              ),
              errors.code && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.code[0] })
            ] }),
            hasRole(["finance", "superadmin"]) && /* @__PURE__ */ jsxs("div", { className: "md:col-span-3 space-y-2", children: [
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
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Opsi ini hanya muncul untuk peran Finance." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nama Lengkap" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { id: "name", name: "name", className: "pl-9 h-10 bg-muted/30", value: formData.name, readOnly: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "nip", children: "NIP" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(UserCheck, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { id: "nip", name: "nip", className: "pl-9 h-10 bg-muted/30", value: formData.nip, readOnly: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "atr_id", children: "Pilih ATR" }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: atrs.map((atr) => ({
                    value: atr.id.toString(),
                    label: `${atr.code} — ${fmt(atr.amount)} (${atr.project_name})`
                  })),
                  value: formData.atr_id,
                  onValueChange: handleAtrChange,
                  placeholder: "Pilih ATR terkait"
                }
              ),
              errors.atr_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.atr_id[0] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Nama Project" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Building2, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { className: "pl-9 h-10 bg-muted/30", value: formData.project_name, readOnly: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Divisi" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Building2, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { className: "pl-9 h-10 bg-muted/30", value: formData.division, readOnly: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "PIC" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(UserCheck, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { className: "pl-9 h-10 bg-muted/30", value: formData.pic, readOnly: true })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Rincian Pengeluaran Aktual (EER)" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Input pengeluaran aktual secara manual. Semua detail item (Kegiatan, Nama, Qty, Harga, Jenis, Kwitansi) wajib diisi sesuai bukti pembayaran." })
            ] }),
            selectedAtr && /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border p-3 rounded-lg text-right", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium", children: "Limit ATR Tersedia" }),
              /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-slate-800", children: fmt(selectedAtr.amount) })
            ] })
          ] }),
          selectedAtr ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            items.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "border rounded-xl bg-slate-50/30 p-4 md:p-6 relative transition-all hover:border-blue-200 hover:shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 pb-2 border-b border-dashed", children: [
                /* @__PURE__ */ jsxs("h5", { className: "font-bold text-sm text-blue-900 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]", children: idx + 1 }),
                  "Item Pengeluaran"
                ] }),
                items.length > 1 && /* @__PURE__ */ jsxs(Button, { type: "button", variant: "ghost", size: "sm", className: "h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50", onClick: () => removeItem(item.id), children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5 mr-1" }),
                  " Hapus"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "md:col-span-12 lg:col-span-5 space-y-2", children: [
                  /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1", children: [
                    "Pilih Kegiatan ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    SearchableSelect,
                    {
                      options: availableActivities.map((act) => ({ value: act.id.toString(), label: act.name })),
                      value: item.project_budget_detail_id.toString(),
                      onValueChange: (v) => updateItem(item.id, "project_budget_detail_id", parseInt(v)),
                      placeholder: "Pilih kegiatan dari ATR..."
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "md:col-span-12 lg:col-span-7 space-y-2", children: [
                  /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1", children: [
                    "Nama Barang / Pengeluaran ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      value: item.item_name,
                      onChange: (e) => updateItem(item.id, "item_name", e.target.value),
                      placeholder: "Contoh: Tiket Pesawat JKT-SUB",
                      className: "h-10 text-sm bg-white"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "md:col-span-4 lg:col-span-2 space-y-2", children: [
                  /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1", children: [
                    "Qty ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "number",
                      min: "1",
                      value: item.quantity || "",
                      onChange: (e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0),
                      className: "h-10 text-sm bg-white"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "md:col-span-8 lg:col-span-4 space-y-2", children: [
                  /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1", children: [
                    "Harga Satuan ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    MoneyInput,
                    {
                      value: item.unit_price,
                      onValueChange: (v) => updateItem(item.id, "unit_price", v.floatValue ?? 0),
                      placeholder: "0",
                      className: "h-10 text-sm bg-white"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "md:col-span-12 lg:col-span-3 space-y-2", children: [
                  /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1", children: [
                    "Jenis Expense ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    SearchableSelect,
                    {
                      options: expenseTypes.map((t) => ({ value: t.value, label: t.label })),
                      value: item.expense_type,
                      onValueChange: (v) => updateItem(item.id, "expense_type", v),
                      placeholder: "Pilih...",
                      className: "h-10"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "md:col-span-12 lg:col-span-3 space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500", children: "Jumlah Total" }),
                  /* @__PURE__ */ jsx("div", { className: "h-10 bg-emerald-50 border border-emerald-100 rounded-md flex items-center px-4 font-bold text-emerald-800 text-sm", children: fmt(item.amount) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "md:col-span-12 lg:col-span-6 space-y-2", children: [
                  /* @__PURE__ */ jsxs(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1", children: [
                    "KWITANSI / BUKTI PEMBAYARAN ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    FileUploadDropzone,
                    {
                      className: "bg-white h-[120px] overflow-hidden rounded-lg",
                      onFilesChange: (files) => updateItem(item.id, "receipt", files[0] ?? null)
                    }
                  ),
                  item.receipt && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-100", children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3" }),
                    " Terlampir: ",
                    item.receipt.name
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "md:col-span-12 lg:col-span-6 space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold uppercase tracking-wider text-slate-500", children: "CATATAN TAMBAHAN" }),
                  /* @__PURE__ */ jsx(
                    Textarea,
                    {
                      value: item.notes,
                      onChange: (e) => updateItem(item.id, "notes", e.target.value),
                      placeholder: "Keterangan tambahan untuk item ini...",
                      className: "min-h-[120px] text-sm resize-none bg-white font-normal"
                    }
                  )
                ] })
              ] })
            ] }, item.id)),
            /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", className: "w-full border-dashed h-12 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50", onClick: addItem, children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
              " Tambah Item Pengeluaran Baru"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-5 flex items-center justify-between mt-4 bg-slate-900 shadow-lg relative overflow-hidden", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-1", children: "Total Klaim EER Keseluruhan" }),
                  /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-white font-mono", children: fmt(totalEerAmount) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center relative z-10", children: /* @__PURE__ */ jsx(Save, { className: "h-6 w-6 text-emerald-400" }) }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 p-6 border rounded-xl bg-slate-50/50 space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "text-sm font-bold flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Info, { className: "h-4 w-4 text-blue-600" }),
                      " Hasil Kalkulasi EER"
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: cn(
                      "flex items-center space-x-2 p-3 rounded-lg border bg-blue-50/30 border-blue-200"
                    ), children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: eerCalculation.type === "refund" ? "Refund (Pengembalian Kelebihan)" : "Reimbursement (Kekurangan Dana)" }),
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: eerCalculation.type === "refund" ? "Total EER lebih kecil dari ATR. Selisih dana dikembalikan ke kantor." : "Total EER lebih besar dari ATR. Kantor akan membayarkan selisihnya." })
                    ] }) }) })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white border rounded-lg shadow-sm", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Selisih ATR & EER" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-500", children: totalEerAmount > (selectedAtr?.amount || 0) ? "EER > ATR" : "EER < ATR" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-lg font-bold font-mono text-slate-900 border-b pb-2 mb-2", children: fmt(eerCalculation.amount) }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-blue-800", children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold uppercase tracking-wider text-slate-500", children: [
                        "Nominal Otomatis (",
                        eerCalculation.type === "refund" ? "Refund" : "Reimburse",
                        ")"
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "h-10 text-lg font-bold flex items-center px-3 rounded-md bg-blue-50 border border-blue-100", children: fmt(eerCalculation.amount) }),
                      /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground italic", children: [
                        "*Nominal ini dikalkulasi otomatis dari selisih limit ATR (",
                        fmt(selectedAtr?.amount || 0),
                        ") dan total EER."
                      ] })
                    ] })
                  ] }) })
                ] }),
                eerCalculation.type === "refund" && eerCalculation.amount > 0 && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "text-sm font-bold flex items-center gap-2 text-rose-600", children: [
                      /* @__PURE__ */ jsx(Info, { className: "h-4 w-4" }),
                      " Informasi Rekening Refund (Socim Group)"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-xs bg-rose-50/50 border border-rose-100 p-4 rounded-lg", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "font-bold text-rose-800", children: "Rek Socim - PT Dampak Sosial Indonesia" }),
                        /* @__PURE__ */ jsx("p", { className: "text-rose-600 font-mono", children: "BCA 5035288896" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "font-bold text-rose-800", children: "Rek Lestari - Yayasan Biru Hijau lestari" }),
                        /* @__PURE__ */ jsx("p", { className: "text-rose-600 font-mono", children: "BNI 2023999001" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "font-bold text-rose-800", children: "Rek Sustim - Yayasan Dampak Keberlanjutan Indonesia" }),
                        /* @__PURE__ */ jsx("p", { className: "text-rose-600 font-mono", children: "BNI 2024111915" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "font-bold text-rose-800", children: "Rek Bamboo - PT Bamboo Karya Mandiri" }),
                        /* @__PURE__ */ jsx("p", { className: "text-rose-600 font-mono", children: "BCA 5035880001" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "font-bold text-rose-800", children: "Rek EBLI - Ekosistem Berdaya Lestari Indonesia, YYS" }),
                        /* @__PURE__ */ jsx("p", { className: "text-rose-600 font-mono", children: "Mandiri 1410055445050" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "text-sm font-bold flex items-center gap-2 text-emerald-600", children: [
                      /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
                      " Upload Bukti Transfer Refund ",
                      /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      FileUploadDropzone,
                      {
                        className: "h-[120px] bg-white border-2 border-dashed",
                        onFilesChange: (files) => setTransferProof(files[0] || null)
                      }
                    ),
                    transferProof && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-100", children: [
                      /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3" }),
                      " Terpilih: ",
                      transferProof.name
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground italic", children: "Harap transfer ke salah satu rekening di atas sesuai entitas project, kemudian lampirkan buktinya di sini." })
                  ] })
                ] })
              ] })
            ] }),
            errors._general && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium bg-red-50 p-2 rounded border border-red-100", children: errors._general[0] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "py-12 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50", children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "h-10 w-10 text-slate-300 mx-auto mb-3" }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium", children: "Pilih ATR terlebih dahulu untuk mulai memasukkan pengeluaran." })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Persetujuan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Pilih Head Approver. Finance dan Direktur akan diberikan secara otomatis sesuai sistem." }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { className: "text-sm font-medium flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-blue-600" }),
              " Head Approver"
            ] }),
            /* @__PURE__ */ jsx(
              SearchableSelect,
              {
                options: (approvers["head"] || []).map((u) => ({ value: u.id.toString(), label: u.name })),
                value: formData.approver_head_id,
                onValueChange: (val) => setFormData((p) => ({ ...p, approver_head_id: val })),
                placeholder: "Pilih Head Divisi"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Head divisi yang bertanggung jawab atas kegiatan ini." })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Keterangan Tambahan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Informasi detail mengenai klaim penggunaan EER." }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 max-w-2xl", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Keterangan Singkat" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "description",
                name: "description",
                placeholder: "Ceritakan singkat tentang klaim EER ini...",
                value: formData.description,
                onChange: handleChange,
                className: "min-h-[100px]"
              }
            ),
            errors.usage_plan && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.usage_plan[0] })
          ] })
        ] }),
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
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, className: "bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90", children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
              " ",
              isEdit ? "Update & Ajukan EER" : "Ajukan EER"
            ] }) })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  CreateEER as default
};
