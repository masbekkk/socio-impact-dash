import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MapPin, Calendar, Clock, User, Briefcase, FileText, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
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

// --- Mock Data (Replace with prop from controller) ---
const MOCK_PROJECTS = [
    { id: '1', name: 'Socio Impact Development', code: 'SID-2024-001' },
    { id: '2', name: 'Community Outreach Phase 1', code: 'COP-2024-002' },
    { id: '3', name: 'Education Fund Assessment', code: 'EFA-2024-003' },
];

interface Props {
    presence: any;
    auth: {
        user: {
            id: string;
            name: string;
            role: 'admin' | 'hr' | 'user';
        }
    }
}

export default function PresenceShow({ presence: propPresence, auth }: Props) {
    // If no prop is passed (during dev/testing), fallback to a default safe object or handle error
    // Adapting the prop structure to match what the view expects if coming from JSON
    const presence = propPresence || {};

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
                                <Calendar className="h-3.5 w-3.5" /> {presence.date}
                                <span className="text-gray-300">|</span>
                                <Clock className="h-3.5 w-3.5" /> {presence.time}
                            </div>
                        </div>
                    </div>
                    {/* @ts-ignore */}
                    <div className="flex items-center gap-3">
                        <StatusBadge status={presence.status} />

                        {/* Role check temporarily disabled as requested */}
                        {presence.status === 'pending' && (
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
                                        {presence.project?.name || presence.project || 'Unknown Project'}
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
                                <CardTitle className="text-lg">Dokumentasi Lapangan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg overflow-hidden border bg-muted relative group">
                                    {presence.image_url ? (
                                        <img
                                            src={presence.image_url}
                                            alt="Dokumentasi Presensi"
                                            className="w-full h-auto object-cover max-h-[500px] transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                                            <CameraIcon className="h-10 w-10 mb-2 opacity-20" />
                                            <p>Tidak ada foto dokumentasi</p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 italic flex items-center justify-end gap-1">
                                    Diupload pada {presence.date} • {presence.time}
                                </p>
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
                                <CardTitle className="text-base">Lokasi Check-In</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-muted/30 p-3 rounded-md border flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-mono text-muted-foreground">Coordinates</p>
                                        <p className="text-sm font-medium">{presence.location.lat}, {presence.location.lng}</p>
                                    </div>
                                </div>

                                <div className="text-sm text-muted-foreground leading-snug">
                                    <span className="font-medium text-foreground block mb-1">Alamat Terdeteksi:</span>
                                    {presence.location.address}
                                </div>

                                <Button variant="outline" className="w-full text-xs h-9" asChild>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${presence.location.lat},${presence.location.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Buka di Google Maps
                                    </a>
                                </Button>
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
                            Proyek: {presence.project?.name || presence.project} <br />
                            Waktu: {presence.date} {presence.time}
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
