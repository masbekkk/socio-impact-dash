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

interface DivisionName {
    id: number;
    name: string;
    description: string | null;
}

interface Division {
    id: number;
    code: string;
    names: DivisionName[];
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
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="w-[150px]">Code</TableHead>
                                    <TableHead>Names</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            Loading divisions...
                                        </TableCell>
                                    </TableRow>
                                ) : divisions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No divisions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    divisions.map((division) => (
                                        <TableRow key={division.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium uppercase align-top pt-4">
                                                {division.code}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <ul className="list-disc list-inside space-y-1">
                                                    {division.names && division.names.map((n) => (
                                                        <li key={n.id}>
                                                            <span className="font-medium">{n.name}</span>
                                                            {n.description && (
                                                                <span className="text-muted-foreground block pl-5 text-sm">
                                                                    {n.description}
                                                                </span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm align-top pt-4">
                                                {new Date(division.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="text-right align-top pt-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/divisions/${division.id}/edit`}>Edit</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive cursor-pointer"
                                                            onClick={() => handleDelete(division.id)}
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
