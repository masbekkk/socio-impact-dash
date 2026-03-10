import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { SearchableSelect } from '@/components/SearchableSelect';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import DatePicker from '@/components/DatePicker';

// Define User interface directly here to avoid import issues for now
interface User {
    id: number;
    name: string;
    position: string | null;
    email: string;
    roles: string[];
    employee_type: string | null;
    contract_start: string | null;
    contract_end: string | null;
    status: string;
    created_at: string;
    head_id: number | null;
    head: { id: number; name: string; email: string } | null;
    team_members_count: number | null;
    nip: string | null;
    division: any | null;
}

export default function Index() {
    const [users, setUsers] = useState<User[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [roles, setRoles] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [showFilters, setShowFilters] = useState(false);

    // Filters state
    const [positionFilter, setPositionFilter] = useState('');
    const [employeeTypeFilter, setEmployeeTypeFilter] = useState('all');
    const [joinedFrom, setJoinedFrom] = useState('');
    const [joinedTo, setJoinedTo] = useState('');
    const [contractFrom, setContractFrom] = useState('');
    const [contractTo, setContractTo] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/users', {
                params: {
                    search: searchQuery,
                    role: roleFilter !== 'all' ? roleFilter : '',
                    position: positionFilter,
                    employee_type: employeeTypeFilter !== 'all' ? employeeTypeFilter : '',
                    joined_from: joinedFrom,
                    joined_to: joinedTo,
                    contract_from: contractFrom,
                    contract_to: contractTo,
                    page: page,
                    per_page: perPage,
                }
            });
            setUsers(res.data.data.data); // data.data is the payload, the nested .data is from pagination
            setMeta(res.data.data.meta);
        } catch (error) {
            toast.error('Gagal mengambil data user.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await axios.get('/api/rbac/roles');
            setRoles(res.data.data);
        } catch (error) {
            console.error('Failed to fetch roles', error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        // Reset page to 1 when search or filter changes
        setPage(1);
    }, [searchQuery, roleFilter, positionFilter, employeeTypeFilter, joinedFrom, joinedTo, contractFrom, contractTo]);

    useEffect(() => {
        fetchUsers();
    }, [searchQuery, roleFilter, positionFilter, employeeTypeFilter, joinedFrom, joinedTo, contractFrom, contractTo, page, perPage]);

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah anda yakin ingin menghapus user ini?')) return;
        try {
            await axios.delete(`/api/v1/users/${id}`);
            toast.success('User berhasil dihapus.');
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menghapus user.');
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/admin/users' },
    ];

    const getRoleBadgeColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'superadmin':
                return 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200';
            case 'head':
                return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
            case 'finance':
                return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200';
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                        <p className="text-muted-foreground">
                            Manage your team members and their roles.
                        </p>
                    </div>
                    <Button asChild className="bg-[#1a5f4a] hover:bg-[#154d3c]">
                        <Link href="/admin/users/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="p-4 border-b space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="relative w-full sm:max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 w-full bg-white"
                                />
                            </div>
                            <Button
                                variant={showFilters ? 'secondary' : 'outline'}
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full sm:w-auto gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Advanced Filters
                            </Button>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <SearchableSelect
                                        options={[
                                            { label: 'All Roles', value: 'all' },
                                            ...roles.map(r => ({ label: r.name, value: r.name }))
                                        ]}
                                        value={roleFilter || 'all'}
                                        onValueChange={setRoleFilter}
                                        placeholder="All Roles"
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Position</Label>
                                    <Input
                                        placeholder="Filter by position..."
                                        value={positionFilter}
                                        onChange={(e) => setPositionFilter(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Employment Type</Label>
                                    <SearchableSelect
                                        options={[
                                            { label: 'All Types', value: 'all' },
                                            { label: 'Pegawai Tetap', value: 'pegawai_tetap' },
                                            { label: 'Kontrak', value: 'kontrak' },
                                            { label: 'Intern', value: 'intern' },
                                        ]}
                                        value={employeeTypeFilter}
                                        onValueChange={setEmployeeTypeFilter}
                                        placeholder="All Types"
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Joined From</Label>
                                    <DatePicker value={joinedFrom} onChange={setJoinedFrom} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Joined To</Label>
                                    <DatePicker value={joinedTo} onChange={setJoinedTo} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contract From</Label>
                                    <DatePicker value={contractFrom} onChange={setContractFrom} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contract To</Label>
                                    <DatePicker value={contractTo} onChange={setContractTo} />
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="w-[300px]">User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Divisi</TableHead>
                                    <TableHead>Head / Team</TableHead>
                                    <TableHead>Employment</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Loading users...
                                        </TableCell>
                                    </TableRow>
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/5">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border">
                                                        <AvatarFallback className="bg-[#1a5f4a]/10 text-[#1a5f4a]">
                                                            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{user.name}</span>
                                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                                        <span className="text-xs text-muted-foreground">{user.nip}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {user.roles && user.roles.length > 0 ? user.roles.map(r => (
                                                        <Badge key={r} variant="outline" className={`capitalize font-normal ${getRoleBadgeColor(r)}`}>
                                                            {r}
                                                        </Badge>
                                                    )) : (
                                                        <span className="text-xs text-muted-foreground italic">No Role</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium">{user.position || '-'}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium">{user.division ? user.division.division_code.code + ' - ' + user.division.name : '-'}</span>
                                            </TableCell>
                                            <TableCell>
                                                {user.head ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-muted-foreground">Atasan:</span>
                                                        <span className="text-sm font-medium">{user.head.name}</span>
                                                    </div>
                                                ) : user.team_members_count && user.team_members_count > 0 ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-muted-foreground">Team: </span>
                                                        <span className="text-sm font-medium">{user.team_members_count} anggota</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium capitalize">
                                                        {(user.employee_type || '-').replace('_', ' ')}
                                                    </span>
                                                    {user.contract_start && user.contract_end && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(user.contract_start).toLocaleDateString('id-ID')} - {new Date(user.contract_end).toLocaleDateString('id-ID')}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                                                            <Link href={`/admin/users/${user.id}/edit`}>Edit</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive cursor-pointer"
                                                            onClick={() => handleDelete(user.id)}
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

                        {/* Pagination */}
                        {!loading && meta && meta.total > 0 && (
                            <div className="flex items-center justify-between px-4 py-4 border-t">
                                <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                                    Menampilkan {meta.from} sampai {meta.to} dari {meta.total} hasil
                                </div>
                                <div className="flex w-full items-center gap-8 lg:w-fit">
                                    <div className="hidden items-center gap-2 lg:flex">
                                        <Label className="text-sm font-medium">Baris per halaman</Label>
                                        <SearchableSelect
                                            options={[10, 20, 30, 50].map(s => ({ label: s.toString(), value: s.toString() }))}
                                            value={`${perPage}`}
                                            onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}
                                            className="w-20 h-8"
                                            placeholder={`${perPage}`}
                                        />
                                    </div>
                                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                                        Halaman {meta.current_page} dari {meta.last_page}
                                    </div>
                                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                                        <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => setPage(1)} disabled={page === 1}>
                                            <ChevronsLeft className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPage(Math.min(meta.last_page, page + 1))} disabled={page === meta.last_page}>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => setPage(meta.last_page)} disabled={page === meta.last_page}>
                                            <ChevronsRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
