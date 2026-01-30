import React, { useState } from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function CreateTravel() {
  const [destination, setDestination] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [purpose, setPurpose] = useState('')

  return (
    <AppShell>
      <PageHeader title="Ajukan Perjalanan Dinas" description="Form perjalanan dinas & estimasi biaya" />
      <div className="p-4 border rounded space-y-3">
        <Input placeholder="Tujuan" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Tanggal Mulai" value={start} onChange={(e) => setStart(e.target.value)} />
          <Input placeholder="Tanggal Selesai" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <Textarea placeholder="Keperluan" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        <div className="flex justify-end"><Button>Ajukan</Button></div>
      </div>
    </AppShell>
  )
}
