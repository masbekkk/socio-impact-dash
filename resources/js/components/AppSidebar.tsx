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
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: route('dashboard') as string },
  { key: 'projects', label: 'Proyek', icon: Grid, href: route('projects.index') as string },
  { key: 'reimbursement', label: 'Reimbursement', icon: DollarSign, href: route('reimbursements.index') as string },
  { key: 'leave', label: 'Cuti', icon: Calendar, href: route('leaves.index') as string },
  { key: 'presence', label: 'Presensi', icon: CheckSquare, href: route('presences.index') as string },
]

const headMenu: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: route('dashboard') as string },
  { key: 'projects', label: 'Proyek (Divisi)', icon: Grid, href: route('projects.index') as string },
  { key: 'approvals', label: 'Persetujuan', icon: CheckSquare, href: route('reimbursements.approvals') as string },
  { key: 'leaves-approval', label: 'Persetujuan Cuti', icon: Calendar, href: route('leaves.approvals') as string },
  { key: 'reports', label: 'Laporan', icon: FileText, href: route('reports.index') as string },
]

const financeMenu: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: route('dashboard') as string },
  { key: 'reimburse-approve', label: 'Persetujuan Reimbursement', icon: DollarSign, href: route('reimbursements.approvals') as string },
  { key: 'transfers', label: 'Transfer', icon: FileText, href: route('reimbursements.index') as string },
  { key: 'reports', label: 'Laporan', icon: FileText, href: route('reports.index') as string },
]

const superadminMenu: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: route('dashboard') as string },
  { key: 'users', label: 'Manajemen User', icon: Users, href: route('admin.users.index') as string },
  { key: 'divisions', label: 'Divisi', icon: FileText, href: route('admin.divisions.index') as string },
  { key: 'projects', label: 'Semua Proyek', icon: Grid, href: route('projects.index') as string },
  { key: 'settings', label: 'Pengaturan', icon: Settings, href: route('dashboard') as string },
]

const menusByRole: Record<string, MenuItem[]> = {
  pegawai: pegawaiMenu,
  head: headMenu,
  finance: financeMenu,
  superadmin: superadminMenu,
}

export default function AppSidebar() {
  const { props } = usePage()
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
        {items.map((item) => (
          <Link 
            key={item.key} 
            href={item.href} 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className={`overflow-hidden transition-all ${collapsed ? 'w-0' : 'inline'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t space-y-2">
        <RoleGate permissions={['view audit logs']}>
          <Link 
            href={route('dashboard') as string} 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className={`overflow-hidden transition-all ${collapsed ? 'w-0' : 'inline'}`}>
              Audit
            </span>
          </Link>
        </RoleGate>
        <form method="POST" action={route('logout') as string}>
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
