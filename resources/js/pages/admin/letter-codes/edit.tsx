import React, { useEffect, useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Props {
    letterCodeId: string;
}

export default function Edit({ letterCodeId }: Props) {
    const [loading, setLoading] = useState(true);
    const { data, setData, processing, errors, reset } = useForm({
        code: '',
        name: '',
        description: '',
    });

    useEffect(() => {
        const fetchLetter Code = async () => {
            try {
                const res = await axios.get(`/api/v1/letter-codes/${letterCodeId}`);
                const kode suraton = res.data.data;
                setData({
                    code: kode suraton.code,
                    name: kode suraton.name,
                    description: kode suraton.description || '',
                });
            } catch (error) {
                toast.error('Gagal mengambil data kode surat.');
                window.location.href = '/admin/letter-codes';
            } finally {
                setLoading(false);
            }
        };

        fetchLetter Code();
    }, [letterCodeId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.put(`/api/v1/letter-codes/${letterCodeId}`, data);
            toast.success('Kode Surat berhasil diperbarui.');
            window.location.href = '/admin/letter-codes';
        } catch (error: any) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                Object.keys(validationErrors).forEach((key) => {
                    toast.error(validationErrors[key][0]);
                });
            } else {
                toast.error(error.response?.data?.message || 'Gagal memperbarui kode surat.');
            }
        }
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Letter Codes', href: '/admin/letter-codes' },
        { title: 'Edit', href: `/admin/letter-codes/${letterCodeId}/edit` },
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
            <Head title="Edit Letter Code" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/letter-codes">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Letter Code</h1>
                        <p className="text-muted-foreground">
                            Update kode suraton details.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Letter Code Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g. FIN, HR, ENG"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">Unique identifier for the kode suraton.</p>
                                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Finance, Human Resources"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief description of the kode suraton's responsibilities"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="min-h-[100px]"
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-end gap-3 border-t p-6">
                            <Button variant="outline" asChild>
                                <Link href="/admin/letter-codes">Cancel</Link>
                            </Button>
                            <Button className="bg-[#1a5f4a] hover:bg-[#154d3c]" disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Letter Code
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
