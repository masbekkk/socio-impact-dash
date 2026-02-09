import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, Clock, User, Briefcase, FileText, ChevronDown, CheckCircle, XCircle, MapPin, Plane } from 'lucide-react';
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

interface Props {
    leave: any;
    auth: {
        user: {
            id: string;
            name: string;
            role: 'admin' | 'hr' | 'user';
        }
    }
}

export default function LeaveShow({ leave: propLeave, auth }: Props) {
    const leave = propLeave || {};
    const isTravel = leave.type === 'travel' || leave.destination; // Detect if it's a travel request

    // Action Dialog State
    const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'approve' | 'reject' | null }>({
        open: false,
        type: null
    });
    const [rejectionReason, setRejectionReason] = useState('');

    const openActionDialog = (type: 'approve' | 'reject') => {
        setActionDialog({ open: true, type });
    };

    const handleActionConfirm = () => {
        if (!actionDialog.type) return;

        const route = actionDialog.type === 'approve'
            ? `/leaves/${leave.slug}/approve`
            : `/leaves/${leave.slug}/reject`;

        const data = actionDialog.type === 'reject' && rejectionReason
            ? { reason: rejectionReason }
            : {};

        router.post(route, data, {
            onSuccess: () => {
                setActionDialog({ open: false, type: null });
                setRejectionReason('');
            }
        });
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Cuti & Dinas', href: '/leaves' },
        { title: isTravel ? 'Detail Dinas Luar' : 'Detail Cuti', href: '#' },
    ];

    if (!leave || !leave.id) {
        return (
            <AppSidebarLayout breadcrumbs={breadcrumbs}>
                <div className="p-10 text-center">
                    <h2 className="text-lg font-semibold">Data Tidak Ditemukan</h2>
                    <Button asChild className="mt-4" variant="outline"><Link href="/leaves">Kembali</Link></Button>
                </div>
            </AppSidebarLayout>
        )
    }

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${isTravel ? 'Dinas Luar' : 'Cuti'} - ${leave.user?.name || 'Unknown'}`} />

            <div className="p-6 md:p-10 w-full mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="-ml-2">
                            <Link href="/leaves">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {isTravel ? 'Detail Dinas Luar' : 'Detail Cuti'}
                            </h1>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                <FileText className="h-3.5 w-3.5" /> {leave.id}
                                <span className="text-gray-300">|</span>
                                <Calendar className="h-3.5 w-3.5" /> {leave.created_at}
                            </div>
                        </div>
                    </div>
                    {/* @ts-ignore */}
                    <div className="flex items-center gap-3">
                        <StatusBadge status={leave.status} />

                        {leave.status === 'pending' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        Action <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="text-emerald-600 focus:text-emerald-600 cursor-pointer" onClick={() => openActionDialog('approve')}>
                                        <CheckCircle className="mr-2 h-4 w-4" /> Setujui
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-rose-600 focus:text-rose-600 cursor-pointer" onClick={() => openActionDialog('reject')}>
                                        <XCircle className="mr-2 h-4 w-4" /> Tolak
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 1. Request Detail */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {isTravel ? 'Detail Perjalanan Dinas' : 'Detail Pengajuan Cuti'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Project */}
                                {leave.project && (
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">Nama Project</h4>
                                        <div className="flex items-center gap-2 font-medium text-base">
                                            <Briefcase className="h-4 w-4 text-primary" />
                                            {leave.project}
                                        </div>
                                    </div>
                                )}

                                {/* Leave Type or Destination */}
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
                                            {leave.type}
                                        </div>
                                    </div>
                                )}

                                {/* Duration */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            {isTravel ? 'Tanggal Berangkat' : 'Tanggal Mulai'}
                                        </h4>
                                        <p className="text-sm font-medium">{leave.start}</p>
                                    </div>
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            {isTravel ? 'Tanggal Kembali' : 'Tanggal Selesai'}
                                        </h4>
                                        <p className="text-sm font-medium">{leave.end}</p>
                                    </div>
                                </div>

                                <div className="grid gap-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        {isTravel ? 'Total Hari' : 'Durasi'}
                                    </h4>
                                    <p className="text-sm font-medium">{leave.duration}</p>
                                </div>

                                {/* Reason/Purpose */}
                                <div className="grid gap-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        {isTravel ? 'Agenda / Keperluan' : 'Alasan Cuti'}
                                    </h4>
                                    <p className="text-sm leading-relaxed bg-muted/30 p-4 rounded-lg border">
                                        {isTravel ? leave.purpose : leave.reason}
                                    </p>
                                </div>

                                {/* Address */}
                                {leave.address && (
                                    <div className="grid gap-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            {isTravel ? 'Alamat Penginapan / Tujuan' : 'Alamat Selama Cuti'}
                                        </h4>
                                        <div className="flex gap-2 text-sm text-foreground/80">
                                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            {leave.address || (isTravel ? leave.accommodation : leave.address)}
                                        </div>
                                    </div>
                                )}

                                {/* Replacement PIC */}
                                {leave.replacement_pic && (
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">Pengganti PIC</h4>
                                        <p className="text-sm font-medium">{leave.replacement_pic}</p>
                                    </div>
                                )}

                                {/* Contact */}
                                {leave.phone && (
                                    <div className="grid gap-1">
                                        <h4 className="text-sm font-medium text-muted-foreground">No. HP</h4>
                                        <p className="text-sm font-medium">{leave.phone}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Approval Status */}
                        {(leave.status === 'approved' || leave.status === 'rejected') && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Status Persetujuan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
                                        {leave.status === 'approved' ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-rose-600 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {leave.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                                            </p>
                                            {leave.approver && leave.approver !== '-' && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    oleh {leave.approver}
                                                </p>
                                            )}
                                            {leave.rejection_reason && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <p className="text-xs font-medium text-muted-foreground mb-1">Alasan Penolakan:</p>
                                                    <p className="text-sm">{leave.rejection_reason}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: User Info */}
                    <div className="space-y-6">
                        {/* User Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Informasi Karyawan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {leave.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold">{leave.user?.name || 'Unknown User'}</p>
                                        <p className="text-xs text-muted-foreground">{leave.user?.position || 'N/A'}</p>
                                        <p className="text-xs text-muted-foreground">{leave.user?.email || 'No Email'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline Card */}
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
                                        <p className="text-xs text-muted-foreground">{leave.created_at}</p>
                                    </div>
                                </div>
                                {leave.status !== 'pending' && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${leave.status === 'approved'
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : 'bg-rose-100 text-rose-600'
                                            }`}>
                                            {leave.status === 'approved' ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <XCircle className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {leave.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {leave.approved_at || leave.created_at}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Action Confirmation Dialog */}
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
                            {isTravel ? `Tujuan: ${leave.destination}` : `Jenis: ${leave.type}`} <br />
                            Durasi: {leave.start} - {leave.end} ({leave.duration})
                        </p>
                        {actionDialog.type === 'reject' && (
                            <Textarea
                                placeholder="Alasan penolakan (opsional)"
                                className="mt-4"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialog(prev => ({ ...prev, open: false }))}>
                            Batal
                        </Button>
                        <Button
                            variant={actionDialog.type === 'approve' ? 'default' : 'destructive'}
                            onClick={handleActionConfirm}
                            className="gap-2"
                        >
                            {actionDialog.type === 'approve' ? (
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
