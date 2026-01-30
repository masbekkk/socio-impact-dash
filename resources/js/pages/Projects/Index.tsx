import React from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import StatusBadge from '@/components/StatusBadge'
import { Link } from '@inertiajs/react'

const projects = [
  { code: 'PRJ-001', name: 'Proyek A', client: 'Klien 1', status: 'active', pic: 'Ani', timeline: '1 Jan - 30 Jun', budget: 'Rp 10.000.000', blockers: '-' },
  { code: 'PRJ-002', name: 'Proyek B', client: 'Klien 2', status: 'pending', pic: 'Budi', timeline: '1 Feb - 15 May', budget: 'Rp 5.000.000', blockers: 'Budget' },
]

export default function ProjectsIndex() {
  return (
    <AppShell>
      <PageHeader title="Proyek" description="Kelola proyek Anda" actions={<Link href={route('projects.create')} className="btn">Ajukan Proyek</Link>} />

      <DataTable filters={<div className="flex gap-2"><Input placeholder="Cari" /></div>}>
        <table className="w-full text-sm">
          <thead className="text-muted-foreground text-left">
            <tr><th>Kode</th><th>Nama</th><th>Client</th><th>Status</th><th>PIC</th><th>Timeline</th><th>Budget</th><th>Blockers</th><th></th></tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.code} className="hover:bg-muted">
                <td>{p.code}</td>
                <td>{p.name}</td>
                <td>{p.client}</td>
                <td><StatusBadge status={p.status} /></td>
                <td>{p.pic}</td>
                <td>{p.timeline}</td>
                <td>{p.budget}</td>
                <td>{p.blockers}</td>
                <td className="text-right">
                  <Link href={route('projects.show', p.code)} className="mr-2">View</Link>
                  <Button size="sm" variant="ghost">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </AppShell>
  )
}
