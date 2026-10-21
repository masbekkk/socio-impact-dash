import { useState, type FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, Plus, Trash2 } from 'lucide-react';

interface ProjectInfo {
    uuid: string;
    code: string;
    initial_project: string | null;
    name: string;
}

interface Monitoring {
    id: number;
    report_date: string;
    notes: string | null;
    creator_name: string | null;
    documents: { id: number; title: string | null; original_name: string; url: string | null; upload_status: string }[];
}

interface ReportFile {
    id: number;
    title: string;
    file: File | null;
}

export default function EmployeeProjectShow({ project, monitorings }: { project: ProjectInfo; monitorings: Monitoring[] }) {
    const [date, setDate] = useState(new Date().toLocaleDateString('sv-SE'));
    const [notes, setNotes] = useState('');
    const [files, setFiles] = useState<ReportFile[]>([{ id: 1, title: '', file: null }]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
    const [activeTab, setActiveTab] = useState('laporan');

    const submitReport = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData();
        data.append('report_date', date);
        data.append('notes', notes);
        files.filter((entry) => entry.file).forEach((entry, index) => {
            data.append(`documents[${index}][file]`, entry.file as File);
            if (entry.title) data.append(`documents[${index}][title]`, entry.title);
        });

        setSubmitting(true);
        setMessage(null);
        try {
            await axios.post(`/api/v1/projects/${project.uuid}/monitorings`, data);
            setNotes('');
            setFiles([{ id: Date.now(), title: '', file: null }]);
            setMessage({ text: 'Laporan berhasil dikirim.', error: false });
            setActiveTab('monitoring');
            router.reload({ only: ['monitorings'] });
        } catch {
            setMessage({ text: 'Gagal mengirim laporan. Periksa tanggal dan lampiran, lalu coba lagi.', error: true });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Proyek', href: '/projects' }, { title: project.name, href: `/projects/${project.uuid}` }]}>
            <Head title={`Laporan ${project.name}`} />
            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-8">
                <div className="space-y-2">
                    <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="size-4" /> Kembali ke daftar proyek
                    </Link>
                    <h1 className="text-2xl font-semibold">{[project.code, project.initial_project, project.name].filter(Boolean).join(' - ')}</h1>
                </div>

                {message && <p role="status" className={`rounded-lg border p-3 text-sm ${message.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>{message.text}</p>}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="laporan">Laporan</TabsTrigger>
                        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                    </TabsList>
                    <TabsContent value="laporan" className="mt-4 space-y-6">
                        <Card>
                            <CardHeader><CardTitle className="text-lg">Isi Laporan Proyek</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={submitReport} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="report-date">Tanggal Laporan</Label>
                                        <Input id="report-date" type="date" required value={date} onChange={(event) => setDate(event.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="report-notes">Catatan / Kendala / Progres</Label>
                                        <Textarea id="report-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Tuliskan perkembangan proyek" rows={5} />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <Label>Lampiran Dokumen</Label>
                                            <Button type="button" variant="outline" size="sm" onClick={() => setFiles([...files, { id: Date.now(), title: '', file: null }])}>
                                                <Plus className="mr-1 size-4" /> Tambah File
                                            </Button>
                                        </div>
                                        {files.map((entry) => (
                                            <div key={entry.id} className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto]">
                                                <Input aria-label="Judul dokumen" placeholder="Judul dokumen" value={entry.title} onChange={(event) => setFiles(files.map((file) => file.id === entry.id ? { ...file, title: event.target.value } : file))} />
                                                <Input aria-label="Pilih file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setFiles(files.map((file) => file.id === entry.id ? { ...file, file: event.target.files?.[0] || null } : file))} />
                                                <Button type="button" variant="ghost" size="icon" aria-label="Hapus baris file" onClick={() => setFiles(files.filter((file) => file.id !== entry.id))}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="submit" disabled={submitting}>{submitting ? 'Mengirim...' : 'Kirim Laporan'}</Button>
                                </form>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Dokumen yang Sudah Diunggah</CardTitle>
                                <p className="text-sm text-muted-foreground">Periksa daftar laporan dan lampiran proyek ini sebelum mengunggah dokumen baru.</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {monitorings.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Belum ada laporan atau dokumen yang diunggah.</p>
                                ) : monitorings.map((report) => (
                                    <div key={report.id} className="rounded-lg border p-4 space-y-2">
                                        <p className="text-sm font-medium">
                                            {new Date(report.report_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            <span className="ml-2 font-normal text-muted-foreground">oleh {report.creator_name || '-'}</span>
                                        </p>
                                        {report.notes && <p className="line-clamp-2 text-sm text-muted-foreground">{report.notes}</p>}
                                        {report.documents.length === 0 ? (
                                            <p className="text-xs text-muted-foreground">Tanpa lampiran</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                {report.documents.map((document) => document.url ? (
                                                    <a key={document.id} href={document.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary underline-offset-2 hover:underline">
                                                        <FileText className="size-4" /> {document.title || document.original_name}
                                                    </a>
                                                ) : (
                                                    <span key={document.id} className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                                                        <FileText className="size-4" /> {document.title || document.original_name} ({document.upload_status === 'failed' ? 'gagal diunggah' : 'sedang diproses'})
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {monitorings.length > 0 && (
                                    <Button type="button" variant="link" className="px-0" onClick={() => setActiveTab('monitoring')}>
                                        Lihat riwayat monitoring lengkap
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="monitoring" className="mt-4 space-y-3">
                        {monitorings.length === 0 ? (
                            <p className="rounded-lg border p-6 text-sm text-muted-foreground">Belum ada laporan monitoring.</p>
                        ) : monitorings.map((report) => (
                            <Card key={report.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">{new Date(report.report_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</CardTitle>
                                    <p className="text-xs text-muted-foreground">Dilaporkan oleh {report.creator_name || '-'}</p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="whitespace-pre-wrap text-sm">{report.notes || '-'}</p>
                                    {report.documents.map((document) => document.url ? (
                                        <a key={document.id} href={document.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary underline-offset-2 hover:underline">
                                            <FileText className="size-4" /> {document.title || document.original_name}
                                        </a>
                                    ) : (
                                        <span key={document.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <FileText className="size-4" /> {document.title || document.original_name} ({document.upload_status === 'failed' ? 'gagal diunggah' : 'sedang diproses'})
                                        </span>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </AppSidebarLayout>
    );
}
