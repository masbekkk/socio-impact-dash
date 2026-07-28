import React, { useState, useEffect, useCallback } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Target, Trash2, Edit } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface HeadUser {
    id: number;
    name: string;
    email: string;
    position?: string | null;
}

interface UserKpi {
    id: number;
    user_id: number;
    nominal: number;
    year: number;
    created_at: string;
    user: HeadUser;
}

export default function KpiIndex() {
    const [kpis, setKpis] = useState<UserKpi[]>([]);
    const [heads, setHeads] = useState<HeadUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [yearFilter, setYearFilter] = useState<string>('all');

    // Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingKpi, setEditingKpi] = useState<UserKpi | null>(null);
    const [formData, setFormData] = useState({
        user_id: '',
        nominal: '',
        year: String(new Date().getFullYear()),
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const fetchKpis = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, any> = {};
            if (searchQuery) params.search = searchQuery;
            if (yearFilter !== 'all') params.year = yearFilter;

            const res = await axios.get('/api/v1/user-kpis', { params });
            setKpis(res.data.data.data);
        } catch {
            toast.error('Gagal mengambil data KPI.');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, yearFilter]);

    const fetchHeads = useCallback(async () => {
        try {
            const res = await axios.get('/api/v1/user-kpis/heads');
            setHeads(res.data.data);
        } catch {
            toast.error('Gagal mengambil daftar Head User.');
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchKpis();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchKpis]);

    useEffect(() => {
        fetchHeads();
    }, [fetchHeads]);

    const handleOpenCreate = () => {
        if (heads.length === 0) {
            fetchHeads();
        }
        setEditingKpi(null);
        setFormData({
            user_id: '',
            nominal: '',
            year: String(new Date().getFullYear()),
        });
        setFormError(null);
        setDialogOpen(true);
    };

    const handleOpenEdit = (kpi: UserKpi) => {
        setEditingKpi(kpi);
        setFormData({
            user_id: String(kpi.user_id),
            nominal: String(kpi.nominal),
            year: String(kpi.year),
        });
        setFormError(null);
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!formData.user_id) {
            setFormError('User Head wajib dipilih.');
            return;
        }

        const nominalNum = parseFloat(formData.nominal);
        if (isNaN(nominalNum) || nominalNum < 0) {
            setFormError('Nominal KPI harus berupa angka valid (min. 0).');
            return;
        }

        const yearNum = parseInt(formData.year, 10);
        if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
            setFormError('Tahun tidak valid.');
            return;
        }

        setSubmitting(true);
        try {
            if (editingKpi) {
                await axios.put(`/api/v1/user-kpis/${editingKpi.id}`, {
                    user_id: parseInt(formData.user_id, 10),
                    nominal: nominalNum,
                    year: yearNum,
                });
                toast.success('KPI berhasil diperbarui.');
            } else {
                await axios.post('/api/v1/user-kpis', {
                    user_id: parseInt(formData.user_id, 10),
                    nominal: nominalNum,
                    year: yearNum,
                });
                toast.success('KPI berhasil ditambahkan.');
            }
            setDialogOpen(false);
            fetchKpis();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan KPI.';
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data KPI ini?')) return;

        try {
            await axios.delete(`/api/v1/user-kpis/${id}`);
            toast.success('KPI berhasil dihapus.');
            fetchKpis();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal menghapus KPI.');
        }
    };

    const formatIDR = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'KPI Management', href: '/admin/kpis' },
    ];

    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 7 }, (_, i) => currentYear - 2 + i);

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen KPI Head" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Target className="h-6 w-6 text-[#1a5f4a]" />
                            Manajemen KPI Head
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola nominal KPI tahunan untuk pengguna yang memiliki role Head.
                        </p>
                    </div>
                    <Button onClick={handleOpenCreate} className="bg-[#1a5f4a] hover:bg-[#154d3c]">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah KPI
                    </Button>
                </div>

                <Card>
                    <CardHeader className="p-4 border-b">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="relative w-full sm:w-80 flex items-center">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama atau email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 w-full bg-white"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">Filter Tahun:</span>
                                <Select value={yearFilter} onValueChange={setYearFilter}>
                                    <SelectTrigger className="w-[140px] bg-white">
                                        <SelectValue placeholder="Semua Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tahun</SelectItem>
                                        {availableYears.map((y) => (
                                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        {/* Mobile View */}
                        <div className="space-y-3 md:hidden">
                            {loading ? (
                                <div className="text-center py-8 text-muted-foreground">Memuat data KPI...</div>
                            ) : kpis.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground border rounded-xl bg-gray-50">
                                    Belum ada data KPI.
                                </div>
                            ) : (
                                kpis.map((kpi) => (
                                    <Card key={kpi.id} className="border rounded-xl bg-white shadow-sm">
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-center justify-between border-b pb-2">
                                                <div>
                                                    <span className="font-bold text-gray-900 text-sm">{kpi.user?.name}</span>
                                                    <p className="text-xs text-muted-foreground">{kpi.user?.email}</p>
                                                </div>
                                                <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                                                    {kpi.year}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Nominal KPI:</span>
                                                <span className="font-bold text-emerald-700">{formatIDR(kpi.nominal)}</span>
                                            </div>
                                            <div className="border-t pt-2 flex items-center justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleOpenEdit(kpi)}>
                                                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(kpi.id)}>
                                                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Desktop View Table */}
                        <div className="hidden md:block rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Nama Head</TableHead>
                                        <TableHead>Email / Jabatan</TableHead>
                                        <TableHead className="w-[120px] text-center">Tahun</TableHead>
                                        <TableHead className="text-right">Nominal KPI</TableHead>
                                        <TableHead className="text-right w-[100px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Memuat data KPI...
                                            </TableCell>
                                        </TableRow>
                                    ) : kpis.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Belum ada data KPI.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        kpis.map((kpi) => (
                                            <TableRow key={kpi.id} className="hover:bg-emerald-50/30 transition-colors">
                                                <TableCell className="font-semibold text-gray-900">
                                                    {kpi.user?.name || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">{kpi.user?.email}</div>
                                                    {kpi.user?.position && (
                                                        <div className="text-xs text-muted-foreground">{kpi.user.position}</div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="font-mono font-semibold text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                                                        {kpi.year}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-emerald-700 text-base">
                                                    {formatIDR(kpi.nominal)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleOpenEdit(kpi)}>
                                                                <Edit className="h-4 w-4 mr-2" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive cursor-pointer"
                                                                onClick={() => handleDelete(kpi.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" /> Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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

            {/* Create/Edit Modal */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-[#1a5f4a]" />
                            {editingKpi ? 'Edit Nominal KPI' : 'Tambah Nominal KPI'}
                        </DialogTitle>
                        <DialogDescription>
                            Tentukan nominal KPI tahunan untuk pengguna yang ber-role Head.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        {formError && (
                            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 font-medium">
                                {formError}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="user_id">Pilih User Head</Label>
                            <Select
                                value={formData.user_id}
                                onValueChange={(val) => setFormData((prev) => ({ ...prev, user_id: val }))}
                            >
                                <SelectTrigger id="user_id" className="bg-white">
                                    <SelectValue placeholder="Pilih User Head..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto">
                                    {heads.length === 0 ? (
                                        <SelectItem value="_empty" disabled>
                                            Memuat / Tidak ada User Head
                                        </SelectItem>
                                    ) : (
                                        heads.map((h) => (
                                            <SelectItem key={h.id} value={String(h.id)}>
                                                {h.name} ({h.email})
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="year">Tahun</Label>
                            <Select
                                value={formData.year}
                                onValueChange={(val) => setFormData((prev) => ({ ...prev, year: val }))}
                            >
                                <SelectTrigger id="year" className="bg-white">
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableYears.map((y) => (
                                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="nominal">Nominal KPI (Rp)</Label>
                            <Input
                                id="nominal"
                                type="number"
                                min="0"
                                placeholder="Contoh: 1000000000"
                                value={formData.nominal}
                                onChange={(e) => setFormData((prev) => ({ ...prev, nominal: e.target.value }))}
                            />
                            {formData.nominal && !isNaN(parseFloat(formData.nominal)) && (
                                <p className="text-xs text-emerald-700 font-medium pt-0.5">
                                    Preview: {formatIDR(parseFloat(formData.nominal))}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-[#1a5f4a] hover:bg-[#154d3c]" disabled={submitting}>
                                {submitting ? 'Menyimpan...' : editingKpi ? 'Simpan Perubahan' : 'Tambah KPI'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
