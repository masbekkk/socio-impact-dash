import React from 'react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import { Head, Link } from '@inertiajs/react'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'

const leaves = [
  { id: 'C-001', name: 'Cuti Tahunan', start: '2026-02-10', end: '2026-02-12', status: 'approved' }
]

export default function LeaveIndex() {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cuti', href: '/leaves' },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Cuti" />
      <div className="p-6 md:p-10">
        <PageHeader title="Pengajuan Cuti" description="Kelola pengajuan cuti" actions={<Link href="/leaves/create" className="btn">Ajukan Cuti</Link>} />

        <div className="space-y-3">
          {leaves.map(l => (
            <div key={l.id} className="p-4 border rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{l.name}</div>
                <div className="text-sm text-muted-foreground">{l.start} - {l.end}</div>
              </div>
              <div className="text-sm">{l.status}</div>
            </div>
          ))}
        </div>
      </div>
    </AppSidebarLayout>
  )
}
