import React from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ApprovalActions from '@/components/ApprovalActions'

export default function ReimbursementShow({ params }: any) {
  const mock = { id: 'ATR-001', type: 'ATR', status: 'submitted', amount: 2500000 }

  return (
    <AppShell>
      <PageHeader title={`${mock.id} — ${mock.type}`} description={`Status: ${mock.status}`} actions={<div className="flex items-center gap-2"><Button>Download</Button><ApprovalActions /></div>} />

      <Card className="p-4">
        <div className="text-sm">Detail pengajuan (metadata & dokumen)</div>
      </Card>

      <Card className="p-4 mt-4">
        <h4 className="font-semibold">Timeline Audit</h4>
        <ul className="text-sm space-y-2 mt-2">
          <li>Draft dibuat oleh Ani</li>
          <li>Diajukan pada 2026-01-15</li>
          <li>Menunggu persetujuan head</li>
        </ul>
      </Card>
    </AppShell>
  )
}
