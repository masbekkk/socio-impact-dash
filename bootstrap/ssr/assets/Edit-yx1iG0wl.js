import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-C8TeAzVF.js";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-BkuvEnvZ.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent, f as CardFooter } from "./card-DAjHeOuX.js";
import { F as FileUploadDropzone } from "./FileUploadDropzone-Cbnvbv0c.js";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { L as LocationPicker } from "./LocationPicker-CPEtG7vQ.js";
import { M as MoneyInput } from "./MoneyInput-Y8EKpX5J.js";
import { ArrowLeft, AlertCircle, ArrowRight, X, Plus } from "lucide-react";
import { D as DatePicker } from "./DatePicker-DAaV_rdH.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import { S as Skeleton } from "./skeleton-wZJ-u2Ee.js";
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
import "@radix-ui/react-label";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "clsx";
import "tailwind-merge";
import "react-leaflet";
/* empty css                 */
import "leaflet";
import "react-number-format";
function ProjectsEdit({ project_slug, divisions, employees }) {
  const { props } = usePage();
  const permissions = props.auth?.permissions || [];
  const canUpdateCode = permissions.includes("create_code_project");
  const headUsers = employees.filter((emp) => emp.roles?.some((r) => r.name === "head"));
  employees.filter((emp) => emp.roles?.some((r) => r.name === "finance"));
  const picUsers = employees.filter((emp) => !emp.roles?.some((r) => r.name === "direktur"));
  const [project, setProject] = useState(null);
  const [step, setStep] = useState("basic");
  const [budget, setBudget] = useState(0);
  const [opsBudget, setOpsBudget] = useState(0);
  const [mgmtBudget, setMgmtBudget] = useState(0);
  const [allowanceBudget, setAllowanceBudget] = useState(0);
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
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
  const [deleteLocations, setDeleteLocations] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [deletePaymentTerms, setDeletePaymentTerms] = useState([]);
  const [detailBudgets, setDetailBudgets] = useState([]);
  const [deleteDetailBudgets, setDeleteDetailBudgets] = useState([]);
  const [supportingDocs, setSupportingDocs] = useState([{ id: 1, type: "" }]);
  const addSupportingDoc = () => {
    if (supportingDocs.length < 5) {
      setSupportingDocs([...supportingDocs, { id: Date.now(), type: "" }]);
    }
  };
  const updateSupportingDocType = (id, type) => {
    setSupportingDocs(supportingDocs.map((d) => d.id === id ? { ...d, type } : d));
  };
  const handleSupportingDocFile = (id, file) => {
    setSupportingDocs(supportingDocs.map((d) => d.id === id ? { ...d, file: file || void 0 } : d));
  };
  const removeSupportingDocLocal = (id) => {
    if (supportingDocs.length > 1) {
      setSupportingDocs(supportingDocs.filter((d) => d.id !== id));
    }
  };
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/projects/${project_slug}`);
        const data = response.data.data;
        setProject(data);
        setBudget(data.budget_total);
        setOpsBudget(data.operational_budget || 0);
        setMgmtBudget(data.management_budget || 0);
        setAllowanceBudget(data.allowance_budget || 0);
        setStatus(data.status);
        setFormData({
          code: data.code || "",
          name: data.name,
          client_name: data.client_name || "",
          description: data.description || "",
          division_id: data.division_id ? data.division_id.toString() : "",
          account_manager_id: data.account_manager_id ? data.account_manager_id.toString() : "",
          head_id: data.head_id ? data.head_id.toString() : "",
          pic_id: data.pic_id ? data.pic_id.toString() : "",
          project_type: data.project_type,
          start_date: data.start_date ? data.start_date.substring(0, 10) : "",
          end_date: data.end_date ? data.end_date.substring(0, 10) : "",
          status: data.status
        });
        if (data.documents && data.documents.length > 0) {
          const docs = data.documents.filter((d) => !["SOW", "PROPOSAL", "KONTRAK", "RAB"].includes(d.type));
          if (docs.length > 0) {
            setSupportingDocs(docs.map((d) => ({
              id: d.id,
              // Use actual ID for existing docs
              type: d.type,
              original_name: d.original_name,
              // Store original name for display
              path: d.path,
              isExisting: true
            })));
          } else {
            setSupportingDocs([{ id: Date.now(), type: "" }]);
          }
        }
        if (data.locations && data.locations.length > 0) {
          setLocations(data.locations.map((loc) => ({
            id: loc.id.toString(),
            name: loc.name || "Lokasi",
            lat: parseFloat(loc.latitude),
            lng: parseFloat(loc.longitude),
            address: loc.detail_address || ""
          })));
        }
        if (data.termin_payments && data.termin_payments.length > 0) {
          setPaymentTerms(data.termin_payments.map((term) => ({
            id: term.id.toString(),
            nominal: parseFloat(term.nominal),
            notes: term.notes || "",
            date: term.due_date ? term.due_date.substring(0, 10) : ""
          })));
        } else {
          setPaymentTerms([{ id: crypto.randomUUID(), nominal: 0, notes: "", date: "", isNew: true }]);
        }
        if (data.budget_details && data.budget_details.length > 0) {
          setDetailBudgets(data.budget_details.map((detail) => ({
            id: detail.id.toString(),
            item_name: detail.item_name || "",
            quantity: detail.quantity ? parseInt(detail.quantity) : null,
            item_price: parseFloat(detail.item_price) || 0,
            amount: parseFloat(detail.amount) || 0,
            amount_pelaksanaan: parseFloat(detail.amount_pelaksanaan) || 0,
            amount_proposal: parseFloat(detail.amount_proposal) || 0,
            notes: detail.notes || ""
          })));
        } else {
          setDetailBudgets([{ id: crypto.randomUUID(), item_name: "", quantity: null, item_price: 0, amount: 0, amount_pelaksanaan: 0, amount_proposal: 0, notes: "", isNew: true }]);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [project_slug]);
  const addLocation = (lat, lng, addr) => {
    const isDuplicate = locations.some(
      (loc) => Math.abs(loc.lat - lat) < 1e-4 && Math.abs(loc.lng - lng) < 1e-4
    );
    if (!isDuplicate) {
      setLocations([...locations, { id: crypto.randomUUID(), name: `Lokasi ${locations.length + 1}`, lat, lng, address: addr, isNew: true }]);
    }
  };
  const removeLocation = (id, isNew) => {
    setLocations(locations.filter((l) => l.id !== id));
    if (!isNew) {
      setDeleteLocations([...deleteLocations, id]);
    }
  };
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
  const addPaymentTerm = () => {
    setPaymentTerms([...paymentTerms, { id: crypto.randomUUID(), nominal: 0, notes: "", date: "", isNew: true }]);
  };
  const removePaymentTerm = (id, isNew) => {
    if (paymentTerms.length > 1) {
      setPaymentTerms(paymentTerms.filter((t) => t.id !== id));
      if (!isNew) {
        setDeletePaymentTerms([...deletePaymentTerms, id]);
      }
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
  const addDetailBudget = () => {
    setDetailBudgets([...detailBudgets, { id: crypto.randomUUID(), item_name: "", quantity: null, item_price: 0, amount: 0, amount_pelaksanaan: 0, amount_proposal: 0, notes: "", isNew: true }]);
  };
  const removeDetailBudget = (id, isNew) => {
    if (detailBudgets.length > 1) {
      setDetailBudgets(detailBudgets.filter((d) => d.id !== id));
      if (!isNew) {
        setDeleteDetailBudgets([...deleteDetailBudgets, id]);
      }
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
  const handleSubmit = async () => {
    setSaving(true);
    setUploadProgress(0);
    setErrors({});
    setGeneralError(null);
    const submitData = new FormData();
    submitData.append("_method", "PUT");
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });
    submitData.append("budget_total", budget.toString());
    submitData.append("operational_budget", opsBudget.toString());
    submitData.append("management_budget", mgmtBudget.toString());
    submitData.append("allowance_budget", allowanceBudget.toString());
    submitData.append("status", status);
    if (rabFile) {
      submitData.append("documents[RAB][type]", "RAB");
      submitData.append("documents[RAB][file]", rabFile);
    }
    if (sowFile) {
      const sowType = status === "proposal" ? "PROPOSAL" : "KONTRAK";
      submitData.append("documents[PROPOSAL_KONTRAK][type]", sowType);
      submitData.append("documents[PROPOSAL_KONTRAK][file]", sowFile);
    }
    supportingDocs.forEach((doc) => {
      if (doc.file) {
        const key = `SUPPORTING_${doc.id}`;
        submitData.append(`documents[${key}][type]`, doc.type);
        submitData.append(`documents[${key}][file]`, doc.file);
      }
    });
    locations.forEach((loc, index) => {
      if (!loc.isNew) {
        submitData.append(`locations[${index}][id]`, loc.id);
      }
      submitData.append(`locations[${index}][latitude]`, loc.lat.toString());
      submitData.append(`locations[${index}][longitude]`, loc.lng.toString());
      submitData.append(`locations[${index}][detail_address]`, loc.address);
    });
    deleteLocations.forEach((id, index) => {
      submitData.append(`delete_locations[${index}]`, id);
    });
    paymentTerms.forEach((term, index) => {
      if (!term.isNew) {
        submitData.append(`termin_payments[${index}][id]`, term.id);
      }
      submitData.append(`termin_payments[${index}][nominal]`, term.nominal.toString());
      submitData.append(`termin_payments[${index}][due_date]`, term.date);
      if (term.notes) submitData.append(`termin_payments[${index}][notes]`, term.notes);
    });
    deletePaymentTerms.forEach((id, index) => {
      submitData.append(`delete_termin_payments[${index}]`, id);
    });
    detailBudgets.forEach((detail, index) => {
      if (!detail.isNew) {
        submitData.append(`detail_budgets[${index}][id]`, detail.id);
      }
      submitData.append(`detail_budgets[${index}][item_name]`, detail.item_name);
      if (detail.quantity) submitData.append(`detail_budgets[${index}][quantity]`, detail.quantity.toString());
      submitData.append(`detail_budgets[${index}][item_price]`, detail.item_price.toString());
      submitData.append(`detail_budgets[${index}][amount]`, detail.amount.toString());
      submitData.append(`detail_budgets[${index}][amount_pelaksanaan]`, (detail.amount_pelaksanaan || 0).toString());
      submitData.append(`detail_budgets[${index}][amount_proposal]`, (detail.amount_proposal || 0).toString());
      if (detail.notes) submitData.append(`detail_budgets[${index}][notes]`, detail.notes);
    });
    deleteDetailBudgets.forEach((id, index) => {
      submitData.append(`delete_detail_budgets[${index}]`, id);
    });
    try {
      if (isPelaksanaanOverOperational) {
        setGeneralError("Peringatan Anggaran: Project activity memiliki pagu lebih besar dari operational. Update/remove project activity terlebih dahulu atau sesuaikan budget operational.");
        setSaving(false);
        setUploadProgress(0);
        return;
      }
      await axios.post(`/api/v1/projects/${project_slug}`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      router.visit(`/projects/${project_slug}`);
    } catch (error) {
      console.error("Error updating project:", error);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        setGeneralError("Terdapat kesalahan validasi. Silakan periksa kembali data Anda.");
      } else {
        setGeneralError(error.response?.data?.message || "Terjadi kesalahan saat menyimpan proyek. Silakan coba lagi.");
      }
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };
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
    { title: "Edit", href: "#" }
  ];
  const stepsList = ["basic", "stakeholders", "detail", "location", "budget"];
  if (loading) {
    return /* @__PURE__ */ jsx(AppSidebarLayout, { breadcrumbs, children: /* @__PURE__ */ jsxs("div", { className: "p-8 space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-full" })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: `Edit: ${project.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-background border-b px-6 py-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(Link, { href: "/projects", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold", children: "Edit Proyek" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground hidden sm:block", children: project.name })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground mr-2 hidden sm:inline", children: [
            "Step ",
            stepsList.indexOf(step) + 1,
            "/5"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-24 h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-primary transition-all duration-500", style: { width: `${(stepsList.indexOf(step) + 1) * (100 / 5)}%` } }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Tabs, { value: step, onValueChange: (v) => setStep(v), className: "flex-1 w-full p-6", children: [
        /* @__PURE__ */ jsx("div", { ref: tabsListRef, className: "mb-6 w-full overflow-x-auto scrollbar-hide border-b bg-background", children: /* @__PURE__ */ jsx(TabsList, { className: "inline-flex h-auto min-w-full w-max md:w-full flex-nowrap gap-2 bg-muted/50 p-1 justify-start md:grid md:grid-cols-5 md:gap-0", children: stepsList.map((tabValue, idx) => /* @__PURE__ */ jsxs(
          TabsTrigger,
          {
            value: tabValue,
            className: "flex-none px-4 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm md:flex-1 md:w-auto md:px-3 md:py-2.5 md:text-xs lg:text-sm",
            children: [
              /* @__PURE__ */ jsxs("span", { className: "mr-1.5 inline md:mr-2", children: [
                idx + 1,
                "."
              ] }),
              tabValue === "basic" ? "Identitas" : tabValue === "stakeholders" ? "Stakeholder" : tabValue === "detail" ? "Detail & Proposal" : tabValue === "location" ? "Lokasi" : "Anggaran"
            ]
          },
          tabValue
        )) }) }),
        generalError && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", className: "mb-6", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx(AlertTitle, { children: "Error" }),
          /* @__PURE__ */ jsx(AlertDescription, { children: generalError })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "basic", className: "mt-0 focus-visible:ring-0 focus-visible:outline-none", children: /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-md", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "px-6 pt-6 bg-white rounded-t-xl border-b pb-4", children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Informasi Dasar" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Perbarui nama dan jenis proyek." })
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
              canUpdateCode && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Kode Proyek" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "Contoh: PRJ-2024-001",
                    value: formData.code,
                    onChange: (e) => handleInputChange("code", e.target.value),
                    className: errors.code ? "border-red-500" : ""
                  }
                ),
                errors.code && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: errors.code })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `space-y-2 ${!canUpdateCode ? "md:col-span-2" : ""}`, children: [
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
            /* @__PURE__ */ jsx(CardDescription, { children: "Perbarui penanggung jawab dan tim pelaksana." })
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
              status === "proposal" ? "Proposal" : "Dokumen Kontrak"
            ] }),
            /* @__PURE__ */ jsxs(CardDescription, { children: [
              "Dokumen ",
              status === "proposal" ? "proposal" : "Kontrak",
              ", durasi, dan lingkup kerja."
            ] })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6 p-6 md:p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs(Label, { children: [
                  status === "active" ? "Dokumen Kontrak" : "Dokumen Proposal Project",
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: cn("border rounded-lg p-6 space-y-4 hover:bg-muted/30 transition-colors bg-white h-full", errors.sow && "border-red-500"), children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: status === "active" ? "Upload dokumen Kontrak yang telah disepakati (PDF)." : "Upload dokumen Proposal lengkap (PDF)." }),
                    project.documents?.find((d) => ["SOW", "KONTRAK", "PROPOSAL"].includes(d.type)) && /* @__PURE__ */ jsxs("p", { className: "text-xs text-blue-600", children: [
                      "File saat ini: ",
                      project.documents.find((d) => ["SOW", "KONTRAK", "PROPOSAL"].includes(d.type))?.original_name
                    ] })
                  ] }),
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
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs(Label, { className: "text-xs font-medium text-muted-foreground", children: [
                            "Nama Dokumen Pendukung #",
                            idx + 1,
                            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                          ] }),
                          doc.isExisting && !doc.file && /* @__PURE__ */ jsxs("p", { className: "text-xs text-blue-600 mt-1", children: [
                            "File saat ini: ",
                            doc.original_name
                          ] })
                        ] }),
                        /* @__PURE__ */ jsx(
                          Input,
                          {
                            value: doc.type,
                            onChange: (e) => updateSupportingDocType(doc.id, e.target.value),
                            placeholder: "Masukkan nama dokumen...",
                            className: "h-8 w-full sm:w-[220px] bg-white border-gray-300 text-xs"
                          }
                        )
                      ] }),
                      supportingDocs.length > 1 && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-red-500 shrink-0 mt-6", onClick: () => removeSupportingDocLocal(doc.id), children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
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
              /* @__PURE__ */ jsx(Label, { children: "Timeline (Durasi)" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-xs font-normal text-muted-foreground", children: "Tanggal Mulai" }),
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
                  /* @__PURE__ */ jsx(Label, { className: "text-xs font-normal text-muted-foreground", children: "Tanggal Selesai" }),
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
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground pt-1", children: "Estimasi durasi pelaksanaan." })
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
            /* @__PURE__ */ jsx(CardDescription, { children: "Kelola titik lokasi proyek (Multi-location)." })
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
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 text-muted-foreground hover:text-red-500 -mt-1 -mr-1", onClick: () => removeLocation(loc.id, loc.isNew), children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", title: loc.address, children: loc.address || "Alamat tidak terdeteksi" }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex gap-2 text-[10px] items-center text-gray-500 font-mono", children: [
                  /* @__PURE__ */ jsx("span", { className: "bg-gray-100 px-1.5 py-0.5 rounded", children: loc.lat.toFixed(6) }),
                  /* @__PURE__ */ jsx("span", { className: "bg-gray-100 px-1.5 py-0.5 rounded", children: loc.lng.toFixed(6) })
                ] })
              ] }, loc.id)) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 order-1 lg:order-2", children: /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-1 bg-white h-full min-h-[400px]", children: /* @__PURE__ */ jsx(
              LocationPicker,
              {
                onLocationSelect: (lat, lng, address) => addLocation(lat, lng, address),
                initialLat: locations[0]?.lat || -6.2,
                initialLng: locations[0]?.lng || 106.816666,
                existingLocations: locations
              }
            ) }) })
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
                    onClick: () => removeDetailBudget(detail.id, detail.isNew),
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
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Lampirkan detail Rencana Anggaran Biaya." }),
                  project.documents?.find((d) => d.type === "RAB") && /* @__PURE__ */ jsxs("p", { className: "text-xs text-blue-600", children: [
                    "File saat ini: ",
                    project.documents.find((d) => d.type === "RAB").original_name
                  ] })
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
                  /* @__PURE__ */ jsx(Label, { className: "text-base font-semibold", children: "Dokumen Pendukung" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Lampirkan dokumen pendukung lainnya seperti surat penawaran, dll." })
                ] }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: addSupportingDoc,
                    className: "gap-2 border-dashed hover:border-solid",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
                      "Tambah Dokumen"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: supportingDocs.map((doc, idx) => /* @__PURE__ */ jsxs("div", { className: "border rounded-xl p-3 bg-white shadow-sm flex items-center gap-3 group hover:border-gray-300 transition-colors", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 items-end", children: [
                  /* @__PURE__ */ jsxs("div", { className: "md:col-span-4 space-y-1", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase", children: [
                      "Nama Dokumen #",
                      idx + 1,
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "text",
                        value: doc.type,
                        onChange: (e) => updateSupportingDocType(doc.id, e.target.value),
                        placeholder: "Nama dokumen...",
                        className: cn("bg-white h-9 text-xs", errors[`documents.SUPPORTING_${doc.id}.type`] && "border-red-500")
                      }
                    ),
                    errors[`documents.SUPPORTING_${doc.id}.type`] && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-red-500 mt-0.5", children: errors[`documents.SUPPORTING_${doc.id}.type`] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "md:col-span-8 space-y-2", children: [
                    /* @__PURE__ */ jsxs(Label, { className: "text-xs font-medium text-muted-foreground", children: [
                      "File Dokumen ",
                      /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "file",
                        onChange: (e) => handleSupportingDocFile(doc.id, e.target.files?.[0] || null),
                        className: cn("bg-white h-9 text-xs py-1.5", errors[`documents.SUPPORTING_${doc.id}.file`] && "border-red-500")
                      }
                    ),
                    doc.file && /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-green-600 mt-0.5", children: [
                      "✓ Terpilih: ",
                      doc.file.name
                    ] }),
                    doc.original_name && !doc.file && /* @__PURE__ */ jsxs("p", { className: "text-xs text-blue-600 mt-0.5", children: [
                      "File saat ini: ",
                      doc.original_name
                    ] }),
                    errors[`documents.SUPPORTING_${doc.id}.file`] && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-red-500 mt-0.5", children: errors[`documents.SUPPORTING_${doc.id}.file`] })
                  ] })
                ] }),
                supportingDocs.length > 0 && /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    onClick: () => removeSupportingDocLocal(doc.id),
                    className: "h-8 w-8 text-muted-foreground hover:text-red-500 mt-5 shrink-0",
                    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }, doc.id)) })
            ] }),
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
                      onClick: () => removePaymentTerm(term.id, term.isNew),
                      className: "h-8 w-8 text-muted-foreground hover:text-red-500",
                      children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Nominal Pembayaran" }),
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
                    /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Tanggal Jatuh Tempo" }),
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
                    /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Deliverables" }),
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
                disabled: saving,
                className: "w-auto px-8 min-w-40 bg-green-600 hover:bg-green-700 hover:scale-105 transition-all relative overflow-hidden",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "relative z-10", children: saving ? uploadProgress > 0 ? `Mengunggah... ${uploadProgress}%` : "Menyimpan..." : "Simpan Perubahan" }),
                  saving && uploadProgress > 0 && /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute left-0 top-0 h-full bg-green-800 transition-all duration-300 ease-in-out",
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
  ProjectsEdit as default
};
