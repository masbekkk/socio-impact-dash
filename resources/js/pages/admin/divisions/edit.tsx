import React, { useEffect, useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Props {
    divisionId: string;
}

export default function Edit({ divisionId }: Props) {
    const [loading, setLoading] = useState(true);
    const { data, setData, processing, errors, reset } = useForm({
        code: '',
        names: [{ name: '', description: '' }],
    });

    useEffect(() => {
        const fetchDivision = async () => {
            try {
                const res = await axios.get(`/api/v1/divisions/${divisionId}`);
                const division = res.data.data;
                setData({
                    code: division.code,
                    names: division.names && division.names.length > 0 ? division.names.map((n: any) => ({
                        name: n.name,
                        description: n.description || '',
                    })) : [{ name: '', description: '' }],
                });
            } catch (error) {
                toast.error('Gagal mengambil data divisi.');
                window.location.href = '/admin/divisions';
            } finally {
                setLoading(false);
            }
        };

        fetchDivision();
    }, [divisionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.put(`/api/v1/divisions/${divisionId}`, data);
            toast.success('Divisi berhasil diperbarui.');
            window.location.href = '/admin/divisions';
        } catch (error: any) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                Object.keys(validationErrors).forEach((key) => {
                    toast.error(validationErrors[key][0]);
                });
            } else {
                toast.error(error.response?.data?.message || 'Gagal memperbarui divisi.');
            }
        }
    };

    const addName = () => {
        setData('names', [...data.names, { name: '', description: '' }]);
    };

    const removeName = (index: number) => {
        const newNames = [...data.names];
        newNames.splice(index, 1);
        setData('names', newNames);
    };

    const updateName = (index: number, field: 'name' | 'description', value: string) => {
        const newNames = [...data.names];
        newNames[index][field] = value;
        setData('names', newNames);
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Divisions', href: '/admin/divisions' },
        { title: 'Edit', href: `/admin/divisions/${divisionId}/edit` },
    ];

    if (loading) {
        return (
            <AppSidebarLayout breadcrumbs={breadcrumbs}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AppSidebarLayout>
        );
    }

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Division" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/divisions">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Division</h1>
                        <p className="text-muted-foreground">
                            Update division details.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Division Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
                                <Input
                                    id="code"
                                    placeholder="e.g. FIN, HR, ENG"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Unique identifier for the division.</p>
                                {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Division Names <span className="text-red-500">*</span></Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addName}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Name
                                    </Button>
                                </div>

                                {data.names.map((nameEntry, index) => (
                                    <Card key={index} className="p-4 border border-border">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <Label>Name <span className="text-red-500">*</span></Label>
                                                    <Input
                                                        placeholder="e.g. Finance, Human Resources"
                                                        value={nameEntry.name}
                                                        onChange={(e) => updateName(index, 'name', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                {data.names.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => removeName(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Description (Optional)</Label>
                                                <Textarea
                                                    placeholder="Brief description of the division's responsibilities"
                                                    value={nameEntry.description}
                                                    onChange={(e) => updateName(index, 'description', e.target.value)}
                                                    className="min-h-[80px]"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                {errors.names && <p className="text-sm text-red-500">{errors.names}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-end gap-3 border-t p-6">
                            <Button variant="outline" asChild>
                                <Link href="/admin/divisions">Cancel</Link>
                            </Button>
                            <Button type="submit" className="bg-[#1a5f4a] hover:bg-[#154d3c]" disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Division
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
