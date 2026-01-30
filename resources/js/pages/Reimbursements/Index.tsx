import React, { useState } from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Link } from '@inertiajs/react'

export default function ReimbursementsIndex() {
  const [tab, setTab] = useState('atr')

  return (
    <AppShell>
      <PageHeader title="Reimbursement" description="Pengelolaan ATR / EER" actions={<Link href={route('reimbursements.create.atr')} className="btn">Buat Pengajuan</Link>} />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="atr">ATR</TabsTrigger>
          <TabsTrigger value="eer">EER</TabsTrigger>
          <TabsTrigger value="my">Pengajuan Saya</TabsTrigger>
          <TabsTrigger value="approvals">Persetujuan</TabsTrigger>
        </TabsList>

        <TabsContent value="atr">
          <div className="p-4">Daftar ATR (mock)</div>
        </TabsContent>

        <TabsContent value="eer">
          <div className="p-4">Daftar EER (mock)</div>
        </TabsContent>

        <TabsContent value="my">
          <div className="p-4">Pengajuan saya (mock)</div>
        </TabsContent>

        <TabsContent value="approvals">
          <div className="p-4">Antrian persetujuan (Head / Finance)</div>
        </TabsContent>
      </Tabs>
    </AppShell>
  )
}
