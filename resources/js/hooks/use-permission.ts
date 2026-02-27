import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage<SharedData>().props;

    const hasRole = (roles: string | string[]) => {
        if (!auth.user) return false;
        const userRoles = auth.user.role_name.split(',').map((r) => r.trim());
        const rolesToCheck = Array.isArray(roles) ? roles : [roles];

        // Superadmin always has access
        if (userRoles.includes('superadmin')) return true;

        return rolesToCheck.some((role) => userRoles.includes(role));
    };

    const hasPermission = (permissions: string | string[]) => {
        if (!auth.user) return false;
        const userPermissions = auth.permissions || [];
        const permissionsToCheck = Array.isArray(permissions) ? permissions : [permissions];

        // Superadmin typically has all permissions, but we check explicitly if roles don't match
        if (hasRole('superadmin')) return true;

        return permissionsToCheck.some((p) => userPermissions.includes(p));
    };

    return { hasRole, hasPermission };
}
