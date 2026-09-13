import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-BRoV_jj3.js";
import { Link, router, usePage, Head } from "@inertiajs/react";
import axios from "axios";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as CardDescription, e as CardAction, f as CardFooter } from "./card-DAjHeOuX.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DJ6z7AkN.js";
import * as RechartsPrimitive from "recharts";
import { BarChart, CartesianGrid, YAxis, XAxis, Bar, LabelList } from "recharts";
import { c as cn, B as Button } from "./button-hAi0Fg-Q.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
/* empty css                 */
import L from "leaflet";
import { Clock, AlertCircle, CheckCircle2, XCircle, CheckCircle, FileText, Eye, MapPin, Users, Building2, Banknote, Wallet, Receipt, TrendingUp, TrendingDown } from "lucide-react";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { C as Checkbox } from "./checkbox-D07xazED.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { L as Label } from "./label-7wn1ZQI4.js";
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
import "@radix-ui/react-select";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-label";
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
    rose: "bg-rose-50 border-rose-100 text-rose-800 hover:bg-rose-100",
    orange: "bg-orange-50 border-orange-100 text-orange-800 hover:bg-orange-100"
  };
  const iconColorClasses = {
    emerald: "bg-emerald-200 text-emerald-700",
    blue: "bg-blue-200 text-blue-700",
    amber: "bg-amber-200 text-amber-700",
    rose: "bg-rose-200 text-rose-700",
    orange: "bg-orange-200 text-orange-700"
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
function BulkApprovalModal({ isOpen, onOpenChange, title, items, type, role, actionType = "approve" }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionMode, setActionMode] = useState(null);
  const [notes, setNotes] = useState({});
  const [globalNote, setGlobalNote] = useState("");
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
    const routeName = actionType === "request_fund" ? "reimbursements.bulk-request-fund" : type === "reimbursement" ? "reimbursements.bulk-approve" : "leaves.bulk-approve";
    router.post(route(routeName), { ids: selectedIds, role }, {
      onSuccess: () => {
        onOpenChange(false);
        setSelectedIds([]);
        setActionMode(null);
        setNotes({});
      }
    });
  };
  const handleConfirmAction = () => {
    if (selectedIds.length === 0 || !actionMode) return;
    const routeMap = {
      approve: actionType === "request_fund" ? "reimbursements.bulk-request-fund" : type === "reimbursement" ? "reimbursements.bulk-approve" : "leaves.bulk-approve",
      reject: type === "reimbursement" ? "reimbursements.bulk-reject" : "leaves.bulk-reject",
      revision: type === "reimbursement" ? "reimbursements.bulk-revision" : "leaves.bulk-revision"
    };
    const routeName = routeMap[actionMode];
    router.post(route(routeName), {
      ids: selectedIds,
      notes,
      role
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setSelectedIds([]);
        setActionMode(null);
        setNotes({});
      }
    });
  };
  const handleActionSelected = (action) => {
    if (selectedIds.length === 0) return;
    setActionMode(action);
    const newNotes = { ...notes };
    selectedIds.forEach((id2) => {
      if (!newNotes[id2]) newNotes[id2] = "";
    });
    setNotes(newNotes);
  };
  const handleActionAll = (action) => {
    const allIds = items.map((item) => item.id);
    setSelectedIds(allIds);
    setActionMode(action);
    const newNotes = {};
    allIds.forEach((id2) => {
      newNotes[id2] = "";
    });
    setNotes(newNotes);
  };
  const updateNote = (id2, note) => {
    setNotes((prev) => ({ ...prev, [id2]: note }));
  };
  const applyGlobalNote = () => {
    const newNotes = { ...notes };
    selectedIds.forEach((id2) => {
      newNotes[id2] = globalNote;
    });
    setNotes(newNotes);
  };
  const handleApproveAll = () => {
    const allIds = items.map((item) => item.id);
    const routeName = actionType === "request_fund" ? "reimbursements.bulk-request-fund" : type === "reimbursement" ? "reimbursements.bulk-approve" : "leaves.bulk-approve";
    router.post(route(routeName), { ids: allIds, role }, {
      onSuccess: () => {
        onOpenChange(false);
        setSelectedIds([]);
        setActionMode(null);
        setNotes({});
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
  items.length > 0 && items[0].type === "atr";
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[95vw] w-full max-h-[90vh] flex flex-col p-6", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { className: "text-xl font-bold", children: actionMode === "reject" ? "Konfirmasi Penolakan Massal" : actionMode === "revision" ? "Konfirmasi Permintaan Revisi Massal" : title }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-sm", children: actionMode ? "Berikan alasan untuk setiap item yang dipilih." : "Pilih pengajuan yang akan diproses secara massal." })
    ] }),
    actionMode ? /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-auto my-4 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 p-4 rounded-lg border flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "global-note", className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Catatan Global (Opsional)" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "global-note",
              placeholder: "Masukkan catatan untuk semua item...",
              className: "bg-white resize-none h-20 text-xs",
              value: globalNote,
              onChange: (e) => setGlobalNote(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              className: "h-20 border-emerald-600 text-emerald-600 hover:bg-emerald-50 shrink-0",
              onClick: applyGlobalNote,
              children: "Terapkan ke Semua"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border rounded-md overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { className: "bg-muted/50", children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-1/4 font-bold", children: "Informasi Item" }),
          /* @__PURE__ */ jsxs(TableHead, { className: "font-bold", children: [
            "Catatan / Alasan ",
            actionMode === "reject" ? "Penolakan" : "Revisi"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: items.filter((item) => selectedIds.includes(item.id)).map((item) => /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-muted/30", children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-[10px]", children: item.code }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[8px] px-1 py-0", children: item.type.toUpperCase() })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium", children: item.user?.name }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground whitespace-nowrap", children: formatDate(item.created_at) }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-emerald-700", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(item.amount || 0)) })
          ] }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            Textarea,
            {
              placeholder: `Alasan ${actionMode === "reject" ? "ditolak" : "revisi"}...`,
              className: "min-h-[80px] text-xs resize-none",
              value: notes[item.id] || "",
              onChange: (e) => updateNote(item.id, e.target.value)
            }
          ) })
        ] }, item.id)) })
      ] }) })
    ] }) : /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto my-4 border rounded-md", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "bg-muted/50", children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-12", children: /* @__PURE__ */ jsx(
          Checkbox,
          {
            checked: selectedIds.length === items.length && items.length > 0,
            onCheckedChange: toggleSelectAll
          }
        ) }),
        type === "reimbursement" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Tipe" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Kode" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Tgl" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Pemohon" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Kode Project" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Initial Project" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold min-w-[150px]", children: "Detail Kegiatan" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Nominal" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Status Approval" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-right", children: "Aksi" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Kode & Tanggal" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Karyawan" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Jenis Cuti" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Durasi" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Status Approval" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-right", children: "Aksi" })
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
          type === "reimbursement" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "uppercase text-[10px] w-fit", children: item.type }),
              item.type === "eer" && item.eer_type && /* @__PURE__ */ jsx("span", { className: cn(
                "text-[9px] font-medium px-1 py-0.5 rounded-full border w-fit text-center",
                item.eer_type === "refund" ? "bg-orange-50 text-orange-600 border-orange-200" : item.eer_type === "reimbursement" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-purple-50 text-purple-600 border-purple-200"
              ), children: item.eer_type === "refund" ? "Refund" : item.eer_type === "reimbursement" ? "Reimbursement" : "Balance" })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium font-mono text-[10px]", children: item.code }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[10px] whitespace-nowrap", children: formatDate(item.created_at) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[10px]", children: item.user?.name ?? "-" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[10px] font-mono", children: item.project?.code ?? "-" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[10px]", children: item.project?.initial_project ?? "-" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[10px] min-w-[150px] max-w-[250px] leading-relaxed", children: /* @__PURE__ */ jsx("span", { className: "whitespace-normal break-words", children: item.usage_plan ?? "-" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-[10px] font-semibold whitespace-nowrap", children: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(item.amount || 0)) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 min-w-[100px]", children: item.approvals && [...item.approvals].sort((a, b) => {
              const p = { head: 1, hr: 2, finance: 3, direktur: 4 };
              return (p[a.role] || 99) - (p[b.role] || 99);
            }).map((approval) => /* @__PURE__ */ jsxs("div", { className: "text-[9px] flex items-center gap-1", children: [
              approval.status === "approved" ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 text-green-500" }) : approval.status === "revised" ? /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3 text-blue-500" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3 text-red-400" }),
              /* @__PURE__ */ jsx("span", { className: cn(
                "font-medium truncate max-w-[80px]",
                approval.status === "approved" ? "text-green-700" : approval.status === "revised" ? "text-blue-700" : "text-red-700"
              ), children: approval.approver?.name || approval.role })
            ] }, approval.id)) }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { className: cn("gap-1 text-[9px] px-1.5 py-0 whitespace-nowrap", statusCfg.className), children: [
              /* @__PURE__ */ jsx(StatusIcon, { className: "h-2.5 w-2.5" }),
              statusCfg.label
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Link, { href: `/reimbursements/${item.id}`, className: "text-emerald-700 hover:text-emerald-800", target: "_blank", children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }) }) })
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
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Link, { href: `/leaves/${item.code}`, className: "text-emerald-700 hover:text-emerald-800", target: "_blank", children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) }) })
          ] })
        ] }, item.id);
      }) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: type === "reimbursement" ? 11 : 7, className: "text-center py-12 text-muted-foreground text-xs", children: "Tidak ada data pengajuan." }) }) })
    ] }) }),
    /* @__PURE__ */ jsxs(DialogFooter, { className: "flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-medium text-muted-foreground w-full sm:w-auto", children: [
        selectedIds.length,
        " item dipilih dari ",
        items.length
      ] }),
      actionMode ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full sm:w-auto justify-end", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "text-xs", onClick: () => setActionMode(null), children: "Kembali" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: cn(
              "min-w-[140px] text-xs font-bold",
              actionMode === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"
            ),
            onClick: handleConfirmAction,
            children: [
              "Konfirmasi ",
              actionMode === "reject" ? "Tolak" : "Revisi",
              " (",
              selectedIds.length,
              ")"
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 w-full sm:w-auto justify-end", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "text-xs", onClick: () => onOpenChange(false), children: "Batal" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 border-l pl-2 ml-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              className: "border-red-200 text-red-700 hover:bg-red-50 text-[10px] h-8",
              onClick: () => handleActionAll("reject"),
              disabled: items.length === 0,
              children: "Tolak Semua"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              className: "border-orange-200 text-orange-700 hover:bg-orange-50 text-[10px] h-8",
              onClick: () => handleActionAll("revision"),
              disabled: items.length === 0,
              children: "Revisi Semua"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              className: "border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-[10px] h-8 font-bold",
              onClick: handleApproveAll,
              disabled: items.length === 0,
              children: actionType === "request_fund" ? "Request Fund Semua" : "Setujui Semua"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 border-l pl-2 ml-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              className: "border-red-600 text-red-600 hover:bg-red-50 text-[10px] h-8",
              disabled: selectedIds.length === 0,
              onClick: () => handleActionSelected("reject"),
              children: "Tolak Terpilih"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              className: "border-orange-600 text-orange-600 hover:bg-orange-50 text-[10px] h-8",
              disabled: selectedIds.length === 0,
              onClick: () => handleActionSelected("revision"),
              children: "Revisi Terpilih"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "bg-emerald-700 hover:bg-emerald-800 min-w-[120px] text-[10px] h-8 font-bold",
              disabled: selectedIds.length === 0,
              onClick: handleApproveSelected,
              children: actionType === "request_fund" ? `Request Fund (${selectedIds.length})` : `Setujui Terpilih (${selectedIds.length})`
            }
          )
        ] })
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
  totalYearClaims: initialTotalYearClaims,
  yearlySummary: initialYearlySummary,
  accountManagerLeaderboard: initialAccountManagerLeaderboard,
  divisionLeaderboard: initialDivisionLeaderboard,
  locations,
  projectsByDivision,
  approvalItems,
  availableYears,
  selectedYear: initialSelectedYear,
  totalBudget,
  totalManagementBudget
}) {
  const { auth } = usePage().props;
  const { hasRole } = usePermission();
  const isPegawai = hasRole("pegawai") && !hasRole("superadmin");
  const isHead = hasRole("head");
  const isSuperadminFinanceDirektur = hasRole("superadmin") || hasRole("finance") || hasRole("direktur");
  const [localYear, setLocalYear] = useState(String(initialSelectedYear ?? "all"));
  const [totalYearClaims, setTotalYearClaims] = useState(initialTotalYearClaims);
  const [yearlySummary, setYearlySummary] = useState(initialYearlySummary);
  const [accountManagerLeaderboard, setAccountManagerLeaderboard] = useState(initialAccountManagerLeaderboard);
  const [divisionLeaderboard, setDivisionLeaderboard] = useState(initialDivisionLeaderboard);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const fetchLeaderboard = useCallback(async (year) => {
    setLeaderboardLoading(true);
    try {
      const params = year === "all" ? {} : { year };
      const res = await axios.get("/api/v1/dashboard/leaderboard", { params });
      setTotalYearClaims(res.data.totalYearClaims);
      if (res.data.yearlySummary) setYearlySummary(res.data.yearlySummary);
      setAccountManagerLeaderboard(res.data.accountManagerLeaderboard);
      setDivisionLeaderboard(res.data.divisionLeaderboard);
    } catch {
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    items: [],
    type: "reimbursement",
    role: "",
    actionType: "approve"
  });
  const openApprovalModal = (title, items, type, role, actionType = "approve") => {
    setModalData({ title, items, type, role, actionType });
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
                onClick: () => openApprovalModal("ATR Menunggu Approval (Head)", approvalItems.head_reimbursements.filter((i) => i.type === "atr"), "reimbursement", "head"),
                icon: /* @__PURE__ */ jsx(Banknote, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "EER Menunggu Approval (Head)",
                count: approvalItems.head_reimbursements.filter((i) => i.type === "eer").length,
                color: "emerald",
                onClick: () => openApprovalModal("EER Menunggu Approval (Head)", approvalItems.head_reimbursements.filter((i) => i.type === "eer"), "reimbursement", "head"),
                icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Allowance Menunggu Approval (Head)",
                count: approvalItems.head_reimbursements.filter((i) => i.type === "allowance").length,
                color: "emerald",
                onClick: () => openApprovalModal("Allowance Menunggu Approval (Head)", approvalItems.head_reimbursements.filter((i) => i.type === "allowance"), "reimbursement", "head"),
                icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Cuti Menunggu Approval (Head)",
                count: approvalItems.head_leaves.length,
                color: "emerald",
                onClick: () => openApprovalModal("Cuti Menunggu Approval (Head)", approvalItems.head_leaves, "leave", "head"),
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
                onClick: () => openApprovalModal("ATR Menunggu Approval (Finance)", approvalItems.finance_reimbursements.filter((i) => i.type === "atr"), "reimbursement", "finance"),
                icon: /* @__PURE__ */ jsx(Banknote, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "EER Menunggu Approval (Finance)",
                count: approvalItems.finance_reimbursements.filter((i) => i.type === "eer").length,
                color: "blue",
                onClick: () => openApprovalModal("EER Menunggu Approval (Finance)", approvalItems.finance_reimbursements.filter((i) => i.type === "eer"), "reimbursement", "finance"),
                icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Allowance Menunggu Approval (Finance)",
                count: approvalItems.finance_reimbursements.filter((i) => i.type === "allowance").length,
                color: "blue",
                onClick: () => openApprovalModal("Allowance Menunggu Approval (Finance)", approvalItems.finance_reimbursements.filter((i) => i.type === "allowance"), "reimbursement", "finance"),
                icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Request Fund Pending (Finance)",
                count: approvalItems.finance_request_funds.length,
                color: "orange",
                onClick: () => openApprovalModal("Request Fund Pending (Finance)", approvalItems.finance_request_funds, "reimbursement", "finance", "request_fund"),
                icon: /* @__PURE__ */ jsx(Banknote, { className: "h-4 w-4" })
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
                onClick: () => openApprovalModal("ATR Menunggu Approval (Direktur)", approvalItems.direktur_reimbursements.filter((i) => i.type === "atr"), "reimbursement", "direktur"),
                icon: /* @__PURE__ */ jsx(Banknote, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "EER Menunggu Approval (Direktur)",
                count: approvalItems.direktur_reimbursements.filter((i) => i.type === "eer").length,
                color: "amber",
                onClick: () => openApprovalModal("EER Menunggu Approval (Direktur)", approvalItems.direktur_reimbursements.filter((i) => i.type === "eer"), "reimbursement", "direktur"),
                icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Allowance Menunggu Approval (Direktur)",
                count: approvalItems.direktur_reimbursements.filter((i) => i.type === "allowance").length,
                color: "amber",
                onClick: () => openApprovalModal("Allowance Menunggu Approval (Direktur)", approvalItems.direktur_reimbursements.filter((i) => i.type === "allowance"), "reimbursement", "direktur"),
                icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Cuti Menunggu Approval (Direktur)",
                count: approvalItems.direktur_leaves.length,
                color: "amber",
                onClick: () => openApprovalModal("Cuti Menunggu Approval (Direktur)", approvalItems.direktur_leaves, "leave", "direktur"),
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
                onClick: () => openApprovalModal("Cuti Menunggu Approval (HR)", approvalItems.hr_leaves, "leave", "hr"),
                icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              ApprovalStatisticCard,
              {
                title: "Allowance Menunggu Approval (HR)",
                count: approvalItems.hr_allowances.length,
                color: "rose",
                onClick: () => openApprovalModal("Allowance Menunggu Approval (HR)", approvalItems.hr_allowances, "reimbursement", "hr"),
                icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
              }
            )
          ] })
        ] })
      ] }),
      !isPegawai && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: isSuperadminFinanceDirektur && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Total Tahun Anggaran" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200", children: [
              formatIDR(totalYearClaims || 0),
              localYear !== "all" && /* @__PURE__ */ jsxs("span", { className: "font-normal text-purple-500 ml-1", children: [
                "(",
                localYear,
                ")"
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Filter Tahun:" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: localYear,
                onValueChange: (val) => {
                  setLocalYear(val);
                  fetchLeaderboard(val);
                },
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[160px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Semua Tahun" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Semua Tahun" }),
                    availableYears.map((y) => /* @__PURE__ */ jsx(SelectItem, { value: String(y), children: y }, y))
                  ] })
                ]
              }
            )
          ] })
        ] }),
        isSuperadminFinanceDirektur && yearlySummary && /* @__PURE__ */ jsx("div", { className: `space-y-4 mb-6 transition-opacity duration-300 ${leaderboardLoading ? "opacity-60" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm rounded-3xl overflow-hidden bg-white", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "p-5 pb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-semibold text-emerald-800", children: "Total Budget" }),
              /* @__PURE__ */ jsx("div", { className: "bg-emerald-100 p-2 rounded-full", children: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4 text-emerald-700" }) })
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "px-5 pb-5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-emerald-900 truncate", children: formatIDR(yearlySummary.total_budget) }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                "Total allocated budget for ",
                yearlySummary.year === "all" ? "semua tahun" : yearlySummary.year
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm rounded-3xl overflow-hidden bg-white flex flex-col", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "p-5 pb-2 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-semibold text-orange-800", children: "Total Expenses" }),
              /* @__PURE__ */ jsx("div", { className: "bg-orange-100 p-2 rounded-full", children: /* @__PURE__ */ jsx(Receipt, { className: "h-4 w-4 text-orange-600" }) })
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "px-5 pb-5 flex-1 flex flex-col", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2 mb-2", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-orange-700 truncate", children: formatIDR(yearlySummary.total_expenses) }),
                yearlySummary.total_budget > 0 && /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold text-orange-600 mb-0.5", title: "% of Total Budget", children: [
                  "(",
                  (yearlySummary.total_expenses / yearlySummary.total_budget * 100).toFixed(0),
                  "%)"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 text-xs text-muted-foreground border-t border-gray-100 pt-2 mt-auto", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "flex items-center before:content-['•'] before:mr-1", children: "ATR" }),
                  /* @__PURE__ */ jsx("span", { className: "text-blue-600 font-medium", children: formatIDR(yearlySummary.atr_expenses) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "flex items-center before:content-['•'] before:mr-1", children: "EER" }),
                  /* @__PURE__ */ jsx("span", { className: "text-indigo-600 font-medium", children: formatIDR(yearlySummary.eer_expenses) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "flex items-center before:content-['•'] before:mr-1", children: "Allowance" }),
                  /* @__PURE__ */ jsx("span", { className: "text-purple-600 font-medium", children: formatIDR(yearlySummary.allowance_expenses) })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm rounded-3xl overflow-hidden bg-white flex flex-col", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "p-5 pb-2 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-semibold ${yearlySummary.remaining_profit >= 0 ? "text-emerald-800" : "text-red-800"}`, children: "Remaining Budget" }),
              /* @__PURE__ */ jsx("div", { className: `${yearlySummary.remaining_profit >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"} p-2 rounded-full`, children: yearlySummary.remaining_profit >= 0 ? /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4" }) })
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "px-5 pb-5 flex-1 flex flex-col justify-end", children: [
              /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold truncate mb-1 ${yearlySummary.remaining_profit >= 0 ? "text-emerald-700" : "text-red-600"}`, children: formatIDR(yearlySummary.remaining_profit) }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground font-medium", children: [
                yearlySummary.remaining_percentage.toFixed(0),
                "% Remaining Budget"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm rounded-3xl overflow-hidden bg-white flex flex-col", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "p-5 pb-2 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-semibold text-gray-800", children: "Management Budget" }),
              /* @__PURE__ */ jsx("div", { className: "bg-pink-50 p-2 rounded-full", children: /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4 text-pink-600" }) })
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "px-5 pb-5 flex-1 flex flex-col justify-end", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2 mb-1", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-pink-600 truncate", children: formatIDR(yearlySummary.total_management_budget) }),
                yearlySummary.total_budget > 0 && /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold text-pink-500 mb-0.5", title: "% of Total Budget", children: [
                  "(",
                  (yearlySummary.total_management_budget / yearlySummary.total_budget * 100).toFixed(0),
                  "%)"
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Portioned from year claims" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: `grid grid-cols-1 gap-6 transition-opacity duration-300 ${leaderboardLoading ? "opacity-60" : ""}`, children: /* @__PURE__ */ jsxs(Card, { className: "border shadow-sm rounded-3xl overflow-hidden bg-white", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "p-5 pb-3 border-b border-gray-50", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-bold text-gray-800", children: "Top Account Manager" }),
            /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: "Berdasarkan alokasi tahun anggaran" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: accountManagerLeaderboard.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-sm text-muted-foreground", children: "Belum ada data" }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "text-xs text-muted-foreground bg-gray-50 uppercase border-b", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-semibold w-12 text-center", children: "Rank" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-semibold", children: "Account Manager" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-semibold", children: "KPI" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-semibold text-right", children: "Budget" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-semibold text-right", children: "Expenses" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-semibold text-right", children: "ATR" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-semibold text-right", children: "EER" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-semibold text-right", children: "Allowance" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-semibold text-right", children: "Profit" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: (isHead && !isSuperadminFinanceDirektur ? accountManagerLeaderboard.filter((entry) => entry.id === auth.user.id) : accountManagerLeaderboard).map((entry, idx) => {
              entry.utilization_percentage;
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
                /* @__PURE__ */ jsxs("td", { className: "px-5 py-4 text-center font-bold text-muted-foreground/60", children: [
                  "#",
                  idx + 1
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-semibold text-gray-800 whitespace-nowrap", children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: `/projects?account_manager_id=${entry.id}${localYear !== "all" ? `&year=${localYear}` : ""}`,
                    className: "hover:text-[var(--sidebar)] hover:underline transition-colors",
                    children: entry.name
                  }
                ) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 min-w-[180px]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-gray-800", children: entry.kpi_nominal && entry.kpi_nominal > 0 ? formatIDR(entry.kpi_nominal) : "-" }),
                  entry.kpi_nominal && entry.kpi_nominal > 0 && (() => {
                    const kpiPct = entry.total_budget / entry.kpi_nominal * 100;
                    const kpiColor = kpiPct >= 100 ? { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-500" } : kpiPct >= 50 ? { badge: "bg-blue-50 text-blue-700 border-blue-200", bar: "bg-blue-500" } : { badge: "bg-amber-50 text-amber-700 border-amber-200", bar: "bg-amber-400" };
                    return /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsxs(
                        "span",
                        {
                          className: `inline-flex items-center self-start px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${kpiColor.badge}`,
                          title: `Budget Claim / KPI: ${formatIDR(entry.total_budget)} / ${formatIDR(entry.kpi_nominal)}`,
                          children: [
                            kpiPct.toFixed(1),
                            "% of KPI"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-100 rounded-full h-1 overflow-hidden", children: /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: `h-full rounded-full transition-all duration-500 ${kpiColor.bar}`,
                          style: { width: `${Math.min(100, kpiPct)}%` }
                        }
                      ) })
                    ] });
                  })()
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-bold text-emerald-700 text-right whitespace-nowrap", children: formatIDR(entry.total_budget) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-medium text-orange-600 text-right whitespace-nowrap", children: formatIDR(entry.total_expenses) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-blue-600 text-right whitespace-nowrap", children: formatIDR(entry.atr_expenses) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-indigo-600 text-right whitespace-nowrap", children: formatIDR(entry.eer_expenses) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-purple-600 text-right whitespace-nowrap", children: formatIDR(entry.allowance_expenses) }),
                /* @__PURE__ */ jsx("td", { className: `px-5 py-4 font-bold text-right whitespace-nowrap ${entry.profit >= 0 ? "text-emerald-600" : "text-red-600"}`, children: formatIDR(entry.profit) })
              ] }, entry.id || entry.name);
            }) })
          ] }) }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
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
        type: modalData.type,
        role: modalData.role,
        actionType: modalData.actionType
      }
    )
  ] });
}
export {
  Dashboard as default
};
