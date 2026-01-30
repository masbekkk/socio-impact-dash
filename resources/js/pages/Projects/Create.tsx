import React, { useState } from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FileUploadDropzone from '@/components/FileUploadDropzone'
import BudgetEditor from '@/components/BudgetEditor'
import { Button } from '@/components/ui/button'

export default function ProjectsCreate() {
  const [step, setStep] = useState('basic')

  return (
    <AppShell>
      <PageHeader title="Ajukan Proyek Baru" description="Langkah-langkah pengajuan proyek" />

      <Tabs value={step} onValueChange={(v) => setStep(v)}>
        <TabsList>
          <TabsTrigger value="basic">1. Informasi Dasar</TabsTrigger>
          <TabsTrigger value="assignment">2. Penugasan</TabsTrigger>
          <TabsTrigger value="sow">3. SOW</TabsTrigger>
          <TabsTrigger value="timeline">4. Timeline</TabsTrigger>
          <TabsTrigger value="budget">5. Budget</TabsTrigger>
          <TabsTrigger value="docs">6. Dokumen</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="space-y-3">
            <Input placeholder="Nama Proyek" />
            <Input placeholder="Client" />
            <Input placeholder="Divisi" />
          </div>
          <div className="mt-4 flex justify-end"><Button onClick={() => setStep('assignment')}>Selanjutnya</Button></div>
        </TabsContent>

        <TabsContent value="assignment">
          <div className="space-y-3">
            <Input placeholder="Account Manager" />
            <Input placeholder="Head" />
            <Input placeholder="PIC" />
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={() => setStep('basic')}>Kembali</Button>
            <Button onClick={() => setStep('sow')}>Selanjutnya</Button>
          </div>
        </TabsContent>

        <TabsContent value="sow">
          <Textarea placeholder="SOW / Scope of Work" />
          <div className="mt-3"><FileUploadDropzone /></div>
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={() => setStep('assignment')}>Kembali</Button>
            <Button onClick={() => setStep('timeline')}>Selanjutnya</Button>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <div className="space-y-2">Tambah milestones (mock UI)</div>
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={() => setStep('sow')}>Kembali</Button>
            <Button onClick={() => setStep('budget')}>Selanjutnya</Button>
          </div>
        </TabsContent>

        <TabsContent value="budget">
          <BudgetEditor />
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={() => setStep('timeline')}>Kembali</Button>
            <Button onClick={() => setStep('docs')}>Selanjutnya</Button>
          </div>
        </TabsContent>

        <TabsContent value="docs">
          <FileUploadDropzone />
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={() => setStep('budget')}>Kembali</Button>
            <Button>Submit Akhir</Button>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  )
}
