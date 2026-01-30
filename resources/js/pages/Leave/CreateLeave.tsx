import React, { useState } from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function CreateLeave() {
  const [type, setType] = useState('Cuti Tahunan')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')

  return (
    <AppShell>
      <PageHeader title="Ajukan Cuti" description="Pengajuan cuti dengan alur persetujuan" />
      <div className="p-4 border rounded space-y-3">
        <Input value={type} onChange={(e) => setType(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Tanggal Mulai" value={start} onChange={(e) => setStart(e.target.value)} />
          <Input placeholder="Tanggal Selesai" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <Textarea placeholder="Alasan" value={reason} onChange={(e) => setReason(e.target.value)} />
        <div className="flex justify-end"><Button>Ajukan</Button></div>
      </div>
    </AppShell>
  )
}
