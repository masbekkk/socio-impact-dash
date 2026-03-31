import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, AlertCircle, ArrowRight, X, Plus } from "lucide-react";
import { usePage, Head, Link } from "@inertiajs/react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-BkuvEnvZ.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-C8TeAzVF.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent, f as CardFooter } from "./card-DAjHeOuX.js";
import { F as FileUploadDropzone } from "./FileUploadDropzone-Cbnvbv0c.js";
import { M as MoneyInput } from "./MoneyInput-Y8EKpX5J.js";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { L as LocationPicker } from "./LocationPicker-CPEtG7vQ.js";
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
import "date-fns";
import "date-fns/locale";
import "@radix-ui/react-label";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "react-number-format";
import "clsx";
import "tailwind-merge";
import "react-leaflet";
/* empty css                 */
import "leaflet";
function ProjectsCreate({ divisions, employees }) {
  const { url, props } = usePage();
  const { hasRole, hasPermission } = usePermission();
  props.auth?.user?.role_name ?? "user";
  const isAdminOrFinance = hasRole(["superadmin", "finance"]);
  props.auth?.permissions || [];
  hasPermission("create_code_project");
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const type = queryParams.get("type") || "active";
  const headUsers = employees.filter((emp) => emp.roles?.some((r) => r.name === "head"));
  employees.filter((emp) => emp.roles?.some((r) => r.name === "finance"));
  const picUsers = employees.filter((emp) => !emp.roles?.some((r) => r.name === "direktur"));
  const [step, setStep] = useState("basic");
  const [budget, setBudget] = useState(0);
  const [opsBudget, setOpsBudget] = useState(0);
  const [mgmtBudget, setMgmtBudget] = useState(0);
  const [allowanceBudget, setAllowanceBudget] = useState(0);
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    client_name: "",
    description: "",
    division_id: "",
    account_manager_id: "",
    head_id: "",
    pic_id: "",
    project_type: "",
    start_date: "",
    end_date: "",
    status: "active"
  });
  const [sowFile, setSowFile] = useState(null);
  const [rabFile, setRabFile] = useState(null);
  const [locations, setLocations] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState([
    { id: crypto.randomUUID(), nominal: 0, notes: "", date: "" }
  ]);
  const [detailBudgets, setDetailBudgets] = useState([
    { id: crypto.randomUUID(), item_name: "", quantity: null, item_price: 0, amount: 0, amount_pelaksanaan: 0, amount_proposal: 0, notes: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const addLocation = (lat, lng, addr) => {
    const isDuplicate = locations.some(
      (loc) => Math.abs(loc.lat - lat) < 1e-4 && Math.abs(loc.lng - lng) < 1e-4
    );
    if (!isDuplicate) {
      setLocations([...locations, { id: crypto.randomUUID(), name: `Lokasi ${locations.length + 1}`, lat, lng, address: addr }]);
    }
  };
  const removeLocation = (id) => {
    setLocations(locations.filter((l) => l.id !== id));
  };
  const [supportingDocs, setSupportingDocs] = useState([{ id: 1, type: "" }]);
  const addSupportingDoc = () => {
    if (supportingDocs.length < 5) {
      setSupportingDocs([...supportingDocs, { id: Date.now(), type: "" }]);
    }
  };
  const updateSupportingDocType = (id, type2) => {
    setSupportingDocs(supportingDocs.map((d) => d.id === id ? { ...d, type: type2 } : d));
  };
  const removeSupportingDoc = (id) => {
    if (supportingDocs.length > 1) {
      setSupportingDocs(supportingDocs.filter((d) => d.id !== id));
    }
  };
  const addDetailBudget = () => {
    setDetailBudgets([...detailBudgets, { id: crypto.randomUUID(), item_name: "", quantity: null, item_price: 0, amount: 0, amount_pelaksanaan: 0, amount_proposal: 0, notes: "" }]);
  };
  const removeDetailBudget = (id) => {
    if (detailBudgets.length > 1) {
      setDetailBudgets(detailBudgets.filter((d) => d.id !== id));
    }
  };
  const updateDetailBudget = (id, field, value) => {
    setDetailBudgets(detailBudgets.map((d) => {
      if (d.id === id) {
        const updated = { ...d, [field]: value };
        if (field === "amount_proposal") {
          updated.amount = value;
        }
        return updated;
      }
      return d;
    }));
  };
  detailBudgets.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalPelaksanaan = detailBudgets.reduce((sum, item) => sum + (Number(item.amount_pelaksanaan) || 0), 0);
  const totalProposal = detailBudgets.reduce((sum, item) => sum + (Number(item.amount_proposal) || 0), 0);
  const estimasiProfit = budget - totalPelaksanaan;
  const isPelaksanaanOverOperational = totalPelaksanaan > opsBudget;
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    setUploadProgress(0);
    setErrors({});
    setGeneralError(null);
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });
    submitData.append("budget_total", budget.toString());
    submitData.append("operational_budget", opsBudget.toString());
    submitData.append("management_budget", mgmtBudget.toString());
    submitData.append("allowance_budget", allowanceBudget.toString());
    if (rabFile) {
      submitData.append("documents[RAB][type]", "RAB");
      submitData.append("documents[RAB][file]", rabFile);
    }
    if (sowFile) {
      const sowType = type === "proposal" ? "PROPOSAL" : "KONTRAK";
      submitData.append(`documents[PROPOSAL_KONTRAK][type]`, sowType);
      submitData.append(`documents[PROPOSAL_KONTRAK][file]`, sowFile);
    }
    supportingDocs.forEach((doc) => {
      if (doc.file) {
        const key = `SUPPORTING_${doc.id}`;
        submitData.append(`documents[${key}][type]`, doc.type);
        submitData.append(`documents[${key}][file]`, doc.file);
      }
    });
    locations.forEach((loc, index) => {
      submitData.append(`locations[${index}][latitude]`, loc.lat.toString());
      submitData.append(`locations[${index}][longitude]`, loc.lng.toString());
      submitData.append(`locations[${index}][detail_address]`, loc.address);
    });
    paymentTerms.forEach((term, index) => {
      submitData.append(`termin_payments[${index}][nominal]`, term.nominal.toString());
      submitData.append(`termin_payments[${index}][due_date]`, term.date);
      if (term.notes) submitData.append(`termin_payments[${index}][notes]`, term.notes);
    });
    detailBudgets.forEach((detail, index) => {
      submitData.append(`detail_budgets[${index}][item_name]`, detail.item_name);
      if (detail.quantity) submitData.append(`detail_budgets[${index}][quantity]`, detail.quantity.toString());
      submitData.append(`detail_budgets[${index}][item_price]`, detail.item_price.toString());
      submitData.append(`detail_budgets[${index}][amount]`, detail.amount.toString());
      submitData.append(`detail_budgets[${index}][amount_pelaksanaan]`, (detail.amount_pelaksanaan || 0).toString());
      submitData.append(`detail_budgets[${index}][amount_proposal]`, (detail.amount_proposal || 0).toString());
      if (detail.notes) submitData.append(`detail_budgets[${index}][notes]`, detail.notes);
    });
    try {
      if (isPelaksanaanOverOperational) {
        setGeneralError("Peringatan Anggaran: Project activity memiliki pagu lebih besar dari operational. Update/remove project activity terlebih dahulu atau sesuaikan budget operational.");
        setLoading(false);
        setUploadProgress(0);
        return;
      }
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/api/v1/projects", submitData, {
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      window.location.href = `/projects/${response.data.data.uuid}`;
    } catch (error) {
      console.error("Error creating project:", error);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        setGeneralError("Terdapat kesalahan validasi. Silakan periksa kembali data Anda.");
      } else if (error.response?.status === 401) {
        alert("Sesi Anda telah berakhir. Silakan refresh halaman dan login kembali.");
        window.location.reload();
      } else {
        console.error("Error creating project:", error);
        setGeneralError(error.response?.data?.message || "Terjadi kesalahan saat menyimpan proyek. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };
  const addPaymentTerm = () => {
    setPaymentTerms([...paymentTerms, { id: crypto.randomUUID(), nominal: 0, notes: "", date: "" }]);
  };
  const removePaymentTerm = (id) => {
    if (paymentTerms.length > 1) {
      setPaymentTerms(paymentTerms.filter((t) => t.id !== id));
    }
  };
  const updatePaymentTerm = (id, field, value) => {
    setPaymentTerms(paymentTerms.map((t) => t.id === id ? { ...t, [field]: value } : t));
  };
  const totalPaymentTerm = paymentTerms.reduce((sum, term) => sum + (term.nominal || 0), 0);
  const isTerminOverBudget = totalPaymentTerm > budget;
  const areTerminDatesChronological = paymentTerms.every((term, idx) => {
    if (idx === 0) return true;
    if (!term.date || !paymentTerms[idx - 1].date) return true;
    return new Date(term.date) >= new Date(paymentTerms[idx - 1].date);
  });
  const tabsListRef = useRef(null);
  useEffect(() => {
    if (tabsListRef.current) {
      const container = tabsListRef.current;
      const activeTab = container.querySelector('[data-state="active"]');
      if (activeTab) {
        const containerRect = container.getBoundingClientRect();
        const activeRect = activeTab.getBoundingClientRect();
        const scrollLeft = container.scrollLeft + (activeRect.left - containerRect.left) - containerRect.width / 2 + activeRect.width / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [step]);
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Proyek", href: "/projects" },
    { title: "Create", href: "#" }
  ];
  const stepsList = ["basic", "stakeholders", "detail", "location", "budget"];
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: type === "proposal" ? "Buat Proposal Proyek" : "Buat Proyek Baru" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-background border-b px-6 py-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(Link, { href: "/projects", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold", children: type === "proposal" ? "Pengajuan Proposal Baru" : "Input Active Project" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground hidden sm:block", children: "Lengkapi data di bawah ini." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground mr-2 hidden sm:inline", children: [
            "Step ",
            stepsList.indexOf(step) + 1,
            "/5"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-24 h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-full bg-primary transition-all duration-500",
              style: { width: `${(stepsList.indexOf(step) + 1) * (100 / 5)}%` }
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Tabs, { value: step, onValueChange: (v) => setStep(v), className: "flex-1 w-full p-6", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: tabsListRef,
            className: "mb-6 w-full overflow-x-auto scrollbar-hide border-b bg-background",
            children: /* @__PURE__ */ jsx(TabsList, { className: "inline-flex h-auto min-w-full w-max md:w-full flex-nowrap gap-2 bg-muted/50 p-1 justify-start md:grid md:grid-cols-5 md:gap-0", children: stepsList.map((tabValue, idx) => /* @__PURE__ */ jsxs(
              TabsTrigger,
              {
                value: tabValue,
                className: "flex-none px-4 py-2 text-xs transition-all data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white data-[state=active]:shadow-sm md:flex-1 md:w-auto md:px-3 md:py-2.5 md:text-xs lg:text-sm",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "mr-1.5 inline md:mr-2", children: [
                    idx + 1,
                    "."
                  ] }),
                  tabValue === "basic" ? "Identitas" : tabValue === "stakeholders" ? "Stakeholder" : tabValue === "detail" ? "Detail" : tabValue === "location" ? "Lokasi" : "Anggaran"
                ]
              },
              tabValue
            )) })
          }
        ),
        generalError && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", className: "mb-6", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx(AlertTitle, { children: "Error" }),
          /* @__PURE__ */ jsx(AlertDescription, { children: generalError })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "basic", className: "mt-0 focus-visible:ring-0 focus-visible:outline-none", children: /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-md", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "px-6 pt-6 bg-white rounded-t-xl border-b pb-4", children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Informasi Dasar" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Masukkan detail identitas utama proyek." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6 p-6 md:p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { children: [
                  "Jenis Project ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  SearchableSelect,
                  {
                    options: [
                      { value: "pendampingan", label: "Pendampingan" },
                      { value: "pelatihan", label: "Pelatihan" },
                      { value: "dokumen", label: "Dokumen" },
                      { value: "event", label: "Event" }
                    ],
                    value: formData.project_type,
                    onValueChange: (v) => handleInputChange("project_type", v),
                    placeholder: "Pilih Jenis Project"
                  }
                ),
                errors.project_type && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.project_type })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { children: [
                  "Divisi & Anak Perusahaan ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  SearchableSelect,
                  {
                    options: divisions.map((div) => ({
                      value: div.id.toString(),
                      label: `${div.division_code?.name} — ${div.name}`
                    })),
                    value: formData.division_id,
                    onValueChange: (v) => handleInputChange("division_id", v),
                    placeholder: "Pilih Divisi & Anak Perusahaan"
                  }
                ),
                errors.division_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.division_id })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              isAdminOrFinance && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Kode Proyek (Opsional)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "Auto-generated jika kosong",
                    value: formData.code,
                    onChange: (e) => handleInputChange("code", e.target.value),
                    className: errors.code ? "border-red-500" : ""
                  }
                ),
                errors.code && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.code })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `space-y-2 ${!isAdminOrFinance ? "md:col-span-2" : ""}`, children: [
                /* @__PURE__ */ jsxs(Label, { children: [
                  "Nama Project ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "Nama Lengkap Proyek ...",
                    value: formData.name,
                    onChange: (e) => handleInputChange("name", e.target.value),
                    className: errors.name ? "border-red-500" : ""
                  }
                ),
                errors.name && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Nama Client / Perusahaan (Opsional)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "Masukkan nama client atau perusahaan ...",
                    value: formData.client_name,
                    onChange: (e) => handleInputChange("client_name", e.target.value),
                    className: errors.client_name ? "border-red-500" : ""
                  }
                ),
                errors.client_name && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.client_name })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(CardFooter, { className: "flex justify-end gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl", children: /* @__PURE__ */ jsxs(Button, { onClick: () => setStep("stakeholders"), className: "w-auto px-8", children: [
            "Selanjutnya ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "stakeholders", className: "mt-0 focus-visible:ring-0 focus-visible:outline-none", children: /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-md", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "px-6 pt-6 bg-white rounded-t-xl border-b pb-4", children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Tim & Stakeholder" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Tentukan penanggung jawab dan tim pelaksana." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-6 p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { children: [
                "Account Manager ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: headUsers.map((emp) => ({ value: emp.id.toString(), label: emp.name })),
                  value: formData.account_manager_id,
                  onValueChange: (v) => handleInputChange("account_manager_id", v),
                  placeholder: "Pilih Account Manager"
                }
              ),
              errors.account_manager_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.account_manager_id })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { children: [
                "Head Implementation ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: headUsers.map((emp) => ({ value: emp.id.toString(), label: emp.name })),
                  value: formData.head_id,
                  onValueChange: (v) => handleInputChange("head_id", v),
                  placeholder: "Pilih Head Implementation"
                }
              ),
              errors.head_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.head_id })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { children: [
                "PIC ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: picUsers.map((emp) => ({ value: emp.id.toString(), label: emp.name })),
                  value: formData.pic_id,
                  onValueChange: (v) => handleInputChange("pic_id", v),
                  placeholder: "Pilih PIC"
                }
              ),
              errors.pic_id && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.pic_id })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardFooter, { className: "flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl", children: [
            /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setStep("basic"), title: "Kembali", children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
              " Sebelumnya"
            ] }),
            /* @__PURE__ */ jsxs(Button, { onClick: () => setStep("detail"), className: "w-auto px-8", children: [
              "Selanjutnya ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "detail", className: "mt-0 focus-visible:ring-0 focus-visible:outline-none", children: /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-md", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "px-6 pt-6 bg-white rounded-t-xl border-b pb-4", children: [
            /* @__PURE__ */ jsxs(CardTitle, { children: [
              "Detail & ",
              type === "proposal" ? "Proposal" : "Dokumen Kontrak"
            ] }),
            /* @__PURE__ */ jsxs(CardDescription, { children: [
              "Dokumen ",
              type === "proposal" ? "proposal" : "Kontrak",
              ", durasi, dan lingkup kerja."
            ] })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-8 p-6 md:p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { children: [
                  type === "proposal" ? "Dokumen Proposal Project" : "Dokumen Kontrak",
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: cn("border rounded-lg p-6 space-y-4 hover:bg-muted/30 transition-colors bg-white h-full", errors.sow && "border-red-500"), children: [
                  /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: type === "proposal" ? "Upload dokumen Proposal lengkap." : "Upload dokumen Kontrak yang disepakati." }) }),
                  /* @__PURE__ */ jsx(FileUploadDropzone, { onFilesChange: (files) => setSowFile(files[0]) }),
                  sowFile && /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-green-600 mt-2", children: [
                    "✓ Terpilih: ",
                    sowFile.name
                  ] }),
                  errors.sow && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.sow })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs(Label, { children: [
                  "Dokumen Lainnya ",
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-normal text-muted-foreground ml-1", children: "(Tidak Wajib)" })
                ] }),
                supportingDocs.map((doc, idx) => {
                  return /* @__PURE__ */ jsxs("div", { className: "relative border rounded-lg p-5 space-y-3 hover:bg-muted/30 transition-colors bg-white group animate-in fade-in slide-in-from-top-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2 w-full flex flex-col sm:flex-row justify-between sm:items-center", children: [
                        /* @__PURE__ */ jsxs(Label, { className: "text-xs font-medium text-muted-foreground", children: [
                          "Nama Dokumen Pendukung #",
                          idx + 1,
                          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                        ] }),
                        /* @__PURE__ */ jsx(
                          Input,
                          {
                            value: doc.type,
                            onChange: (e) => updateSupportingDocType(doc.id, e.target.value),
                            placeholder: "Masukkan nama dokumen...",
                            className: "h-8 w-full sm:w-[220px] bg-white border-gray-300 text-xs"
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                      ] }),
                      supportingDocs.length > 1 && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-red-500 shrink-0 mt-6", onClick: () => removeSupportingDoc(doc.id), children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
                    ] }),
                    /* @__PURE__ */ jsx(FileUploadDropzone, { onFilesChange: (files) => {
                      setSupportingDocs((prev) => prev.map((d) => d.id === doc.id ? { ...d, file: files[0] } : d));
                    } }),
                    doc.file && /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-green-600 mt-2", children: [
                      "✓ Terpilih: ",
                      doc.file.name
                    ] })
                  ] }, doc.id);
                }),
                supportingDocs.length < 5 && /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: addSupportingDoc, className: "w-full border-dashed border-gray-400 text-muted-foreground hover:text-primary hover:border-primary gap-2", children: [
                  /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-plus", children: [
                    /* @__PURE__ */ jsx("path", { d: "M5 12h14" }),
                    /* @__PURE__ */ jsx("path", { d: "M12 5v14" })
                  ] }),
                  "Tambah Dokumen Lainnya"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Catatan (Notes)" }),
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  placeholder: "Tambahkan catatan...",
                  className: "min-h-[100px] bg-white",
                  value: formData.description,
                  onChange: (e) => handleInputChange("description", e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { children: [
                "Timeline Kegiatan ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-xs font-normal text-muted-foreground", children: "Tanggal Mulai Kegiatan" }),
                  /* @__PURE__ */ jsx(
                    DatePicker,
                    {
                      error: !!errors.start_date,
                      value: formData.start_date,
                      onChange: (v) => handleInputChange("start_date", v)
                    }
                  ),
                  errors.start_date && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.start_date })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-xs font-normal text-muted-foreground", children: "Tanggal Kegiatan" }),
                  /* @__PURE__ */ jsx(
                    DatePicker,
                    {
                      error: !!errors.end_date,
                      value: formData.end_date,
                      onChange: (v) => handleInputChange("end_date", v)
                    }
                  ),
                  errors.end_date && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.end_date })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(CardFooter, { className: "flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl", children: [
            /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setStep("stakeholders"), title: "Kembali", children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
              " Sebelumnya"
            ] }),
            /* @__PURE__ */ jsxs(Button, { onClick: () => setStep("location"), className: "w-auto px-8", children: [
              "Selanjutnya ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "location", className: "mt-0 focus-visible:ring-0 focus-visible:outline-none", children: /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-md", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "px-6 pt-6 bg-white rounded-t-xl border-b pb-4", children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Lokasi Pelaksanaan" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Kelola titik lokasi proyek (Bisa lebih dari 1 lokasi)." })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { className: "space-y-6 p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-4 order-2 lg:order-1", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs(Label, { children: [
                "Daftar Lokasi (",
                locations.length,
                ")"
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3 max-h-[500px] overflow-y-auto pr-1", children: locations.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground text-sm bg-gray-50", children: [
                "Belum ada lokasi dipilih. ",
                /* @__PURE__ */ jsx("br", {}),
                "Klik peta untuk menambahkan."
              ] }) : locations.map((loc, idx) => /* @__PURE__ */ jsxs("div", { className: "p-3 border rounded-lg bg-white shadow-sm group hover:border-primary transition-colors", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-1", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-semibold text-sm", children: [
                    "Titik ",
                    idx + 1
                  ] }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 text-muted-foreground hover:text-red-500 -mt-1 -mr-1", onClick: () => removeLocation(loc.id), children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", title: loc.address, children: loc.address || "Alamat tidak terdeteksi" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex gap-2 text-[10px] items-center text-gray-500 font-mono", children: [
                  /* @__PURE__ */ jsx("span", { className: "bg-gray-100 px-1.5 py-0.5 rounded", children: loc.lat.toFixed(6) }),
                  /* @__PURE__ */ jsx("span", { className: "bg-gray-100 px-1.5 py-0.5 rounded", children: loc.lng.toFixed(6) })
                ] })
              ] }, loc.id)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 order-1 lg:order-2", children: [
              /* @__PURE__ */ jsx(
                LocationPicker,
                {
                  onLocationSelect: (lat, lng, address) => addLocation(lat, lng, address),
                  initialLat: -6.2,
                  initialLng: 106.816666,
                  existingLocations: locations
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-2", children: "Dukungan Multi-lokasi: Klik titik baru di peta untuk menambah lokasi." })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardFooter, { className: "flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl", children: [
            /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setStep("detail"), title: "Kembali", children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
              " Sebelumnya"
            ] }),
            /* @__PURE__ */ jsxs(Button, { onClick: () => setStep("budget"), className: "w-auto px-8", children: [
              "Selanjutnya ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "budget", className: "mt-0 focus-visible:ring-0 focus-visible:outline-none", children: /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-md", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "px-6 pt-6 bg-white rounded-t-xl border-b pb-4", children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Anggaran & Keuangan" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Masukkan Nominal dan lampirkan rincian anggaran (RAB)." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "p-6 md:p-8 space-y-6", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-gray-50 border rounded-xl p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-8 items-start justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4 w-full", children: [
                /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Nominal Project" }) }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold z-10", children: "Rp" }),
                  /* @__PURE__ */ jsx(
                    MoneyInput,
                    {
                      value: budget,
                      onValueChange: (vals) => {
                        const newTotal = vals.floatValue || 0;
                        setBudget(newTotal);
                        const management = newTotal * 0.3;
                        const operasional = newTotal * 0.7;
                        setMgmtBudget(management);
                        setOpsBudget(operasional);
                        setAllowanceBudget(0);
                      },
                      placeholder: "0",
                      className: "pl-12 text-xl font-bold h-14 bg-white border-gray-200 shadow-sm"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-full md:w-[320px] shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border rounded-xl p-6 shadow-sm text-center space-y-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-medium", children: "Total Anggaran Project" }),
                /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-red-600 tracking-tight", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(budget).replace("Rp", "Rp ") }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground pt-1", children: "100% dari Total Project" }),
                /* @__PURE__ */ jsxs("div", { className: "pt-2 mt-2 border-t space-y-4 text-left", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-blue-600 uppercase tracking-wider", children: "Operasional" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-xs z-10", children: "Rp" }),
                      /* @__PURE__ */ jsx(
                        MoneyInput,
                        {
                          value: opsBudget,
                          disabled: true,
                          placeholder: "0",
                          className: "pl-8 bg-gray-50 h-8 text-xs border-blue-100 shadow-none"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-muted-foreground", children: [
                      "Porsi: ",
                      budget > 0 ? (opsBudget / budget * 100).toFixed(1) : 0,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-purple-600 uppercase tracking-wider", children: "Manajemen" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-xs z-10", children: "Rp" }),
                      /* @__PURE__ */ jsx(
                        MoneyInput,
                        {
                          value: mgmtBudget,
                          disabled: true,
                          placeholder: "0",
                          className: "pl-8 bg-gray-50 h-8 text-xs border-purple-100 shadow-none"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-muted-foreground", children: [
                      "Porsi: ",
                      budget > 0 ? (mgmtBudget / budget * 100).toFixed(1) : 0,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-amber-600 uppercase tracking-wider", children: "Allowance" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-xs z-10", children: "Rp" }),
                      /* @__PURE__ */ jsx(
                        MoneyInput,
                        {
                          value: allowanceBudget,
                          disabled: true,
                          placeholder: "0",
                          className: "pl-8 bg-gray-50 h-8 text-xs border-amber-100 shadow-none"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-muted-foreground", children: [
                      "Porsi: ",
                      budget > 0 ? (allowanceBudget / budget * 100).toFixed(1) : 0,
                      "%"
                    ] })
                  ] })
                ] })
              ] }) })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t mt-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-base font-semibold", children: "Kegiatan Anggaran Proyek" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Atur rincian kegiatan dan pengeluaran anggaran proyek." }),
                  errors.detail_budgets && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.detail_budgets })
                ] }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: addDetailBudget,
                    className: "gap-2 border-dashed hover:border-solid",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
                      "Tambah Kegiatan"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: detailBudgets.map((detail, idx) => /* @__PURE__ */ jsxs("div", { className: "border rounded-xl p-3 bg-white shadow-sm flex items-center gap-3 group hover:border-gray-300 transition-colors", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-end", children: [
                  /* @__PURE__ */ jsxs("div", { className: "md:col-span-4 space-y-1", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase", children: [
                      "Kegiatan #",
                      idx + 1,
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "text",
                        value: detail.item_name,
                        onChange: (e) => updateDetailBudget(detail.id, "item_name", e.target.value),
                        placeholder: "Nama kegiatan...",
                        className: cn("bg-white h-8 text-xs", errors[`detail_budgets.${idx}.item_name`] && "border-red-500")
                      }
                    ),
                    errors[`detail_budgets.${idx}.item_name`] && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-red-500 mt-0.5", children: errors[`detail_budgets.${idx}.item_name`] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Proposal" }),
                    /* @__PURE__ */ jsx(
                      MoneyInput,
                      {
                        value: detail.amount_proposal,
                        onValueChange: (vals) => updateDetailBudget(detail.id, "amount_proposal", vals.floatValue || 0),
                        placeholder: "0",
                        className: cn("bg-white h-8 text-xs", errors[`detail_budgets.${idx}.amount_proposal`] && "border-red-500")
                      }
                    ),
                    errors[`detail_budgets.${idx}.amount_proposal`] && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-red-500 mt-0.5", children: errors[`detail_budgets.${idx}.amount_proposal`] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Pelaksanaan" }),
                    /* @__PURE__ */ jsx(
                      MoneyInput,
                      {
                        value: detail.amount_pelaksanaan,
                        onValueChange: (vals) => updateDetailBudget(detail.id, "amount_pelaksanaan", vals.floatValue || 0),
                        placeholder: "0",
                        className: cn("bg-white h-8 text-xs", errors[`detail_budgets.${idx}.amount_pelaksanaan`] && "border-red-500")
                      }
                    ),
                    errors[`detail_budgets.${idx}.amount_pelaksanaan`] && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-red-500 mt-0.5", children: errors[`detail_budgets.${idx}.amount_pelaksanaan`] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "md:col-span-4 space-y-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Catatan (Opsional)" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "text",
                        value: detail.notes,
                        onChange: (e) => updateDetailBudget(detail.id, "notes", e.target.value),
                        placeholder: "Keterangan...",
                        className: "bg-white h-8 text-xs"
                      }
                    )
                  ] })
                ] }),
                detailBudgets.length > 1 && /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    onClick: () => removeDetailBudget(detail.id),
                    className: "h-8 w-8 text-muted-foreground hover:text-red-500 mt-5 shrink-0",
                    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }, detail.id)) }),
              isPelaksanaanOverOperational && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", className: "mb-4", children: [
                /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx(AlertTitle, { children: "Peringatan Anggaran" }),
                /* @__PURE__ */ jsxs(AlertDescription, { children: [
                  "Project activity memiliki nominal pelaksanaan (",
                  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalPelaksanaan),
                  ") lebih besar dari budget operational (",
                  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(opsBudget),
                  "). Update/remove project activity terlebih dahulu atau sesuaikan budget operational."
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: cn("grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg shadow-sm bg-white", estimasiProfit < 0 ? "border-red-200" : "border-blue-200"), children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Total Proposal" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-blue-600", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalProposal) }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-muted-foreground font-medium", children: [
                    "(",
                    budget > 0 ? (totalProposal / budget * 100).toFixed(1) : 0,
                    "%)"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1 border-l pl-4", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Total Pelaksanaan" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-indigo-600", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalPelaksanaan) }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-muted-foreground font-medium", children: [
                    "(",
                    budget > 0 ? (totalPelaksanaan / budget * 100).toFixed(1) : 0,
                    "%)"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1 border-l pl-4", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Operational Budget" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-900", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(opsBudget) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1 border-l pl-4", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Estimasi Profit" }),
                  /* @__PURE__ */ jsx("p", { className: cn("text-sm font-bold", estimasiProfit >= 0 ? "text-emerald-600" : "text-red-600"), children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(estimasiProfit) }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-muted-foreground font-medium", children: [
                    "(",
                    budget > 0 ? (estimasiProfit / budget * 100).toFixed(1) : 0,
                    "%)"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `grid grid-cols-1 md:grid-cols-1 gap-6 pt-2`, children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Rincian Anggaran (RAB)" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" }),
              /* @__PURE__ */ jsxs("div", { className: cn("border border-dashed border-gray-300 rounded-lg p-6 space-y-4 hover:bg-gray-50 transition-colors bg-white h-full", errors["documents.0.file"] && "border-red-500"), children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-gray-900", children: "Upload File RAB." }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Lampirkan detail Rencana Anggaran Biaya." })
                ] }) }),
                /* @__PURE__ */ jsx(FileUploadDropzone, { onFilesChange: (files) => setRabFile(files[0]) }),
                rabFile && /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-green-600 mt-2", children: [
                  "✓ Terpilih: ",
                  rabFile.name
                ] }),
                errors["documents.RAB.file"] && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors["documents.RAB.file"] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t mt-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-base font-semibold", children: "Termin Pembayaran" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Atur jadwal pembayaran bertahap untuk proyek ini." })
                ] }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: addPaymentTerm,
                    className: "gap-2 border-dashed hover:border-solid",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
                      "Tambah Termin"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: paymentTerms.map((term, idx) => /* @__PURE__ */ jsxs("div", { className: "border rounded-xl p-5 bg-white shadow-sm space-y-4 group hover:border-gray-300 transition-colors", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-sm text-gray-900", children: [
                    "Termin #",
                    idx + 1
                  ] }),
                  paymentTerms.length > 1 && /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "icon",
                      onClick: () => removePaymentTerm(term.id),
                      className: "h-8 w-8 text-muted-foreground hover:text-red-500",
                      children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "text-xs font-medium text-muted-foreground", children: [
                      "Nominal Pembayaran ",
                      /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-sm z-10", children: "Rp" }),
                      /* @__PURE__ */ jsx(
                        MoneyInput,
                        {
                          value: term.nominal,
                          onValueChange: (vals) => updatePaymentTerm(term.id, "nominal", vals.floatValue || 0),
                          placeholder: "0",
                          className: cn("pl-10 bg-white h-10", errors[`termin_payments.${idx}.nominal`] && "border-red-500")
                        }
                      )
                    ] }),
                    errors[`termin_payments.${idx}.nominal`] && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors[`termin_payments.${idx}.nominal`] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "text-xs font-medium text-muted-foreground", children: [
                      "Tanggal Jatuh Tempo ",
                      /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      DatePicker,
                      {
                        error: !!errors[`termin_payments.${idx}.due_date`],
                        value: term.date,
                        onChange: (v) => updatePaymentTerm(term.id, "date", v)
                      }
                    ),
                    errors[`termin_payments.${idx}.due_date`] && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors[`termin_payments.${idx}.due_date`] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-1", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "text-xs font-medium text-muted-foreground", children: [
                      "Deliverables ",
                      /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "text",
                        value: term.notes,
                        onChange: (e) => updatePaymentTerm(term.id, "notes", e.target.value),
                        placeholder: "",
                        className: cn("bg-white h-10", errors[`termin_payments.${idx}.notes`] && "border-red-500")
                      }
                    ),
                    errors[`termin_payments.${idx}.notes`] && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: errors[`termin_payments.${idx}.notes`] })
                  ] })
                ] })
              ] }, term.id)) }),
              isTerminOverBudget && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", className: "mb-4", children: [
                /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx(AlertTitle, { children: "Peringatan Termin" }),
                /* @__PURE__ */ jsxs(AlertDescription, { children: [
                  "Total nominal termin (",
                  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalPaymentTerm),
                  ") melebihi total anggaran proyek (",
                  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(budget),
                  ")."
                ] })
              ] }),
              !areTerminDatesChronological && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", className: "mb-4", children: [
                /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx(AlertTitle, { children: "Peringatan Tanggal" }),
                /* @__PURE__ */ jsx(AlertDescription, { children: "Tanggal jatuh tempo termin harus berurutan. Harap periksa kembali tanggal pada setiap termin." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: cn("border rounded-lg p-4 flex items-center justify-between", isTerminOverBudget || !areTerminDatesChronological ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"), children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: cn("text-sm font-medium", isTerminOverBudget || !areTerminDatesChronological ? "text-red-900" : "text-blue-900"), children: "Total Termin Pembayaran" }),
                  /* @__PURE__ */ jsxs("p", { className: cn("text-xs mt-0.5", isTerminOverBudget || !areTerminDatesChronological ? "text-red-700" : "text-blue-700"), children: [
                    paymentTerms.length,
                    " termin terjadwal"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("p", { className: cn("text-lg font-bold", isTerminOverBudget || !areTerminDatesChronological ? "text-red-900" : "text-blue-900"), children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                    totalPaymentTerm
                  ) }),
                  /* @__PURE__ */ jsxs("p", { className: cn("text-xs", isTerminOverBudget || !areTerminDatesChronological ? "text-red-700 font-bold" : "text-blue-700"), children: [
                    budget > 0 ? `${(totalPaymentTerm / budget * 100).toFixed(1)}% dari total` : "0%",
                    isTerminOverBudget && " (Melebihi Total Anggaran!)"
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(CardFooter, { className: "flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl", children: [
            /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setStep("location"), title: "Kembali", children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
              " Sebelumnya"
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: handleSubmit,
                disabled: loading,
                className: "w-auto px-8 min-w-40 bg-[var(--sidebar)] hover:bg-[var(--sidebar)] hover:scale-105 relative overflow-hidden",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "relative z-10", children: loading ? uploadProgress > 0 ? `Mengunggah... ${uploadProgress}%` : "Menyimpan..." : "Simpan Proyek" }),
                  loading && uploadProgress > 0 && /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute left-0 top-0 h-full bg-green-600 transition-all duration-300 ease-in-out",
                      style: { width: `${uploadProgress}%` }
                    }
                  )
                ]
              }
            )
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  ProjectsCreate as default
};
