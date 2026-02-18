import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, FileText, CreditCard, User, AlertCircle, Building2, Briefcase, UserCheck, Loader2 } from 'lucide-react';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MoneyInput from '@/components/MoneyInput';
import { useReimbursementForm } from '@/hooks/use-reimbursement-form';
import type { Project } from '@/types/reimbursement';

const URGENCY_MAP: Record<string, string> = {
  low: 'rendah',
  normal: 'normal',
  high: 'tinggi',
  urgent: 'mendesak',
};

export default function CreateATR({ projects }: { projects: Project[] }) {
  const { authUser, loading, errors, setErrors, getAutoFill, clearFieldError, submitReimbursement } = useReimbursementForm(projects);

  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [rabFile, setRabFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    nama: authUser?.name ?? '',
    nip: '',
    project_id: '',
    divisi: '',
    pic_project: '',
    approver_name: '',
    approver_position: '',
    approver_email: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    usage_plan: '',
    amount: 0,
    urgency: 'normal',
  });

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
    { title: 'Buat ATR', href: '/reimbursements/create/atr' },
  ];

  const handleProjectChange = (value: string) => {
    const autoFill = getAutoFill(value);
    setFormData(prev => ({
      ...prev,
      project_id: value,
      divisi: autoFill.division,
      pic_project: autoFill.pic,
      approver_name: autoFill.approver_name,
      approver_position: autoFill.approver_position,
      approver_email: autoFill.approver_email,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleAmountChange = (values: any) => {
    setFormData(prev => ({ ...prev, amount: values.floatValue || 0 }));
  };

  const handleSubmit = async () => {
    if (formData.amount <= 0) {
      setErrors({ amount: ['Nominal pengajuan wajib diisi.'] });
      return;
    }

    const selected = projects.find(p => p.id === parseInt(formData.project_id));
    if (selected) {
      const remaining = (selected.operational_budget ?? 0) - (selected.used_operational_budget ?? 0);
      if (formData.amount > remaining) {
        setErrors({ amount: ['Nominal pengajuan melebihi sisa pagu operasional proyek.'] });
        return;
      }
    }

    const documents: { file: File; type: string }[] = [];
    if (proposalFile) documents.push({ file: proposalFile, type: 'proposal' });
    if (rabFile) documents.push({ file: rabFile, type: 'RAB' });

    await submitReimbursement({
      type: 'atr',
      project_id: formData.project_id,
      amount: formData.amount,
      bank_name: formData.bank_name,
      bank_account: formData.account_number,
      account_holder: formData.account_name,
      usage_plan: formData.usage_plan,
      urgency: URGENCY_MAP[formData.urgency] ?? 'normal',
      documents,
    });
  };

  const isAutoFilled = !!formData.project_id;

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Buat ATR" />

      <div className="p-6 md:p-10 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link href="/reimbursements"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Pengajuan ATR</h1>
            <p className="text-muted-foreground text-sm">Advance Travel Request untuk pengajuan dana di muka.</p>
          </div>
        </div>

        {errors._general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{errors._general[0]}</div>
        )}

        <Card className="border-none shadow-sm rounded-xl overflow-hidden">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {/* Informasi Pemohon */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Informasi Pemohon</h3>
              <p className="text-sm text-muted-foreground mb-6">Data diri pemohon dan informasi proyek terkait.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="nama" name="nama" className="pl-9 h-10 bg-muted/30" value={formData.nama} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP</Label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="nip" name="nip" placeholder="Nomor Induk Pegawai" className="pl-9 h-10" value={formData.nip} onChange={handleChange} />
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
                  {errors.project_id && <p className="text-xs text-red-500 font-medium">{errors.project_id[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Nominal ATR</Label>
                  <MoneyInput id="amount" value={formData.amount} onValueChange={handleAmountChange} className="h-10" placeholder="Masukkan nominal pengajuan" />
                  {errors.amount && <p className="text-xs text-red-500 font-medium">{errors.amount[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="divisi">Divisi</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="divisi" name="divisi" className="pl-9 h-10 bg-muted/30" value={formData.divisi} onChange={handleChange} readOnly={isAutoFilled} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pic_project">PIC Project</Label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="pic_project" name="pic_project" className="pl-9 h-10 bg-muted/30" value={formData.pic_project} onChange={handleChange} readOnly={isAutoFilled} />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Dokumen Pendukung */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Dokumen Pendukung</h3>
              <p className="text-sm text-muted-foreground mb-6">Unggah proposal dan RAB proyek.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Proposal Proyek</Label>
                  <FileUploadDropzone className="w-full" onFilesChange={(files: File[]) => setProposalFile(files[0] ?? null)} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Rencana Anggaran Biaya (RAB)</Label>
                  <FileUploadDropzone className="w-full" onFilesChange={(files: File[]) => setRabFile(files[0] ?? null)} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Rencana Penggunaan */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Rencana Penggunaan</h3>
              <p className="text-sm text-muted-foreground mb-6">Jelaskan rencana penggunaan dana dan tingkat urgensi.</p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="usage_plan">Rencana untuk Penggunaannya</Label>
                  <Textarea id="usage_plan" name="usage_plan" placeholder="Jelaskan secara detail rencana penggunaan dana ATR ini..." className="min-h-[120px] resize-none" value={formData.usage_plan} onChange={handleChange} />
                  <p className="text-xs text-muted-foreground">Minimal 50 karakter</p>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Opsi Urgensi</Label>
                  <RadioGroup value={formData.urgency} onValueChange={(v) => setFormData(prev => ({ ...prev, urgency: v }))}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="flex-1 cursor-pointer font-normal">
                        <div className="font-medium">Rendah</div>
                        <div className="text-xs text-muted-foreground">Tidak mendesak, bisa diproses dalam waktu normal</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal" className="flex-1 cursor-pointer font-normal">
                        <div className="font-medium">Normal</div>
                        <div className="text-xs text-muted-foreground">Urgensi standar, proses sesuai jadwal</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="flex-1 cursor-pointer font-normal">
                        <div className="font-medium">Tinggi</div>
                        <div className="text-xs text-muted-foreground">Mendesak, perlu persetujuan cepat</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-50 transition-colors">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label htmlFor="urgent" className="flex-1 cursor-pointer font-normal">
                        <div className="font-medium text-red-700">Sangat Mendesak</div>
                        <div className="text-xs text-red-600">Prioritas tertinggi, butuh persetujuan segera</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <Separator />

            {/* Persetujuan */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Persetujuan</h3>
              <p className="text-sm text-muted-foreground mb-6">Informasi pihak yang akan menyetujui pengajuan ATR ini.</p>

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
                    <Input id="approver_position" name="approver_position" className="pl-9 h-10 bg-muted/30" value={formData.approver_position} onChange={handleChange} readOnly={isAutoFilled} />
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

            {/* Informasi Rekening */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Informasi Rekening</h3>
              <p className="text-sm text-muted-foreground mb-6">Detail rekening tujuan pencairan dana.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">Nama Bank</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="bank_name" name="bank_name" placeholder="Contoh: BCA / Mandiri" className="pl-9 h-10" value={formData.bank_name} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_number">Nomor Rekening</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="account_number" name="account_number" placeholder="Nomor rekening tujuan" className="pl-9 h-10" value={formData.account_number} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_name">Atas Nama</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="account_name" name="account_name" placeholder="Nama pemilik rekening" className="pl-9 h-10" value={formData.account_name} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            <CardFooter className="p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t">
              <div className="text-sm text-muted-foreground">
                {loading && <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</span>}
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90">
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> Ajukan ATR</>}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppSidebarLayout>
  );
}
