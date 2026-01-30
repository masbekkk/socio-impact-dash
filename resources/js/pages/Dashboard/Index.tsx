import React from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/StatusBadge'

const kpis = [
  { title: 'Proyek Aktif', value: 12 },
  { title: 'Persetujuan Tertunda', value: 7 },
  { title: 'Anggaran Bulan Ini', value: 'Rp 75.000.000' },
  { title: 'Reimburse Menunggu', value: 3 },
]

const tasks = [
  { id: '1', title: 'Review MoM Proyek A', status: 'pending' },
  { id: '2', title: 'Approve Reimburse Budi', status: 'pending' },
]

export default function Dashboard() {
  return (
    <AppShell>
      <PageHeader title="Dashboard" description="Ringkasan aktivitas dan KPI" actions={<Button>Notifikasi</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <Card key={k.title} className="p-4">
            <div className="text-sm text-muted-foreground">{k.title}</div>
            <div className="text-2xl font-bold">{k.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Tugas Saya</h3>
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr><th>Nama</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td><Button variant="link">Lihat</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Aktivitas Terbaru</h3>
          <ul className="space-y-2 text-sm">
            <li>Budi mengunggah MoM Proyek A</li>
            <li>Reimburse Budi menunggu persetujuan Head</li>
            <li>Proyek C menandai milestone selesai</li>
          </ul>
        </Card>
      </div>
    </AppShell>
  )
}
