import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Home, Grid, FileText, Users, Settings, DollarSign, Calendar, CheckSquare, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RoleGate from '@/components/RoleGate'

interface MenuItem {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

const pegawaiMenu: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { key: 'projects', label: 'Proyek', icon: Grid, href: '/projects' },
  { key: 'reimbursement', label: 'Reimbursement', icon: DollarSign, href: '/reimbursements' },
  { key: 'leave', label: 'Cuti', icon: Calendar, href: '/leaves' },
  { key: 'presence', label: 'Presensi', icon: CheckSquare, href: '/presences' },
]

const headMenu: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { key: 'projects', label: 'Proyek (Divisi)', icon: Grid, href: '/projects' },
  { key: 'approvals', label: 'Persetujuan', icon: CheckSquare, href: '/reimbursements/approvals' },
  { key: 'leaves-approval', label: 'Persetujuan Cuti', icon: Calendar, href: '/leaves/approvals' },
  { key: 'reports', label: 'Laporan', icon: FileText, href: '/reports' },
]

const financeMenu: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { key: 'reimburse-approve', label: 'Persetujuan Reimbursement', icon: DollarSign, href: '/reimbursements/approvals' },
  { key: 'transfers', label: 'Transfer', icon: FileText, href: '/reimbursements' },
  { key: 'reports', label: 'Laporan', icon: FileText, href: '/reports' },
]

const superadminMenu: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { key: 'users', label: 'Manajemen User', icon: Users, href: '/admin/users' },
  { key: 'divisions', label: 'Divisi', icon: FileText, href: '/admin/divisions' },
  { key: 'projects', label: 'Semua Proyek', icon: Grid, href: '/projects' },
  { key: 'settings', label: 'Pengaturan', icon: Settings, href: '/dashboard' },
]

const menusByRole: Record<string, MenuItem[]> = {
  pegawai: pegawaiMenu,
  head: headMenu,
  finance: financeMenu,
  superadmin: superadminMenu,
}

export default function AppSidebar() {
  const { props, url } = usePage()
  const auth = (props.auth as any) || {}
  const userRole = auth?.user?.role || 'pegawai'
  const [collapsed, setCollapsed] = useState(false)

  const items = menusByRole[userRole] || pegawaiMenu

  return (
    <aside className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} bg-muted/50 dark:bg-muted h-screen p-4 flex flex-col hidden md:flex border-r`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={`font-bold text-lg transition-opacity ${collapsed ? 'hidden' : 'block'}`}>
          SocioImpact
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed((s) => !s)}
          className="ml-auto"
        >
          {collapsed ? '→' : '←'}
        </Button>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const isActive = url.startsWith(item.href) && (item.href !== '/dashboard' || url === '/dashboard');

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${isActive
                ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90'
                : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={`overflow-hidden transition-all ${collapsed ? 'w-0' : 'inline'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="pt-6 border-t space-y-2">
        <RoleGate permissions={['view audit logs']}>
          <Link
            href='/dashboard'
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className={`overflow-hidden transition-all ${collapsed ? 'w-0' : 'inline'}`}>
              Audit
            </span>
          </Link>
        </RoleGate>
        <form method="POST" action="/logout">
          <input type="hidden" name="_token" value={(props.csrf_token as string)} />
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`overflow-hidden transition-all ${collapsed ? 'w-0' : 'inline'}`}>
              Logout
            </span>
          </button>
        </form>
      </div>
    </aside>
  )
}
