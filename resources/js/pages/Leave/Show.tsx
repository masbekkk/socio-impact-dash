import React, { useState, useEffect, useCallback } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft, Calendar, Briefcase, FileText, CheckCircle, XCircle,
    MapPin, Plane, Loader2, Phone, Download, Edit, Trash2, Save, X, Plus,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { Separator } from '@/components/ui/separator';
import FileUploadDropzone from '@/components/FileUploadDropzone';
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
import DatePicker from '@/components/DatePicker';
import axios from 'axios';
import { SearchableSelect } from '@/components/SearchableSelect';

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
        name: string;
        nip: string;
        email: string;
        division_name: string;
        position: string;
        join_date: string;
        remaining_annual_leaves?: number;
        is_pegawai?: boolean;
        can_approve: boolean;
        can_reject: boolean;
        can_delete: boolean;
        is_owner: boolean;
    };
    submitterRemainingLeaves: number;
    projects: { id: number; code: string; name: string }[];
    users: { id: number; name: string; email: string }[];
    approvers: Record<string, { id: number; name: string; email: string }[]>;
}

const LEAVE_TYPES = [
    { label: 'Cuti Tahunan', value: 'annual' },
    { label: 'Cuti Sakit', value: 'sick' },
    { label: 'Cuti Menikah', value: 'wedding' },
    { label: 'Cuti Melahirkan', value: 'birth' },
    { label: 'Cuti Berduka', value: 'berduka' },
    { label: 'Cuti Alasan Penting', value: 'important' },
    { label: 'Cuti Tanpa Gaji', value: 'unpaid' },
];

const LEAVE_TYPE_LABELS: Record<string, string> = Object.fromEntries(LEAVE_TYPES.map(t => [t.value, t.label]));

function durationDays(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    if (s > e) return 0;
    let days = 0;
    const curr = new Date(s);
    while (curr <= e) {
        const day = curr.getDay();
        if (day !== 0 && day !== 6) days++;
        curr.setDate(curr.getDate() + 1);
    }
    return days;
}

