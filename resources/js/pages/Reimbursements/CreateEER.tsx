import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, FileText, CreditCard, User, Briefcase, Building2, Loader2, UserCheck } from 'lucide-react';
import FileUploadDropzone from '@/components/FileUploadDropzone';

import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReimbursementForm } from '@/hooks/use-reimbursement-form';
import type { Project } from '@/types/reimbursement';

const REFUND_CATEGORIES = [
  'Transportasi', 'Akomodasi', 'Konsumsi', 'Komunikasi', 'Perlengkapan Kantor', 'Lain-lain',
];

const REIMBURSE_CATEGORIES = [
  'Biaya Medis', 'Biaya Pendidikan', 'Biaya Pelatihan', 'Biaya Perjalanan Dinas', 'Biaya Operasional', 'Lain-lain',
];

export default function CreateEER({ projects }: { projects: Project[] }) {
  const { authUser, loading, errors, getAutoFill, clearFieldError, submitReimbursement } = useReimbursementForm(projects);

  const [eerFile, setEerFile] = useState<File | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: authUser?.name ?? '',
    nip: authUser?.nip ?? '',
    project_id: '',
    division: '',
    pic: '',
    approver_name: '',
    approver_position: '',
    approver_email: '',
    reimbursement_type: 'refund',
    financing_category: '',
    amount: 0,
    payment_method: 'Transfer Bank',
    description: '',
  });

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
    { title: 'Buat EER', href: '/reimbursements/create/eer' },
  ];

  const categories = formData.reimbursement_type === 'refund' ? REFUND_CATEGORIES : REIMBURSE_CATEGORIES;

  const handleProjectChange = (value: string) => {
    const autoFill = getAutoFill(value);
    setFormData(prev => ({
      ...prev,
      project_id: value,
      division: autoFill.division,
      pic: autoFill.pic,
      approver_name: autoFill.approver_name,
      approver_position: autoFill.approver_position,
      approver_email: autoFill.approver_email,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };



  const handleSubmit = async () => {
    const documents: { file: File; type: string }[] = [];
    if (eerFile) documents.push({ file: eerFile, type: 'eer' });
    if (receiptFile) documents.push({ file: receiptFile, type: 'receipt' });

    await submitReimbursement({
      type: 'eer',
      eer_type: formData.reimbursement_type,
      project_id: formData.project_id,
      usage_plan: formData.description,
      documents,
    });
  };

  const isAutoFilled = !!formData.project_id;

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Buat EER" />

      <div className="p-6 md:p-10 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link href="/reimbursements"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Pengajuan EER</h1>
            <p className="text-muted-foreground text-sm">Employee Expense Report untuk klaim biaya operasional.</p>
          </div>
        </div>

        {errors._general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{errors._general[0]}</div>
        )}

        <Card className="border-none shadow-sm rounded-xl overflow-hidden">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {/* Employee Information */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Informasi Karyawan</h3>
              <p className="text-sm text-muted-foreground mb-6">Data pribadi dan penempatan kerja.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="name" name="name" className="pl-9 h-10 bg-muted/30" value={formData.name} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="nip" name="nip" placeholder="Nomor Induk Pegawai" className="pl-9 h-10 bg-muted/30" value={formData.nip} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_id">Nama Project</Label>
                  <Select onValueChange={handleProjectChange} value={formData.project_id}>
                    <SelectTrigger className="h-10">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Pilih proyek terkait" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.code} - {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.project_id && <p className="text-xs text-red-500">{errors.project_id[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="division">Divisi</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="division" name="division" className="pl-9 h-10 bg-muted/30" value={formData.division} onChange={handleChange} readOnly={isAutoFilled} />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="pic">PIC (Person In Charge)</Label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="pic" name="pic" className="pl-9 h-10 bg-muted/30" value={formData.pic} onChange={handleChange} readOnly={isAutoFilled} />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reimbursement Type */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Tipe Reimbursement</h3>
              <p className="text-sm text-muted-foreground mb-6">Pilih jenis klaim yang sesuai.</p>

              <RadioGroup value={formData.reimbursement_type} onValueChange={(v) => setFormData(prev => ({ ...prev, reimbursement_type: v, financing_category: '' }))}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                    <RadioGroupItem value="refund" id="refund" className="mt-1" />
                    <Label htmlFor="refund" className="flex-1 cursor-pointer font-normal">
                      <div className="font-semibold text-blue-900">Refund</div>
                      <div className="text-sm text-blue-700 mt-1">Pengembalian dana yang sudah dikeluarkan karyawan untuk keperluan kantor</div>
                      <div className="text-xs text-blue-600 mt-2 font-medium">Contoh: Biaya transportasi, konsumsi meeting, dll</div>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors">
                    <RadioGroupItem value="reimburse" id="reimburse" className="mt-1" />
                    <Label htmlFor="reimburse" className="flex-1 cursor-pointer font-normal">
                      <div className="font-semibold text-green-900">Reimburse</div>
                      <div className="text-sm text-green-700 mt-1">Penggantian biaya untuk benefit karyawan sesuai kebijakan perusahaan</div>
                      <div className="text-xs text-green-600 mt-2 font-medium">Contoh: Biaya medis, pendidikan, pelatihan, dll</div>
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
                  <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Dokumen EER</Label>
                  <FileUploadDropzone className="w-full" onFilesChange={(files: File[]) => setEerFile(files[0] ?? null)} />
                  <p className="text-xs text-muted-foreground">Format: PDF, Excel, Word (Max 5MB)</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Receipt / Kuitansi</Label>
                  <FileUploadDropzone className="w-full" onFilesChange={(files: File[]) => setReceiptFile(files[0] ?? null)} />
                  <p className="text-xs text-muted-foreground">Format: PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Financing Details */}
            {/* <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Pembiayaan di TF</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Kategori pembiayaan disesuaikan dengan tipe {formData.reimbursement_type === 'refund' ? 'Refund' : 'Reimburse'}.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="financing_category">Kategori Pembiayaan</Label>
                  <Select value={formData.financing_category} onValueChange={(val) => setFormData(prev => ({ ...prev, financing_category: val }))}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Kategori akan berubah sesuai tipe {formData.reimbursement_type === 'refund' ? 'Refund' : 'Reimburse'}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Total Biaya (IDR)</Label>
                  <MoneyInput id="amount" value={formData.amount} onValueChange={handleAmountChange} placeholder="0" className="h-10" />
                  {errors.amount && <p className="text-xs text-red-500">{errors.amount[0]}</p>}
                </div>
              </div>
            </div> */}

            <Separator />

            {/* Approval */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Persetujuan</h3>
              <p className="text-sm text-muted-foreground mb-6">Informasi pihak yang akan menyetujui pengajuan EER ini.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="approver_name">Nama Approver</Label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="approver_name" name="approver_name" className="pl-9 h-10 bg-muted/30" value={formData.approver_name} onChange={handleChange} readOnly={isAutoFilled} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approver_position">Jabatan Approver</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="approver_position" name="approver_position" className="pl-9 h-10 bg-muted/30" value={'Head'} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approver_email">Email Approver</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="approver_email" name="approver_email" type="email" className="pl-9 h-10 bg-muted/30" value={formData.approver_email} onChange={handleChange} readOnly={isAutoFilled} />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Details */}
            {/* <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Detail Pembayaran</h3>
              <p className="text-sm text-muted-foreground mb-6">Informasi tambahan terkait pembayaran.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="payment_method">Metode Pembayaran</Label>
                  <Select value={formData.payment_method} onValueChange={(val) => setFormData(prev => ({ ...prev, payment_method: val }))}>
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
                  <Input id="description" name="description" placeholder="Cth: Biaya makan siang meeting dengan klien X" value={formData.description} onChange={handleChange} className="h-10" />
                </div>
              </div>
            </div> */}

            <CardFooter className="p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t">
              <div className="text-sm text-muted-foreground">
                {loading && <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</span>}
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90">
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> Ajukan EER</>}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
