import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useState, useMemo } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { Head, Link } from "@inertiajs/react";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { C as Card, f as CardFooter } from "./card-DAjHeOuX.js";
import { ArrowLeft, User, UserCheck, Building2, ChevronUp, ChevronDown, X, AlertCircle, Plus, Briefcase, Calendar, CreditCard, Loader2, Save } from "lucide-react";
import { S as Separator } from "./separator-CjIBof9L.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { R as RadioGroup, a as RadioGroupItem } from "./radio-group-fhmmkZJ4.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { M as MoneyInput } from "./MoneyInput-Y8EKpX5J.js";
import { F as FileUploadDropzone } from "./FileUploadDropzone-Cbnvbv0c.js";
import { u as useReimbursementForm } from "./use-reimbursement-form-D2Cjn_Sa.js";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-BkuvEnvZ.js";
import { D as DatePicker } from "./DatePicker-DAaV_rdH.js";
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
import "radix-ui";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "react-number-format";
import "./reimbursement-service-BqypCIIo.js";
const URGENCY_MAP = {
  low: "rendah",
  normal: "normal",
  high: "tinggi",
  urgent: "mendesak"
};
const fmt = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
function CreateATR({ projects, approvers, users = [], expenseTypes = [], reimbursement, isEdit = false }) {
  const { authUser, loading, errors, setErrors, getAutoFill, clearFieldError, submitReimbursement } = useReimbursementForm(projects);
  const { hasRole } = usePermission();
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    user_id: "",
    nama: authUser?.name ?? "",
    nip: authUser?.nip ?? "",
    project_id: "",
    divisi: "",
    pic_project: "",
    approver_head_id: "",
    approver_finance_id: "",
    approver_direktur_id: "",
    bank_name: "",
    account_number: "",
    account_name: "",
    usage_plan: "",
    urgency: "normal",
    start_date: "",
    end_date: ""
  });
  React__default.useEffect(() => {
    if (isEdit && reimbursement) {
      const data = reimbursement.data || reimbursement;
      const projectID = data.project?.id?.toString() ?? "";
      const autoFill = projectID ? getAutoFill(projectID) : { division: "", pic: "" };
      setFormData({
        code: data.code || "",
        user_id: data.user?.id?.toString() ?? "",
        nama: data.user?.name || "",
        nip: data.nip || "",
        project_id: projectID,
        divisi: autoFill.division || data.project?.division_name || "",
        pic_project: autoFill.pic || data.project?.pic_name || "",
        approver_head_id: data.approvals?.find((a) => a.role === "head")?.approver_id?.toString() ?? "",
        approver_finance_id: data.approvals?.find((a) => a.role === "finance")?.approver_id?.toString() ?? "",
        approver_direktur_id: data.approvals?.find((a) => a.role === "direktur")?.approver_id?.toString() ?? "",
        bank_name: data.bank_name || "",
        account_number: data.bank_account || "",
        account_name: data.account_holder || "",
        usage_plan: data.usage_plan || "",
        urgency: Object.keys(URGENCY_MAP).find((key) => URGENCY_MAP[key] === data.urgency) || "normal",
        start_date: data.start_date || "",
        end_date: data.end_date || ""
      });
      if (data.items && data.items.length > 0) {
        const activitiesMap = /* @__PURE__ */ new Map();
        data.items.forEach((item) => {
          const budgetDetailId = item.activity_id;
          if (!activitiesMap.has(budgetDetailId)) {
            activitiesMap.set(budgetDetailId, {
              budget_detail_id: budgetDetailId,
              expanded: true,
              detail_aktivitas: data.atr_budget_selecteds?.find((b) => b.project_budget_detail_id === budgetDetailId)?.notes || "",
              children: []
            });
          }
          activitiesMap.get(budgetDetailId)?.children.push({
            id: item.id?.toString() || crypto.randomUUID(),
            item_name: item.item_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
            expense_type: item.expense_type || "",
            notes: item.notes || ""
          });
        });
        setSelectedActivities(Array.from(activitiesMap.values()));
      }
    }
  }, [isEdit, reimbursement]);
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Keuangan", href: "/reimbursements" },
    { title: "Buat ATR", href: "/reimbursements/create/atr" }
  ];
  const handleProjectChange = (value) => {
    const autoFill = getAutoFill(value);
    setFormData((prev) => ({
      ...prev,
      project_id: value,
      divisi: autoFill.division,
      pic_project: autoFill.pic
    }));
    setSelectedActivities([]);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };
  const handleUserChange = (userId) => {
    const selectedUser = users.find((u) => u.id.toString() === userId);
    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        user_id: userId,
        nama: selectedUser.name,
        nip: selectedUser.nip ?? "-"
      }));
    }
    clearFieldError("user_id");
  };
  const selectedProject = useMemo(() => {
    if (!formData.project_id) return null;
    return projects.find((p) => p.id === parseInt(formData.project_id)) ?? null;
  }, [formData.project_id, projects]);
  const addActivity = (budgetDetailId) => {
    if (selectedActivities.find((a) => a.budget_detail_id === budgetDetailId)) return;
    setSelectedActivities((prev) => [...prev, {
      budget_detail_id: budgetDetailId,
      expanded: true,
      detail_aktivitas: "",
      children: [{ id: crypto.randomUUID(), item_name: "", quantity: 1, unit_price: 0, amount: 0, expense_type: "", notes: "" }]
    }]);
  };
  const removeActivity = (budgetDetailId) => {
    setSelectedActivities((prev) => prev.filter((a) => a.budget_detail_id !== budgetDetailId));
  };
  const toggleActivity = (budgetDetailId) => {
    setSelectedActivities((prev) => prev.map(
      (a) => a.budget_detail_id === budgetDetailId ? { ...a, expanded: !a.expanded } : a
    ));
  };
  const updateActivityDetail = (budgetDetailId, detail) => {
    setSelectedActivities((prev) => prev.map(
      (a) => a.budget_detail_id === budgetDetailId ? { ...a, detail_aktivitas: detail } : a
    ));
  };
  const handleValueChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };
  const addChildItem = (budgetDetailId) => {
    setSelectedActivities((prev) => prev.map((a) => {
      if (a.budget_detail_id !== budgetDetailId) return a;
      return { ...a, children: [...a.children, { id: crypto.randomUUID(), item_name: "", quantity: 1, unit_price: 0, amount: 0, expense_type: "", notes: "" }] };
    }));
  };
  const removeChildItem = (budgetDetailId, itemId) => {
    setSelectedActivities((prev) => prev.map((a) => {
      if (a.budget_detail_id !== budgetDetailId) return a;
      return { ...a, children: a.children.filter((c) => c.id !== itemId) };
    }));
  };
  const updateChildItem = (budgetDetailId, itemId, field, value) => {
    setSelectedActivities((prev) => prev.map((a) => {
      if (a.budget_detail_id !== budgetDetailId) return a;
      return {
        ...a,
        children: a.children.map((c) => {
          if (c.id !== itemId) return c;
          const updated = { ...c, [field]: value };
          if (field === "quantity" || field === "unit_price") {
            updated.amount = (updated.quantity || 1) * (updated.unit_price || 0);
          }
          return updated;
        })
      };
    }));
  };
  const getActivityChildrenTotal = (budgetDetailId) => {
    const activity = selectedActivities.find((a) => a.budget_detail_id === budgetDetailId);
    return activity?.children.reduce((sum, c) => sum + (c.amount || 0), 0) ?? 0;
  };
  const totalAmount = useMemo(() => {
    return selectedActivities.reduce((sum, a) => sum + a.children.reduce((s, c) => s + (c.amount || 0), 0), 0);
  }, [selectedActivities]);
  const remainingBudget = useMemo(() => {
    if (!selectedProject) return null;
    return (selectedProject.operational_budget ?? 0) - (selectedProject.used_operational_budget ?? 0);
  }, [selectedProject]);
  const budgetExceeded = remainingBudget !== null && totalAmount > remainingBudget;
  const availableActivities = useMemo(() => {
    if (!selectedProject?.budget_details) return [];
    return selectedProject.budget_details.filter(
      (bd) => !selectedActivities.find((a) => a.budget_detail_id === bd.id) && bd.remaining_amount > 0
    );
  }, [selectedProject, selectedActivities]);
  const handleSubmit = async (status = "submitted") => {
    if (status === "submitted") {
      if (selectedActivities.length === 0 || totalAmount <= 0) {
        setErrors({ amount: ["Tambahkan minimal 1 item pada kegiatan yang dipilih."] });
        return;
      }
      if (!formData.start_date) {
        setErrors({ start_date: ["Tanggal penggunaan wajib diisi."] });
        return;
      }
      if (!formData.approver_head_id) {
        setErrors({ _general: ["Head Approver wajib dipilih."] });
        return;
      }
      for (const activity of selectedActivities) {
        const detail = selectedProject?.budget_details?.find((bd) => bd.id === activity.budget_detail_id);
        if (detail) {
          const childTotal = activity.children.reduce((s, c) => s + (c.amount || 0), 0);
          if (childTotal > detail.remaining_amount) {
            setErrors({ amount: [`Total item pada kegiatan "${detail.item_name}" melebihi sisa anggaran (${fmt(detail.remaining_amount)}).`] });
            return;
          }
        }
      }
    }
    const items = selectedActivities.flatMap(
      (a) => a.children.filter((c) => c.amount > 0 && c.item_name).map((c) => ({
        project_budget_detail_id: a.budget_detail_id,
        item_name: c.item_name,
        quantity: c.quantity,
        unit_price: c.unit_price,
        amount: c.amount,
        expense_type: c.expense_type || void 0,
        notes: c.notes || void 0
      }))
    );
    const selected_budget_details = selectedActivities.map((a) => ({
      project_budget_detail_id: a.budget_detail_id,
      amount: a.children.reduce((s, c) => s + (c.amount || 0), 0),
      notes: a.detail_aktivitas || void 0
    })).filter((a) => a.amount > 0);
    await submitReimbursement({
      code: formData.code,
      type: "atr",
      project_id: formData.project_id,
      status,
      amount: totalAmount,
      bank_name: formData.bank_name,
      bank_account: formData.account_number,
      account_holder: formData.account_name,
      usage_plan: formData.usage_plan,
      urgency: URGENCY_MAP[formData.urgency] ?? "normal",
      start_date: formData.start_date || void 0,
      items,
      selected_budget_details,
      approver_head_id: formData.approver_head_id,
      user_id: formData.user_id || void 0,
      is_edit: isEdit,
      reimbursement_id: isEdit ? reimbursement.data?.id || reimbursement.id : void 0,
      documents: documents.filter((d) => d.file).map((d) => ({ file: d.file, type: d.type }))
    });
  };
  const isAutoFilled = !!formData.project_id;
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Buat ATR" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "-ml-2", children: /* @__PURE__ */ jsx(Link, { href: "/reimbursements", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight", children: isEdit ? "Edit Draft ATR" : "Pengajuan ATR" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: isEdit ? "Perbarui data draf Advance Travel Request Anda." : "Advance Travel Request untuk pengajuan dana di muka." })
        ] })
      ] }),
      errors._general && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700", children: errors._general[0] }),
      /* @__PURE__ */ jsx(Card, { className: "border-none shadow-sm rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        handleSubmit();
      }, children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Informasi Pemohon" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Data diri pemohon dan informasi proyek terkait." }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "code", children: "Nomor ATR" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "code",
                  name: "code",
                  placeholder: "Masukkan Nomor ATR (opsional)",
                  className: cn("h-10", errors.code ? "border-red-500" : ""),
                  value: formData.code,
                  onChange: handleChange
                }
              ),
              errors.code && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.code[0] })
            ] }),
            hasRole(["finance", "superadmin"]) && /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-2", children: [
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
              /* @__PURE__ */ jsx(Label, { htmlFor: "nama", children: "Nama Lengkap" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { id: "nama", name: "nama", className: "pl-9 h-10 bg-muted/30", value: formData.nama, readOnly: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "nip", children: "NIP" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(UserCheck, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { id: "nip", name: "nip", placeholder: "Nomor Induk Pegawai", className: "pl-9 h-10 bg-muted/30", value: formData.nip, readOnly: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "project_id", children: "Nama Project" }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: projects.map((p) => ({ value: p.id.toString(), label: `${p.code} - ${p.initial_project} - ${p.name}` })),
                  value: formData.project_id,
                  onValueChange: handleProjectChange,
                  placeholder: "Pilih proyek terkait"
                }
              ),
              errors.project_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.project_id[0] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "divisi", children: "Divisi" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Building2, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { id: "divisi", name: "divisi", className: "pl-9 h-10 bg-muted/30", value: formData.divisi, onChange: handleChange, readOnly: isAutoFilled })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "pic_project", children: "PIC Project" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(UserCheck, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { id: "pic_project", name: "pic_project", className: "pl-9 h-10 bg-muted/30", value: formData.pic_project, onChange: handleChange, readOnly: isAutoFilled })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Kegiatan & Item Anggaran" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Pilih kegiatan dari proyek, lalu tambahkan item detail untuk setiap kegiatan." }),
          selectedProject ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            availableActivities.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Tambah Kegiatan" }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: availableActivities.map((bd) => ({
                    value: bd.id.toString(),
                    label: `${bd.item_name} — Sisa: ${fmt(bd.remaining_amount)}`
                  })),
                  onValueChange: (v) => addActivity(parseInt(v)),
                  placeholder: "Pilih kegiatan yang akan diajukan..."
                }
              )
            ] }),
            selectedActivities.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground italic py-4 text-center", children: "Pilih kegiatan di atas untuk mulai menambahkan item." }),
            selectedActivities.map((activity) => {
              const detail = selectedProject.budget_details?.find((bd) => bd.id === activity.budget_detail_id);
              if (!detail) return null;
              const childTotal = getActivityChildrenTotal(activity.budget_detail_id);
              const overBudget = childTotal > detail.remaining_amount;
              return /* @__PURE__ */ jsxs("div", { className: "border rounded-xl overflow-hidden shadow-sm", children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: cn("flex items-center justify-between p-4 cursor-pointer transition-colors", overBudget ? "bg-red-50 hover:bg-red-100" : "bg-slate-50 hover:bg-slate-100"),
                    onClick: () => toggleActivity(activity.budget_detail_id),
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        activity.expanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-sm", children: detail.item_name }),
                          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                            "Pagu: ",
                            fmt(detail.amount_pelaksanaan && detail.amount_pelaksanaan > 0 ? detail.amount_pelaksanaan : detail.amount),
                            " · Terpakai: ",
                            fmt(detail.used_amount),
                            " · Sisa: ",
                            /* @__PURE__ */ jsx("span", { className: cn(overBudget && "text-red-600 font-bold"), children: fmt(detail.remaining_amount) })
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx("span", { className: cn("text-sm font-bold", overBudget ? "text-red-600" : "text-emerald-700"), children: fmt(childTotal) }),
                        /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "h-7 w-7 text-red-500 hover:text-red-700", onClick: (e) => {
                          e.stopPropagation();
                          removeActivity(activity.budget_detail_id);
                        }, children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
                      ] })
                    ]
                  }
                ),
                activity.expanded && /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4 bg-white", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 pb-2", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: [
                      "Detail Aktivitas ",
                      /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        value: activity.detail_aktivitas,
                        onChange: (e) => updateActivityDetail(activity.budget_detail_id, e.target.value),
                        placeholder: "Masukkan detail aktivitas untuk kegiatan ini...",
                        className: "h-9 text-sm",
                        required: true
                      }
                    )
                  ] }),
                  overBudget && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
                    /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsx(AlertTitle, { children: "Melebihi Sisa Anggaran" }),
                    /* @__PURE__ */ jsxs(AlertDescription, { children: [
                      "Total item (",
                      fmt(childTotal),
                      ") melebihi sisa anggaran kegiatan ini (",
                      fmt(detail.remaining_amount),
                      ")."
                    ] })
                  ] }),
                  activity.children.map((child, idx) => /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-4 space-y-3 bg-slate-50/50", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-muted-foreground", children: [
                        "Item #",
                        idx + 1
                      ] }),
                      activity.children.length > 1 && /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "h-6 w-6 text-red-500", onClick: () => removeChildItem(activity.budget_detail_id, child.id), children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "md:col-span-4 space-y-1", children: [
                        /* @__PURE__ */ jsxs(Label, { className: "text-xs", children: [
                          "Nama Item ",
                          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                        ] }),
                        /* @__PURE__ */ jsx(Input, { value: child.item_name, onChange: (e) => updateChildItem(activity.budget_detail_id, child.id, "item_name", e.target.value), placeholder: "Nama item...", className: "h-9 text-sm", required: true })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "md:col-span-1 space-y-1", children: [
                        /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Qty" }),
                        /* @__PURE__ */ jsx(Input, { type: "number", min: 1, value: child.quantity, onChange: (e) => updateChildItem(activity.budget_detail_id, child.id, "quantity", parseInt(e.target.value) || 1), className: "h-9 text-sm" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1", children: [
                        /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Nominal" }),
                        /* @__PURE__ */ jsx(MoneyInput, { value: child.unit_price, onValueChange: (v) => updateChildItem(activity.budget_detail_id, child.id, "unit_price", v.floatValue || 0), placeholder: "0", className: "h-9 text-sm" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1", children: [
                        /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Jumlah" }),
                        /* @__PURE__ */ jsx(Input, { value: fmt(child.amount), readOnly: true, className: "h-9 text-sm bg-muted/30 font-medium" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "md:col-span-3 space-y-1", children: [
                        /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Jenis Expense" }),
                        /* @__PURE__ */ jsx(
                          SearchableSelect,
                          {
                            options: expenseTypes.map((et) => ({ value: et.value, label: et.label })),
                            value: child.expense_type ?? void 0,
                            onValueChange: (v) => updateChildItem(activity.budget_detail_id, child.id, "expense_type", v),
                            placeholder: "Pilih...",
                            className: "h-9"
                          }
                        )
                      ] })
                    ] })
                  ] }, child.id)),
                  /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => addChildItem(activity.budget_detail_id), className: "gap-2 border-dashed", children: [
                    /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
                    " Tambah Item"
                  ] })
                ] })
              ] }, activity.budget_detail_id);
            }),
            /* @__PURE__ */ jsxs("div", { className: cn("border rounded-lg p-4 flex items-center justify-between", budgetExceeded ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"), children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: cn("text-sm font-medium", budgetExceeded ? "text-red-900" : "text-emerald-900"), children: "Total Pengajuan ATR" }),
                /* @__PURE__ */ jsxs("p", { className: cn("text-xs mt-0.5", budgetExceeded ? "text-red-700" : "text-emerald-700"), children: [
                  selectedActivities.reduce((s, a) => s + a.children.length, 0),
                  " item dari ",
                  selectedActivities.length,
                  " kegiatan"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("p", { className: cn("text-lg font-bold", budgetExceeded ? "text-red-900" : "text-emerald-900"), children: fmt(totalAmount) }),
                remainingBudget !== null && /* @__PURE__ */ jsxs("p", { className: cn("text-xs", budgetExceeded ? "text-red-700 font-bold" : "text-emerald-700"), children: [
                  "Sisa pagu operasional: ",
                  fmt(remainingBudget),
                  budgetExceeded && " (Melebihi!)"
                ] })
              ] })
            ] }),
            errors.amount && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.amount[0] })
          ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground italic", children: "Pilih proyek terlebih dahulu." })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Dokumen Pendukung" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Lampirkan dokumen pendukung seperti TOR, Invoice, atau dokumen lainnya (Opsional)." })
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: () => setDocuments((prev) => [...prev, { id: crypto.randomUUID(), file: null, type: "other" }]),
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
                  " Tambah Dokumen"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: documents.map((doc, index) => /* @__PURE__ */ jsxs("div", { className: "border rounded-xl p-4 bg-slate-50/50 space-y-3 relative", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                className: "h-6 w-6 absolute top-2 right-2 text-red-500 hover:bg-red-50",
                onClick: () => setDocuments((prev) => prev.filter((d) => d.id !== doc.id)),
                children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs uppercase font-bold text-muted-foreground", children: "Nama / Jenis Dokumen" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Contoh: TOR, Invoice, dll",
                  className: "h-9 bg-white text-sm",
                  value: doc.type,
                  onChange: (e) => setDocuments((prev) => prev.map((d) => d.id === doc.id ? { ...d, type: e.target.value } : d))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs uppercase font-bold text-muted-foreground", children: "File Dokumen" }),
              /* @__PURE__ */ jsx(
                FileUploadDropzone,
                {
                  className: "h-24 bg-white",
                  onFilesChange: (files) => setDocuments((prev) => prev.map((d) => d.id === doc.id ? { ...d, file: files[0] ?? null } : d))
                }
              ),
              doc.file && /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-emerald-600 font-medium truncate", children: [
                "Terlampir: ",
                doc.file.name
              ] })
            ] })
          ] }, doc.id)) }),
          documents.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-8 border border-dashed rounded-xl bg-slate-50/50", children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "h-8 w-8 text-slate-300 mx-auto mb-2" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 italic", children: "Belum ada dokumen tambahan yang dilampirkan." })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Rencana Penggunaan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Jelaskan rencana penggunaan dana, jadwal pemakaian, dan tingkat urgensi." }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "start_date", className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
                " Tanggal Penggunaan"
              ] }),
              /* @__PURE__ */ jsx(
                DatePicker,
                {
                  value: formData.start_date,
                  onChange: (v) => handleValueChange("start_date", v),
                  error: !!errors.start_date
                }
              ),
              errors.start_date && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.start_date[0] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "usage_plan", children: "Rencana untuk Penggunaannya" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  id: "usage_plan",
                  name: "usage_plan",
                  placeholder: "Jelaskan secara detail rencana penggunaan dana ATR ini...",
                  className: `min-h-[120px] resize-none ${errors.usage_plan ? "border-red-500 focus-visible:ring-red-500" : ""}`,
                  value: formData.usage_plan,
                  onChange: handleChange
                }
              ),
              errors.usage_plan && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 font-medium", children: errors.usage_plan[0] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Minimal 50 karakter" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs(Label, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
                " Opsi Urgensi"
              ] }),
              /* @__PURE__ */ jsxs(RadioGroup, { value: formData.urgency, onValueChange: (v) => setFormData((prev) => ({ ...prev, urgency: v })), children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors", children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: "low", id: "low" }),
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "low", className: "flex-1 cursor-pointer font-normal", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Rendah" }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Tidak mendesak, bisa diproses dalam waktu normal" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors", children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: "normal", id: "normal" }),
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "normal", className: "flex-1 cursor-pointer font-normal", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Normal" }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Urgensi standar, proses sesuai jadwal" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors", children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: "high", id: "high" }),
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "high", className: "flex-1 cursor-pointer font-normal", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Tinggi" }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Mendesak, perlu persetujuan cepat" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 p-3 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-50 transition-colors", children: [
                  /* @__PURE__ */ jsx(RadioGroupItem, { value: "urgent", id: "urgent" }),
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "urgent", className: "flex-1 cursor-pointer font-normal", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium text-red-700", children: "Sangat Mendesak" }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-red-600", children: "Prioritas tertinggi, butuh persetujuan segera" })
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Persetujuan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Informasi pihak yang akan menyetujui pengajuan ATR ini." }),
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
                onValueChange: (val) => handleSelectChange("approver_head_id", val),
                placeholder: "Pilih Head Divisi"
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Informasi Rekening" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Detail rekening tujuan pencairan dana." }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "bank_name", children: "Nama Bank" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(CreditCard, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { id: "bank_name", name: "bank_name", placeholder: "Contoh: BCA / Mandiri", className: "pl-9 h-10", value: formData.bank_name, onChange: handleChange })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "account_number", children: "Nomor Rekening" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(CreditCard, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { id: "account_number", name: "account_number", placeholder: "Nomor rekening tujuan", className: "pl-9 h-10", value: formData.account_number, onChange: handleChange })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "account_name", children: "Atas Nama" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(Input, { id: "account_name", name: "account_name", placeholder: "Nama pemilik rekening", className: "pl-9 h-10", value: formData.account_name, onChange: handleChange })
              ] })
            ] })
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
              " Simpan Draft"
            ] }) }),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, className: "bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90", children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              " Menyimpan..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
              " ",
              isEdit ? "Update & Ajukan ATR" : "Ajukan ATR"
            ] }) })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  CreateATR as default
};
