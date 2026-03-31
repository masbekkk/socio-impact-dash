import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AppSidebarLayout, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, e as DropdownMenuItem } from "./app-sidebar-layout-5JGZFayF.js";
import { Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { C as Card, b as CardHeader, a as CardContent } from "./card-DAjHeOuX.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { Plus, Search, MoreHorizontal } from "lucide-react";
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
function Index() {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchDivisions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/divisions", {
        params: {
          search: searchQuery
        }
      });
      setDivisions(res.data.data.data);
    } catch (error) {
      toast.error("Gagal mengambil data divisi.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDivisions();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  const handleDelete = async (id) => {
    if (!confirm("Apakah anda yakin ingin menghapus divisi ini?")) return;
    try {
      await axios.delete(`/api/v1/divisions/${id}`);
      toast.success("Divisi berhasil dihapus.");
      fetchDivisions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus divisi.");
    }
  };
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Divisions", href: "/admin/divisions" }
  ];
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Division Management" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Divisions" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Manage your company divisions and departments." })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, className: "bg-[#1a5f4a] hover:bg-[#154d3c]", children: /* @__PURE__ */ jsxs(Link, { href: "/admin/divisions/create", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Add Division"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "p-4 border-b", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm flex items-center", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "search",
              placeholder: "Search divisions...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-8 w-full bg-white"
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50 hover:bg-muted/50", children: [
            /* @__PURE__ */ jsx(TableHead, { className: "w-[120px]", children: "Parent Code" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[150px]", children: "Parent Name" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[200px]", children: "Division Name" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Description" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[150px]", children: "Created At" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right w-[100px]", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "text-center py-8 text-muted-foreground", children: "Loading divisions..." }) }) : divisions.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "text-center py-8 text-muted-foreground", children: "No divisions found." }) }) : divisions.map((division) => /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-muted/50", children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium uppercase align-top pt-4", children: division.division_code?.code }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium align-top pt-4", children: division.division_code?.name }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium align-top pt-4", children: division.name }),
            /* @__PURE__ */ jsx(TableCell, { className: "py-4 align-top", children: /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: division.description || "-" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm align-top pt-4", children: new Date(division.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right align-top pt-4", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 hover:bg-muted", children: [
                /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" })
              ] }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: `/admin/divisions/${division.division_code?.id}/edit`, children: "Edit" }) }),
                /* @__PURE__ */ jsx(
                  DropdownMenuItem,
                  {
                    className: "text-destructive focus:text-destructive cursor-pointer",
                    onClick: () => handleDelete(division.division_code?.id),
                    children: "Delete"
                  }
                )
              ] })
            ] }) })
          ] }, division.id)) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
