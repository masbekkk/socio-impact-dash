import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, FileText, DollarSign, CreditCard } from 'lucide-react';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import MoneyInput from '@/components/MoneyInput';
import { Separator } from '@/components/ui/separator';
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
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Dokumen Pendukung</h3>
              <p className="text-sm text-muted-foreground mb-6">Unggah dokumen EER dan bukti pembayaran.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Dokumen EER
                  </Label>
                  <FileUploadDropzone className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Kuitansi / Bukti Pembayaran
                  </Label>
                  <FileUploadDropzone className="w-full" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Detail Biaya</h3>
              <p className="text-sm text-muted-foreground mb-6">Rincian total biaya yang diajukan.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Keterangan Tambahan</Label>
                  <Input
                    id="description"
                    placeholder="Cth: Biaya makan siang meeting dengan klien X"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
