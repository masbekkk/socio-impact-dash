import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { A as AppSidebarLayout, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuSeparator, e as DropdownMenuItem } from "./app-sidebar-layout-BRoV_jj3.js";
import { Head, Link, usePage } from "@inertiajs/react";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-DAjHeOuX.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { Calendar, Search, X, Filter, Loader2, MoreHorizontal, Eye, Trash2, CheckCircle, XCircle, FileText, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ArrowUpDown } from "lucide-react";
import { S as StatusBadge } from "./StatusBadge-CfpbUrIp.js";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { D as DateFilterPresets } from "./DateFilterPresets-BoY3oSuX.js";
import axios from "axios";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "clsx";
import "tailwind-merge";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "@radix-ui/react-label";
import "./DatePicker-DtmT1I-q.js";
import "react-number-format";
const LEAVE_TYPE_LABELS = {
  annual: "Cuti Tahunan",
  sick: "Cuti Sakit",
  unpaid: "Cuti Tanpa Gaji",
  travel: "Perjalanan Dinas",
  berduka: "Cuti Berduka",
  wedding: "Cuti Menikah",
  birth: "Cuti Melahirkan",
  important: "Cuti Alasan Penting",
  make_up: "Cuti Ganti Hari Libur (dengan konfirmasi)"
};
const STATUS_OPTIONS = [
  { label: "Semua Status", value: "all" },
  { label: "Diajukan", value: "submitted" },
  { label: "Disetujui Superadmin", value: "superadmin_approved" },
  { label: "Disetujui Head", value: "head_approved" },
  { label: "Disetujui HR", value: "hr_approved" },
  { label: "Ditolak", value: "rejected" },
  { label: "Draft", value: "draft" }
];
function durationDays(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  if (s > e) return 0;
  let days = 0;
  const curr = new Date(s);
  while (curr <= e) {
    const day = curr.getDay();
    if (day !== 0 && day !== 6) {
      days++;
    }
    curr.setDate(curr.getDate() + 1);
  }
  return days;
}
function useLeaveData(typeFilter) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0, from: null, to: null });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_dir: sortDir
      };
      if (typeFilter) params.type = typeFilter;
      if (search) params.search = search;
      if (status !== "all") params.status = status;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const res = await axios.get("/api/v1/leaves", { params });
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, sortBy, sortDir, search, status, startDate, endDate, typeFilter]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
    setPage(1);
  };
  return {
    data,
    meta,
    loading,
    search,
    setSearch: (v) => {
      setSearch(v);
      setPage(1);
    },
    status,
    setStatus: (v) => {
      setStatus(v);
      setPage(1);
    },
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setDateRange: (s, e) => {
      setStartDate(s);
      setEndDate(e);
      setPage(1);
    },
    clearDates: () => {
      setStartDate("");
      setEndDate("");
      setPage(1);
    },
    page,
    setPage,
    perPage,
    setPerPage: (v) => {
      setPerPage(v);
      setPage(1);
    },
    sortBy,
    sortDir,
    toggleSort,
    refetch: fetchData
  };
}
function LeaveIndex({ remainingAnnualLeaves }) {
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Cuti", href: "/leaves" }
  ];
  const leave = useLeaveData("leave");
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Cuti" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Manajemen Cuti" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm md:text-base", children: "Kelola pengajuan cuti Anda." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-end sm:items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2 flex flex-col items-center justify-center shadow-sm min-w-[140px]", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider text-emerald-600 font-bold", children: "Sisa Cuti Tahunan" }),
            /* @__PURE__ */ jsxs("span", { className: "text-2xl font-black text-emerald-700", children: [
              remainingAnnualLeaves,
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-xs font-normal", children: "Hari" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx(Button, { asChild: true, className: "gap-2 bg-sidebar text-white hover:bg-sidebar/90 transition-transform hover:scale-105 active:scale-95 shadow-sm", children: /* @__PURE__ */ jsxs(Link, { href: "/leaves/create", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
            "Buat Pengajuan Cuti"
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        LeaveTable,
        {
          title: "Daftar Pengajuan Cuti",
          description: "Riwayat pengajuan cuti tahunan, sakit, dan lainnya.",
          hook: leave
        }
      )
    ] })
  ] });
}
function LeaveTable({ title, description, hook }) {
  const { data, meta, loading, search, setSearch, status, setStatus, startDate, endDate, setDateRange, clearDates, page, setPage, perPage, setPerPage, sortBy, toggleSort, refetch } = hook;
  const { auth } = usePage().props;
  const { hasRole } = usePermission();
  auth.permissions || [];
  const canDelete = hasRole(["hr", "superadmin"]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/v1/leaves/${deleteTarget.code}`);
      setDeleteTarget(null);
      refetch();
    } catch {
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };
  const SortHeader = ({ col, children }) => /* @__PURE__ */ jsx(TableHead, { className: "cursor-pointer select-none", onClick: () => toggleSort(col), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
    children,
    /* @__PURE__ */ jsx(ArrowUpDown, { className: cn("h-3 w-3", sortBy === col ? "text-foreground" : "text-muted-foreground/50") })
  ] }) });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Card, { className: "border rounded-md", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: title }),
          /* @__PURE__ */ jsx(CardDescription, { children: description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex w-full md:w-auto items-center gap-2 flex-wrap md:flex-nowrap", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(Input, { placeholder: "Cari...", className: "pl-8 w-full", value: search, onChange: (e) => setSearch(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: cn(
              "justify-start text-left font-normal w-[240px] px-3 border-dashed hidden md:flex",
              !startDate && "text-muted-foreground",
              (startDate || endDate) && "border-solid bg-emerald-50/50 border-emerald-200 text-emerald-700"
            ), children: [
              /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4" }),
              startDate ? endDate ? /* @__PURE__ */ jsxs(Fragment, { children: [
                format(new Date(startDate), "dd MMM yyyy", { locale: id }),
                " - ",
                format(new Date(endDate), "dd MMM yyyy", { locale: id })
              ] }) : format(new Date(startDate), "dd MMM yyyy", { locale: id }) : /* @__PURE__ */ jsx("span", { children: "Pilih Rentang Tanggal" }),
              (startDate || endDate) && /* @__PURE__ */ jsx("div", { className: "ml-auto hover:bg-emerald-200 rounded-full p-0.5 transition-colors", role: "button", onClick: (e) => {
                e.stopPropagation();
                clearDates();
              }, children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
            ] }) }),
            /* @__PURE__ */ jsx(DropdownMenuContent, { className: "w-auto p-0 bg-white", align: "start", children: /* @__PURE__ */ jsx(DateFilterPresets, { startDate, endDate, onSelect: (s, e) => setDateRange(s, e) }) })
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", className: cn("md:hidden", startDate || endDate ? "bg-accent text-accent-foreground border-primary" : ""), children: /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsx(DropdownMenuContent, { className: "w-auto p-0 bg-white", align: "end", children: /* @__PURE__ */ jsx(DateFilterPresets, { startDate, endDate, onSelect: (s, e) => setDateRange(s, e) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-none", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "h-9 gap-2", children: [
              /* @__PURE__ */ jsx(Filter, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Filter" })
            ] }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Filter Status" }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              STATUS_OPTIONS.map((opt) => /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setStatus(opt.value), className: status === opt.value ? "bg-accent" : "", children: opt.label }, opt.value))
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "px-4 md:px-8", children: [
        loading && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-12", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "ml-2 text-sm text-muted-foreground", children: "Memuat data..." })
        ] }),
        !loading && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "space-y-3 md:hidden", children: data.length > 0 ? data.map((item) => /* @__PURE__ */ jsx(
            Card,
            {
              className: "cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all active:scale-[0.99] border rounded-xl overflow-hidden bg-white",
              onClick: () => router.visit(`/leaves/${item.code}`),
              children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 border-b pb-2.5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-sm text-gray-900", children: item.code }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: item.created_at ? format(new Date(item.created_at), "dd MMM yyyy", { locale: id }) : "-" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "shrink-0", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4 text-muted-foreground" }) }) }),
                    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                      /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Aksi" }),
                      /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/leaves/${item.code}`, className: "cursor-pointer flex items-center", children: [
                        /* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4 text-muted-foreground" }),
                        " Lihat Detail"
                      ] }) }),
                      canDelete && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                        /* @__PURE__ */ jsxs(
                          DropdownMenuItem,
                          {
                            className: "text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer",
                            onClick: () => setDeleteTarget({ code: item.code, name: item.user?.name ?? item.code }),
                            children: [
                              /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                              " Hapus Cuti"
                            ]
                          }
                        )
                      ] })
                    ] })
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-900", children: item.user?.name ?? "-" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: item.user?.email ?? "-" })
                  ] }),
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-normal border-blue-200 bg-blue-50 text-blue-700 text-xs shrink-0", children: LEAVE_TYPE_LABELS[item.type] ?? item.type })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-gray-50/70 p-2.5 rounded-lg space-y-1 text-xs", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-medium text-gray-700", children: [
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Durasi: ",
                      durationDays(item.start_date, item.end_date),
                      " Hari"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
                      format(new Date(item.start_date), "dd MMM", { locale: id }),
                      " - ",
                      format(new Date(item.end_date), "dd MMM yyyy", { locale: id })
                    ] })
                  ] }),
                  item.reason && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs line-clamp-2 italic", children: item.reason })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t pt-2.5", children: [
                  /* @__PURE__ */ jsx(StatusBadge, { status: ["head_approved", "hr_approved", "superadmin_approved"].includes(item.status) ? "approved" : item.status }),
                  item.approvals?.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 text-[10px]", children: item.approvals.map((a) => /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: cn(
                        "px-1.5 py-0.5 rounded font-medium border",
                        a.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : a.status === "rejected" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-gray-50 text-gray-600 border-gray-200"
                      ),
                      children: [
                        a.role.toUpperCase(),
                        ": ",
                        a.status === "approved" ? "✓" : "..."
                      ]
                    },
                    a.id
                  )) })
                ] })
              ] })
            },
            item.id
          )) : /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground border rounded-xl bg-gray-50", children: "Tidak ada data cuti." }) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50 hover:bg-muted/50", children: [
              /* @__PURE__ */ jsx(SortHeader, { col: "code", children: "Kode & Tanggal" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Karyawan" }),
              /* @__PURE__ */ jsx(SortHeader, { col: "type", children: "Jenis Cuti" }),
              /* @__PURE__ */ jsx(SortHeader, { col: "start_date", children: "Durasi" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Keterangan" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Status Approval" }),
              /* @__PURE__ */ jsx(SortHeader, { col: "status", children: "Status" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Aksi" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: data.length > 0 ? data.map((item) => /* @__PURE__ */ jsxs(
              TableRow,
              {
                className: "cursor-pointer hover:bg-emerald-50/40 transition-colors group",
                onClick: () => router.visit(`/leaves/${item.code}`),
                children: [
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: item.code }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: item.created_at ? format(new Date(item.created_at), "dd MMM yyyy", { locale: id }) : "-" })
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: item.user?.name ?? "-" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: item.user?.email ?? "-" })
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-normal border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100", children: LEAVE_TYPE_LABELS[item.type] ?? item.type }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5 text-sm", children: [
                    /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                      durationDays(item.start_date, item.end_date),
                      " Hari"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      format(new Date(item.start_date), "dd MMM", { locale: id }),
                      " - ",
                      format(new Date(item.end_date), "dd MMM yyyy", { locale: id })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { className: "max-w-[200px]", children: /* @__PURE__ */ jsx("div", { className: "truncate text-sm text-muted-foreground", title: item.reason ?? "", children: item.reason ?? "-" }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5 min-w-[150px] py-1", children: item.approvals?.map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    a.status === "approved" ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-emerald-500 shrink-0" }) : a.status === "rejected" ? /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4 text-rose-500 shrink-0" }) : a.status === "revision" ? /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-amber-500 shrink-0" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4 text-rose-500 shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[11px] leading-tight", children: [
                      /* @__PURE__ */ jsx("span", { className: cn(
                        "font-bold",
                        a.status === "approved" ? "text-emerald-600" : a.status === "rejected" ? "text-rose-600" : a.status === "revision" ? "text-amber-600" : "text-rose-600"
                      ), children: a.status === "approved" ? "Disetujui" : a.status === "rejected" ? "Ditolak" : a.status === "revision" ? "Revisi" : "Menunggu" }),
                      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground truncate max-w-[80px]", title: a.approver?.name ?? a.role, children: a.approver?.name ?? a.role })
                    ] })
                  ] }, a.id)) }) }),
                  /* @__PURE__ */ jsxs(TableCell, { children: [
                    /* @__PURE__ */ jsx(StatusBadge, { status: ["head_approved", "hr_approved", "superadmin_approved"].includes(item.status) ? "approved" : item.status }),
                    item.approvals?.length > 0 && (() => {
                      const last = item.approvals[item.approvals.length - 1];
                      return last.approver ? /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground mt-1", children: [
                        "by ",
                        last.approver.name,
                        " - ",
                        last.role
                      ] }) : null;
                    })()
                  ] }),
                  /* @__PURE__ */ jsx(TableCell, { className: "text-right", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-foreground", children: [
                      /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" })
                    ] }) }),
                    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                      /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Aksi" }),
                      /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/leaves/${item.code}`, className: "cursor-pointer flex items-center", children: [
                        /* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4 text-muted-foreground" }),
                        " Lihat Detail"
                      ] }) }),
                      canDelete && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                        /* @__PURE__ */ jsxs(
                          DropdownMenuItem,
                          {
                            className: "text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer",
                            onClick: () => setDeleteTarget({ code: item.code, name: item.user?.name ?? item.code }),
                            children: [
                              /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                              " Hapus Cuti"
                            ]
                          }
                        )
                      ] })
                    ] })
                  ] }) })
                ]
              },
              item.id
            )) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "text-center py-8 text-muted-foreground", children: "Tidak ada data cuti." }) }) })
          ] }) })
        ] }),
        !loading && meta.total > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-2 py-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground hidden flex-1 text-sm lg:flex", children: [
            "Menampilkan ",
            meta.from,
            " sampai ",
            meta.to,
            " dari ",
            meta.total,
            " hasil"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center gap-8 lg:w-fit", children: [
            /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-2 lg:flex", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium", children: "Baris per halaman" }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: [10, 20, 30, 50].map((s) => ({ label: s.toString(), value: s.toString() })),
                  value: `${perPage}`,
                  onValueChange: (v) => {
                    setPerPage(Number(v));
                    setPage(1);
                  },
                  className: "w-20 h-8",
                  placeholder: `${perPage}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex w-fit items-center justify-center text-sm font-medium", children: [
              "Halaman ",
              meta.current_page,
              " dari ",
              meta.last_page
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-2 lg:ml-0", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", className: "hidden h-8 w-8 p-0 lg:flex", onClick: () => setPage(1), disabled: page === 1, children: /* @__PURE__ */ jsx(ChevronsLeft, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", className: "h-8 w-8 p-0", onClick: () => setPage(Math.max(1, page - 1)), disabled: page === 1, children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", className: "h-8 w-8 p-0", onClick: () => setPage(Math.min(meta.last_page, page + 1)), disabled: page === meta.last_page, children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", className: "hidden h-8 w-8 p-0 lg:flex", onClick: () => setPage(meta.last_page), disabled: page === meta.last_page, children: /* @__PURE__ */ jsx(ChevronsRight, { className: "h-4 w-4" }) })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!deleteTarget, onOpenChange: (open) => !open && setDeleteTarget(null), children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2 text-rose-700", children: [
          /* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5" }),
          " Hapus Data Cuti"
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Tindakan ini tidak dapat dibatalkan. Data cuti ",
          /* @__PURE__ */ jsx("b", { children: deleteTarget?.name }),
          " akan dihapus permanen dan kuota cuti akan dikembalikan."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDeleteTarget(null), disabled: deleteLoading, children: "Batal" }),
        /* @__PURE__ */ jsxs(Button, { variant: "destructive", onClick: handleDelete, disabled: deleteLoading, className: "gap-2", children: [
          deleteLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
          "Ya, Hapus"
        ] })
      ] })
    ] }) })
  ] });
}
export {
  LeaveIndex as default
};
