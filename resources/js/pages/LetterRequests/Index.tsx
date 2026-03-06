import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
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
import { Plus, Search, CheckCircle, XCircle, Hash, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import axios from 'axios';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
    pic: {
        id: number;
        name: string;
    } | null;
    letterCode: {
        id: number;
        code: string;
    } | null;
    letterDivision: {
        id: number;
        code: string;
    } | null;
    keterangan: string | null;
    letter_number: string | null;
    status: 'pending' | 'assigned' | 'rejected';
}

interface Props {
    canAssign: boolean;
}

export default function LetterRequestsIndex({ canAssign }: Props) {
    const [requests, setRequests] = useState<LetterRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<LetterRequest | null>(null);
    const [letterNumber, setLetterNumber] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    // Pagination State
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Nomor Surat', href: '/letter-requests' },
    ];

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/v1/letter-requests', {
                params: {
                    search: searchQuery,
                    page: pagination.current_page,
                    per_page: pagination.per_page,
                }
            });
            setRequests(response.data.data.data);
            setPagination({
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                per_page: response.data.data.per_page,
                total: response.data.data.total,
                from: response.data.data.from,
                to: response.data.data.to,
            });
        } catch (error) {
            console.error("Error fetching letter requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRequests();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, pagination.current_page, pagination.per_page]);

    const handleAssign = (req: LetterRequest) => {
        setSelectedRequest(req);
        setLetterNumber('');
        setErrors({});
        setAssignDialogOpen(true);
    };

    const submitAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;
        setProcessing(true);
        setErrors({});

        try {
            await axios.post(`/api/v1/letter-requests/${selectedRequest.id}/assign`, {
                letter_number: letterNumber
            });
            setAssignDialogOpen(false);
            fetchRequests();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.data.errors) {
                setErrors(error.response.data.errors as Record<string, string[]>);
            } else {
                console.error("Error assigning number:", error);
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async (req: LetterRequest) => {
        if (confirm('Apakah Anda yakin ingin menolak pengajuan ini?')) {
            try {
                await axios.post(`/api/v1/letter-requests/${req.id}/reject`);
                fetchRequests();
            } catch (error) {
                console.error("Error rejecting request:", error);
            }
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
                        <Link href="/letter-requests/create">
                            <Plus className="h-4 w-4" />
                            Buat Nomor Surat
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
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setPagination(prev => ({ ...prev, current_page: 1 }));
                                    }}
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
                                        <TableHead>PIC / Ket</TableHead>
                                        {/* <TableHead>Kode / Divisi</TableHead> */}
                                        <TableHead>Nomor Surat</TableHead>
                                        {/* <TableHead>Status</TableHead> */}
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                <div className="flex justify-center items-center gap-2 text-muted-foreground">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Loading...
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : requests.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                Tidak ada data pengajuan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        requests.map((req) => (
                                            <TableRow key={req.id}>
                                                <TableCell className="font-medium whitespace-nowrap">
                                                    {format(new Date(req.letter_date), 'dd MMM yyyy', { locale: id })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-xs text-blue-600 uppercase tracking-wider">{req.project?.code || '-'}</span>
                                                        <span className="text-sm truncate max-w-[150px]">{req.project?.name || '-'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{req.subject}</span>
                                                        <span className="text-xs text-muted-foreground">Ke: {req.recipient}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="whitespace-nowrap">{req.pic?.name || '-'}</span>
                                                        {req.keterangan && (
                                                            <span className="text-xs text-muted-foreground italic truncate max-w-[150px]">{req.keterangan}</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                {/* <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        {req.letterCode && <Badge variant="outline" className="w-fit text-xs px-1.5 py-0 bg-slate-50">{req.letterCode.code}</Badge>}
                                                        {req.letterDivision && <Badge variant="outline" className="w-fit text-xs px-1.5 py-0 bg-slate-50">{req.letterDivision.code}</Badge>}
                                                    </div>
                                                </TableCell> */}
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
                                                {/* <TableCell>
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
                                                </TableCell> */}
                                                <TableCell className="text-right">
                                                    {/* {canAssign && (
                                                        <div className="flex justify-end gap-2">
                                                            {req.status !== 'rejected' && (
                                                                <Button variant="outline" size="sm" asChild>
                                                                    <Link href={`/letter-requests/${req.id}/edit`}>
                                                                        Edit
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                            {req.status === 'pending' && (
                                                                <>
                                                                    <Button variant="default" className="bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)]/90" size="sm" onClick={() => handleAssign(req)}>
                                                                        Beri Nomor
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => handleReject(req)}>
                                                                        <XCircle className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )} */}
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/letter-requests/${req.id}/edit`}>
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* PAGINATION CONTROLS */}
                        <div className="flex items-center justify-between px-2 py-4">
                            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                                Menampilkan {pagination.from || 0} sampai {pagination.to || 0} dari {pagination.total} hasil
                            </div>
                            <div className="flex w-full items-center gap-8 lg:w-fit">
                                <div className="hidden items-center gap-2 lg:flex">
                                    <Label htmlFor="rows-per-page" className="text-sm font-medium">Baris per halaman</Label>
                                    <Select
                                        value={`${pagination.per_page}`}
                                        onValueChange={(value) => {
                                            setPagination(prev => ({ ...prev, per_page: parseInt(value), current_page: 1 }));
                                        }}
                                    >
                                        <SelectTrigger className="w-20 h-8 text-xs" id="rows-per-page">
                                            <SelectValue placeholder={pagination.per_page} />
                                        </SelectTrigger>
                                        <SelectContent side="top">
                                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                                <SelectItem key={pageSize} value={`${pageSize}`}>{pageSize}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex w-fit items-center justify-center text-sm font-medium">
                                    Halaman {pagination.current_page} dari {pagination.last_page}
                                </div>
                                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                                    <Button
                                        variant="outline"
                                        className="hidden h-8 w-8 p-0 lg:flex"
                                        disabled={pagination.current_page === 1}
                                        onClick={() => setPagination(prev => ({ ...prev, current_page: 1 }))}
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="size-8"
                                        size="icon"
                                        disabled={pagination.current_page === 1}
                                        onClick={() => setPagination(prev => ({ ...prev, current_page: Math.max(1, prev.current_page - 1) }))}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="size-8"
                                        size="icon"
                                        disabled={pagination.current_page === pagination.last_page}
                                        onClick={() => setPagination(prev => ({ ...prev, current_page: Math.min(pagination.last_page, prev.current_page + 1) }))}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="hidden size-8 lg:flex"
                                        size="icon"
                                        disabled={pagination.current_page === pagination.last_page}
                                        onClick={() => setPagination(prev => ({ ...prev, current_page: pagination.last_page }))}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
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
                                    value={letterNumber}
                                    onChange={(e) => setLetterNumber(e.target.value)}
                                />
                                {errors.letter_number && <p className="text-sm text-destructive">{errors.letter_number}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setAssignDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-[var(--sidebar)] text-white">
                                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Nomor'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
