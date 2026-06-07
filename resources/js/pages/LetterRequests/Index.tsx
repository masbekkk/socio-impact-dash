import React, { useState, useEffect, useCallback } from 'react';
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
import { Plus, Search, XCircle, Hash, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Trash2, CalendarRange, MoreHorizontal, RefreshCcw } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import axios from 'axios';
import { SearchableSelect } from '@/components/SearchableSelect';
import DatePicker from '@/components/DatePicker';

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
    status: 'used' | 'unused';
}

interface Props {
    canAssign: boolean;
    canDelete: boolean;
}

const STORAGE_KEY = 'letter_requests_filters';

export default function LetterRequestsIndex({ canDelete }: Props) {
    const initialFilters = (() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) { }
        return {
            searchQuery: '',
            dateFrom: '',
            dateTo: '',
            pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0,
                from: 0,
                to: 0
            }
        };
    })();

    const [requests, setRequests] = useState<LetterRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<LetterRequest | null>(null);
    const [processing, setProcessing] = useState(false);

    // Date range filter
    const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom);
    const [dateTo, setDateTo] = useState(initialFilters.dateTo);

    // Pagination State
    const [pagination, setPagination] = useState(initialFilters.pagination);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Nomor Surat', href: '/letter-requests' },
    ];

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/v1/letter-requests', {
                params: {
                    search: searchQuery,
                    page: pagination.current_page,
                    per_page: pagination.per_page,
                    date_from: dateFrom || undefined,
                    date_to: dateTo || undefined,
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
    }, [searchQuery, pagination.current_page, pagination.per_page, dateFrom, dateTo]);

    useEffect(() => {
        const filtersToSave = {
            searchQuery,
            dateFrom,
            dateTo,
            pagination: { ...pagination, total: 0, from: 0, to: 0, last_page: 1 } // save layout only
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtersToSave));

        const timer = setTimeout(() => {
            fetchRequests();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchRequests, searchQuery, dateFrom, dateTo, pagination.current_page, pagination.per_page]);

    const handleDeleteClick = (req: LetterRequest) => {
        setSelectedRequest(req);
        setDeleteDialogOpen(true);
    };

    const submitDelete = async () => {
        if (!selectedRequest) return;
        setProcessing(true);
        try {
            await axios.delete(`/api/v1/letter-requests/${selectedRequest.id}`);
            setDeleteDialogOpen(false);
            setSelectedRequest(null);
            fetchRequests();
        } catch (error) {
            console.error("Error deleting letter request:", error);
            alert("Gagal menghapus nomor surat.");
        } finally {
            setProcessing(false);
        }
    };

    const handleStatusChange = async (req: LetterRequest) => {
        const newStatus = req.status === 'used' ? 'unused' : 'used';
        try {
            await axios.patch(`/api/v1/letter-requests/${req.id}/status`, { status: newStatus });
            fetchRequests();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Gagal memperbarui status.");
        }
    };

    const clearDateFilter = () => {
        setDateFrom('');
        setDateTo('');
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Nomor Surat" />
            <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Nomor Surat</h1>
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

                        {/* Date Range Filter */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 pt-3 border-t mt-3">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                                <CalendarRange className="h-4 w-4" />
                                Filter Tanggal
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs text-muted-foreground whitespace-nowrap">Dari</Label>
                                    <DatePicker
                                        value={dateFrom}
                                        onChange={(v) => {
                                            setDateFrom(v);
                                            setPagination(prev => ({ ...prev, current_page: 1 }));
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs text-muted-foreground whitespace-nowrap">Sampai</Label>
                                    <DatePicker
                                        value={dateTo}
                                        onChange={(v) => {
                                            setDateTo(v);
                                            setPagination(prev => ({ ...prev, current_page: 1 }));
                                        }}
                                    />
                                </div>
                                {(dateFrom || dateTo) && (
                                    <Button variant="ghost" size="sm" onClick={clearDateFilter} className="text-xs h-8">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Reset
                                    </Button>
                                )}
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
                                        <TableHead>Status</TableHead>
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
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            req.status === 'used'
                                                                ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60 font-medium'
                                                                : 'bg-amber-50/80 text-amber-700 border-amber-200/60 font-medium'
                                                        }
                                                    >
                                                        {req.status === 'used' ? 'Terpakai' : 'Tidak Terpakai'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Buka menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[160px]">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/letter-requests/${req.id}/edit`} className="cursor-pointer">
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {canDelete && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => handleStatusChange(req)}>
                                                                        <RefreshCcw className="mr-2 h-4 w-4" />
                                                                        Ubah Status
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleDeleteClick(req)} className="text-destructive focus:text-destructive">
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Hapus
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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
                                    <SearchableSelect
                                        options={[10, 20, 30, 40, 50].map(s => ({ label: s.toString(), value: s.toString() }))}
                                        value={`${pagination.per_page}`}
                                        onValueChange={(v) => {
                                            setPagination(prev => ({ ...prev, per_page: Number(v), current_page: 1 }));
                                        }}
                                        className="w-20 h-8 text-xs"
                                        placeholder={`${pagination.per_page}`}
                                    />
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



            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Nomor Surat</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus pengajuan nomor surat ini?
                            {selectedRequest && (
                                <span className="block mt-2 font-medium text-foreground">
                                    {selectedRequest.subject}
                                    {selectedRequest.letter_number && (
                                        <span className="block text-sm text-muted-foreground font-normal mt-1">
                                            Nomor: {selectedRequest.letter_number}
                                        </span>
                                    )}
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setDeleteDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={processing}
                            onClick={submitDelete}
                        >
                            {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
