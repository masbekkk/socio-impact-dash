import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ArrowLeft, MapPin, Calendar, Clock, Briefcase, FileText, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
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
import { id as localeId } from 'date-fns/locale';

interface PresenceData {
    id: number;
    date: string;
    check_in_at: string;
    check_out_at: string | null;
    status: string;
    project: {
        name: string;
        code: string;
    } | null;
    activity: string;
    notes: string | null;
    check_in_latitude: string;
    check_in_longitude: string;
    check_out_latitude: string | null;
    check_out_longitude: string | null;
    photo_path: string | null;
    checkout_photo_path: string | null;
    image_url: string | null;
    checkout_image_url: string | null;
    user: {
        name: string;
        email: string;
        position: string | null;
    };
}

interface Props {
    presence: PresenceData;
}

export default function PresenceShow({ presence }: Props) {

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
        const action = actionDialog.type === 'approve' ? 'Menyetujui' : 'Menolak';
        const message = actionDialog.type === 'reject' && rejectionReason
            ? `${action} presensi untuk ${presence.user?.name}\nAlasan: ${rejectionReason}`
            : `${action} presensi untuk ${presence.user?.name}`;
        alert(`Konfirmasi: ${message}`);
        setActionDialog({ open: false, type: null });
        setRejectionReason('');
        // In real app, make API call here
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Presensi', href: '/presences' },
        { title: 'Detail Presensi', href: '#' },
    ];

    if (!presence || !presence.id) {
        return (
            <AppSidebarLayout breadcrumbs={breadcrumbs}>
                <div className="p-10 text-center">
                    <h2 className="text-lg font-semibold">Data Presensi Tidak Ditemukan</h2>
                    <Button asChild className="mt-4" variant="outline"><Link href="/presences">Kembali</Link></Button>
                </div>
            </AppSidebarLayout>
        )
    }

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Presensi - ${presence.user?.name || 'Unknown'}`} />

            <div className="p-6 md:p-10 w-full mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="-ml-2">
                            <Link href="/presences">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Detail Presensi</h1>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                <Calendar className="h-3.5 w-3.5" /> {format(new Date(presence.date), 'dd MMMM yyyy', { locale: localeId })}
                                <span className="text-gray-300">|</span>
                                <Clock className="h-3.5 w-3.5" /> {presence.check_in_at ? format(new Date(presence.check_in_at), 'HH:mm') : '-'}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={presence.status} />

                        {/* Role check temporarily disabled as requested */}
                        {presence.status === 'pending' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        Aksi <ChevronDown className="h-4 w-4" />
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
                        {/* 1. Activity Detail */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Detail Kegiatan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Proyek</h4>
                                    <div className="flex items-center gap-2 font-medium text-base">
                                        <Briefcase className="h-4 w-4 text-primary" />
                                        {presence.project?.name || 'Unknown Project'}
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-6">{presence.project?.code}</p>
                                </div>

                                <div className="grid gap-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">Aktifitas</h4>
                                    <p className="text-sm leading-relaxed bg-muted/30 p-4 rounded-lg border">
                                        {presence.activity}
                                    </p>
                                </div>

                                {presence.notes && (
                                    <div className="grid gap-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">Catatan Tambahan</h4>
                                        <div className="flex gap-2 text-sm text-foreground/80">
                                            <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            {presence.notes}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 2. Documentation Photo */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Dokumentasi Foto</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Check-In Photo */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Foto Check-In</Label>
                                        <div className="rounded-lg overflow-hidden border bg-muted relative group aspect-[4/3]">
                                            {presence.image_url ? (
                                                <img
                                                    src={presence.image_url}
                                                    alt="Foto Check-In"
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                                    <CameraIcon className="h-8 w-8 mb-2 opacity-20" />
                                                    <p className="text-xs">Tidak ada foto</p>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {presence.check_in_at ? format(new Date(presence.check_in_at), 'HH:mm') : '-'}
                                        </p>
                                    </div>

                                    {/* Check-Out Photo */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-rose-600 uppercase tracking-wider">Foto Check-Out</Label>
                                        <div className="rounded-lg overflow-hidden border bg-muted relative group aspect-[4/3]">
                                            {presence.checkout_image_url ? (
                                                <img
                                                    src={presence.checkout_image_url}
                                                    alt="Foto Check-Out"
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                                    <CameraIcon className="h-8 w-8 mb-2 opacity-20" />
                                                    <p className="text-xs">Belum check-out / Tidak ada foto</p>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {presence.check_out_at ? format(new Date(presence.check_out_at), 'HH:mm') : '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: User & Location */}
                    <div className="space-y-6">
                        {/* User Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Informasi Karyawan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {presence.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold">{presence.user?.name || 'Unknown User'}</p>
                                        <p className="text-xs text-muted-foreground">{presence.user?.position || 'N/A'}</p>
                                        <p className="text-xs text-muted-foreground">{presence.user?.email || 'No Email'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Lokasi & Waktu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Check-In */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[10px]">Check-In</Badge>
                                        <span className="text-sm font-medium">{presence.check_in_at ? format(new Date(presence.check_in_at), 'HH:mm') : '-'}</span>
                                    </div>
                                    <div className="bg-muted/30 p-3 rounded-md border flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-[10px] font-mono text-muted-foreground">Coordinates</p>
                                            <p className="text-xs font-medium truncate">{presence.check_in_latitude}, {presence.check_in_longitude}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full text-xs h-8" asChild>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${presence.check_in_latitude},${presence.check_in_longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View on Maps
                                        </a>
                                    </Button>
                                </div>

                                <Separator />

                                {/* Check-Out */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 uppercase text-[10px]">Check-Out</Badge>
                                        <span className="text-sm font-medium">{presence.check_out_at ? format(new Date(presence.check_out_at), 'HH:mm') : 'Belum Check-out'}</span>
                                    </div>

                                    {presence.check_out_at && (
                                        <>
                                            <div className="bg-muted/30 p-3 rounded-md border flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-[10px] font-mono text-muted-foreground">Coordinates</p>
                                                    <p className="text-xs font-medium truncate">{presence.check_out_latitude}, {presence.check_out_longitude}</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" className="w-full text-xs h-8" asChild>
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${presence.check_out_latitude},${presence.check_out_longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View on Maps
                                                </a>
                                            </Button>
                                        </>
                                    )}
                                </div>
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
                            Apakah Anda yakin ingin {actionDialog.type === 'approve' ? 'menyetujui' : 'menolak'} presensi dari <b>{presence.user?.name}</b>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Proyek: {presence.project?.name || '-'} <br />
                            Waktu: {presence.date} {presence.check_in_at ? format(new Date(presence.check_in_at), 'HH:mm') : '-'}
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
                                <><CheckCircle className="h-4 w-4" /> Setujui Presensi</>
                            ) : (
                                <><XCircle className="h-4 w-4" /> Tolak Presensi</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
        </svg>
    )
}
