import React, { useMemo, useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardFooter } from '@/components/ui/card';
import {
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  CheckCircle,
  User,
  Info,
  ArrowLeft,
  Building2,
  UserCheck,
  X,
  Loader2,
  Briefcase,
  Upload,
  Receipt,
} from 'lucide-react';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import MoneyInput from '@/components/MoneyInput';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/SearchableSelect';
import { Textarea } from '@/components/ui/textarea';
import { useReimbursementForm } from '@/hooks/use-reimbursement-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { usePermission } from '@/hooks/use-permission';
import { Badge } from '@/components/ui/badge';

interface Approver {
  id: number;
  name: string;
  email: string;
}

interface ExpenseTypeOption {
  value: string;
  label: string;
}

interface AtrItem {
  id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  amount: number;
  expense_type: string | null;
  activity_name: string;
  activity_id: number;
  used_eer_amount: number;
}

interface Atr {
  id: number;
  code: string;
  amount: number;
  transferred_amount: number | null;
  usage_plan: string;
  project_id: number;
  project_name: string;
  project_code: string;
  division_name: string;
  pic_name: string;
  approver_head_id: number | null;
  approver_finance_id: number | null;
  approver_direktur_id: number | null;
  items: AtrItem[];
}

interface ChildItem {
  id: string; // For frontend keys
  item_name: string;
  quantity: number;
  unit_price: number;
  amount: number;
  expense_type: string;
  receipt: File | null;
  receipt_path?: string | null;
  notes: string;
}

interface SelectedActivity {
  budget_detail_id: number;
  activity_name: string;
  expanded: boolean;
  children: ChildItem[];
}

const fmt = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

