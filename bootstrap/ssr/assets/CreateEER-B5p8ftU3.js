import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useState, useMemo } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-BRoV_jj3.js";
import { Head, Link } from "@inertiajs/react";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { C as Card, f as CardFooter } from "./card-DAjHeOuX.js";
import { ArrowLeft, User, UserCheck, Receipt, Building2, CheckCircle, Save, Info, Briefcase, Loader2 } from "lucide-react";
import { F as FileUploadDropzone } from "./FileUploadDropzone-BPjPwanR.js";
import { M as MoneyInput } from "./MoneyInput-Y8EKpX5J.js";
import { S as Separator } from "./separator-CjIBof9L.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { u as useReimbursementForm } from "./use-reimbursement-form-CoePhLnE.js";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
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
import "./reimbursement-service-CMPJzIka.js";
const fmt = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
function CreateEER({ atrs = [], approvers = {}, users = [], expenseTypes = [], reimbursement, isEdit = false }) {
  const { authUser, loading, uploadProgress, errors, setErrors, clearFieldError, submitReimbursement } = useReimbursementForm([]);
  const { hasRole } = usePermission();
  const [items, setItems] = useState([]);
  const [documents, setDocuments] = useState([]);
  const reimbursementData = reimbursement?.data || reimbursement;
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
      const data = reimbursementData;
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
          item_name: item.item_name || "Pengeluaran EER",
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0,
          amount: item.amount || 0,
          expense_type: item.expense_type || "",
          receipt: null,
          receipt_path: item.receipt_path,
          notes: item.notes || ""
        })));
      }
      if (data.documents && data.documents.length > 0) {
        setDocuments(data.documents.map((d) => ({
          id: crypto.randomUUID(),
          db_id: d.id,
          type: d.type || "other",
          file: null,
          original_name: d.original_name
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
    const firstAtrItem = selected.items && selected.items[0];
    const budgetDetailId = firstAtrItem ? firstAtrItem.activity_id : "";
    setItems([{
      id: crypto.randomUUID(),
      project_budget_detail_id: budgetDetailId,
      item_name: "Pengeluaran EER",
      quantity: 1,
      unit_price: 0,
      amount: 0,
      expense_type: firstAtrItem?.expense_type || "other",
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
  const hasAtrQueryParam = React__default.useMemo(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return !!params.get("atr_code");
    }
    return false;
  }, []);
  React__default.useEffect(() => {
    if (!isEdit && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const atrCode = params.get("atr_code");
      if (atrCode) {
        const foundAtr = atrs.find((a) => a.code === atrCode);
        if (foundAtr) {
          handleAtrChange(foundAtr.id.toString());
        }
      }
    }
  }, [isEdit, atrs]);
  useMemo(() => {
    if (!selectedAtr) return [];
    const map = /* @__PURE__ */ new Map();
    selectedAtr.items.forEach((item) => {
      if (!map.has(item.activity_id)) {
        map.set(item.activity_id, { id: item.activity_id, name: item.activity_name });
      }
    });
    return Array.from(map.values());
  }, [selectedAtr]);
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
  const handleExcelChange = (file) => {
    setDocuments((prev) => {
      const filtered = prev.filter((d) => d.type !== "excel");
      if (file) {
        return [...filtered, { id: crypto.randomUUID(), type: "excel", file, original_name: file.name }];
      }
      return filtered;
    });
  };
  const handleNominalChange = (value) => {
    setItems((prev) => {
      let budgetDetailId = "";
      if (selectedAtr && selectedAtr.items && selectedAtr.items[0]) {
        budgetDetailId = selectedAtr.items[0].activity_id;
      }
      const firstItem = prev[0] || {
        id: crypto.randomUUID(),
        project_budget_detail_id: budgetDetailId,
        item_name: "Pengeluaran EER",
        quantity: 1,
        unit_price: 0,
        amount: 0,
        expense_type: selectedAtr && selectedAtr.items && selectedAtr.items[0]?.expense_type || "other",
        receipt: null,
        notes: ""
      };
      return [{
        ...firstItem,
        unit_price: value,
        amount: value
      }];
    });
  };
  const totalEerAmount = useMemo(() => {
    return items.reduce((sum, i) => sum + (i.amount || 0), 0);
  }, [items]);
  const eerCalculation = useMemo(() => {
    if (!selectedAtr) return { type: "refund", amount: 0 };
    const diff = totalEerAmount - selectedAtr.amount;
    let type = "balance";
    if (diff > 0) type = "reimbursement";
    else if (diff < 0) type = "refund";
    return {
      type,
      amount: Math.abs(diff)
    };
  }, [totalEerAmount, selectedAtr]);
  const handleSubmit = async (status = "submitted") => {
    if (status === "submitted") {
      const firstItem = items[0];
      if (!firstItem || firstItem.amount <= 0) {
        setErrors({ _general: ["Nominal pengeluaran wajib diisi dan harus lebih besar dari 0."] });
        return;
      }
      const hasReceipt = firstItem.receipt || firstItem.receipt_path;
      if (!hasReceipt) {
        setErrors({ _general: ["Kwitansi / Bukti Pembayaran wajib diunggah."] });
        return;
      }
      const excelDoc = documents.find((d) => d.type === "excel");
      const hasExcel = excelDoc && (excelDoc.file || excelDoc.original_name);
      if (!hasExcel) {
        setErrors({ _general: ["File Excel (Detail Breakdown) wajib diunggah."] });
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
      receipt_path: i.receipt_path ?? void 0,
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
      reimbursement_id: isEdit ? reimbursementData?.id || reimbursement.id : void 0,
      documents: documents.filter((d) => d.file || d.db_id).map((d) => ({
        id: d.db_id,
        file: d.file ?? void 0,
        type: d.type
      }))
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
            hasAtrQueryParam ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "ATR Terpilih" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Receipt, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: "pl-9 h-10 bg-muted/30 font-semibold text-indigo-700 border-indigo-200",
                    value: selectedAtr ? `${selectedAtr.code} — Rp ${selectedAtr.amount.toLocaleString("id-ID")} (${selectedAtr.project_name})` : "Loading...",
                    readOnly: true
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
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
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Form Pengeluaran EER" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Isi detail pengeluaran EER dengan mengunggah spreadsheet Excel rincian dan bukti kwitansi." })
            ] }),
            selectedAtr && /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border p-3 rounded-lg text-right flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium", children: "Limit ATR Tersedia" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-slate-800", children: fmt(selectedAtr.amount) }),
                selectedAtr.transferred_amount != null && selectedAtr.transferred_amount > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "bg-blue-50 text-blue-700 border-blue-200 font-bold", children: [
                  "Transferred: ",
                  fmt(selectedAtr.transferred_amount)
                ] })
              ] })
            ] })
          ] }),
          selectedAtr ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            (() => {
              const firstItem = items[0] || {
                id: crypto.randomUUID(),
                unit_price: 0,
                receipt: null,
                notes: ""
              };
              const excelDoc = documents.find((d) => d.type === "excel");
              return /* @__PURE__ */ jsx("div", { className: "border rounded-xl bg-slate-50/30 p-4 md:p-6 transition-all hover:border-blue-200 hover:shadow-sm space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
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
                        onValueChange: (v) => handleNominalChange(v.floatValue ?? 0),
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
                        onChange: (e) => updateItem(firstItem.id, "notes", e.target.value),
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
                        onFilesChange: (files) => handleExcelChange(files[0] ?? null)
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
                        onFilesChange: (files) => updateItem(firstItem.id, "receipt", files[0] ?? null)
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
            })(),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-5 flex items-center justify-between mt-4 bg-slate-900 shadow-lg relative overflow-hidden", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-1", children: "Total Klaim EER Keseluruhan" }),
                  /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-white font-mono", children: fmt(totalEerAmount) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center relative z-10", children: /* @__PURE__ */ jsx(Save, { className: "h-6 w-6 text-emerald-400" }) }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-6 p-6 border rounded-xl bg-slate-50/50 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxs(Label, { className: "text-sm font-bold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Info, { className: "h-4 w-4 text-blue-600" }),
                    " Hasil Kalkulasi EER"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsx("div", { className: cn(
                    "flex items-center space-x-2 p-3 rounded-lg border",
                    eerCalculation.type === "refund" ? "bg-emerald-50/30 border-emerald-200" : eerCalculation.type === "balance" ? "bg-slate-50/30 border-slate-200" : "bg-blue-50/30 border-blue-200"
                  ), children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm", children: eerCalculation.type === "balance" ? "Balance (Sesuai Budget)" : eerCalculation.type === "refund" ? "Refund (Pengembalian Kelebihan)" : "Reimbursement (Kekurangan Dana)" }),
                    /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: eerCalculation.type === "refund" ? "Total EER lebih kecil dari ATR. Selisih dana dikembalikan ke kantor." : eerCalculation.type === "balance" ? "Total EER sesuai dengan budget ATR. Tidak ada pengembalian atau penambahan dana." : "Total EER lebih besar dari ATR. Kantor akan membayarkan selisihnya." })
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
                      eerCalculation.type === "refund" ? "Refund" : eerCalculation.type === "balance" ? "Balance" : "Reimburse",
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
              ] }) })
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
              " Head Approver",
              /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
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
      ] }) }),
      loading && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "h-28 w-28 rounded-full border-4 border-slate-100 flex items-center justify-center shadow-inner", children: /* @__PURE__ */ jsx(Loader2, { className: "h-12 w-12 text-blue-600 animate-spin" }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center flex-col", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-2xl text-slate-800", children: [
            uploadProgress,
            "%"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-800 mb-2", children: "Mengunggah Data" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 max-w-[250px] mx-auto", children: uploadProgress === 100 ? "Sedang memproses data, mohon tunggu sebentar..." : "Mengunggah file bukti pembayaran dan kwitansi..." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-blue-600 h-full transition-all duration-300 ease-out relative overflow-hidden",
            style: { width: `${uploadProgress}%` },
            children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/20", style: { transform: "skewX(-20deg) translateX(-100%)", animation: "shimmer 2s infinite" } })
          }
        ) })
      ] }) })
    ] })
  ] });
}
export {
  CreateEER as default
};
