import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileText } from 'lucide-react';

interface ProjectInfo {
    uuid: string;
    code: string;
    initial_project: string | null;
    name: string;
}

interface Termin {
    id: number;
    nominal: number;
    due_date: string | null;
    notes: string | null;
    nomor_surat: string | null;
    tertuju: string | null;
    verified_by: number | null;
    billing_document_url: string | null;
    proof_payment_url: string | null;
}

const rupiah = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

export default function TerminUpload({ project, termins }: { project: ProjectInfo; termins: Termin[] }) {
    const [savingTermId, setSavingTermId] = useState<number | null>(null);
    const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

    const updateTermin = async (termId: number, data: FormData | { is_verified: boolean }, successMessage: string) => {
        setSavingTermId(termId);
        setMessage(null);
        try {
            await axios.post(`/api/v1/projects/${project.uuid}/termins/${termId}`, data);
            setMessage({ text: successMessage, error: false });
            router.reload({ only: ['termins'] });
        } catch {
            setMessage({ text: 'Perubahan termin gagal disimpan. Periksa file dan coba lagi.', error: true });
        } finally {
            setSavingTermId(null);
        }
    };

    const upload = (termId: number, field: 'billing_file' | 'proof_file', file: File | undefined) => {
        if (!file) return;
        const data = new FormData();
        data.append(field, file);
        void updateTermin(termId, data, 'Dokumen termin berhasil diunggah.');
    };

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Proyek', href: '/projects' }, { title: 'Upload Termin', href: `/projects/${project.uuid}/termins` }]}>
            <Head title={`Upload Termin ${project.name}`} />
            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-8">
                <div className="space-y-2">
                    <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="size-4" /> Kembali ke daftar proyek
                    </Link>
                    <h1 className="text-2xl font-semibold">Upload Termin</h1>
                    <p className="text-sm text-muted-foreground">{[project.code, project.initial_project, project.name].filter(Boolean).join(' - ')}</p>
                </div>

                {message && <p role="status" className={`rounded-lg border p-3 text-sm ${message.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>{message.text}</p>}

                {termins.length === 0 ? (
                    <p className="rounded-lg border p-6 text-sm text-muted-foreground">Belum ada termin pembayaran untuk proyek ini.</p>
                ) : termins.map((term, index) => (
                    <Card key={term.id}>
                        <CardHeader className="flex flex-row items-start justify-between gap-3">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">Termin #{index + 1}</CardTitle>
                                <p className="text-sm text-muted-foreground">Jatuh tempo: {term.due_date ? new Date(term.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                            </div>
                            <span className="text-right font-mono text-sm font-semibold">{rupiah(Number(term.nominal))}</span>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid gap-3 text-sm sm:grid-cols-3">
                                <div><span className="text-muted-foreground">Deliverables</span><p>{term.notes || '-'}</p></div>
                                <div><span className="text-muted-foreground">Nomor Surat</span><p>{term.nomor_surat || '-'}</p></div>
                                <div><span className="text-muted-foreground">Tertuju</span><p>{term.tertuju || '-'}</p></div>
                            </div>
                            <div className="grid gap-5 border-t pt-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor={`billing-${term.id}`}>Dokumen Penagihan</Label>
                                    {term.billing_document_url && (
                                        <a href={term.billing_document_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary underline-offset-2 hover:underline">
                                            <FileText className="size-4" /> Lihat dokumen yang sudah diunggah
                                        </a>
                                    )}
                                    <Input
                                        id={`billing-${term.id}`}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        aria-label={term.billing_document_url ? 'Ganti dokumen penagihan' : 'Upload dokumen penagihan'}
                                        disabled={savingTermId === term.id}
                                        onChange={(event) => { upload(term.id, 'billing_file', event.target.files?.[0]); event.target.value = ''; }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`proof-${term.id}`}>Bukti Pembayaran</Label>
                                    {term.proof_payment_url && (
                                        <a href={term.proof_payment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary underline-offset-2 hover:underline">
                                            <FileText className="size-4" /> Lihat bukti yang sudah diunggah
                                        </a>
                                    )}
                                    <Input
                                        id={`proof-${term.id}`}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        aria-label={term.proof_payment_url ? 'Ganti bukti pembayaran' : 'Upload bukti pembayaran'}
                                        disabled={savingTermId === term.id}
                                        onChange={(event) => { upload(term.id, 'proof_file', event.target.files?.[0]); event.target.value = ''; }}
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 border-t pt-4 text-sm">
                                <input
                                    type="checkbox"
                                    checked={Boolean(term.verified_by)}
                                    disabled={savingTermId === term.id}
                                    onChange={() => void updateTermin(term.id, { is_verified: !term.verified_by }, 'Status verifikasi termin diperbarui.')}
                                />
                                Pembayaran terverifikasi
                            </label>
                            <p className="text-xs text-muted-foreground">Format: PDF, JPG, atau PNG. Maksimum 50 MB per file.</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AppSidebarLayout>
    );
}
