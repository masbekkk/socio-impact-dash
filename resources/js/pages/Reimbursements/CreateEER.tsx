import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, FileText, CreditCard, User, Briefcase, Building2, Loader2, UserCheck, Plus, Trash2 } from 'lucide-react';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import MoneyInput from '@/components/MoneyInput';

import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useReimbursementForm } from '@/hooks/use-reimbursement-form';
import type { Project } from '@/types/reimbursement';

const REFUND_CATEGORIES = [
  'Transportasi', 'Akomodasi', 'Konsumsi', 'Komunikasi', 'Perlengkapan Kantor', 'Lain-lain',
];

const REIMBURSE_CATEGORIES = [
  'Biaya Medis', 'Biaya Pendidikan', 'Biaya Pelatihan', 'Biaya Perjalanan Dinas', 'Biaya Operasional', 'Lain-lain',
];

interface Approver {
  id: number;
  name: string;
  email: string;
}

export default function CreateEER({ atrs = [], approvers = {} }: {
  atrs?: any[],
  approvers?: Record<string, Approver[]>
}) {
  const { authUser, loading, errors, clearFieldError, submitReimbursement } = useReimbursementForm([]);

  const [documents, setDocuments] = useState<{ id: string; type: string; file: File | null }[]>([
    { id: Date.now().toString(), type: '', file: null }
  ]);
  const [selectedAtrAmount, setSelectedAtrAmount] = useState<number>(0);

  const [formData, setFormData] = useState({
    name: authUser?.name ?? '',
    nip: authUser?.nip ?? '',
    atr_id: '',
    project_id: '',
    project_name: '',
    division: '',
    pic: '',
    approver_head_id: '',
    approver_finance_id: '',
    approver_direktur_id: '',
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

  const handleAtrChange = (value: string) => {
    const selected = atrs.find(a => a.id.toString() === value);
    if (!selected) return;

    setSelectedAtrAmount(selected.amount ?? 0);
    clearFieldError('amount');

    setFormData(prev => ({
      ...prev,
      atr_id: value,
      project_id: selected.project_id?.toString() ?? '',
      project_name: selected.project_name ?? '-',
      division: selected.division_name ?? '',
      pic: selected.pic_name ?? '',
      approver_head_id: selected.approver_head_id?.toString() ?? '',
      approver_finance_id: selected.approver_finance_id?.toString() ?? '',
      approver_direktur_id: selected.approver_direktur_id?.toString() ?? '',
      description: selected.usage_plan ?? '',
      amount: selected.amount ?? 0,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };



  const handleSubmit = async () => {
    const validDocuments = documents
      .filter(doc => doc.file != null && doc.type.trim() !== '')
      .map(doc => ({ file: doc.file!, type: doc.type }));

    await submitReimbursement({
      type: 'eer',
      eer_type: formData.reimbursement_type,
      atr_id: formData.atr_id,
      project_id: formData.project_id,
      approver_head_id: formData.approver_head_id,
      approver_finance_id: formData.approver_finance_id,
      approver_direktur_id: formData.approver_direktur_id,
      amount: formData.amount,
      usage_plan: formData.description,
      documents: validDocuments,
    } as any);
  };

  const isAutoFilled = !!formData.atr_id;

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
                  <Label htmlFor="atr_id">Pilih ATR</Label>
                  <Select onValueChange={handleAtrChange} value={formData.atr_id}>
                    <SelectTrigger className="h-10">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Pilih ATR terkait" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {atrs.map((atr: any) => (
                        <SelectItem key={atr.id} value={atr.id.toString()}>
                          {atr.code} - Rp {atr.amount?.toLocaleString('id-ID')} ({atr.project_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.atr_id && <p className="text-xs text-red-500">{errors.atr_id[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_name">Nama Project</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="project_name" name="project_name" className="pl-9 h-10 bg-muted/30" value={formData.project_name} readOnly />
                  </div>
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Dokumen Pendukung EER</h3>
                  <p className="text-sm text-muted-foreground">Unggah berbagai dokumen EER dan kuitansi.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDocuments([...documents, { id: Date.now().toString(), type: '', file: null }])}
                >
                  <Plus className="mr-2 h-4 w-4" /> Tambah Dokumen
                </Button>
              </div>

              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={doc.id} className="flex flex-col md:flex-row gap-4 items-start p-4 border rounded-lg bg-slate-50 relative group">
                    {documents.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm"
                        onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="w-full md:w-1/3 space-y-2">
                      <Label>Nama Dokumen <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="Contoh: Kuitansi Hotel"
                        value={doc.type}
                        onChange={(e) => {
                          const newDocs = [...documents];
                          newDocs[index].type = e.target.value;
                          setDocuments(newDocs);
                        }}
                      />
                    </div>
                    <div className="w-full md:flex-1 space-y-2">
                      <Label>File Dokumen <span className="text-red-500">*</span></Label>
                      <FileUploadDropzone
                        className="w-full bg-white"
                        onFilesChange={(files: File[]) => {
                          const newDocs = [...documents];
                          newDocs[index].file = files[0] ?? null;
                          setDocuments(newDocs);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Financing Details & Amount */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Nominal Pengajuan EER</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Tentukan jumlah nominal pengajuan EER aktual.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 md:col-span-2 max-w-xl">
                  <Label htmlFor="amount">Total Biaya (IDR)</Label>
                  <MoneyInput
                    id="amount"
                    value={formData.amount}
                    onValueChange={(v) => {
                      setFormData(prev => ({ ...prev, amount: v.floatValue ?? 0 }));
                      clearFieldError('amount');
                    }}
                    placeholder="0"
                    className="h-10"
                  />
                  {errors.amount && <p className="text-xs text-red-500 font-medium">{errors.amount[0]}</p>}

                  {formData.atr_id && selectedAtrAmount > 0 && (
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${formData.amount > selectedAtrAmount ? 'bg-red-500' : 'bg-primary'}`}
                            style={{ width: `${Math.min((formData.amount / selectedAtrAmount) * 100, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${formData.amount > selectedAtrAmount ? 'text-red-600' : 'text-muted-foreground'}`}>
                          {((formData.amount / selectedAtrAmount) * 100).toFixed(1)}% dari ATR
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Pemakaian maksimal berdasarkan ATR: <strong>Rp {selectedAtrAmount.toLocaleString('id-ID')}</strong>
                      </p>
                      {formData.amount > selectedAtrAmount && (
                        <p className="text-xs text-red-600 font-medium mt-1">Nominal EER melebihi limit ATR yang dipilih!</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Persetujuan */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Persetujuan</h3>
              <p className="text-sm text-muted-foreground mb-6">Informasi pihak yang akan menyetujui pengajuan EER ini (Diwariskan dari ATR).</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="approver_head_id">Head Approver</Label>
                  <Select
                    onValueChange={(val) => setFormData(p => ({ ...p, approver_head_id: val }))}
                    value={formData.approver_head_id}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih Head Divisi" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvers['head']?.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approver_finance_id">Finance Approver</Label>
                  <Select
                    onValueChange={(val) => setFormData(p => ({ ...p, approver_finance_id: val }))}
                    value={formData.approver_finance_id}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih Finance" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvers['finance']?.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approver_direktur_id">Direktur Approver</Label>
                  <Select
                    onValueChange={(val) => setFormData(p => ({ ...p, approver_direktur_id: val }))}
                    value={formData.approver_direktur_id}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Pilih Direktur" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvers['direktur']?.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Payment & Additional Details */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Keterangan Tambahan</h3>
              <p className="text-sm text-muted-foreground mb-6">Informasi detail mengenai klaim penggunaan EER.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Keterangan Pemakaian</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Detail pemakaian dana lengkap dengan rinciannya..."
                    value={formData.description}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                  {errors.usage_plan && <p className="text-xs text-red-500 font-medium">{errors.usage_plan[0]}</p>}
                </div>
              </div>
            </div>

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
