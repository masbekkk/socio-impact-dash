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
  notes: string;
}

interface SelectedActivity {
  budget_detail_id: number;
  activity_name: string;
  expanded: boolean;
  children: ChildItem[];
}

const fmt = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

export default function CreateEER({ atrs = [], approvers = {}, expenseTypes = [] }: {
  atrs?: Atr[],
  approvers?: Record<string, Approver[]>,
  expenseTypes?: ExpenseTypeOption[],
}) {
  const { authUser, loading, errors, setErrors, clearFieldError, submitReimbursement } = useReimbursementForm([]);

  const [items, setItems] = useState<({ id: string } & ChildItem & { project_budget_detail_id: number | '' })[]>([]);

  const [formData, setFormData] = useState({
    name: authUser?.name ?? '',
    nip: authUser?.nip ?? '',
    atr_id: '',
    project_id: '',
    project_name: '',
    division: '',
    pic: '',
    approver_head_id: '',
    description: '',
    eer_type: 'refund' as 'refund' | 'reimbursement',
    refund_reimburse_amount: 0,
  });

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
    { title: 'Buat EER', href: '/reimbursements/create/eer' },
  ];

  const handleAtrChange = (value: string) => {
    const selected = atrs.find(a => a.id.toString() === value);
    if (!selected) return;

    clearFieldError('atr_id');
    setItems([{
      id: crypto.randomUUID(),
      project_budget_detail_id: '',
      item_name: '',
      quantity: 1,
      unit_price: 0,
      amount: 0,
      expense_type: '',
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

  const selectedAtr = useMemo(() => {
    if (!formData.atr_id) return null;
    return atrs.find(a => a.id.toString() === formData.atr_id) ?? null;
  }, [formData.atr_id, atrs]);

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
  const addItem = () => {
    setItems(prev => [...prev, {
      id: crypto.randomUUID(),
      project_budget_detail_id: '',
      item_name: '',
      quantity: 1,
      unit_price: 0,
      amount: 0,
      expense_type: '',
      receipt: null,
      notes: ''
    }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

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

  const totalEerAmount = useMemo(() => {
    return items.reduce((sum, i) => sum + (i.amount || 0), 0);
  }, [items]);

  const eerCalculation = useMemo(() => {
    if (!selectedAtr) return { type: 'refund' as const, amount: 0 };
    const diff = totalEerAmount - selectedAtr.amount;
    return {
      type: diff > 0 ? ('reimbursement' as const) : ('refund' as const),
      amount: Math.abs(diff),
    };
  }, [totalEerAmount, selectedAtr]);

  const hasOverBudgetItems = false;

  const handleSubmit = async () => {
    if (items.length === 0 || totalEerAmount <= 0) {
      setErrors({ _general: ['Tambahkan minimal 1 item pengeluaran.'] });
      return;
    }

    // Validation: Check if all mandatory fields are filled
    const isInvalid = items.some(i =>
      !i.project_budget_detail_id ||
      !i.item_name.trim() ||
      i.quantity <= 0 ||
      i.unit_price <= 0 ||
      !i.expense_type ||
      !i.receipt
    );

    if (isInvalid) {
      setErrors({ _general: ['Semua detail item (Kegiatan, Nama, Qty, Harga, Jenis, Kwitansi) wajib diisi.'] });
      return;
    }

    if (!formData.approver_head_id) {
      setErrors({ _general: ['Head Approver wajib dipilih.'] });
      return;
    }

    const payloadItems = items.map(i => ({
      project_budget_detail_id: i.project_budget_detail_id,
      item_name: i.item_name,
      quantity: i.quantity,
      unit_price: i.unit_price,
      amount: i.amount,
      expense_type: i.expense_type,
      receipt: i.receipt ?? undefined,
      notes: i.notes || undefined,
    }));

    await submitReimbursement({
      type: 'eer',
      eer_type: eerCalculation.type,
      refund_reimburse_amount: eerCalculation.amount,
      atr_id: formData.atr_id,
      project_id: formData.project_id,
      approver_head_id: formData.approver_head_id,
      amount: totalEerAmount,
      usage_plan: formData.description,
      items: payloadItems,
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
            <h1 className="text-xl font-bold tracking-tight">Pengajuan EER (Baru)</h1>
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
                  <h3 className="text-lg font-semibold mb-1">Rincian Pengeluaran Aktual (EER)</h3>
                  <p className="text-sm text-muted-foreground">Input pengeluaran aktual secara manual. Semua detail item (Kegiatan, Nama, Qty, Harga, Jenis, Kwitansi) wajib diisi sesuai bukti pembayaran.</p>
                </div>
                {selectedAtr && (
                  <div className="bg-slate-50 border p-3 rounded-lg text-right">
                    <p className="text-xs text-slate-500 font-medium">Limit ATR Tersedia</p>
                    <p className="text-lg font-bold text-slate-800">{fmt(selectedAtr.amount)}</p>
                  </div>
                )}
              </div>

              {selectedAtr ? (
                <div className="space-y-6">
                  {items.map((item, idx) => (
                    <div key={item.id} className="border rounded-xl bg-slate-50/30 p-4 md:p-6 relative transition-all hover:border-blue-200 hover:shadow-sm">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-dashed">
                        <h5 className="font-bold text-sm text-blue-900 flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">{idx + 1}</div>
                          Item Pengeluaran
                        </h5>
                        {items.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                        {/* Row 1: Activity & Name */}
                        <div className="md:col-span-12 lg:col-span-5 space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            Pilih Kegiatan <span className="text-red-500">*</span>
                          </Label>
                          <SearchableSelect
                            options={availableActivities.map(act => ({ value: act.id.toString(), label: act.name }))}
                            value={item.project_budget_detail_id.toString()}
                            onValueChange={(v) => updateItem(item.id, 'project_budget_detail_id', parseInt(v))}
                            placeholder="Pilih kegiatan dari ATR..."
                          />
                        </div>

                        <div className="md:col-span-12 lg:col-span-7 space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            Nama Barang / Pengeluaran <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={item.item_name}
                            onChange={(e) => updateItem(item.id, 'item_name', e.target.value)}
                            placeholder="Contoh: Tiket Pesawat JKT-SUB"
                            className="h-10 text-sm bg-white"
                          />
                        </div>

                        {/* Row 2: Qty, Price, Type */}
                        <div className="md:col-span-4 lg:col-span-2 space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            Qty <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity || ''}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="h-10 text-sm bg-white"
                          />
                        </div>

                        <div className="md:col-span-8 lg:col-span-4 space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            Harga Satuan <span className="text-red-500">*</span>
                          </Label>
                          <MoneyInput
                            value={item.unit_price}
                            onValueChange={(v) => updateItem(item.id, 'unit_price', v.floatValue ?? 0)}
                            placeholder="0"
                            className="h-10 text-sm bg-white"
                          />
                        </div>

                        <div className="md:col-span-12 lg:col-span-3 space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            Jenis Expense <span className="text-red-500">*</span>
                          </Label>
                          <SearchableSelect
                            options={expenseTypes.map(t => ({ value: t.value, label: t.label }))}
                            value={item.expense_type}
                            onValueChange={(v) => updateItem(item.id, 'expense_type', v)}
                            placeholder="Pilih..."
                            className="h-10"
                          />
                        </div>

                        <div className="md:col-span-12 lg:col-span-3 space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah Total</Label>
                          <div className="h-10 bg-emerald-50 border border-emerald-100 rounded-md flex items-center px-4 font-bold text-emerald-800 text-sm">
                            {fmt(item.amount)}
                          </div>
                        </div>

                        {/* Row 3: Receipt & Notes */}
                        <div className="md:col-span-12 lg:col-span-6 space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            KWITANSI / BUKTI PEMBAYARAN <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <FileUploadDropzone
                            className="bg-white h-[120px] overflow-hidden rounded-lg"
                            onFilesChange={(files: File[]) => updateItem(item.id, 'receipt', files[0] ?? null)}
                          />
                          {item.receipt && (
                            <div className="flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-100">
                              <CheckCircle className="h-3 w-3" /> Terlampir: {item.receipt.name}
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-12 lg:col-span-6 space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">CATATAN TAMBAHAN</Label>
                          <Textarea
                            value={item.notes}
                            onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                            placeholder="Keterangan tambahan untuk item ini..."
                            className="min-h-[120px] text-sm resize-none bg-white font-normal"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" className="w-full border-dashed h-12 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" /> Tambah Item Pengeluaran Baru
                  </Button>

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
                              "flex items-center space-x-2 p-3 rounded-lg border bg-blue-50/30 border-blue-200"
                            )}>
                              <div className="flex-1">
                                <div className="font-semibold text-sm">
                                  {eerCalculation.type === 'refund' ? 'Refund (Pengembalian Kelebihan)' : 'Reimbursement (Kekurangan Dana)'}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {eerCalculation.type === 'refund'
                                    ? 'Total EER lebih kecil dari ATR. Selisih dana dikembalikan ke kantor.'
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
                                Nominal Otomatis ({eerCalculation.type === 'refund' ? 'Refund' : 'Reimburse'})
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
                <Button type="submit" disabled={loading} className="bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90">
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> Ajukan EER</>}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppSidebarLayout >
  );
}
