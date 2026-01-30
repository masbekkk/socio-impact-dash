import React from 'react'
import { usePage } from '@inertiajs/react'

interface RoleGateProps {
  roles?: string[]
  permissions?: string[]
  children: React.ReactNode
}

/**
 * Frontend access control component
 * NOTE: This is a UX-only guard. Always validate on the backend!
 * Uses Spatie/laravel-permission for role and permission checks
 */
export default function RoleGate({ roles = [], permissions = [], children }: RoleGateProps) {
  const { props } = usePage()
  const auth = (props.auth as any) || {}
  const user = auth?.user

  if (!user) return null

  // Check roles (if specified)
  if (roles.length > 0) {
    const hasRole = roles.some((role) => user.roles?.includes(role))
    if (!hasRole) return null
  }

  // Check permissions (if specified)
  if (permissions.length > 0) {
    const hasPermission = permissions.some((permission) => user.permissions?.includes(permission))
    if (!hasPermission) return null
  }

  return <>{children}</>
}
