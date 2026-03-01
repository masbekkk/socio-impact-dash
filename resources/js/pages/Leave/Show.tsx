import React, { useState, useEffect, useCallback } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, Briefcase, FileText, ChevronDown, CheckCircle, XCircle, MapPin, Plane, Loader2, Phone, Download } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import axios from 'axios';

interface LeaveData {
    id: number;
    code: string;
    type: string;
    status: string;
    start_date: string;
    end_date: string;
    phone: string | null;
    destination: string | null;
    lokasi: string | null;
    reason: string | null;
    attachment_path: string | null;
    project: { id: number; code: string; name: string } | null;
    replacement_pic: { id: number; name: string; email: string } | null;
    user: { id: number; name: string; email: string } | null;
    approvals: {
        id: number;
        role: string;
        status: string;
        notes: string | null;
        approved_at: string | null;
        approver: { id: number; name: string; email: string } | null;
    }[];
    created_at: string;
    updated_at: string;
}

interface Props {
    leaveCode: string;
    authUser: {
        id: number;
        can_approve: boolean;
        can_reject: boolean;
    };
}

const LEAVE_TYPE_LABELS: Record<string, string> = {
    annual: 'Cuti Tahunan',
    sick: 'Cuti Sakit',
    unpaid: 'Cuti Tanpa Gaji',
    travel: 'Perjalanan Dinas',
    berduka: 'Cuti Berduka',
    wedding: 'Cuti Menikah',
    birth: 'Cuti Melahirkan',
    important: 'Cuti Alasan Penting',
};

function durationDays(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    if (s > e) return 0;

    let days = 0;
    const curr = new Date(s);
    while (curr <= e) {
        const day = curr.getDay();
        if (day !== 0 && day !== 6) {
            days++;
        }
        curr.setDate(curr.getDate() + 1);
    }
    return days;
}

