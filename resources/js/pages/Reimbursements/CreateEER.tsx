import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, FileText, DollarSign, CreditCard, User, Briefcase, Building2 } from 'lucide-react';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import MoneyInput from '@/components/MoneyInput';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CreateEER() {
  const [status, setStatus] = useState('draft');
  const [formData, setFormData] = useState({
    // Employee Info
    name: '',
    nip: '',
    project_name: '',
    division: '',
    pic: '',

    // Reimbursement Type
    reimbursement_type: 'refund', // refund or reimburse

    // Financing Category (based on type)
    financing_category: '',

    // Payment Details
    amount: '',
    payment_method: 'Transfer Bank',
    description: '',
  });

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
    { title: 'Buat EER', href: '/reimbursements/create/eer' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`EER Submitted with status: ${status}\nData: ${JSON.stringify(formData, null, 2)}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReimbursementTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      reimbursement_type: value,
      financing_category: '' // Reset category when type changes
    }));
  };

  // Categories based on reimbursement type
  const refundCategories = [
    'Transportasi',
    'Akomodasi',
    'Konsumsi',
    'Komunikasi',
    'Perlengkapan Kantor',
    'Lain-lain'
  ];

  const reimburseCategories = [
    'Biaya Medis',
    'Biaya Pendidikan',
    'Biaya Pelatihan',
    'Biaya Perjalanan Dinas',
    'Biaya Operasional',
    'Lain-lain'
  ];

  const categories = formData.reimbursement_type === 'refund' ? refundCategories : reimburseCategories;

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Buat EER" />

      <div className="p-6 md:p-10 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link href="/reimbursements">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Pengajuan EER</h1>
            <p className="text-muted-foreground text-sm">Employee Expense Report untuk klaim biaya operasional.</p>
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Employee Information */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Informasi Karyawan</h3>
              <p className="text-sm text-muted-foreground mb-6">Data pribadi dan penempatan kerja.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nama lengkap karyawan"
                      className="pl-9 h-10"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nip"
                      name="nip"
                      placeholder="Nomor Induk Pegawai"
                      className="pl-9 h-10"
                      value={formData.nip}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_name">Nama Project</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="project_name"
                      name="project_name"
                      placeholder="Nama proyek terkait"
                      className="pl-9 h-10"
                      value={formData.project_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="division">Divisi</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="division"
                      name="division"
                      placeholder="Divisi / Departemen"
                      className="pl-9 h-10"
                      value={formData.division}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="pic">PIC (Person In Charge)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pic"
                      name="pic"
                      placeholder="Nama atasan / PIC yang bertanggung jawab"
                      className="pl-9 h-10"
                      value={formData.pic}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reimbursement Type */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Tipe Reimbursement</h3>
              <p className="text-sm text-muted-foreground mb-6">Pilih jenis klaim yang sesuai.</p>

              <RadioGroup value={formData.reimbursement_type} onValueChange={handleReimbursementTypeChange}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                    <RadioGroupItem value="refund" id="refund" className="mt-1" />
                    <Label htmlFor="refund" className="flex-1 cursor-pointer font-normal">
                      <div className="font-semibold text-blue-900">Refund</div>
                      <div className="text-sm text-blue-700 mt-1">
                        Pengembalian dana yang sudah dikeluarkan karyawan untuk keperluan kantor
                      </div>
                      <div className="text-xs text-blue-600 mt-2 font-medium">
                        Contoh: Biaya transportasi, konsumsi meeting, dll
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors">
                    <RadioGroupItem value="reimburse" id="reimburse" className="mt-1" />
                    <Label htmlFor="reimburse" className="flex-1 cursor-pointer font-normal">
                      <div className="font-semibold text-green-900">Reimburse</div>
                      <div className="text-sm text-green-700 mt-1">
                        Penggantian biaya untuk benefit karyawan sesuai kebijakan perusahaan
                      </div>
                      <div className="text-xs text-green-600 mt-2 font-medium">
                        Contoh: Biaya medis, pendidikan, pelatihan, dll
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Upload Documents */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Upload Dokumen EER & Receipt</h3>
              <p className="text-sm text-muted-foreground mb-6">Unggah dokumen EER dan bukti pembayaran (kuitansi/struk).</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Dokumen EER
                  </Label>
                  <FileUploadDropzone className="w-full" />
                  <p className="text-xs text-muted-foreground">Format: PDF, Excel, Word (Max 5MB)</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Receipt / Kuitansi
                  </Label>
                  <FileUploadDropzone className="w-full" />
                  <p className="text-xs text-muted-foreground">Format: PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Financing Details */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Pembiayaan di TF</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Kategori pembiayaan disesuaikan dengan tipe {formData.reimbursement_type === 'refund' ? 'Refund' : 'Reimburse'}.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="financing_category">Kategori Pembiayaan</Label>
                  <Select
                    value={formData.financing_category}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, financing_category: val }))}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Kategori akan berubah sesuai tipe {formData.reimbursement_type === 'refund' ? 'Refund' : 'Reimburse'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Total Biaya (IDR)</Label>
                  <MoneyInput
                    id="amount"
                    name="amount"
                    placeholder="0"
                    value={formData.amount}
                    onValueChange={(values) => {
                      setFormData(prev => ({ ...prev, amount: values.value }));
                    }}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Details */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Detail Pembayaran</h3>
              <p className="text-sm text-muted-foreground mb-6">Informasi tambahan terkait pembayaran.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="payment_method">Metode Pembayaran</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, payment_method: val }))}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih metode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transfer Bank">Transfer Bank</SelectItem>
                      <SelectItem value="Tunai">Tunai</SelectItem>
                      <SelectItem value="Kartu Kredit Kantor">Kartu Kredit Kantor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Keterangan Tambahan</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Cth: Biaya makan siang meeting dengan klien X"
                    value={formData.description}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <CardFooter className="p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t">
              <div className="text-sm text-muted-foreground">
                Status Saat Ini: <span className="font-medium text-foreground capitalize">{status}</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" type="button" onClick={() => setStatus('draft')}>
                  Simpan Draft
                </Button>
                <Button type="submit" onClick={() => setStatus('submitted')} className="bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90">
                  <Save className="mr-2 h-4 w-4" /> Ajukan EER
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
