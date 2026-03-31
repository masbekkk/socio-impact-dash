import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AppSidebarLayout, g as Avatar, h as AvatarFallback, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, e as DropdownMenuItem } from "./app-sidebar-layout-5JGZFayF.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { C as Card, b as CardHeader, a as CardContent } from "./card-DAjHeOuX.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { Plus, Search, Filter, MoreHorizontal, UserCheck, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { L as Label } from "./label-7wn1ZQI4.js";
import { D as DatePicker } from "./DatePicker-DAaV_rdH.js";
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
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "@radix-ui/react-label";
import "react-number-format";
function Index() {
  const { auth } = usePage().props;
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [positionFilter, setPositionFilter] = useState("");
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState("all");
  const [joinedFrom, setJoinedFrom] = useState("");
  const [joinedTo, setJoinedTo] = useState("");
  const [contractFrom, setContractFrom] = useState("");
  const [contractTo, setContractTo] = useState("");
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/users", {
        params: {
          search: searchQuery,
          role: roleFilter !== "all" ? roleFilter : "",
          position: positionFilter,
          employee_type: employeeTypeFilter !== "all" ? employeeTypeFilter : "",
          joined_from: joinedFrom,
          joined_to: joinedTo,
          contract_from: contractFrom,
          contract_to: contractTo,
          page,
          per_page: perPage
        }
      });
      setUsers(res.data.data.data);
      setMeta(res.data.data.meta);
    } catch (error) {
      toast.error("Gagal mengambil data user.");
    } finally {
      setLoading(false);
    }
  };
  const fetchRoles = async () => {
    try {
      const res = await axios.get("/api/rbac/roles");
      setRoles(res.data.data);
    } catch (error) {
      console.error("Failed to fetch roles", error);
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);
  useEffect(() => {
    setPage(1);
  }, [searchQuery, roleFilter, positionFilter, employeeTypeFilter, joinedFrom, joinedTo, contractFrom, contractTo]);
  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter, positionFilter, employeeTypeFilter, joinedFrom, joinedTo, contractFrom, contractTo, page, perPage]);
  const handleDelete = async (id) => {
    if (!confirm("Apakah anda yakin ingin menghapus user ini?")) return;
    try {
      await axios.delete(`/api/v1/users/${id}`);
      toast.success("User berhasil dihapus.");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus user.");
    }
  };
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Users", href: "/admin/users" }
  ];
  const getRoleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case "superadmin":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
      case "head":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      case "finance":
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
    }
  };
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "User Management" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Users" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Manage your team members and their roles." })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, className: "bg-[#1a5f4a] hover:bg-[#154d3c]", children: /* @__PURE__ */ jsxs(Link, { href: "/admin/users/create", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Add User"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "p-4 border-b space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:max-w-sm", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "search",
                  placeholder: "Search users...",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "pl-8 w-full bg-white"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: showFilters ? "secondary" : "outline",
                size: "sm",
                onClick: () => setShowFilters(!showFilters),
                className: "w-full sm:w-auto gap-2",
                children: [
                  /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }),
                  "Advanced Filters"
                ]
              }
            )
          ] }),
          showFilters && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Role" }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: [
                    { label: "All Roles", value: "all" },
                    ...roles.map((r) => ({ label: r.name, value: r.name }))
                  ],
                  value: roleFilter || "all",
                  onValueChange: setRoleFilter,
                  placeholder: "All Roles",
                  className: "bg-white"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Position" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Filter by position...",
                  value: positionFilter,
                  onChange: (e) => setPositionFilter(e.target.value),
                  className: "bg-white"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Employment Type" }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: [
                    { label: "All Types", value: "all" },
                    { label: "Pegawai Tetap", value: "pegawai_tetap" },
                    { label: "Kontrak", value: "kontrak" },
                    { label: "Intern", value: "intern" }
                  ],
                  value: employeeTypeFilter,
                  onValueChange: setEmployeeTypeFilter,
                  placeholder: "All Types",
                  className: "bg-white"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Joined From" }),
              /* @__PURE__ */ jsx(DatePicker, { value: joinedFrom, onChange: setJoinedFrom })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Joined To" }),
              /* @__PURE__ */ jsx(DatePicker, { value: joinedTo, onChange: setJoinedTo })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Contract From" }),
              /* @__PURE__ */ jsx(DatePicker, { value: contractFrom, onChange: setContractFrom })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Contract To" }),
              /* @__PURE__ */ jsx(DatePicker, { value: contractTo, onChange: setContractTo })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50 hover:bg-muted/50", children: [
              /* @__PURE__ */ jsx(TableHead, { className: "w-[300px]", children: "User" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Role" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Position" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Divisi" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Head / Team" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Employment" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Joined" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "text-center py-8 text-muted-foreground", children: "Loading users..." }) }) : users.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 7, className: "text-center py-8 text-muted-foreground", children: "No users found." }) }) : users.map((user) => /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-muted/5", children: [
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(Avatar, { className: "h-9 w-9 border", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-[#1a5f4a]/10 text-[#1a5f4a]", children: user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: user.name }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: user.email }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: user.nip })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex gap-1 flex-wrap", children: user.roles && user.roles.length > 0 ? user.roles.map((r) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `capitalize font-normal ${getRoleBadgeColor(r)}`, children: r }, r)) : /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground italic", children: "No Role" }) }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: user.position || "-" }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: user.division ? user.division.division_code.code + " - " + user.division.name : "-" }) }),
              /* @__PURE__ */ jsx(TableCell, { children: user.head ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Atasan:" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: user.head.name })
              ] }) : user.team_members_count && user.team_members_count > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Team: " }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
                  user.team_members_count,
                  " anggota"
                ] })
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "-" }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium capitalize", children: (user.employee_type || "-").replace("_", " ") }),
                user.contract_start && user.contract_end && /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  new Date(user.contract_start).toLocaleDateString("id-ID"),
                  " - ",
                  new Date(user.contract_end).toLocaleDateString("id-ID")
                ] })
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-sm", children: new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 hover:bg-muted", children: [
                  /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" })
                ] }) }),
                /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                  /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: `/admin/users/${user.id}/edit`, children: "Edit" }) }),
                  auth.user.role_name.includes("superadmin") && auth.user.id !== user.id && /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(
                    Link,
                    {
                      href: route("admin.users.impersonate", user.id),
                      method: "post",
                      as: "button",
                      className: "w-full text-left",
                      children: [
                        /* @__PURE__ */ jsx(UserCheck, { className: "mr-2 h-4 w-4" }),
                        "Impersonate"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsx(
                    DropdownMenuItem,
                    {
                      className: "text-destructive focus:text-destructive cursor-pointer",
                      onClick: () => handleDelete(user.id),
                      children: "Delete"
                    }
                  )
                ] })
              ] }) })
            ] }, user.id)) })
          ] }),
          !loading && meta && meta.total > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-4 border-t", children: [
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
      ] })
    ] })
  ] });
}
export {
  Index as default
};
