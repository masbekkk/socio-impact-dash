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

interface LetterCode {
    id: number;
    code: string;
    name: string;
    description: string | null;
    created_at: string;
}

export default function Index() {
    const [letterCodes, setLetterCodes] = useState<LetterCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchLetterCodes = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/letter-codes', {
                params: {
                    search: searchQuery,
                }
            });
            setLetterCodes(res.data.data.data);
        } catch (error) {
            toast.error('Gagal mengambil data kode surat.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLetterCodes();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah anda yakin ingin menghapus kode surat ini?')) return;
        try {
            await axios.delete(`/api/v1/letter-codes/${id}`);
            toast.success('Kode Surat berhasil dihapus.');
            fetchLetterCodes();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menghapus kode surat.');
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Letter Codes', href: '/admin/letter-codes' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Letter Code Management" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Letter Codes</h1>
                        <p className="text-muted-foreground">
                            Manage your company letter-codes and departments.
                        </p>
                    </div>
                    <Button asChild className="bg-[#1a5f4a] hover:bg-[#154d3c]">
                        <Link href="/admin/letter-codes/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Letter Code
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="p-4 border-b">
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search letter-codes..."
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
                                    Loading letter-codes...
                                </div>
                            ) : letterCodes.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground border rounded-xl bg-gray-50">
                                    No letter-codes found.
                                </div>
                            ) : (
                                letterCodes.map((kodeSurat) => (
                                    <Card
                                        key={kodeSurat.id}
                                        className="cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all active:scale-[0.99] border rounded-xl overflow-hidden bg-white"
                                        onClick={() => router.visit(`/admin/letter-codes/${kodeSurat.id}/edit`)}
                                    >
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-center justify-between gap-2 border-b pb-2.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="font-mono font-bold text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase">
                                                        {kodeSurat.code}
                                                    </span>
                                                    <span className="font-semibold text-sm text-gray-900 truncate">
                                                        {kodeSurat.name}
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
                                                                <Link href={`/admin/letter-codes/${kodeSurat.id}/edit`}>Edit</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive cursor-pointer"
                                                                onClick={() => handleDelete(kodeSurat.id)}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>

                                            {kodeSurat.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2">{kodeSurat.description}</p>
                                            )}

                                            <div className="border-t pt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                                                <span>Dibuat pada:</span>
                                                <span>{new Date(kodeSurat.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
                                        <TableHead className="w-[150px]">Code</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Loading letter-codes...
                                            </TableCell>
                                        </TableRow>
                                    ) : letterCodes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No letter-codes found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        letterCodes.map((kodeSurat) => (
                                            <TableRow
                                                key={kodeSurat.id}
                                                className="cursor-pointer hover:bg-emerald-50/40 transition-colors"
                                                onClick={() => router.visit(`/admin/letter-codes/${kodeSurat.id}/edit`)}
                                            >
                                                <TableCell className="font-medium uppercase">
                                                    {kodeSurat.code}
                                                </TableCell>
                                                <TableCell>
                                                    {kodeSurat.name}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate text-muted-foreground">
                                                    {kodeSurat.description || '-'}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {new Date(kodeSurat.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                                <span className="sr-only">Open menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/letter-codes/${kodeSurat.id}/edit`}>Edit</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive cursor-pointer"
                                                                onClick={() => handleDelete(kodeSurat.id)}
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
