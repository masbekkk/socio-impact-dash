import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ArrowRight, X, FileSpreadsheet, FileCheck } from 'lucide-react'
import { Head, Link, usePage } from '@inertiajs/react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FileUploadDropzone from '@/components/FileUploadDropzone'
import BudgetEditor from '@/components/BudgetEditor'
import MoneyInput from '@/components/MoneyInput'
import { Button } from '@/components/ui/button'
import LocationPicker from '@/components/LocationPicker'


export default function ProjectsCreate({ divisions }: { divisions: any[] }) {
  const { url } = usePage();
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const type = queryParams.get('type') || 'active'; // 'proposal' or 'active'

  const [step, setStep] = useState('basic')
  const [budget, setBudget] = useState<number>(0)
  // State Lokasi Multiple
  const [locations, setLocations] = useState<{ id: string, name: string, lat: number, lng: number, address: string }[]>([])

  const addLocation = (lat: number, lng: number, addr: string) => {
    // Cek duplikasi (jika lat/lng sama persis atau sangat dekat)
    const isDuplicate = locations.some(loc =>
      Math.abs(loc.lat - lat) < 0.0001 && Math.abs(loc.lng - lng) < 0.0001
    );

    if (!isDuplicate) {
      setLocations([...locations, { id: crypto.randomUUID(), name: `Lokasi ${locations.length + 1}`, lat, lng, address: addr }])
    }
  }

  const removeLocation = (id: string) => {
    setLocations(locations.filter(l => l.id !== id))
  }

  // Dynamic Docs State
  const [supportingDocs, setSupportingDocs] = useState([{ id: 1, type: 'TOR' }]);
  const addSupportingDoc = () => {
    const usedTypes = supportingDocs.map(d => d.type);
    const available = ['TOR', 'KAK', 'RFP'].find(t => !usedTypes.includes(t));
    if (available) {
      setSupportingDocs([...supportingDocs, { id: Date.now(), type: available }]);
    }
  };
  const updateSupportingDocType = (id: number, type: string) => {
    setSupportingDocs(supportingDocs.map(d => d.id === id ? { ...d, type } : d));
  };
  const removeSupportingDoc = (id: number) => {
    if (supportingDocs.length > 1) {
      setSupportingDocs(supportingDocs.filter(d => d.id !== id));
    }
  };
  const tabsListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tabsListRef.current) {
      const container = tabsListRef.current
      const activeTab = container.querySelector('[data-state="active"]') as HTMLElement

      if (activeTab) {
        const containerRect = container.getBoundingClientRect()
        const activeRect = activeTab.getBoundingClientRect()

        const scrollLeft = container.scrollLeft + (activeRect.left - containerRect.left) - (containerRect.width / 2) + (activeRect.width / 2)

        container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      }
    }
  }, [step])

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Proyek', href: '/projects' },
    { title: 'Create', href: '#' },
  ];

  const stepsList = ['basic', 'stakeholders', 'detail', 'location', 'budget'];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title={type === 'proposal' ? 'Buat Proposal Proyek' : 'Buat Proyek Baru'} />

      {/* Full Width content container */}
      <div className="flex flex-col h-full">

        {/* Header Section */}
        <div className="bg-background border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{type === 'proposal' ? 'Pengajuan Proposal Baru' : 'Input Active Project'}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Lengkapi data di bawah ini.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">Step {stepsList.indexOf(step) + 1}/5</span>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(stepsList.indexOf(step) + 1) * (100 / 5)}%` }}
              />
            </div>
          </div>
        </div>

        <Tabs value={step} onValueChange={(v) => setStep(v)} className="flex-1 w-full p-6">

          {/* Tab Navigation */}
          <div
            ref={tabsListRef}
            className="mb-6 w-full overflow-x-auto scrollbar-hide border-b bg-background"
          >
            <TabsList className="inline-flex h-auto min-w-full w-max md:w-full flex-nowrap gap-2 bg-muted/50 p-1 justify-start md:grid md:grid-cols-5 md:gap-0">
              {stepsList.map((tabValue, idx) => (
                <TabsTrigger
                  key={tabValue}
                  value={tabValue}
                  className="flex-none px-4 py-2 text-xs transition-all data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white data-[state=active]:shadow-sm md:flex-1 md:w-auto md:px-3 md:py-2.5 md:text-xs lg:text-sm"
                >
                  <span className="mr-1.5 inline md:mr-2">{idx + 1}.</span>
                  {tabValue === 'basic' ? 'Identitas' : tabValue === 'stakeholders' ? 'Stakeholder' : tabValue === 'detail' ? 'Detail' : tabValue === 'location' ? 'Lokasi' : 'Anggaran'}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Step 1: Identitas */}
          <TabsContent value="basic" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
            <Card className="border-none shadow-md">
              <CardHeader className="px-6 pt-6 bg-white rounded-t-xl border-b pb-4">
                <CardTitle>Informasi Dasar</CardTitle>
                <CardDescription>Masukkan detail identitas utama proyek.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Jenis Project <span className="text-red-500">*</span></Label>
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
                    <Label>Anak Perusahaan<span className="text-red-500">*</span></Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Anak Perusahaan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt_sinergi">PT Sawit Jaya Abadi </SelectItem>
                        <SelectItem value="pt_bakti">PT AminLabs</SelectItem>
                        <SelectItem value="yayasan_harapan">PT Wowoengine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nama Project <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Nama Lengkap Proyek ..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Divisi Pelaksana <span className="text-red-500">*</span></Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Divisi" />
                    </SelectTrigger>
                    <SelectContent>
                      {(divisions || []).map((div) => (
                        <SelectItem key={div.id} value={div.id.toString()}>{div.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl">
                <Button onClick={() => setStep('stakeholders')} className="w-auto px-8">
                  Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Step 2: Stakeholders */}
          <TabsContent value="stakeholders" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
            <Card className="border-none shadow-md">
              <CardHeader className="px-6 pt-6 bg-white rounded-t-xl border-b pb-4">
                <CardTitle>Tim & Stakeholder</CardTitle>
                <CardDescription>Tentukan penanggung jawab dan tim pelaksana.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Account Manager <span className="text-red-500">*</span></Label>
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
                    <Label>Head Implementation <span className="text-red-500">*</span></Label>
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
                    <Label>PIC Project <span className="text-red-500">*</span></Label>
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
              <CardFooter className="flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl">
                <Button variant="outline" onClick={() => setStep('basic')} title="Kembali">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                </Button>
                <Button onClick={() => setStep('detail')} className="w-auto px-8">
                  Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Step 3: Detail & Proposal */}
          <TabsContent value="detail" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
            <Card className="border-none shadow-md">
              <CardHeader className="px-6 pt-6 bg-white rounded-t-xl border-b pb-4">
                <CardTitle>Detail & {type === 'proposal' ? 'Proposal' : 'SOW'}</CardTitle>
                <CardDescription>Dokumen {type === 'proposal' ? 'proposal' : 'SOW'}, durasi, dan lingkup kerja.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-6 md:p-8">

                {/* DOCUMENT UPLOAD SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{type === 'proposal' ? 'Dokumen Proposal Project' : 'Dokumen Scope of Work (SOW)'} <span className="text-red-500">*</span></Label>
                    <div className="border rounded-lg p-6 space-y-4 hover:bg-muted/30 transition-colors bg-white h-full">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {type === 'proposal' ? 'Upload dokumen Proposal lengkap.' : 'Upload dokumen SOW yang disepakati.'}
                        </p>
                      </div>
                      <FileUploadDropzone />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {/* Optional Doc */}
                    <Label>TOR / KAK / RFP <span className="text-xs font-normal text-muted-foreground ml-1">(Tidak Wajib)</span></Label>

                    {supportingDocs.map((doc, idx) => {
                      const otherUsedTypes = supportingDocs.filter(d => d.id !== doc.id).map(d => d.type);
                      return (
                        <div key={doc.id} className="relative border rounded-lg p-5 space-y-3 hover:bg-muted/30 transition-colors bg-white group animate-in fade-in slide-in-from-top-2">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-2 w-full flex justify-between">
                              <Label className="text-xs font-medium text-muted-foreground">Jenis Dokumen Pendukung #{idx + 1}</Label>
                              <Select value={doc.type} onValueChange={(val) => updateSupportingDocType(doc.id, val)}>
                                <SelectTrigger className="h-7 w-[220px] bg-white border-gray-300">
                                  <SelectValue placeholder="Pilih Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TOR" disabled={otherUsedTypes.includes('TOR')}>TOR</SelectItem>
                                  <SelectItem value="KAK" disabled={otherUsedTypes.includes('KAK')}>KAK</SelectItem>
                                  <SelectItem value="RFP" disabled={otherUsedTypes.includes('RFP')}>RFP</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {supportingDocs.length > 1 && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 shrink-0 mt-6" onClick={() => removeSupportingDoc(doc.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <FileUploadDropzone />
                        </div>
                      )
                    })}

                    {supportingDocs.length < 3 && (
                      <Button variant="outline" size="sm" onClick={addSupportingDoc} className="w-full border-dashed border-gray-400 text-muted-foreground hover:text-primary hover:border-primary gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                        Tambah Dokumen Lainnya
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Catatan (Notes)</Label>
                  <Textarea
                    placeholder="Tambahkan catatan..."
                    className="min-h-[100px] bg-white"
                  />
                </div>

                {/* TIMELINE */}
                <div className="space-y-2">
                  <Label>Deadline <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-normal text-muted-foreground">Tanggal Mulai Kegiatan</Label>
                      <Input type="date" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-normal text-muted-foreground">Tanggal Deadline Kegiatan</Label>
                      <Input type="date" className="bg-white" />
                    </div>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl">
                <Button variant="outline" onClick={() => setStep('stakeholders')} title="Kembali">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                </Button>
                <Button onClick={() => setStep('location')} className="w-auto px-8">
                  Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Step 4: Location (SEPARATE TAB) */}
          <TabsContent value="location" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
            <Card className="border-none shadow-md">
              <CardHeader className="px-6 pt-6 bg-white rounded-t-xl border-b pb-4">
                <CardTitle>Lokasi Pelaksanaan</CardTitle>
                <CardDescription>Kelola titik lokasi proyek (Bisa lebih dari 1 lokasi).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* List Lokasi */}
                  <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
                    <div className="flex items-center justify-between">
                      <Label>Daftar Lokasi ({locations.length})</Label>
                    </div>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {locations.length === 0 ? (
                        <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground text-sm bg-gray-50">
                          Belum ada lokasi dipilih. <br />
                          Klik peta untuk menambahkan.
                        </div>
                      ) : (
                        locations.map((loc, idx) => (
                          <div key={loc.id} className="p-3 border rounded-lg bg-white shadow-sm group hover:border-primary transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-sm">Titik {idx + 1}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-500 -mt-1 -mr-1" onClick={() => removeLocation(loc.id)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2" title={loc.address}>{loc.address || 'Alamat tidak terdeteksi'}</p>
                            <div className="mt-2 flex gap-2 text-[10px] items-center text-gray-500 font-mono">
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded">{loc.lat.toFixed(6)}</span>
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded">{loc.lng.toFixed(6)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Picker */}
                  <div className="lg:col-span-2 order-1 lg:order-2">
                    <LocationPicker
                      onLocationSelect={(lat, lng, address) => addLocation(lat, lng, address)}
                      initialLat={-6.200000}
                      initialLng={106.816666}
                      existingLocations={locations}
                    />
                    <p className="text-[10px] text-muted-foreground mt-2">Dukungan Multi-lokasi: Klik titik baru di peta untuk menambah lokasi.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl">
                <Button variant="outline" onClick={() => setStep('detail')} title="Kembali">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                </Button>
                <Button onClick={() => setStep('budget')} className="w-auto px-8">
                  Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Step 5: Budget */}
          <TabsContent value="budget" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
            <Card className="border-none shadow-md">
              <CardHeader className="px-6 pt-6 bg-white rounded-t-xl border-b pb-4">
                <CardTitle>Anggaran & Keuangan</CardTitle>
                <CardDescription>Masukkan Nominal dan lampirkan rincian anggaran (RAB).</CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">

                {/* Main Budget Section (Gray Box like screenshot) */}
                <div className="bg-gray-50 border rounded-xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start justify-between">

                    {/* Left: Input Section */}
                    <div className="flex-1 space-y-4 w-full">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900">Nominal Project</h3>
                      </div>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold z-10">Rp</span>
                        <MoneyInput
                          value={budget}
                          onValueChange={(vals) => setBudget(vals.floatValue || 0)}
                          placeholder="0"
                          className="pl-12 text-xl font-bold h-14 bg-white border-gray-200 shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Right: Visualization Card */}
                    <div className="w-full md:w-[320px] shrink-0">
                      <div className="bg-white border rounded-xl p-6 shadow-sm text-center space-y-2">
                        <p className="text-sm text-gray-500 font-medium">Total Anggaran Project</p>
                        <div className="text-3xl font-bold text-red-600 tracking-tight">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(budget).replace('Rp', 'Rp ')}
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">
                          100% dari Total Project
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Upload RAB */}
                {/* Upload Section: RAB & Negotiation */}
                <div className={`grid grid-cols-1 ${type !== 'proposal' ? 'md:grid-cols-2' : ''} gap-6 pt-2`}>
                  {/* RAB */}
                  <div className="space-y-2">
                    <Label>Rincian Anggaran (RAB)</Label> <span className="text-red-500">*</span>
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 space-y-4 hover:bg-gray-50 transition-colors bg-white h-full">
                      <div className="flex items-center gap-4">
                        {/* <div className="p-3 bg-blue-50 rounded-full text-blue-600 border border-blue-100">
                          <FileSpreadsheet />
                        </div> */}
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-gray-900">Upload File RAB.</h4>
                          <p className="text-xs text-muted-foreground">Lampirkan detail Rencana Anggaran Biaya.</p>
                        </div>
                      </div>
                      <FileUploadDropzone />
                    </div>
                  </div>

                  {/* Berita Acara Negosiasi (Only for Active Projects) */}
                  {type !== 'proposal' && (
                    <div className="space-y-2">
                      <Label>Berita Acara Negosiasi <span className="text-red-500">*</span></Label>
                      <div className="border border-dashed border-gray-300 rounded-lg p-6 space-y-4 hover:bg-gray-50 transition-colors bg-white h-full">
                        <div className="flex items-center gap-4">
                          {/* <div className="p-3 bg-purple-50 rounded-full text-purple-600 border border-purple-100">
                            <FileCheck className="h-6 w-6" />
                          </div> */}
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-900">Upload Dokumen Negosiasi</h4>
                            <p className="text-xs text-muted-foreground">Lampirkan Berita Acara Negosiasi harga.</p>
                          </div>
                        </div>
                        <FileUploadDropzone />
                      </div>
                    </div>
                  )}
                </div>

              </CardContent>
              <CardFooter className="flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl">
                <Button variant="outline" onClick={() => setStep('location')} title="Kembali">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                </Button>
                <Button className="w-auto px-8 min-w-32 bg-[var(--sidebar)] hover:bg-[var(--sidebar)] hover:scale-105">
                  Simpan Proyek
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>


        </Tabs>
      </div>
    </AppSidebarLayout>
  )
}
