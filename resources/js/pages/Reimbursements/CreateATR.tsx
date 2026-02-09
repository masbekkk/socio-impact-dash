import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, UploadCloud, FileText, CreditCard, User } from 'lucide-react';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import { Separator } from '@/components/ui/separator';

export default function CreateATR() {
  const [status, setStatus] = useState('draft');
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_name: '',
  });

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
    { title: 'Buat ATR', href: '/reimbursements/create/atr' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`ATR Submitted with status: ${status}\nData: ${JSON.stringify(formData, null, 2)}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Buat ATR" />

      <div className="p-6 md:p-10 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link href="/reimbursements">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Pengajuan ATR</h1>
            <p className="text-muted-foreground text-sm">Advance Travel Request untuk pengajuan dana di muka.</p>
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Dokumen Pendukung</h3>
              <p className="text-sm text-muted-foreground mb-6">Unggah proposal dan RAB proyek.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Proposal Proyek
                  </Label>
                  <FileUploadDropzone className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Rencana Anggaran Biaya (RAB)
                  </Label>
                  <FileUploadDropzone className="w-full" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Informasi Rekening</h3>
              <p className="text-sm text-muted-foreground mb-6">Detail rekening tujuan pencairan dana.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">Nama Bank</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="bank_name"
                      name="bank_name"
                      placeholder="Contoh: BCA / Mandiri"
                      className="pl-9 h-10"
                      value={formData.bank_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_number">Nomor Rekening</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="account_number"
                      name="account_number"
                      placeholder="Nomor rekening tujuan"
                      className="pl-9 h-10"
                      value={formData.account_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_name">Atas Nama</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="account_name"
                      name="account_name"
                      placeholder="Nama pemilik rekening"
                      className="pl-9 h-10"
                      value={formData.account_name}
                      onChange={handleChange}
                    />
                  </div>
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
                  <Save className="mr-2 h-4 w-4" /> Ajukan ATR
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
