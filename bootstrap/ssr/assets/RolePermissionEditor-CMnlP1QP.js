import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { C as Checkbox } from "./checkbox-D07xazED.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { Loader2 } from "lucide-react";
import "@radix-ui/react-dialog";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
function RolePermissionEditor({ role, isOpen, onClose }) {
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allRes, roleRes] = await Promise.all([
          fetch("/api/rbac/permissions").then((res) => res.json()),
          fetch(`/api/rbac/roles/${role.id}`).then((res) => res.json())
        ]);
        setPermissions(allRes.data || []);
        setSelectedPermissions((roleRes.data?.permissions || []).map((p) => p.name));
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && role) {
      fetchData();
    }
  }, [isOpen, role]);
  const handleToggle = (permissionName) => {
    setSelectedPermissions(
      (prev) => prev.includes(permissionName) ? prev.filter((p) => p !== permissionName) : [...prev, permissionName]
    );
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/rbac/roles/${role.id}/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || ""
        },
        body: JSON.stringify({ permissions: selectedPermissions })
      });
      if (response.ok) {
        onClose();
      } else {
        console.error("Failed to save permissions");
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
      "Edit Permissions for ",
      role.name
    ] }) }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center p-4", children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin" }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4 py-4 max-h-[400px] overflow-y-auto", children: permissions.map((permission) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
      /* @__PURE__ */ jsx(
        Checkbox,
        {
          id: `permission-${permission.id}`,
          checked: selectedPermissions.includes(permission.name),
          onCheckedChange: () => handleToggle(permission.name)
        }
      ),
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: `permission-${permission.id}`,
          className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
          children: permission.name
        }
      )
    ] }, permission.id)) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: onClose, disabled: saving, children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { onClick: handleSave, disabled: saving || loading, children: saving ? "Saving..." : "Save Changes" })
    ] })
  ] }) });
}
export {
  RolePermissionEditor as default
};
