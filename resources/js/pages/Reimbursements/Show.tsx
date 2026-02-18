import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Calendar,
  CreditCard,
  Briefcase,
  Building2,
  Download,
  AlertCircle,
  DollarSign,
  Loader2,
  Upload,
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface ReimbursementDocument {
  id: number;
  type: string;
  original_name: string;
  path: string;
  mime: string;
  size: number;
}

interface ReimbursementApproval {
  id: number;
  status: string;
  notes: string | null;
  approved_at: string | null;
  approver: { id: number; name: string } | null;
}

interface ReimbursementDetail {
  id: number;
  code: string;
  type: string;
  eer_type: string | null;
  status: string;
  amount: number | null;
  bank_name: string | null;
  bank_account: string | null;
  account_holder: string | null;
  usage_plan: string | null;
  urgency: string | null;
  transferred_at: string | null;
  transfer_proof_path: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  user: { id: number; name: string } | null;
  project: {
    id: number;
    name: string;
    code: string;
    division_name: string | null;
    pic_name: string | null;
    head_name: string | null;
    head_email: string | null;
  } | null;
  documents: ReimbursementDocument[];
  approvals: ReimbursementApproval[];
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700 border-gray-200', icon: FileText },
  submitted: { label: 'Submitted', className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  head_approved: { label: 'Head Approved', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  finance_approved: { label: 'Finance Approved', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: DollarSign },
  transferred: { label: 'Transferred', className: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const TYPE_LABELS: Record<string, string> = {
  atr: 'Advance Travel Request',
  eer: 'Employee Expense Report',
  allowance: 'Allowance',
};

const URGENCY_LABELS: Record<string, { label: string; variant: 'destructive' | 'default' | 'outline' }> = {
  mendesak: { label: 'Mendesak', variant: 'destructive' },
  tinggi: { label: 'Tinggi', variant: 'destructive' },
  normal: { label: 'Normal', variant: 'default' },
  rendah: { label: 'Rendah', variant: 'outline' },
};

const APPROVABLE_STATUSES = ['submitted', 'head_approved', 'finance_approved'];

export default function Show() {
  const { code } = usePage().props as { code: string };
  const [data, setData] = useState<ReimbursementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approveNotes, setApproveNotes] = useState('');
  const [transferProofFile, setTransferProofFile] = useState<File | null>(null);
  const [transferProofPreview, setTransferProofPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/reimbursements/${code}`);
      setData(response.data.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Data pengajuan tidak ditemukan.');
      } else {
        setError('Terjadi kesalahan saat mengambil data.');
      }
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setTransferProofFile(file);
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setTransferProofPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setTransferProofPreview(null);
    }
  };

  const resetApproveDialog = () => {
    setApproveDialogOpen(false);
    setApproveNotes('');
    setTransferProofFile(null);
    setTransferProofPreview(null);
  };

  const resetRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectionReason('');
  };

  const handleApprove = async () => {
    if (!data || !transferProofFile) return;
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('action', 'approved');
      formData.append('transfer_proof', transferProofFile);
      if (approveNotes.trim()) formData.append('notes', approveNotes);

      await axios.post(`/api/v1/reimbursements/${data.code}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      resetApproveDialog();
      await fetchDetail();
    } catch {
      alert('Gagal menyetujui pengajuan. Pastikan bukti transfer sudah diupload.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!data || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await axios.patch(`/api/v1/reimbursements/${data.code}/status`, {
        action: 'rejected',
        notes: rejectionReason,
      });

      resetRejectDialog();
      await fetchDetail();
    } catch {
      alert('Gagal menolak pengajuan.');
    } finally {
      setActionLoading(false);
    }
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
    { title: data ? `Detail ${data.type.toUpperCase()}` : 'Detail', href: '#' },
  ];

  if (loading) {
    return (
      <AppSidebarLayout breadcrumbs={breadcrumbs}>
        <Head title="Detail Reimbursement" />
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </AppSidebarLayout>
    );
  }

  if (error || !data) {
    return (
      <AppSidebarLayout breadcrumbs={breadcrumbs}>
        <Head title="Detail Reimbursement" />
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <div className="bg-muted p-4 rounded-full">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-muted-foreground">{error ?? 'Data tidak ditemukan'}</h2>
          <Button asChild variant="outline">
            <Link href="/reimbursements">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
            </Link>
          </Button>
        </div>
      </AppSidebarLayout>
    );
  }

  const statusCfg = STATUS_CONFIG[data.status] ?? { label: data.status, className: 'bg-gray-100 text-gray-600', icon: Clock };
  const StatusIcon = statusCfg.icon;
  const canApproveReject = APPROVABLE_STATUSES.includes(data.status);

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail ${data.type.toUpperCase()} - ${data.code}`} />

      <div className="p-6 md:p-8 space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="h-10 w-10">
              <Link href="/reimbursements">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  Detail {TYPE_LABELS[data.type] ?? data.type.toUpperCase()}
                </h1>
                <Badge className={`gap-1 px-3 py-1 ${statusCfg.className}`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {statusCfg.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm font-mono">
                <FileText className="h-3.5 w-3.5" />
                {data.code}
                <span className="mx-1">•</span>
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(data.created_at), 'dd MMMM yyyy, HH:mm', { locale: localeId })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {canApproveReject && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setRejectDialogOpen(true)}
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setApproveDialogOpen(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Detail Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Detail Pengajuan {data.type.toUpperCase()}</CardTitle>
                <CardDescription>Informasi lengkap mengenai pengajuan ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Project Info */}
                {data.project && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Nama Project</label>
                    <div className="font-medium text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      {data.project.code} - {data.project.name}
                    </div>
                    {data.project.division_name && (
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Building2 className="h-4 w-4" /> Divisi: {data.project.division_name}
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-Type Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.type === 'atr' && data.urgency && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Urgensi</label>
                      <div className="font-medium flex items-center gap-2">
                        <Badge variant={URGENCY_LABELS[data.urgency]?.variant ?? 'default'} className="capitalize px-3">
                          {URGENCY_LABELS[data.urgency]?.label ?? data.urgency}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {data.type === 'eer' && data.eer_type && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Tipe EER</label>
                      <div>
                        <Badge variant="outline" className="capitalize px-3 border-blue-200 bg-blue-50 text-blue-700">
                          {data.eer_type}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date & Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Tanggal Pengajuan</label>
                    <div className="font-medium text-lg">
                      {format(new Date(data.created_at), 'dd MMMM yyyy', { locale: localeId })}
                    </div>
                  </div>
                  {data.amount != null && data.amount > 0 && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Total Biaya</label>
                      <div className="font-bold text-xl text-green-700 font-mono">
                        Rp {data.amount.toLocaleString('id-ID')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Usage Plan */}
                {data.usage_plan && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Keterangan / Rencana Penggunaan</label>
                    <div className="p-4 bg-muted/40 rounded-lg text-sm leading-relaxed border border-muted/60">
                      {data.usage_plan}
                    </div>
                  </div>
                )}

                {/* Bank / Payment Info */}
                {(data.bank_name || data.bank_account) && (
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-3">
                    <div className="flex items-center gap-2 text-blue-800 font-medium text-sm">
                      <CreditCard className="h-4 w-4" /> Informasi Pembayaran
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {data.bank_name && (
                        <div>
                          <span className="text-muted-foreground text-xs block">Bank</span>
                          <span className="font-medium">{data.bank_name}</span>
                        </div>
                      )}
                      {data.bank_account && (
                        <div>
                          <span className="text-muted-foreground text-xs block">No. Rekening</span>
                          <span className="font-medium font-mono">{data.bank_account}</span>
                        </div>
                      )}
                      {data.account_holder && (
                        <div>
                          <span className="text-muted-foreground text-xs block">Atas Nama</span>
                          <span className="font-medium">{data.account_holder}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {data.status === 'rejected' && data.rejection_reason && (
                  <div className="bg-red-50/50 p-4 rounded-lg border border-red-200 space-y-2">
                    <div className="flex items-center gap-2 text-red-800 font-medium text-sm">
                      <AlertCircle className="h-4 w-4" /> Alasan Penolakan
                    </div>
                    <p className="text-sm text-red-700">{data.rejection_reason}</p>
                  </div>
                )}

                {/* Documents */}
                <div className="space-y-3">
                  <label className="text-xs font-medium text-muted-foreground uppercase">Dokumen Lampiran</label>
                  {data.documents && data.documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
                          <div className="bg-red-50 p-2 rounded text-red-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.original_name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{doc.type}</p>
                          </div>
                          <a href={`/storage/${doc.path}`} target="_blank" rel="noopener noreferrer">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">Tidak ada dokumen dilampirkan.</div>
                  )}
                </div>

                {/* Transfer Proof */}
                {data.transfer_proof_path && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Bukti Transfer</label>
                      <Badge variant="outline" className="text-xs">Finance</Badge>
                    </div>
                    <div className="bg-green-50/50 p-4 rounded-lg border border-green-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-800 font-medium text-sm">
                          <CheckCircle className="h-4 w-4" />
                          Transfer Telah Dilakukan
                        </div>
                        <a href={`/storage/${data.transfer_proof_path}`} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="gap-1.5 text-green-700 border-green-300 hover:bg-green-100">
                            <Download className="h-3.5 w-3.5" /> Lihat Bukti
                          </Button>
                        </a>
                      </div>
                      {data.transferred_at && (
                        <div className="text-xs text-muted-foreground">
                          Ditransfer pada: {format(new Date(data.transferred_at), 'dd MMMM yyyy, HH:mm', { locale: localeId })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Employee Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informasi Karyawan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                    {data.user?.name?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-base">{data.user?.name ?? '-'}</div>
                    <div className="text-sm text-muted-foreground">{data.project?.division_name ?? 'Karyawan'}</div>
                  </div>
                </div>
                {data.project?.pic_name && (
                  <div className="border-t pt-3 mt-2">
                    <div className="text-xs text-muted-foreground mb-1">PIC / Atasan</div>
                    <div className="text-sm font-medium flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {data.project.pic_name}
                    </div>
                  </div>
                )}
                {data.project?.head_name && (
                  <div className="border-t pt-3 mt-2">
                    <div className="text-xs text-muted-foreground mb-1">Head / Approver</div>
                    <div className="text-sm font-medium flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {data.project.head_name}
                    </div>
                    {data.project.head_email && (
                      <div className="text-xs text-muted-foreground mt-0.5">{data.project.head_email}</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Approval Timeline Card */}
            {data.approvals && data.approvals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Timeline Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-4 ml-1 border-l-2 border-muted space-y-6 py-1">
                    {data.approvals.map((approval) => (
                      <div key={approval.id} className="relative group">
                        <span className={`absolute -left-[21px] top-1.5 h-3 w-3 rounded-full ring-4 ring-background transition-all ${approval.status === 'approved' ? 'bg-green-500' : approval.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'}`} />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium leading-none capitalize">{approval.status}</span>
                          {approval.approved_at && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(new Date(approval.approved_at), 'dd MMM yyyy, HH:mm', { locale: localeId })}
                            </div>
                          )}
                          {approval.approver && (
                            <div className="text-xs text-muted-foreground">by {approval.approver.name}</div>
                          )}
                          {approval.notes && (
                            <div className="text-xs text-muted-foreground mt-1 italic">{approval.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ringkasan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kode</span>
                  <span className="font-mono font-medium">{data.code}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipe</span>
                  <span className="font-medium uppercase">{data.type}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={`${statusCfg.className} gap-1`}>
                    <StatusIcon className="h-3 w-3" />
                    {statusCfg.label}
                  </Badge>
                </div>
                {data.amount != null && data.amount > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-bold text-green-700 font-mono">
                        Rp {data.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={(open) => { if (!open) resetApproveDialog(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Konfirmasi Approve
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menyetujui pengajuan <strong>{data.type.toUpperCase()}</strong> dengan kode <strong className="font-mono">{data.code}</strong>?
              Silakan upload bukti transfer di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="transfer_proof">
                Bukti Transfer <span className="text-red-500">*</span>
              </Label>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-green-400 hover:bg-green-50/30"
                onClick={() => fileInputRef.current?.click()}
              >
                {transferProofPreview ? (
                  <div className="space-y-2">
                    <img src={transferProofPreview} alt="Preview" className="max-h-40 mx-auto rounded-lg shadow-sm" />
                    <p className="text-sm text-muted-foreground">{transferProofFile?.name}</p>
                  </div>
                ) : transferProofFile ? (
                  <div className="space-y-2">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">{transferProofFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(transferProofFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Klik untuk upload bukti transfer</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, atau PDF (maks 5MB)</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                id="transfer_proof"
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="approve_notes">Catatan (opsional)</Label>
              <Textarea
                id="approve_notes"
                placeholder="Tambahkan catatan jika diperlukan..."
                className="min-h-[80px] resize-none"
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetApproveDialog} disabled={actionLoading}>Batal</Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={!transferProofFile || actionLoading}
              onClick={handleApprove}
            >
              {actionLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
              ) : (
                <><CheckCircle className="mr-2 h-4 w-4" /> Ya, Approve</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={(open) => { if (!open) resetRejectDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Konfirmasi Reject
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menolak pengajuan <strong>{data.type.toUpperCase()}</strong> dengan kode <strong className="font-mono">{data.code}</strong> dari <strong>{data.user?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="rejection_reason_show">
              Alasan Penolakan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejection_reason_show"
              placeholder="Jelaskan alasan penolakan pengajuan ini..."
              className="min-h-[100px] resize-none"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Alasan penolakan akan dikirim ke pemohon</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetRejectDialog} disabled={actionLoading}>Batal</Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectionReason.trim() || actionLoading}
              onClick={handleReject}
            >
              {actionLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
              ) : (
                <><XCircle className="mr-2 h-4 w-4" /> Ya, Reject</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppSidebarLayout>
  );
}
