import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-BRoV_jj3.js";
import { Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, f as CardFooter } from "./card-DAjHeOuX.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { S as SearchableMultiSelect } from "./SearchableMultiSelect-BGlmeo1V.js";
import { ArrowLeft, Save } from "lucide-react";
import { D as DatePicker } from "./DatePicker-DtmT1I-q.js";
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
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "./badge-Bu5jvMvW.js";
import "react-number-format";
function Create() {
  const [roles, setRoles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    position: "",
    nip: "",
    division_id: "",
    head_id: "",
    email: "",
    password: "",
    password_confirmation: "",
    roles: [],
    employee_type: "pegawai_tetap",
    contract_start: "",
    contract_end: ""
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    Promise.all([
      axios.get("/api/rbac/roles"),
      axios.get("/api/v1/divisions?per_page=100"),
      axios.get("/api/v1/users?role=head&per_page=100")
    ]).then(([rolesRes, divisionsRes, headsRes]) => {
      setRoles(rolesRes.data.data);
      const divisionsData = divisionsRes.data?.data?.data ?? divisionsRes.data?.data ?? [];
      const allDivisions = Array.isArray(divisionsData) ? divisionsData.map((d) => ({
        value: d.id.toString(),
        label: `${d.division_code?.code} - ${d.name}`
      })) : [];
      setDivisions(allDivisions);
      const headUsers = headsRes.data?.data?.data ?? headsRes.data?.data ?? [];
      setHeads(headUsers.map((u) => ({ value: u.id.toString(), label: u.name })));
    }).catch((err) => console.error(err));
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await axios.post("/api/v1/users", form);
      toast.success("User created successfully");
      router.visit("/admin/users");
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("Failed to create user");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleValueChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Users", href: "/admin/users" },
    { title: "Create", href: "/admin/users/create" }
  ];
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Create User" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6 max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/admin/users", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Create User" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Add a new team member and assign their role." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "User Details" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "name", children: [
                "Full Name ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "name",
                  value: form.name,
                  onChange: (e) => setForm({ ...form, name: e.target.value }),
                  placeholder: "John Doe",
                  required: true
                }
              ),
              errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.name[0] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "position", children: "Position" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "position",
                  value: form.position,
                  onChange: (e) => setForm({ ...form, position: e.target.value }),
                  placeholder: "e.g. Director, CID Officer"
                }
              ),
              errors.position && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.position[0] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "nip", children: "NIP" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "nip",
                  value: form.nip,
                  onChange: (e) => setForm({ ...form, nip: e.target.value }),
                  placeholder: "e.g. 19900101..."
                }
              ),
              errors.nip && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.nip[0] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "division_id", children: "Division" }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: divisions,
                  value: form.division_id,
                  onValueChange: (val) => setForm({ ...form, division_id: val }),
                  placeholder: "Select a division"
                }
              ),
              errors.division_id && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.division_id[0] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "email", children: [
                "Email ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  value: form.email,
                  onChange: (e) => setForm({ ...form, email: e.target.value }),
                  placeholder: "john@example.com",
                  required: true
                }
              ),
              errors.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.email[0] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "roles", children: [
                "Roles ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                SearchableMultiSelect,
                {
                  options: roles.map((r) => ({ value: r.name, label: r.name })),
                  value: form.roles,
                  onValueChange: (val) => setForm({ ...form, roles: val }),
                  placeholder: "Select roles"
                }
              ),
              errors.roles && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.roles[0] })
            ] }),
            !form.roles.some((r) => ["head", "superadmin", "direktur"].includes(r)) && form.roles.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "head_id", children: "Head (Atasan)" }),
              /* @__PURE__ */ jsx(
                SearchableSelect,
                {
                  options: heads,
                  value: form.head_id,
                  onValueChange: (val) => setForm({ ...form, head_id: val }),
                  placeholder: "Select head"
                }
              ),
              errors.head_id && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.head_id[0] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "employee_type", children: "Employee Type" }),
            /* @__PURE__ */ jsx(
              SearchableSelect,
              {
                options: [
                  { value: "pegawai_tetap", label: "Pegawai Tetap" },
                  { value: "kontrak", label: "Kontrak" },
                  { value: "intern", label: "Intern" }
                ],
                value: form.employee_type,
                onValueChange: (val) => setForm({ ...form, employee_type: val }),
                placeholder: "Select type"
              }
            )
          ] }) }),
          form.employee_type === "kontrak" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "contract_start", children: "Contract Start Date" }),
              /* @__PURE__ */ jsx(
                DatePicker,
                {
                  value: form.contract_start,
                  onChange: (v) => handleValueChange("contract_start", v)
                }
              ),
              errors.contract_start && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.contract_start[0] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "contract_end", children: "Contract End Date" }),
              /* @__PURE__ */ jsx(
                DatePicker,
                {
                  value: form.contract_end,
                  onChange: (v) => handleValueChange("contract_end", v)
                }
              ),
              errors.contract_end && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.contract_end[0] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "password", children: [
                "Password ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password",
                  type: "password",
                  value: form.password,
                  onChange: (e) => setForm({ ...form, password: e.target.value }),
                  required: true
                }
              ),
              errors.password && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.password[0] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "password_confirmation", children: [
                "Confirm Password ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password_confirmation",
                  type: "password",
                  value: form.password_confirmation,
                  onChange: (e) => setForm({ ...form, password_confirmation: e.target.value }),
                  required: true
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardFooter, { className: "flex justify-end border-t p-6", children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, className: "bg-[#1a5f4a] hover:bg-[#154d3c] gap-2", children: loading ? "Saving..." : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          " Save User"
        ] }) }) })
      ] }) })
    ] })
  ] });
}
export {
  Create as default
};
