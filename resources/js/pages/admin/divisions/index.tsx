import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Division {
    id: number;
    name: string;
    description: string | null;
    division_code: {
        id: number;
        code: string;
        name: string;
    };
    created_at: string;
}

export default function Index() {
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDivisions = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/divisions', {
                params: {
                    search: searchQuery,
                }
            });
            setDivisions(res.data.data.data);
        } catch (error) {
            toast.error('Gagal mengambil data divisi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDivisions();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah anda yakin ingin menghapus divisi ini?')) return;
        try {
            await axios.delete(`/api/v1/divisions/${id}`);
            toast.success('Divisi berhasil dihapus.');
            fetchDivisions();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menghapus divisi.');
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Divisions', href: '/admin/divisions' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Division Management" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Divisions</h1>
                        <p className="text-muted-foreground">
                            Manage your company divisions and departments.
                        </p>
                    </div>
                    <Button asChild className="bg-[#1a5f4a] hover:bg-[#154d3c]">
                        <Link href="/admin/divisions/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Division
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="p-4 border-b">
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative w-full max-w-sm flex items-center">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search divisions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 w-full bg-white"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        {/* ── MOBILE VIEW: Card List ────────────────── */}
                        <div className="space-y-3 md:hidden">
                            {loading ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    Loading divisions...
                                </div>
                            ) : divisions.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground border rounded-xl bg-gray-50">
                                    No divisions found.
                                </div>
                            ) : (
                                divisions.map((division) => (
                                    <Card
                                        key={division.id}
                                        className="cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all active:scale-[0.99] border rounded-xl overflow-hidden bg-white"
                                        onClick={() => router.visit(`/admin/divisions/${division.division_code?.id}/edit`)}
                                    >
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-center justify-between gap-2 border-b pb-2.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                                                        {division.division_code?.code}
                                                    </span>
                                                    <span className="font-semibold text-sm text-gray-900 truncate">
                                                        {division.division_code?.name}
                                                    </span>
                                                </div>
                                                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/divisions/${division.division_code?.id}/edit`}>Edit</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive cursor-pointer"
                                                                onClick={() => handleDelete(division.division_code?.id)}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold text-gray-700">Nama Divisi: {division.name}</p>
                                                {division.description && (
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{division.description}</p>
                                                )}
                                            </div>

                                            <div className="border-t pt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                                                <span>Dibuat pada:</span>
                                                <span>{new Date(division.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* ── DESKTOP VIEW: Data Table ────────────────── */}
                        <div className="hidden md:block rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-[120px]">Parent Code</TableHead>
                                        <TableHead className="w-[150px]">Parent Name</TableHead>
                                        <TableHead className="w-[200px]">Division Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="w-[150px]">Created At</TableHead>
                                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                Loading divisions...
                                            </TableCell>
                                        </TableRow>
                                    ) : divisions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No divisions found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        divisions.map((division) => (
                                            <TableRow
                                                key={division.id}
                                                className="cursor-pointer hover:bg-emerald-50/40 transition-colors"
                                                onClick={() => router.visit(`/admin/divisions/${division.division_code?.id}/edit`)}
                                            >
                                                <TableCell className="font-medium uppercase align-top pt-4">
                                                    {division.division_code?.code}
                                                </TableCell>
                                                <TableCell className="font-medium align-top pt-4">
                                                    {division.division_code?.name}
                                                </TableCell>
                                                <TableCell className="font-medium align-top pt-4">
                                                    {division.name}
                                                </TableCell>
                                                <TableCell className="py-4 align-top">
                                                    <span className="text-muted-foreground text-sm">
                                                        {division.description || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm align-top pt-4">
                                                    {new Date(division.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="text-right align-top pt-4" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                                <span className="sr-only">Open menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/divisions/${division.division_code?.id}/edit`}>Edit</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive cursor-pointer"
                                                                onClick={() => handleDelete(division.division_code?.id)}
                                                            >
                                                                Delete
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
        </AppSidebarLayout>
    );
}
