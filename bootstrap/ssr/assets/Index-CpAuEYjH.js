import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
import { S as SearchableMultiSelect } from "./SearchableMultiSelect-BGlmeo1V.js";
import { A as AppSidebarLayout, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuSeparator, e as DropdownMenuItem, f as DropdownMenuCheckboxItem } from "./app-sidebar-layout-5JGZFayF.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { c as cn, B as Button } from "./button-hAi0Fg-Q.js";
import { ChevronDownIcon, CheckIcon, ChevronUpIcon, Download, Plus, FileText, Receipt, Wallet, Search, Calendar, ListFilter, XCircle, AlertCircle, CheckCircle, DollarSign, Clock, X, MoreHorizontal, Eye, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { L as Label } from "./label-7wn1ZQI4.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-DAjHeOuX.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-C8TeAzVF.js";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { D as DateFilterPresets } from "./DateFilterPresets-BffSLq1i.js";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
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
import "@radix-ui/react-label";
import "./DatePicker-DAaV_rdH.js";
import "react-number-format";
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>span]:line-clamp-1",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
    }
  );
}
const STATUS_CONFIG = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200", icon: FileText },
  submitted: { label: "Diajukan", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200", icon: Clock },
  revised: { label: "Sudah Direvisi", className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200", icon: CheckCircle },
  approved: { label: "Disetujui", className: "bg-green-100 text-green-700 hover:bg-green-100 border-green-200", icon: CheckCircle },
  head_approved: { label: "Head Approved", className: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100", icon: CheckCircle },
  hr_approved: { label: "HR Approved", className: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100", icon: CheckCircle },
  finance_approved: { label: "Finance Approved", className: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100", icon: CheckCircle },
  request_fund: { label: "Request Fund", className: "bg-orange-50 text-orange-600 hover:bg-orange-50 border-orange-100", icon: DollarSign },
  transferred: { label: "Sudah Ditransfer", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200", icon: CheckCircle },
  revision: { label: "Revisi", className: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200", icon: AlertCircle },
  rejected: { label: "Ditolak", className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200", icon: XCircle }
};
const TYPE_COLORS = {
  atr: "bg-purple-100 text-purple-700 border-purple-200",
  eer: "bg-indigo-100 text-indigo-700 border-indigo-200",
  allowance: "bg-teal-100 text-teal-700 border-teal-200"
};
function ReimbursementsIndex({ reimbursements, filters, divisions }) {
  const { auth } = usePage().props;
  const { hasRole } = usePermission();
  const isSuperadmin = hasRole("superadmin");
  const isFinance = hasRole("finance");
  const isDirektur = hasRole("direktur");
  const isHR = hasRole("hr") && !isSuperadmin;
  const isHead = hasRole("head") && !isSuperadmin;
  const isPegawai = hasRole("pegawai") && !isSuperadmin && !isHead && !isFinance && !isDirektur && !isHR;
  const [searchQuery, setSearchQuery] = useState(filters.search ?? "");
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Keuangan", href: "/reimbursements" }
  ];
  const navigate = (params) => {
    const query = {};
    const merged = { ...filters, ...params };
    if (merged.type) query.type = String(merged.type);
    if (merged.status) query.status = String(merged.status);
    if (merged.search) query.search = String(merged.search);
    if (merged.start_date) query.start_date = String(merged.start_date);
    if (merged.end_date) query.end_date = String(merged.end_date);
    if (merged.sort_by && merged.sort_by !== "created_at") query.sort_by = String(merged.sort_by);
    if (merged.sort_dir && merged.sort_dir !== "desc") query.sort_dir = String(merged.sort_dir);
    if (merged.per_page && merged.per_page !== 10) query.per_page = String(merged.per_page);
    if (merged.division_id) query.division_id = String(merged.division_id);
    if (params.page && Number(params.page) > 1) query.page = String(params.page);
    router.get("/reimbursements", query, { preserveState: true, preserveScroll: true });
  };
  const handleSearch = () => {
    navigate({ search: searchQuery, page: 1 });
  };
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };
  const handleSort = (column) => {
    const newDir = filters.sort_by === column && filters.sort_dir === "asc" ? "desc" : "asc";
    navigate({ sort_by: column, sort_dir: newDir, page: 1 });
  };
  const handleDelete = async (id2) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus reimbursement ini? Aksi ini tidak dapat dibatalkan.")) return;
    try {
      await axios.delete(`/api/v1/reimbursements/${id2}`);
      router.reload({ only: ["reimbursements"] });
    } catch {
      alert("Gagal menghapus Keuangan.");
    }
  };
  const SortIcon = ({ column }) => {
    if (filters.sort_by !== column) return /* @__PURE__ */ jsx(ArrowUpDown, { className: "ml-1 h-3 w-3 opacity-40" });
    return filters.sort_dir === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "ml-1 h-3 w-3" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "ml-1 h-3 w-3" });
  };
  const activeTab = filters.type || (isHR ? "allowance" : isPegawai ? "atr" : "all");
  const { data } = reimbursements;
  const { current_page, last_page, total, from, to } = reimbursements.meta;
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Keuangan" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Keuangan" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Pengelolaan ATR, EER & Allowance" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto", children: [
          /* @__PURE__ */ jsx("a", { href: `/reimbursements/export-excel${window.location.search}`, target: "_blank", rel: "noopener noreferrer", className: "w-full sm:w-auto", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2 w-full hover:bg-slate-100", children: [
            /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
            " Export ATR & EER"
          ] }) }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "gap-2 bg-sidebar text-white hover:bg-sidebar/90 transition-transform hover:scale-105 active:scale-95 shadow-sm w-full sm:w-auto", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
              "Buat Pengajuan"
            ] }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Pilih Jenis Pengajuan" }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: "/reimbursements/create/atr", className: "cursor-pointer", children: [
                /* @__PURE__ */ jsx(FileText, { className: "mr-2 h-4 w-4" }),
                " Pengajuan ATR"
              ] }) }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: "/reimbursements/create/eer", className: "cursor-pointer", children: [
                /* @__PURE__ */ jsx(Receipt, { className: "mr-2 h-4 w-4" }),
                " Pengajuan EER"
              ] }) }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: "/reimbursements/create/allowance", className: "cursor-pointer", children: [
                /* @__PURE__ */ jsx(Wallet, { className: "mr-2 h-4 w-4" }),
                " Pengajuan Allowance"
              ] }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row justify-between gap-4 md:items-center", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Daftar Pengajuan" }),
            /* @__PURE__ */ jsxs(CardDescription, { children: [
              total,
              " pengajuan ditemukan",
              activeTab !== "all" ? ` (${activeTab.toUpperCase()})` : "",
              "."
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
            /* @__PURE__ */ jsx(Tabs, { value: activeTab, onValueChange: (v) => navigate({ type: v === "all" ? "" : v, page: 1 }), className: "w-full md:w-auto", children: /* @__PURE__ */ jsxs(TabsList, { children: [
              (isSuperadmin || isFinance || isDirektur || isHead || isPegawai) && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(TabsTrigger, { value: "all", children: "Semua" }),
                /* @__PURE__ */ jsx(TabsTrigger, { value: "atr", children: "ATR" }),
                /* @__PURE__ */ jsx(TabsTrigger, { value: "eer", children: "EER" })
              ] }),
              (isSuperadmin || isFinance || isDirektur || isHead || isHR) && /* @__PURE__ */ jsx(TabsTrigger, { value: "allowance", children: "Allowance" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2 w-full md:w-auto justify-end", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-auto min-w-[140px] max-w-[300px]", children: [
                /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "search",
                    placeholder: "Cari kode, nama...",
                    className: "pl-9 h-10 w-full",
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    onKeyDown: handleSearchKeyDown
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 md:hidden", children: [
                /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", className: filters.start_date || filters.end_date ? "bg-accent text-accent-foreground border-primary" : "", children: /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }) }) }),
                  /* @__PURE__ */ jsx(DropdownMenuContent, { className: "w-auto p-0 bg-white", align: "end", children: /* @__PURE__ */ jsx(
                    DateFilterPresets,
                    {
                      startDate: filters.start_date,
                      endDate: filters.end_date,
                      onSelect: (start, end) => navigate({ start_date: start, end_date: end, page: 1 })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", className: filters.status ? "bg-accent text-accent-foreground border-primary" : "", children: /* @__PURE__ */ jsx(ListFilter, { className: "h-4 w-4" }) }) }),
                  /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                    /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Filter Status" }),
                    /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                    /* @__PURE__ */ jsx(DropdownMenuCheckboxItem, { checked: !filters.status, onCheckedChange: () => navigate({ status: "", page: 1 }), children: "Semua" }),
                    Object.entries(STATUS_CONFIG).map(([key, cfg]) => /* @__PURE__ */ jsx(DropdownMenuCheckboxItem, { checked: filters.status === key, onCheckedChange: () => navigate({ status: key, page: 1 }), children: cfg.label }, key))
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      className: cn(
                        "justify-start text-left font-normal w-[240px] px-3 border-dashed",
                        !filters.start_date && "text-muted-foreground",
                        (filters.start_date || filters.end_date) && "border-solid bg-emerald-50/50 border-emerald-200 text-emerald-700"
                      ),
                      children: [
                        /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4" }),
                        filters.start_date ? filters.end_date ? /* @__PURE__ */ jsxs(Fragment, { children: [
                          format(new Date(filters.start_date), "dd MMM yyyy", { locale: id }),
                          " -",
                          " ",
                          format(new Date(filters.end_date), "dd MMM yyyy", { locale: id })
                        ] }) : format(new Date(filters.start_date), "dd MMM yyyy", { locale: id }) : /* @__PURE__ */ jsx("span", { children: "Pilih Rentang Tanggal" }),
                        (filters.start_date || filters.end_date) && /* @__PURE__ */ jsx("div", { className: "ml-auto hover:bg-emerald-200 rounded-full p-0.5 transition-colors", role: "button", onClick: (e) => {
                          e.stopPropagation();
                          navigate({ start_date: "", end_date: "", page: 1 });
                        }, children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsx(DropdownMenuContent, { className: "w-auto p-0 bg-white", align: "start", children: /* @__PURE__ */ jsx(
                    DateFilterPresets,
                    {
                      startDate: filters.start_date,
                      endDate: filters.end_date,
                      onSelect: (start, end) => navigate({ start_date: start, end_date: end, page: 1 })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsx(
                  SearchableMultiSelect,
                  {
                    options: (divisions || []).map((div) => ({
                      label: `${div.division_code?.code} - ${div.name}`,
                      value: div.id.toString()
                    })),
                    value: filters.division_id ? filters.division_id.split(",") : [],
                    onValueChange: (val) => navigate({ division_id: val.length > 0 ? val.join(",") : "", page: 1 }),
                    placeholder: "Semua Divisi",
                    className: "w-40 sm:w-auto min-w-[160px]"
                  }
                ),
                /* @__PURE__ */ jsxs(Select, { value: filters.status || "all", onValueChange: (v) => navigate({ status: v === "all" ? "" : v, page: 1 }), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[160px]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(ListFilter, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                    /* @__PURE__ */ jsx(SelectValue, { placeholder: "Status" })
                  ] }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Semua Status" }),
                    Object.entries(STATUS_CONFIG).map(([key, cfg]) => /* @__PURE__ */ jsx(SelectItem, { value: key, children: cfg.label }, key))
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: data.length > 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            activeTab === "atr" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("code"), children: [
                "Kode ATR ",
                /* @__PURE__ */ jsx(SortIcon, { column: "code" })
              ] }) }),
              /* @__PURE__ */ jsx(TableHead, { children: "Kode Project" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Inisial Project" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Detail Kegiatan" }),
              /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("amount"), children: [
                "Nominal ",
                /* @__PURE__ */ jsx(SortIcon, { column: "amount" })
              ] }) }),
              /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("status"), children: [
                "Status Approval ",
                /* @__PURE__ */ jsx(SortIcon, { column: "status" })
              ] }) }),
              /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("status"), children: [
                "Status ",
                /* @__PURE__ */ jsx(SortIcon, { column: "status" })
              ] }) })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("code"), children: [
                "Kode ",
                /* @__PURE__ */ jsx(SortIcon, { column: "code" })
              ] }) }),
              /* @__PURE__ */ jsx(TableHead, { children: "Tipe" }),
              /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("created_at"), children: [
                "Tanggal ",
                /* @__PURE__ */ jsx(SortIcon, { column: "created_at" })
              ] }) }),
              /* @__PURE__ */ jsx(TableHead, { children: "Pemohon" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Divisi" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Proyek" }),
              /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("amount"), children: [
                "Total Biaya ",
                /* @__PURE__ */ jsx(SortIcon, { column: "amount" })
              ] }) }),
              /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("status"), children: [
                "Status Approval ",
                /* @__PURE__ */ jsx(SortIcon, { column: "status" })
              ] }) }),
              /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("status"), children: [
                "Status ",
                /* @__PURE__ */ jsx(SortIcon, { column: "status" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: data.map((item) => {
            const statusCfg = STATUS_CONFIG[item.status] ?? { label: item.status, className: "bg-gray-100 text-gray-600", icon: Clock };
            const StatusIcon = statusCfg.icon;
            return /* @__PURE__ */ jsxs(TableRow, { children: [
              activeTab === "atr" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium font-mono text-sm", children: item.code }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-sm font-mono", children: item.project?.code ?? "-" }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: item.project?.initial_project ?? "-" }),
                /* @__PURE__ */ jsx(TableCell, { className: "max-w-[200px]", children: /* @__PURE__ */ jsx("span", { className: "truncate block text-sm", children: item.usage_plan ?? "-" }) }),
                /* @__PURE__ */ jsxs(TableCell, { className: "font-medium", children: [
                  "Rp ",
                  parseFloat(item.amount).toLocaleString("id-ID")
                ] }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5", children: item.approvals && item.approvals.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-1 flex flex-col gap-1 inline-flex", children: [...item.approvals].sort((a, b) => {
                  const p = { head: 1, hr: 2, finance: 3, direktur: 4 };
                  return (p[a.role] || 99) - (p[b.role] || 99);
                }).map((approval) => /* @__PURE__ */ jsxs("div", { className: "text-xs flex items-center gap-1.5", children: [
                  approval.status === "approved" ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-3.5 w-3.5 text-green-500" }) : approval.status === "revised" ? /* @__PURE__ */ jsx(AlertCircle, { className: "h-3.5 w-3.5 text-blue-500" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-3.5 w-3.5 text-red-500" }),
                  /* @__PURE__ */ jsxs("span", { className: cn(
                    "whitespace-nowrap",
                    approval.status === "approved" ? "text-green-700 font-medium" : approval.status === "revised" ? "text-blue-700 font-medium" : "text-red-700 font-medium"
                  ), children: [
                    approval.status === "approved" ? "Disetujui" : approval.status === "revised" ? "Sudah Direvisi" : "Menunggu",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-normal text-muted-foreground", children: approval.approver?.name })
                  ] })
                ] }, approval.id)) }) }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxs(Badge, { className: cn("gap-1 w-fit", statusCfg.className), children: [
                  /* @__PURE__ */ jsx(StatusIcon, { className: "h-3 w-3" }),
                  statusCfg.label
                ] }) })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium font-mono text-sm", children: item.code }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: cn("uppercase", TYPE_COLORS[item.type] || ""), children: item.type }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: format(new Date(item.created_at), "dd MMM yyyy", { locale: id }) }),
                /* @__PURE__ */ jsx(TableCell, { children: item.user?.name ?? "-" }),
                /* @__PURE__ */ jsx(TableCell, { className: "max-w-[120px]", children: /* @__PURE__ */ jsx("span", { className: "truncate block font-medium", children: item.project?.division_name ?? "-" }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "max-w-[150px]", children: /* @__PURE__ */ jsx("span", { className: "truncate block", children: item.project?.name ?? "-" }) }),
                /* @__PURE__ */ jsxs(TableCell, { className: "font-medium", children: [
                  "Rp ",
                  parseFloat(item.amount).toLocaleString("id-ID")
                ] }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5", children: item.approvals && item.approvals.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-1 flex flex-col gap-1 inline-flex", children: [...item.approvals].sort((a, b) => {
                  const p = { head: 1, hr: 2, finance: 3, direktur: 4 };
                  return (p[a.role] || 99) - (p[b.role] || 99);
                }).map((approval) => /* @__PURE__ */ jsxs("div", { className: "text-xs flex items-center gap-1.5", children: [
                  approval.status === "approved" ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-3.5 w-3.5 text-green-500" }) : approval.status === "revised" ? /* @__PURE__ */ jsx(AlertCircle, { className: "h-3.5 w-3.5 text-blue-500" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-3.5 w-3.5 text-red-500" }),
                  /* @__PURE__ */ jsxs("span", { className: cn(
                    "whitespace-nowrap",
                    approval.status === "approved" ? "text-green-700 font-medium" : approval.status === "revised" ? "text-blue-700 font-medium" : "text-red-700 font-medium"
                  ), children: [
                    approval.status === "approved" ? "Disetujui" : approval.status === "revised" ? "Sudah Direvisi" : "Menunggu",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-normal text-muted-foreground", children: approval.approver?.name })
                  ] })
                ] }, approval.id)) }) }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxs(Badge, { className: cn("gap-1 w-fit", statusCfg.className), children: [
                  /* @__PURE__ */ jsx(StatusIcon, { className: "h-3 w-3" }),
                  statusCfg.label
                ] }) })
              ] }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "h-8 w-8 p-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" }),
                  /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
                ] }) }),
                /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                  /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/reimbursements/${item.id}`, className: "cursor-pointer", children: [
                    /* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4" }),
                    " Lihat Detail"
                  ] }) }),
                  item.status === "draft" && item.user?.id === auth.user.id && /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/reimbursements/${item.id}/edit`, className: "cursor-pointer", children: [
                    /* @__PURE__ */ jsx(FileText, { className: "mr-2 h-4 w-4" }),
                    " Edit Draft"
                  ] }) }),
                  item.type === "atr" && item.status === "approved" && /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/reimbursements/create/eer?atr_code=${item.code}`, className: "cursor-pointer", children: [
                    /* @__PURE__ */ jsx(Receipt, { className: "mr-2 h-4 w-4" }),
                    " Buat EER"
                  ] }) }),
                  (isSuperadmin || isFinance) && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                    /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer", onClick: () => handleDelete(item.id), children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                      " Hapus"
                    ] })
                  ] })
                ] })
              ] }) })
            ] }, item.id);
          }) })
        ] }) }) : /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-muted-foreground bg-muted/20 rounded-md border border-dashed flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gray-100 p-3 rounded-full", children: /* @__PURE__ */ jsx(Search, { className: "h-6 w-6 text-gray-400" }) }),
          /* @__PURE__ */ jsx("p", { children: "Tidak ada data pengajuan yang sesuai dengan filter." }),
          /* @__PURE__ */ jsx(Button, { variant: "link", onClick: () => router.get("/reimbursements"), className: "text-sidebar", children: "Reset Filter" })
        ] }) }),
        total > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground hidden flex-1 text-sm lg:flex", children: [
            "Menampilkan ",
            from,
            " sampai ",
            to,
            " dari ",
            total,
            " hasil"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center gap-8 lg:w-fit", children: [
            /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-2 lg:flex", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "rows-per-page", className: "text-sm font-medium", children: "Baris per halaman" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: `${filters.per_page}`,
                  onValueChange: (value) => navigate({ per_page: Number(value), page: 1 }),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "w-16 h-8 text-xs", id: "rows-per-page", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: filters.per_page }) }),
                    /* @__PURE__ */ jsx(SelectContent, { side: "top", children: [5, 10, 20, 30, 50].map((size) => /* @__PURE__ */ jsx(SelectItem, { value: `${size}`, children: size }, size)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex w-fit items-center justify-center text-sm font-medium", children: [
              "Halaman ",
              current_page,
              " dari ",
              last_page
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-2 lg:ml-0", children: [
              /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "hidden h-8 w-8 p-0 lg:flex", disabled: current_page === 1, onClick: () => navigate({ page: 1 }), children: [
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Go to first page" }),
                /* @__PURE__ */ jsx(ChevronsLeft, { className: "h-4 w-4" })
              ] }),
              /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "size-8", size: "icon", disabled: current_page === 1, onClick: () => navigate({ page: current_page - 1 }), children: [
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Go to previous page" }),
                /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
              ] }),
              /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "size-8", size: "icon", disabled: current_page === last_page, onClick: () => navigate({ page: current_page + 1 }), children: [
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Go to next page" }),
                /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
              ] }),
              /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "hidden size-8 lg:flex", size: "icon", disabled: current_page === last_page, onClick: () => navigate({ page: last_page }), children: [
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Go to last page" }),
                /* @__PURE__ */ jsx(ChevronsRight, { className: "h-4 w-4" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ReimbursementsIndex as default
};
