import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-BRoV_jj3.js";
import axios from "axios";
import { S as Skeleton } from "./skeleton-wZJ-u2Ee.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, f as CardFooter } from "./card-DAjHeOuX.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { ChevronLeft, CheckCircle2, Hourglass, Circle, Loader, Edit } from "lucide-react";
import { S as StatusBadge } from "./StatusBadge-CfpbUrIp.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { M as MoneyInput } from "./MoneyInput-Y8EKpX5J.js";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
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
import "react-number-format";
function Allowance({ project_slug }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/projects/${project_slug}`);
        setProject(response.data.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [project_slug]);
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Proyek", href: "/projects" },
    { title: project?.name || "...", href: `/projects/${project_slug}` },
    { title: "Allowance", href: "#" }
  ];
  const [approvalNote, setApprovalNote] = useState("");
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [allowanceValue, setAllowanceValue] = useState(1e6);
  const [isLocked, setIsLocked] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const currentUserRole = "Finance";
  const workflows = [
    { role: "Finance", name: "Finance Dept", status: "approved", date: "2025-01-01" },
    { role: "HR", name: "HR Department", status: "waiting", date: "-" }
  ];
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
  };
  if (loading) {
    return /* @__PURE__ */ jsx(AppSidebarLayout, { breadcrumbs, children: /* @__PURE__ */ jsxs("div", { className: "p-8 space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-full" })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: `Allowance - ${project.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-4 md:p-8 pb-0", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(Link, { href: `/projects/${project.slug}`, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 -ml-2 mr-1", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Allowance Proyek" }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "ml-2", children: project.code })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground ml-9", children: [
          "Tambahkan allowance untuk Proyek ",
          project.name,
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(StatusBadge, { status: project.status }) })
    ] }),
    /* @__PURE__ */ jsx("hr", { className: "border-gray-200" }),
    /* @__PURE__ */ jsx("div", { className: "p-4 md:p-8 space-y-8", children: /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Status Persetujuan Allowance" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: workflows.map((flow, index) => {
        const isMyRole = currentUserRole === flow.role;
        return /* @__PURE__ */ jsxs(
          Card,
          {
            className: `transition-all duration-200 ${isMyRole ? "bg-[var(--sidebar)] text-white border-[var(--sidebar)] shadow-md" : flow.status === "pending" ? "border-yellow-500/50 bg-yellow-50/30" : ""}`,
            children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${isMyRole ? "text-white/80" : "text-muted-foreground"}`, children: flow.role }),
                  flow.status === "approved" && /* @__PURE__ */ jsx(CheckCircle2, { className: `h-5 w-5 ${isMyRole ? "text-white" : "text-green-600"}` }),
                  flow.status === "pending" && /* @__PURE__ */ jsx(Hourglass, { className: `h-5 w-5 ${isMyRole ? "text-white" : "text-yellow-600"}` }),
                  flow.status === "waiting" && /* @__PURE__ */ jsx(Circle, { className: `h-5 w-5 ${isMyRole ? "text-white/50" : "text-gray-300"}` })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `text-lg font-bold mt-1 ${isMyRole ? "text-white" : "text-[var(--sidebar)]"}`, children: flow.name })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm mb-3", children: [
                /* @__PURE__ */ jsxs("span", { className: `capitalize px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border
                                      ${isMyRole ? "bg-white/20 text-white border-white/20" : flow.status === "approved" ? "bg-green-100 text-green-700 border-green-200" : flow.status === "pending" ? "bg-yellow-50 text-yellow-600 border-yellow-200" : "bg-gray-100 text-gray-500 border-gray-200"}`, children: [
                  flow.status === "approved" && /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }),
                  flow.status === "pending" && /* @__PURE__ */ jsx(Hourglass, { className: "h-3.5 w-3.5" }),
                  flow.status === "waiting" && /* @__PURE__ */ jsx(Loader, { className: "h-3.5 w-3.5 animate-spin" }),
                  flow.status === "pending" ? "Pending" : flow.status
                ] }),
                /* @__PURE__ */ jsx("span", { className: `text-xs ${isMyRole ? "text-white/80" : "text-muted-foreground"}`, children: flow.date })
              ] }) }),
              flow.status === "approved" && /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsxs(Dialog, { open: activeCardIndex === index, onOpenChange: (open) => setActiveCardIndex(open ? index : null), children: [
                /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                  Button,
                  {
                    className: `w-full ${isMyRole ? "bg-white text-[var(--sidebar)] hover:bg-gray-100" : "bg-blue-600 hover:bg-blue-700"}`,
                    size: "sm",
                    children: [
                      /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 mr-2" }),
                      "Proses Approval"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxs(DialogContent, { children: [
                  /* @__PURE__ */ jsxs(DialogHeader, { children: [
                    /* @__PURE__ */ jsx(DialogTitle, { children: "Proses Persetujuan" }),
                    /* @__PURE__ */ jsxs(DialogDescription, { children: [
                      "Apakah Anda Yakin ingin menyetujui . ",
                      /* @__PURE__ */ jsx("br", {})
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2 sm:gap-2", children: [
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "outline",
                        onClick: () => setActiveCardIndex(null),
                        className: "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 hover:scale-105",
                        children: "Batal"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        className: "bg-[var(--sidebar)] hover:scale-105 hover:bg-[var(--sidebar)] text-white",
                        onClick: () => {
                          setActiveCardIndex(null);
                          document.getElementById("nominal")?.scrollIntoView({ behavior: "smooth" });
                          setTimeout(() => document.getElementById("nominal")?.focus(), 500);
                        },
                        children: "Ya, Saya Setuju"
                      }
                    )
                  ] })
                ] })
              ] }) })
            ]
          },
          index
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 p-6 border rounded-xl bg-white shadow-sm space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "nominal", className: "text-sm font-semibold", children: [
              "Nominal Allowance ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              MoneyInput,
              {
                id: "nominal",
                value: allowanceValue,
                onValueChange: (values) => setAllowanceValue(values.floatValue || 0),
                prefix: "Rp ",
                placeholder: "Rp 0",
                disabled: isLocked
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Masukan jumlah allowance yang disetujui." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "file-upload", className: "text-sm font-semibold", children: [
              "Dokumen Pendukung ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "file-upload",
                type: "file",
                className: "cursor-pointer bg-gray-50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                disabled: isLocked
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Upload bukti transfer atau dokumen persetujuan (PDF/JPG)." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end items-center pt-2", children: /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: isLocked ? /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => setIsLocked(false),
            className: "border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-600 transition-transform hover:scale-105 active:scale-95",
            children: [
              /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4 mr-2" }),
              "Perbaiki"
            ]
          }
        ) : /* @__PURE__ */ jsxs(Dialog, { open: isApproveDialogOpen, onOpenChange: setIsApproveDialogOpen, children: [
          /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "bg-[var(--sidebar)] hover:bg-[var(--sidebar)] text-white shadow-sm transition-transform hover:scale-105 active:scale-95", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 mr-2" }),
            "Simpan Perubahan"
          ] }) }),
          /* @__PURE__ */ jsxs(DialogContent, { children: [
            /* @__PURE__ */ jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsx(DialogTitle, { children: "Konfirmasi Persetujuan" }),
              /* @__PURE__ */ jsx(DialogDescription, { children: allowanceValue !== 1e6 ? /* @__PURE__ */ jsxs("span", { children: [
                "Nominal allowance telah diubah dari ",
                /* @__PURE__ */ jsx("b", { children: "Rp 1.000.000" }),
                " menjadi ",
                /* @__PURE__ */ jsx("b", { children: formatCurrency(allowanceValue) }),
                ". ",
                /* @__PURE__ */ jsx("br", {}),
                "Apakah Anda yakin perubahan ini sudah benar?"
              ] }) : /* @__PURE__ */ jsxs("span", { children: [
                "Apakah Anda yakin ingin menyetujui allowance ini? ",
                /* @__PURE__ */ jsx("br", {}),
                "Pastikan nominal dan dokumen pendukung sudah sesuai."
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setIsApproveDialogOpen(false), children: "Batal" }),
              /* @__PURE__ */ jsx(Button, { className: "bg-green-600 hover:bg-green-700 text-white", onClick: () => {
                console.log("Approved with value:", allowanceValue);
                setIsLocked(true);
                setIsApproveDialogOpen(false);
              }, children: "Ya, Simpan" })
            ] })
          ] })
        ] }) }) })
      ] })
    ] }) })
  ] });
}
export {
  Allowance as default
};
