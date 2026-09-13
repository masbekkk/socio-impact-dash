import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { A as AppSidebarLayout, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, e as DropdownMenuItem, d as DropdownMenuSeparator } from "./app-sidebar-layout-BRoV_jj3.js";
import { Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-DAjHeOuX.js";
import { Plus, Search, CalendarRange, XCircle, Loader2, MoreHorizontal, Info, Edit3, RefreshCcw, Trash2, Hash, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Calendar, Building2, User, FileText, History, Clock, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import axios from "axios";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { D as DatePicker } from "./DatePicker-DtmT1I-q.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "./use-permission-D0a8sZAO.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "react-number-format";
const STORAGE_KEY = "letter_requests_filters";
function LetterRequestsIndex({ canDelete }) {
  const initialFilters = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
    }
    return {
      searchQuery: "",
      dateFrom: "",
      dateTo: "",
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0
      }
    };
  })();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRequest, setDetailRequest] = useState(null);
  const handleDetailClick = async (req) => {
    setDetailRequest(req);
    setDetailDialogOpen(true);
    setDetailLoading(true);
    try {
      const response = await axios.get(`/api/v1/letter-requests/${req.id}`);
      setDetailRequest(response.data.data);
    } catch (error) {
      console.error("Error fetching detail letter request:", error);
    } finally {
      setDetailLoading(false);
    }
  };
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom);
  const [dateTo, setDateTo] = useState(initialFilters.dateTo);
  const [pagination, setPagination] = useState(initialFilters.pagination);
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Nomor Surat", href: "/letter-requests" }
  ];
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/letter-requests", {
        params: {
          search: searchQuery,
          page: pagination.current_page,
          per_page: pagination.per_page,
          date_from: dateFrom || void 0,
          date_to: dateTo || void 0
        }
      });
      setRequests(response.data.data.data);
      setPagination({
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total,
        from: response.data.data.from,
        to: response.data.data.to
      });
    } catch (error) {
      console.error("Error fetching letter requests:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, pagination.current_page, pagination.per_page, dateFrom, dateTo]);
  useEffect(() => {
    const filtersToSave = {
      searchQuery,
      dateFrom,
      dateTo,
      pagination: { ...pagination, total: 0, from: 0, to: 0, last_page: 1 }
      // save layout only
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtersToSave));
    const timer = setTimeout(() => {
      fetchRequests();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchRequests, searchQuery, dateFrom, dateTo, pagination.current_page, pagination.per_page]);
  const handleDeleteClick = (req) => {
    setSelectedRequest(req);
    setDeleteDialogOpen(true);
  };
  const submitDelete = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.delete(`/api/v1/letter-requests/${selectedRequest.id}`);
      setDeleteDialogOpen(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error("Error deleting letter request:", error);
      alert("Gagal menghapus nomor surat.");
    } finally {
      setProcessing(false);
    }
  };
  const handleStatusChange = async (req) => {
    const newStatus = req.status === "used" ? "unused" : "used";
    try {
      await axios.patch(`/api/v1/letter-requests/${req.id}/status`, { status: newStatus });
      fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal memperbarui status.");
    }
  };
  const clearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Nomor Surat" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Nomor Surat" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Kelola permohonan nomor surat resmi untuk proyek." })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, className: "gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)]", children: /* @__PURE__ */ jsxs(Link, { href: "/letter-requests/create", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Buat Nomor Surat"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "Daftar Pengajuan" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Menampilkan semua riwayat pengajuan nomor surat." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-72", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "search",
                  placeholder: "Cari perihal, tujuan, proyek...",
                  className: "pl-9 h-10 w-full",
                  value: searchQuery,
                  onChange: (e) => {
                    setSearchQuery(e.target.value);
                    setPagination((prev) => ({ ...prev, current_page: 1 }));
                  }
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-end gap-3 pt-3 border-t mt-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-sm font-medium text-muted-foreground", children: [
              /* @__PURE__ */ jsx(CalendarRange, { className: "h-4 w-4" }),
              "Filter Tanggal"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground whitespace-nowrap", children: "Dari" }),
                /* @__PURE__ */ jsx(
                  DatePicker,
                  {
                    value: dateFrom,
                    onChange: (v) => {
                      setDateFrom(v);
                      setPagination((prev) => ({ ...prev, current_page: 1 }));
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground whitespace-nowrap", children: "Sampai" }),
                /* @__PURE__ */ jsx(
                  DatePicker,
                  {
                    value: dateTo,
                    onChange: (v) => {
                      setDateTo(v);
                      setPagination((prev) => ({ ...prev, current_page: 1 }));
                    }
                  }
                )
              ] }),
              (dateFrom || dateTo) && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: clearDateFilter, className: "text-xs h-8", children: [
                /* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3 mr-1" }),
                "Reset"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "space-y-3 md:hidden", children: loading ? /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center py-8 text-muted-foreground gap-2", children: [
            /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
            "Loading..."
          ] }) : requests.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground border rounded-xl bg-gray-50", children: "Tidak ada data pengajuan." }) : requests.map((req) => /* @__PURE__ */ jsx(
            Card,
            {
              className: "cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all active:scale-[0.99] border rounded-xl overflow-hidden bg-white",
              onClick: () => handleDetailClick(req),
              children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 border-b pb-2.5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-xs text-blue-600 uppercase tracking-wider block", children: req.project?.code || "-" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: req.project?.name || "-" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "shrink-0", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }) }) }),
                    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-[160px]", children: [
                      /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Aksi" }),
                      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleDetailClick(req), className: "cursor-pointer", children: [
                        /* @__PURE__ */ jsx(Info, { className: "mr-2 h-4 w-4" }),
                        "Lihat Detail"
                      ] }),
                      /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/letter-requests/${req.id}/edit`, className: "cursor-pointer", children: [
                        /* @__PURE__ */ jsx(Edit3, { className: "mr-2 h-4 w-4" }),
                        "Edit"
                      ] }) }),
                      canDelete && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                        /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleStatusChange(req), children: [
                          /* @__PURE__ */ jsx(RefreshCcw, { className: "mr-2 h-4 w-4" }),
                          "Ubah Status"
                        ] }),
                        /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleDeleteClick(req), className: "text-destructive focus:text-destructive", children: [
                          /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                          "Hapus"
                        ] })
                      ] })
                    ] })
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-sm text-gray-900 line-clamp-2", children: req.subject }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Ke: ",
                    req.recipient
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-gray-50/70 p-2.5 rounded-lg flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 font-mono", children: req.letter_number ? /* @__PURE__ */ jsxs("span", { className: "bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-bold flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Hash, { className: "h-3 w-3" }),
                    " ",
                    req.letter_number
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground italic", children: "Belum ada nomor" }) }),
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: format(new Date(req.letter_date), "dd MMM yyyy", { locale: id }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t pt-2.5 text-xs", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground truncate", children: [
                    "PIC: ",
                    req.pic?.name || "-"
                  ] }),
                  /* @__PURE__ */ jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: req.status === "used" ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/60 font-medium" : "bg-amber-50/80 text-amber-700 border-amber-200/60 font-medium",
                      children: req.status === "used" ? "Terpakai" : "Tidak Terpakai"
                    }
                  )
                ] })
              ] })
            },
            req.id
          )) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block rounded-md border overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50", children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Tanggal" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Proyek" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Perihal & Tujuan" }),
              /* @__PURE__ */ jsx(TableHead, { children: "PIC / Ket" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Nomor Surat" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Aksi" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "h-24 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
              "Loading..."
            ] }) }) }) : requests.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "h-24 text-center", children: "Tidak ada data pengajuan." }) }) : requests.map((req) => /* @__PURE__ */ jsxs(
              TableRow,
              {
                className: "cursor-pointer hover:bg-emerald-50/40 transition-colors",
                onClick: () => handleDetailClick(req),
                children: [
                  /* @__PURE__ */ jsx(TableCell, { className: "font-medium whitespace-nowrap", children: format(new Date(req.letter_date), "dd MMM yyyy", { locale: id }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-xs text-blue-600 uppercase tracking-wider", children: req.project?.code || "-" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm truncate max-w-[150px]", children: req.project?.name || "-" })
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: req.subject }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "Ke: ",
                      req.recipient
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap", children: req.pic?.name || "-" }),
                    req.keterangan && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground italic truncate max-w-[150px]", children: req.keterangan })
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: req.letter_number ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 w-fit whitespace-nowrap", children: [
                    /* @__PURE__ */ jsx(Hash, { className: "h-3 w-3" }),
                    req.letter_number
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs italic", children: "Belum diberikan" }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: req.status === "used" ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/60 font-medium" : "bg-amber-50/80 text-amber-700 border-amber-200/60 font-medium",
                      children: req.status === "used" ? "Terpakai" : "Tidak Terpakai"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(TableCell, { className: "text-right", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "h-8 w-8 p-0", children: [
                      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Buka menu" }),
                      /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
                    ] }) }),
                    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-[160px]", children: [
                      /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Aksi" }),
                      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleDetailClick(req), className: "cursor-pointer", children: [
                        /* @__PURE__ */ jsx(Info, { className: "mr-2 h-4 w-4" }),
                        "Lihat Detail"
                      ] }),
                      /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/letter-requests/${req.id}/edit`, className: "cursor-pointer", children: [
                        /* @__PURE__ */ jsx(Edit3, { className: "mr-2 h-4 w-4" }),
                        "Edit"
                      ] }) }),
                      canDelete && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                        /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleStatusChange(req), children: [
                          /* @__PURE__ */ jsx(RefreshCcw, { className: "mr-2 h-4 w-4" }),
                          "Ubah Status"
                        ] }),
                        /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleDeleteClick(req), className: "text-destructive focus:text-destructive", children: [
                          /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                          "Hapus"
                        ] })
                      ] })
                    ] })
                  ] }) })
                ]
              },
              req.id
            )) })
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
                    onValueChange: (v) => {
                      setPagination((prev) => ({ ...prev, per_page: Number(v), current_page: 1 }));
                    },
                    className: "w-20 h-8 text-xs",
                    placeholder: `${pagination.per_page}`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex w-fit items-center justify-center text-sm font-medium", children: [
                "Halaman ",
                pagination.current_page,
                " dari ",
                pagination.last_page
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-2 lg:ml-0", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    className: "hidden h-8 w-8 p-0 lg:flex",
                    disabled: pagination.current_page === 1,
                    onClick: () => setPagination((prev) => ({ ...prev, current_page: 1 })),
                    children: /* @__PURE__ */ jsx(ChevronsLeft, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    className: "size-8",
                    size: "icon",
                    disabled: pagination.current_page === 1,
                    onClick: () => setPagination((prev) => ({ ...prev, current_page: Math.max(1, prev.current_page - 1) })),
                    children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    className: "size-8",
                    size: "icon",
                    disabled: pagination.current_page === pagination.last_page,
                    onClick: () => setPagination((prev) => ({ ...prev, current_page: Math.min(pagination.last_page, prev.current_page + 1) })),
                    children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    className: "hidden size-8 lg:flex",
                    size: "icon",
                    disabled: pagination.current_page === pagination.last_page,
                    onClick: () => setPagination((prev) => ({ ...prev, current_page: pagination.last_page })),
                    children: /* @__PURE__ */ jsx(ChevronsRight, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Hapus Nomor Surat" }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Apakah Anda yakin ingin menghapus pengajuan nomor surat ini?",
          selectedRequest && /* @__PURE__ */ jsxs("span", { className: "block mt-2 font-medium text-foreground", children: [
            selectedRequest.subject,
            selectedRequest.letter_number && /* @__PURE__ */ jsxs("span", { className: "block text-sm text-muted-foreground font-normal mt-1", children: [
              "Nomor: ",
              selectedRequest.letter_number
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", type: "button", onClick: () => setDeleteDialogOpen(false), children: "Batal" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "destructive",
            disabled: processing,
            onClick: submitDelete,
            children: [
              processing ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-2" }),
              "Hapus"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: detailDialogOpen, onOpenChange: setDetailDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { className: "p-6 pb-4 border-b bg-gray-50/50", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(DialogTitle, { className: "text-lg font-bold flex items-center gap-2", children: "Detail Nomor Surat" }),
          /* @__PURE__ */ jsx(DialogDescription, { className: "text-xs mt-1", children: "Informasi lengkap pengajuan dan riwayat audit perubahan." })
        ] }),
        detailRequest && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-3 flex-wrap", children: [
          detailRequest.letter_number ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 font-mono text-sm font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-md border border-blue-200", children: [
            /* @__PURE__ */ jsx(Hash, { className: "h-4 w-4" }),
            detailRequest.letter_number
          ] }) : /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs text-muted-foreground italic", children: "Belum diberikan nomor" }),
          /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "outline",
              className: detailRequest.status === "used" ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium" : "bg-amber-50 text-amber-700 border-amber-200 font-medium",
              children: detailRequest.status === "used" ? "Terpakai" : "Tidak Terpakai"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 overflow-y-auto space-y-6 flex-1 text-sm", children: detailRequest ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-4 rounded-xl border", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground font-medium flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5" }),
              "Tanggal Surat"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 mt-0.5", children: format(new Date(detailRequest.letter_date), "dd MMMM yyyy", { locale: id }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground font-medium flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Building2, { className: "h-3.5 w-3.5" }),
              "Proyek"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "font-semibold text-gray-900 mt-0.5", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-blue-600 font-mono mr-1 text-xs", children: [
                "[",
                detailRequest.project?.code,
                "]"
              ] }),
              detailRequest.project?.name
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground font-medium flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5" }),
              "Kepada / Penerima"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 mt-0.5", children: detailRequest.recipient })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground font-medium flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5" }),
              "PIC Surat"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 mt-0.5", children: detailRequest.pic?.name || "-" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground font-medium flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }),
              "Perihal"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 mt-0.5", children: detailRequest.subject })
          ] }),
          detailRequest.keterangan && /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Keterangan:" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-700 italic mt-0.5 bg-white p-2 rounded border", children: detailRequest.keterangan })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b pb-2", children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-gray-900 flex items-center gap-1.5 text-sm", children: [
              /* @__PURE__ */ jsx(History, { className: "h-4 w-4 text-muted-foreground" }),
              "Riwayat Perubahan"
            ] }),
            detailRequest.logs && detailRequest.logs.length > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-[11px] font-normal", children: [
              detailRequest.logs.length,
              " catatan"
            ] })
          ] }),
          detailLoading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-8 text-muted-foreground gap-2", children: [
            /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
            /* @__PURE__ */ jsx("span", { children: "Memuat riwayat perubahan..." })
          ] }) : detailRequest.logs && detailRequest.logs.length > 0 ? /* @__PURE__ */ jsx("div", { className: "relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted", children: detailRequest.logs.map((log) => {
            const isCreated = log.action === "created";
            const isStatus = log.action === "status_changed";
            const dotColor = isCreated ? "bg-emerald-500" : isStatus ? "bg-blue-500" : "bg-amber-500";
            const actionBadge = isCreated ? "Dibuat" : isStatus ? "Status Diubah" : "Diedit";
            return /* @__PURE__ */ jsxs("div", { className: "relative text-xs", children: [
              /* @__PURE__ */ jsx("div", { className: `absolute -left-6 top-1.5 h-2.5 w-2.5 rounded-full ${dotColor} ring-4 ring-white` }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white border rounded-lg p-3 space-y-2 shadow-xs", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxs("span", { className: "font-semibold text-gray-900 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                      log.user?.name || "Sistem"
                    ] }),
                    /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] px-1.5 py-0", children: actionBadge })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground flex items-center gap-1 text-[11px]", children: [
                    /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                    format(new Date(log.created_at), "dd MMM yyyy, HH:mm", { locale: id }),
                    " WIB"
                  ] })
                ] }),
                log.reason && /* @__PURE__ */ jsxs("div", { className: "bg-amber-50/70 border border-amber-200/70 rounded p-2 text-amber-900 flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(MessageSquare, { className: "h-3.5 w-3.5 mt-0.5 text-amber-600 shrink-0" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-[11px] block text-amber-800", children: "Alasan Perubahan:" }),
                    /* @__PURE__ */ jsx("p", { className: "italic text-xs mt-0.5", children: log.reason })
                  ] })
                ] }),
                log.note && /* @__PURE__ */ jsx("p", { className: "text-gray-700 leading-relaxed font-medium bg-gray-50/70 p-2 rounded border border-gray-100", children: log.note })
              ] })
            ] }, log.id);
          }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-gray-50/50 space-y-1", children: [
            /* @__PURE__ */ jsx(History, { className: "h-5 w-5 mx-auto text-muted-foreground opacity-50" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "Belum ada riwayat perubahan tercatat." }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Semua perubahan nomor surat ke depan akan otomatis terekam di sini." })
          ] })
        ] })
      ] }) : null }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "p-4 border-t bg-gray-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", type: "button", onClick: () => setDetailDialogOpen(false), children: "Tutup" }),
        detailRequest && /* @__PURE__ */ jsx(Button, { asChild: true, className: "bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)]/90 gap-1.5", children: /* @__PURE__ */ jsxs(Link, { href: `/letter-requests/${detailRequest.id}/edit`, children: [
          /* @__PURE__ */ jsx(Edit3, { className: "h-4 w-4" }),
          "Edit Nomor Surat"
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  LetterRequestsIndex as default
};
