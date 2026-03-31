import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, f as CardFooter } from "./card-DAjHeOuX.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { ChevronLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import "react";
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
function Create() {
  const { data, setData, post, processing, errors, reset } = useForm({
    code: "",
    name: "",
    description: ""
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/v1/letter-divisi suratons", data);
      toast.success("Divisi Surat berhasil dibuat.");
      window.location.href = "/admin/letter-divisi suratons";
    } catch (error) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        Object.keys(validationErrors).forEach((key) => {
          toast.error(validationErrors[key][0]);
        });
      } else {
        toast.error(error.response?.data?.message || "Gagal membuat divisi surat.");
      }
    }
  };
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Letter Divisi Suratons", href: "/admin/letter-divisi suratons" },
    { title: "Create", href: "/admin/letter-divisi suratons/create" }
  ];
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Add Letter Divisi Suraton" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/admin/letter-divisi suratons", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Add Letter Divisi Suraton" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Create a new divisi suraton or department." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Letter Divisi Suraton Details" }) }),
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
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Unique identifier for the divisi suraton." }),
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
              errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.name })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Description (Optional)" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "description",
                placeholder: "Brief description of the divisi suraton's responsibilities",
                value: data.description,
                onChange: (e) => setData("description", e.target.value),
                className: "min-h-[100px]"
              }
            ),
            errors.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: errors.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "flex items-center justify-end gap-3 border-t p-6", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/admin/letter-divisi suratons", children: "Cancel" }) }),
          /* @__PURE__ */ jsxs(Button, { className: "bg-[#1a5f4a] hover:bg-[#154d3c]", disabled: processing, children: [
            processing && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Save Letter Divisi Suraton"
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Create as default
};
