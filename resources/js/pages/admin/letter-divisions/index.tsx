import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
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

interface LetterDivision {
    id: number;
    code: string;
    name: string;
    description: string | null;
    created_at: string;
}

export default function Index() {
    const [letterDivisions, setLetterDivisions] = useState<LetterDivision[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchLetterDivisions = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/letter-divisions', {
                params: {
                    search: searchQuery,
                }
            });
            setLetterDivisions(res.data.data.data);
        } catch (error) {
            toast.error('Gagal mengambil data divisi surat.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLetterDivisions();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah anda yakin ingin menghapus divisi surat ini?')) return;
        try {
            await axios.delete(`/api/v1/letter-divisions/${id}`);
            toast.success('Divisi Surat berhasil dihapus.');
            fetchLetterDivisions();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menghapus divisi surat.');
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'LetterDivisions', href: '/admin/letter-divisions' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="LetterDivision Management" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">LetterDivisions</h1>
                        <p className="text-muted-foreground">
                            Manage your company letter-divisions and departments.
                        </p>
                    </div>
                    <Button asChild className="bg-[#1a5f4a] hover:bg-[#154d3c]">
                        <Link href="/admin/letter-divisions/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add LetterDivision
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
                                    placeholder="Search letter-divisions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 w-full bg-white"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
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
                                            Loading letter-divisions...
                                        </TableCell>
                                    </TableRow>
                                ) : letterDivisions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No letter-divisions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    letterDivisions.map((letterDivision) => (
                                        <TableRow key={letterDivision.id} className="hover:bg-muted/5">
                                            <TableCell className="font-medium uppercase">
                                                {letterDivision.code}
                                            </TableCell>
                                            <TableCell>
                                                {letterDivision.name}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate text-muted-foreground">
                                                {letterDivision.description || '-'}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(letterDivision.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/letter-divisions/${letterDivision.id}/edit`}>Edit</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive cursor-pointer"
                                                            onClick={() => handleDelete(letterDivision.id)}
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
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
