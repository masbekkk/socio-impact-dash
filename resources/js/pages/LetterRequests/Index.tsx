import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, CheckCircle, XCircle, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface LetterRequest {
    id: number;
    project: {
        id: number;
        name: string;
        code: string;
    };
    requester: {
        id: number;
        name: string;
    };
    letter_date: string;
    recipient: string;
    subject: string;
    pic_name: string;
    letter_number: string | null;
    status: 'pending' | 'assigned' | 'rejected';
}

interface Props {
    letterRequests: LetterRequest[];
    canAssign: boolean;
}

export default function LetterRequestsIndex({ letterRequests, canAssign }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<LetterRequest | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        letter_number: '',
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Nomor Surat', href: '/letter-requests' },
    ];

    const filteredRequests = letterRequests.filter(req =>
        req.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.project.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssign = (req: LetterRequest) => {
        setSelectedRequest(req);
        setData('letter_number', '');
        setAssignDialogOpen(true);
    };

    const submitAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;

        post(route('letter-requests.assign', selectedRequest.id), {
            onSuccess: () => {
                setAssignDialogOpen(false);
                reset();
            },
        });
    };

    const handleReject = (req: LetterRequest) => {
        if (confirm('Apakah Anda yakin ingin menolak pengajuan ini?')) {
            post(route('letter-requests.reject', req.id));
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Nomor Surat" />
            <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pengajuan Nomor Surat</h1>
                        <p className="text-muted-foreground">Kelola permohonan nomor surat resmi untuk proyek.</p>
                    </div>

                    <Button asChild className="gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)]">
                        <Link href={route('letter-requests.create')}>
                            <Plus className="h-4 w-4" />
                            Buat Pengajuan
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <CardTitle>Daftar Pengajuan</CardTitle>
                                <CardDescription>Menampilkan semua riwayat pengajuan nomor surat.</CardDescription>
                            </div>
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari perihal, tujuan, proyek..."
                                    className="pl-9 h-10 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Proyek</TableHead>
                                        <TableHead>Perihal & Tujuan</TableHead>
                                        <TableHead>PIC</TableHead>
                                        <TableHead>Nomor Surat</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRequests.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                Tidak ada data pengajuan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredRequests.map((req) => (
                                            <TableRow key={req.id}>
                                                <TableCell className="font-medium whitespace-nowrap">
                                                    {format(new Date(req.letter_date), 'dd MMM yyyy', { locale: id })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-xs text-blue-600 uppercase tracking-wider">{req.project.code}</span>
                                                        <span className="text-sm truncate max-w-[150px]">{req.project.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{req.subject}</span>
                                                        <span className="text-xs text-muted-foreground">Ke: {req.recipient}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">{req.pic_name}</TableCell>
                                                <TableCell>
                                                    {req.letter_number ? (
                                                        <div className="flex items-center gap-1.5 font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 w-fit whitespace-nowrap">
                                                            <Hash className="h-3 w-3" />
                                                            {req.letter_number}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs italic">Belum diberikan</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            req.status === 'assigned' ? 'default' :
                                                                req.status === 'rejected' ? 'destructive' :
                                                                    'secondary'
                                                        }
                                                    >
                                                        {req.status === 'assigned' ? 'Selesai' :
                                                            req.status === 'rejected' ? 'Ditolak' :
                                                                'Menunggu'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {canAssign && req.status === 'pending' && (
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" onClick={() => handleAssign(req)}>
                                                                Beri Nomor
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => handleReject(req)}>
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Assign Number Dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent>
                    <form onSubmit={submitAssign}>
                        <DialogHeader>
                            <DialogTitle>Berikan Nomor Surat</DialogTitle>
                            <DialogDescription>
                                Masukkan nomor resmi untuk surat perihal: <strong>{selectedRequest?.subject}</strong>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="letter_number">Nomor Surat</Label>
                                <Input
                                    id="letter_number"
                                    placeholder="Contoh: 001/SSI/II/2026"
                                    value={data.letter_number}
                                    onChange={(e) => setData('letter_number', e.target.value)}
                                />
                                {errors.letter_number && <p className="text-sm text-destructive">{errors.letter_number}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setAssignDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-[var(--sidebar)] text-white">
                                Simpan Nomor
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
