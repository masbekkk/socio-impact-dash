import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, User as UserIcon, FileText, Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from '@/components/SearchableSelect';
import DatePicker from '@/components/DatePicker';
import { format } from "date-fns";
import axios from 'axios';
import { SharedData } from '@/types';
import { usePermission } from '@/hooks/use-permission';

interface Project {
    id: number;
    name: string;
    code: string;
    initial_project: string;
}

interface MasterData {
    id: number;
    code: string;
    description?: string;
}

interface DivisionCodeItem {
    id: number;
    code: string;
    name: string;
}

interface DivisionItem {
    id: number;
    division_code?: DivisionCodeItem | null;
}

interface Props {
    projects: Project[];
}

export default function Create({ projects }: Props) {
    const { auth } = usePage<SharedData>().props;
    const { hasRole } = usePermission();
    const userRole = auth.user.role_name;

    const [data, setData] = useState({
        project_id: '',
        letter_date: format(new Date(), 'yyyy-MM-dd'),
        recipient: '',
        subject: '',
        pic_id: '',
        letter_code_id: '',
        letter_division_id: '',
        division_id: '',
        keterangan: '',
        status: 'unused',
    });

    const [letterCodes, setLetterCodes] = useState<MasterData[]>([]);
    const [letterDivisions, setLetterDivisions] = useState<MasterData[]>([]);
    const [divisions, setDivisions] = useState<DivisionItem[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [codesRes, divisionsRes, mainDivRes] = await Promise.all([
                    axios.get('/api/v1/letter-codes'),
                    axios.get('/api/v1/letter-divisions'),
                    axios.get('/api/v1/divisions?per_page=1000')
                ]);
                setLetterCodes(codesRes.data.data);

                // Filter letter divisions based on role
                const allLetterDivs = divisionsRes.data.data;
                let filteredLetterDivs = allLetterDivs;

                const isAuthorized = hasRole(['direktur', 'superadmin', 'hr', 'finance', 'head']);

                if (isAuthorized) {
                    filteredLetterDivs = allLetterDivs;
                } else {
                    // Default to PM or all roles if PM
                    // According to requirements: PM - all roles
                    filteredLetterDivs = allLetterDivs.filter((d: MasterData) => d.code === 'PM');
                }

                setLetterDivisions(filteredLetterDivs);
                setDivisions(mainDivRes.data.data.data);
            } catch (error) {
                console.error("Error fetching master data:", error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchMasterData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userRole]);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Nomor Surat', href: '/letter-requests' },
        { title: 'Buat Nomor Surat', href: '/letter-requests/create' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.post('/api/v1/letter-requests', data);
            router.visit('/letter-requests');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response && error.response.data.errors) {
                setErrors(error.response.data.errors as Record<string, string[]>);
            } else {
                console.error("Error creating letter request:", error);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Nomor Surat" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="-ml-2">
                        <Link href="/letter-requests">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Buat Nomor Surat</h1>
                        <p className="text-muted-foreground text-sm">Lengkapi detail surat untuk mendapatkan nomor resmi.</p>
                    </div>
                </div>

                <script>
                    {/* Placeholder for helper if needed elsewhere, but LetterRequest handles it in setData */}
                </script>

                <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="bg-white">
                            <CardTitle>Informasi Surat</CardTitle>
                            <CardDescription>Detail tujuan dan perihal surat.</CardDescription>
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
                                        <SearchableSelect
                                            options={projects.map(p => ({ value: p.id.toString(), label: `${p.code} - ${p.initial_project} - ${p.name}` }))}
                                            value={data.project_id}
                                            onValueChange={(val) => setData({ ...data, project_id: val })}
                                            placeholder="Pilih proyek"
                                        />
                                        {errors.project_id && <p className="text-sm text-destructive font-medium">{errors.project_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="letter_date">Tanggal Surat <span className="text-red-500">*</span></Label>
                                        <DatePicker
                                            value={data.letter_date}
                                            onChange={(v) => setData({ ...data, letter_date: v })}
                                            max={format(new Date(), 'yyyy-MM-dd')}
                                        />
                                        {errors.letter_date && <p className="text-sm text-destructive font-medium">{errors.letter_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="letter_code_id">Kode Surat <span className="text-red-500">*</span></Label>
                                        <SearchableSelect
                                            options={letterCodes.map(code => ({
                                                value: code.id.toString(),
                                                label: `${code.code} ${code.description ? `- ${code.description}` : ''}`
                                            }))}
                                            value={data.letter_code_id}
                                            onValueChange={(val) => setData({ ...data, letter_code_id: val })}
                                            placeholder="Pilih kode surat"
                                        />
                                        {errors.letter_code_id && <p className="text-sm text-destructive font-medium">{errors.letter_code_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="letter_division_id">Divisi Surat <span className="text-red-500">*</span></Label>
                                        <SearchableSelect
                                            options={letterDivisions.map(div => ({
                                                value: div.id.toString(),
                                                label: `${div.code} ${div.description ? `- ${div.description}` : ''}`
                                            }))}
                                            value={data.letter_division_id}
                                            onValueChange={(val) => setData({ ...data, letter_division_id: val })}
                                            placeholder="Pilih divisi"
                                        />
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
                                        <SearchableSelect
                                            options={Array.from(new Map(divisions.map((d: DivisionItem) => [d.division_code?.id, d.division_code])).values())
                                                .filter((dc): dc is DivisionCodeItem => dc !== undefined && dc !== null)
                                                .map((dc: DivisionCodeItem) => ({
                                                    value: dc.id.toString(),
                                                    label: `${dc.code} - ${dc.name}`
                                                }))
                                            }
                                            value={data.division_id}
                                            onValueChange={(val) => setData({ ...data, division_id: val })}
                                            placeholder="Pilih divisi perusahaan"
                                        />
                                        {errors.division_id && <p className="text-sm text-destructive font-medium">{errors.division_id}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="status">Status Surat <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(val) => setData({ ...data, status: val })}
                                        >
                                            <SelectTrigger id="status" className="h-10 w-full bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-ring">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="used">Terpakai</SelectItem>
                                                <SelectItem value="unused">Tidak Terpakai</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-sm text-destructive font-medium">{errors.status}</p>}
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
                                Simpan
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