export default function LeaveShow({ leaveCode, authUser, submitterRemainingLeaves, projects, users, approvers }: Props) {
    const [leave, setLeave] = useState<LeaveData | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'approve' | 'reject' | 'revision' | null }>({
        open: false,
        type: null,
    });
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [notes, setNotes] = useState('');

    // Edit mode state
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({
        type: '',
        project_id: '',
        replacement_pic_id: '',
        approver_head_id: '',
        start_date: '',
        end_date: '',
        phone: '',
        lokasi: '',
        reason: '',
    });
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editErrors, setEditErrors] = useState<Record<string, string[]>>({});

    const fetchLeave = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/leaves/${leaveCode}`);
            const data = res.data.data;
            setLeave(data);
            setEditForm({
                type: data.type ?? '',
                project_id: data.project?.id?.toString() ?? '',
                replacement_pic_id: data.replacement_pic?.id?.toString() ?? '',
                approver_head_id: data.approvals?.find((a: any) => a.role === 'head')?.approver?.id?.toString() ?? '',
                start_date: data.start_date ?? '',
                end_date: data.end_date ?? '',
                phone: data.phone ?? '',
                lokasi: data.lokasi ?? '',
                reason: data.reason ?? '',
            });
        } catch {
            setLeave(null);
        } finally {
            setLoading(false);
        }
    }, [leaveCode]);

    useEffect(() => { fetchLeave(); }, [fetchLeave]);

    const isTravel = leave?.type === 'travel' || !!leave?.destination;
    const canRevisionEdit = authUser.is_owner && leave?.status === 'revision';

    const canAction = (() => {
        if (authUser.is_owner) return false;
        if (!authUser.can_approve && !authUser.can_reject) return false;

        const status = leave?.status ?? '';
        if (['rejected'].includes(status)) return false;

        const hasCompletedAction = leave?.approvals?.some(a => a.approver?.id === authUser.id && ['approved', 'rejected'].includes(a.status));
        if (hasCompletedAction) return false;

        const role = authUser.position?.toLowerCase() || '';
        if (['superadmin', 'direktur', 'hr'].includes(role)) return true;

        if (role === 'hr') {
            if (status === 'hr_approved') return false;
            const direkturApproval = leave?.approvals?.find(a => a.role === 'direktur');
            if (direkturApproval && direkturApproval.status !== 'approved') return false;

            return true;
        }

        return ['submitted', 'revision', 'revised'].includes(status);
    })();

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

    const handleDelete = async () => {
        if (!leave) return;
        setActionLoading(true);
        try {
            await axios.delete(`/api/v1/leaves/${leave.code}`);
            router.visit('/leaves');
        } catch {
            setDeleteDialog(false);
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditSubmit = async () => {
        if (!leave) return;
        setEditLoading(true);
        setEditErrors({});
        try {
            const fd = new FormData();
            fd.append('type', editForm.type);
            fd.append('start_date', editForm.start_date);
            fd.append('end_date', editForm.end_date);
            if (editForm.project_id) fd.append('project_id', editForm.project_id);
            if (editForm.replacement_pic_id) fd.append('replacement_pic_id', editForm.replacement_pic_id);
            if (editForm.approver_head_id) fd.append('approver_head_id', editForm.approver_head_id);
            if (editForm.phone) fd.append('phone', editForm.phone);
            if (editForm.lokasi) fd.append('lokasi', editForm.lokasi);
            if (editForm.reason) fd.append('reason', editForm.reason);
            if (attachmentFile) fd.append('attachment', attachmentFile);

            // Laravel needs PUT method spoofing via POST
            fd.append('_method', 'PUT');

            await axios.post(`/api/v1/leaves/${leave.code}`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setEditMode(false);
            await fetchLeave();
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 422) {
                setEditErrors(err.response.data.errors ?? {});
            }
        } finally {
            setEditLoading(false);
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
                    <div className="flex items-center gap-3 flex-wrap">
                        <StatusBadge status={leave.status as any} />

                        {/* Delete button for HR/Superadmin */}
                        {authUser.can_delete && (
                            <Button
                                variant="outline"
                                className="h-9 px-4 border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 gap-2"
                                onClick={() => setDeleteDialog(true)}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Hapus</span>
                            </Button>
                        )}

                        {/* Edit button when revision + owner */}
                        {canRevisionEdit && !editMode && (
                            <Button
                                variant="outline"
                                className="h-9 px-4 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 gap-2"
                                onClick={() => setEditMode(true)}
                            >
                                <Edit className="h-4 w-4" />
                                <span className="hidden sm:inline">Edit & Resubmit</span>
                            </Button>
                        )}

                        {/* Approver actions */}
                        {canAction && (
                            <div className="flex items-center gap-2">
                                {authUser.can_approve && (
                                    <Button
                                        variant="outline"
                                        className="h-9 px-4 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 gap-2"
                                        onClick={() => setActionDialog({ open: true, type: 'approve' })}
                                        disabled={actionLoading}
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        <span className="hidden sm:inline">Setujui</span>
                                    </Button>
                                )}
                                {authUser.can_approve && (
                                    <Button
                                        variant="outline"
                                        className="h-9 px-4 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 gap-2"
                                        onClick={() => setActionDialog({ open: true, type: 'revision' })}
                                        disabled={actionLoading}
                                    >
                                        <FileText className="h-4 w-4" />
                                        <span className="hidden sm:inline">Revisi</span>
                                    </Button>
                                )}
                                {authUser.can_reject && (
                                    <Button
                                        variant="outline"
                                        className="h-9 px-4 border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 gap-2"
                                        onClick={() => setActionDialog({ open: true, type: 'reject' })}
                                        disabled={actionLoading}
                                    >
                                        <XCircle className="h-4 w-4" />
                                        <span className="hidden sm:inline">Tolak</span>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Revision banner */}
                {canRevisionEdit && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
                        <FileText className="h-5 w-5 text-amber-600 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800">Pengajuan ini memerlukan revisi.</p>
                            {leave.approvals?.find(a => a.status === 'revision')?.notes && (
                                <p className="text-xs text-amber-700 mt-0.5">
                                    Catatan: {leave.approvals.find(a => a.status === 'revision')?.notes}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Edit form */}
                        {editMode ? (
                            <Card className="border-amber-200">
                                <CardHeader>
                                    <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                                        <Edit className="h-5 w-5" /> Edit Pengajuan Cuti
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Project (Optional)</Label>
                                            <SearchableSelect
                                                options={projects.map(p => ({ label: `${p.code} - ${p.name}`, value: p.id.toString() }))}
                                                value={editForm.project_id}
                                                onValueChange={v => setEditForm(p => ({ ...p, project_id: v }))}
                                                placeholder="Pilih project"
                                            />
                                            {editErrors.project_id && <p className="text-xs text-red-500">{editErrors.project_id[0]}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Pengganti PIC *</Label>
                                            <SearchableSelect
                                                options={users.map(u => ({ label: u.name, value: u.id.toString() }))}
                                                value={editForm.replacement_pic_id}
                                                onValueChange={v => setEditForm(p => ({ ...p, replacement_pic_id: v }))}
                                                placeholder="Pilih PIC pengganti"
                                            />
                                            {editErrors.replacement_pic_id && <p className="text-xs text-red-500">{editErrors.replacement_pic_id[0]}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Jenis Cuti *</Label>
                                            <SearchableSelect
                                                options={LEAVE_TYPES}
                                                value={editForm.type}
                                                onValueChange={v => setEditForm(p => ({ ...p, type: v }))}
                                                placeholder="Pilih jenis cuti"
                                            />
                                            {editErrors.type && <p className="text-xs text-red-500">{editErrors.type[0]}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>No. HP *</Label>
                                            <Input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} placeholder="08xxx" />
                                            {editErrors.phone && <p className="text-xs text-red-500">{editErrors.phone[0]}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Tanggal Mulai *</Label>
                                            <DatePicker value={editForm.start_date} onChange={v => setEditForm(p => ({ ...p, start_date: v }))} />
                                            {editErrors.start_date && <p className="text-xs text-red-500">{editErrors.start_date[0]}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tanggal Selesai *</Label>
                                            <DatePicker value={editForm.end_date} onChange={v => setEditForm(p => ({ ...p, end_date: v }))} />
                                            {editErrors.end_date && <p className="text-xs text-red-500">{editErrors.end_date[0]}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Alamat Selama Cuti *</Label>
                                        <Input value={editForm.lokasi} onChange={e => setEditForm(p => ({ ...p, lokasi: e.target.value }))} placeholder="Alamat lengkap" />
                                        {editErrors.lokasi && <p className="text-xs text-red-500">{editErrors.lokasi[0]}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Alasan Cuti</Label>
                                        <Textarea
                                            value={editForm.reason}
                                            onChange={e => setEditForm(p => ({ ...p, reason: e.target.value }))}
                                            placeholder="Jelaskan alasan cuti..."
                                            className="min-h-[80px]"
                                        />
                                        {editErrors.reason && <p className="text-xs text-red-500">{editErrors.reason[0]}</p>}
                                    </div>

                                    {authUser.is_pegawai && (
                                        <div className="space-y-2">
                                            <Label>Pilih Atasan Direct *</Label>
                                            <SearchableSelect
                                                options={(approvers.head || []).map(u => ({ label: u.name, value: u.id.toString() }))}
                                                value={editForm.approver_head_id}
                                                onValueChange={v => setEditForm(p => ({ ...p, approver_head_id: v }))}
                                                placeholder="Pilih atasan"
                                            />
                                            {editErrors.approver_head_id && <p className="text-xs text-red-500">{editErrors.approver_head_id[0]}</p>}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Lampiran Dokumen (Opsional)</Label>
                                        <FileUploadDropzone
                                            className="w-full"
                                            onFilesChange={files => setAttachmentFile(files[0] || null)}
                                        />
                                        {editErrors.attachment && <p className="text-xs text-red-500">{editErrors.attachment[0]}</p>}
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            onClick={handleEditSubmit}
                                            disabled={editLoading}
                                            className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                                        >
                                            {editLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                            Simpan & Resubmit
                                        </Button>
                                        <Button variant="outline" onClick={() => setEditMode(false)} disabled={editLoading} className="gap-2">
                                            <X className="h-4 w-4" /> Batal
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {isTravel ? 'Detail Perjalanan Dinas' : 'Detail Pengajuan Cuti'}
                                    </CardTitle>
                                    {leave.type === 'annual' && (
                                        <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-md py-1.5 px-3 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-emerald-700">Sisa Cuti Pemohon</span>
                                            <span className="text-sm font-bold text-emerald-800">{submitterRemainingLeaves} Hari</span>
                                        </div>
                                    )}
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
                        )}

                        {/* Approval History */}
                        {leave.approvals && leave.approvals.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Riwayat Persetujuan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {leave.approvals.map((a) => (
                                        <div key={a.id} className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
                                            {a.status === 'approved' && <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />}
                                            {a.status === 'rejected' && <XCircle className="h-5 w-5 text-rose-600 mt-0.5" />}
                                            {a.status === 'revision' && <FileText className="h-5 w-5 text-amber-600 mt-0.5" />}
                                            {a.status === 'pending' && <Loader2 className="h-5 w-5 text-blue-600 mt-0.5 animate-spin" />}
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {a.status === 'approved' && 'Disetujui'}
                                                    {a.status === 'rejected' && 'Ditolak'}
                                                    {a.status === 'revision' && 'Revisi'}
                                                    {a.status === 'pending' && 'Menunggu Persetujuan'}
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
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${a.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                                            a.status === 'rejected' ? 'bg-rose-100 text-rose-600' :
                                                a.status === 'revision' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>
                                            {a.status === 'approved' && <CheckCircle className="h-4 w-4" />}
                                            {a.status === 'rejected' && <XCircle className="h-4 w-4" />}
                                            {a.status === 'revision' && <FileText className="h-4 w-4" />}
                                            {a.status === 'pending' && <Loader2 className="h-4 w-4 animate-spin" />}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {a.status === 'approved' && 'Disetujui'}
                                                {a.status === 'rejected' && 'Ditolak'}
                                                {a.status === 'revision' && 'Revisi'}
                                                {a.status === 'pending' && 'Menunggu Persetujuan'}
                                                {' '}({a.role})
                                            </p>
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

            {/* Approval Action Dialog */}
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
                            Apakah Anda yakin ingin {actionDialog.type === 'approve' ? 'menyetujui' : actionDialog.type === 'reject' ? 'menolak' : 'mengembalikan (revisi)'} {isTravel ? 'perjalanan dinas' : 'cuti'} dari <b>{leave.user?.name}</b>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            {isTravel ? `Tujuan: ${leave.destination}` : `Jenis: ${LEAVE_TYPE_LABELS[leave.type] ?? leave.type}`}<br />
                            Durasi: {format(new Date(leave.start_date), 'dd MMM yyyy', { locale: localeId })} - {format(new Date(leave.end_date), 'dd MMM yyyy', { locale: localeId })} ({duration} Hari)
                        </p>
                        <Textarea
                            placeholder={actionDialog.type === 'reject' ? 'Alasan penolakan...' : actionDialog.type === 'revision' ? 'Catatan revisi yang diperlukan...' : 'Catatan persetujuan (opsional)'}
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
                            ) : actionDialog.type === 'reject' ? (
                                <><XCircle className="h-4 w-4" /> Tolak</>
                            ) : (
                                <><FileText className="h-4 w-4" /> Revisi</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-700">
                            <Trash2 className="h-5 w-5" /> Hapus Data Cuti
                        </DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data cuti <b>{leave.code}</b> dari <b>{leave.user?.name}</b> akan dihapus permanen dan kuota cuti akan dikembalikan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog(false)} disabled={actionLoading}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={actionLoading} className="gap-2">
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
