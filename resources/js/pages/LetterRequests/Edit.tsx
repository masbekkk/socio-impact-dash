import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, User as UserIcon, FileText, Loader2, History, MessageSquare, Clock } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from '@/components/SearchableSelect';
import DatePicker from '@/components/DatePicker';
import { format } from "date-fns";
import { id } from "date-fns/locale";
import axios from 'axios';
import { SharedData } from '@/types';
import { usePermission } from '@/hooks/use-permission';

interface LetterRequestLog {
    id: number;
    user_id: number | null;
    action: string;
    changes: Record<string, { old: unknown; new: unknown }> | null;
    reason: string | null;
    note: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
    } | null;
}

interface Project {
    id: number;
    name: string;
    code: string;
    initial_project: string;
}

interface MasterData {
    id: number;
    code: string;
    description?: string;
}

interface DivisionCodeItem {
    id: number;
    code: string;
    name: string;
}

interface DivisionItem {
    id: number;
    division_code?: DivisionCodeItem | null;
}

interface Props {
    projects: Project[];
    letterRequestId: string;
}

export default function Edit({ projects, letterRequestId }: Props) {
    const { auth } = usePage<SharedData>().props;
    const { hasRole } = usePermission();
    const userRole = auth.user.role_name;

    const [data, setData] = useState({
        project_id: '',
        letter_date: '',
        recipient: '',
        subject: '',
        pic_id: '',
        letter_code_id: '',
        letter_division_id: '',
        division_id: '',
        keterangan: '',
        status: '',
        reason: '',
    });

    const [logs, setLogs] = useState<LetterRequestLog[]>([]);
    const [letterCodes, setLetterCodes] = useState<MasterData[]>([]);
    const [letterDivisions, setLetterDivisions] = useState<MasterData[]>([]);
    const [divisions, setDivisions] = useState<DivisionItem[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [codesRes, divisionsRes, mainDivRes, requestRes] = await Promise.all([
                    axios.get('/api/v1/letter-codes'),
                    axios.get('/api/v1/letter-divisions'),
                    axios.get('/api/v1/divisions?per_page=1000'),
                    axios.get(`/api/v1/letter-requests/${letterRequestId}`)
                ]);

                setLetterCodes(codesRes.data.data);

                // Filter letter divisions based on role
                const allLetterDivs = divisionsRes.data.data;
                const filteredDivCodes: string[] = [];

                if (hasRole(['direktur', 'superadmin'])) {
                    filteredDivCodes.push('Direktur', 'Finance', 'HCM', 'BOD');
                }
                if (hasRole('hr')) {
                    filteredDivCodes.push('HR', 'HCM');
                }
                if (hasRole('finance')) {
                    filteredDivCodes.push('Finance', 'FA');
                }

                // If no special roles, or if head is one of the roles, ensure PM is included
                // (or if they have none of the above, they get PM as default)
                if (hasRole('head') || filteredDivCodes.length === 0) {
                    filteredDivCodes.push('PM');
                }

                // Deduplicate codes
                const uniqueCodes = [...new Set(filteredDivCodes)];

                const filteredLetterDivs = allLetterDivs.filter((d: MasterData) =>
                    uniqueCodes.includes(d.code)
                );

                setLetterDivisions(filteredLetterDivs);
                setDivisions(mainDivRes.data.data.data);

                const reqData = requestRes.data.data;
                setLogs(reqData.logs || []);
                setData({
                    project_id: reqData.project_id?.toString() || '',
                    letter_date: reqData.letter_date ? format(new Date(reqData.letter_date), 'yyyy-MM-dd') : '',
                    recipient: reqData.recipient || '',
                    subject: reqData.subject || '',
                    pic_id: reqData.pic_id?.toString() || '',
                    letter_code_id: reqData.letter_code_id?.toString() || '',
                    letter_division_id: reqData.letter_division_id?.toString() || '',
                    division_id: reqData.division_id?.toString() || '',
                    keterangan: reqData.keterangan || '',
                    status: reqData.status || 'unused',
                    reason: '',
                });

            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Gagal memuat data nomor surat.");
                router.visit('/letter-requests');
            } finally {
                setLoadingData(false);
            }
        };
        fetchAllData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [letterRequestId, userRole]);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Nomor Surat', href: '/letter-requests' },
        { title: 'Edit Nomor Surat', href: `/letter-requests/${letterRequestId}/edit` },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.put(`/api/v1/letter-requests/${letterRequestId}`, data);
            router.visit('/letter-requests');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response && error.response.data.errors) {
                setErrors(error.response.data.errors as Record<string, string[]>);
            } else {
                console.error("Error updating letter request:", error);
                alert("Terjadi kesalahan saat memperbarui nomor surat.");
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Nomor Surat" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="-ml-2">
                        <Link href="/letter-requests">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Edit Nomor Surat</h1>
                        <p className="text-muted-foreground text-sm">Perbarui detail nomor surat Anda.</p>
                    </div>
                </div>

                <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="bg-white">
                            <CardTitle>Informasi Surat</CardTitle>
                            <CardDescription>Ubah tujuan dan perihal surat atau data lainnya.</CardDescription>
                        </CardHeader>

                        {loadingData ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="project_id">Proyek Terkait <span className="text-red-500">*</span></Label>
                                        <SearchableSelect
                                            options={projects.map(p => ({ value: p.id.toString(), label: `${p.code} - ${p.initial_project} - ${p.name}` }))}
                                            value={data.project_id}
                                            onValueChange={(val) => setData({ ...data, project_id: val })}
                                            placeholder="Pilih proyek"
                                        />
                                        {errors.project_id && <p className="text-sm text-destructive font-medium">{errors.project_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="letter_date">Tanggal Surat <span className="text-red-500">*</span></Label>
                                        <DatePicker
                                            value={data.letter_date}
                                            onChange={(v) => setData({ ...data, letter_date: v })}
                                            max={format(new Date(), 'yyyy-MM-dd')}
                                        />
                                        {errors.letter_date && <p className="text-sm text-destructive font-medium">{errors.letter_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="letter_code_id">Kode Surat <span className="text-red-500">*</span></Label>
                                        <SearchableSelect
                                            options={letterCodes.map(code => ({
                                                value: code.id.toString(),
                                                label: `${code.code} ${code.description ? `- ${code.description}` : ''}`
                                            }))}
                                            value={data.letter_code_id}
                                            onValueChange={(val) => setData({ ...data, letter_code_id: val })}
                                            placeholder="Pilih kode surat"
                                        />
                                        {errors.letter_code_id && <p className="text-sm text-destructive font-medium">{errors.letter_code_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="letter_division_id">Divisi Surat <span className="text-red-500">*</span></Label>
                                        <SearchableSelect
                                            options={letterDivisions.map(div => ({
                                                value: div.id.toString(),
                                                label: `${div.code} ${div.description ? `- ${div.description}` : ''}`
                                            }))}
                                            value={data.letter_division_id}
                                            onValueChange={(val) => setData({ ...data, letter_division_id: val })}
                                            placeholder="Pilih divisi"
                                        />
                                        {errors.letter_division_id && <p className="text-sm text-destructive font-medium">{errors.letter_division_id}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="recipient">Surat Tertuju Kepada <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="recipient"
                                                placeholder="Contoh: Direktur PT Sinergi Alam"
                                                className="pl-9 h-10 w-full"
                                                value={data.recipient}
                                                onChange={(e) => setData({ ...data, recipient: e.target.value })}
                                            />
                                        </div>
                                        {errors.recipient && <p className="text-sm text-destructive font-medium">{errors.recipient}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="subject">Perihal <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="subject"
                                                placeholder="Contoh: Permohonan Izin Lokasi"
                                                className="pl-9 h-10 w-full"
                                                value={data.subject}
                                                onChange={(e) => setData({ ...data, subject: e.target.value })}
                                            />
                                        </div>
                                        {errors.subject && <p className="text-sm text-destructive font-medium">{errors.subject}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="division_id">Divisi Perusahaan <span className="text-red-500">*</span></Label>
                                        <SearchableSelect
                                            options={Array.from(new Map(divisions.map((d: DivisionItem) => [d.division_code?.id, d.division_code])).values())
                                                .filter((dc): dc is DivisionCodeItem => dc !== undefined && dc !== null)
                                                .map((dc: DivisionCodeItem) => ({
                                                    value: dc.id.toString(),
                                                    label: `${dc.code} - ${dc.name}`
                                                }))
                                            }
                                            value={data.division_id}
                                            onValueChange={(val) => setData({ ...data, division_id: val })}
                                            placeholder="Pilih divisi perusahaan"
                                        />
                                        {errors.division_id && <p className="text-sm text-destructive font-medium">{errors.division_id}</p>}
                                    </div>


                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                                        <Textarea
                                            id="keterangan"
                                            placeholder="Tambahkan keterangan tambahan jika ada..."
                                            className="min-h-[100px] w-full"
                                            value={data.keterangan}
                                            onChange={(e) => setData({ ...data, keterangan: e.target.value })}
                                        />
                                        {errors.keterangan && <p className="text-sm text-destructive font-medium">{errors.keterangan}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2 pt-2 border-t">
                                        <Label htmlFor="reason" className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                                            <MessageSquare className="h-4 w-4 text-amber-600" />
                                            Alasan Perubahan (Opsional)
                                        </Label>
                                        <Textarea
                                            id="reason"
                                            placeholder="Jelaskan alasan pengeditan data ini (misal: Tanggal pelaksanaan acara diundur, revisi tujuan surat, dsb.)..."
                                            className="min-h-[80px] w-full"
                                            value={data.reason}
                                            onChange={(e) => setData({ ...data, reason: e.target.value })}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Catatan ini akan tersimpan pada riwayat audit perubahan nomor surat.
                                        </p>
                                        {errors.reason && <p className="text-sm text-destructive font-medium">{errors.reason}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        )}
                        <CardFooter className="bg-gray-50 border-t flex justify-end gap-3 p-6 mt-4">
                            <Button variant="outline" type="button" asChild>
                                <Link href="/letter-requests">Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing || loadingData} className="bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)]/90">
                                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Simpan Perubahan
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Riwayat Perubahan */}
                <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="bg-white border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <History className="h-4 w-4 text-muted-foreground" />
                                    Riwayat Perubahan
                                </CardTitle>
                                <CardDescription className="text-xs">Catatan audit log setiap kali nomor surat ini diubah.</CardDescription>
                            </div>
                            {logs.length > 0 && (
                                <Badge variant="secondary" className="text-xs font-normal">
                                    {logs.length} catatan
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {loadingData ? (
                            <div className="flex justify-center items-center py-6 text-muted-foreground gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Memuat riwayat...
                            </div>
                        ) : logs.length > 0 ? (
                            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                                {logs.map((log) => {
                                    const isCreated = log.action === 'created';
                                    const isStatus = log.action === 'status_changed';
                                    const dotColor = isCreated
                                        ? 'bg-emerald-500'
                                        : isStatus
                                            ? 'bg-blue-500'
                                            : 'bg-amber-500';
                                    const actionBadge = isCreated
                                        ? 'Dibuat'
                                        : isStatus
                                            ? 'Status Diubah'
                                            : 'Diedit';

                                    return (
                                        <div key={log.id} className="relative text-xs">
                                            <div className={`absolute -left-6 top-1.5 h-2.5 w-2.5 rounded-full ${dotColor} ring-4 ring-white`} />
                                            <div className="bg-white border rounded-lg p-3.5 space-y-2 shadow-xs">
                                                <div className="flex items-center justify-between flex-wrap gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-900 flex items-center gap-1">
                                                            <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                            {log.user?.name || 'Sistem'}
                                                        </span>
                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                            {actionBadge}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                                                        <Clock className="h-3 w-3" />
                                                        {format(new Date(log.created_at), 'dd MMM yyyy, HH:mm', { locale: id })} WIB
                                                    </span>
                                                </div>

                                                {log.reason && (
                                                    <div className="bg-amber-50/70 border border-amber-200/70 rounded p-2 text-amber-900 flex items-start gap-2">
                                                        <MessageSquare className="h-3.5 w-3.5 mt-0.5 text-amber-600 shrink-0" />
                                                        <div>
                                                            <span className="font-semibold text-[11px] block text-amber-800">Alasan Perubahan:</span>
                                                            <p className="italic text-xs mt-0.5">{log.reason}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {log.note && (
                                                    <p className="text-gray-700 leading-relaxed font-medium bg-gray-50/70 p-2 rounded border border-gray-100">
                                                        {log.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-gray-50/50 space-y-1">
                                <History className="h-5 w-5 mx-auto text-muted-foreground opacity-50" />
                                <p className="text-xs font-medium">Belum ada riwayat perubahan tercatat.</p>
                                <p className="text-[11px] text-muted-foreground">Perubahan pada nomor surat ini akan otomatis terekam di sini.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
