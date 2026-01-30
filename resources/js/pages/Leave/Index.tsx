import React from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Link } from '@inertiajs/react'

const leaves = [
  { id: 'C-001', name: 'Cuti Tahunan', start: '2026-02-10', end: '2026-02-12', status: 'approved' }
]

export default function LeaveIndex() {
  return (
    <AppShell>
      <PageHeader title="Pengajuan Cuti" description="Kelola pengajuan cuti" actions={<Link href={route('leave.create')} className="btn">Ajukan Cuti</Link>} />

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
    </AppShell>
  )
}
