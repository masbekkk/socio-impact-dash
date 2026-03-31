import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default from "react";
import { A as AppSidebarLayout, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, e as DropdownMenuItem, d as DropdownMenuSeparator } from "./app-sidebar-layout-5JGZFayF.js";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { S as StatusBadge } from "./StatusBadge-Bj9jreC2.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { a as CardContent, C as Card, b as CardHeader, c as CardTitle } from "./card-DAjHeOuX.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { Plus, Search, Calendar, X, Building, MoreHorizontal, Eye, Pencil, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, FileText, CheckCircle2, ArrowUpDown, ArrowUp, ArrowDown, Cpu, BarChart3, Users, Globe, HeartHandshake, Layers } from "lucide-react";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { S as SearchableMultiSelect } from "./SearchableMultiSelect-BGlmeo1V.js";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { D as DateFilterPresets } from "./DateFilterPresets-BffSLq1i.js";
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
import "@radix-ui/react-label";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "./DatePicker-DAaV_rdH.js";
import "react-number-format";
function ProjectsIndex({ filters, divisions }) {
  const { auth } = usePage().props;
  const { hasPermission } = usePermission();
  auth.permissions || [];
  const canUpdateCode = hasPermission("create_code_project");
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Proyek", href: "/projects" }
  ];
  const [projects, setProjects] = React__default.useState([]);
  const [pagination, setPagination] = React__default.useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0
  });
  const [loading, setLoading] = React__default.useState(true);
  const [search, setSearch] = React__default.useState(filters?.search || "");
  const [startDate, setStartDate] = React__default.useState(filters?.start_date || "");
  const [endDate, setEndDate] = React__default.useState(filters?.end_date || "");
  const [status, setStatus] = React__default.useState(filters?.status || "all");
  const [division, setDivision] = React__default.useState(filters?.division || "all");
  const [perPage, setPerPage] = React__default.useState(10);
  const [currentPage, setCurrentPage] = React__default.useState(1);
  const [sortBy, setSortBy] = React__default.useState(filters?.sort_by || "created_at");
  const [sortDir, setSortDir] = React__default.useState(filters?.sort_dir || "desc");
  const [projectToDelete, setProjectToDelete] = React__default.useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React__default.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React__default.useState(false);
  const [toast, setToast] = React__default.useState({ show: false, message: "", type: "success" });
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/projects", {
        params: {
          search,
          status,
          division,
          start_date: startDate,
          end_date: endDate,
          per_page: perPage,
          page: currentPage,
          sort_by: sortBy,
          sort_dir: sortDir
        }
      });
      setProjects(response.data.data.data);
      setPagination({
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total,
        from: response.data.data.from,
        to: response.data.data.to,
        prev_page_url: response.data.data.prev_page_url,
        next_page_url: response.data.data.next_page_url,
        first_page_url: response.data.data.first_page_url,
        last_page_url: response.data.data.last_page_url
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };
  React__default.useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3e3);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);
  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };
  const executeDelete = async () => {
    if (!projectToDelete) return;
    try {
      await axios.delete(`/api/v1/projects/${projectToDelete.uuid}`);
      setToast({ show: true, message: "Proyek berhasil dihapus.", type: "success" });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      setToast({ show: true, message: "Gagal menghapus proyek.", type: "error" });
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };
  React__default.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, startDate, endDate, status, division, perPage, currentPage, sortBy, sortDir]);
  const handleSort = (column) => {
    const newDir = sortBy === column && sortDir === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortDir(newDir);
    setCurrentPage(1);
  };
  const SortIcon = ({ column }) => {
    if (sortBy !== column) return /* @__PURE__ */ jsx(ArrowUpDown, { className: "ml-1 h-3 w-3 opacity-40" });
    return sortDir === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "ml-1 h-3 w-3" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "ml-1 h-3 w-3" });
  };
  const handleFilterChange = (key, value) => {
    setDivision(value);
    setCurrentPage(1);
  };
  const renderPagination = () => {
    const { current_page, last_page } = pagination;
    const pages = [];
    const delta = 1;
    for (let i = 1; i <= last_page; i++) {
      if (i === 1 || i === last_page || i >= current_page - delta && i <= current_page + delta) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages.map((page, index) => /* @__PURE__ */ jsx(
      Button,
      {
        variant: page === current_page ? "default" : "outline",
        size: "icon",
        className: cn(
          "size-8 text-xs",
          page === "..." && "cursor-default hover:bg-transparent border-none shadow-none"
        ),
        onClick: () => typeof page === "number" && setCurrentPage(page),
        disabled: page === "...",
        children: page
      },
      index
    ));
  };
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Proyek" }),
    /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between px-8 py-6 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Proyek" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm md:text-base", children: "Kelola semua proyek, pantau progress dan budget." })
      ] }),
      /* @__PURE__ */ jsx(Link, { href: "/projects/create?type=active", children: /* @__PURE__ */ jsxs(Button, { className: "w-full sm:w-auto gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)] transition-transform hover:scale-105 active:scale-95 shadow-sm", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        "Proyek Baru"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mx-4 md:mx-8 mb-8 border-none rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4 px-4 md:px-8", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-normal hidden md:block", children: "Daftar Proyek" }),
        /* @__PURE__ */ jsxs("div", { className: "flex w-full md:w-auto items-center gap-2 flex-wrap md:flex-nowrap", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "search",
                placeholder: "Cari proyek...",
                className: "w-full pl-8",
                value: search,
                onChange: (e) => setSearch(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: cn(
                  "justify-start text-left font-normal w-[240px] px-3 border-dashed hidden md:flex",
                  !startDate && "text-muted-foreground",
                  (startDate || endDate) && "border-solid bg-emerald-50/50 border-emerald-200 text-emerald-700"
                ),
                children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4" }),
                  startDate ? endDate ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    format(new Date(startDate), "dd MMM yyyy", { locale: id }),
                    " -",
                    " ",
                    format(new Date(endDate), "dd MMM yyyy", { locale: id })
                  ] }) : format(new Date(startDate), "dd MMM yyyy", { locale: id }) : /* @__PURE__ */ jsx("span", { children: "Pilih Rentang Tanggal" }),
                  (startDate || endDate) && /* @__PURE__ */ jsx("div", { className: "ml-auto hover:bg-emerald-200 rounded-full p-0.5 transition-colors", role: "button", onClick: (e) => {
                    e.stopPropagation();
                    setStartDate("");
                    setEndDate("");
                  }, children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(DropdownMenuContent, { className: "w-auto p-0 bg-white", align: "start", children: /* @__PURE__ */ jsx(
              DateFilterPresets,
              {
                startDate,
                endDate,
                onSelect: (start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", className: cn("md:hidden", startDate || endDate ? "bg-accent text-accent-foreground border-primary" : ""), children: /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsx(DropdownMenuContent, { className: "w-auto p-0 bg-white", align: "end", children: /* @__PURE__ */ jsx(
              DateFilterPresets,
              {
                startDate,
                endDate,
                onSelect: (start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-none", children: /* @__PURE__ */ jsx(
            SearchableMultiSelect,
            {
              options: (divisions || []).map((div) => ({
                label: `${div.division_code?.code} - ${div.name}`,
                value: div.id.toString()
              })),
              value: division && division !== "all" ? division.split(",") : [],
              onValueChange: (val) => handleFilterChange("division", val.length > 0 ? val.join(",") : "all"),
              placeholder: "Semua Divisi",
              className: "w-40 sm:w-auto min-w-[160px]"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "px-4 md:px-8", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:hidden mb-6", children: projects.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground border rounded-md", children: "Belum ada proyek." }) : projects.map((p) => /* @__PURE__ */ jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: p.name }),
              p.client_name && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1", children: [
                /* @__PURE__ */ jsx(Building, { className: "h-3 w-3" }),
                p.client_name
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: p.code })
            ] }),
            /* @__PURE__ */ jsx(StatusBadge, { status: p.status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Divisi" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: p.division_name || (p.division ? p.division.name : "-") })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Nilai Kontrak" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium text-green-700", children: p.budget_total ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p.budget_total) : "-" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-2 border-t flex justify-end gap-2", children: /* @__PURE__ */ jsx(Link, { href: `/projects/${p.uuid}`, className: "w-full", children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", className: "w-full", children: "Lihat Detail" }) }) })
        ] }) }, p.id)) }),
        /* @__PURE__ */ jsx("div", { className: "rounded-md border hidden md:block", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50 hover:bg-muted/50", children: [
            /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("code"), children: [
              "Kode ",
              /* @__PURE__ */ jsx(SortIcon, { column: "code" })
            ] }) }),
            canUpdateCode && /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("initial_project"), children: [
              "Initial Project ",
              /* @__PURE__ */ jsx(SortIcon, { column: "initial_project" })
            ] }) }),
            /* @__PURE__ */ jsx(TableHead, { className: "min-w-[250px]", children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("name"), children: [
              "Nama Proyek ",
              /* @__PURE__ */ jsx(SortIcon, { column: "name" })
            ] }) }),
            /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("client_name"), children: [
              "Client ",
              /* @__PURE__ */ jsx(SortIcon, { column: "client_name" })
            ] }) }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[180px]", children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("division_id"), children: [
              "Divisi ",
              /* @__PURE__ */ jsx(SortIcon, { column: "division_id" })
            ] }) }),
            /* @__PURE__ */ jsx(TableHead, { children: "Created By" }),
            /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("status"), children: [
              "Status ",
              /* @__PURE__ */ jsx(SortIcon, { column: "status" })
            ] }) }),
            /* @__PURE__ */ jsx(TableHead, { children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium", onClick: () => handleSort("start_date"), children: [
              "Timeline ",
              /* @__PURE__ */ jsx(SortIcon, { column: "start_date" })
            ] }) }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: /* @__PURE__ */ jsxs("button", { className: "flex items-center font-medium justify-end w-full", onClick: () => handleSort("budget_total"), children: [
              "Nilai Kontrak ",
              /* @__PURE__ */ jsx(SortIcon, { column: "budget_total" })
            ] }) }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: projects.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: canUpdateCode ? 10 : 9, className: "h-24 text-center", children: "Belum ada proyek. Silakan tambah proyek baru." }) }) : projects.map((p) => /* @__PURE__ */ jsxs(TableRow, { className: "group", children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: p.code }),
            canUpdateCode && /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded inline-block", children: p.initial_project || "-" }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "font-medium", children: p.name }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground italic", children: p.client_name || "-" }) }),
            /* @__PURE__ */ jsx(TableCell, { children: (() => {
              const divName = (p.division_name || (p.division ? p.division.name : "")).toLowerCase();
              let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
              let Icon = Building;
              if (divName.includes("tech") || divName.includes("it") || divName.includes("dev")) {
                badgeStyle = "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
                Icon = Cpu;
              } else if (divName.includes("finance") || divName.includes("keuangan")) {
                badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
                Icon = BarChart3;
              } else if (divName.includes("hr") || divName.includes("human") || divName.includes("sdm")) {
                badgeStyle = "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
                Icon = Users;
              } else if (divName.includes("marketing") || divName.includes("sales") || divName.includes("cmo")) {
                badgeStyle = "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
                Icon = Globe;
              } else if (divName.includes("social") || divName.includes("sosial") || divName.includes("impact")) {
                badgeStyle = "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
                Icon = HeartHandshake;
              } else if (divName.includes("ops") || divName.includes("operasional")) {
                badgeStyle = "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
                Icon = Layers;
              }
              return /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `gap-1.5 py-1 px-2.5 font-medium ${badgeStyle}`, children: [
                /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }),
                p.division_name || (p.division ? p.division.name : "-")
              ] });
            })() }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: p.creator ? p.creator.name : "-" }) }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: p.status }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-sm text-muted-foreground", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs", children: p.start_date ? new Date(p.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "-" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400", children: "s/d" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs", children: p.end_date ? new Date(p.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-" })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right font-mono text-sm", children: p.budget_total ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(p.budget_total) : "-" }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: [
                /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" })
              ] }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Aksi" }),
                /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/projects/${p.uuid}`, className: "flex items-center cursor-pointer", children: [
                  /* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4 text-muted-foreground" }),
                  " Lihat Detail"
                ] }) }),
                /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/projects/${p.uuid}/edit`, className: "flex items-center cursor-pointer", children: [
                  /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4 text-muted-foreground" }),
                  " Edit Proyek"
                ] }) }),
                /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer",
                    onClick: () => confirmDelete(p),
                    children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                      " Hapus Proyek"
                    ]
                  }
                )
              ] })
            ] }) })
          ] }, p.id)) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-2 py-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground hidden flex-1 text-sm lg:flex", children: [
            "Menampilkan ",
            pagination.from || 0,
            " sampai ",
            pagination.to || 0,
            " dari ",
            pagination.total,
            " hasil"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center gap-8 lg:w-fit", children: [
            /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-2 lg:flex", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "rows-per-page", className: "text-sm font-medium", children: "Baris per halaman" }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: [10, 20, 30, 40, 50].map((s) => ({ label: s.toString(), value: s.toString() })),
                  value: `${pagination.per_page}`,
                  onValueChange: (value) => {
                    setPerPage(parseInt(value));
                    setCurrentPage(1);
                  },
                  className: "w-20 h-8",
                  placeholder: `${pagination.per_page}`
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex w-fit items-center justify-center text-sm font-medium gap-1", children: renderPagination() }),
            /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-1 lg:ml-0", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  className: "size-8",
                  disabled: pagination.current_page === 1,
                  onClick: () => setCurrentPage(1),
                  children: /* @__PURE__ */ jsx(ChevronsLeft, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  className: "size-8",
                  disabled: pagination.current_page === 1,
                  onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
                  children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  className: "size-8",
                  disabled: pagination.current_page === pagination.last_page,
                  onClick: () => setCurrentPage((prev) => Math.min(pagination.last_page, prev + 1)),
                  children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  className: "size-8",
                  disabled: pagination.current_page === pagination.last_page,
                  onClick: () => setCurrentPage(pagination.last_page),
                  children: /* @__PURE__ */ jsx(ChevronsRight, { className: "h-4 w-4" })
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: isDeleteDialogOpen, onOpenChange: setIsDeleteDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-destructive", children: "Hapus Proyek?" }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Apakah Anda yakin ingin menghapus proyek ",
          /* @__PURE__ */ jsx("strong", { children: projectToDelete?.name }),
          "? ",
          /* @__PURE__ */ jsx("br", {}),
          "Tindakan ini tidak dapat dibatalkan."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setIsDeleteDialogOpen(false), children: "Batal" }),
        /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: executeDelete, children: "Hapus Permanen" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isCreateDialogOpen, onOpenChange: setIsCreateDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Buat Proyek Baru" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Pilih jenis inisiasi proyek yang ingin Anda buat." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 py-4", children: [
        /* @__PURE__ */ jsx(Link, { href: "/projects/create?type=proposal", onClick: () => setIsCreateDialogOpen(false), children: /* @__PURE__ */ jsxs("div", { className: "cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-6 hover:border-black hover:bg-gray-50 transition-all text-center h-full flex flex-col items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-blue-100 rounded-full text-blue-600", children: /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm", children: "Proposal Project" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Pengajuan proposal." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Link, { href: "/projects/create?type=active", onClick: () => setIsCreateDialogOpen(false), children: /* @__PURE__ */ jsxs("div", { className: "cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-6 hover:border-black hover:bg-gray-50 transition-all text-center h-full flex flex-col items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-green-100 rounded-full text-green-600", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm", children: "Active Project" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Yang sudah (disetujui)" })
          ] })
        ] }) })
      ] })
    ] }) }),
    toast.show && /* @__PURE__ */ jsx("div", { className: "fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-white border border-gray-200 shadow-xl rounded-lg p-4 pr-10 min-w-[300px]", children: [
      toast.type === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5 text-green-600" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5 text-red-600" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm text-gray-900", children: toast.type === "success" ? "Sukses" : "Info" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: toast.message })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setToast({ ...toast, show: false }),
          className: "absolute top-2 right-2 text-gray-400 hover:text-gray-600",
          children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }) })
  ] });
}
export {
  ProjectsIndex as default
};
