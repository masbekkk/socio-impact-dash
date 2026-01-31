import React, { useState } from 'react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import PageHeader from '@/components/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FileUploadDropzone from '@/components/FileUploadDropzone'
import BudgetEditor from '@/components/BudgetEditor'
import { Button } from '@/components/ui/button'

export default function ProjectsEdit({ project, divisions }: { project: any, divisions: any[] }) {
    const [step, setStep] = useState('basic')
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Proyek', href: '/projects' },
        { title: 'Edit Proyek', href: '#' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <div className="p-4 md:p-8 pb-0">
                <PageHeader title={`Edit: ${project.name}`} description="Perbarui detail proyek." />
            </div>

            <Tabs value={step} onValueChange={(v) => setStep(v)} className="max-w-5xl mx-auto pb-10 px-4 md:px-0">
                <div
                    className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide mb-6"
                    ref={(el) => { if (el) (window as any).editTabs = el }}
                >
                    <TabsList className="inline-flex h-auto p-1 bg-muted/50 w-auto min-w-full md:w-full md:min-w-0 md:grid md:grid-cols-5">
                        {['basic', 'stakeholders', 'detail', 'budget', 'docs'].map((tabValue, idx) => (
                            <TabsTrigger
                                key={tabValue}
                                value={tabValue}
                                className="data-[state=active]:bg-background flex-1 px-6 py-2 whitespace-nowrap"
                                onClick={(e) => {
                                    const container = (window as any).editTabs;
                                    if (container) {
                                        const target = e.currentTarget;
                                        container.scrollTo({
                                            left: target.offsetLeft - (container.offsetWidth / 2) + (target.offsetWidth / 2),
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                            >
                                {idx + 1}. {tabValue === 'basic' ? 'Identitas' : tabValue === 'stakeholders' ? 'Stakeholder' : tabValue === 'detail' ? 'Detail & SOW' : tabValue === 'budget' ? 'Budget' : 'Dokumen'}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Step 1: Identitas */}
                <TabsContent value="basic">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                            <CardDescription>Masukkan detail utama proyek.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                <div className="space-y-2">
                                    <Label>Divisi</Label>
                                    <Select defaultValue={project.division_code}>
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
                                <Input defaultValue={project.name} placeholder="Contoh: Pendampingan UMKM Jahe Merah" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => setStep('stakeholders')}>Selanjutnya</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Step 2: Stakeholders */}
                <TabsContent value="stakeholders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tim & Stakeholder</CardTitle>
                            <CardDescription>Tentukan penanggung jawab dan tim pelaksana.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label>Account Manager</Label>
                                    <Input defaultValue={project.team?.am} placeholder="Nama Account Manager" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Head Implementation</Label>
                                    <Input defaultValue={project.team?.head} placeholder="Nama Head Implementation" />
                                </div>
                                <div className="space-y-2">
                                    <Label>PIC Project</Label>
                                    <Input defaultValue={project.team?.pic} placeholder="Nama PIC Project" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep('basic')}>Kembali</Button>
                            <Button onClick={() => setStep('detail')}>Selanjutnya</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Step 3: Detail */}
                <TabsContent value="detail">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Pekerjaan</CardTitle>
                            <CardDescription>Lingkup kerja dan durasi proyek.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Scope of Work (SOW)</Label>
                                <Textarea defaultValue={project.sow} placeholder="Deskripsikan ruang lingkup pekerjaan..." rows={8} className="resize-none" />
                            </div>

                            <div className="space-y-2">
                                <Label>Timeline (Durasi)</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-normal text-muted-foreground">Tanggal Mulai</Label>
                                        <Input type="date" defaultValue={project.start_date} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-normal text-muted-foreground">Tanggal Selesai</Label>
                                        <Input type="date" defaultValue={project.end_date} />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground pt-1">Sesuaikan dengan tanggal SPK.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep('stakeholders')}>Kembali</Button>
                            <Button onClick={() => setStep('budget')}>Selanjutnya</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Step 4: Budget */}
                <TabsContent value="budget">
                    <Card>
                        <CardHeader>
                            <CardTitle>Anggaran & Keuangan</CardTitle>
                            <CardDescription>Rincian budget dan proyeksi keuangan proyek.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Budget Project & Proyeksi</Label>
                                {/* Note: BudgetEditor currently manages its own state, passing initialBudget might be needed for Edit mode */}
                                <BudgetEditor />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep('detail')}>Kembali</Button>
                            <Button onClick={() => setStep('docs')}>Selanjutnya</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Step 5: Dokumen */}
                <TabsContent value="docs">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dokumen Pendukung</CardTitle>
                            <CardDescription>Upload dokumen legalitas dan proposal.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
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
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep('budget')}>Kembali</Button>
                            <Button className="min-w-32">Simpan Perubahan</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

            </Tabs>
        </AppSidebarLayout>
    )
}