export default function CreateEER({ atrs = [], approvers = {}, users = [], expenseTypes = [], reimbursement, isEdit = false }: {
  atrs?: Atr[],
  approvers?: Record<string, Approver[]>,
  users?: { id: number; name: string; email: string; nip: string }[],
  expenseTypes?: ExpenseTypeOption[],
  reimbursement?: any,
  isEdit?: boolean,
}) {
  const { authUser, loading, uploadProgress, errors, setErrors, clearFieldError, submitReimbursement } = useReimbursementForm([]);
  const { hasRole } = usePermission();

  const [items, setItems] = useState<({ id: string } & ChildItem & { project_budget_detail_id: number | '' })[]>([]);
  const [documents, setDocuments] = useState<{ id: string; file: File | null; type: string, db_id?: number, original_name?: string }[]>([]);

  const reimbursementData = reimbursement?.data || reimbursement;

  const [formData, setFormData] = useState({
    code: '',
    user_id: '',
    name: authUser?.name ?? '',
    nip: authUser?.nip ?? '',
    atr_id: '',
    project_id: '',
    project_name: '',
    division: '',
    pic: '',
    approver_head_id: '',
    description: '',
    eer_type: 'refund' as 'refund' | 'reimbursement' | 'balance',
    refund_reimburse_amount: 0,
  });
  const [transferProof, setTransferProof] = useState<File | null>(null);

  // Populate data in edit mode
  React.useEffect(() => {
    if (isEdit && reimbursement) {
      const data = reimbursementData;
      setFormData({
        code: data.code || '',
        user_id: data.user?.id?.toString() ?? '',
        name: data.user?.name || '',
        nip: data.nip || '',
        atr_id: data.atr_id?.toString() ?? '',
        project_id: data.project?.id?.toString() ?? '',
        project_name: data.project?.name || '',
        division: data.project?.division_name || '',
        pic: data.project?.pic_name || '',
        approver_head_id: data.approvals?.find((a: any) => a.role === 'head')?.approver_id?.toString() ?? '',
        description: data.usage_plan || '',
        eer_type: data.eer_type as any || 'refund',
        refund_reimburse_amount: data.amount || 0,
      });

      if (data.items && data.items.length > 0) {
        setItems(data.items.map((item: any) => ({
          id: item.id?.toString() || crypto.randomUUID(),
          project_budget_detail_id: item.activity_id,
          item_name: item.item_name || 'Pengeluaran EER',
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0,
          amount: item.amount || 0,
          expense_type: item.expense_type || '',
          receipt: null,
          receipt_path: item.receipt_path,
          notes: item.notes || '',
        })));
      }

      if (data.documents && data.documents.length > 0) {
        setDocuments(data.documents.map((d: any) => ({
          id: crypto.randomUUID(),
          db_id: d.id,
          type: d.type || 'other',
          file: null,
          original_name: d.original_name,
        })));
      }
    }
  }, [isEdit, reimbursement]);

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Keuangan', href: '/reimbursements' },
    { title: 'Buat EER', href: '/reimbursements/create/eer' },
  ];

  const handleAtrChange = (value: string) => {
    const selected = atrs.find(a => a.id.toString() === value);
    if (!selected) return;

    clearFieldError('atr_id');
    const firstAtrItem = selected.items && selected.items[0];
    const budgetDetailId = firstAtrItem ? firstAtrItem.activity_id : '';

    setItems([{
      id: crypto.randomUUID(),
      project_budget_detail_id: budgetDetailId,
      item_name: 'Pengeluaran EER',
      quantity: 1,
      unit_price: 0,
      amount: 0,
      expense_type: firstAtrItem?.expense_type || 'other',
      receipt: null,
      notes: ''
    }]);

    setFormData(prev => ({
      ...prev,
      atr_id: value,
      project_id: selected.project_id?.toString() ?? '',
      project_name: selected.project_name ?? '-',
      division: selected.division_name ?? '',
      pic: selected.pic_name ?? '',
      approver_head_id: selected.approver_head_id?.toString() ?? '',
      description: selected.usage_plan ?? '',
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleUserChange = (userId: string) => {
    const selectedUser = users.find(u => u.id.toString() === userId);
    if (selectedUser) {
      setFormData(prev => ({
        ...prev,
        user_id: userId,
        name: selectedUser.name,
        nip: selectedUser.nip ?? '-',
      }));
    }
    clearFieldError('user_id');
  };

  const selectedAtr = useMemo(() => {
    if (!formData.atr_id) return null;
    return atrs.find(a => a.id.toString() === formData.atr_id) ?? null;
  }, [formData.atr_id, atrs]);

  const hasAtrQueryParam = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return !!params.get('atr_code');
    }
    return false;
  }, []);

  // Auto select ATR if passed in query params
  React.useEffect(() => {
    if (!isEdit && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const atrCode = params.get('atr_code');
      if (atrCode) {
        const foundAtr = atrs.find(a => a.code === atrCode);
        if (foundAtr) {
          handleAtrChange(foundAtr.id.toString());
        }
      }
    }
  }, [isEdit, atrs]);

  // Derived available activities from the selected ATR's items
  const availableActivities = useMemo(() => {
    if (!selectedAtr) return [];
    const map = new Map<number, { id: number, name: string }>();
    selectedAtr.items.forEach(item => {
      if (!map.has(item.activity_id)) {
        map.set(item.activity_id, { id: item.activity_id, name: item.activity_name });
      }
    });
    return Array.from(map.values());
  }, [selectedAtr]);

  // Item management
  const updateItem = (id: string, field: string, value: any) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const updated = { ...i, [field]: value };
      if (field === 'quantity' || field === 'unit_price') {
        updated.amount = (updated.quantity || 1) * (updated.unit_price || 0);
      }
      return updated;
    }));
  };

  const handleExcelChange = (file: File | null) => {
    setDocuments(prev => {
      const filtered = prev.filter(d => d.type !== 'excel');
      if (file) {
        return [...filtered, { id: crypto.randomUUID(), type: 'excel', file, original_name: file.name }];
      }
      return filtered;
    });
  };

  const handleNominalChange = (value: number) => {
    setItems(prev => {
      let budgetDetailId: number | '' = '';
      if (selectedAtr && selectedAtr.items && selectedAtr.items[0]) {
        budgetDetailId = selectedAtr.items[0].activity_id;
      }
      const firstItem = prev[0] || {
        id: crypto.randomUUID(),
        project_budget_detail_id: budgetDetailId,
        item_name: 'Pengeluaran EER',
        quantity: 1,
        unit_price: 0,
        amount: 0,
        expense_type: (selectedAtr && selectedAtr.items && selectedAtr.items[0]?.expense_type) || 'other',
        receipt: null,
        notes: ''
      };
      return [{
        ...firstItem,
        unit_price: value,
        amount: value
      }];
    });
  };

  const totalEerAmount = useMemo(() => {
    return items.reduce((sum, i) => sum + (i.amount || 0), 0);
  }, [items]);

  const eerCalculation = useMemo(() => {
    if (!selectedAtr) return { type: 'refund' as const, amount: 0 };
    const diff = totalEerAmount - selectedAtr.amount;
    let type: 'reimbursement' | 'refund' | 'balance' = 'balance';
    if (diff > 0) type = 'reimbursement';
    else if (diff < 0) type = 'refund';

    return {
      type,
      amount: Math.abs(diff),
    };
  }, [totalEerAmount, selectedAtr]);

  const hasOverBudgetItems = false;

  const handleSubmit = async (status: 'submitted' | 'draft' = 'submitted') => {
    if (status === 'submitted') {
      const firstItem = items[0];
      if (!firstItem || firstItem.amount <= 0) {
        setErrors({ _general: ['Nominal pengeluaran wajib diisi dan harus lebih besar dari 0.'] });
        return;
      }

      const hasReceipt = firstItem.receipt || firstItem.receipt_path;
      if (!hasReceipt) {
        setErrors({ _general: ['Kwitansi / Bukti Pembayaran wajib diunggah.'] });
        return;
      }

      const excelDoc = documents.find(d => d.type === 'excel');
      const hasExcel = excelDoc && (excelDoc.file || excelDoc.original_name);
      if (!hasExcel) {
        setErrors({ _general: ['File Excel (Detail Breakdown) wajib diunggah.'] });
        return;
      }

      if (eerCalculation.type === 'refund' && hasRole(['finance', 'superadmin']) && !transferProof) {
        setErrors({ _general: ['Bukti transfer refund wajib diunggah.'] });
        return;
      }

      if (!formData.approver_head_id) {
        setErrors({ _general: ['Head Approver wajib dipilih.'] });
        return;
      }
    }

    const payloadItems = items.map(i => ({
      project_budget_detail_id: Number(i.project_budget_detail_id),
      item_name: i.item_name,
      quantity: i.quantity,
      unit_price: i.unit_price,
      amount: i.amount,
      expense_type: i.expense_type,
      receipt: i.receipt ?? undefined,
      receipt_path: i.receipt_path ?? undefined,
      notes: i.notes || undefined,
    }));

    await submitReimbursement({
      code: formData.code,
      type: 'eer',
      status,
      eer_type: eerCalculation.type,
      refund_reimburse_amount: eerCalculation.amount,
      atr_id: formData.atr_id,
      project_id: formData.project_id,
      approver_head_id: formData.approver_head_id,
      amount: totalEerAmount,
      usage_plan: formData.description,
      items: payloadItems,
      transfer_proof: transferProof,
      user_id: formData.user_id || undefined,
      is_edit: isEdit,
      reimbursement_id: isEdit ? (reimbursementData?.id || reimbursement.id) : undefined,
      documents: documents.filter(d => d.file || d.db_id).map(d => ({
        id: d.db_id,
        file: d.file ?? undefined,
        type: d.type
      })),
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
            <h1 className="text-xl font-bold tracking-tight">{isEdit ? 'Edit Draft EER' : 'Pengajuan EER (Baru)'}</h1>
            <p className="text-muted-foreground text-sm">Employee Expense Report — klaim biaya aktual berdasarkan limit ATR.</p>
          </div>
        </div>

        {errors._general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{errors._general[0]}</div>
        )}

        <Card className="border-none shadow-sm rounded-xl overflow-hidden">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {/* Employee Information */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Informasi Karyawan & ATR</h3>
              <p className="text-sm text-muted-foreground mb-6">Pilih ATR yang akan diselesaikan menggunakan EER.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-3 space-y-2">
                  <Label htmlFor="code">Nomor EER</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="Masukkan Nomor EER (opsional)"
                    className={cn("h-10", errors.code ? "border-red-500" : "")}
                    value={formData.code}
                    onChange={handleChange}
                  />
                  {errors.code && <p className="text-xs text-red-500 font-medium">{errors.code[0]}</p>}
                </div>
                {hasRole(['finance', 'superadmin']) && (
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="user_id">Pilih Pegawai (Pemohon)</Label>
                    <SearchableSelect
                      options={users.map(u => ({ value: u.id.toString(), label: `${u.nip ?? '-'} - ${u.name}` }))}
                      value={formData.user_id}
                      onValueChange={handleUserChange}
                      placeholder="Cari pegawai..."
                    />
                    <p className="text-xs text-muted-foreground">Opsi ini hanya muncul untuk peran Finance.</p>
                  </div>
                )}
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
                    <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="nip" name="nip" className="pl-9 h-10 bg-muted/30" value={formData.nip} readOnly />
                  </div>
                </div>
                {hasAtrQueryParam ? (
                  <div className="space-y-2">
                    <Label>ATR Terpilih</Label>
                    <div className="relative">
                      <Receipt className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9 h-10 bg-muted/30 font-semibold text-indigo-700 border-indigo-200"
                        value={selectedAtr ? `${selectedAtr.code} — Rp ${selectedAtr.amount.toLocaleString('id-ID')} (${selectedAtr.project_name})` : 'Loading...'}
                        readOnly
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="atr_id">Pilih ATR</Label>
                    <SearchableSelect
                      options={atrs.map(atr => ({
                        value: atr.id.toString(),
                        label: `${atr.code} — ${fmt(atr.amount)} (${atr.project_name})`
                      }))}
                      value={formData.atr_id}
                      onValueChange={handleAtrChange}
                      placeholder="Pilih ATR terkait"
                    />
                    {errors.atr_id && <p className="text-xs text-red-500">{errors.atr_id[0]}</p>}
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Nama Project</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9 h-10 bg-muted/30" value={formData.project_name} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Divisi</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9 h-10 bg-muted/30" value={formData.division} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>PIC</Label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9 h-10 bg-muted/30" value={formData.pic} readOnly />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Item Input Mode */}
            <div className="p-6 md:p-8 bg-white">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Form Pengeluaran EER</h3>
                  <p className="text-sm text-muted-foreground">Isi detail pengeluaran EER dengan mengunggah spreadsheet Excel rincian dan bukti kwitansi.</p>
                </div>
                {selectedAtr && (
                  <div className="bg-slate-50 border p-3 rounded-lg text-right flex flex-col gap-1">
                    <p className="text-xs text-slate-500 font-medium">Limit ATR Tersedia</p>
                    <div className="flex items-center justify-end gap-2">
                      <p className="text-lg font-bold text-slate-800">{fmt(selectedAtr.amount)}</p>
                      {selectedAtr.transferred_amount != null && selectedAtr.transferred_amount > 0 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-bold">
                          Transferred: {fmt(selectedAtr.transferred_amount)}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedAtr ? (
                <div className="space-y-6">
                  {(() => {
                    const firstItem = items[0] || {
                      id: crypto.randomUUID(),
                      project_budget_detail_id: '',
                      item_name: 'Pengeluaran EER',
                      quantity: 1,
                      unit_price: 0,
                      amount: 0,
                      expense_type: '',
                      receipt: null,
                      notes: ''
                    };

                    const excelDoc = documents.find(d => d.type === 'excel');

                    return (
                      <div className="border rounded-xl bg-slate-50/30 p-4 md:p-6 transition-all hover:border-blue-200 hover:shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column: Nominal and Notes */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                Nominal Pengeluaran <span className="text-red-500">*</span>
                              </Label>
                              <MoneyInput
                                value={firstItem.unit_price}
                                onValueChange={(v) => handleNominalChange(v.floatValue ?? 0)}
                                placeholder="Masukkan nominal total pengeluaran..."
                                className="h-11 text-base bg-white font-bold"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Catatan Tambahan
                              </Label>
                              <Textarea
                                value={firstItem.notes || ''}
                                onChange={(e) => updateItem(firstItem.id, 'notes', e.target.value)}
                                placeholder="Keterangan tambahan mengenai pengeluaran..."
                                className="min-h-[148px] text-sm resize-none bg-white font-normal text-slate-800"
                              />
                            </div>
                          </div>

                          {/* Right Column: Excel and Receipt Files */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                Upload File Excel Only <span className="text-red-500">*</span>
                              </Label>
                              <FileUploadDropzone
                                className="bg-white h-[96px] overflow-hidden rounded-lg"
                                multiple={false}
                                accept=".xlsx,.xls"
                                labelText="Klik untuk upload Excel (.xlsx, .xls)"
                                helperText="Hanya menerima file format spreadsheet Excel"
                                onFilesChange={(files: File[]) => handleExcelChange(files[0] ?? null)}
                              />
                              {excelDoc?.file && (
                                <div className="flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-100">
                                  <CheckCircle className="h-3 w-3" /> Terlampir: {excelDoc.file.name}
                                </div>
                              )}
                              {!excelDoc?.file && excelDoc?.original_name && (
                                <div className="flex items-center gap-2 text-[10px] text-blue-600 bg-blue-50 p-1.5 rounded mt-1 border border-blue-100">
                                  <CheckCircle className="h-3 w-3" /> Excel Tersimpan: <span className="font-bold">{excelDoc.original_name}</span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                Receipt / Kwitansi (PDF/JPEG) <span className="text-red-500">*</span>
                              </Label>
                              <FileUploadDropzone
                                className="bg-white h-[96px] overflow-hidden rounded-lg"
                                multiple={false}
                                accept="image/*,.pdf"
                                labelText="Klik untuk upload Receipt (PDF, JPEG, PNG)"
                                helperText="Hanya menerima format gambar atau dokumen PDF"
                                onFilesChange={(files: File[]) => updateItem(firstItem.id, 'receipt', files[0] ?? null)}
                              />
                              {firstItem.receipt && (
                                <div className="flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-100">
                                  <CheckCircle className="h-3 w-3" /> Terlampir: {firstItem.receipt.name}
                                </div>
                              )}
                              {!firstItem.receipt && firstItem.receipt_path && (
                                <div className="flex items-center gap-2 text-[10px] text-blue-600 bg-blue-50 p-1.5 rounded mt-1 border border-blue-100">
                                  <CheckCircle className="h-3 w-3" /> Kwitansi Tersimpan: <a href={firstItem.receipt_path} target="_blank" rel="noopener noreferrer" className="underline font-bold">Lihat File</a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Total Checking */}
                  <div className="space-y-4">
                    <div className="border rounded-lg p-5 flex items-center justify-between mt-4 bg-slate-900 shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Klaim EER Keseluruhan</p>
                        <p className="text-2xl font-black text-white font-mono">{fmt(totalEerAmount)}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center relative z-10">
                        <Save className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    </div>

                    <div className="mt-6 p-6 border rounded-xl bg-slate-50/50 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-sm font-bold flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-600" /> Hasil Kalkulasi EER
                          </Label>
                          <div className="space-y-2">
                            <div className={cn(
                              "flex items-center space-x-2 p-3 rounded-lg border",
                              eerCalculation.type === 'refund' ? "bg-emerald-50/30 border-emerald-200" :
                                eerCalculation.type === 'balance' ? "bg-slate-50/30 border-slate-200" :
                                  "bg-blue-50/30 border-blue-200"
                            )}>
                              <div className="flex-1">
                                <div className="font-semibold text-sm">
                                  {eerCalculation.type === 'balance' ? 'Balance (Sesuai Budget)' : (
                                    eerCalculation.type === 'refund' ? 'Refund (Pengembalian Kelebihan)' : 'Reimbursement (Kekurangan Dana)'
                                  )}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {eerCalculation.type === 'refund'
                                    ? 'Total EER lebih kecil dari ATR. Selisih dana dikembalikan ke kantor.'
                                    : eerCalculation.type === 'balance'
                                      ? 'Total EER sesuai dengan budget ATR. Tidak ada pengembalian atau penambahan dana.'
                                      : 'Total EER lebih besar dari ATR. Kantor akan membayarkan selisihnya.'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-white border rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-muted-foreground">Selisih ATR & EER</span>
                              <span className="text-xs font-medium text-slate-500">
                                {totalEerAmount > (selectedAtr?.amount || 0) ? 'EER > ATR' : 'EER < ATR'}
                              </span>
                            </div>
                            <div className="text-lg font-bold font-mono text-slate-900 border-b pb-2 mb-2">
                              {fmt(eerCalculation.amount)}
                            </div>

                            <div className="space-y-2 text-blue-800">
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Nominal Otomatis ({eerCalculation.type === 'refund' ? 'Refund' : (
                                  eerCalculation.type === 'balance' ? 'Balance' : 'Reimburse'
                                )})
                              </p>
                              <div className="h-10 text-lg font-bold flex items-center px-3 rounded-md bg-blue-50 border border-blue-100">
                                {fmt(eerCalculation.amount)}
                              </div>
                              <p className="text-[10px] text-muted-foreground italic">
                                *Nominal ini dikalkulasi otomatis dari selisih limit ATR ({fmt(selectedAtr?.amount || 0)}) dan total EER.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {eerCalculation.type === 'refund' && eerCalculation.amount > 0 && hasRole(['finance', 'superadmin']) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                          <div className="space-y-4">
                            <Label className="text-sm font-bold flex items-center gap-2 text-rose-600">
                              <Info className="h-4 w-4" /> Informasi Rekening Refund (Socim Group)
                            </Label>
                            <div className="space-y-3 text-xs bg-rose-50/50 border border-rose-100 p-4 rounded-lg">
                              <div>
                                <p className="font-bold text-rose-800">Rek Socim - PT Dampak Sosial Indonesia</p>
                                <p className="text-rose-600 font-mono">BCA 5035288896</p>
                              </div>
                              <div>
                                <p className="font-bold text-rose-800">Rek Lestari - Yayasan Biru Hijau lestari</p>
                                <p className="text-rose-600 font-mono">BNI 2023999001</p>
                              </div>
                              <div>
                                <p className="font-bold text-rose-800">Rek Sustim - Yayasan Dampak Keberlanjutan Indonesia</p>
                                <p className="text-rose-600 font-mono">BNI 2024111915</p>
                              </div>
                              <div>
                                <p className="font-bold text-rose-800">Rek Bamboo - PT Bamboo Karya Mandiri</p>
                                <p className="text-rose-600 font-mono">BCA 5035880001</p>
                              </div>
                              <div>
                                <p className="font-bold text-rose-800">Rek EBLI - Ekosistem Berdaya Lestari Indonesia, YYS</p>
                                <p className="text-rose-600 font-mono">Mandiri 1410055445050</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-bold flex items-center gap-2 text-emerald-600">
                              <Upload className="h-4 w-4" /> Upload Bukti Transfer Refund <span className="text-rose-500">*</span>
                            </Label>
                            <FileUploadDropzone
                              className="h-[120px] bg-white border-2 border-dashed"
                              onFilesChange={(files) => setTransferProof(files[0] || null)}
                            />
                            {transferProof && (
                              <div className="flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-100">
                                <CheckCircle className="h-3 w-3" /> Terpilih: {transferProof.name}
                              </div>
                            )}
                            <p className="text-[10px] text-muted-foreground italic">
                              Harap transfer ke salah satu rekening di atas sesuai entitas project, kemudian lampirkan buktinya di sini.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors._general && <p className="text-xs text-red-500 font-medium bg-red-50 p-2 rounded border border-red-100">{errors._general[0]}</p>}
                </div>
              ) : (
                <div className="py-12 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
                  <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Pilih ATR terlebih dahulu untuk mulai memasukkan pengeluaran.</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Persetujuan */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Persetujuan</h3>
              <p className="text-sm text-muted-foreground mb-6">Pilih Head Approver. Finance dan Direktur akan diberikan secara otomatis sesuai sistem.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" /> Head Approver
                    <span className="text-rose-500">*</span>
                  </Label>
                  <SearchableSelect
                    options={(approvers['head'] || []).map(u => ({ value: u.id.toString(), label: u.name }))}
                    value={formData.approver_head_id}
                    onValueChange={(val) => setFormData(p => ({ ...p, approver_head_id: val }))}
                    placeholder="Pilih Head Divisi"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Head divisi yang bertanggung jawab atas kegiatan ini.</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Keterangan */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Keterangan Tambahan</h3>
              <p className="text-sm text-muted-foreground mb-6">Informasi detail mengenai klaim penggunaan EER.</p>
              <div className="space-y-2 max-w-2xl">
                <Label htmlFor="description">Keterangan Singkat</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Ceritakan singkat tentang klaim EER ini..."
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
                {errors.usage_plan && <p className="text-xs text-red-500 font-medium">{errors.usage_plan[0]}</p>}
              </div>
            </div>

            <CardFooter className="p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t">
              <div className="text-sm text-muted-foreground">
                {loading && <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</span>}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" disabled={loading} onClick={() => handleSubmit('draft')}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> {isEdit ? 'Update Draft' : 'Simpan Draft'}</>}
                </Button>
                <Button type="submit" disabled={loading} className="bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90">
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> {isEdit ? 'Update & Ajukan EER' : 'Ajukan EER'}</>}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Progress overlay when saving */}
        {loading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="h-28 w-28 rounded-full border-4 border-slate-100 flex items-center justify-center shadow-inner">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="font-bold text-2xl text-slate-800">{uploadProgress}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Mengunggah Data</h3>
                <p className="text-sm text-slate-500 max-w-[250px] mx-auto">
                  {uploadProgress === 100
                    ? 'Sedang memproses data, mohon tunggu sebentar...'
                    : 'Mengunggah file bukti pembayaran dan kwitansi...'}
                </p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-blue-600 h-full transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20" style={{ transform: 'skewX(-20deg) translateX(-100%)', animation: 'shimmer 2s infinite' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppSidebarLayout>
  );
}
