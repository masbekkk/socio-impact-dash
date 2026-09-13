import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-BRoV_jj3.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, f as CardFooter } from "./card-DAjHeOuX.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { Loader2, ChevronLeft, Plus, Trash2 } from "lucide-react";
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
function Edit({ divisionId }) {
  const [loading, setLoading] = useState(true);
  const { data, setData, processing, errors, reset } = useForm({
    code: "",
    name: "",
    names: [{ name: "", description: "" }]
  });
  useEffect(() => {
    const fetchDivision = async () => {
      try {
        const res = await axios.get(`/api/v1/divisions/${divisionId}`);
        const division = res.data.data;
        setData({
          code: division.code,
          name: division.name,
          names: division.names && division.names.length > 0 ? division.names.map((n) => ({
            name: n.name,
            description: n.description || ""
          })) : [{ name: "", description: "" }]
        });
      } catch (error) {
        toast.error("Gagal mengambil data divisi.");
        window.location.href = "/admin/divisions";
      } finally {
        setLoading(false);
      }
    };
    fetchDivision();
  }, [divisionId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/v1/divisions/${divisionId}`, data);
      toast.success("Divisi berhasil diperbarui.");
      window.location.href = "/admin/divisions";
    } catch (error) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        Object.keys(validationErrors).forEach((key) => {
          toast.error(validationErrors[key][0]);
        });
      } else {
        toast.error(error.response?.data?.message || "Gagal memperbarui divisi.");
      }
    }
  };
  const addName = () => {
    setData("names", [...data.names, { name: "", description: "" }]);
  };
  const removeName = (index) => {
    const newNames = [...data.names];
    newNames.splice(index, 1);
    setData("names", newNames);
  };
  const updateName = (index, field, value) => {
    const newNames = [...data.names];
    newNames[index][field] = value;
    setData("names", newNames);
  };
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Divisions", href: "/admin/divisions" },
    { title: "Edit", href: `/admin/divisions/${divisionId}/edit` }
  ];
  if (loading) {
    return /* @__PURE__ */ jsx(AppSidebarLayout, { breadcrumbs, children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) });
  }
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Division" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/admin/divisions", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Edit Division" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Update division details." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Division Details" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "code", children: [
                "Code ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "code",
                  placeholder: "e.g. FIN, HR, ENG",
                  value: data.code,
                  onChange: (e) => setData("code", e.target.value),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Unique identifier (abbreviation)." }),
              errors.code && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.code })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "name", children: [
                "Name ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "name",
                  placeholder: "e.g. Finance, Human Resources",
                  value: data.name,
                  onChange: (e) => setData("name", e.target.value),
                  required: true
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "The full name of the division." }),
              errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.name })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs(Label, { children: [
                "Division Names ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: addName, children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
                "Add Name"
              ] })
            ] }),
            data.names.map((nameEntry, index) => /* @__PURE__ */ jsx(Card, { className: "p-4 border border-border", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
                  /* @__PURE__ */ jsxs(Label, { children: [
                    "Name ",
                    /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      placeholder: "e.g. Finance, Human Resources",
                      value: nameEntry.name,
                      onChange: (e) => updateName(index, "name", e.target.value),
                      required: true
                    }
                  )
                ] }),
                data.names.length > 1 && /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "mt-6 text-red-500 hover:text-red-700 hover:bg-red-50",
                    onClick: () => removeName(index),
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Description (Optional)" }),
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    placeholder: "Brief description of the division's responsibilities",
                    value: nameEntry.description,
                    onChange: (e) => updateName(index, "description", e.target.value),
                    className: "min-h-[80px]"
                  }
                )
              ] })
            ] }) }, index)),
            errors.names && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.names })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "flex items-center justify-end gap-3 border-t p-6", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/admin/divisions", children: "Cancel" }) }),
          /* @__PURE__ */ jsxs(Button, { type: "submit", className: "bg-[#1a5f4a] hover:bg-[#154d3c]", disabled: processing, children: [
            processing && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Update Division"
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Edit as default
};
