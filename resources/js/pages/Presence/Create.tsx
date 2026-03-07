import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { SearchableSelect } from '@/components/SearchableSelect';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, FileText, ArrowLeft, Save, Camera, RotateCcw, X, Image as ImageIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Project {
    id: string;
    name: string;
}

interface PageProps {
    projects: Project[];
}

export default function CreatePresence({ projects }: PageProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Presensi', href: '/presences' },
        { title: 'Buat Presensi', href: '/presences/create' },
    ];

    const [loadingLocation, setLoadingLocation] = useState(false);

    // Camera State
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('user');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync stream to video element when it opens
    useEffect(() => {
        if (isCameraOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraOpen, stream]);

    useEffect(() => {
        handleFetchLocation();
        return () => {
            // Cleanup stream on unmount
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

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
                // Silent fail for auto-fetch, user can retry if needed
                console.error(err);
                setLoadingLocation(false);
            }
        );
    };

    // Camera Functions
    const startCamera = async (facingMode: 'user' | 'environment' = 'user') => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode }
            });

            setStream(newStream);
            setIsCameraOpen(true);
            setCameraFacingMode(facingMode);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Gagal membuka kamera. Pastikan izin kamera diberikan.");
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const switchCamera = () => {
        const newMode = cameraFacingMode === 'user' ? 'environment' : 'user';
        startCamera(newMode);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                // Set canvas dimensions to match video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert to file
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `presence_${Date.now()}.jpg`, { type: 'image/jpeg' });
                        setData('image', file);
                        stopCamera();
                    }
                }, 'image/jpeg', 0.8);
            }
        }
    };

    const retakePhoto = () => {
        setData('image', null);
        startCamera(cameraFacingMode);
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

        post('/presences', {
            preserveScroll: true
        });
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
                        <h1 className="text-xl font-bold tracking-tight">Form Presensi Di Luar Kantor</h1>
                        <p className="text-muted-foreground text-sm">Isi formulir di bawah ini untuk melakukan presensi di luar kantor.</p>
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
                                        <SearchableSelect
                                            options={projects.map(p => ({ value: p.id.toString(), label: p.name }))}
                                            value={data.project_id}
                                            onValueChange={(val) => setData('project_id', val)}
                                            placeholder="Pilih Proyek..."
                                        />
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



                            </div>
                            <Separator />

                            {/* 2. Location & Documentation */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Bukti Kehadiran</h3>
                                    <p className="text-sm text-muted-foreground">Lokasi dan foto dokumentasi wajib disertakan.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-6">

                                    {/* Documentation */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="documentation">
                                            Dokumentasi (Foto) <span className="text-destructive">*</span>
                                        </Label>

                                        {/* Hidden Canvas for processing */}
                                        <canvas ref={canvasRef} className="hidden" />

                                        {!isCameraOpen && !data.image && (
                                            <div className="border-2 border-dashed rounded-lg h-[250px] flex flex-col items-center justify-center p-6 bg-muted/30 gap-4">
                                                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                                                    <Camera className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <div className="text-center space-y-1">
                                                    <p className="font-medium text-sm">Ambil Foto Presensi</p>
                                                    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Pastikan wajah dan lokasi terlihat jelas</p>
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-3 mt-2">
                                                    <Button type="button" onClick={() => startCamera('user')} variant="outline" className="gap-2">
                                                        <Camera className="h-4 w-4" />
                                                        Buka Kamera
                                                    </Button>
                                                    {/* <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2">
                                                        <ImageIcon className="h-4 w-4" />
                                                        Galeri / File
                                                    </Button> */}
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                        className="hidden"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {isCameraOpen && (
                                            <div className="relative rounded-lg overflow-hidden bg-black aspect-[3/4] md:aspect-video flex flex-col">
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    playsInline
                                                    className="flex-1 object-cover w-full h-full"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-6 items-center">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="icon"
                                                        onClick={stopCamera}
                                                        className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        className="h-16 w-16 rounded-full border-4 border-white bg-transparent hover:bg-white/20"
                                                        onClick={capturePhoto}
                                                    >
                                                        <div className="h-12 w-12 rounded-full bg-white" />
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="icon"
                                                        onClick={switchCamera}
                                                        className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
                                                    >
                                                        <RotateCcw className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {data.image && !isCameraOpen && (
                                            <div className="relative rounded-lg overflow-hidden border bg-muted aspect-[3/4] md:aspect-video group">
                                                <img
                                                    src={URL.createObjectURL(data.image)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button type="button" onClick={retakePhoto} variant="secondary">
                                                        <RotateCcw className="h-4 w-4 mr-2" />
                                                        Foto Ulang
                                                    </Button>
                                                </div>
                                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                                                    {data.image.name}
                                                </div>
                                            </div>
                                        )}

                                        {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-hidden">
                                {loadingLocation ? (
                                    <><Loader2 className="h-3 w-3 animate-spin shrink-0" /> <span className="truncate">Mengambil lokasi...</span></>
                                ) : data.lat ? (
                                    <><MapPin className="h-3 w-3 text-primary shrink-0" /> <span className="truncate hidden sm:inline">Lokasi: {Number(data.lat).toFixed(4)}, {Number(data.lng).toFixed(4)}</span><span className="truncate sm:hidden">Lokasi Terkunci</span></>
                                ) : (
                                    <span className="text-destructive flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" /> Gagal ambil lokasi</span>
                                )}
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto ml-2 shrink-0">
                                <Button variant="outline" type="button" className="w-full sm:w-auto" asChild>
                                    <Link href="/presences">Batal</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90"
                                    disabled={processing || !data.lat || !data.image}
                                    title={!data.lat ? "Menunggu lokasi..." : !data.image ? "Upload foto terlebih dahulu" : "Kirim Presensi"}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Kirim Presensi
                                </Button>
                            </div>
                        </div>

                    </form>
                </Card>
            </div>
        </AppSidebarLayout >
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
