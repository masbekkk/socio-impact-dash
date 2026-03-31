import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { router, Head, Link } from "@inertiajs/react";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as CardDescription, e as CardAction, f as CardFooter } from "./card-DAjHeOuX.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import * as RechartsPrimitive from "recharts";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, LabelList } from "recharts";
import { c as cn, B as Button } from "./button-hAi0Fg-Q.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
/* empty css                 */
import L from "leaflet";
import { Clock, AlertCircle, CheckCircle2, XCircle, CheckCircle, FileText, MapPin, Users, Building2, Banknote, TrendingUp } from "lucide-react";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { C as Checkbox } from "./checkbox-D07xazED.js";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "axios";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-checkbox";
const THEMES = { light: "", dark: ".dark" };
const ChartContext = React.createContext(null);
function ChartContainer({
  id: id2,
  className,
  children,
  config,
  ...props
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id2 || uniqueId.replace(/:/g, "")}`;
  return /* @__PURE__ */ jsx(ChartContext.Provider, { value: { config }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "chart",
      "data-chart": chartId,
      className: cn(
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(ChartStyle, { id: chartId, config }),
        /* @__PURE__ */ jsx(RechartsPrimitive.ResponsiveContainer, { children })
      ]
    }
  ) });
}
const ChartStyle = ({ id: id2, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config2]) => config2.theme || config2.color
  );
  if (!colorConfig.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: Object.entries(THEMES).map(
          ([theme, prefix]) => `
${prefix} [data-chart=${id2}] {
${colorConfig.map(([key, itemConfig]) => {
            const color = itemConfig.theme?.[theme] || itemConfig.color;
            return color ? `  --color-${key}: ${color};` : null;
          }).join("\n")}
}
`
        ).join("\n")
      }
    }
  );
};
const ChartTooltip = RechartsPrimitive.Tooltip;
function ApprovalStatisticCard({ title, count, onClick, icon, color = "emerald" }) {
  const colorClasses = {
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100",
    blue: "bg-blue-50 border-blue-100 text-blue-800 hover:bg-blue-100",
    amber: "bg-amber-50 border-amber-100 text-amber-800 hover:bg-amber-100",
    rose: "bg-rose-50 border-rose-100 text-rose-800 hover:bg-rose-100"
  };
  const iconColorClasses = {
    emerald: "bg-emerald-200 text-emerald-700",
    blue: "bg-blue-200 text-blue-700",
    amber: "bg-amber-200 text-amber-700",
    rose: "bg-rose-200 text-rose-700"
  };
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        "cursor-pointer transition-all hover:shadow-md border",
        colorClasses[color]
      ),
      onClick,
      children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: title }),
          /* @__PURE__ */ jsx("div", { className: cn("p-2 rounded-full", iconColorClasses[color]), children: icon || /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline space-x-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold", children: count }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium opacity-70", children: "Pengajuan" })
          ] }),
          count > 0 ? /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center text-xs font-medium", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3 mr-1" }),
            "Butuh persetujuan"
          ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center text-xs font-medium opacity-50", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3 mr-1" }),
            "Semua selesai"
          ] })
        ] })
      ]
    }
  );
}
const STATUS_CONFIG = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700 border-gray-200", icon: FileText },
  submitted: { label: "Diajukan", className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  revised: { label: "Sudah Direvisi", className: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle },
  approved: { label: "Disetujui", className: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  head_approved: { label: "Head Approved", className: "bg-blue-50 text-blue-600 border-blue-100", icon: CheckCircle },
  hr_approved: { label: "HR Approved", className: "bg-blue-50 text-blue-600 border-blue-100", icon: CheckCircle },
  finance_approved: { label: "Finance Approved", className: "bg-blue-50 text-blue-600 border-blue-100", icon: CheckCircle },
  request_fund: { label: "Request Fund", className: "bg-orange-50 text-orange-600 border-orange-100", icon: Clock },
  transferred: { label: "Sudah Ditransfer", className: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle },
  revision: { label: "Revisi", className: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertCircle },
  rejected: { label: "Ditolak", className: "bg-red-100 text-red-700 border-red-200", icon: XCircle }
};
const LEAVE_TYPE_LABELS = {
  annual: "Cuti Tahunan",
  sick: "Cuti Sakit",
  unpaid: "Cuti Tanpa Gaji",
  travel: "Perjalanan Dinas",
  berduka: "Cuti Berduka",
  wedding: "Cuti Menikah",
  birth: "Cuti Melahirkan",
  important: "Cuti Alasan Penting"
};
function BulkApprovalModal({ isOpen, onOpenChange, title, items, type }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id));
    }
  };
  const toggleSelectItem = (id2) => {
    if (selectedIds.includes(id2)) {
      setSelectedIds(selectedIds.filter((i) => i !== id2));
    } else {
      setSelectedIds([...selectedIds, id2]);
    }
  };
  const handleApproveSelected = () => {
    if (selectedIds.length === 0) return;
    const routeName = type === "reimbursement" ? "reimbursements.bulk-approve" : "leaves.bulk-approve";
    router.post(route(routeName), { ids: selectedIds }, {
      onSuccess: () => {
        onOpenChange(false);
        setSelectedIds([]);
      }
    });
  };
  const handleApproveAll = () => {
    const allIds = items.map((item) => item.id);
    const routeName = type === "reimbursement" ? "reimbursements.bulk-approve" : "leaves.bulk-approve";
    router.post(route(routeName), { ids: allIds }, {
      onSuccess: () => {
        onOpenChange(false);
        setSelectedIds([]);
      }
    });
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: id });
    } catch (e) {
      return "-";
    }
  };
  const isATR = items.length > 0 && items[0].type === "atr";
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[95vw] w-full max-h-[90vh] flex flex-col p-6", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { className: "text-xl font-bold", children: title }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-sm", children: "Pilih pengajuan yang akan disetujui secara massal." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto my-4 border rounded-md", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "bg-muted/50", children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-12", children: /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: selectedIds.length === items.length && items.length > 0,
            onCheckedChange: toggleSelectAll
          }
        ) }),
        type === "reimbursement" ? isATR ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Kode ATR" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Kode Project" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Inisial Project" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Nominal" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Status Approval" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Status" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Kode" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Tanggal" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Pemohon" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Divisi" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Proyek" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-right", children: "Total Biaya" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Status Approval" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Status" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Kode & Tanggal" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Karyawan" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Jenis Cuti" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Durasi" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Status Approval" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Status" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: items.length > 0 ? items.map((item) => {
        const statusCfg = STATUS_CONFIG[item.status] ?? { label: item.status, className: "bg-gray-100 text-gray-600", icon: Clock };
        const StatusIcon = statusCfg.icon;
        return /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: selectedIds.includes(item.id),
              onCheckedChange: () => toggleSelectItem(item.id)
            }
          ) }),
          type === "reimbursement" ? isATR ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium font-mono text-xs", children: item.code }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-xs font-mono", children: item.project?.code ?? "-" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-xs", children: item.project?.initial_project ?? "-" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-xs font-semibold", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(item.amount || 0)) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 min-w-[120px]", children: item.approvals && [...item.approvals].sort((a, b) => {
              const p = { head: 1, hr: 2, finance: 3, direktur: 4 };
              return (p[a.role] || 99) - (p[b.role] || 99);
            }).map((approval) => /* @__PURE__ */ jsxs("div", { className: "text-[10px] flex items-center gap-1", children: [
              approval.status === "approved" ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 text-green-500" }) : approval.status === "revised" ? /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3 text-blue-500" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3 text-red-400" }),
              /* @__PURE__ */ jsx("span", { className: cn(
                "font-medium",
                approval.status === "approved" ? "text-green-700" : approval.status === "revised" ? "text-blue-700" : "text-red-700"
              ), children: approval.approver?.name || approval.role })
            ] }, approval.id)) }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { className: cn("gap-1 text-[10px] px-2 py-0", statusCfg.className), children: [
              /* @__PURE__ */ jsx(StatusIcon, { className: "h-3 w-3" }),
              statusCfg.label
            ] }) })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium font-mono text-xs", children: item.code }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-xs", children: formatDate(item.created_at) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-xs", children: item.user?.name ?? "-" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-xs truncate max-w-[100px]", children: item.project?.division_name ?? "-" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-xs truncate max-w-[150px]", children: item.project?.name ?? "-" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right text-xs font-semibold", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(item.amount || 0)) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 min-w-[120px]", children: item.approvals && [...item.approvals].sort((a, b) => {
              const p = { head: 1, hr: 2, finance: 3, direktur: 4 };
              return (p[a.role] || 99) - (p[b.role] || 99);
            }).map((approval) => /* @__PURE__ */ jsxs("div", { className: "text-[10px] flex items-center gap-1", children: [
              approval.status === "approved" ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 text-green-500" }) : approval.status === "revised" ? /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3 text-blue-500" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3 text-red-400" }),
              /* @__PURE__ */ jsx("span", { className: cn(
                "font-medium",
                approval.status === "approved" ? "text-green-700" : approval.status === "revised" ? "text-blue-700" : "text-red-700"
              ), children: approval.approver?.name || approval.role })
            ] }, approval.id)) }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { className: cn("gap-1 text-[10px] px-2 py-0", statusCfg.className), children: [
              /* @__PURE__ */ jsx(StatusIcon, { className: "h-3 w-3" }),
              statusCfg.label
            ] }) })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-xs font-mono", children: item.code }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: formatDate(item.created_at) })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: item.user?.name ?? "-" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground truncate max-w-[120px]", children: item.user?.email ?? "-" })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-normal text-[10px] bg-blue-50 text-blue-700 border-blue-100", children: LEAVE_TYPE_LABELS[item.type] ?? item.type }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-xs", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-700", children: (() => {
                const s = new Date(item.start_date || "");
                const e = new Date(item.end_date || "");
                const diff = Math.ceil((e.getTime() - s.getTime()) / (1e3 * 60 * 60 * 24)) + 1;
                return `${diff} Hari`;
              })() }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground whitespace-nowrap", children: [
                format(new Date(item.start_date || ""), "dd MMM", { locale: id }),
                " - ",
                format(new Date(item.end_date || ""), "dd MMM", { locale: id })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 min-w-[120px]", children: item.approvals?.map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px]", children: [
              a.status === "approved" ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 text-emerald-500" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3 text-rose-400" }),
              /* @__PURE__ */ jsx("span", { className: cn(
                "font-medium",
                a.status === "approved" ? "text-emerald-700" : "text-rose-700"
              ), children: a.approver?.name || a.role })
            ] }, a.id)) }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { className: cn("gap-1 text-[10px] px-2 py-0", statusCfg.className), children: [
              /* @__PURE__ */ jsx(StatusIcon, { className: "h-3 w-3" }),
              statusCfg.label
            ] }) })
          ] })
        ] }, item.id);
      }) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 10, className: "text-center py-12 text-muted-foreground", children: "Tidak ada data pengajuan." }) }) })
    ] }) }),
    /* @__PURE__ */ jsxs(DialogFooter, { className: "flex flex-row justify-between sm:justify-between items-center gap-4 pt-4 border-t", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-500", children: [
        selectedIds.length,
        " item dipilih dari ",
        items.length
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => onOpenChange(false), children: "Batal" }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", className: "border-[#1a5f4a] text-[#1a5f4a] hover:bg-emerald-50", onClick: handleApproveAll, disabled: items.length === 0, children: "Setujui Semua" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "bg-[#1a5f4a] hover:bg-[#144a39] min-w-[140px]",
            disabled: selectedIds.length === 0,
            onClick: handleApproveSelected,
            children: [
              "Setujui Terpilih (",
              selectedIds.length,
              ")"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});
const RealTimeClockSimple = () => {
  const [date, setDate] = useState(/* @__PURE__ */ new Date());
  useEffect(() => {
    const timer = setInterval(() => setDate(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  return /* @__PURE__ */ jsx("span", { suppressHydrationWarning: true, className: "tabular-nums tracking-tight", children: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/\./g, ":") });
};
function Dashboard({
  totalUsers,
  totalDivisions,
  totalLetterRequests,
  totalBudget,
  totalManagementBudget,
  leaderboard,
  locations,
  projectsByDivision,
  approvalItems
}) {
  const { hasRole } = usePermission();
  const isPegawai = hasRole("pegawai") && !hasRole("superadmin");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    items: [],
    type: "reimbursement"
  });
  const openApprovalModal = (title, items, type) => {
    setModalData({ title, items, type });
    setModalOpen(true);
  };
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" }
  ];
  const totalProjectsCount = useMemo(() => {
    return projectsByDivision?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  }, [projectsByDivision]);
  const projectsByDivisionWithPercentage = useMemo(() => {
    const colors = ["#1b4841", "#00733c", "#00a549", "#8cbe3b", "#cee5ad"];
    return projectsByDivision?.map((item, index) => ({
      ...item,
      percentage: totalProjectsCount > 0 ? Math.round(item.count / totalProjectsCount * 100) : 0,
      fill: colors[index % colors.length]
    })) ?? [];
  }, [projectsByDivision, totalProjectsCount]);
  const chartData = useMemo(() => {
    return leaderboard?.map((entry) => ({
      name: entry.creator.name,
      total: parseFloat(entry.total_budget || "0")
    })) ?? [];
  }, [leaderboard]);
  const formatIDR = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4", children: [
        /* @__PURE__ */ jsxs(Card, { className: "bg-[var(--sidebar)] border-none shadow-md text-white", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardDescription, { className: "text-emerald-100/90", children: "Presensi" }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl text-white font-semibold flex flex-col gap-1", children: /* @__PURE__ */ jsx("span", { suppressHydrationWarning: true, className: "text-lg font-normal opacity-90", children: (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) }) }),
            /* @__PURE__ */ jsx(CardAction, { children: /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-white border-white/20 bg-white/5", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 mr-1" }),
              /* @__PURE__ */ jsx(RealTimeClockSimple, {}),
              "WIB"
            ] }) })
          ] }),
          /* @__PURE__ */ jsx(CardFooter, { className: "flex-col items-start gap-3 text-sm mt-auto pb-4", children: /* @__PURE__ */ jsx(Link, { href: "/presences/create", className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "bg-white text-[#1a5f4a] hover:bg-emerald-50 w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-95 hover:scale-105", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }),
            " Presensi"
          ] }) }) })
        ] }),
        !isPegawai && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-md border-0 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-gray-500", children: "Total Users" }),
              /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-gray-400" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-gray-800", children: totalUsers }) }),
            /* @__PURE__ */ jsx(CardFooter, { className: "pt-0", children: /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Aktif di sistem" }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-md border-0 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-gray-500", children: "Total Divisions" }),
              /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5 text-gray-400" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-gray-800", children: totalDivisions }) }),
            /* @__PURE__ */ jsx(CardFooter, { className: "pt-0", children: /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Struktur organisasi" }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "bg-white shadow-md border-0 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-gray-500", children: "Letter Requests" }),
              /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-gray-400" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-gray-800", children: totalLetterRequests }) }),
            /* @__PURE__ */ jsx(CardFooter, { className: "pt-0", children: /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Dibuat via sistem" }) })
          ] })
        ] })
      ] }),
      (!isPegawai || hasRole(["head", "finance", "direktur", "hr"])) && /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t border-gray-100", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-gray-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5 text-[#1a5f4a]" }),
          "Persetujuan Terpending"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          hasRole("head") && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "ATR Menunggu Approval (Head)",
                count: approvalItems.head_reimbursements.filter((i) => i.type === "atr").length,
                color: "emerald",
                onClick: () => openApprovalModal("ATR Menunggu Approval (Head)", approvalItems.head_reimbursements.filter((i) => i.type === "atr"), "reimbursement"),
                icon: /* @__PURE__ */ jsx(Banknote, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "EER Menunggu Approval (Head)",
                count: approvalItems.head_reimbursements.filter((i) => i.type === "eer").length,
                color: "emerald",
                onClick: () => openApprovalModal("EER Menunggu Approval (Head)", approvalItems.head_reimbursements.filter((i) => i.type === "eer"), "reimbursement"),
                icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Allowance Menunggu Approval (Head)",
                count: approvalItems.head_reimbursements.filter((i) => i.type === "allowance").length,
                color: "emerald",
                onClick: () => openApprovalModal("Allowance Menunggu Approval (Head)", approvalItems.head_reimbursements.filter((i) => i.type === "allowance"), "reimbursement"),
                icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Cuti Menunggu Approval (Head)",
                count: approvalItems.head_leaves.length,
                color: "emerald",
                onClick: () => openApprovalModal("Cuti Menunggu Approval (Head)", approvalItems.head_leaves, "leave"),
                icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" })
              }
            )
          ] }),
          hasRole("finance") && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "ATR Menunggu Approval (Finance)",
                count: approvalItems.finance_reimbursements.filter((i) => i.type === "atr").length,
                color: "blue",
                onClick: () => openApprovalModal("ATR Menunggu Approval (Finance)", approvalItems.finance_reimbursements.filter((i) => i.type === "atr"), "reimbursement"),
                icon: /* @__PURE__ */ jsx(Banknote, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "EER Menunggu Approval (Finance)",
                count: approvalItems.finance_reimbursements.filter((i) => i.type === "eer").length,
                color: "blue",
                onClick: () => openApprovalModal("EER Menunggu Approval (Finance)", approvalItems.finance_reimbursements.filter((i) => i.type === "eer"), "reimbursement"),
                icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Allowance Menunggu Approval (Finance)",
                count: approvalItems.finance_reimbursements.filter((i) => i.type === "allowance").length,
                color: "blue",
                onClick: () => openApprovalModal("Allowance Menunggu Approval (Finance)", approvalItems.finance_reimbursements.filter((i) => i.type === "allowance"), "reimbursement"),
                icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
              }
            )
          ] }),
          hasRole("direktur") && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "ATR Menunggu Approval (Direktur)",
                count: approvalItems.direktur_reimbursements.filter((i) => i.type === "atr").length,
                color: "amber",
                onClick: () => openApprovalModal("ATR Menunggu Approval (Direktur)", approvalItems.direktur_reimbursements.filter((i) => i.type === "atr"), "reimbursement"),
                icon: /* @__PURE__ */ jsx(Banknote, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "EER Menunggu Approval (Direktur)",
                count: approvalItems.direktur_reimbursements.filter((i) => i.type === "eer").length,
                color: "amber",
                onClick: () => openApprovalModal("EER Menunggu Approval (Direktur)", approvalItems.direktur_reimbursements.filter((i) => i.type === "eer"), "reimbursement"),
                icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Allowance Menunggu Approval (Direktur)",
                count: approvalItems.direktur_reimbursements.filter((i) => i.type === "allowance").length,
                color: "amber",
                onClick: () => openApprovalModal("Allowance Menunggu Approval (Direktur)", approvalItems.direktur_reimbursements.filter((i) => i.type === "allowance"), "reimbursement"),
                icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Cuti Menunggu Approval (Direktur)",
                count: approvalItems.direktur_leaves.length,
                color: "amber",
                onClick: () => openApprovalModal("Cuti Menunggu Approval (Direktur)", approvalItems.direktur_leaves, "leave"),
                icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" })
              }
            )
          ] }),
          hasRole("hr") && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Cuti Menunggu Approval (HR)",
                count: approvalItems.hr_leaves.length,
                color: "rose",
                onClick: () => openApprovalModal("Cuti Menunggu Approval (HR)", approvalItems.hr_leaves, "leave"),
                icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Allowance Menunggu Approval (HR)",
                count: approvalItems.hr_allowances.length,
                color: "rose",
                onClick: () => openApprovalModal("Allowance Menunggu Approval (HR)", approvalItems.hr_allowances, "reimbursement"),
                icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
              }
            )
          ] })
        ] })
      ] }),
      !isPegawai && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs(Card, { className: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm border-0", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
              /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-emerald-800", children: "Total Keseluruhan Budget Projek" }) }),
              /* @__PURE__ */ jsx("div", { className: "bg-emerald-200 p-2 rounded-full", children: /* @__PURE__ */ jsx(Banknote, { className: "h-5 w-5 text-emerald-700" }) })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl font-bold text-emerald-900", children: formatIDR(totalBudget || 0) }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm border-0", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
              /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-blue-800", children: "Total Management Budget" }) }),
              /* @__PURE__ */ jsx("div", { className: "bg-blue-200 p-2 rounded-full", children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5 text-blue-700" }) })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl font-bold text-blue-900", children: formatIDR(totalManagementBudget || 0) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-8", children: /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm p-0 h-[400px] flex flex-col rounded-3xl overflow-hidden bg-white", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "p-6 pb-2 shrink-0 border-b border-gray-50", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-bold text-gray-800", children: "Top Budget Contributors" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Pengguna dengan akuisisi budget tertinggi" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-4 flex-1 h-full min-h-0 bg-white", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: chartData, margin: { top: 10, right: 40, left: 10, bottom: 20 }, layout: "vertical", children: [
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", horizontal: false, stroke: "#f0f0f0" }),
              /* @__PURE__ */ jsx(XAxis, { type: "number", tickFormatter: (value) => `Rp ${value / 1e6}jt`, tickLine: false, axisLine: false, tick: { fontSize: 11 } }),
              /* @__PURE__ */ jsx(YAxis, { type: "category", dataKey: "name", tickLine: false, axisLine: false, width: 100, tick: { fontSize: 12, fontWeight: 500 } }),
              /* @__PURE__ */ jsx(Tooltip, { formatter: (value) => formatIDR(Number(value || 0)), cursor: { fill: "rgba(0,0,0,0.03)" } }),
              /* @__PURE__ */ jsx(Bar, { dataKey: "total", fill: "#1a5f4a", radius: [0, 4, 4, 0], barSize: 24 })
            ] }) }) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "relative rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-[450px] z-0", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0", children: /* @__PURE__ */ jsxs(MapContainer, { center: [-2.5, 118], zoom: 5, style: { height: "100%", width: "100%", background: "#e5e7eb" }, zoomControl: true, scrollWheelZoom: true, children: [
              /* @__PURE__ */ jsx(TileLayer, { url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png", attribution: "© OpenStreetMap" }),
              locations?.map((loc) => /* @__PURE__ */ jsx(Marker, { position: [loc.latitude, loc.longitude], children: /* @__PURE__ */ jsx(Popup, { className: "custom-popup", closeButton: false, children: /* @__PURE__ */ jsxs("div", { className: "px-2 py-1 text-center", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-800 block text-sm", children: loc.project?.name || "Project" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground mt-0.5", children: loc.detail_address })
              ] }) }) }, loc.id))
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 p-6 z-[400] flex justify-center items-start pointer-events-none", children: /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-gray-800 tracking-tight flex items-center gap-2 drop-shadow-sm bg-white/80 backdrop-blur-[2px] px-3 py-1 rounded-full border border-gray-200", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[var(--sidebar)] animate-pulse" }),
              "Persebaran Wilayah Proyek Aktif"
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-8", children: /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm p-0 h-[400px] flex flex-col rounded-3xl bg-white", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "p-6 pb-2 shrink-0 border-b border-gray-50", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-bold text-gray-800", children: "Projects by Division" }) }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-4 flex-1 min-h-0", children: /* @__PURE__ */ jsx(ChartContainer, { config: { percentage: { label: "Percentage" } }, className: "h-full w-full aspect-auto", children: /* @__PURE__ */ jsxs(BarChart, { data: projectsByDivisionWithPercentage, margin: { top: 20, right: 30, left: 10, bottom: 10 }, children: [
              /* @__PURE__ */ jsx(CartesianGrid, { vertical: false, strokeDasharray: "3 3", stroke: "#f0f0f0" }),
              /* @__PURE__ */ jsx(YAxis, { domain: [0, 100], hide: true }),
              /* @__PURE__ */ jsx(XAxis, { dataKey: "division", tickLine: false, tickMargin: 10, axisLine: false, tick: { fontSize: 12 } }),
              /* @__PURE__ */ jsx(
                ChartTooltip,
                {
                  content: ({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-white p-2 shadow-sm text-xs", children: [
                        /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-900 mb-1", children: data.division }),
                        /* @__PURE__ */ jsxs("div", { className: "text-gray-600", children: [
                          "Total: ",
                          /* @__PURE__ */ jsxs("strong", { children: [
                            data.count,
                            " Projects"
                          ] })
                        ] })
                      ] });
                    }
                    return null;
                  }
                }
              ),
              /* @__PURE__ */ jsx(Bar, { dataKey: "percentage", radius: 8, barSize: 60, children: /* @__PURE__ */ jsx(LabelList, { position: "top", offset: 12, className: "fill-gray-700 font-bold", fontSize: 12, formatter: (v) => `${v}%` }) })
            ] }) }) })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      BulkApprovalModal,
      {
        isOpen: modalOpen,
        onOpenChange: setModalOpen,
        title: modalData.title,
        items: modalData.items,
        type: modalData.type
      }
    )
  ] });
}
export {
  Dashboard as default
};