export default function LeaveShow({ leaveCode, authUser }: Props) {
    const [leave, setLeave] = useState<LeaveData | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'approve' | 'reject' | null }>({
        open: false,
        type: null,
    });
    const [notes, setNotes] = useState('');

    const fetchLeave = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/leaves/${leaveCode}`);
            setLeave(res.data.data);
        } catch {
            setLeave(null);
        } finally {
            setLoading(false);
        }
    }, [leaveCode]);

    useEffect(() => { fetchLeave(); }, [fetchLeave]);

    const isTravel = leave?.type === 'travel' || !!leave?.destination;

    const handleActionConfirm = async () => {
        if (!actionDialog.type || !leave) return;
        setActionLoading(true);
        try {
            await axios.post(`/api/v1/leaves/${leave.code}/status`, {
                action: actionDialog.type,
                notes: notes || null,
            });
            setActionDialog({ open: false, type: null });
            setNotes('');
            await fetchLeave();
        } catch {
            // handle silently
        } finally {
            setActionLoading(false);
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Cuti & Dinas', href: '/leaves' },
        { title: isTravel ? 'Detail Dinas Luar' : 'Detail Cuti', href: '#' },
    ];

    if (loading) {
        return (
            <AppSidebarLayout breadcrumbs={breadcrumbs}>
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AppSidebarLayout>
        );
    }

    if (!leave) {
        return (
            <AppSidebarLayout breadcrumbs={breadcrumbs}>
                <div className="p-10 text-center">
                    <h2 className="text-lg font-semibold">Data Tidak Ditemukan</h2>
                    <Button asChild className="mt-4" variant="outline"><Link href="/leaves">Kembali</Link></Button>
                </div>
            </AppSidebarLayout>
        );
    }

    const duration = durationDays(leave.start_date, leave.end_date);
    const isOwner = leave.user?.id === authUser.id;
    const canAction = leave.status === 'submitted'
        && !isOwner
        && (authUser.can_approve || authUser.can_reject);

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${isTravel ? 'Dinas Luar' : 'Cuti'} - ${leave.user?.name ?? 'Unknown'}`} />

            <div className="p-6 md:p-10 w-full mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="-ml-2">
                            <Link href="/leaves"><ArrowLeft className="h-5 w-5" /></Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {isTravel ? 'Detail Dinas Luar' : 'Detail Cuti'}
                            </h1>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                <FileText className="h-3.5 w-3.5" /> {leave.code}
                                <span className="text-gray-300">|</span>
                                <Calendar className="h-3.5 w-3.5" /> {format(new Date(leave.created_at), 'dd MMM yyyy HH:mm', { locale: localeId })}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={leave.status as 'submitted' | 'head_approved' | 'hr_approved' | 'superadmin_approved' | 'rejected' | 'draft'} />
                        {canAction && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        Aksi <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {authUser.can_approve && (
                                        <DropdownMenuItem className="text-emerald-600 focus:text-emerald-600 cursor-pointer" onClick={() => setActionDialog({ open: true, type: 'approve' })}>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Setujui
                                        </DropdownMenuItem>
                                    )}
                                    {authUser.can_approve && authUser.can_reject && <DropdownMenuSeparator />}
                                    {authUser.can_reject && (
                                        <DropdownMenuItem className="text-rose-600 focus:text-rose-600 cursor-pointer" onClick={() => setActionDialog({ open: true, type: 'reject' })}>
                                            <XCircle className="mr-2 h-4 w-4" /> Tolak
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {isTravel ? 'Detail Perjalanan Dinas' : 'Detail Pengajuan Cuti'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {leave.project && (
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">Nama Project</h4>
                                        <div className="flex items-center gap-2 font-medium text-base">
                                            <Briefcase className="h-4 w-4 text-primary" />
                                            {leave.project.name}
                                        </div>
                                    </div>
                                )}

                                {isTravel ? (
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">Kota / Negara Tujuan</h4>
                                        <div className="flex items-center gap-2 font-medium text-base">
                                            <Plane className="h-4 w-4 text-primary" />
                                            {leave.destination}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">Jenis Cuti</h4>
                                        <div className="flex items-center gap-2 font-medium text-base">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            {LEAVE_TYPE_LABELS[leave.type] ?? leave.type}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">{isTravel ? 'Tanggal Berangkat' : 'Tanggal Mulai'}</h4>
                                        <p className="text-sm font-medium">{format(new Date(leave.start_date), 'dd MMMM yyyy', { locale: localeId })}</p>
                                    </div>
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">{isTravel ? 'Tanggal Kembali' : 'Tanggal Selesai'}</h4>
                                        <p className="text-sm font-medium">{format(new Date(leave.end_date), 'dd MMMM yyyy', { locale: localeId })}</p>
                                    </div>
                                </div>

                                <div className="grid gap-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">{isTravel ? 'Total Hari' : 'Durasi'}</h4>
                                    <p className="text-sm font-medium">{duration} Hari</p>
                                </div>

                                {leave.reason && (
                                    <div className="grid gap-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">{isTravel ? 'Agenda / Keperluan' : 'Alasan Cuti'}</h4>
                                        <p className="text-sm leading-relaxed bg-muted/30 p-4 rounded-lg border">{leave.reason}</p>
                                    </div>
                                )}

                                {leave.lokasi && (
                                    <div className="grid gap-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">{isTravel ? 'Alamat Penginapan / Tujuan' : 'Alamat Selama Cuti'}</h4>
                                        <div className="flex gap-2 text-sm text-foreground/80">
                                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            {leave.lokasi}
                                        </div>
                                    </div>
                                )}

                                {leave.replacement_pic && (
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">Pengganti PIC</h4>
                                        <p className="text-sm font-medium">{leave.replacement_pic.name}</p>
                                    </div>
                                )}

                                {leave.phone && (
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">No. HP</h4>
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            {leave.phone}
                                        </div>
                                    </div>
                                )}

                                {leave.attachment_path && (
                                    <div className="grid gap-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">Dokumen Pendukung</h4>
                                        <a
                                            href={`/storage/${leave.attachment_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-primary/5 px-4 py-3 rounded-lg border border-primary/10 w-fit"
                                        >
                                            <Download className="h-4 w-4" />
                                            Unduh Lampiran
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Approval History */}
                        {leave.approvals && leave.approvals.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Riwayat Persetujuan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {leave.approvals.map((a) => (
                                        <div key={a.id} className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
                                            {a.status === 'approved' ? (
                                                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-rose-600 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {a.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                                                    <span className="text-xs text-muted-foreground ml-2">({a.role})</span>
                                                </p>
                                                {a.approver && (
                                                    <p className="text-sm text-muted-foreground mt-1">oleh {a.approver.name}</p>
                                                )}
                                                {a.approved_at && (
                                                    <p className="text-xs text-muted-foreground">{format(new Date(a.approved_at), 'dd MMM yyyy HH:mm', { locale: localeId })}</p>
                                                )}
                                                {a.notes && (
                                                    <div className="mt-3 pt-3 border-t">
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Catatan:</p>
                                                        <p className="text-sm">{a.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Informasi Karyawan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {leave.user?.name?.charAt(0) ?? 'U'}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold">{leave.user?.name ?? 'Unknown User'}</p>
                                        <p className="text-xs text-muted-foreground">{leave.user?.email ?? '-'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Pengajuan Dibuat</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(leave.created_at), 'dd MMM yyyy HH:mm', { locale: localeId })}</p>
                                    </div>
                                </div>
                                {leave.approvals?.map((a) => (
                                    <div key={a.id} className="flex items-center gap-3 text-sm">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${a.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {a.status === 'approved' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="font-medium">{a.status === 'approved' ? 'Disetujui' : 'Ditolak'} ({a.role})</p>
                                            <p className="text-xs text-muted-foreground">
                                                {a.approved_at ? format(new Date(a.approved_at), 'dd MMM yyyy HH:mm', { locale: localeId }) : '-'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Action Dialog */}
            <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog(prev => ({ ...prev, open: false }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {actionDialog.type === 'approve' ? (
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                            ) : (
                                <XCircle className="h-5 w-5 text-rose-600" />
                            )}
                            Konfirmasi Aksi
                        </DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin {actionDialog.type === 'approve' ? 'menyetujui' : 'menolak'} {isTravel ? 'perjalanan dinas' : 'cuti'} dari <b>{leave.user?.name}</b>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            {isTravel ? `Tujuan: ${leave.destination}` : `Jenis: ${LEAVE_TYPE_LABELS[leave.type] ?? leave.type}`}<br />
                            Durasi: {format(new Date(leave.start_date), 'dd MMM yyyy', { locale: localeId })} - {format(new Date(leave.end_date), 'dd MMM yyyy', { locale: localeId })} ({duration} Hari)
                        </p>
                        <Textarea
                            placeholder={actionDialog.type === 'reject' ? 'Alasan penolakan...' : 'Catatan persetujuan (opsional)'}
                            className="mt-4"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialog(prev => ({ ...prev, open: false }))} disabled={actionLoading}>
                            Batal
                        </Button>
                        <Button
                            variant={actionDialog.type === 'approve' ? 'default' : 'destructive'}
                            onClick={handleActionConfirm}
                            className="gap-2"
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</>
                            ) : actionDialog.type === 'approve' ? (
                                <><CheckCircle className="h-4 w-4" /> Setujui</>
                            ) : (
                                <><XCircle className="h-4 w-4" /> Tolak</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
