import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useLayoutEffect, useEffect, useState } from "react";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-C8TeAzVF.js";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-BkuvEnvZ.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { L as LocationPicker } from "./LocationPicker-CPEtG7vQ.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent, f as CardFooter } from "./card-DAjHeOuX.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { FileText, Eye, MapPin, Download, Pencil, Loader, AlertCircle, Trash2, Plus, Save, CheckCircle2, Loader2, User, Upload, Handshake, Archive } from "lucide-react";
import { M as MoneyInput } from "./MoneyInput-Y8EKpX5J.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { D as DatePicker } from "./DatePicker-DtmT1I-q.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import Quill from "quill";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
import "react-leaflet";
/* empty css                 */
import "leaflet";
import "@radix-ui/react-dialog";
import "react-number-format";
import "date-fns";
import "@radix-ui/react-label";
const Editor = forwardRef(({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
  const containerRef = useRef(null);
  const onTextChangeRef = useRef(onTextChange);
  const onSelectionChangeRef = useRef(onSelectionChange);
  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
    onSelectionChangeRef.current = onSelectionChange;
  });
  useEffect(() => {
    ref.current?.enable(!readOnly);
  }, [ref, readOnly]);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const quill = new Quill(editorContainer, {
      theme: "snow"
    });
    ref.current = quill;
    if (defaultValue) {
      quill.setContents(quill.clipboard.convert({ html: defaultValue }));
    }
    quill.on(Quill.events.TEXT_CHANGE, () => {
      onTextChangeRef.current?.(quill.root.innerHTML);
    });
    quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      onSelectionChangeRef.current?.(...args);
    });
    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
                .quill-container .ql-container {
                    height: calc(100% - 42px);
                    min-height: 200px;
                }
                .quill-container .ql-editor {
                    min-height: 200px;
                }
                ` }),
    /* @__PURE__ */ jsx("div", { ref: containerRef, className: "quill-container h-full w-full" })
  ] });
});
Editor.displayName = "Editor";
function ProjectTabs({
  project,
  currentStatus,
  locations,
  userRole: initialUserRole,
  refetchProject,
  onShowToast,
  reportForm,
  setReportForm,
  handleReportFileChange,
  addReportFileRow,
  removeReportFileRow,
  isSubmittingReport,
  onSubmitReport,
  onDeleteReport,
  monitoringList,
  closingForm,
  setClosingForm,
  isProjectDealed,
  setIsDealAlertOpen,
  setIsCloseAlertOpen
}) {
  const [activeTab, setActiveTab] = useState("detail");
  const tabsListRef = useRef(null);
  const [selectedLocIndex, setSelectedLocIndex] = useState(0);
  const quillRef = useRef(null);
  useEffect(() => {
    if (tabsListRef.current) {
      const container = tabsListRef.current;
      const activeTrigger = container.querySelector(`[data-state="active"]`);
      if (activeTrigger) {
        const containerRect = container.getBoundingClientRect();
        const triggerRect = activeTrigger.getBoundingClientRect();
        const scrollLeft = container.scrollLeft + (triggerRect.left - containerRect.left) - containerRect.width / 2 + triggerRect.width / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [activeTab]);
  const [localPaymentTerms, setLocalPaymentTerms] = useState(project.termin_payments || []);
  useEffect(() => {
    if (project.termin_payments) {
      setLocalPaymentTerms(project.termin_payments);
    }
  }, [project.termin_payments]);
  const [editPartitions, setEditPartitions] = useState(false);
  const [opsBudget, setOpsBudget] = useState(project.operational_budget || 0);
  const [mgmtBudget, setMgmtBudget] = useState(project.management_budget || 0);
  const [allowanceBudget, setAllowanceBudget] = useState(project.allowance_budget || 0);
  const [savingBudget, setSavingBudget] = useState(false);
  const [localBudgetStatus, setLocalBudgetStatus] = useState(project.budget_partition_status || "draft");
  const { hasRole } = usePermission();
  usePage().props.auth?.user?.role_name || "user";
  const isAdminOrFinance = hasRole(["superadmin", "finance"]);
  const permissions = usePage().props.auth?.permissions || [];
  const canInputBudget = isAdminOrFinance;
  const canApproveBudget = permissions.includes("approval_budget_partition");
  const canManageDetailBudget = permissions.includes("manage_detail_budget");
  const [detailBudgets, setDetailBudgets] = useState(project.budget_details || []);
  const [editDetailBudget, setEditDetailBudget] = useState(false);
  const [savingDetailBudget, setSavingDetailBudget] = useState(false);
  const [deleteDetailBudgets, setDeleteDetailBudgets] = useState([]);
  const [isRequestBudgetOpen, setIsRequestBudgetOpen] = useState(false);
  const [requestBudgetAmount, setRequestBudgetAmount] = useState(0);
  const [requestBudgetNotes, setRequestBudgetNotes] = useState("");
  const [isSubmittingRequestBudget, setIsSubmittingRequestBudget] = useState(false);
  useEffect(() => {
    setOpsBudget(project.operational_budget || 0);
    setMgmtBudget(project.management_budget || 0);
    setAllowanceBudget(project.allowance_budget || 0);
    setLocalBudgetStatus(project.budget_partition_status || "draft");
  }, [project]);
  const handleSaveBudget = async () => {
    setSavingBudget(true);
    try {
      await axios.put(`/api/v1/projects/${project.uuid}`, {
        operational_budget: opsBudget,
        management_budget: mgmtBudget,
        allowance_budget: allowanceBudget,
        budget_partition_status: "pending"
      });
      setEditPartitions(false);
      if (onShowToast) onShowToast("Pembagian anggaran berhasil disimpan", "success");
      if (refetchProject) refetchProject();
    } catch (error) {
      console.error(error);
      if (onShowToast) onShowToast(error?.response?.data?.message || "Gagal menyimpan anggaran", "error");
    } finally {
      setSavingBudget(false);
    }
  };
  const handleApproveBudget = async () => {
    setSavingBudget(true);
    try {
      await axios.put(`/api/v1/projects/${project.uuid}`, {
        budget_partition_status: "approved"
      });
      setLocalBudgetStatus("approved");
      if (onShowToast) onShowToast("Pembagian anggaran berhasil disetujui", "success");
      if (refetchProject) refetchProject();
    } catch (error) {
      console.error(error);
      if (onShowToast) onShowToast(error?.response?.data?.message || "Gagal menyetujui anggaran", "error");
    } finally {
      setSavingBudget(false);
    }
  };
  const handleSaveDetailBudget = async () => {
    setSavingDetailBudget(true);
    const currentTotalPelaksanaan = detailBudgets.reduce((sum, item) => sum + (Number(item.used_eer) > 0 ? Number(item.used_eer) : Number(item.amount_pelaksanaan) || 0), 0);
    if (currentTotalPelaksanaan > opsBudget) {
      setSavingDetailBudget(false);
      if (onShowToast) onShowToast("Gagal menyimpan: Total amount pelaksanaan melebihi budget operasional. Sesuaikan RAB atau ajukan tambahan operasional.", "error");
      return;
    }
    try {
      const submitData = new FormData();
      submitData.append("_method", "PUT");
      detailBudgets.forEach((detail, index) => {
        if (!detail.isNew) {
          submitData.append(`detail_budgets[${index}][id]`, detail.id);
        }
        submitData.append(`detail_budgets[${index}][item_name]`, detail.item_name || "");
        if (detail.quantity) submitData.append(`detail_budgets[${index}][quantity]`, detail.quantity.toString());
        submitData.append(`detail_budgets[${index}][item_price]`, (detail.item_price || 0).toString());
        submitData.append(`detail_budgets[${index}][amount]`, (detail.amount || (detail.item_price || 0)).toString());
        submitData.append(`detail_budgets[${index}][amount_pelaksanaan]`, (detail.amount_pelaksanaan || 0).toString());
        submitData.append(`detail_budgets[${index}][amount_proposal]`, (detail.amount_proposal || 0).toString());
        if (detail.notes) submitData.append(`detail_budgets[${index}][notes]`, detail.notes);
      });
      deleteDetailBudgets.forEach((id, index) => {
        submitData.append(`delete_detail_budgets[${index}]`, id);
      });
      await axios.post(`/api/v1/projects/${project.uuid}`, submitData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setEditDetailBudget(false);
      if (onShowToast) onShowToast("Rincian anggaran berhasil disimpan", "success");
      if (refetchProject) refetchProject();
    } catch (error) {
      console.error(error);
      if (onShowToast) onShowToast(error?.response?.data?.message || error?.response?.data?.errors?.detail_budgets || "Gagal menyimpan rincian anggaran", "error");
    } finally {
      setSavingDetailBudget(false);
    }
  };
  const toggleVerification = async (termId, currentVerified) => {
    try {
      const { data } = await axios.post(`/api/v1/projects/${project.uuid}/termins/${termId}`, {
        is_verified: !currentVerified
      });
      setLocalPaymentTerms(
        (prev) => prev.map((t) => t.id === termId ? { ...t, ...data.data } : t)
      );
      if (onShowToast) onShowToast(!currentVerified ? "Termin berhasil diverifikasi" : "Verifikasi dibatalkan", "success");
    } catch (error) {
      console.error("Error toggling verification:", error);
      if (onShowToast) onShowToast(error?.response?.data?.message || "Gagal mengubah verifikasi", "error");
    }
  };
  const handleTerminProofUpload = async (termId, file) => {
    const formData = new FormData();
    formData.append("proof_file", file);
    try {
      const { data } = await axios.post(`/api/v1/projects/${project.uuid}/termins/${termId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setLocalPaymentTerms(
        (prev) => prev.map((t) => t.id === termId ? { ...t, ...data.data } : t)
      );
      if (onShowToast) onShowToast("Bukti pembayaran berhasil diunggah", "success");
    } catch (error) {
      console.error("Error uploading proof:", error);
      if (onShowToast) onShowToast(error?.response?.data?.message || "Gagal mengunggah bukti", "error");
    }
  };
  const handleTerminBillingUpload = async (termId, file) => {
    const formData = new FormData();
    formData.append("billing_file", file);
    try {
      const { data } = await axios.post(`/api/v1/projects/${project.uuid}/termins/${termId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setLocalPaymentTerms(
        (prev) => prev.map((t) => t.id === termId ? { ...t, ...data.data } : t)
      );
      if (onShowToast) onShowToast("Dokumen penagihan berhasil diunggah", "success");
    } catch (error) {
      console.error("Error uploading billing document:", error);
      if (onShowToast) onShowToast(error?.response?.data?.message || "Gagal mengunggah dokumen penagihan", "error");
    }
  };
  const [savingClosing, setSavingClosing] = useState(false);
  const handleSaveClosingChanges = async () => {
    setSavingClosing(true);
    try {
      await axios.put(`/api/v1/projects/${project.uuid}`, {
        actual_budget: closingForm.actual_budget,
        lesson_learned: closingForm.lesson_learned
      });
      if (refetchProject) refetchProject();
      if (onShowToast) onShowToast("Perubahan data closing berhasil disimpan.", "success");
    } catch (error) {
      console.error("Error saving closing changes:", error);
      if (onShowToast) onShowToast(error?.response?.data?.message || "Gagal menyimpan perubahan.", "error");
    } finally {
      setSavingClosing(false);
    }
  };
  const handleRequestAdditionalBudget = async () => {
    if (!requestBudgetAmount || requestBudgetAmount <= 0) {
      if (onShowToast) onShowToast("Nominal tambahan budget harus diisi", "error");
      return;
    }
    setIsSubmittingRequestBudget(true);
    try {
      const submitData = new FormData();
      submitData.append("_method", "PUT");
      detailBudgets.forEach((detail, index) => {
        if (!detail.isNew) {
          submitData.append(`detail_budgets[${index}][id]`, detail.id);
        }
        submitData.append(`detail_budgets[${index}][item_name]`, detail.item_name || "");
        if (detail.quantity) submitData.append(`detail_budgets[${index}][quantity]`, detail.quantity.toString());
        submitData.append(`detail_budgets[${index}][item_price]`, (detail.item_price || 0).toString());
        submitData.append(`detail_budgets[${index}][amount]`, (detail.amount || (detail.item_price || 0)).toString());
        submitData.append(`detail_budgets[${index}][amount_pelaksanaan]`, (detail.amount_pelaksanaan || 0).toString());
        submitData.append(`detail_budgets[${index}][amount_proposal]`, (detail.amount_proposal || 0).toString());
        if (detail.notes) submitData.append(`detail_budgets[${index}][notes]`, detail.notes);
      });
      const newIndex = detailBudgets.length;
      submitData.append(`detail_budgets[${newIndex}][item_name]`, "Pengajuan Tambahan Budget Operasional");
      submitData.append(`detail_budgets[${newIndex}][quantity]`, "1");
      submitData.append(`detail_budgets[${newIndex}][item_price]`, requestBudgetAmount.toString());
      submitData.append(`detail_budgets[${newIndex}][amount_proposal]`, requestBudgetAmount.toString());
      submitData.append(`detail_budgets[${newIndex}][amount_pelaksanaan]`, "0");
      submitData.append(`detail_budgets[${newIndex}][amount]`, requestBudgetAmount.toString());
      submitData.append(`detail_budgets[${newIndex}][notes]`, requestBudgetNotes || "Pengajuan request tambahan budget");
      await axios.post(`/api/v1/projects/${project.uuid}`, submitData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setIsRequestBudgetOpen(false);
      setRequestBudgetAmount(0);
      setRequestBudgetNotes("");
      if (onShowToast) onShowToast("Pengajuan tambahan budget berhasil dikirim", "success");
      if (refetchProject) refetchProject();
    } catch (error) {
      console.error("Error requesting additional budget:", error);
      if (onShowToast) onShowToast(error?.response?.data?.message || "Gagal mengajukan tambahan budget", "error");
    } finally {
      setIsSubmittingRequestBudget(false);
    }
  };
  const totalPelaksanaan = detailBudgets.reduce((sum, item) => sum + (Number(item.used_eer) > 0 ? Number(item.used_eer) : Number(item.amount_pelaksanaan) || 0), 0);
  const totalProposal = detailBudgets.reduce((sum, item) => sum + (Number(item.amount_proposal) || 0), 0);
  const totalUsedAtr = detailBudgets.reduce((sum, item) => sum + (Number(item.used_atr) || 0), 0);
  const totalUsedEer = detailBudgets.reduce((sum, item) => sum + (Number(item.used_eer) || 0), 0);
  const computedRemainingOperational = opsBudget - (project.used_atr || 0) - (project.used_eer_reimbursement || 0) + (project.used_eer_refund || 0);
  const estimasiProfit = (project.budget_total || 0) - totalPelaksanaan;
  return /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
    /* @__PURE__ */ jsx("div", { ref: tabsListRef, className: "overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide", children: /* @__PURE__ */ jsxs(TabsList, { className: "inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max md:w-full min-w-full md:min-w-0", children: [
      /* @__PURE__ */ jsx(TabsTrigger, { value: "detail", className: "flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white", children: "Detail & Proposal" }),
      /* @__PURE__ */ jsx(TabsTrigger, { value: "timeline", className: "flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white", children: "Timeline" }),
      /* @__PURE__ */ jsx(TabsTrigger, { value: "budget", className: "flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white", children: "Anggaran" }),
      /* @__PURE__ */ jsx(TabsTrigger, { value: "monitoring", className: "flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white", children: "Monitoring" }),
      /* @__PURE__ */ jsx(TabsTrigger, { value: "closing", className: "flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white", children: "Closing" })
    ] }) }),
    /* @__PURE__ */ jsx(TabsContent, { value: "detail", className: "mt-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "bg-muted/30 border-none shadow-none", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "px-0 pt-0", children: [
          /* @__PURE__ */ jsx(CardTitle, { children: currentStatus === "active" ? "Dokumen Kontrak" : "Dokumen Proposal Project" }),
          /* @__PURE__ */ jsx(CardDescription, { children: currentStatus === "active" ? "List Dokumen Kontrak utama yang telah disepakati." : "Dokumen proposal yang diajukan ke klien." })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "px-0", children: project.supporting_docs && project.supporting_docs.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: project.supporting_docs.map((doc, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 w-full md:w-auto", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-orange-50 p-2.5 rounded-lg text-orange-600 shrink-0 border border-orange-100", children: /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900 text-sm", children: doc.filename }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "mt-1 text-[10px] uppercase font-bold tracking-wider", children: doc.type })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              className: "gap-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs shadow-sm",
              onClick: () => window.open(doc.url || doc.path, "_blank"),
              children: [
                /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }),
                "Preview"
              ]
            }
          )
        ] }, i)) }) : /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 rounded-xl border border-dashed text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6 text-gray-400" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-900", children: "Belum ada dokumen" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Belum ada dokumen proposal atau TOR yang diunggah." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-none bg-transparent mt-6", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "px-0 pt-0", children: /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Lokasi Pelaksanaan" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Klik pada list untuk melihat detail lokasi di peta." })
        ] }) }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "px-0", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs(Card, { className: "lg:col-span-1 h-[400px] border rounded-xl shadow-sm overflow-hidden flex flex-col", children: [
            /* @__PURE__ */ jsx("div", { className: "p-4 border-b bg-gray-50", children: /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-sm", children: [
              "Daftar Titik (",
              locations.length,
              ")"
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "overflow-y-auto p-4 space-y-3 flex-1 custom-scrollbar", children: locations.map((loc, idx) => {
              const isActive = idx === selectedLocIndex;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => setSelectedLocIndex(idx),
                  className: `flex gap-3 items-start p-3 border rounded-lg cursor-pointer transition-all duration-200 group
                                ${isActive ? "bg-gray-50 border-gray-500 shadow-sm ring-1 ring-gray-500" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`,
                  children: [
                    /* @__PURE__ */ jsx("div", { className: `mt-0.5 p-1.5 rounded-full ${isActive ? "bg-gray-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600"}`, children: /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                        /* @__PURE__ */ jsxs("h4", { className: `font-semibold text-xs ${isActive ? "text-green-700" : "text-gray-900"}`, children: [
                          "Titik ",
                          idx + 1
                        ] }),
                        isActive && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full", children: "Aktif" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2", children: loc.address }),
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400 mt-2 font-mono flex items-center gap-1", children: /* @__PURE__ */ jsxs("span", { children: [
                        loc.lat.toFixed(5),
                        ", ",
                        loc.lng.toFixed(5)
                      ] }) })
                    ] })
                  ]
                },
                idx
              );
            }) })
          ] }),
          /* @__PURE__ */ jsx(Card, { className: "lg:col-span-2 overflow-hidden border-none shadow-none h-[400px]", children: /* @__PURE__ */ jsx("div", { className: "h-full w-full border rounded-xl overflow-hidden shadow-sm relative", children: /* @__PURE__ */ jsx(
            LocationPicker,
            {
              initialLat: locations[selectedLocIndex]?.lat || -6.2,
              initialLng: locations[selectedLocIndex]?.lng || 106.8,
              initialAddress: locations[selectedLocIndex]?.address,
              readOnly: true,
              existingLocations: (locations || []).filter((_, i) => i !== selectedLocIndex).map((loc) => ({
                lat: Number(loc.lat),
                lng: Number(loc.lng),
                address: loc.address
              }))
            },
            selectedLocIndex
          ) }) })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(TabsContent, { value: "timeline", className: "mt-4", children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Timeline Progress" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Status tahapan pelaksanaan proyek." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-8", children: (() => {
        const data = monitoringList || [];
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        const startDate = project.start_date ? new Date(project.start_date) : new Date(Number(currentYear), 0, 1);
        const endDate = project.end_date ? new Date(project.end_date) : new Date(startDate.getFullYear(), 11, 31);
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "md:hidden space-y-6 relative pl-6 border-l-2 border-emerald-500/40 ml-4 py-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-[var(--sidebar)] border-2 border-white shadow-sm" }),
              /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50/80 p-3 rounded-lg border border-emerald-100", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold uppercase tracking-wider text-emerald-700", children: [
                  "Mulai Proyek (",
                  startDate.getFullYear(),
                  ")"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800", children: startDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) })
              ] })
            ] }),
            data.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-white border-2 border-[var(--sidebar)] shadow-sm" }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white p-3.5 rounded-lg border shadow-sm space-y-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-emerald-700", children: item.report_date || item.date ? new Date(item.report_date || item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-" }),
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
                    "Laporan #",
                    index + 1
                  ] })
                ] }),
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-xs text-slate-800", children: item.title || "Laporan Monitoring" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: item.notes || "Tidak ada catatan." })
              ] })
            ] }, index)),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-slate-700 border-2 border-white shadow-sm" }),
              /* @__PURE__ */ jsxs("div", { className: "bg-slate-100 p-3 rounded-lg border border-slate-200", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-600", children: [
                  "Target Selesai (",
                  endDate.getFullYear(),
                  ")"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800", children: endDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block relative w-full overflow-x-auto pb-32 pt-32 px-4", children: /* @__PURE__ */ jsx("div", { className: "min-w-[900px] px-32", children: /* @__PURE__ */ jsxs("div", { className: "relative h-1.5 bg-slate-200 w-full rounded-full mt-12 mb-12", children: [
            /* @__PURE__ */ jsxs("div", { className: "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "h-5 w-5 bg-[var(--sidebar)] rounded-full border-4 border-white shadow-md z-10" }),
              /* @__PURE__ */ jsxs("div", { className: "text-center w-32 absolute top-8", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-800", children: startDate.getFullYear() }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold tracking-wider text-slate-400", children: "START" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 mt-0.5 font-medium bg-slate-100 px-2 py-0.5 rounded-full inline-block", children: startDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex flex-col items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "h-5 w-5 bg-slate-600 rounded-full border-4 border-white shadow-md z-10" }),
              /* @__PURE__ */ jsxs("div", { className: "text-center w-32 absolute top-8", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-800", children: endDate.getFullYear() }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold tracking-wider text-slate-400", children: "FINISH" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 mt-0.5 font-medium bg-slate-100 px-2 py-0.5 rounded-full inline-block", children: endDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" }) })
              ] })
            ] }),
            data.map((item, index) => {
              const start = startDate.getTime();
              const end = endDate.getTime();
              const current = new Date(item.report_date || item.date).getTime();
              let percentage = (current - start) / (end - start) * 100;
              percentage = Math.max(2, Math.min(98, percentage));
              const isTop = index % 2 === 0;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "absolute top-1/2 -translate-y-1/2",
                  style: { left: `${percentage}%` },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full border-[3px] border-[var(--sidebar)] shadow-md z-10 group-hover:scale-125 transition-transform duration-300" }),
                    /* @__PURE__ */ jsxs("div", { className: `absolute flex flex-col items-center w-52 transition-all duration-300 hover:z-30 cursor-pointer group
                                                                    ${isTop ? "bottom-8 left-1/2 -translate-x-1/2 hover:-translate-y-2" : "top-8 left-1/2 -translate-x-1/2 hover:translate-y-2"}
                                                                `, children: [
                      /* @__PURE__ */ jsx("div", { className: `absolute left-1/2 -translate-x-1/2 w-0 border-l border-dashed border-slate-300 h-8 
                                                                        ${isTop ? "top-full" : "bottom-full"}
                                                                    ` }),
                      /* @__PURE__ */ jsxs("div", { className: `bg-white p-4 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 text-center w-full relative
                                                                        ${isTop ? "mb-2" : "mt-2"}
                                                                    `, children: [
                        /* @__PURE__ */ jsx("div", { className: `absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-slate-100
                                                                             ${isTop ? "-bottom-1.5 border-t-0 border-l-0 shadow-[2px_2px_2px_-1px_rgba(0,0,0,0.05)]" : "-top-1.5 border-b-0 border-r-0 border-t border-l shadow-[-1px_-1px_2px_-1px_rgba(0,0,0,0.05)]"}
                                                                        ` }),
                        /* @__PURE__ */ jsxs("div", { className: "mb-2 pb-2 border-b border-slate-50", children: [
                          /* @__PURE__ */ jsx("p", { className: "text-[var(--sidebar)] font-bold text-xl leading-none", children: item.report_date || item.date ? new Date(item.report_date || item.date).getDate() : "-" }),
                          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-wider", children: item.report_date || item.date ? new Date(item.report_date || item.date).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : "-" })
                        ] }),
                        /* @__PURE__ */ jsx("h4", { className: "font-semibold text-xs text-slate-800 line-clamp-1 mb-1", children: item.title || "Laporan Monitoring" }),
                        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 line-clamp-2 leading-relaxed", children: item.notes || "Tidak ada catatan." })
                      ] })
                    ] })
                  ]
                },
                index
              );
            })
          ] }) }) })
        ] });
      })() }) })
    ] }) }),
    /* @__PURE__ */ jsx(TabsContent, { value: "budget", className: "mt-4", children: /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2", children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Keuangan" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Informasi nominal dan rincian anggaran biaya (RAB)." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "grid md:grid-cols-2 gap-6 pt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center p-6 bg-green-50 rounded-xl border border-slate-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 text-green-700 rounded-md", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-xs", children: "Rp" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total Anggaran Project" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-slate-900 tracking-tight", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(project.budget_total || 0) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "*Keuangan project." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col justify-center p-6 border rounded-xl hover:bg-muted/5 transition-colors h-full bg-white", children: (() => {
          const rabDoc = project.supporting_docs?.find((d) => d.type === "RAB" || d.type === "Budget");
          if (rabDoc) {
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "bg-blue-50 p-2.5 rounded-lg text-blue-600 shrink-0 border border-blue-100", children: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-semibold text-sm text-gray-900 truncate", children: rabDoc.filename }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Document RAB • Ready" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-muted-foreground hover:text-primary",
                    onClick: () => window.open(rabDoc.url || rabDoc.path, "_blank"),
                    children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-muted-foreground hover:text-primary",
                    onClick: () => window.open(rabDoc.url || rabDoc.path, "_blank"),
                    children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] });
          } else {
            return /* @__PURE__ */ jsx("div", { className: "text-center py-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Belum ada dokumen Rincian Anggaran (RAB)." }) });
          }
        })() }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-slate-900", children: "Pembagian Anggaran" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Rincian alokasi anggaran operasional, manajemen, dan allowance." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 items-center w-full sm:w-auto", children: [
              canInputBudget && !editPartitions && /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => setEditPartitions(true), className: "flex-1 sm:flex-initial text-xs h-9 sm:h-8", children: [
                /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4 mr-1.5" }),
                " Atur Anggaran"
              ] }),
              editPartitions && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => setEditPartitions(false), disabled: savingBudget, className: "flex-1 sm:flex-initial text-xs h-9 sm:h-8", children: "Batal" }),
                /* @__PURE__ */ jsx(Button, { size: "sm", onClick: handleSaveBudget, disabled: savingBudget, className: "flex-1 sm:flex-initial text-xs h-9 sm:h-8", children: savingBudget ? /* @__PURE__ */ jsx(Loader, { className: "w-4 h-4 animate-spin" }) : "Simpan" })
              ] }),
              localBudgetStatus !== "approved" && canApproveBudget && /* @__PURE__ */ jsx(Button, { size: "sm", onClick: handleApproveBudget, disabled: savingBudget, className: "flex-1 sm:flex-initial text-xs h-9 sm:h-8 bg-green-600 hover:bg-green-700 text-white", children: savingBudget ? /* @__PURE__ */ jsx(Loader, { className: "w-4 h-4 animate-spin" }) : "Setujui Pembagian" })
            ] })
          ] }),
          opsBudget < totalPelaksanaan && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", className: "mb-4", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx(AlertTitle, { children: "Peringatan Anggaran" }),
                /* @__PURE__ */ jsx(AlertDescription, { children: "Project activity memiliki pagu lebih besar dari operational, update/ remove project activity terlebih dahulu atau ajukan tambahan budget operational beserta catatannya (jika diperlukan)." })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "whitespace-nowrap bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200",
                  onClick: () => setIsRequestBudgetOpen(true),
                  children: "Ajukan Tambahan"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-5 border rounded-xl bg-white shadow-sm space-y-1 hover:border-blue-200 transition-colors", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2", children: "Operasional" }),
              editPartitions ? /* @__PURE__ */ jsx(
                MoneyInput,
                {
                  value: opsBudget,
                  onValueChange: (values) => {
                    const val = values.floatValue || 0;
                    setOpsBudget(val);
                  },
                  placeholder: "Nilai Operasional",
                  disabled: !isAdminOrFinance
                }
              ) : /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-slate-900 tracking-tight", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(opsBudget) }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground pt-1", children: [
                "Maksimum pagu operasional ",
                project.budget_total > 0 ? (opsBudget / project.budget_total * 100).toFixed(1) : 0,
                "%"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-slate-50 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: "Terpakai ATR" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-slate-700 truncate", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(project.used_atr || 0) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: "Terpakai EER" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-slate-700 truncate", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(project.used_eer || 0) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-blue-50/50 p-1.5 rounded-md gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-blue-700 shrink-0", children: "Sisa Anggaran" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-blue-700 truncate", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(computedRemainingOperational) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-5 border rounded-xl bg-white shadow-sm space-y-1 hover:border-purple-200 transition-colors", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-2", children: "Manajemen" }),
              editPartitions ? /* @__PURE__ */ jsx(
                MoneyInput,
                {
                  value: mgmtBudget,
                  onValueChange: (values) => {
                    const val = values.floatValue || 0;
                    setMgmtBudget(val);
                  },
                  placeholder: "Nilai Manajemen",
                  disabled: !isAdminOrFinance
                }
              ) : /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-slate-900 tracking-tight", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(mgmtBudget) }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground pt-1", children: [
                "Pagu manajemen ",
                project.budget_total > 0 ? (mgmtBudget / project.budget_total * 100).toFixed(1) : 0,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-5 border rounded-xl bg-white shadow-sm space-y-1 hover:border-amber-200 transition-colors", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2", children: "Allowance" }),
              editPartitions ? /* @__PURE__ */ jsx(
                MoneyInput,
                {
                  value: allowanceBudget,
                  onValueChange: (values) => {
                    const val = values.floatValue || 0;
                    setAllowanceBudget(val);
                  },
                  placeholder: "Nilai Allowance",
                  disabled: !isAdminOrFinance
                }
              ) : /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-slate-900 tracking-tight", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(allowanceBudget) }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground pt-1", children: [
                "Maksimum pagu allowance ",
                project.budget_total > 0 ? (allowanceBudget / project.budget_total * 100).toFixed(1) : 0,
                "%"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-slate-50 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: "Usage Allowance" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-slate-700 truncate", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(project.used_allowance || 0) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-amber-50/50 p-1.5 rounded-md gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-amber-700 shrink-0", children: "Sisa Allowance" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-amber-700 truncate", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(project.remaining_allowance || 0) })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 pt-6 border-t mt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-slate-900", children: "Kegiatan Anggaran Proyek" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Detail pengelokasian kegiatan anggaran." })
            ] }),
            canManageDetailBudget && !editDetailBudget && /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setEditDetailBudget(true),
                className: "h-8 gap-1.5 text-xs w-full sm:w-auto",
                children: [
                  /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }),
                  "Edit Rincian"
                ]
              }
            )
          ] }),
          !editDetailBudget ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "md:hidden space-y-3", children: [
              detailBudgets.length > 0 ? detailBudgets.map((detail, idx) => {
                const proposal = Number(detail.amount_proposal) || 0;
                const usedAtr = Number(detail.used_atr) || 0;
                const usedEer = Number(detail.used_eer) || 0;
                const pelaksanaan = usedEer > 0 ? usedEer : Number(detail.amount_pelaksanaan) || 0;
                const eerDiff = usedAtr - usedEer;
                return /* @__PURE__ */ jsxs(Card, { className: "p-4 space-y-3 border border-slate-200", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 border-b pb-2", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: [
                        "Kegiatan #",
                        idx + 1
                      ] }),
                      /* @__PURE__ */ jsx("h5", { className: "font-semibold text-sm text-slate-900", children: detail.item_name || "-" })
                    ] }),
                    usedAtr > 0 || usedEer > 0 ? /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `font-mono text-[10px] shrink-0 ${eerDiff > 0 ? "text-green-600 border-green-200 bg-green-50" : eerDiff < 0 ? "text-red-600 border-red-200 bg-red-50" : "text-gray-500 border-gray-200 bg-gray-50"}`, children: [
                      eerDiff > 0 ? "Refund: " : eerDiff < 0 ? "Reimb: " : "Balance: ",
                      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Math.abs(eerDiff))
                    ] }) : null
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Proposal" }),
                      /* @__PURE__ */ jsx("p", { className: "font-mono font-medium text-slate-700", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(proposal) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Pelaksanaan" }),
                      /* @__PURE__ */ jsx("p", { className: "font-mono font-bold text-emerald-700", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(pelaksanaan) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Terpakai ATR" }),
                      /* @__PURE__ */ jsx("p", { className: "font-mono font-medium text-orange-600", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(usedAtr) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Terpakai EER" }),
                      /* @__PURE__ */ jsx("p", { className: "font-mono font-medium text-blue-600", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(usedEer) })
                    ] })
                  ] }),
                  detail.notes && /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t text-[11px] text-muted-foreground", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-600", children: "Catatan: " }),
                    detail.notes
                  ] })
                ] }, idx);
              }) : /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-muted-foreground italic bg-white border rounded-xl", children: "Belum ada rincian anggaran." }),
              detailBudgets.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "p-4 bg-slate-50 border border-slate-200 space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs font-semibold", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Total Proposal (",
                    project.budget_total > 0 ? (totalProposal / project.budget_total * 100).toFixed(1) : 0,
                    "%):"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "font-mono text-primary", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalProposal) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs font-semibold", children: [
                  /* @__PURE__ */ jsx("span", { children: "Total Pelaksanaan:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-mono text-emerald-700", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalPelaksanaan) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs font-bold pt-2 border-t", children: [
                  /* @__PURE__ */ jsx("span", { children: "Estimasi Profit:" }),
                  /* @__PURE__ */ jsx("span", { className: `font-mono text-sm ${estimasiProfit >= 0 ? "text-emerald-700" : "text-red-600"}`, children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(estimasiProfit) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "hidden md:block bg-white border rounded-xl shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium text-gray-500 w-12 text-center", children: "No" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium text-gray-500", children: "Nama Kegiatan" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium text-gray-500 text-right", children: "Amount Proposal" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium text-gray-500 text-right", children: "Terpakai ATR" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium text-gray-500 text-right", children: "Terpakai EER" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium text-gray-500 text-right", children: "Pelaksanaan" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium text-gray-500 text-right", children: "Status EER" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium text-gray-500", children: "Catatan" })
              ] }) }),
              /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-100", children: [
                detailBudgets.length > 0 ? detailBudgets.map((detail, idx) => {
                  const proposal = Number(detail.amount_proposal) || 0;
                  const usedAtr = Number(detail.used_atr) || 0;
                  const usedEer = Number(detail.used_eer) || 0;
                  const pelaksanaan = usedEer > 0 ? usedEer : Number(detail.amount_pelaksanaan) || 0;
                  const eerDiff = usedAtr - usedEer;
                  return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center text-muted-foreground", children: idx + 1 }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: detail.item_name || "-" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-mono", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(proposal) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-mono text-orange-600", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(usedAtr) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-mono text-blue-600", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(usedEer) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-mono font-semibold", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(pelaksanaan) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: usedAtr > 0 || usedEer > 0 ? /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `font-mono text-[10px] ${eerDiff > 0 ? "text-green-600 border-green-200 bg-green-50" : eerDiff < 0 ? "text-red-600 border-red-200 bg-red-50" : "text-gray-500 border-gray-200 bg-gray-50"}`, children: [
                      eerDiff > 0 ? "Refund: " : eerDiff < 0 ? "Reimb: " : "Balance: ",
                      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Math.abs(eerDiff))
                    ] }) : "-" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted-foreground", children: detail.notes || "-" })
                  ] }, idx);
                }) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "px-4 py-8 text-center text-muted-foreground italic", children: "Belum ada rincian anggaran." }) }),
                detailBudgets.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50/80 font-semibold border-t-2", children: [
                    /* @__PURE__ */ jsxs("td", { colSpan: 2, className: "px-4 py-3 text-right text-gray-700", children: [
                      "Total (",
                      project.budget_total > 0 ? (totalProposal / project.budget_total * 100).toFixed(1) : 0,
                      "%):"
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-mono text-primary", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalProposal) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-mono text-orange-600", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalUsedAtr) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-mono text-blue-600", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalUsedEer) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-mono text-primary", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalPelaksanaan) }),
                    /* @__PURE__ */ jsx("td", { colSpan: 2 })
                  ] }),
                  /* @__PURE__ */ jsxs("tr", { className: "bg-emerald-50/80 border-t", children: [
                    /* @__PURE__ */ jsxs("td", { colSpan: 2, className: "px-4 py-3 text-right text-emerald-800 font-bold", children: [
                      "Estimasi Profit (Total Pagu - Pelaksanaan) (",
                      project.budget_total > 0 ? (estimasiProfit / project.budget_total * 100).toFixed(1) : 0,
                      "%):"
                    ] }),
                    /* @__PURE__ */ jsx("td", { colSpan: 6, className: `px-4 py-3 text-right font-mono text-lg font-bold ${estimasiProfit >= 0 ? "text-emerald-700" : "text-red-600"}`, children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(estimasiProfit) })
                  ] })
                ] })
              ] })
            ] }) })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "border rounded-xl p-3 sm:p-5 bg-gray-50/50 space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: detailBudgets.map((detail, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-3.5 sm:p-4 rounded-xl border shadow-xs space-y-3 hover:border-blue-200 transition-colors", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b pb-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wider", children: [
                  "Kegiatan #",
                  idx + 1
                ] }),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "h-7 px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-600 gap-1",
                    onClick: () => {
                      const toDelete = detailBudgets[idx];
                      const newDetails = detailBudgets.filter((_, i) => i !== idx);
                      setDetailBudgets(newDetails);
                      if (!toDelete.isNew && toDelete.id) {
                        setDeleteDetailBudgets([...deleteDetailBudgets, toDelete.id]);
                      }
                    },
                    children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[11px]", children: "Hapus" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 md:col-span-4 space-y-1", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Nama Kegiatan" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "text",
                      value: detail.item_name || "",
                      onChange: (e) => {
                        const newDetails = [...detailBudgets];
                        newDetails[idx].item_name = e.target.value;
                        setDetailBudgets(newDetails);
                      },
                      placeholder: "Nama Kegiatan...",
                      className: "h-9 text-xs bg-white"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "sm:col-span-1 md:col-span-2 space-y-1", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Proposal" }),
                  /* @__PURE__ */ jsx(
                    MoneyInput,
                    {
                      value: detail.amount_proposal || 0,
                      onValueChange: (vals) => {
                        const newDetails = [...detailBudgets];
                        newDetails[idx].amount_proposal = vals.floatValue || 0;
                        newDetails[idx].amount = vals.floatValue || 0;
                        setDetailBudgets(newDetails);
                      },
                      placeholder: "0",
                      className: "h-9 text-xs bg-white"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "sm:col-span-1 md:col-span-2 space-y-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-1", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Pelaksanaan" }),
                    Number(detail.used_eer) > 0 && /* @__PURE__ */ jsxs("span", { className: "text-blue-500 normal-case text-[9px] truncate", children: [
                      "(",
                      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(detail.used_eer),
                      " EER)"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    MoneyInput,
                    {
                      value: detail.amount_pelaksanaan,
                      onValueChange: (vals) => {
                        const newDetails = [...detailBudgets];
                        newDetails[idx].amount_pelaksanaan = vals.floatValue || 0;
                        setDetailBudgets(newDetails);
                      },
                      placeholder: "0",
                      className: "h-9 text-xs bg-white"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 md:col-span-4 space-y-1", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Catatan" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "text",
                      value: detail.notes || "",
                      onChange: (e) => {
                        const newDetails = [...detailBudgets];
                        newDetails[idx].notes = e.target.value;
                        setDetailBudgets(newDetails);
                      },
                      placeholder: "Keterangan...",
                      className: "h-9 text-xs bg-white"
                    }
                  )
                ] })
              ] })
            ] }, detail.id)) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 sm:p-4 bg-white border rounded-xl shadow-xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Total Proposal" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm font-bold text-blue-600 truncate", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(detailBudgets.reduce((sum, item) => sum + (Number(item.amount_proposal) || 0), 0)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 pl-3 border-l", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Total Pelaksanaan" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm font-bold text-indigo-600 truncate", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(detailBudgets.reduce((sum, item) => sum + (Number(item.amount_pelaksanaan) || 0), 0)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:pl-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Operational Budget" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm font-bold text-gray-900 truncate", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(opsBudget) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 pt-2 sm:pt-0 pl-3 border-t sm:border-t-0 border-l", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: "Estimasi Profit" }),
                /* @__PURE__ */ jsx("p", { className: `text-xs sm:text-sm font-bold truncate ${project.budget_total - detailBudgets.reduce((sum, item) => sum + (Number(item.amount_pelaksanaan) || 0), 0) >= 0 ? "text-emerald-600" : "text-red-600"}`, children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(project.budget_total - detailBudgets.reduce((sum, item) => sum + (Number(item.amount_pelaksanaan) || 0), 0)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setDetailBudgets([...detailBudgets, { id: crypto.randomUUID(), item_name: "", quantity: null, item_price: 0, amount: 0, amount_pelaksanaan: 0, amount_proposal: 0, notes: "", isNew: true }]),
                  className: "gap-1.5 border-dashed w-full sm:w-auto h-9 text-xs",
                  children: [
                    /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
                    "Tambah Kegiatan"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto justify-end", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "flex-1 sm:flex-initial h-9 text-xs",
                    onClick: () => {
                      setEditDetailBudget(false);
                      setDetailBudgets(project.budget_details || []);
                      setDeleteDetailBudgets([]);
                    },
                    children: "Batal"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    size: "sm",
                    onClick: handleSaveDetailBudget,
                    disabled: savingDetailBudget,
                    className: "flex-1 sm:flex-initial h-9 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700",
                    children: [
                      savingDetailBudget ? /* @__PURE__ */ jsx(Loader, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }),
                      "Simpan Rincian"
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 border-t pt-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Termin Pembayaran" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Jadwal pembayaran bertahap untuk proyek ini" })
        ] }) }),
        (() => {
          const terms = localPaymentTerms;
          return terms.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            terms.map((term, idx) => {
              const isVerified = !!term.verified_by;
              return /* @__PURE__ */ jsx("div", { className: `border rounded-xl p-5 bg-white shadow-sm transition-all ${isVerified ? "border-green-200 bg-green-50/30" : "border-gray-200"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-base text-gray-900", children: [
                      "Termin #",
                      idx + 1
                    ] }),
                    isVerified ? /* @__PURE__ */ jsxs(Badge, { className: "bg-green-100 text-green-700 border-green-200 gap-1", children: [
                      /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }),
                      "Verified"
                    ] }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-orange-700 border-orange-200 bg-orange-50", children: "Pending" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Nominal" }),
                      /* @__PURE__ */ jsxs("p", { className: "font-bold text-gray-900 flex flex-wrap items-center gap-1.5", children: [
                        /* @__PURE__ */ jsx("span", { children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(term.nominal) }),
                        project.budget_total > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-[10px] font-medium px-1.5 py-0 border-gray-200", children: [
                          (parseFloat(term.nominal) / project.budget_total * 100).toFixed(1),
                          "%"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Jatuh Tempo" }),
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: new Date(term.due_date || term.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Deliverables" }),
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 line-clamp-2", children: term.notes || "-" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Nomor Surat" }),
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 truncate", children: term.nomor_surat || "-" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Tertuju" }),
                      /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 truncate", children: term.tertuju || "-" })
                    ] })
                  ] })
                ] }),
                isAdminOrFinance && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3 md:w-64 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Verifikasi Pembayaran" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        id: `verify-${term.id}`,
                        checked: isVerified,
                        onChange: () => toggleVerification(term.id, isVerified),
                        className: "h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                      }
                    ),
                    /* @__PURE__ */ jsx("label", { htmlFor: `verify-${term.id}`, className: "text-sm font-medium cursor-pointer", children: isVerified ? "Pembayaran Terverifikasi" : "Tandai sebagai Terverifikasi" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Dokumen Penagihan" }),
                    term.billing_document ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-2 bg-gray-50 border rounded-lg", children: [
                      /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-gray-500 animate-pulse" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-700 flex-1 truncate", children: "Dokumen Penagihan.pdf" }),
                      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 text-blue-600 hover:text-blue-700", onClick: () => window.open(term.billing_document_url || term.billing_document, "_blank"), children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }) })
                    ] }) : /* @__PURE__ */ jsx("label", { className: "block", children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "file",
                        accept: ".pdf,.jpg,.jpeg,.png",
                        className: "text-xs h-9 cursor-pointer file:cursor-pointer file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-sm file:px-2 file:mr-2 hover:file:bg-gray-200",
                        onChange: (e) => {
                          const file = e.target.files?.[0];
                          if (file) handleTerminBillingUpload(term.id, file);
                        }
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Bukti Pembayaran" }),
                    term.proof_payment ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-2 bg-gray-50 border rounded-lg", children: [
                      /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-gray-500" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-700 flex-1 truncate", children: "Bukti Pembayaran.pdf" }),
                      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 text-blue-600 hover:text-blue-700", onClick: () => window.open(term.proof_payment_url || term.proof_payment, "_blank"), children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }) })
                    ] }) : /* @__PURE__ */ jsx("label", { className: "block", children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "file",
                        accept: ".pdf,.jpg,.jpeg,.png",
                        className: "text-xs h-9 cursor-pointer file:cursor-pointer file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-sm file:px-2 file:mr-2 hover:file:bg-gray-200",
                        onChange: (e) => {
                          const file = e.target.files?.[0];
                          if (file) handleTerminProofUpload(term.id, file);
                        }
                      }
                    ) })
                  ] })
                ] }) })
              ] }) }, term.id);
            }),
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-5 mt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-900", children: "Total Termin Pembayaran" }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-blue-700 mt-0.5", children: [
                  terms.filter((t) => t.verified_by).length,
                  " dari ",
                  terms.length,
                  " termin terverifikasi"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-left sm:text-right", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xl sm:text-2xl font-bold text-blue-900", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                  terms.reduce((sum, term) => sum + parseFloat(term.nominal), 0)
                ) }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-blue-700 mt-0.5", children: [
                  terms.length,
                  " termin terjadwal"
                ] })
              ] })
            ] }) })
          ] }) : /* @__PURE__ */ jsx("div", { className: "text-center py-8 border-2 border-dashed rounded-xl bg-gray-50", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Belum ada termin pembayaran yang terdaftar." }) });
        })()
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(TabsContent, { value: "monitoring", className: "mt-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm", children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "bg-gray-50/50 pb-4 border-b", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold", children: "Form Laporan & Monitoring" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Isi form di bawah untuk melaporkan update progres bulan ini." })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6 pt-6", children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Tanggal Laporan" }),
            /* @__PURE__ */ jsx(
              DatePicker,
              {
                value: reportForm.date,
                onChange: (v) => setReportForm({ ...reportForm, date: v })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Catatan / Kendala / Progres" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                placeholder: "Jelaskan secara detail progres yang dicapai atau kendala yang dihadapi...",
                className: "min-h-[120px] bg-white resize-y leading-relaxed",
                value: reportForm.notes,
                onChange: (e) => setReportForm({ ...reportForm, notes: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50/30 border border-gray-100 rounded-xl p-5 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { className: "text-gray-900 font-semibold", children: "Lampiran Dokumen" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Upload bukti laporan (Foto, PDF, Excel)." })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: addReportFileRow,
                  className: "h-8 gap-1.5 border-dashed border-gray-300 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors hover:scale-105",
                  children: [
                    /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
                    "Tambah File"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              reportForm.files.map((file) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 items-center group", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-[5]", children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "Judul Dokumen (Contoh: Laporan Keuangan)",
                    className: "h-9 text-sm bg-white",
                    value: file.title,
                    onChange: (e) => handleReportFileChange(file.id, "title", e.target.value)
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-[6]", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "file",
                      className: "h-9 w-full text-sm bg-white cursor-pointer file:cursor-pointer file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-sm file:px-3 file:mr-3 hover:file:bg-gray-200 transition-all",
                      onChange: (e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) handleReportFileChange(file.id, "file", selectedFile);
                      }
                    }
                  ),
                  file.file && /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-medium text-green-600 mt-1 truncate px-1", children: [
                    "✓ Terpilih: ",
                    file.file.name
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 shrink-0", onClick: () => removeReportFileRow(file.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }, file.id)),
              reportForm.files.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-4 border-2 border-dashed border-gray-200 rounded-lg text-center bg-white/50", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: 'Belum ada file dilampirkan. Klik "Tambah File" di atas.' }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "justify-between border-t p-4 bg-gray-50/50", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Pastikan data yang diinput sudah benar sebelum submit." }),
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: onSubmitReport,
              disabled: isSubmittingReport,
              className: "bg-[var(--sidebar)] text-white border-1 min-w-[180px] hover:bg-[var(--sidebar)] hover:scale-105",
              children: isSubmittingReport ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Submitting..."
              ] }) : "Submit Laporan"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 tracking-tight", children: "Riwayat Laporan" }),
        monitoringList.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 border rounded-xl bg-gray-50 text-muted-foreground", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-3", children: /* @__PURE__ */ jsx("div", { className: "p-3 bg-white rounded-full shadow-sm", children: /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6 text-gray-300" }) }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Belum ada riwayat laporan." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: monitoringList.map((history) => {
          const documents = history.documents || history.files || [];
          return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border shadow-sm hover:shadow-md transition-shadow", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 border-b flex flex-col md:flex-row gap-4 justify-between md:items-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("h4", { className: "font-bold text-base text-gray-900", children: new Date(history.report_date || history.date).toLocaleDateString("id-ID", { month: "long", year: "numeric" }) }) }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5 text-gray-400" }),
                  "Dilaporkan oleh: ",
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700", children: history.creator?.name || history.uploader_name || history.uploader || "-" }),
                  " • ",
                  new Date(history.report_date || history.date).toLocaleDateString("id-ID")
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100",
                  onClick: () => {
                    if (window.confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
                      onDeleteReport?.(history.id);
                    }
                  },
                  children: "Hapus"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-5 bg-gray-50/30", children: [
              /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 leading-relaxed whitespace-pre-line border-l-2 border-gray-300 pl-3", children: history.notes }) }),
              documents && documents.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4", children: documents.map((file, fIdx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-white border rounded p-2.5 hover:border-blue-400 cursor-pointer group transition-colors", onClick: () => window.open(file.url || file.path, "_blank"), children: [
                /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-2 rounded text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600", children: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-hidden", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: file.title || file.original_name || file.filename }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: file.original_name ? "Document" : file.type || "Document" })
                ] }),
                /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 text-gray-300 group-hover:text-blue-600" })
              ] }, fIdx)) })
            ] })
          ] }, history.id || Math.random());
        }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(TabsContent, { value: "closing", className: "mt-4", children: /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "pb-4 border-b bg-gray-50/50", children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Penutupan Proyek (Closing)" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Formulir finalisasi dan realisasi anggaran akhir." })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-8 pt-8 px-6 md:px-8", children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 mb-2", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-base font-semibold", children: "Total Biaya Anggaran" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Total pengeluaran riil selama proyek berlangsung." })
          ] }),
          /* @__PURE__ */ jsx(
            MoneyInput,
            {
              value: closingForm.actual_budget,
              onValueChange: (values) => setClosingForm({ ...closingForm, actual_budget: values.floatValue || 0 }),
              placeholder: "0",
              prefix: "Rp ",
              className: "bg-white h-12 text-lg text-left"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 my-6" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg mb-4", children: "Dokumen Kelengkapan " }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs(Label, { className: "font-medium", children: [
                "Laporan Kegiatan ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "border rounded-xl p-4 bg-white shadow-sm space-y-3", children: [
                project.documents?.some((d) => d.type === "report_activity") ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-2 bg-green-50 border border-green-100 rounded-lg", children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-green-600" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-green-700 flex-1 truncate", children: "Laporan Kegiatan Terupload" }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 text-blue-600", onClick: () => window.open(project.documents.find((d) => d.type === "report_activity").url || project.documents.find((d) => d.type === "report_activity").path, "_blank"), children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }) })
                ] }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Upload Laporan Kegiatan (PDF)." }),
                /* @__PURE__ */ jsxs("label", { className: "block border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-full group", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Upload, { className: "h-5 w-5 text-gray-600" }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: closingForm.files.laporan ? closingForm.files.laporan.name : "PDF, DOCX, JPG (Max 50MB)" }),
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-xs text-gray-900 text-center", children: "Klik untuk ganti atau upload baru" }),
                  /* @__PURE__ */ jsx(Input, { type: "file", className: "hidden", onChange: (e) => setClosingForm({ ...closingForm, files: { ...closingForm.files, laporan: e.target.files?.[0] } }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs(Label, { className: "font-medium", children: [
                "Berita Acara Serah Terima (BAST) ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "border rounded-xl p-4 bg-white shadow-sm space-y-3", children: [
                project.documents?.some((d) => d.type === "bast") ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-2 bg-green-50 border border-green-100 rounded-lg", children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-green-600" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-green-700 flex-1 truncate", children: "BAST Terupload" }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 text-blue-600", onClick: () => window.open(project.documents.find((d) => d.type === "bast").url || project.documents.find((d) => d.type === "bast").path, "_blank"), children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }) })
                ] }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Upload BAST." }),
                /* @__PURE__ */ jsxs("label", { className: "block border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-full group", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Upload, { className: "h-5 w-5 text-gray-600" }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: closingForm.files.bast ? closingForm.files.bast.name : "PDF, DOCX, JPG (Max 50MB)" }),
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-xs text-gray-900 text-center", children: "Klik untuk ganti atau upload baru" }),
                  /* @__PURE__ */ jsx(Input, { type: "file", className: "hidden", onChange: (e) => setClosingForm({ ...closingForm, files: { ...closingForm.files, bast: e.target.files?.[0] } }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 md:col-span-2", children: [
              /* @__PURE__ */ jsxs(Label, { className: "font-medium", children: [
                "Dokumen Penagihan ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "border rounded-xl p-4 bg-white shadow-sm space-y-3", children: [
                project.documents?.some((d) => d.type === "invoice") ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-2 bg-green-50 border border-green-100 rounded-lg", children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-green-600" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-green-700 flex-1 truncate", children: "Invoice Terupload" }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 text-blue-600", onClick: () => window.open(project.documents.find((d) => d.type === "invoice").url || project.documents.find((d) => d.type === "invoice").path, "_blank"), children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }) })
                ] }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Invoice / Kwitansi / Bukti Transfer." }),
                /* @__PURE__ */ jsxs("label", { className: "block border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-full group", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Upload, { className: "h-5 w-5 text-gray-600" }) }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: closingForm.files.penagihan ? closingForm.files.penagihan.name : "PDF, DOCX, JPG (Max 50MB)" }),
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-xs text-gray-900 text-center", children: "Klik untuk ganti atau upload baru" }),
                  /* @__PURE__ */ jsx(Input, { type: "file", className: "hidden", onChange: (e) => setClosingForm({ ...closingForm, files: { ...closingForm.files, penagihan: e.target.files?.[0] } }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 md:col-span-2", children: [
              /* @__PURE__ */ jsxs(Label, { className: "font-medium", children: [
                "Lesson Learned ",
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-normal", children: "(Catatan evaluasi dan pembelajaran proyek)" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-sm border p-4 resize-y overflow-auto min-h-[300px]", children: /* @__PURE__ */ jsx(
                Editor,
                {
                  defaultValue: closingForm.lesson_learned || "",
                  onTextChange: (content) => setClosingForm({ ...closingForm, lesson_learned: content }),
                  ref: quillRef
                }
              ) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row items-center justify-end gap-3 border-t pt-6 transition-all duration-300 mt-8", children: !isProjectDealed ? /* @__PURE__ */ jsxs(
          Button,
          {
            size: "lg",
            className: "gap-2 w-full md:w-auto bg-[#00763c] hover:bg-[#005f30] text-white shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95",
            onClick: () => setIsDealAlertOpen(true),
            children: [
              /* @__PURE__ */ jsx(Handshake, { className: "h-5 w-5" }),
              "Deal Project"
            ]
          }
        ) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "lg",
              className: "gap-2 w-full md:w-auto hover:bg-gray-50 shadow-sm transition-transform hover:scale-105 active:scale-95",
              onClick: handleSaveClosingChanges,
              disabled: savingClosing,
              children: [
                savingClosing ? /* @__PURE__ */ jsx(Loader, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
                "Simpan Perubahan"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "destructive",
              size: "lg",
              className: "gap-2 w-full md:w-auto animate-in fade-in zoom-in duration-300 shadow-md hover:scale-105 active:scale-95 transition-transform",
              onClick: () => setIsCloseAlertOpen(true),
              children: [
                /* @__PURE__ */ jsx(Archive, { className: "h-4 w-4" }),
                "Tutup Proyek (Closing)"
              ]
            }
          )
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isRequestBudgetOpen, onOpenChange: setIsRequestBudgetOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Ajukan Tambahan Budget Operasional" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Silakan masukkan nominal tambahan budget yang dibutuhkan beserta alasannya. Pengajuan ini akan ditambahkan sebagai rincian RAB baru (atau disesuaikan melalui proses approval)." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "req-amount", children: "Nominal Tambahan" }),
          /* @__PURE__ */ jsx(
            MoneyInput,
            {
              id: "req-amount",
              value: requestBudgetAmount,
              onValueChange: (vals) => setRequestBudgetAmount(vals.floatValue || 0),
              placeholder: "0",
              prefix: "Rp "
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "req-notes", children: "Catatan / Alasan Tambahan" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "req-notes",
              value: requestBudgetNotes,
              onChange: (e) => setRequestBudgetNotes(e.target.value),
              placeholder: "Jelaskan secara singkat mengapa tambahan budget operasional diperlukan...",
              className: "min-h-[100px]"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setIsRequestBudgetOpen(false), disabled: isSubmittingRequestBudget, children: "Batal" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "bg-blue-600 hover:bg-blue-700",
            onClick: handleRequestAdditionalBudget,
            disabled: isSubmittingRequestBudget || requestBudgetAmount <= 0,
            children: isSubmittingRequestBudget ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Mengajukan..."
            ] }) : "Ajukan Tambahan"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  ProjectTabs as default
};
