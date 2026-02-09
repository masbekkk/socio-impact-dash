import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, FileText, ArrowLeft, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// --- Mock Projects ---
const MOCK_PROJECTS = [
    { id: '1', name: 'Socio Impact Development' },
    { id: '2', name: 'Community Outreach Phase 1' },
    { id: '3', name: 'Education Fund Assessment' },
];

export default function CreatePresence() {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Presensi', href: '/presences' },
        { title: 'Buat Presensi', href: '/presences/create' },
    ];

    const [loadingLocation, setLoadingLocation] = useState(false);

    // Using Inertia useForm for better form handling
    const { data, setData, post, processing, errors } = useForm({
        project_id: '',
        activity: '',
        notes: '',
        lat: '',
        lng: '',
        image: null as File | null,
    });

    const handleFetchLocation = () => {
        setLoadingLocation(true);
        if (!navigator.geolocation) {
            alert('Geolocation tidak didukung oleh browser ini.');
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setData(prev => ({
                    ...prev,
                    lat: pos.coords.latitude.toString(),
                    lng: pos.coords.longitude.toString()
                }));
                setLoadingLocation(false);
            },
            (err) => {
                alert('Gagal mengambil lokasi: ' + err.message);
                setLoadingLocation(false);
            }
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('image', e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.project_id || !data.activity || !data.lat || !data.image) {
            alert('Harap lengkapi semua data wajib (Project, Kegiatan, Lokasi, dan Foto).');
            return;
        }

        // Simulate submission
        console.log('Submitting Presence:', data);
        alert('Data presensi berhasil disubmit (Simulasi)!');
        // In real app: post('/presences', data);
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Presensi" />

            <div className="p-6 md:p-10 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="-ml-2">
                        <Link href="/presences">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Form Check-In Harian</h1>
                        <p className="text-muted-foreground text-sm">Isi formulir di bawah ini untuk melakukan presensi harian Anda.</p>
                    </div>
                </div>

                <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 md:p-8 bg-white space-y-8">
                            {/* 1. Project Selection */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Detail Kegiatan</h3>
                                    <p className="text-sm text-muted-foreground">Informasi proyek dan aktivitas yang dilakukan.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="project">
                                            Proyek <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={data.project_id}
                                            onValueChange={(val) => setData('project_id', val)}
                                        >
                                            <SelectTrigger id="project" className="h-10">
                                                <SelectValue placeholder="Pilih Proyek..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {MOCK_PROJECTS.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.project_id && <p className="text-sm text-destructive">{errors.project_id}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="activity">
                                            Kegiatan <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="activity"
                                            placeholder="Judul kegiatan singkat..."
                                            value={data.activity}
                                            onChange={(e) => setData('activity', e.target.value)}
                                            className="h-10"
                                        />
                                        {errors.activity && <p className="text-sm text-destructive">{errors.activity}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        Deskripsi Detail
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Deskripsikan kegiatan secara rinci..."
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="resize-none h-24"
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* 2. Location & Documentation */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Bukti Kehadiran</h3>
                                    <p className="text-sm text-muted-foreground">Lokasi dan foto dokumentasi wajib disertakan.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Location */}
                                    <div className="grid gap-2">
                                        <Label>
                                            Lokasi Saat Ini <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="bg-muted/30 p-4 rounded-lg border border-dashed flex flex-col justify-between gap-4 h-full">
                                            <div className="text-sm text-muted-foreground">
                                                {data.lat ? (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-foreground font-medium">
                                                            <MapPin className="h-4 w-4 text-primary" />
                                                            Lokasi Terkunci
                                                        </div>
                                                        <div className="text-xs font-mono bg-muted p-1 rounded inline-block">
                                                            {Number(data.lat).toFixed(6)}, {Number(data.lng).toFixed(6)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full py-4 text-center gap-2">
                                                        <MapPin className="h-8 w-8 text-muted-foreground/50" />
                                                        <span>Belum ada data lokasi.</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={handleFetchLocation}
                                                disabled={loadingLocation}
                                                className="w-full"
                                            >
                                                {loadingLocation ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                )}
                                                {data.lat ? 'Perbarui Lokasi' : 'Ambil Lokasi'}
                                            </Button>
                                        </div>
                                        {errors.lat && <p className="text-sm text-destructive">Data lokasi wajib diisi.</p>}
                                    </div>

                                    {/* Documentation */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="documentation">
                                            Dokumentasi (Foto) <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="border-2 border-dashed rounded-lg h-full min-h-[160px] flex flex-col items-center justify-center p-6 hover:bg-muted/50 transition-colors cursor-pointer relative bg-muted/30"
                                            onClick={() => document.getElementById('documentation')?.click()}
                                        >
                                            <input
                                                id="documentation"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <div className="flex flex-col items-center gap-3 text-center">
                                                {data.image ? (
                                                    <>
                                                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                            <FileText className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm truncate max-w-[200px]">{data.image.name}</p>
                                                            <p className="text-xs text-muted-foreground">Klik untuk mengganti</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                                                            <CameraIcon className="h-5 w-5 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">Upload Foto</p>
                                                            <p className="text-xs text-muted-foreground">Klik di sini untuk memilih file</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t">
                            <div className="text-sm text-muted-foreground hidden sm:block">
                                Pastikan semua data valid sebelum mengirim.
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <Button variant="outline" type="button" className="w-full sm:w-auto" asChild>
                                    <Link href="/presences">Batal</Link>
                                </Button>
                                <Button type="submit" className="w-full sm:w-auto bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Kirim Presensi
                                </Button>
                            </div>
                        </div>

                    </form>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
        </svg>
    )
}
