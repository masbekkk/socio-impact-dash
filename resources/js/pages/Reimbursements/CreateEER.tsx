import React, { useState } from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import FileUploadDropzone from '@/components/FileUploadDropzone'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function CreateEER() {
  const [status, setStatus] = useState('draft')
  return (
    <AppShell>
      <PageHeader title="Buat EER" description="Ajukan EER (Expense Report)" actions={<Button>Preview</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">EER Document</label>
          <FileUploadDropzone />
        </div>
        <div>
          <label className="block text-sm">Kuitansi / Receipts</label>
          <FileUploadDropzone />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Input placeholder="Total Biaya" />
        <Input placeholder="Metode Pembayaran" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>Status: {status}</div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setStatus('draft')}>Simpan Draft</Button>
          <Button onClick={() => setStatus('submitted')}>Ajukan</Button>
        </div>
      </div>
    </AppShell>
  )
}
