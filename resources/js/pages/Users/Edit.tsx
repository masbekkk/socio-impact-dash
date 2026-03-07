import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/SearchableSelect';
import { ArrowLeft, Save } from 'lucide-react';
import DatePicker from '@/components/DatePicker';
import axios from 'axios';
import { toast } from 'sonner';

interface EditProps {
    userId: number;
}

export default function Edit({ userId }: EditProps) {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // Form State
    const [form, setForm] = useState({
        name: '',
        position: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        employee_type: 'pegawai_tetap',
        contract_start: '',
        contract_end: '',
    });

    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rolesRes, userRes] = await Promise.all([
                    axios.get('/api/rbac/roles'),
                    axios.get(`/api/v1/users/${userId}`)
                ]);

                setRoles(rolesRes.data.data);

                const u = userRes.data.data;
                setForm({
                    name: u.name || '',
                    position: u.position || '',
                    email: u.email || '',
                    password: '',
                    password_confirmation: '',
                    role: (u.roles && u.roles.length > 0) ? u.roles[0] : '',
                    employee_type: u.employee_type || 'pegawai_tetap',
                    contract_start: u.contract_start ? u.contract_start : '',
                    contract_end: u.contract_end ? u.contract_end : '',
                });

            } catch (err) {
                console.error(err);
                toast.error('Failed to load data');
            } finally {
                setDataLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await axios.put(`/api/v1/users/${userId}`, form);
            toast.success('User updated successfully');
            router.visit('/admin/users');
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toast.error('Failed to update user');
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
        { title: 'Edit', href: `/admin/users/${userId}/edit` },
    ];

    if (dataLoading) {
        return (
            <AppSidebarLayout breadcrumbs={breadcrumbs}>
                <div className="p-10 text-center">Loading user data...</div>
            </AppSidebarLayout>
        );
    }

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />

            <div className="p-6 md:p-10 space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
                        <p className="text-muted-foreground">Modify team member details and roles.</p>
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
                                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                                    <SearchableSelect
                                        options={roles.map(r => ({ value: r.name, label: r.name }))}
                                        value={form.role}
                                        onValueChange={(val) => setForm({ ...form, role: val })}
                                        placeholder="Select a role"
                                    />
                                    {errors.role && <p className="text-sm text-red-500">{errors.role[0]}</p>}
                                </div>
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
                                    <Label htmlFor="password">Password (Leave blank to keep current)</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                    />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={form.password_confirmation}
                                        onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t p-6">
                            <Button type="submit" disabled={loading} className="bg-[#1a5f4a] hover:bg-[#154d3c] gap-2">
                                {loading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Changes</>}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
