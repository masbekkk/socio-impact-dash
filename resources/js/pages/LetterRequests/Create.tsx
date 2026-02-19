import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Briefcase, Calendar as CalendarIcon, User, FileText, Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import axios from 'axios';

interface Project {
    id: number;
    name: string;
    code: string;
}

interface Props {
    projects: Project[];
}

export default function Create({ projects }: Props) {
    const [data, setData] = useState({
        project_id: '',
        letter_date: format(new Date(), 'yyyy-MM-dd'),
        recipient: '',
        subject: '',
        pic_name: '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Nomor Surat', href: '/letter-requests' },
        { title: 'Buat Pengajuan', href: '/letter-requests/create' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.post('/api/v1/letter-requests', data);
            router.visit('/letter-requests');
        } catch (error: any) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error creating letter request:", error);
                alert("Terjadi kesalahan saat mengirim pengajuan.");
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengajuan Nomor Surat" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="-ml-2">
                        <Link href="/letter-requests">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Pengajuan Nomor Surat</h1>
                        <p className="text-muted-foreground text-sm">Lengkapi detail surat untuk mendapatkan nomor resmi.</p>
                    </div>
                </div>

                <Card className="border-none shadow-sm rounded-xl overflow-hidden max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="bg-white">
                            <CardTitle>Informasi Surat</CardTitle>
                            <CardDescription>Detail tujuan dan perihal surat.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="project_id">Proyek Terkait</Label>
                                <Select onValueChange={(val) => setData({ ...data, project_id: val })} value={data.project_id}>
                                    <SelectTrigger className="h-10">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Pilih proyek" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {p.code} - {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.project_id && <p className="text-sm text-destructive font-medium">{errors.project_id}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="letter_date">Tanggal Surat</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="letter_date"
                                            type="date"
                                            className="pl-9 h-10"
                                            value={data.letter_date}
                                            onChange={(e) => setData({ ...data, letter_date: e.target.value })}
                                        />
                                    </div>
                                    {errors.letter_date && <p className="text-sm text-destructive font-medium">{errors.letter_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pic_name">PIC</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="pic_name"
                                            placeholder="Nama PIC"
                                            className="pl-9 h-10"
                                            value={data.pic_name}
                                            onChange={(e) => setData({ ...data, pic_name: e.target.value })}
                                        />
                                    </div>
                                    {errors.pic_name && <p className="text-sm text-destructive font-medium">{errors.pic_name}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="recipient">Surat Tertuju Kepada</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="recipient"
                                        placeholder="Contoh: Direktur PT Sinergi Alam"
                                        className="pl-9 h-10"
                                        value={data.recipient}
                                        onChange={(e) => setData({ ...data, recipient: e.target.value })}
                                    />
                                </div>
                                {errors.recipient && <p className="text-sm text-destructive font-medium">{errors.recipient}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Perihal</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="subject"
                                        placeholder="Contoh: Permohonan Izin Lokasi"
                                        className="pl-9 h-10"
                                        value={data.subject}
                                        onChange={(e) => setData({ ...data, subject: e.target.value })}
                                    />
                                </div>
                                {errors.subject && <p className="text-sm text-destructive font-medium">{errors.subject}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 border-t flex justify-between p-6">
                            <Button variant="outline" type="button" asChild>
                                <Link href="/letter-requests">Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)]/90">
                                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Kirim Pengajuan
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
