import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { Loader2, Plus, Trash2 } from "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
function PermissionList() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/rbac/permissions");
      const result = await response.json();
      setPermissions(result.data || []);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPermissions();
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName) return;
    setIsCreating(true);
    try {
      await fetch("/api/rbac/permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || ""
        },
        body: JSON.stringify({ name: newName })
      });
      setNewName("");
      fetchPermissions();
    } catch (error) {
      console.error("Error creating permission:", error);
    } finally {
      setIsCreating(false);
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;
    try {
      await fetch(`/api/rbac/permissions/${id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || ""
        }
      });
      fetchPermissions();
    } catch (error) {
      console.error("Error deleting permission:", error);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: handleCreate, className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          placeholder: "New permission name...",
          value: newName,
          onChange: (e) => setNewName(e.target.value),
          className: "max-w-xs"
        }
      ),
      /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: isCreating, children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        isCreating ? "Creating..." : "Create Permission"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Permission Name" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxs(TableBody, { children: [
        permissions.map((permission) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: permission.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(permission.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) }) })
        ] }, permission.id)),
        permissions.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 2, className: "text-center py-4 text-muted-foreground", children: "No permissions found." }) })
      ] })
    ] }) })
  ] });
}
export {
  PermissionList as default
};
