import React, { useState } from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import FileUploadDropzone from '@/components/FileUploadDropzone'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function CreateATR() {
  const [status, setStatus] = useState('draft')
  return (
    <AppShell>
      <PageHeader title="Buat ATR" description="Ajukan ATR baru untuk project" actions={<Button>Preview</Button>} />

      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Proposal</label>
            <FileUploadDropzone />
          </div>
          <div>
            <label className="block text-sm">RAB</label>
            <FileUploadDropzone />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Input placeholder="Nama Bank" />
          <Input placeholder="No. Rekening" />
          <Input placeholder="Atas Nama" />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>Status: {status}</div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStatus('draft')}>Simpan Draft</Button>
            <Button onClick={() => setStatus('submitted')}>Ajukan</Button>
          </div>
        </div>
      </Card>
    </AppShell>
  )
}
