import { usePage } from "@inertiajs/react";
function usePermission() {
  const { auth } = usePage().props;
  const hasRole = (roles) => {
    if (!auth.user) return false;
    const userRoles = auth.user.role_name.split(",").map((r) => r.trim());
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    if (userRoles.includes("superadmin")) return true;
    return rolesToCheck.some((role) => userRoles.includes(role));
  };
  const hasPermission = (permissions) => {
    if (!auth.user) return false;
    const userPermissions = auth.permissions || [];
    const permissionsToCheck = Array.isArray(permissions) ? permissions : [permissions];
    if (hasRole("superadmin")) return true;
    return permissionsToCheck.some((p) => userPermissions.includes(p));
  };
  return { hasRole, hasPermission };
}
export {
  usePermission as u
};
