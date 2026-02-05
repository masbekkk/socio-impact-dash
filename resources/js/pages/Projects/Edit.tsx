import React, { useState, useRef, useEffect } from 'react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FileUploadDropzone from '@/components/FileUploadDropzone'
import { Button } from '@/components/ui/button'
import LocationPicker from '@/components/LocationPicker'
import MoneyInput from '@/components/MoneyInput'
import { ArrowLeft, ArrowRight, X, Save } from 'lucide-react'
import { Head, Link, usePage } from '@inertiajs/react'

export default function ProjectsEdit({ project, divisions }: { project: any, divisions: any[] }) {
    const [step, setStep] = useState('basic')
    const [budget, setBudget] = useState<number>(project.budget_total || 0)
    const [status, setStatus] = useState(project.status || 'draft')

    // Simulate Multi-location from single if needed, or use existing array
    const [locations, setLocations] = useState<{ id: string, name: string, lat: number, lng: number, address: string }[]>([])

    // Init locations if project has them (mock logic check)
    useEffect(() => {
        if (project.locations && project.locations.length > 0) {
            setLocations(project.locations);
        } else if (project.lat) {
            setLocations([{ id: '1', name: 'Lokasi Utama', lat: parseFloat(project.lat), lng: parseFloat(project.lng), address: project.address || '' }])
        }
    }, [])

    const addLocation = (lat: number, lng: number, addr: string) => {
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
        { title: 'Edit', href: '#' },
    ];

    const stepsList = ['basic', 'stakeholders', 'detail', 'location', 'budget'];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${project.name}`} />

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
                            <h1 className="text-xl font-bold">Edit Proyek</h1>
                            <p className="text-xs text-muted-foreground hidden sm:block">{project.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">Step {stepsList.indexOf(step) + 1}/5</span>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(stepsList.indexOf(step) + 1) * (100 / 5)}%` }} />
                        </div>
                    </div>
                </div>

                <Tabs value={step} onValueChange={(v) => setStep(v)} className="flex-1 w-full p-6">

                    {/* Tab Navigation */}
                    <div ref={tabsListRef} className="mb-6 w-full overflow-x-auto scrollbar-hide border-b bg-background">
                        <TabsList className="inline-flex h-auto min-w-full w-max md:w-full flex-nowrap gap-2 bg-muted/50 p-1 justify-start md:grid md:grid-cols-5 md:gap-0">
                            {stepsList.map((tabValue, idx) => (
                                <TabsTrigger
                                    key={tabValue}
                                    value={tabValue}
                                    className="flex-none px-4 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm md:flex-1 md:w-auto md:px-3 md:py-2.5 md:text-xs lg:text-sm"
                                >
                                    <span className="mr-1.5 inline md:mr-2">{idx + 1}.</span>
                                    {tabValue === 'basic' ? 'Identitas' : tabValue === 'stakeholders' ? 'Stakeholder' : tabValue === 'detail' ? 'Detail & Proposal' : tabValue === 'location' ? 'Lokasi' : 'Anggaran'}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {/* Step 1: Identitas */}
                    <TabsContent value="basic" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                        <Card className="border-none shadow-md">
                            <CardHeader className="px-6 pt-6 bg-white rounded-t-xl border-b pb-4">
                                <CardTitle>Informasi Dasar</CardTitle>
                                <CardDescription>Perbarui nama, jenis, dan status proyek.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* STATUS DROPDOWN */}
                                    <div className="space-y-2">
                                        <Label>Status Proyek</Label>
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger className={
                                                status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    status === 'proposal' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''
                                            }>
                                                <SelectValue placeholder="Pilih Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="proposal">Proposal</SelectItem>
                                                <SelectItem value="active">Active (Deal)</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="on_hold">On Hold</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Jenis Project</Label>
                                        <Select defaultValue={project.type || "pendampingan"}>
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
                                </div>

                                <div className="space-y-2">
                                    <Label>Nama Project</Label>
                                    <Input defaultValue={project.name} placeholder="Contoh: Pendampingan UMKM Jahe Merah" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Divisi Pelaksana</Label>
                                    <Select defaultValue={project.division_code}>
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
                                <CardDescription>Perbarui penanggung jawab dan tim pelaksana.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label>Account Manager</Label>
                                        <Select defaultValue={project.team?.am}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Account Manager" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Budi Santoso">Budi Santoso</SelectItem>
                                                <SelectItem value="Andi Pratama">Andi Pratama</SelectItem>
                                                <SelectItem value="Citra Kirana">Citra Kirana</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Head Implementation</Label>
                                        <Select defaultValue={project.team?.head}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Head Implementation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Siti Aminah">Siti Aminah</SelectItem>
                                                <SelectItem value="Dewi Lestari">Dewi Lestari</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>PIC Project</Label>
                                        <Select defaultValue={project.team?.pic}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih PIC Project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Rudi Hermawan">Rudi Hermawan</SelectItem>
                                                <SelectItem value="Fajar Nugraha">Fajar Nugraha</SelectItem>
                                                <SelectItem value="Gita Gutawa">Gita Gutawa</SelectItem>
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
                                <CardTitle>Detail & Proposal Project</CardTitle>
                                <CardDescription>Lingkup kerja dan durasi proyek.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                <div className="space-y-2">
                                    <Label>{status === 'active' ? 'Dokumen Scope of Work (SOW)' : 'Dokumen Proposal Project'} <span className="text-red-500">*</span></Label>
                                    <div className="border rounded-lg p-6 space-y-4 hover:bg-muted/30 transition-colors bg-white">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                {status === 'active' ? 'Upload dokumen SOW yang telah disepakati (PDF).' : 'Upload dokumen Proposal lengkap (PDF).'}
                                            </p>
                                        </div>
                                        <FileUploadDropzone />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Timeline (Durasi)</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-normal text-muted-foreground">Tanggal Mulai</Label>
                                            <Input type="date" className="bg-white" defaultValue={project.start_date} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-normal text-muted-foreground">Tanggal Selesai</Label>
                                            <Input type="date" className="bg-white" defaultValue={project.end_date} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground pt-1">Estimasi durasi pelaksanaan.</p>
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
                                <CardDescription>Kelola titik lokasi proyek (Multi-location).</CardDescription>
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
                                        <div className="border rounded-lg p-1 bg-white h-full min-h-[400px]">
                                            <LocationPicker
                                                onLocationSelect={(lat, lng, address) => addLocation(lat, lng, address)}
                                                initialLat={locations[0]?.lat || -6.200000}
                                                initialLng={locations[0]?.lng || 106.816666}
                                                existingLocations={locations}
                                            />
                                        </div>
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
                                {/* Main Budget Section */}
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
                                <div className="space-y-2 pt-2">
                                    <Label>Rincian Anggaran</Label>
                                    <div className="border border-dashed border-gray-300 rounded-lg p-6 space-y-4 hover:bg-gray-50 transition-colors bg-white">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-50 rounded-full text-blue-600 border border-blue-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-spreadsheet"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M8 13h2" /><path d="M8 17h2" /><path d="M14 13h2" /><path d="M14 17h2" /></svg>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-medium text-gray-900">Upload File Excel / PDF</h4>
                                                <p className="text-xs text-muted-foreground">Lampirkan detai RAB (Rencana Anggaran Biaya) di sini.</p>
                                            </div>
                                        </div>
                                        <FileUploadDropzone />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl">
                                <Button variant="outline" onClick={() => setStep('location')} title="Kembali">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                                </Button>
                                <Button className="w-auto px-8 min-w-32 bg-green-600 hover:bg-green-700">
                                    Simpan Perubahan
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </AppSidebarLayout>
    )
}
