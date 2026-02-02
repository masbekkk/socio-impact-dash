import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import PageHeader from '@/components/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FileUploadDropzone from '@/components/FileUploadDropzone'
import BudgetEditor from '@/components/BudgetEditor'
import { Button } from '@/components/ui/button'
import LocationPicker from '@/components/LocationPicker'

export default function ProjectsCreate({ divisions }: { divisions: any[] }) {
  const [step, setStep] = useState('basic')
  const [location, setLocation] = useState({ lat: -6.2, lng: 106.8, address: '' })
  const tabsListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tabsListRef.current) {
      const container = tabsListRef.current
      const activeTab = container.querySelector('[data-state="active"]') as HTMLElement

      if (activeTab) {
        const containerRect = container.getBoundingClientRect()
        const activeRect = activeTab.getBoundingClientRect()

        // Calculate the scroll position to center the active tab
        const scrollLeft = container.scrollLeft + (activeRect.left - containerRect.left) - (containerRect.width / 2) + (activeRect.width / 2)

        container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      }
    }
  }, [step])

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Proyek', href: '/projects' },
    { title: 'Ajukan Proyek', href: '/projects/create' },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <div className="p-4 md:p-8 pb-0">
        <PageHeader title="Buat Proyek Baru" description="Lengkapi form berikut untuk membuat proyek baru." />
      </div>

      <Tabs value={step} onValueChange={(v) => setStep(v)} className="max-w-5xl mx-0 md:mx-auto pb-10 px-4 md:px-0">

        {/* Responsive Tabs: Scrollable on mobile (inline/swipe), Grid on desktop */}
        <div
          ref={tabsListRef}
          className="mb-4 w-full overflow-x-auto scrollbar-hide px-4 md:mx-0 md:px-0"
        >
          <TabsList className="inline-flex h-auto min-w-full w-max md:w-full flex-nowrap gap-2 bg-muted/50 p-1 justify-start md:grid md:grid-cols-5 md:gap-0">
            {['basic', 'stakeholders', 'detail', 'budget', 'docs'].map((tabValue, idx) => (
              <TabsTrigger
                key={tabValue}
                value={tabValue}
                className="flex-none px-4 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm md:flex-1 md:w-auto md:px-6 md:py-2.5 md:text-sm"
              >
                <span className="mr-1.5 inline md:mr-2">{idx + 1}.</span>
                {tabValue === 'basic' ? 'Identitas' : tabValue === 'stakeholders' ? 'Stakeholder' : tabValue === 'detail' ? 'Detail & SOW' : tabValue === 'budget' ? 'Anggaran' : 'Dokumen'}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Step 1: Identitas */}
        <TabsContent value="basic" className="mt-0">
          <Card>
            <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>Masukkan detail utama proyek.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Jenis Project</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Jenis Project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendampingan">Pendampingan</SelectItem>
                      <SelectItem value="pelatihan">Pelatihan</SelectItem>
                      <SelectItem value="dokumen">Dokumen</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Divisi</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Divisi Pelaksana" />
                    </SelectTrigger>
                    <SelectContent>
                      {(divisions || []).map((div) => (
                        <SelectItem key={div.id} value={div.id.toString()}>{div.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nama Project</Label>
                <Input
                  placeholder="Nama Proyek ..."
                  defaultValue="Peremajaan Sawit Rakyat (PSR) Area 1"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 px-4 pb-4 md:px-6 md:pb-6">
              <Button onClick={() => setStep('stakeholders')} className="w-auto">
                Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Step 2: Stakeholders */}
        <TabsContent value="stakeholders" className="mt-0">
          <Card>
            <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle>Tim & Stakeholder</CardTitle>
              <CardDescription>Tentukan penanggung jawab dan tim pelaksana.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Account Manager</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Account Manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ahmad">Ahmad Fauzi</SelectItem>
                      <SelectItem value="siti">Siti Aminah</SelectItem>
                      <SelectItem value="budi">Budi Santoso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Head Implementation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Head Implementation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dewi">Dewi Lestari</SelectItem>
                      <SelectItem value="eko">Eko Prasetyo</SelectItem>
                      <SelectItem value="rian">Rian Hidayat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>PIC Project</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih PIC Project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fajar">Fajar Nugraha</SelectItem>
                      <SelectItem value="maya">Maya Indah</SelectItem>
                      <SelectItem value="rizky">Rizky Ramadhan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-3 px-4 pb-4 md:px-6 md:pb-6">
              <Button variant="outline" size="icon" onClick={() => setStep('basic')} title="Kembali">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button onClick={() => setStep('detail')} className="w-auto">
                Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Step 3: Detail */}
        <TabsContent value="detail" className="mt-0">
          <Card>
            <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle>Detail Pekerjaan</CardTitle>
              <CardDescription>Lingkup kerja dan durasi proyek.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-4 md:p-6">
              <div className="space-y-2">
                <Label>Scope of Work (SOW)</Label>
                <div className="border rounded-lg p-6 space-y-4 hover:bg-muted/30 transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Upload dokumen SOW (PDF/Docx).</p>
                  </div>
                  <FileUploadDropzone />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Timeline (Durasi)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-normal text-muted-foreground">Tanggal Mulai</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-normal text-muted-foreground">Tanggal Selesai</Label>
                    <Input type="date" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-1">Sesuaikan dengan tanggal SPK.</p>
              </div>

              <div className="space-y-2">
                <Label>Lokasi Pelaksanaan</Label>
                <div className="border rounded-lg p-4">
                  <LocationPicker
                    onLocationSelect={(lat, lng, address) => setLocation({ lat, lng, address })}
                    initialLat={-6.200000}
                    initialLng={106.816666}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-3 px-4 pb-4 md:px-6 md:pb-6">
              <Button variant="outline" size="icon" onClick={() => setStep('stakeholders')} title="Kembali">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button onClick={() => setStep('budget')} className="w-auto">
                Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Step 4: Budget */}
        <TabsContent value="budget" className="mt-0">
          <Card>
            <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle>Anggaran & Keuangan</CardTitle>
              <CardDescription>Rincian anggaran dan proyeksi keuangan proyek.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-2">
                <Label>Anggaran Proyek & Proyeksi</Label>
                <div className="w-full overflow-x-auto pb-2">
                  <BudgetEditor />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-3 px-4 pb-4 md:px-6 md:pb-6">
              <Button variant="outline" size="icon" onClick={() => setStep('detail')} title="Kembali">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button onClick={() => setStep('docs')} className="w-auto">
                Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Step 5: Dokumen */}
        <TabsContent value="docs" className="mt-0">
          <Card>
            <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle>Dokumen Pendukung</CardTitle>
              <CardDescription>Upload dokumen legalitas dan proposal.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6 space-y-4 hover:bg-muted/30 transition-colors">
                  <div className="space-y-1">
                    <Label className="text-base">Proposal Kegiatan</Label>
                    <p className="text-sm text-muted-foreground">Format PDF, maks 10MB.</p>
                  </div>
                  <FileUploadDropzone />
                </div>
                <div className="border rounded-lg p-6 space-y-4 hover:bg-muted/30 transition-colors">
                  <div className="space-y-1">
                    <Label className="text-base">Kontrak / SPK</Label>
                    <p className="text-sm text-muted-foreground">Dokumen yang sudah ditandatangani.</p>
                  </div>
                  <FileUploadDropzone />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-3 px-4 pb-4 md:px-6 md:pb-6">
              <Button variant="outline" size="icon" onClick={() => setStep('budget')} title="Kembali">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button className="w-auto min-w-32">Submit Akhir</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AppSidebarLayout>
  )
}
