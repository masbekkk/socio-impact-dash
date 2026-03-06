import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Briefcase, Calendar as CalendarIcon, User as UserIcon, FileText, Loader2, Tag, Layers } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import axios from 'axios';
import { SharedData } from '@/types';

interface Project {
    id: number;
    name: string;
    code: string;
}

interface MasterData {
    id: number;
    code: string;
    description?: string;
    name?: string; // For users
    names?: { id: number; name: string; description?: string }[]; // For divisions
}

interface Props {
    projects: Project[];
    letterRequestId: string;
}

export default function Edit({ projects, letterRequestId }: Props) {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role_name;

    const [data, setData] = useState({
        project_id: '',
        letter_date: '',
        recipient: '',
        subject: '',
        pic_id: '',
        letter_code_id: '',
        letter_division_id: '',
        division_id: '',
        keterangan: '',
    });

    const [letterCodes, setLetterCodes] = useState<MasterData[]>([]);
    const [letterDivisions, setLetterDivisions] = useState<MasterData[]>([]);
    const [users, setUsers] = useState<MasterData[]>([]);
    const [divisions, setDivisions] = useState<MasterData[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [codesRes, divisionsRes, usersRes, mainDivRes, requestRes] = await Promise.all([
                    axios.get('/api/v1/letter-codes'),
                    axios.get('/api/v1/letter-divisions'),
                    axios.get('/api/v1/users?per_page=1000'),
                    axios.get('/api/v1/divisions?per_page=1000'),
                    axios.get(`/api/v1/letter-requests/${letterRequestId}`)
                ]);

                setLetterCodes(codesRes.data.data);

                // Filter letter divisions based on role
                const allLetterDivs = divisionsRes.data.data;
                let filteredLetterDivs = allLetterDivs;

                if (userRole === 'direktur' || userRole === 'superadmin') {
                    filteredLetterDivs = allLetterDivs.filter((d: any) => ['Direktur', 'Finance', 'HCM', 'BOD'].includes(d.code));
                } else if (userRole === 'hr') {
                    filteredLetterDivs = allLetterDivs.filter((d: any) => d.code === 'HR' || d.code === 'HCM');
                } else if (userRole === 'finance') {
                    filteredLetterDivs = allLetterDivs.filter((d: any) => d.code === 'Finance' || d.code === 'FA');
                } else {
                    filteredLetterDivs = allLetterDivs;
                }

                setLetterDivisions(filteredLetterDivs);
                setUsers(usersRes.data.data.data);
                setDivisions(mainDivRes.data.data.data);

                const reqData = requestRes.data.data;
                setData({
                    project_id: reqData.project_id?.toString() || '',
                    letter_date: reqData.letter_date ? format(new Date(reqData.letter_date), 'yyyy-MM-dd') : '',
                    recipient: reqData.recipient || '',
                    subject: reqData.subject || '',
                    pic_id: reqData.pic_id?.toString() || '',
                    letter_code_id: reqData.letter_code_id?.toString() || '',
                    letter_division_id: reqData.letter_division_id?.toString() || '',
                    division_id: reqData.division_id?.toString() || '',
                    keterangan: reqData.keterangan || '',
                });

            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Gagal memuat data nomor surat.");
                router.visit('/letter-requests');
            } finally {
                setLoadingData(false);
            }
        };
        fetchAllData();
    }, [letterRequestId, userRole]);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Nomor Surat', href: '/letter-requests' },
        { title: 'Edit Nomor Surat', href: `/letter-requests/${letterRequestId}/edit` },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.put(`/api/v1/letter-requests/${letterRequestId}`, data);
            router.visit('/letter-requests');
        } catch (error: any) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error updating letter request:", error);
                alert("Terjadi kesalahan saat memperbarui nomor surat.");
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Nomor Surat" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="-ml-2">
                        <Link href="/letter-requests">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Edit Nomor Surat</h1>
                        <p className="text-muted-foreground text-sm">Perbarui detail nomor surat Anda.</p>
                    </div>
                </div>

                <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="bg-white">
                            <CardTitle>Informasi Surat</CardTitle>
                            <CardDescription>Ubah tujuan dan perihal surat atau data lainnya.</CardDescription>
                        </CardHeader>

                        {loadingData ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="project_id">Proyek Terkait <span className="text-red-500">*</span></Label>
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

                                    <div className="space-y-2">
                                        <Label htmlFor="letter_date">Tanggal Surat <span className="text-red-500">*</span></Label>
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
                                        <Label htmlFor="letter_code_id">Kode Surat <span className="text-red-500">*</span></Label>
                                        <Select onValueChange={(val) => setData({ ...data, letter_code_id: val })} value={data.letter_code_id}>
                                            <SelectTrigger className="h-10">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Pilih kode surat" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {letterCodes.map((code) => (
                                                    <SelectItem key={code.id} value={code.id.toString()}>
                                                        {code.code} {code.description && `- ${code.description}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.letter_code_id && <p className="text-sm text-destructive font-medium">{errors.letter_code_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="letter_division_id">Divisi Surat <span className="text-red-500">*</span></Label>
                                        <Select onValueChange={(val) => setData({ ...data, letter_division_id: val })} value={data.letter_division_id}>
                                            <SelectTrigger className="h-10">
                                                <div className="flex items-center gap-2">
                                                    <Layers className="h-4 w-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Pilih divisi" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {letterDivisions.map((div) => (
                                                    <SelectItem key={div.id} value={div.id.toString()}>
                                                        {div.code} {div.description && `- ${div.description}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.letter_division_id && <p className="text-sm text-destructive font-medium">{errors.letter_division_id}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="recipient">Surat Tertuju Kepada <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="recipient"
                                                placeholder="Contoh: Direktur PT Sinergi Alam"
                                                className="pl-9 h-10 w-full"
                                                value={data.recipient}
                                                onChange={(e) => setData({ ...data, recipient: e.target.value })}
                                            />
                                        </div>
                                        {errors.recipient && <p className="text-sm text-destructive font-medium">{errors.recipient}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="subject">Perihal <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="subject"
                                                placeholder="Contoh: Permohonan Izin Lokasi"
                                                className="pl-9 h-10 w-full"
                                                value={data.subject}
                                                onChange={(e) => setData({ ...data, subject: e.target.value })}
                                            />
                                        </div>
                                        {errors.subject && <p className="text-sm text-destructive font-medium">{errors.subject}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="division_id">Divisi Perusahaan <span className="text-red-500">*</span></Label>
                                        <Select onValueChange={(val) => setData({ ...data, division_id: val })} value={data.division_id}>
                                            <SelectTrigger className="h-10">
                                                <div className="flex items-center gap-2">
                                                    <Layers className="h-4 w-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Pilih divisi perusahaan" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {divisions.map((divCode) => (
                                                    <SelectItem
                                                        key={divCode.id}
                                                        value={divCode.names && divCode.names.length > 0 ? divCode.names[0].id.toString() : ''}
                                                    >
                                                        {divCode.code}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.division_id && <p className="text-sm text-destructive font-medium">{errors.division_id}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                                        <Textarea
                                            id="keterangan"
                                            placeholder="Tambahkan keterangan tambahan jika ada..."
                                            className="min-h-[100px] w-full"
                                            value={data.keterangan}
                                            onChange={(e) => setData({ ...data, keterangan: e.target.value })}
                                        />
                                        {errors.keterangan && <p className="text-sm text-destructive font-medium">{errors.keterangan}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        )}
                        <CardFooter className="bg-gray-50 border-t flex justify-end gap-3 p-6 mt-4">
                            <Button variant="outline" type="button" asChild>
                                <Link href="/letter-requests">Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing || loadingData} className="bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)]/90">
                                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Simpan Perubahan
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
