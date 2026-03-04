import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/hooks/use-permission';
import MoneyInput from '@/components/MoneyInput';
import { Input } from '@/components/ui/input';

interface AtrBudgetSelected {
  id: number;
  project_budget_detail_id: number;
  amount: number;
  notes: string;
}

interface ReimbursementItem {
  id: number;
  parent_item_id: number | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  amount: number;
  expense_type: string | null;
  receipt_path: string | null;
  notes: string | null;
  activity_name: string;
  activity_id: number;
}
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface ReimbursementComment {
  id: number;
  user_id: number;
  user_name: string;
  comment: string;
  created_at: string;
}

interface ReimbursementApproval {
  id: number;
  approver_id: number;
  role: string;
  status: string;
  notes: string | null;
  approved_at: string | null;
  approver_name?: string;
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
    uuid: string;
    name: string;
    code: string;
    division_name: string | null;
    pic_name: string | null;
    head_name: string | null;
    head_email: string | null;
    budget_total: number | null;
    operational_budget: number | null;
    management_budget: number | null;
    used_operational_budget: number | null;
    allowance_budget: number | null;
    used_allowance_budget: number | null;
  } | null;
  documents: ReimbursementDocument[];
  comments: ReimbursementComment[];
  approvals: ReimbursementApproval[];
  can_approve: boolean;
  atr_budget_selecteds?: AtrBudgetSelected[];
  items?: ReimbursementItem[];
  start_date: string | null;
  end_date: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700 border-gray-200', icon: FileText },
  submitted: { label: 'Diajukan', className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  approved: { label: 'Disetujui', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  head_approved: { label: 'Head Approved', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  hr_approved: { label: 'HR Approved', className: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: CheckCircle },
  finance_approved: { label: 'Finance Approved', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: DollarSign },
  transferred: { label: 'Transferred', className: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  revision: { label: 'Revisi', className: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle },
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

const APPROVABLE_STATUSES = ['submitted', 'head_approved', 'hr_approved', 'finance_approved'];

export default function Show() {
  const { code, auth } = usePage().props as unknown as { code: string; auth: any };
  const userRole = auth?.user?.role_name || 'pegawai';
  const userId = auth?.user?.id || 0;

  const [data, setData] = useState<ReimbursementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [revisiDialogOpen, setRevisiDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [revisiReason, setRevisiReason] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetEdits, setBudgetEdits] = useState<Record<number, number>>({});
  const [savingBudget, setSavingBudget] = useState(false);

  const [revisionEditing, setRevisionEditing] = useState(false);
  const [revisionForm, setRevisionForm] = useState({ usage_plan: '', start_date: '', end_date: '', revision_note: '' });
  const [resubmitLoading, setResubmitLoading] = useState(false);

  const { hasRole, hasPermission } = usePermission();
  const isPegawai = hasRole('pegawai') && !hasRole('superadmin');
  const canEditBudget = hasPermission('edit_atr_budget') || userRole === 'finance' || userRole === 'superadmin';
  const isCreator = data?.user?.id === userId;
  const isRevisionStatus = data?.status === 'revision';
  const isFinanceOrAdmin = userRole === 'finance' || userRole === 'superadmin';

  // Budget Partition Editing State
  const [editingPartitions, setEditingPartitions] = useState(false);
  const [partitionOps, setPartitionOps] = useState<number>(0);
  const [partitionMgmt, setPartitionMgmt] = useState<number>(0);
  const [partitionAllow, setPartitionAllow] = useState<number>(0);
  const [savingPartitions, setSavingPartitions] = useState(false);

  const commentsEndRef = useRef<HTMLDivElement>(null);


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

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data?.comments]);

  // handleFileChange removed as it is no longer needed for approval

  const getCurrentUserRole = () => {
    if (!data || !userId) return null;
    // Prefer the role that is currently pending for this user
    const pendingApproval = data.approvals.find(a => a.approver_id === userId && a.status === 'pending');
    if (pendingApproval) return pendingApproval.role;

    // Fallback to any assigned role
    const myApproval = data.approvals.find(a => a.approver_id === userId);
    return myApproval?.role ?? null;
  };

  const resetApproveDialog = () => {
    setApproveDialogOpen(false);
  };

  const resetRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectionReason('');
  };

  const resetRevisiDialog = () => {
    setRevisiDialogOpen(false);
    setRevisiReason('');
  };

  const handleApprove = async () => {
    if (!data) return;
    setActionLoading(true);
    try {
      const role = getCurrentUserRole();
      const payload: any = { action: 'approved' };
      if (role) payload.role = role;

      await axios.post(`/api/v1/reimbursements/${data.code}/status`, payload);

      resetApproveDialog();
      await fetchDetail();
    } catch {
      alert('Gagal menyetujui pengajuan.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!data || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      const role = getCurrentUserRole();
      const payload: any = {
        action: 'rejected',
        notes: rejectionReason,
      };
      if (role) payload.role = role;

      await axios.post(`/api/v1/reimbursements/${data.code}/status`, payload);

      resetRejectDialog();
      await fetchDetail();
    } catch {
      alert('Gagal menolak pengajuan.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevisi = async () => {
    if (!data || !revisiReason.trim()) return;
    setActionLoading(true);
    try {
      const role = getCurrentUserRole();
      const payload: any = {
        action: 'revision',
        notes: revisiReason,
      };
      if (role) payload.role = role;

      await axios.post(`/api/v1/reimbursements/${data.code}/status`, payload);

      resetRevisiDialog();
      await fetchDetail();
    } catch {
      alert('Gagal meminta revisi.');
    } finally {
      setActionLoading(false);
    }
  };

  const submitComment = async () => {
    if (!data || !newComment.trim()) return;
    setCommentLoading(true);
    try {
      await axios.post(`/api/v1/reimbursements/${data.code}/comments`, {
        comment: newComment,
      });

      setNewComment('');
      await fetchDetail();
    } catch {
      alert('Gagal mengirim komentar.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditBudgetClick = () => {
    if (data?.atr_budget_selecteds) {
      const edits: Record<number, number> = {};
      data.atr_budget_selecteds.forEach(b => {
        edits[b.id] = b.amount;
      });
      setBudgetEdits(edits);
    }
    setIsEditingBudget(true);
  };

  const handleSaveBudgets = async () => {
    if (!data) return;
    setSavingBudget(true);
    try {
      const payload = {
        budgets: Object.entries(budgetEdits).map(([id, amount]) => ({
          id: parseInt(id),
          amount,
        })),
      };
      await axios.post(`/api/v1/reimbursements/${data.code}/budgets`, payload);
      setIsEditingBudget(false);
      await fetchDetail();
    } catch {
      alert('Gagal menyimpan perubahan budget.');
    } finally {
      setSavingBudget(false);
    }
  };

  const handleStartRevisionEdit = () => {
    if (!data) return;
    setRevisionForm({
      usage_plan: data.usage_plan ?? '',
      start_date: data.start_date ?? '',
      end_date: data.end_date ?? '',
      revision_note: '',
    });
    setRevisionEditing(true);
  };

  const handleResubmitRevision = async () => {
    if (!data) return;
    setResubmitLoading(true);
    try {
      await axios.post(`/api/v1/reimbursements/${data.code}/resubmit`, {
        usage_plan: revisionForm.usage_plan,
        start_date: revisionForm.start_date || null,
        end_date: revisionForm.end_date || null,
        revision_note: revisionForm.revision_note || 'Pengajuan telah direvisi dan diajukan kembali.',
      });
      setRevisionEditing(false);
      await fetchDetail();
    } catch {
      alert('Gagal mengirim ulang revisi.');
    } finally {
      setResubmitLoading(false);
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
  const canApproveReject = data.can_approve;

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
                <XCircle className="mr-2 h-4 w-4" /> Tolak
              </Button>
              <Button
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                onClick={() => setRevisiDialogOpen(true)}
              >
                <AlertCircle className="mr-2 h-4 w-4" /> Revisi
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setApproveDialogOpen(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Setujui
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

                {/* Finance/HR Budget Visibility */}
                {data.project && (userRole === 'finance' || userRole === 'hr' || userRole === 'superadmin') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-muted/40 p-4 rounded-lg border border-muted/60">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        {data.type === 'allowance' ? 'Budget Allowance' : 'Budget Operasional'}
                      </label>
                      <div className="font-semibold text-base font-mono">
                        {data.type === 'allowance'
                          ? (data.project.allowance_budget ? `Rp ${data.project.allowance_budget.toLocaleString('id-ID')}` : '-')
                          : (data.project.operational_budget ? `Rp ${data.project.operational_budget.toLocaleString('id-ID')}` : '-')}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Sisa Budget</label>
                      <div className={`font-semibold text-base font-mono ${data.type === 'allowance'
                        ? (data.project.allowance_budget && data.project.used_allowance_budget !== null && (data.project.allowance_budget - data.project.used_allowance_budget) < (data.amount || 0) ? 'text-red-600' : 'text-green-700')
                        : (data.project.operational_budget && data.project.used_operational_budget !== null && (data.project.operational_budget - data.project.used_operational_budget) < (data.amount || 0) ? 'text-red-600' : 'text-green-700')
                        }`}>
                        {data.type === 'allowance'
                          ? (data.project.allowance_budget && data.project.used_allowance_budget !== null
                            ? `Rp ${(data.project.allowance_budget - data.project.used_allowance_budget).toLocaleString('id-ID')}`
                            : '-')
                          : (data.project.operational_budget && data.project.used_operational_budget !== null
                            ? `Rp ${(data.project.operational_budget - data.project.used_operational_budget).toLocaleString('id-ID')}`
                            : '-')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Budget Partition Editor for Finance */}
                {data.project && isFinanceOrAdmin && (
                  <div className="mt-4 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 p-5 rounded-xl border border-blue-100/80">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-blue-900">Pembagian Anggaran Proyek</h4>
                        <p className="text-xs text-blue-700/70 mt-0.5">Total Pagu: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.project.budget_total || 0)}</p>
                      </div>
                      {!editingPartitions ? (
                        <Button size="sm" variant="outline" onClick={() => {
                          setPartitionOps(data.project?.operational_budget || 0);
                          setPartitionMgmt(data.project?.management_budget || 0);
                          setPartitionAllow(data.project?.allowance_budget || 0);
                          setEditingPartitions(true);
                        }} className="text-blue-700 border-blue-200 hover:bg-blue-50">
                          Edit Pembagian
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingPartitions(false)} disabled={savingPartitions}>Batal</Button>
                          <Button size="sm" onClick={async () => {
                            if (!data.project?.uuid) return;
                            setSavingPartitions(true);
                            try {
                              await axios.put(`/api/v1/projects/${data.project.uuid}`, {
                                operational_budget: partitionOps,
                                management_budget: partitionMgmt,
                                allowance_budget: partitionAllow,
                              });
                              setEditingPartitions(false);
                              fetchDetail();
                            } catch (e: any) {
                              console.error('Failed to save partitions', e);
                              alert(e?.response?.data?.message || 'Gagal menyimpan pembagian anggaran');
                            } finally {
                              setSavingPartitions(false);
                            }
                          }} disabled={savingPartitions}>
                            {savingPartitions ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-white rounded-lg border shadow-sm space-y-1">
                        <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Operasional</p>
                        {editingPartitions ? (
                          <MoneyInput
                            value={partitionOps}
                            onValueChange={(v) => setPartitionOps(v.floatValue || 0)}
                            placeholder="0"
                            className="h-9 text-sm"
                          />
                        ) : (
                          <p className="text-base font-bold text-slate-900">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.project.operational_budget || 0)}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground">{data.project.budget_total ? ((((editingPartitions ? partitionOps : data.project.operational_budget) || 0) / data.project.budget_total) * 100).toFixed(1) : 0}%</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border shadow-sm space-y-1">
                        <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Manajemen</p>
                        {editingPartitions ? (
                          <MoneyInput
                            value={partitionMgmt}
                            onValueChange={(v) => setPartitionMgmt(v.floatValue || 0)}
                            placeholder="0"
                            className="h-9 text-sm"
                          />
                        ) : (
                          <p className="text-base font-bold text-slate-900">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.project.management_budget || 0)}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground">{data.project.budget_total ? ((((editingPartitions ? partitionMgmt : data.project.management_budget) || 0) / data.project.budget_total) * 100).toFixed(1) : 0}%</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border shadow-sm space-y-1">
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Allowance</p>
                        {editingPartitions ? (
                          <MoneyInput
                            value={partitionAllow}
                            onValueChange={(v) => setPartitionAllow(v.floatValue || 0)}
                            placeholder="0"
                            className="h-9 text-sm"
                          />
                        ) : (
                          <p className="text-base font-bold text-slate-900">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.project.allowance_budget || 0)}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground">{data.project.budget_total ? ((((editingPartitions ? partitionAllow : data.project.allowance_budget) || 0) / data.project.budget_total) * 100).toFixed(1) : 0}%</p>
                      </div>
                    </div>
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

                {/* Usage Date */}
                {(data.start_date || data.end_date) && (
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-2">
                    <div className="flex items-center gap-2 text-blue-800 font-medium text-sm">
                      <Calendar className="h-4 w-4" /> Jadwal Penggunaan Dana
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {data.start_date && (
                        <div>
                          <span className="text-muted-foreground text-xs block">Tanggal Mulai</span>
                          <span className="font-medium">{format(new Date(data.start_date), 'dd MMMM yyyy', { locale: localeId })}</span>
                        </div>
                      )}
                      {data.end_date && (
                        <div>
                          <span className="text-muted-foreground text-xs block">Tanggal Selesai</span>
                          <span className="font-medium">{format(new Date(data.end_date), 'dd MMMM yyyy', { locale: localeId })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Revision Edit Panel */}
                {isRevisionStatus && isCreator && (
                  <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-orange-800 font-medium text-sm">
                        <AlertCircle className="h-4 w-4" /> Pengajuan Perlu Revisi
                      </div>
                      {!revisionEditing && (
                        <Button size="sm" variant="outline" className="gap-1 border-orange-300 text-orange-700 hover:bg-orange-100" onClick={handleStartRevisionEdit}>
                          Edit & Ajukan Ulang
                        </Button>
                      )}
                    </div>
                    {revisionEditing && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Tanggal Mulai</Label>
                            <Input
                              type="date"
                              className="h-9 text-sm"
                              value={revisionForm.start_date}
                              onChange={(e) => setRevisionForm(p => ({ ...p, start_date: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Tanggal Selesai</Label>
                            <Input
                              type="date"
                              className="h-9 text-sm"
                              value={revisionForm.end_date}
                              min={revisionForm.start_date || undefined}
                              onChange={(e) => setRevisionForm(p => ({ ...p, end_date: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Keterangan / Rencana Penggunaan</Label>
                          <Textarea
                            className="min-h-[80px] text-sm resize-none"
                            value={revisionForm.usage_plan}
                            onChange={(e) => setRevisionForm(p => ({ ...p, usage_plan: e.target.value }))}
                            placeholder="Update rencana penggunaan..."
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Catatan Revisi untuk Approver</Label>
                          <Textarea
                            className="min-h-[60px] text-sm resize-none"
                            value={revisionForm.revision_note}
                            onChange={(e) => setRevisionForm(p => ({ ...p, revision_note: e.target.value }))}
                            placeholder="Jelaskan perubahan yang Anda lakukan..."
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => setRevisionEditing(false)} disabled={resubmitLoading}>Batal</Button>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={handleResubmitRevision} disabled={resubmitLoading}>
                            {resubmitLoading ? <><Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Mengirim...</> : 'Ajukan Ulang'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ATR Items (New Flow) */}
                {data.items && data.items.length > 0 && data.type === 'atr' && (() => {
                  const atrItems = data.items.filter(i => !i.parent_item_id);
                  const grouped: Record<number, { name: string; items: ReimbursementItem[] }> = {};
                  atrItems.forEach(item => {
                    if (!grouped[item.activity_id]) grouped[item.activity_id] = { name: item.activity_name, items: [] };
                    grouped[item.activity_id].items.push(item);
                  });
                  return (
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Item Kegiatan ATR</label>
                      {Object.entries(grouped).map(([actId, group]) => (
                        <div key={actId} className="border rounded-xl overflow-hidden">
                          <div className="bg-slate-50 p-3 border-b">
                            <h4 className="font-semibold text-sm text-slate-800">{group.name}</h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b bg-muted/30">
                                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Nama Item</th>
                                  <th className="text-center p-3 font-medium text-muted-foreground text-xs w-16">Qty</th>
                                  <th className="text-right p-3 font-medium text-muted-foreground text-xs">Nominal</th>
                                  <th className="text-right p-3 font-medium text-muted-foreground text-xs">Jumlah</th>
                                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Jenis</th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.items.map(item => (
                                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                                    <td className="p-3 font-medium">{item.item_name}</td>
                                    <td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-right font-mono">Rp {item.unit_price.toLocaleString('id-ID')}</td>
                                    <td className="p-3 text-right font-mono font-semibold">Rp {item.amount.toLocaleString('id-ID')}</td>
                                    <td className="p-3">
                                      {item.expense_type && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 bg-slate-50">{item.expense_type}</Badge>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="bg-slate-50">
                                  <td colSpan={3} className="p-3 text-right font-medium text-xs text-muted-foreground uppercase">Subtotal</td>
                                  <td className="p-3 text-right font-mono font-bold text-emerald-700">
                                    Rp {group.items.reduce((s, i) => s + i.amount, 0).toLocaleString('id-ID')}
                                  </td>
                                  <td></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* EER Claimed Items */}
                {data.items && data.items.length > 0 && data.type === 'eer' && (
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Item Klaim EER</label>
                    <div className="border rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/30">
                              <th className="text-left p-3 font-medium text-muted-foreground text-xs">Nama Item</th>
                              <th className="text-left p-3 font-medium text-muted-foreground text-xs">Kegiatan</th>
                              <th className="text-right p-3 font-medium text-muted-foreground text-xs">Nominal Klaim</th>
                              <th className="text-center p-3 font-medium text-muted-foreground text-xs">Kwitansi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.items.map(item => (
                              <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                                <td className="p-3 font-medium">{item.item_name}</td>
                                <td className="p-3 text-muted-foreground">{item.activity_name}</td>
                                <td className="p-3 text-right font-mono font-semibold">Rp {item.amount.toLocaleString('id-ID')}</td>
                                <td className="p-3 text-center">
                                  {item.receipt_path ? (
                                    <a href={`/storage/${item.receipt_path}`} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="outline" className="gap-1 text-xs h-7">
                                        <Download className="h-3 w-3" /> Lihat
                                      </Button>
                                    </a>
                                  ) : (
                                    <span className="text-xs text-muted-foreground italic">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-slate-50">
                              <td colSpan={2} className="p-3 text-right font-medium text-xs text-muted-foreground uppercase">Total Klaim</td>
                              <td className="p-3 text-right font-mono font-bold text-blue-700">
                                Rp {data.items.reduce((s, i) => s + i.amount, 0).toLocaleString('id-ID')}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Legacy Selected Budgets (backward compat) */}
                {data.atr_budget_selecteds && data.atr_budget_selecteds.length > 0 && (!data.items || data.items.length === 0) && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Rincian Anggaran Dipilih</label>
                      {canEditBudget && (
                        !isEditingBudget ? (
                          <Button size="sm" variant="outline" onClick={handleEditBudgetClick}>
                            Edit Nominal
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setIsEditingBudget(false)} disabled={savingBudget}>Batal</Button>
                            <Button size="sm" onClick={handleSaveBudgets} disabled={savingBudget}>
                              {savingBudget ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                    <div className="space-y-2">
                      {data.atr_budget_selecteds.map((budget: AtrBudgetSelected) => (
                        <div key={budget.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                          <span className="text-sm font-medium text-slate-700">{budget.notes}</span>
                          {isEditingBudget ? (
                            <div className="w-1/3">
                              <MoneyInput
                                value={budgetEdits[budget.id] ?? budget.amount}
                                onValueChange={(val) => setBudgetEdits(prev => ({ ...prev, [budget.id]: val.floatValue || 0 }))}
                                className="h-8 text-sm"
                              />
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-slate-900 font-mono">Rp {budget.amount.toLocaleString('id-ID')}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

            {/* Chat/Comments Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Diskusi & Revisi</CardTitle>
                <CardDescription>Catatan dari approver dan pemohon.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-muted/10">
                  {data.comments && data.comments.length > 0 ? (
                    <div className="space-y-4">
                      {data.comments.map((comment) => {
                        const isCreator = comment.user_id === data.user?.id;
                        return (
                          <div key={comment.id} className={`flex gap-3 ${isCreator ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={isCreator ? 'bg-primary/20 text-primary uppercase' : 'bg-muted text-muted-foreground uppercase'}>
                                {comment.user_name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`flex flex-col gap-1 max-w-[80%] ${isCreator ? 'items-end' : 'items-start'}`}>
                              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                {isCreator ? 'Pemohon' : comment.user_name}
                                <span className="opacity-50 font-normal text-[10px] ml-1">
                                  {format(new Date(comment.created_at), 'dd MMM HH:mm')}
                                </span>
                              </span>
                              <div className={`rounded-lg px-3 py-2 text-sm ${isCreator
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-white border text-foreground'
                                }`}>
                                {comment.comment}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={commentsEndRef} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm italic">
                      Mulai diskusi terkait pengajuan ini.
                    </div>
                  )}
                </ScrollArea>

                <div className="flex gap-2 items-end pt-2">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="comment-input" className="sr-only">Tambah Komentar</Label>
                    <Textarea
                      id="comment-input"
                      placeholder="Tulis pesan atau tanggapan..."
                      className="min-h-[80px] resize-none"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </div>
                  <Button
                    className="h-[80px]"
                    disabled={commentLoading || !newComment.trim()}
                    onClick={submitComment}
                  >
                    {commentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kirim'}
                  </Button>
                </div>
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
              </CardContent>
            </Card>

            {/* Approvers Card */}
            {data.approvals && data.approvals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Daftar Approver</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.approvals.map((approval) => (
                    <div key={approval.id} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div className="text-xs text-muted-foreground uppercase font-medium">{approval.role}</div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 h-4 ${approval.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            approval.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                              approval.status === 'revision' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                        >
                          {approval.status}
                        </Badge>
                      </div>
                      <div className="text-sm font-medium flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {('approver_name' in approval) ? String(approval.approver_name) : '-'}
                      </div>
                      {approval.approved_at && (
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {format(new Date(approval.approved_at), 'dd MMM yyyy, HH:mm', { locale: localeId })}
                        </div>
                      )}
                      {approval.notes && (
                        <div className="text-xs text-muted-foreground mt-1 italic bg-muted/40 p-2 rounded border">"{approval.notes}"</div>
                      )}
                    </div>
                  ))}
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
              Konfirmasi Persetujuan
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menyetujui pengajuan <strong>{data.type.toUpperCase()}</strong> dengan kode <strong className="font-mono">{data.code}</strong>?
            </DialogDescription>
          </DialogHeader>
          {/* No inputs needed for simple confirmation */}
          <DialogFooter>
            <Button variant="outline" onClick={resetApproveDialog} disabled={actionLoading}>Tidak</Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={actionLoading}
              onClick={handleApprove}
            >
              {actionLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
              ) : (
                <>Ya, Setujui</>
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
              Konfirmasi Penolakan
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
                <><XCircle className="mr-2 h-4 w-4" /> Ya, Tolak</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revisi Dialog */}
      <Dialog open={revisiDialogOpen} onOpenChange={(open) => { if (!open) resetRevisiDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-5 w-5" />
              Minta Revisi Pengajuan
            </DialogTitle>
            <DialogDescription>
              Kirimkan catatan revisi kepada <strong>{data.user?.name}</strong> terkait pengajuan <strong>{data.type.toUpperCase()}</strong> ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="revisi_reason_show">
              Catatan Revisi <span className="text-orange-500">*</span>
            </Label>
            <Textarea
              id="revisi_reason_show"
              placeholder="Tuliskan bagian mana yang perlu diperbaiki..."
              className="min-h-[100px] resize-none"
              value={revisiReason}
              onChange={(e) => setRevisiReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetRevisiDialog} disabled={actionLoading}>Batal</Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700"
              disabled={!revisiReason.trim() || actionLoading}
              onClick={handleRevisi}
            >
              {actionLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
              ) : (
                <><AlertCircle className="mr-2 h-4 w-4" /> Minta Revisi</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppSidebarLayout>
  );
}
