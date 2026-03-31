import { jsxs, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { A as AppLayout } from "./app-layout-Djiv5oQm.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-C8TeAzVF.js";
import RoleList from "./RoleList-Codb_i8k.js";
import PermissionList from "./PermissionList-BomXOLUx.js";
import "./app-sidebar-layout-5JGZFayF.js";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "./button-hAi0Fg-Q.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "./use-permission-D0a8sZAO.js";
import "axios";
import "date-fns";
import "date-fns/locale";
import "./table-Cose3haZ.js";
import "./input-BYMPkoD-.js";
import "./badge-Bu5jvMvW.js";
import "./RolePermissionEditor-CMnlP1QP.js";
import "./dialog-BNdhpAvu.js";
import "./checkbox-D07xazED.js";
import "@radix-ui/react-checkbox";
const breadcrumbs = [
  {
    title: "RBAC Control",
    href: "/admin/rbac"
  }
];
function RBACIndex() {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "RBAC Control" }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Role Based Access Control" }) }),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "roles", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "roles", children: "Roles" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "permissions", children: "Permissions" })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "roles", className: "mt-4", children: /* @__PURE__ */ jsx(RoleList, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "permissions", className: "mt-4", children: /* @__PURE__ */ jsx(PermissionList, {}) })
      ] })
    ] })
  ] });
}
export {
  RBACIndex as default
};
