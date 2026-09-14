import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import RolePermissionEditor from "./RolePermissionEditor-CMnlP1QP.js";
import { Loader2, Plus, Shield, Trash2 } from "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "./dialog-BNdhpAvu.js";
import "@radix-ui/react-dialog";
import "./checkbox-D07xazED.js";
import "@radix-ui/react-checkbox";
function RoleList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/rbac/roles");
      const result = await response.json();
      setRoles(result.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);
  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName) return;
    setIsCreating(true);
    try {
      await fetch("/api/rbac/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || ""
        },
        body: JSON.stringify({ name: newRoleName })
      });
      setNewRoleName("");
      fetchRoles();
    } catch (error) {
      console.error("Error creating role:", error);
    } finally {
      setIsCreating(false);
    }
  };
  const handleDeleteRole = async (id) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await fetch(`/api/rbac/roles/${id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || ""
        }
      });
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateRole, className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          placeholder: "New role name...",
          value: newRoleName,
          onChange: (e) => setNewRoleName(e.target.value),
          className: "max-w-xs"
        }
      ),
      /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: isCreating, children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        isCreating ? "Creating..." : "Create Role"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Role Name" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Permissions" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: roles.map((role) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 text-primary" }),
          role.name
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: (role.permissions || []).map((p) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: p.name }, p.id)) }) }),
        /* @__PURE__ */ jsxs(TableCell, { className: "text-right space-x-2", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => setSelectedRole(role), children: "Edit Permissions" }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteRole(role.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
        ] })
      ] }, role.id)) })
    ] }) }),
    selectedRole && /* @__PURE__ */ jsx(
      RolePermissionEditor,
      {
        role: selectedRole,
        isOpen: !!selectedRole,
        onClose: () => {
          setSelectedRole(null);
          fetchRoles();
        }
      }
    )
  ] });
}
export {
  RoleList as default
};
