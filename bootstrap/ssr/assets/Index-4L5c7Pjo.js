import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-DAjHeOuX.js";
import { Plus, Search, Loader2, Hash, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import axios from "axios";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
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
function LetterRequestsIndex({ canAssign }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [letterNumber, setLetterNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0
  });
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Nomor Surat", href: "/letter-requests" }
  ];
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/letter-requests", {
        params: {
          search: searchQuery,
          page: pagination.current_page,
          per_page: pagination.per_page
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
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, pagination.current_page, pagination.per_page]);
  const submitAssign = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setProcessing(true);
    setErrors({});
    try {
      await axios.post(`/api/v1/letter-requests/${selectedRequest.id}/assign`, {
        letter_number: letterNumber
      });
      setAssignDialogOpen(false);
      fetchRequests();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error assigning number:", error);
      }
    } finally {
      setProcessing(false);
    }
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
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
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
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-md border overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50", children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Tanggal" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Proyek" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Perihal & Tujuan" }),
              /* @__PURE__ */ jsx(TableHead, { children: "PIC / Ket" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Nomor Surat" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Aksi" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "h-24 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
              "Loading..."
            ] }) }) }) : requests.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "h-24 text-center", children: "Tidak ada data pengajuan." }) }) : requests.map((req) => /* @__PURE__ */ jsxs(TableRow, { children: [
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
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: `/letter-requests/${req.id}/edit`, children: "Edit" }) }) })
            ] }, req.id)) })
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
    /* @__PURE__ */ jsx(Dialog, { open: assignDialogOpen, onOpenChange: setAssignDialogOpen, children: /* @__PURE__ */ jsx(DialogContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: submitAssign, children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Berikan Nomor Surat" }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Masukkan nomor resmi untuk surat perihal: ",
          /* @__PURE__ */ jsx("strong", { children: selectedRequest?.subject })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "letter_number", children: "Nomor Surat" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "letter_number",
            placeholder: "Contoh: 001/SSI/II/2026",
            value: letterNumber,
            onChange: (e) => setLetterNumber(e.target.value)
          }
        ),
        errors.letter_number && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: errors.letter_number })
      ] }) }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", type: "button", onClick: () => setAssignDialogOpen(false), children: "Batal" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, className: "bg-[var(--sidebar)] text-white", children: processing ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Simpan Nomor" })
      ] })
    ] }) }) })
  ] });
}
export {
  LetterRequestsIndex as default
};
