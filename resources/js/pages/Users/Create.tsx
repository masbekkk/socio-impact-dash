import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/SearchableSelect';
import { SearchableMultiSelect } from '@/components/SearchableMultiSelect';
import { ArrowLeft, Save } from 'lucide-react';
import DatePicker from '@/components/DatePicker';
import axios from 'axios';
import { toast } from 'sonner';

export default function Create() {
    const [roles, setRoles] = useState<any[]>([]);
    const [divisions, setDivisions] = useState<any[]>([]);
    const [heads, setHeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [form, setForm] = useState({
        name: '',
        position: '',
        nip: '',
        division_id: '',
        head_id: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
        employee_type: 'pegawai_tetap',
        contract_start: '',
        contract_end: '',
    });

    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        Promise.all([
            axios.get('/api/rbac/roles'),
            axios.get('/api/v1/divisions?per_page=100'),
            axios.get('/api/v1/users?role=head&per_page=100'),
        ]).then(([rolesRes, divisionsRes, headsRes]) => {
            setRoles(rolesRes.data.data);

            const divisionsData = divisionsRes.data?.data?.data ?? divisionsRes.data?.data ?? [];
            const allDivisions = Array.isArray(divisionsData) ? divisionsData.map((d: any) => ({
                value: d.id.toString(),
                label: `${d.division_code?.code} - ${d.name}`
            })) : [];
            setDivisions(allDivisions);

            const headUsers = headsRes.data?.data?.data ?? headsRes.data?.data ?? [];
            setHeads(headUsers.map((u: any) => ({ value: u.id.toString(), label: u.name })));
        }).catch(err => console.error(err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await axios.post('/api/v1/users', form);
            toast.success('User created successfully');
            router.visit('/admin/users');
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Failed to create user');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleValueChange = (name: string, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: 'Create', href: '/admin/users/create' },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <div className="p-6 md:p-10 space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create User</h1>
                        <p className="text-muted-foreground">Add a new team member and assign their role.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>User Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="John Doe"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position">Position</Label>
                                    <Input
                                        id="position"
                                        value={form.position}
                                        onChange={e => setForm({ ...form, position: e.target.value })}
                                        placeholder="e.g. Director, CID Officer"
                                    />
                                    {errors.position && <p className="text-sm text-red-500">{errors.position[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nip">NIP</Label>
                                    <Input
                                        id="nip"
                                        value={form.nip}
                                        onChange={e => setForm({ ...form, nip: e.target.value })}
                                        placeholder="e.g. 19900101..."
                                    />
                                    {errors.nip && <p className="text-sm text-red-500">{errors.nip[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="division_id">Division</Label>
                                    <SearchableSelect
                                        options={divisions}
                                        value={form.division_id}
                                        onValueChange={(val) => setForm({ ...form, division_id: val })}
                                        placeholder="Select a division"
                                    />
                                    {errors.division_id && <p className="text-sm text-red-500">{errors.division_id[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        placeholder="john@example.com"
                                        required
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="roles">Roles <span className="text-red-500">*</span></Label>
                                    <SearchableMultiSelect
                                        options={roles.map(r => ({ value: r.name, label: r.name }))}
                                        value={form.roles}
                                        onValueChange={(val) => setForm({ ...form, roles: val })}
                                        placeholder="Select roles"
                                    />
                                    {errors.roles && <p className="text-sm text-red-500">{errors.roles[0]}</p>}
                                </div>
                                {(!form.roles.some(r => ['head', 'superadmin', 'direktur'].includes(r))) && form.roles.length > 0 && (
                                    <div className="space-y-2">
                                        <Label htmlFor="head_id">Head (Atasan)</Label>
                                        <SearchableSelect
                                            options={heads}
                                            value={form.head_id}
                                            onValueChange={(val) => setForm({ ...form, head_id: val })}
                                            placeholder="Select head"
                                        />
                                        {errors.head_id && <p className="text-sm text-red-500">{errors.head_id[0]}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label htmlFor="employee_type">Employee Type</Label>
                                    <SearchableSelect
                                        options={[
                                            { value: 'pegawai_tetap', label: 'Pegawai Tetap' },
                                            { value: 'kontrak', label: 'Kontrak' },
                                            { value: 'intern', label: 'Intern' },
                                        ]}
                                        value={form.employee_type}
                                        onValueChange={(val) => setForm({ ...form, employee_type: val })}
                                        placeholder="Select type"
                                    />
                                </div>
                            </div>

                            {form.employee_type === 'kontrak' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="contract_start">Contract Start Date</Label>
                                        <DatePicker
                                            value={form.contract_start}
                                            onChange={(v) => handleValueChange('contract_start', v)}
                                        />
                                        {errors.contract_start && <p className="text-sm text-red-500">{errors.contract_start[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contract_end">Contract End Date</Label>
                                        <DatePicker
                                            value={form.contract_end}
                                            onChange={(v) => handleValueChange('contract_end', v)}
                                        />
                                        {errors.contract_end && <p className="text-sm text-red-500">{errors.contract_end[0]}</p>}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={form.password_confirmation}
                                        onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t p-6">
                            <Button type="submit" disabled={loading} className="bg-[#1a5f4a] hover:bg-[#154d3c] gap-2">
                                {loading ? 'Saving...' : <><Save className="h-4 w-4" /> Save User</>}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
