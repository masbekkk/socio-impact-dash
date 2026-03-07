import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/hooks/use-permission';
import MoneyInput from '@/components/MoneyInput';
import { Input } from '@/components/ui/input';
import DatePicker from '@/components/DatePicker';
import { cn } from '@/lib/utils';

interface AtrBudgetSelected {
  activity_name: string;
  id: number;
  project_budget_detail_id: number;
  amount: number;
  notes: string;
}

interface ReimbursementItem {
  project_budget_detail_id: any;
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

interface SelectedActivityRevision {
  budget_detail_id: number;
  expanded: boolean;
  detail_aktivitas: string;
  children: {
    id: string | number;
    item_name: string;
    quantity: number;
    unit_price: number;
    amount: number;
    expense_type: string;
    receipt: File | null;
    receipt_path?: string | null;
    notes: string;
  }[];
}

interface EerItemRevision {
  id: string | number;
  project_budget_detail_id: number | '';
  item_name: string;
  quantity: number;
  unit_price: number;
  amount: number;
  expense_type: string;
  receipt: File | null;
  receipt_path?: string | null;
  notes: string;
}
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/SearchableSelect';
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
  Plus,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import { resubmitReimbursement } from '@/services/reimbursement-service';
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
  atr_items?: { id: number; item_name: string; quantity: number; unit_price: number; amount: number; expense_type: string | null; notes: string | null; activity_name: string; activity_id: number }[];
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  refund_reimburse_amount?: number;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700 border-gray-200', icon: FileText },
  submitted: { label: 'Diajukan', className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  approved: { label: 'Disetujui', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  head_approved: { label: 'Head Approved', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  hr_approved: { label: 'HR Approved', className: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: CheckCircle },
  finance_approved: { label: 'Finance Approved', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: DollarSign },
  requested: { label: 'Diminta (Requested)', className: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: DollarSign },
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
  const {
    code,
    auth,
    expenseTypes = [],
    projects: propsProjects = [],
    users: propsUsers = []
  } = usePage().props as unknown as {
    code: string;
    auth: any;
    expenseTypes?: { value: string; label: string }[];
    projects?: { id: number; name: string; code: string; division_name: string; pic_name: string }[];
    users?: { id: number; name: string }[];
  };

  const [projects, setProjects] = useState(propsProjects);
  const [users, setUsers] = useState(propsUsers);
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
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferProof, setTransferProof] = useState<File | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetEdits, setBudgetEdits] = useState<Record<number, number>>({});
  const [pendingAllowanceAmount, setPendingAllowanceAmount] = useState<number>(0);
  const [savingBudget, setSavingBudget] = useState(false);

  const [revisionEditing, setRevisionEditing] = useState(false);
  const [revisionForm, setRevisionForm] = useState<{
    project_id: string;
    replacement_pic_id: string;
    urgency: string;
    usage_plan: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    revision_note: string;
    eer_type: string;
    refund_reimburse_amount: number;
    selected_activities: SelectedActivityRevision[];
    eer_items: EerItemRevision[];
  }>({
    project_id: '',
    replacement_pic_id: '',
    urgency: 'normal',
    usage_plan: '',
    start_date: '',
    end_date: '',
    start_time: '08:00',
    end_time: '17:00',
    revision_note: '',
    eer_type: 'refund',
    refund_reimburse_amount: 0,
    selected_activities: [],
    eer_items: [],
  });
  const [resubmitLoading, setResubmitLoading] = useState(false);

  const { hasRole, hasPermission } = usePermission();
  const isPegawai = hasRole('pegawai') && !hasRole('superadmin');
  const canEditBudget = hasPermission('edit_atr_budget') || userRole === 'finance' || userRole === 'superadmin';
  const isCreator = data?.user?.id === userId;
  const isRevisionStatus = data?.status === 'revision';
  const isFinanceOrAdmin = userRole === 'finance' || userRole === 'superadmin';
  const isHrOrAdmin = userRole === 'hr' || userRole === 'superadmin';

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
      if (response.data.projects) setProjects(response.data.projects);
      if (response.data.users) setUsers(response.data.users);
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
    return userRole;
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

  const resetTransferDialog = () => {
    setTransferDialogOpen(false);
    setTransferProof(null);
  };

  const handleRequestFund = async () => {
    if (!data) return;
    setActionLoading(true);
    try {
      const role = getCurrentUserRole();
      const payload: any = { action: 'request_fund' };
      if (role) payload.role = role;

      await axios.post(`/api/v1/reimbursements/${data.code}/status`, payload);

      await fetchDetail();
    } catch {
      alert('Gagal memproses request fund.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!data) return;
    setActionLoading(true);
    try {
      const role = getCurrentUserRole();
      const payload: any = { action: 'approved' };
      if (role) payload.role = role;
      if (role === 'hr' && data.type === 'allowance') {
        payload.amount = pendingAllowanceAmount;
      }

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
        role: role
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
        role: role
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

  const handleTransfer = async () => {
    if (!data || !transferProof) return;
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('action', 'transferred');
      formData.append('transfer_proof', transferProof);

      const role = getCurrentUserRole();

      if (role) formData.append('role', role);

      await axios.post(`/api/v1/reimbursements/${data.code}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      resetTransferDialog();
      await fetchDetail();
    } catch {
      alert('Gagal menyelesaikan transfer.');
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

    // Map existing items and activity selections
    const selected_activities: SelectedActivityRevision[] = [];
    const eer_items: EerItemRevision[] = [];

    if (data.type === 'eer') {
      // Map EER items directly to a flat list
      (data.items ?? []).forEach(item => {
        eer_items.push({
          id: item.id,
          project_budget_detail_id: item.activity_id,
          item_name: item.item_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
          expense_type: item.expense_type ?? '',
          receipt: null,
          receipt_path: item.receipt_path,
          notes: item.notes ?? '',
        });
      });
      // Ensure at least one empty item if none exist
      if (eer_items.length === 0) {
        eer_items.push({
          id: crypto.randomUUID(),
          project_budget_detail_id: '',
          item_name: '',
          quantity: 1,
          unit_price: 0,
          amount: 0,
          expense_type: '',
          receipt: null,
          notes: ''
        });
      }
    } else {
      // Original ATR grouping logic
      if (data.atr_budget_selecteds) {
        data.atr_budget_selecteds.forEach(abs => {
          const children = (data.items ?? [])
            .filter(item => item.activity_id === abs.project_budget_detail_id && !item.parent_item_id)
            .map(item => ({
              id: item.id,
              item_name: item.item_name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              amount: item.amount,
              expense_type: item.expense_type ?? '',
              receipt: null,
              receipt_path: item.receipt_path,
              notes: item.notes ?? '',
            }));

          selected_activities.push({
            budget_detail_id: abs.project_budget_detail_id,
            expanded: true,
            detail_aktivitas: abs.notes ?? '',
            children: children.length > 0 ? children : [{
              id: crypto.randomUUID(),
              item_name: '',
              quantity: 1,
              unit_price: 0,
              amount: 0,
              expense_type: '',
              receipt: null,
              notes: ''
            }],
          });
        });
      }
    }

    setRevisionForm({
      project_id: data.project?.id?.toString() ?? '',
      replacement_pic_id: '', // Unfortunately we don't have this in ReimbursementDetail right now, so we start empty.
      urgency: data.urgency ?? 'normal',
      usage_plan: data.usage_plan ?? '',
      start_date: data.start_date ?? '',
      end_date: data.end_date ?? '',
      start_time: data.start_time ?? '08:00',
      end_time: data.end_time ?? '17:00',
      revision_note: '',
      eer_type: data.eer_type ?? 'refund',
      refund_reimburse_amount: data.refund_reimburse_amount ?? 0,
      selected_activities,
      eer_items,
    });
    setRevisionEditing(true);
  };

  const addItemEerRevision = () => {
    setRevisionForm(prev => ({
      ...prev,
      eer_items: [...prev.eer_items, {
        id: crypto.randomUUID(),
        project_budget_detail_id: '',
        item_name: '',
        quantity: 1,
        unit_price: 0,
        amount: 0,
        expense_type: '',
        receipt: null,
        notes: ''
      }]
    }));
  };

  const removeItemEerRevision = (id: string | number) => {
    setRevisionForm(prev => ({
      ...prev,
      eer_items: prev.eer_items.filter(item => item.id !== id)
    }));
  };

  const updateItemEerRevision = (id: string | number, field: keyof EerItemRevision, value: any) => {
    setRevisionForm(prev => ({
      ...prev,
      eer_items: prev.eer_items.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unit_price') {
          updated.amount = (Number(updated.quantity) || 0) * (Number(updated.unit_price) || 0);
        }
        return updated;
      })
    }));
  };

  const handleResubmitRevision = async () => {
    if (!data) return;

    // Validate
    if (data.type === 'eer') {
      if (revisionForm.eer_items.length === 0) {
        alert('Minimal harus memiliki 1 item.');
        return;
      }
      for (const item of revisionForm.eer_items) {
        if (!item.project_budget_detail_id || !item.item_name.trim() || item.unit_price <= 0 || !item.expense_type) {
          alert('Semua detail item (Kegiatan, Nama, Harga, Jenis) wajib diisi.');
          return;
        }
        if (!item.receipt && !item.receipt_path) {
          alert('Setiap item pengeluaran EER wajib melampirkan kwitansi.');
          return;
        }
      }
    } else {
      for (const act of revisionForm.selected_activities) {
        if (act.children.length === 0) {
          alert('Setiap kegiatan minimal harus memiliki 1 item.');
          return;
        }
        for (const child of act.children) {
          if (!child.item_name.trim()) {
            alert('Nama item tidak boleh kosong.');
            return;
          }
        }
      }
    }

    setResubmitLoading(true);

    try {
      const items: any[] = [];
      const selected_budget_details: any[] = [];

      const payload: any = {
        action: 'revision',
        ...(revisionForm.project_id && { project_id: revisionForm.project_id }),
        ...(revisionForm.replacement_pic_id && { replacement_pic_id: revisionForm.replacement_pic_id }),
        ...(revisionForm.urgency && { urgency: revisionForm.urgency }),
      };

      if (data.type === 'eer') {
        // Flat EER processing
        const totalsByActivity: Record<number, number> = {};
        revisionForm.eer_items.forEach(item => {
          items.push({
            project_budget_detail_id: item.project_budget_detail_id,
            item_name: item.item_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
            expense_type: item.expense_type,
            receipt: item.receipt ?? undefined,
            notes: item.notes,
          });
          const actId = Number(item.project_budget_detail_id);
          totalsByActivity[actId] = (totalsByActivity[actId] || 0) + item.amount;
        });

        Object.entries(totalsByActivity).forEach(([actId, total]) => {
          selected_budget_details.push({
            project_budget_detail_id: Number(actId),
            amount: total,
            notes: '', // Legacy notes not needed here
          });
        });
      } else {
        // ATR grouping logic
        revisionForm.selected_activities.forEach(act => {
          let actTotal = 0;
          act.children.forEach(child => {
            items.push({
              project_budget_detail_id: act.budget_detail_id,
              item_name: child.item_name,
              quantity: child.quantity,
              unit_price: child.unit_price,
              amount: child.quantity * child.unit_price,
              expense_type: child.expense_type,
              receipt: child.receipt ?? undefined,
              notes: child.notes,
            });
            actTotal += child.quantity * child.unit_price;
          });

          selected_budget_details.push({
            project_budget_detail_id: act.budget_detail_id,
            amount: actTotal,
            notes: act.detail_aktivitas,
          });
        });
      }

      const resubmitData = {
        action: 'revision',
        type: data.type,
        ...(revisionForm.project_id && { project_id: revisionForm.project_id }),
        ...(revisionForm.replacement_pic_id && { replacement_pic_id: revisionForm.replacement_pic_id }),
        ...(revisionForm.urgency && { urgency: revisionForm.urgency }),
        usage_plan: revisionForm.usage_plan,
        start_date: revisionForm.start_date || null,
        end_date: revisionForm.end_date || null,
        revision_note: revisionForm.revision_note || 'Pengajuan telah direvisi dan diajukan kembali.',
        eer_type: data.type === 'eer' ? revisionForm.eer_type : undefined,
        refund_reimburse_amount: data.type === 'eer' ? revisionForm.refund_reimburse_amount : undefined,
      };

      if (data.type === 'eer') {
        Object.assign(resubmitData, { items });
      } else {
        Object.assign(resubmitData, { selected_budget_details, items });
      }

      await resubmitReimbursement(data.code, resubmitData);

      setRevisionEditing(false);
      await fetchDetail();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengirim ulang revisi.');
    } finally {
      setResubmitLoading(false);
    }
  };

  // Helper functions for revision editor
  const addChildItemRevision = (budgetDetailId: number) => {
    setRevisionForm(prev => ({
      ...prev,
      selected_activities: prev.selected_activities.map(a => {
        if (a.budget_detail_id !== budgetDetailId) return a;
        return {
          ...a,
          children: [...a.children, {
            id: crypto.randomUUID(),
            item_name: '',
            quantity: 1,
            unit_price: 0,
            amount: 0,
            expense_type: '',
            receipt: null,
            notes: ''
          }]
        };
      })
    }));
  };

  const removeChildItemRevision = (budgetDetailId: number, itemId: string | number) => {
    setRevisionForm(prev => ({
      ...prev,
      selected_activities: prev.selected_activities.map(a => {
        if (a.budget_detail_id !== budgetDetailId) return a;
        return {
          ...a,
          children: a.children.filter(c => c.id !== itemId)
        };
      })
    }));
  };

  const updateChildItemRevision = (budgetDetailId: number, itemId: string | number, field: string, value: any) => {
    setRevisionForm(prev => ({
      ...prev,
      selected_activities: prev.selected_activities.map(a => {
        if (a.budget_detail_id !== budgetDetailId) return a;
        return {
          ...a,
          children: a.children.map(c => {
            if (c.id !== itemId) return c;
            const updated = { ...c, [field]: value };
            if (field === 'quantity' || field === 'unit_price') {
              updated.amount = updated.quantity * updated.unit_price;
            }
            return updated;
          })
        };
      })
    }));
  };

  const updateActivityDetailRevision = (budgetDetailId: number, detail: string) => {
    setRevisionForm(prev => ({
      ...prev,
      selected_activities: prev.selected_activities.map(a =>
        a.budget_detail_id === budgetDetailId ? { ...a, detail_aktivitas: detail } : a
      )
    }));
  };

  const toggleActivityRevision = (budgetDetailId: number) => {
    setRevisionForm(prev => ({
      ...prev,
      selected_activities: prev.selected_activities.map(a =>
        a.budget_detail_id === budgetDetailId ? { ...a, expanded: !a.expanded } : a
      )
    }));
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
              {userRole === 'finance' && data.type === 'atr' && data.status !== 'requested' ? (
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleRequestFund}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
                  Submit to Request
                </Button>
              ) : (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    if (data.type === 'allowance') {
                      setPendingAllowanceAmount(data.amount || 0);
                    }
                    setApproveDialogOpen(true);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Setujui
                </Button>
              )}
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
                            onValueChange={(v) => {
                              const val = v.floatValue || 0;
                              setPartitionOps(val);
                              const allowance = (data.project?.budget_total || 0) - val - partitionMgmt;
                              setPartitionAllow(allowance > 0 ? allowance : 0);
                            }}
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
                            onValueChange={(v) => {
                              const val = v.floatValue || 0;
                              setPartitionMgmt(val);
                              const allowance = (data.project?.budget_total || 0) - partitionOps - val;
                              setPartitionAllow(allowance > 0 ? allowance : 0);
                            }}
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
                      <Calendar className="h-4 w-4" /> {data.type === 'atr' ? 'Tanggal Penggunaan Dana' : 'Jadwal Penggunaan Dana'}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {data.start_date && (
                        <div>
                          <span className="text-muted-foreground text-xs block">{data.type === 'atr' ? 'Tanggal Penggunaan' : 'Tanggal Mulai'}</span>
                          <span className="font-medium">
                            {format(new Date(data.start_date), 'dd MMMM yyyy', { locale: localeId })}
                            {data.start_time && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">{data.start_time}</span>}
                          </span>
                        </div>
                      )}
                      {data.end_date && data.type !== 'atr' && (
                        <div>
                          <span className="text-muted-foreground text-xs block">Tanggal Selesai</span>
                          <span className="font-medium">
                            {format(new Date(data.end_date), 'dd MMMM yyyy', { locale: localeId })}
                            {data.end_time && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">{data.end_time}</span>}
                          </span>
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
                      <div className="space-y-6">
                        {/* General Information Revision */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {(data.type === 'atr' || data.type === 'allowance') && (
                            <div className="space-y-4 md:col-span-full">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label className="text-sm font-semibold uppercase tracking-tight text-slate-500">Project</Label>
                                  <SearchableSelect
                                    options={projects.map(p => ({ value: p.id.toString(), label: `${p.code} - ${p.name}` }))}
                                    value={revisionForm.project_id || 'none'}
                                    onValueChange={(v) => setRevisionForm({ ...revisionForm, project_id: v === 'none' ? '' : v })}
                                    placeholder="Pilih Project"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-semibold uppercase tracking-tight text-slate-500">Pengganti PIC (Opsional)</Label>
                                  <SearchableSelect
                                    options={users.map(u => ({ value: u.id.toString(), label: u.name }))}
                                    value={revisionForm.replacement_pic_id || 'none'}
                                    onValueChange={(v) => setRevisionForm({ ...revisionForm, replacement_pic_id: v === 'none' ? '' : v })}
                                    placeholder="Pilih Pengganti PIC"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold uppercase tracking-tight text-slate-500">Urgensi</Label>
                                <RadioGroup
                                  className="flex space-x-4 mt-1"
                                  value={revisionForm.urgency}
                                  onValueChange={(v) => setRevisionForm({ ...revisionForm, urgency: v })}
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="normal" id="rev-urgency-normal" />
                                    <Label htmlFor="rev-urgency-normal" className="font-normal">Normal</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tinggi" id="rev-urgency-tinggi" />
                                    <Label htmlFor="rev-urgency-tinggi" className="font-normal">Tinggi</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="mendesak" id="rev-urgency-mendesak" />
                                    <Label htmlFor="rev-urgency-mendesak" className="font-normal text-red-600">Mendesak</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2 md:col-span-full">
                            <Label className="text-xs font-medium">Tanggal Penggunaan</Label>
                            <DatePicker
                              value={revisionForm.start_date}
                              onChange={(v) => setRevisionForm(p => ({ ...p, start_date: v }))}
                            />
                          </div>
                          {data.type === 'allowance' && (
                            <div className="space-y-1">
                              <Label className="text-xs font-medium">Tanggal Selesai</Label>
                              <DatePicker
                                value={revisionForm.end_date}
                                onChange={(v) => setRevisionForm(p => ({ ...p, end_date: v }))}
                              />
                            </div>
                          )}
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

                        {/* Item Editor (ATR & EER) */}
                        {(data.type === 'atr' || data.type === 'eer') && (
                          <div className="space-y-4 pt-2 border-t mt-4">
                            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              {data.type === 'eer' ? 'Klaim Item EER' : 'Item & Rincian Kegiatan ATR'}
                            </Label>
                            {data.type === 'eer' ? (
                              <div className="space-y-4">
                                {revisionForm.eer_items.map((item, idx) => (
                                  <div key={item.id} className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="h-7 w-7 rounded-full shadow-lg"
                                        onClick={() => removeItemEerRevision(item.id)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3">
                                      {/* Row 1: Activity & Name */}
                                      <div className="md:col-span-12 lg:col-span-5 space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                          PILIH KEGIATAN <span className="text-red-500">*</span>
                                        </Label>
                                        <SearchableSelect
                                          options={(data.atr_budget_selecteds || []).map(act => ({ value: act.project_budget_detail_id.toString(), label: act.activity_name || 'Kegiatan' }))}
                                          value={item.project_budget_detail_id?.toString() || 'none'}
                                          onValueChange={(v) => updateItemEerRevision(item.id, 'project_budget_detail_id', v === 'none' ? null : parseInt(v))}
                                          placeholder="Pilih kegiatan..."
                                          className="h-8 text-xs bg-slate-50 border-slate-200"
                                        />
                                      </div>

                                      <div className="md:col-span-12 lg:col-span-7 space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                          NAMA ITEM <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                          value={item.item_name}
                                          onChange={(e) => updateItemEerRevision(item.id, 'item_name', e.target.value)}
                                          placeholder="Nama item pengeluaran..."
                                          className="h-8 text-sm bg-slate-50"
                                        />
                                      </div>

                                      {/* Row 2: Qty, Price, Type */}
                                      <div className="md:col-span-3 lg:col-span-2 space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">QTY <span className="text-red-500">*</span></Label>
                                        <Input
                                          type="number"
                                          min="1"
                                          value={item.quantity}
                                          onChange={(e) => updateItemEerRevision(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                          className="h-8 text-sm bg-slate-50"
                                        />
                                      </div>

                                      <div className="md:col-span-4 lg:col-span-3 space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">HARGA SATUAN <span className="text-red-500">*</span></Label>
                                        <MoneyInput
                                          value={item.unit_price}
                                          onValueChange={(v) => updateItemEerRevision(item.id, 'unit_price', v.floatValue || 0)}
                                          placeholder="0"
                                          className="h-8 text-sm bg-slate-50"
                                        />
                                      </div>

                                      <div className="md:col-span-5 lg:col-span-4 space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">JENIS BIAYA <span className="text-red-500">*</span></Label>
                                        <SearchableSelect
                                          options={[
                                            { value: 'Operational', label: 'Operational' },
                                            { value: 'Management', label: 'Management' },
                                            { value: 'Allowance', label: 'Allowance' },
                                          ]}
                                          value={item.expense_type}
                                          onValueChange={(v) => updateItemEerRevision(item.id, 'expense_type', v)}
                                          placeholder="Jenis..."
                                          className="h-8 text-xs bg-slate-50 border-slate-200"
                                        />
                                      </div>

                                      <div className="md:col-span-12 lg:col-span-3 space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">TOTAL</Label>
                                        <div className="h-8 bg-emerald-50 border border-emerald-100 rounded-md flex items-center px-3 font-bold text-emerald-800 text-xs">
                                          Rp {item.amount.toLocaleString('id-ID')}
                                        </div>
                                      </div>

                                      {/* Row 3: Receipt & Notes */}
                                      <div className="md:col-span-12 lg:col-span-6 space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                          KWITANSI / BUKTI PEMBAYARAN <span className="text-red-500">*</span>
                                        </Label>
                                        <FileUploadDropzone
                                          className="bg-white h-[80px] overflow-hidden rounded-lg"
                                          onFilesChange={(files: File[]) => updateItemEerRevision(item.id, 'receipt', files[0] ?? null)}
                                        />
                                        {(item.receipt || item.receipt_path) && (
                                          <div className="flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-100 italic">
                                            <CheckCircle className="h-3 w-3" /> {item.receipt ? `Baru: ${item.receipt.name}` : 'Sudah terlampir'}
                                          </div>
                                        )}
                                      </div>

                                      <div className="md:col-span-12 lg:col-span-6 space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CATATAN TAMBAHAN</Label>
                                        <Textarea
                                          value={item.notes}
                                          onChange={(e) => updateItemEerRevision(item.id, 'notes', e.target.value)}
                                          placeholder="Keterangan item ini..."
                                          className="min-h-[80px] text-[11px] resize-none bg-slate-50 border-slate-200"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full border-dashed h-9 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all text-xs"
                                  onClick={addItemEerRevision}
                                >
                                  <Plus className="h-4 w-4 mr-2" /> Tambah Item Klaim Baru
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {revisionForm.selected_activities.map((activity) => {
                                  const activityName = data.items?.find(i => i.activity_id === activity.budget_detail_id)?.activity_name || 'Kegiatan';
                                  const subtotal = activity.children.reduce((s, c) => s + (c.quantity * c.unit_price), 0);

                                  return (
                                    <div key={activity.budget_detail_id} className="border rounded-lg overflow-hidden shadow-sm bg-white">
                                      <div
                                        className="flex items-center justify-between p-3 bg-slate-50 border-b cursor-pointer"
                                        onClick={() => toggleActivityRevision(activity.budget_detail_id)}
                                      >
                                        <div className="flex items-center gap-2">
                                          {activity.expanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                                          <span className="font-semibold text-sm text-slate-800">{activityName}</span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-700 font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
                                      </div>

                                      {activity.expanded && (
                                        <div className="p-3 space-y-4">
                                          <div className="space-y-1">
                                            <Label className="text-[10px] font-medium text-muted-foreground uppercase">Detail Aktivitas</Label>
                                            <Input
                                              value={activity.detail_aktivitas}
                                              onChange={(e) => updateActivityDetailRevision(activity.budget_detail_id, e.target.value)}
                                              placeholder="Detail aktivitas..."
                                              className="h-8 text-sm"
                                            />
                                          </div>

                                          <div className="space-y-3">
                                            {activity.children.map((child, idx) => (
                                              <div key={child.id} className="border rounded-md p-3 space-y-3 bg-slate-50/40 relative">
                                                {activity.children.length > 1 && (
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 text-red-500 absolute top-2 right-2"
                                                    onClick={() => removeChildItemRevision(activity.budget_detail_id, child.id)}
                                                  >
                                                    <X className="h-3.5 w-3.5" />
                                                  </Button>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3">
                                                  <div className="md:col-span-12 lg:col-span-5 space-y-1">
                                                    <Label className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Nama Item</Label>
                                                    <Input
                                                      value={child.item_name}
                                                      onChange={(e) => updateChildItemRevision(activity.budget_detail_id, child.id, 'item_name', e.target.value)}
                                                      placeholder="Nama item..."
                                                      className="h-8 text-sm"
                                                    />
                                                  </div>
                                                  <div className="md:col-span-2 lg:col-span-1 space-y-1">
                                                    <Label className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Qty</Label>
                                                    <Input
                                                      type="number"
                                                      min={1}
                                                      value={child.quantity}
                                                      onChange={(e) => updateChildItemRevision(activity.budget_detail_id, child.id, 'quantity', parseInt(e.target.value) || 1)}
                                                      className="h-8 text-sm px-2"
                                                    />
                                                  </div>
                                                  <div className="md:col-span-5 lg:col-span-3 space-y-1">
                                                    <Label className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Nominal</Label>
                                                    <MoneyInput
                                                      value={child.unit_price}
                                                      onValueChange={(v) => updateChildItemRevision(activity.budget_detail_id, child.id, 'unit_price', v.floatValue || 0)}
                                                      className="h-8 text-sm"
                                                    />
                                                  </div>
                                                  <div className="md:col-span-5 lg:col-span-3 space-y-1">
                                                    <Label className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Jenis</Label>
                                                    <SearchableSelect
                                                      options={expenseTypes.filter(et => et.value !== '').map(et => ({ value: et.value, label: et.label }))}
                                                      value={child.expense_type}
                                                      onValueChange={(v) => updateChildItemRevision(activity.budget_detail_id, child.id, 'expense_type', v)}
                                                      placeholder="Pilih..."
                                                      className="h-8 text-xs px-2"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            ))}

                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={() => addChildItemRevision(activity.budget_detail_id)}
                                              className="w-full gap-1 border-dashed h-8 text-xs text-muted-foreground hover:text-primary"
                                            >
                                              <Plus className="h-3 w-3" /> Tambah Item
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex justify-between items-center">
                              <span className="text-xs font-semibold text-emerald-900">Total {data.type === 'eer' ? 'EER' : 'Pengajuan'} Baru</span>
                              <span className="text-sm font-bold text-emerald-900 font-mono">
                                Rp {(data.type === 'eer'
                                  ? revisionForm.eer_items.reduce((s, i) => s + i.amount, 0)
                                  : revisionForm.selected_activities.reduce((s, a) => s + a.children.reduce((c_s, c) => c_s + (c.quantity * c.unit_price), 0), 0)
                                ).toLocaleString('id-ID')}
                              </span>
                            </div>

                            {data.type === 'eer' && (
                              <div className="mt-4 p-4 border rounded-xl bg-slate-50/50 space-y-4">
                                <div className="space-y-3">
                                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tipe Hasil EER</Label>
                                  <RadioGroup
                                    value={revisionForm.eer_type}
                                    onValueChange={(v: string) => setRevisionForm(p => ({ ...p, eer_type: v }))}
                                    className="grid grid-cols-2 gap-2"
                                  >
                                    <div className={cn(
                                      "flex items-center space-x-2 p-2 rounded-lg border bg-white cursor-pointer",
                                      revisionForm.eer_type === 'refund' && "border-blue-500 bg-blue-50/30"
                                    )}>
                                      <RadioGroupItem value="refund" id="rev-refund" />
                                      <Label htmlFor="rev-refund" className="text-xs cursor-pointer font-medium">Refund</Label>
                                    </div>
                                    <div className={cn(
                                      "flex items-center space-x-2 p-2 rounded-lg border bg-white cursor-pointer",
                                      revisionForm.eer_type === 'reimbursement' && "border-blue-500 bg-blue-50/30"
                                    )}>
                                      <RadioGroupItem value="reimbursement" id="rev-reimbursement" />
                                      <Label htmlFor="rev-reimbursement" className="text-xs cursor-pointer font-medium">Reimbursement</Label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                <div className="space-y-1">
                                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nominal {revisionForm.eer_type === 'refund' ? 'Refund' : 'Reimburse'}</Label>
                                  <Textarea
                                    value={revisionForm.usage_plan}
                                    onChange={(e) => setRevisionForm(p => ({ ...p, usage_plan: e.target.value }))}
                                    placeholder="Update rencana penggunaan..."
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="space-y-1 pb-2 border-t pt-4">
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

                {/* EER Claimed Items + All ATR Items */}
                {data.type === 'eer' && (() => {
                  const eerItems = data.items || [];
                  const atrItems = data.atr_items || [];

                  // Calculate totals per activity for EER claims
                  const activityClaimTotals: Record<number, number> = {};
                  eerItems.forEach(item => {
                    if (item.project_budget_detail_id) {
                      activityClaimTotals[item.project_budget_detail_id] = (activityClaimTotals[item.project_budget_detail_id] || 0) + item.amount;
                    }
                  });

                  // Group ATR items by activity for reference
                  const groupedAtr: Record<number, { name: string; items: typeof atrItems; plannedAmount: number }> = {};
                  atrItems.forEach(item => {
                    if (!groupedAtr[item.activity_id]) {
                      groupedAtr[item.activity_id] = { name: item.activity_name, items: [], plannedAmount: 0 };
                    }
                    groupedAtr[item.activity_id].items.push(item);
                    groupedAtr[item.activity_id].plannedAmount += item.amount;
                  });

                  return (
                    <div className="space-y-6">
                      {/* EER Claimed Items Table */}
                      {eerItems.length > 0 && (
                        <div className="space-y-3">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Item Klaim EER (Aktual)
                          </label>
                          <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b bg-slate-50/50">
                                    <th className="text-left p-4 font-bold text-slate-600 text-[10px] uppercase tracking-wider">Nama Item</th>
                                    <th className="text-left p-4 font-bold text-slate-600 text-[10px] uppercase tracking-wider">Kegiatan</th>
                                    <th className="text-right p-4 font-bold text-slate-600 text-[10px] uppercase tracking-wider">Nominal Klaim</th>
                                    <th className="text-left p-4 font-bold text-slate-600 text-[10px] uppercase tracking-wider">Jenis</th>
                                    <th className="text-center p-4 font-bold text-slate-600 text-[10px] uppercase tracking-wider w-24">Kwitansi</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {eerItems.map(item => (
                                    <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                                      <td className="p-4 font-semibold text-slate-900">{item.item_name}</td>
                                      <td className="p-4 text-slate-500 font-medium">{item.activity_name}</td>
                                      <td className="p-4 text-right font-mono font-bold text-blue-700">Rp {item.amount.toLocaleString('id-ID')}</td>
                                      <td className="p-4">
                                        {item.expense_type && (
                                          <Badge variant="secondary" className="text-[10px] h-5 bg-blue-50 text-blue-700 border-blue-100">{item.expense_type}</Badge>
                                        )}
                                      </td>
                                      <td className="p-4 text-center">
                                        {item.receipt_path ? (
                                          <a href={`/storage/${item.receipt_path}`} target="_blank" rel="noopener noreferrer">
                                            <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] gap-1 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
                                              <Download className="h-3 w-3" /> Lihat
                                            </Button>
                                          </a>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground italic">—</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr className="bg-slate-900 text-white">
                                    <td colSpan={2} className="p-4 text-right font-bold text-[10px] uppercase tracking-widest text-slate-400">Total Klaim EER</td>
                                    <td className="p-4 text-right font-mono font-black text-white text-base">
                                      Rp {eerItems.reduce((s, i) => s + i.amount, 0).toLocaleString('id-ID')}
                                    </td>
                                    <td colSpan={2}></td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ATR Reference Context */}
                      {atrItems.length > 0 && (
                        <div className="space-y-3">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Referensi Persetujuan ATR
                          </label>
                          <div className="grid grid-cols-1 gap-4">
                            {Object.entries(groupedAtr).map(([actId, group]) => {
                              const actualClaim = activityClaimTotals[parseInt(actId)] || 0;
                              const isClaimed = actualClaim > 0;

                              return (
                                <div key={actId} className={cn(
                                  "border rounded-xl transition-all overflow-hidden",
                                  isClaimed ? "border-emerald-200 bg-emerald-50/20 shadow-sm" : "border-slate-200 bg-white opacity-60"
                                )}>
                                  <div className={cn(
                                    "p-3 border-b flex items-center justify-between",
                                    isClaimed ? "bg-emerald-50" : "bg-slate-50"
                                  )}>
                                    <div className="flex items-center gap-2">
                                      {isClaimed ? (
                                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                                      ) : (
                                        <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                                      )}
                                      <h4 className={cn("font-bold text-sm", isClaimed ? "text-emerald-900" : "text-slate-600")}>
                                        {group.name}
                                      </h4>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Budget ATR</p>
                                      <p className="text-sm font-mono font-bold text-slate-700">Rp {group.plannedAmount.toLocaleString('id-ID')}</p>
                                    </div>
                                  </div>

                                  <div className="p-4">
                                    <div className="space-y-1.5">
                                      {group.items.map(atrItem => (
                                        <div key={atrItem.id} className="flex justify-between items-center text-xs">
                                          <span className="text-slate-500">• {atrItem.item_name}</span>
                                          <span className="font-mono text-slate-400">Rp {atrItem.amount.toLocaleString('id-ID')}</span>
                                        </div>
                                      ))}
                                    </div>

                                    {isClaimed && (
                                      <div className="mt-3 pt-3 border-t border-emerald-100 flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Total Aktual (EER)</span>
                                        <span className="text-sm font-mono font-bold text-emerald-800">Rp {actualClaim.toLocaleString('id-ID')}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

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

                {((data.status === 'submitted' || data.status === 'request_fund') && (isFinanceOrAdmin || (data.type === 'allowance' && isHrOrAdmin))) && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    <Button
                      onClick={() => setTransferDialogOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="mr-2 h-4 w-4" /> Selesaikan & Transfer
                    </Button>
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
          </div >

          {/* Sidebar Info */}
          < div className="space-y-6" >
            {/* Employee Card */}
            < Card >
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
            </Card >

            {/* Approvers Card */}
            {
              data.approvals && data.approvals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Daftar Approver</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[...data.approvals].sort((a, b) => {
                      const p: Record<string, number> = { head: 1, hr: 2, finance: 3, direktur: 4 };
                      return (p[a.role] || 99) - (p[b.role] || 99);
                    }).map((approval) => (
                      <div key={approval.id} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div className="text-xs text-muted-foreground uppercase font-medium">{approval.role}</div>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 h-4 ${approval.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                              approval.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                approval.status === 'revision' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  approval.status === 'revised' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    'bg-slate-50 text-slate-600 border-slate-200'
                              }`}
                          >
                            {approval.status === 'revised' ? 'sudah direvisi' : approval.status}
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
              )
            }

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
      < Dialog open={approveDialogOpen} onOpenChange={(open) => { if (!open) resetApproveDialog(); }
      }>
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
          {userRole === 'hr' && data.type === 'allowance' && (
            <div className="space-y-3 py-4 border-y my-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-500 uppercase">Input Nominal Allowance <span className="text-red-500">*</span></Label>
                <MoneyInput
                  value={pendingAllowanceAmount}
                  onValueChange={(v) => setPendingAllowanceAmount(v.floatValue || 0)}
                  autoFocus
                  className="text-lg font-bold text-green-700 h-12"
                />
                <p className="text-[10px] text-muted-foreground italic">
                  * Khusus role HR wajib memastikan nominal allowance sudah sesuai sebelum disetujui.
                </p>
              </div>
            </div>
          )}
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
      </Dialog >

      {/* Reject Dialog */}
      < Dialog open={rejectDialogOpen} onOpenChange={(open) => { if (!open) resetRejectDialog(); }}>
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
      </Dialog >

      {/* Revisi Dialog */}
      < Dialog open={revisiDialogOpen} onOpenChange={(open) => { if (!open) resetRevisiDialog(); }}>
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
      </Dialog >

      {/* Transfer Dialog */}
      < Dialog open={transferDialogOpen} onOpenChange={(open) => { if (!open) resetTransferDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-5 w-5" />
              Selesaikan & Transfer
            </DialogTitle>
            <DialogDescription>
              Unggah bukti transfer untuk menyelesaikan reimbursement <strong>{data?.type?.toUpperCase()}</strong> dengan kode <strong className="font-mono">{data?.code}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Bukti Transfer (Image/PDF) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setTransferProof(e.target.files[0]);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">Maksimal 5MB.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetTransferDialog} disabled={actionLoading}>Batal</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!transferProof || actionLoading}
              onClick={handleTransfer}
            >
              {actionLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" /> Upload & Selesai</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >
    </AppSidebarLayout >
  );
}
