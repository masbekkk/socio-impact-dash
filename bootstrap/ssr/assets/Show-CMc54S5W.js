import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import ProjectTabs from "./ProjectTabs-QhLUq_oi.js";
import { usePage, Link, router } from "@inertiajs/react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-BRoV_jj3.js";
import axios from "axios";
import { S as Skeleton } from "./skeleton-wZJ-u2Ee.js";
import { S as StatusBadge } from "./StatusBadge-CfpbUrIp.js";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, f as CardFooter } from "./card-DAjHeOuX.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { Pencil, Trash2, Users, Handshake, ShieldCheck, User, Layers, Hash, CheckCircle2, Loader2, Plus, BarChart3, Wallet, Calendar } from "lucide-react";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
import "./tabs-C8TeAzVF.js";
import "./alert-BkuvEnvZ.js";
import "class-variance-authority";
import "./LocationPicker-CPEtG7vQ.js";
import "react-leaflet";
/* empty css                 */
import "leaflet";
import "./MoneyInput-Y8EKpX5J.js";
import "react-number-format";
import "./DatePicker-DtmT1I-q.js";
import "date-fns";
import "./textarea-CdP6R3x0.js";
import "quill";
import "@radix-ui/react-slot";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "date-fns/locale";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
function ProjectsShow({ project_slug }) {
  const { auth } = usePage().props;
  const { hasPermission } = usePermission();
  auth.permissions || [];
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  auth.user?.role_name;
  const currentUserId = auth.user?.id;
  const canUpdateCode = hasPermission("create_code_project");
  const [projectCode, setProjectCode] = useState("");
  const [initialProject, setInitialProject] = useState("");
  const [isUpdatingCode, setIsUpdatingCode] = useState(false);
  const [isUpdatingInitialProject, setIsUpdatingInitialProject] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Proyek", href: "/projects" },
    { title: "Detail Proyek", href: "#" }
  ];
  const [currentStatus, setCurrentStatus] = useState("draft");
  const [isProjectDealed, setIsProjectDealed] = useState(false);
  const [monitoringList, setMonitoringList] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isCloseAlertOpen, setIsCloseAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [approvalNote, setApprovalNote] = useState("");
  const [isApproveAlertOpen, setIsApproveAlertOpen] = useState(false);
  const [isRevisionAlertOpen, setIsRevisionAlertOpen] = useState(false);
  const [isDealAlertOpen, setIsDealAlertOpen] = useState(false);
  const fetchProject = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await axios.get(`/api/v1/projects/${project_slug}`);
      const data = response.data.data;
      setProject(data);
      setCurrentStatus(data.status);
      setMonitoringList(data.monitoring_history || []);
      if (data.locations && data.locations.length > 0) {
        setLocations(data.locations.map((loc) => ({
          id: loc.id.toString(),
          lat: parseFloat(loc.latitude),
          lng: parseFloat(loc.longitude),
          address: loc.detail_address || ""
        })));
      } else {
        setLocations([]);
      }
      setProjectCode(data.code || "");
      setInitialProject(data.initial_project || "");
      setClosingForm((prev) => ({
        ...prev,
        actual_budget: data.actual_budget || 0,
        lesson_learned: data.lesson_learned || ""
      }));
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [project_slug]);
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);
  const handleDealProject = async () => {
    try {
      await axios.post(`/api/v1/projects/${project_slug}/deal`);
      setIsDealAlertOpen(false);
      setIsProjectDealed(true);
      setCurrentStatus("active");
      setToast({ show: true, message: "Project berhasil di-Deal! Menu Penutupan Proyek kini aktif.", type: "success" });
      fetchProject(false);
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "Gagal melakukan deal project.", type: "error" });
    }
  };
  const handleApproveAction = async () => {
    try {
      await axios.post(`/api/v1/projects/${project_slug}/approve`, { notes: approvalNote });
      setIsApproveAlertOpen(false);
      setToast({ show: true, message: "Project berhasil di-approve.", type: "success" });
      fetchProject(false);
    } catch (error) {
      console.error("Error approving project:", error);
      setToast({ show: true, message: "Gagal approve project.", type: "error" });
    }
  };
  const handleRevisionAction = async () => {
    try {
      await axios.post(`/api/v1/projects/${project_slug}/reject`, { notes: approvalNote });
      setIsRevisionAlertOpen(false);
      setToast({ show: true, message: "Permintaan revisi dikirim.", type: "success" });
      fetchProject(false);
    } catch (error) {
      console.error("Error rejecting project:", error);
      setToast({ show: true, message: "Gagal mengirim revisi.", type: "error" });
    }
  };
  const [closingForm, setClosingForm] = useState({
    actual_budget: 0,
    // Will be set from project data or input
    lesson_learned: "",
    files: {
      laporan: null,
      bast: null,
      penagihan: null
    }
  });
  const [reportForm, setReportForm] = useState({
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    notes: "",
    files: [{ id: 1, title: "" }]
  });
  const addReportFileRow = () => {
    setReportForm({ ...reportForm, files: [...reportForm.files, { id: Date.now(), title: "" }] });
  };
  const removeReportFileRow = (id) => {
    setReportForm({ ...reportForm, files: reportForm.files.filter((f) => f.id !== id) });
  };
  const handleReportFileChange = (id, field, value) => {
    setReportForm({
      ...reportForm,
      files: reportForm.files.map((f) => f.id === id ? { ...f, [field]: value } : f)
    });
  };
  const submitReport = async () => {
    const formData = new FormData();
    formData.append("report_date", reportForm.date);
    formData.append("notes", reportForm.notes);
    let fileIndex = 0;
    reportForm.files.forEach((f) => {
      if (f.file) {
        formData.append(`documents[${fileIndex}][file]`, f.file);
        if (f.title) {
          formData.append(`documents[${fileIndex}][title]`, f.title);
        }
        fileIndex++;
      }
    });
    setIsSubmittingReport(true);
    try {
      await axios.post(`/api/v1/projects/${project_slug}/monitorings`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setToast({ show: true, message: "Laporan berhasil ditambahkan.", type: "success" });
      setReportForm({ date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0], notes: "", files: [{ id: Date.now(), title: "" }] });
      fetchProject(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      setToast({ show: true, message: "Gagal mengirim laporan.", type: "error" });
    } finally {
      setIsSubmittingReport(false);
    }
  };
  const handleDeleteReport = async (monitoringId) => {
    try {
      await axios.delete(`/api/v1/projects/${project_slug}/monitorings/${monitoringId}`);
      setToast({ show: true, message: "Laporan berhasil dihapus.", type: "success" });
      fetchProject(false);
    } catch (error) {
      console.error("Error deleting report:", error);
      setToast({ show: true, message: "Gagal menghapus laporan.", type: "error" });
    }
  };
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3e3);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);
  const handleCloseProject = async () => {
    const formData = new FormData();
    formData.append("actual_budget", closingForm.actual_budget.toString());
    const fileTypes = {
      laporan: "report_activity",
      bast: "bast",
      penagihan: "invoice"
    };
    let idx = 0;
    Object.entries(closingForm.files).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(`documents[${idx}][file]`, file);
        formData.append(`documents[${idx}][type]`, fileTypes[key] || "other");
        idx++;
      }
    });
    formData.append("lesson_learned", closingForm.lesson_learned || "");
    try {
      await axios.post(`/api/v1/projects/${project_slug}/close`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setIsCloseAlertOpen(false);
      setCurrentStatus("completed");
      setToast({ show: true, message: "Proyek berhasil ditutup (Closing Success).", type: "success" });
      fetchProject(false);
    } catch (error) {
      console.error("Error closing project:", error);
      setToast({ show: true, message: "Gagal menutup proyek.", type: "error" });
    }
  };
  const handleDeleteProject = async () => {
    try {
      await axios.delete(`/api/v1/projects/${project_slug}`);
      setIsDeleteAlertOpen(false);
      setToast({ show: true, message: "Proyek berhasil dihapus.", type: "success" });
      setTimeout(() => {
        router.visit("/projects");
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "Gagal menghapus proyek.", type: "error" });
    }
  };
  const handleUpdateCode = async () => {
    if (!projectCode || projectCode === project.code) return;
    setIsUpdatingCode(true);
    try {
      await axios.post(`/api/v1/projects/${project_slug}`, {
        _method: "PUT",
        code: projectCode
      });
      setToast({ show: true, message: "Kode proyek berhasil diperbarui.", type: "success" });
      fetchProject(false);
    } catch (error) {
      console.error("Error updating project code:", error);
      setToast({
        show: true,
        message: error.response?.data?.message || "Gagal memperbarui kode proyek.",
        type: "error"
      });
    } finally {
      setIsUpdatingCode(false);
    }
  };
  const handleUpdateInitialProject = async () => {
    if (!initialProject || initialProject === project.initial_project) return;
    setIsUpdatingInitialProject(true);
    try {
      await axios.post(`/api/v1/projects/${project_slug}`, {
        _method: "PUT",
        initial_project: initialProject
      });
      setToast({ show: true, message: "Initial project berhasil diperbarui.", type: "success" });
      fetchProject(false);
    } catch (error) {
      console.error("Error updating initial project:", error);
      setToast({
        show: true,
        message: error.response?.data?.message || "Gagal memperbarui initial project.",
        type: "error"
      });
    } finally {
      setIsUpdatingInitialProject(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx(AppSidebarLayout, { breadcrumbs, children: /* @__PURE__ */ jsxs("div", { className: "p-8 space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-full" })
    ] }) });
  }
  project?.account_manager_id === currentUserId;
  project?.head_id === currentUserId;
  project?.pic_id === currentUserId;
  project.approvals && project.approvals.length > 0 ? project.approvals.map((ap) => {
    let roleName = "";
    switch (ap.approval_type) {
      case "finance":
        roleName = "ACCOUNT MANAGER";
        break;
      case "hr":
        roleName = "HEAD IMPLEMENTATION";
        break;
      case "direktur":
        roleName = "PIC PROJECT";
        break;
      default:
        roleName = ap.approval_type;
    }
    return {
      ...ap,
      role: roleName,
      name: ap.approved_by?.name || "-",
      status: ap.approval_status,
      note: ap.notes,
      date: ap.updated_at
    };
  }) : [];
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-4 md:p-8 pb-0", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: project.name }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", children: project.code })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: project.division?.name || "-" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0", children: [
        /* @__PURE__ */ jsx(StatusBadge, { status: currentStatus }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full sm:w-auto", children: [
          /* @__PURE__ */ jsx(Link, { href: `/projects/${project.uuid}/edit`, className: "flex-1 sm:flex-none", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full gap-2 text-xs sm:text-sm h-9 sm:h-10", children: [
            /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
            "Edit Project"
          ] }) }),
          /* @__PURE__ */ jsx(Button, { variant: "destructive", size: "icon", className: "h-9 w-9 sm:h-10 sm:w-10 shrink-0", onClick: () => setIsDeleteAlertOpen(true), title: "Hapus Proyek", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-8 pt-0 space-y-8", children: [
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-emerald-600" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold", children: "Stakeholders" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          { role: "Account Manager", user: project.account_manager, icon: Handshake, color: "emerald" },
          { role: "Head Implementation", user: project.head, icon: ShieldCheck, color: "blue" },
          { role: "PIC Project", user: project.pic, icon: User, color: "purple" }
        ].map((stakeholder, index) => {
          const Icon = stakeholder.icon;
          return /* @__PURE__ */ jsxs(
            Card,
            {
              className: "transition-all duration-300 border-none shadow-sm hover:shadow-md overflow-hidden group",
              children: [
                /* @__PURE__ */ jsx("div", { className: cn(
                  "h-1.5 w-full",
                  stakeholder.color === "emerald" ? "bg-emerald-500" : stakeholder.color === "blue" ? "bg-blue-500" : "bg-purple-500"
                ) }),
                /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3 px-5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
                      stakeholder.role
                    ] }),
                    /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[10px] h-5 border-emerald-100", children: "Assigned" })
                  ] }),
                  /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-bold truncate group-hover:text-emerald-700 transition-colors", children: stakeholder.user?.name || "-" })
                ] }),
                /* @__PURE__ */ jsx(CardContent, { className: "px-5 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg border border-muted/50", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-6 w-6 rounded-full bg-white flex items-center justify-center border shadow-sm shrink-0", children: /* @__PURE__ */ jsx(User, { className: "h-3 w-3 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: stakeholder.user?.email || "No email provided" })
                ] }) })
              ]
            },
            index
          );
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs(Card, { className: "lg:col-span-2 border-none shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-slate-50/50 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Layers, { className: "h-4 w-4 text-emerald-600" }),
              /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-bold text-slate-800", children: "Identitas & Klasifikasi Proyek" })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "pt-6 px-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "project-code", className: "text-sm font-bold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Hash, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                    "Kode Proyek"
                  ] }),
                  canUpdateCode ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2 group", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          id: "project-code",
                          className: "bg-white border-gray-200 font-mono text-sm h-10 transition-all focus:ring-2 focus:ring-emerald-500/20",
                          placeholder: "PRJ-XXXX-XXX",
                          value: projectCode,
                          onChange: (e) => setProjectCode(e.target.value)
                        }
                      ),
                      projectCode === project.code && project.code && /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-500 absolute right-3 top-3" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "default",
                        className: "h-10 w-10 shrink-0 bg-emerald-600 hover:bg-emerald-700 transition-transform active:scale-95 shadow-sm",
                        onClick: handleUpdateCode,
                        disabled: isUpdatingCode || !projectCode || projectCode === project.code,
                        children: isUpdatingCode ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
                      }
                    )
                  ] }) : /* @__PURE__ */ jsx("div", { className: "h-10 px-3 bg-muted/30 rounded-lg flex items-center border border-muted/50 font-mono text-sm text-slate-600", children: project.code || "BELUM DITETAPKAN" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground italic pl-1", children: "*Kode unik internal untuk identifikasi proyek." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxs(Label, { htmlFor: "initial-project", className: "text-sm font-bold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(BarChart3, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                    "Initial Project"
                  ] }),
                  canUpdateCode ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2 group", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          id: "initial-project",
                          className: "bg-white border-gray-200 font-mono text-sm h-10 transition-all focus:ring-2 focus:ring-emerald-500/20",
                          placeholder: "Initial Project ...",
                          value: initialProject,
                          onChange: (e) => setInitialProject(e.target.value)
                        }
                      ),
                      initialProject === project.initial_project && project.initial_project && /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-500 absolute right-3 top-3" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "default",
                        className: "h-10 w-10 shrink-0 bg-emerald-600 hover:bg-emerald-700 transition-transform active:scale-95 shadow-sm",
                        onClick: handleUpdateInitialProject,
                        disabled: isUpdatingInitialProject || !initialProject || initialProject === project.initial_project,
                        children: isUpdatingInitialProject ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
                      }
                    )
                  ] }) : /* @__PURE__ */ jsx("div", { className: "h-10 px-3 bg-muted/30 rounded-lg flex items-center border border-muted/50 font-mono text-sm text-slate-600", children: project.initial_project || "BELUM DITETAPKAN" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxs(Label, { className: "text-sm font-bold flex items-center gap-2 text-slate-700", children: [
                  /* @__PURE__ */ jsx(Layers, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                  "Jenis / Kategori Proyek"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "h-20 p-4 border rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50/30 flex items-center justify-between border-emerald-100 shadow-sm transition-all hover:shadow-md", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest mb-1", children: "Classification Target" }),
                    /* @__PURE__ */ jsx("p", { className: "font-extrabold text-lg text-slate-800 capitalize leading-none", children: project.project_type || "General" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50", children: /* @__PURE__ */ jsx(Layers, { className: "h-5 w-5" }) })
                ] })
              ] }) })
            ] }) })
          ] }),
          project.year_claims && project.year_claims.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-slate-50/50 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4 text-emerald-600" }),
              /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-bold text-slate-800", children: "Tahun Anggaran" })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "pt-4 px-6", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b text-left text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsx("th", { className: "pb-2 font-semibold", children: "Tahun" }),
                /* @__PURE__ */ jsx("th", { className: "pb-2 font-semibold text-right", children: "Jumlah" }),
                /* @__PURE__ */ jsx("th", { className: "pb-2 font-semibold text-right", children: "% Total" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: project.year_claims.map((claim) => /* @__PURE__ */ jsxs("tr", { className: "border-b last:border-0", children: [
                /* @__PURE__ */ jsx("td", { className: "py-2.5 font-medium", children: claim.year }),
                /* @__PURE__ */ jsx("td", { className: "py-2.5 text-right font-mono", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(claim.amount) }),
                /* @__PURE__ */ jsx("td", { className: "py-2.5 text-right text-muted-foreground", children: project.budget_total > 0 ? `${(claim.amount / project.budget_total * 100).toFixed(1)}%` : "-" })
              ] }, claim.id)) }),
              /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsxs("tr", { className: "border-t-2 font-semibold", children: [
                /* @__PURE__ */ jsx("td", { className: "pt-2.5", children: "Total" }),
                /* @__PURE__ */ jsx("td", { className: "pt-2.5 text-right font-mono", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                  project.year_claims.reduce((s, c) => s + (c.amount || 0), 0)
                ) }),
                /* @__PURE__ */ jsx("td", { className: "pt-2.5 text-right", children: project.budget_total > 0 ? "100%" : "-" })
              ] }) })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "border-none shadow-sm bg-slate-900 text-white overflow-hidden relative group", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -right-8 -bottom-8 opacity-10 transition-transform group-hover:scale-110 duration-500", children: /* @__PURE__ */ jsx(BarChart3, { className: "h-48 w-48 text-white" }) }),
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-2 border-b border-white/10", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-white/60 uppercase tracking-widest", children: "Project Summary" }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "pt-6 space-y-4 relative z-10", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1", children: "Contract Value" }),
                /* @__PURE__ */ jsx("p", { className: "text-2xl font-black text-emerald-400 font-mono", children: project.budget_total ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(project.budget_total) : "Rp 0" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1", children: "Timeline" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-bold text-white/90", children: [
                    /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3 text-emerald-400" }),
                    /* @__PURE__ */ jsx("span", { children: project.start_date ? new Date(project.start_date).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : "-" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1", children: "Division" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-white/90 truncate", children: project.division?.name || "-" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(CardFooter, { className: "pt-2 border-t border-white/10 bg-black/20", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] text-white/50 italic", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3 text-emerald-500" }),
              /* @__PURE__ */ jsx("span", { children: "Verified Project Data" })
            ] }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        ProjectTabs,
        {
          project,
          currentStatus,
          locations,
          reportForm,
          setReportForm,
          handleReportFileChange,
          addReportFileRow,
          removeReportFileRow,
          isSubmittingReport,
          onSubmitReport: submitReport,
          onDeleteReport: handleDeleteReport,
          monitoringList,
          closingForm,
          setClosingForm,
          isProjectDealed: true,
          setIsDealAlertOpen,
          setIsCloseAlertOpen,
          refetchProject: () => fetchProject(false),
          onShowToast: (msg, type) => setToast({ show: true, message: msg, type })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: isCloseAlertOpen, onOpenChange: setIsCloseAlertOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Konfirmasi Penutupan" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Status akan berubah menjadi completed." })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setIsCloseAlertOpen(false), children: "Batal" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleCloseProject, children: "Ya, Proses" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isDeleteAlertOpen, onOpenChange: setIsDeleteAlertOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Hapus Proyek" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Apakah anda yakin?" })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setIsDeleteAlertOpen(false), children: "Batal" }),
        /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: handleDeleteProject, children: "Hapus" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isApproveAlertOpen, onOpenChange: setIsApproveAlertOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Setujui Proyek" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Apakah anda yakin menyetujui proyek ini? Status akan tercatat sebagai Disetujui." })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setIsApproveAlertOpen(false), children: "Batal" }),
        /* @__PURE__ */ jsx(Button, { className: "bg-[#00763c] hover:bg-[#005f30] text-white", onClick: handleApproveAction, children: "Ya, Setujui" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isRevisionAlertOpen, onOpenChange: setIsRevisionAlertOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Minta Revisi" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Apakah anda yakin meminta revisi? Catatan anda akan dikirim ke tim terkait." })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setIsRevisionAlertOpen(false), children: "Batal" }),
        /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: handleRevisionAction, children: "Kirim Revisi" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isDealAlertOpen, onOpenChange: setIsDealAlertOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Konfirmasi Deal Project" }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Apakah anda yakin ingin menyepakati project ini? ",
          /* @__PURE__ */ jsx("br", {}),
          "Setelah ini, status project akan berubah menjadi ",
          /* @__PURE__ */ jsx("strong", { children: "Active" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setIsDealAlertOpen(false), children: "Batal" }),
        /* @__PURE__ */ jsxs(Button, { className: "bg-[#00763c] hover:bg-[#005f30] text-white", onClick: handleDealProject, children: [
          /* @__PURE__ */ jsx(Handshake, { className: "h-4 w-4 mr-2" }),
          "Ya, Deal Project"
        ] })
      ] })
    ] }) }),
    toast.show && /* @__PURE__ */ jsx("div", { className: "fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border shadow-lg p-3 rounded-lg flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm", children: toast.message })
    ] }) })
  ] });
}
export {
  ProjectsShow as default
};
