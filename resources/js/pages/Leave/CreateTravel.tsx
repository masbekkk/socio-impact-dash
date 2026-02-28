import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, Calendar, MapPin, Briefcase, FileText, Loader2 } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import axios from 'axios';

interface SimpleProject {
  id: number;
  code: string;
  name: string;
}

interface SimpleUser {
  id: number;
  name: string;
  email: string;
}

interface AuthUser {
  name: string;
  nip: string;
  email: string;
  division_name: string;
  position: string;
  join_date: string;
}

interface Props {
  authUser: AuthUser;
  projects: SimpleProject[];
  users: SimpleUser[];
}

export default function CreateTravel({ authUser, projects, users }: Props) {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cuti & Dinas', href: '/leaves' },
    { title: 'Perjalanan Dinas', href: '/leaves/create-travel' },
  ];

  const [formData, setFormData] = useState({
    destination: '',
    project_id: '',
    reason: '',
    start_date: '',
    end_date: '',
    replacement_pic_id: '',
    phone: '',
    lokasi: '',
  });

  const [totalDays, setTotalDays] = useState(0);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (start <= end) {
        let days = 0;
        let date = new Date(start);
        while (date <= end) {
          if (date.getDay() !== 0 && date.getDay() !== 6) {
            days++;
          }
          date.setDate(date.getDate() + 1);
        }
        setTotalDays(days);
      } else {
        setTotalDays(0);
      }
    } else {
      setTotalDays(0);
    }
  }, [formData.start_date, formData.end_date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const fd = new FormData();
      fd.append('type', 'travel');
      fd.append('start_date', formData.start_date);
      fd.append('end_date', formData.end_date);
      if (formData.destination) fd.append('destination', formData.destination);
      if (formData.project_id) fd.append('project_id', formData.project_id);
      if (formData.replacement_pic_id) fd.append('replacement_pic_id', formData.replacement_pic_id);
      if (formData.phone) fd.append('phone', formData.phone);
      if (formData.lokasi) fd.append('lokasi', formData.lokasi);
      if (formData.reason) fd.append('reason', formData.reason);
      if (attachmentFile) fd.append('attachment', attachmentFile);

      await axios.post('/api/v1/leaves', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.visit('/leaves');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        setErrors(error.response.data.errors ?? {});
      } else if (axios.isAxiosError(error)) {
        setErrors({ _general: [error.response?.data?.message ?? 'Terjadi kesalahan.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Ajukan Perjalanan Dinas" />

      <div className="p-6 md:p-10 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link href="/leaves"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Form Perjalanan Dinas</h1>
            <p className="text-muted-foreground text-sm">Lengkapi data untuk mengajukan perjalanan dinas luar kota/negeri.</p>
          </div>
        </div>

        {errors._general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{errors._general[0]}</div>
        )}

        <Card className="border-none shadow-sm rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Data Pemohon */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Data Pemohon</h3>
              <p className="text-sm text-muted-foreground mb-6">Informasi data diri Anda saat ini.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Nama Lengkap</Label>
                  <Input value={authUser.name} readOnly className="bg-muted/50 border-transparent font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">NIP</Label>
                  <Input value={authUser.nip} readOnly className="bg-muted/50 border-transparent font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Tanggal Bergabung</Label>
                  <Input value={authUser.join_date} readOnly className="bg-muted/50 border-transparent font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Posisi / Jabatan</Label>
                  <Input value={authUser.position} readOnly className="bg-muted/50 border-transparent font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Divisi</Label>
                  <Input value={authUser.division_name} readOnly className="bg-muted/50 border-transparent font-medium" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Detail Perjalanan */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Detail Perjalanan</h3>
              <p className="text-sm text-muted-foreground mb-6">Rencana perjalanan, tujuan, dan estimasi biaya.</p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Kota / Negara Tujuan <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="destination" name="destination" placeholder="Contoh: Surabaya, Jawa Timur" className="pl-9 h-10" value={formData.destination} onChange={handleChange} />
                    </div>
                    {errors.destination && <p className="text-xs text-red-500">{errors.destination[0]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project_id">Nama Project (Jika ada)</Label>
                    <Select value={formData.project_id} onValueChange={(val) => handleSelectChange('project_id', val)}>
                      <SelectTrigger className="h-10">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Pilih project" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.code} - {p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Tanggal Berangkat <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} className="pl-9 h-10" />
                    </div>
                    {errors.start_date && <p className="text-xs text-red-500">{errors.start_date[0]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Tanggal Kembali <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleChange} className="pl-9 h-10" />
                    </div>
                    {errors.end_date && <p className="text-xs text-red-500">{errors.end_date[0]}</p>}
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-md flex items-center justify-between border border-blue-100 h-10">
                    <span className="text-sm font-medium">Durasi:</span>
                    <span className="font-bold">{totalDays} Hari</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="replacement_pic_id">Pengganti PIC (Opsional)</Label>
                    <Select value={formData.replacement_pic_id} onValueChange={(val) => handleSelectChange('replacement_pic_id', val)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Pilih pengganti PIC" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">No. HP (Dapat dihubungi) <span className="text-red-500">*</span></Label>
                    <Input id="phone" name="phone" placeholder="Contoh: 08123456789" value={formData.phone} onChange={handleChange} className="h-10" />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone[0]}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lokasi">Alamat Penginapan / Tujuan</Label>
                  <Input id="lokasi" name="lokasi" placeholder="Nama Hotel atau Alamat Lengkap" value={formData.lokasi} onChange={handleChange} className="h-10" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Agenda / Keperluan <span className="text-red-500">*</span></Label>
                  <Textarea id="reason" name="reason" placeholder="Jelaskan detail agenda dan tujuan perjalanan..." value={formData.reason} onChange={handleChange} className="min-h-[100px] resize-y" />
                  {errors.reason && <p className="text-xs text-red-500">{errors.reason[0]}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Dokumen Pendukung (Opsional)</Label>
                  <FileUploadDropzone className="w-full" onFilesChange={(files: File[]) => setAttachmentFile(files[0] ?? null)} />
                  <p className="text-xs text-muted-foreground">Format: PDF, JPG, PNG (Max 5MB). Lampirkan surat tugas/undangan jika ada.</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 font-medium mb-1">Catatan Penting:</p>
                  <p className="text-xs text-amber-700">
                    Jika didalam masa cuti terdapat tanggal merah/ libur dari perusahaan, harap memisahkan pengajuan cuti, contoh: range cuti 2-5 Februari, pada tanggal 3 februari terdapat tanggal merah/ libur perusahaan, maka ajukan cuti tanggal 2 dan ajukan lagi untuk tanggal 4-5
                  </p>
                </div>
              </div>
            </div>

            <CardFooter className="p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t">
              <div className="text-sm text-muted-foreground">
                {loading && <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</span>}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild size="lg">
                  <Link href="/leaves">Batal</Link>
                </Button>
                <Button type="submit" size="lg" disabled={loading || totalDays <= 0} className="bg-sidebar hover:bg-sidebar/90 min-w-[150px]">
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> Ajukan Dinas</>}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
