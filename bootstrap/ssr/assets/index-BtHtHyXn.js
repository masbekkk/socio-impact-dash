import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { A as AppSidebarLayout, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, e as DropdownMenuItem } from "./app-sidebar-layout-BRoV_jj3.js";
import { Head } from "@inertiajs/react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { C as Card, b as CardHeader, a as CardContent } from "./card-DAjHeOuX.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DJ6z7AkN.js";
import { Target, Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
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
import "@radix-ui/react-select";
function KpiIndex() {
  const [kpis, setKpis] = useState([]);
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState(null);
  const [formData, setFormData] = useState({
    user_id: "",
    nominal: "",
    year: String((/* @__PURE__ */ new Date()).getFullYear())
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const fetchKpis = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (yearFilter !== "all") params.year = yearFilter;
      const res = await axios.get("/api/v1/user-kpis", { params });
      setKpis(res.data.data.data);
    } catch {
      toast.error("Gagal mengambil data KPI.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, yearFilter]);
  const fetchHeads = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/user-kpis/heads");
      setHeads(res.data.data);
    } catch {
      toast.error("Gagal mengambil daftar Head User.");
    }
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchKpis();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchKpis]);
  useEffect(() => {
    fetchHeads();
  }, [fetchHeads]);
  const handleOpenCreate = () => {
    if (heads.length === 0) {
      fetchHeads();
    }
    setEditingKpi(null);
    setFormData({
      user_id: "",
      nominal: "",
      year: String((/* @__PURE__ */ new Date()).getFullYear())
    });
    setFormError(null);
    setDialogOpen(true);
  };
  const handleOpenEdit = (kpi) => {
    setEditingKpi(kpi);
    setFormData({
      user_id: String(kpi.user_id),
      nominal: String(kpi.nominal),
      year: String(kpi.year)
    });
    setFormError(null);
    setDialogOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.user_id) {
      setFormError("User Head wajib dipilih.");
      return;
    }
    const nominalNum = parseFloat(formData.nominal);
    if (isNaN(nominalNum) || nominalNum < 0) {
      setFormError("Nominal KPI harus berupa angka valid (min. 0).");
      return;
    }
    const yearNum = parseInt(formData.year, 10);
    if (isNaN(yearNum) || yearNum < 2e3 || yearNum > 2100) {
      setFormError("Tahun tidak valid.");
      return;
    }
    setSubmitting(true);
    try {
      if (editingKpi) {
        await axios.put(`/api/v1/user-kpis/${editingKpi.id}`, {
          user_id: parseInt(formData.user_id, 10),
          nominal: nominalNum,
          year: yearNum
        });
        toast.success("KPI berhasil diperbarui.");
      } else {
        await axios.post("/api/v1/user-kpis", {
          user_id: parseInt(formData.user_id, 10),
          nominal: nominalNum,
          year: yearNum
        });
        toast.success("KPI berhasil ditambahkan.");
      }
      setDialogOpen(false);
      fetchKpis();
    } catch (err) {
      const msg = err.response?.data?.message || "Terjadi kesalahan saat menyimpan KPI.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data KPI ini?")) return;
    try {
      await axios.delete(`/api/v1/user-kpis/${id}`);
      toast.success("KPI berhasil dihapus.");
      fetchKpis();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus KPI.");
    }
  };
  const formatIDR = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "KPI Management", href: "/admin/kpis" }
  ];
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const availableYears = Array.from({ length: 7 }, (_, i) => currentYear - 2 + i);
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Manajemen KPI Head" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-tight flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Target, { className: "h-6 w-6 text-[#1a5f4a]" }),
            "Manajemen KPI Head"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Kelola nominal KPI tahunan untuk pengguna yang memiliki role Head." })
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleOpenCreate, className: "bg-[#1a5f4a] hover:bg-[#154d3c]", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Tambah KPI"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "p-4 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-80 flex items-center", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "search",
                placeholder: "Cari nama atau email...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-8 w-full bg-white"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground whitespace-nowrap", children: "Filter Tahun:" }),
            /* @__PURE__ */ jsxs(Select, { value: yearFilter, onValueChange: setYearFilter, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[140px] bg-white", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Semua Tahun" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Semua Tahun" }),
                availableYears.map((y) => /* @__PURE__ */ jsx(SelectItem, { value: String(y), children: y }, y))
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "p-4 sm:p-6", children: [
          /* @__PURE__ */ jsx("div", { className: "space-y-3 md:hidden", children: loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Memuat data KPI..." }) : kpis.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground border rounded-xl bg-gray-50", children: "Belum ada data KPI." }) : kpis.map((kpi) => /* @__PURE__ */ jsx(Card, { className: "border rounded-xl bg-white shadow-sm", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b pb-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900 text-sm", children: kpi.user?.name }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: kpi.user?.email })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-mono text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100", children: kpi.year })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Nominal KPI:" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-700", children: formatIDR(kpi.nominal) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-t pt-2 flex items-center justify-end gap-2", children: [
              /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleOpenEdit(kpi), children: [
                /* @__PURE__ */ jsx(Edit, { className: "h-3.5 w-3.5 mr-1" }),
                " Edit"
              ] }),
              /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "destructive", onClick: () => handleDelete(kpi.id), children: [
                /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5 mr-1" }),
                " Hapus"
              ] })
            ] })
          ] }) }, kpi.id)) }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:block rounded-md border overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50", children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Nama Head" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Email / Jabatan" }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-[120px] text-center", children: "Tahun" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Nominal KPI" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right w-[100px]", children: "Aksi" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "text-center py-8 text-muted-foreground", children: "Memuat data KPI..." }) }) : kpis.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "text-center py-8 text-muted-foreground", children: "Belum ada data KPI." }) }) : kpis.map((kpi) => /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-emerald-50/30 transition-colors", children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-semibold text-gray-900", children: kpi.user?.name || "-" }),
              /* @__PURE__ */ jsxs(TableCell, { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm", children: kpi.user?.email }),
                kpi.user?.position && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: kpi.user.position })
              ] }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200", children: kpi.year }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right font-bold text-emerald-700 text-base", children: formatIDR(kpi.nominal) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4 text-muted-foreground" }) }) }),
                /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleOpenEdit(kpi), children: [
                    /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4 mr-2" }),
                    " Edit"
                  ] }),
                  /* @__PURE__ */ jsxs(
                    DropdownMenuItem,
                    {
                      className: "text-destructive focus:text-destructive cursor-pointer",
                      onClick: () => handleDelete(kpi.id),
                      children: [
                        /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-2" }),
                        " Hapus"
                      ]
                    }
                  )
                ] })
              ] }) })
            ] }, kpi.id)) })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[480px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Target, { className: "h-5 w-5 text-[#1a5f4a]" }),
          editingKpi ? "Edit Nominal KPI" : "Tambah Nominal KPI"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Tentukan nominal KPI tahunan untuk pengguna yang ber-role Head." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
        formError && /* @__PURE__ */ jsx("div", { className: "bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 font-medium", children: formError }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "user_id", children: "Pilih User Head" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: formData.user_id,
              onValueChange: (val) => setFormData((prev) => ({ ...prev, user_id: val })),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { id: "user_id", className: "bg-white", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih User Head..." }) }),
                /* @__PURE__ */ jsx(SelectContent, { className: "max-h-60 overflow-y-auto", children: heads.length === 0 ? /* @__PURE__ */ jsx(SelectItem, { value: "_empty", disabled: true, children: "Memuat / Tidak ada User Head" }) : heads.map((h) => /* @__PURE__ */ jsxs(SelectItem, { value: String(h.id), children: [
                  h.name,
                  " (",
                  h.email,
                  ")"
                ] }, h.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "year", children: "Tahun" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: formData.year,
              onValueChange: (val) => setFormData((prev) => ({ ...prev, year: val })),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { id: "year", className: "bg-white", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih Tahun" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: availableYears.map((y) => /* @__PURE__ */ jsx(SelectItem, { value: String(y), children: y }, y)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "nominal", children: "Nominal KPI (Rp)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "nominal",
              type: "number",
              min: "0",
              placeholder: "Contoh: 1000000000",
              value: formData.nominal,
              onChange: (e) => setFormData((prev) => ({ ...prev, nominal: e.target.value }))
            }
          ),
          formData.nominal && !isNaN(parseFloat(formData.nominal)) && /* @__PURE__ */ jsxs("p", { className: "text-xs text-emerald-700 font-medium pt-0.5", children: [
            "Preview: ",
            formatIDR(parseFloat(formData.nominal))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { className: "pt-4", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setDialogOpen(false), disabled: submitting, children: "Batal" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "bg-[#1a5f4a] hover:bg-[#154d3c]", disabled: submitting, children: submitting ? "Menyimpan..." : editingKpi ? "Simpan Perubahan" : "Tambah KPI" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  KpiIndex as default
};
