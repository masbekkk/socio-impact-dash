import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
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

const LEAVE_TYPES = [
  'Cuti Tahunan',
  'Cuti Sakit',
  'Cuti Menikah',
  'Cuti Melahirkan',
  'Cuti Besar',
  'Cuti Alasan Penting'
];

export default function CreateLeave() {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cuti', href: '/leaves' },
    { title: 'Pengajuan Cuti', href: '/leaves/create' },
  ];

  const [formData, setFormData] = useState({
    project_name: '',
    leave_address: '',
    phone_number: '',
    pic_replacement: '',
    type: 'Cuti Tahunan',
    start_date: '',
    end_date: '',
    reason: '',
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Data Pengajuan Cuti:\n' + JSON.stringify({ ...formData, user: MOCK_USER, total_days: totalDays }, null, 2));
    // In real app: router.post('/leaves', formData);
  };

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Ajukan Cuti" />

      <div className="p-6 md:p-10 space-y-6">

        {/* Header Section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link href="/leaves">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Form Pengajuan Cuti</h1>
            <p className="text-muted-foreground text-sm">Lengkapi data di bawah ini untuk mengajukan cuti.</p>
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
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">NIP / NIK</Label>
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

            {/* Section 2: Detail Pengajuan */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Detail Pengajuan</h3>
              <p className="text-sm text-muted-foreground mb-6">Isi detail lengkap mengenai rencana cuti Anda.</p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Jenis Cuti <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.type}
                      onValueChange={(val) => handleSelectChange('type', val)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Pilih jenis cuti" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAVE_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project_name">Nama Project (Jika ada)</Label>
                    <Input
                      id="project_name"
                      name="project_name"
                      placeholder="Nama project yang sedang aktif"
                      value={formData.project_name}
                      onChange={handleChange}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Tanggal Mulai <span className="text-red-500">*</span></Label>
                    <Input
                      type="date"
                      id="start_date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Tanggal Selesai <span className="text-red-500">*</span></Label>
                    <Input
                      type="date"
                      id="end_date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="h-10"
                    />
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-md flex items-center justify-between border border-blue-100 h-10">
                    <span className="text-sm font-medium">Total Cuti:</span>
                    <span className="font-bold">{totalDays} Hari</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pic_replacement">Pengganti PIC Cuti</Label>
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
                  <Label htmlFor="leave_address">Alamat Selama Cuti</Label>
                  <Input
                    id="leave_address"
                    name="leave_address"
                    placeholder="Alamat lengkap tempat anda menghabiskan cuti"
                    value={formData.leave_address}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Alasan Cuti <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Jelaskan secara rinci alasan pengajuan cuti Anda..."
                    value={formData.reason}
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
                <Save className="mr-2 h-4 w-4" /> Ajukan Cuti
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
