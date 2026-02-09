import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, Calendar, MapPin, Briefcase } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { Separator } from '@/components/ui/separator';

// Mock User Data for Auto-fill
const MOCK_USER = {
  name: 'Budi Santoso',
  nip: 'EMP-2023-056',
  division: 'Divisi Operasional',
  position: 'Field Officer',
  location: 'Jakarta Selatan',
  join_date: '2023-01-15'
};



export default function CreateTravel() {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cuti & Dinas', href: '/leaves' },
    { title: 'Perjalanan Dinas', href: '/leaves/create-travel' },
  ];

  const [formData, setFormData] = useState({
    destination: '',
    project_name: '',
    purpose: '',
    start_date: '',
    end_date: '',
    pic_replacement: '',
    phone_number: '',
    stay_address: '',
  });

  const [totalDays, setTotalDays] = useState(0);

  // Calculate total days when dates change
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (start <= end) {
        const diff = differenceInDays(end, start) + 1; // Inclusive
        setTotalDays(diff);
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
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Data Perjalanan Dinas:\n' + JSON.stringify({ ...formData, user: MOCK_USER, total_days: totalDays }, null, 2));
    // In real app: router.post('/travels', formData);
  };

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Ajukan Perjalanan Dinas" />

      <div className="p-6 md:p-10 space-y-6">

        {/* Header Section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link href="/leaves">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Form Perjalanan Dinas</h1>
            <p className="text-muted-foreground text-sm">Lengkapi data untuk mengajukan perjalanan dinas luar kota/negeri.</p>
          </div>
        </div>

        {/* Main Card Wrapper */}
        <Card className="border-none shadow-sm rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit}>

            {/* Section 1: Data Pemohon */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Data Pemohon</h3>
              <p className="text-sm text-muted-foreground mb-6">Informasi data diri Anda saat ini.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Nama Lengkap</Label>
                  <Input value={MOCK_USER.name} readOnly className="bg-muted/50 border-transparent font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">NIP</Label>
                  <Input value={MOCK_USER.nip} readOnly className="bg-muted/50 border-transparent font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Divisi</Label>
                  <Input value={MOCK_USER.division} readOnly className="bg-muted/50 border-transparent font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Posisi / Jabatan</Label>
                  <Input value={MOCK_USER.position} readOnly className="bg-muted/50 border-transparent font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Lokasi Kerja</Label>
                  <Input value={MOCK_USER.location} readOnly className="bg-muted/50 border-transparent font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Tanggal Bergabung</Label>
                  <Input value={MOCK_USER.join_date} readOnly className="bg-muted/50 border-transparent font-medium" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Section 2: Detail Perjalanan */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Detail Perjalanan</h3>
              <p className="text-sm text-muted-foreground mb-6">Rencana perjalanan, tujuan, dan estimasi biaya.</p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Kota / Negara Tujuan <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="destination"
                        name="destination"
                        placeholder="Contoh: Surabaya, Jawa Timur"
                        className="pl-9 h-10"
                        value={formData.destination}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project_name">Nama Project (Jika ada)</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="project_name"
                        name="project_name"
                        placeholder="Nama project yang sedang aktif"
                        className="pl-9 h-10"
                        value={formData.project_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Tanggal Berangkat <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="pl-9 h-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Tanggal Kembali <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="pl-9 h-10"
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-md flex items-center justify-between border border-blue-100 h-10">
                    <span className="text-sm font-medium">Durasi:</span>
                    <span className="font-bold">{totalDays} Hari</span>
                  </div>
                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pic_replacement">Pengganti PIC (Opsional)</Label>
                    <Input
                      id="pic_replacement"
                      name="pic_replacement"
                      placeholder="Nama rekan kerja pengganti"
                      value={formData.pic_replacement}
                      onChange={handleChange}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">No. HP (Dapat dihubungi) <span className="text-red-500">*</span></Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      placeholder="Contoh: 08123456789"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stay_address">Alamat Penginapan / Tujuan</Label>
                  <Input
                    id="stay_address"
                    name="stay_address"
                    placeholder="Nama Hotel atau Alamat Lengkap"
                    value={formData.stay_address}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Agenda / Keperluan <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="purpose"
                    name="purpose"
                    placeholder="Jelaskan detail agenda dan tujuan perjalanan..."
                    value={formData.purpose}
                    onChange={handleChange}
                    className="min-h-[100px] resize-y"
                  />
                </div>
              </div>
            </div>

            <CardFooter className="p-6 md:p-8 bg-gray-50 flex justify-end gap-3 border-t">
              <Button variant="outline" asChild size="lg">
                <Link href="/leaves">Batal</Link>
              </Button>
              <Button type="submit" size="lg" disabled={totalDays <= 0} className="bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90 min-w-[150px]">
                <Save className="mr-2 h-4 w-4" /> Ajukan Dinas
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
