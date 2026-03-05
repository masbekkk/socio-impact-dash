import React, { useMemo, useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, User, Briefcase, Building2, Loader2, UserCheck, AlertCircle, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import MoneyInput from '@/components/MoneyInput';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useReimbursementForm } from '@/hooks/use-reimbursement-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface Approver {
  id: number;
  name: string;
  email: string;
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

export default function CreateEER({ atrs = [], approvers = {} }: {
  atrs?: Atr[],
  approvers?: Record<string, Approver[]>
}) {
  const { authUser, loading, errors, setErrors, clearFieldError, submitReimbursement } = useReimbursementForm([]);

  const [selectedActivities, setSelectedActivities] = useState<SelectedActivity[]>([]);

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
    description: '',
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
    setSelectedActivities([]);

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

    // Group ATR items to find unique activities
    const map = new Map<number, { id: number, name: string }>();
    selectedAtr.items.forEach(item => {
      if (!map.has(item.activity_id)) {
        map.set(item.activity_id, { id: item.activity_id, name: item.activity_name });
      }
    });

    // Return activities not yet explicitly added
    return Array.from(map.values()).filter(
      act => !selectedActivities.find(sa => sa.budget_detail_id === act.id)
    );
  }, [selectedAtr, selectedActivities]);

  // Activity management
  const addActivity = (budgetDetailId: number, activityName: string) => {
    if (selectedActivities.find(a => a.budget_detail_id === budgetDetailId)) return;
    setSelectedActivities(prev => [...prev, {
      budget_detail_id: budgetDetailId,
      activity_name: activityName,
      expanded: true,
      children: [{ id: crypto.randomUUID(), item_name: '', quantity: 1, unit_price: 0, amount: 0, receipt: null, notes: '' }],
    }]);
  };

  const removeActivity = (budgetDetailId: number) => {
    setSelectedActivities(prev => prev.filter(a => a.budget_detail_id !== budgetDetailId));
  };

  const toggleActivity = (budgetDetailId: number) => {
    setSelectedActivities(prev => prev.map(a =>
      a.budget_detail_id === budgetDetailId ? { ...a, expanded: !a.expanded } : a
    ));
  };

  // Child item management
  const addChildItem = (budgetDetailId: number) => {
    setSelectedActivities(prev => prev.map(a => {
      if (a.budget_detail_id !== budgetDetailId) return a;
      return { ...a, children: [...a.children, { id: crypto.randomUUID(), item_name: '', quantity: 1, unit_price: 0, amount: 0, receipt: null, notes: '' }] };
    }));
  };

  const removeChildItem = (budgetDetailId: number, itemId: string) => {
    setSelectedActivities(prev => prev.map(a => {
      if (a.budget_detail_id !== budgetDetailId) return a;
      return { ...a, children: a.children.filter(c => c.id !== itemId) };
    }));
  };

  const updateChildItem = (budgetDetailId: number, itemId: string, field: keyof ChildItem, value: any) => {
    setSelectedActivities(prev => prev.map(a => {
      if (a.budget_detail_id !== budgetDetailId) return a;
      return {
        ...a,
        children: a.children.map(c => {
          if (c.id !== itemId) return c;
          const updated = { ...c, [field]: value };
          if (field === 'quantity' || field === 'unit_price') {
            updated.amount = (updated.quantity || 1) * (updated.unit_price || 0);
          }
          return updated;
        }),
      };
    }));
  };

  const getActivityChildrenTotal = (budgetDetailId: number) => {
    const activity = selectedActivities.find(a => a.budget_detail_id === budgetDetailId);
    return activity?.children.reduce((sum, c) => sum + (c.amount || 0), 0) ?? 0;
  };

  const totalEerAmount = useMemo(() => {
    return selectedActivities.reduce((sum, a) => sum + a.children.reduce((s, c) => s + (c.amount || 0), 0), 0);
  }, [selectedActivities]);

  const hasOverBudgetItems = useMemo(() => {
    if (!selectedAtr) return false;
    // We enforce that the entire EER amount cannot exceed the ATR amount
    return totalEerAmount > selectedAtr.amount;
  }, [totalEerAmount, selectedAtr]);

  const handleSubmit = async () => {
    if (selectedActivities.length === 0 || totalEerAmount <= 0) {
      setErrors({ amount: ['Tambahkan minimal 1 item pada kegiatan yang dipilih.'] });
      return;
    }

    if (hasOverBudgetItems) {
      setErrors({ amount: ['Total nilai EER melebihi total persetujuan ATR.'] });
      return;
    }

    if (!formData.approver_head_id || !formData.approver_finance_id || !formData.approver_direktur_id) {
      setErrors({ _general: ['Persetujuan (Head, Finance, Direktur) wajib dipilih.'] });
      return;
    }

    const items = selectedActivities.flatMap(a =>
      a.children.filter(c => c.amount > 0 && c.item_name).map(c => ({
        project_budget_detail_id: a.budget_detail_id,
        parent_item_id: null, // Mapped to null because it's manual input, but still linked to budget detail
        item_name: c.item_name,
        quantity: c.quantity,
        unit_price: c.unit_price,
        amount: c.amount,
        receipt: c.receipt ?? undefined,
        notes: c.notes || undefined,
      }))
    );

    await submitReimbursement({
      type: 'eer',
      eer_type: 'refund',
      atr_id: formData.atr_id,
      project_id: formData.project_id,
      approver_head_id: formData.approver_head_id,
      approver_finance_id: formData.approver_finance_id,
      approver_direktur_id: formData.approver_direktur_id,
      amount: totalEerAmount,
      usage_plan: formData.description,
      items,
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
                  <Select onValueChange={handleAtrChange} value={formData.atr_id}>
                    <SelectTrigger className="h-10">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Pilih ATR terkait" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {atrs.map((atr) => (
                        <SelectItem key={atr.id} value={atr.id.toString()}>
                          {atr.code} — {fmt(atr.amount)} ({atr.project_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <p className="text-sm text-muted-foreground">Input pengeluaran aktual secara manual, lampirkan bukti pembayaran, dengan total maksimal sesuai limit ATR terlampir.</p>
                </div>
                {selectedAtr && (
                  <div className="bg-slate-50 border p-3 rounded-lg text-right">
                    <p className="text-xs text-slate-500 font-medium">Limit ATR Tersedia</p>
                    <p className="text-lg font-bold text-slate-800">{fmt(selectedAtr.amount)}</p>
                  </div>
                )}
              </div>

              {selectedAtr ? (
                <div className="space-y-4">
                  {/* Provider Dropdown for Activities related to ATR */}
                  {availableActivities.length > 0 && (
                    <div className="space-y-2">
                      <Label>Tambah Kegiatan dari ATR (Opsional untuk pengarsipan)</Label>
                      <Select onValueChange={(v) => {
                        const act = availableActivities.find(a => a.id.toString() === v);
                        if (act) addActivity(act.id, act.name);
                      }}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Pilih kegiatan terkait (yang diajukan di ATR)..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableActivities.map(act => (
                            <SelectItem key={act.id} value={act.id.toString()}>
                              {act.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedActivities.length === 0 && (
                    <p className="text-sm text-muted-foreground italic py-4 text-center">Pilih kegiatan di atas untuk mulai memasukkan pengeluaran aktual.</p>
                  )}

                  {/* Selected Activities and Manual Input Form */}
                  {selectedActivities.map((activity) => {
                    const childTotal = getActivityChildrenTotal(activity.budget_detail_id);

                    return (
                      <div key={activity.budget_detail_id} className="border rounded-xl overflow-hidden shadow-sm">
                        {/* Activity Header */}
                        <div
                          className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                          onClick={() => toggleActivity(activity.budget_detail_id)}
                        >
                          <div className="flex items-center gap-3">
                            {activity.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            <div>
                              <h4 className="font-semibold text-sm">{activity.activity_name}</h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-emerald-700">{fmt(childTotal)}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); removeActivity(activity.budget_detail_id); }}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Children */}
                        {activity.expanded && (
                          <div className="p-4 space-y-3 bg-white">
                            {activity.children.map((child, idx) => (
                              <div key={child.id} className="border rounded-lg p-4 space-y-3 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-medium text-sm text-slate-700">Item #{idx + 1}</h5>
                                  <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-red-500 hover:text-red-700" onClick={() => removeChildItem(activity.budget_detail_id, child.id)}>
                                    Hapus
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="md:col-span-2 space-y-2">
                                    <Label className="text-xs">Nama Barang / Pengeluaran</Label>
                                    <Input
                                      value={child.item_name}
                                      onChange={(e) => updateChildItem(activity.budget_detail_id, child.id, 'item_name', e.target.value)}
                                      placeholder="Contoh: Tiket Pesawat JKT-SUB"
                                      className="h-9 text-sm"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs">Kuantitas</Label>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={child.quantity || ''}
                                      onChange={(e) => updateChildItem(activity.budget_detail_id, child.id, 'quantity', parseInt(e.target.value) || 0)}
                                      className="h-9 text-sm"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs">Harga Satuan</Label>
                                    <MoneyInput
                                      value={child.unit_price}
                                      onValueChange={(v) => updateChildItem(activity.budget_detail_id, child.id, 'unit_price', v.floatValue ?? 0)}
                                      placeholder="0"
                                      className="h-9 text-sm"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-xs">Kwitansi / Bukti Pembayaran</Label>
                                    <FileUploadDropzone
                                      className="!p-3 !min-h-0 bg-white"
                                      onFilesChange={(files: File[]) => updateChildItem(activity.budget_detail_id, child.id, 'receipt', files[0] ?? null)}
                                    />
                                    {child.receipt && <p className="text-xs text-green-600">Terlampir: {child.receipt.name}</p>}
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs">Catatan Tambahan</Label>
                                    <Textarea
                                      value={child.notes}
                                      onChange={(e) => updateChildItem(activity.budget_detail_id, child.id, 'notes', e.target.value)}
                                      placeholder="Keterangan..."
                                      className="h-[60px] text-sm resize-none"
                                    />
                                  </div>
                                </div>

                                <div className="pt-2 border-t flex justify-end">
                                  <div className="bg-white px-4 py-2 rounded-md border shadow-sm">
                                    <span className="text-xs text-slate-500 mr-3">Subtotal:</span>
                                    <span className="font-bold">{fmt(child.amount)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}

                            <Button type="button" variant="outline" size="sm" className="w-full border-dashed" onClick={() => addChildItem(activity.budget_detail_id)}>
                              <Plus className="h-4 w-4 mr-2" /> Tambah Item Lain
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Total Checking */}
                  {selectedActivities.length > 0 && (
                    <>
                      {hasOverBudgetItems && (
                        <Alert variant="destructive" className="mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Melebihi Limit ATR</AlertTitle>
                          <AlertDescription>Total klaim EER saat ini ({fmt(totalEerAmount)}) melebihi total limit ATR ({fmt(selectedAtr.amount)}).</AlertDescription>
                        </Alert>
                      )}
                      <div className={cn("border rounded-lg p-4 flex items-center justify-between mt-4", hasOverBudgetItems ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200")}>
                        <div>
                          <p className={cn("text-sm font-medium", hasOverBudgetItems ? "text-red-900" : "text-blue-900")}>Total Klaim EER Keseluruhan</p>
                        </div>
                        <p className={cn("text-xl font-bold", hasOverBudgetItems ? "text-red-900" : "text-blue-900")}>{fmt(totalEerAmount)}</p>
                      </div>
                    </>
                  )}
                  {errors.amount && <p className="text-xs text-red-500 font-medium">{errors.amount[0]}</p>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Pilih ATR terlebih dahulu untuk mulai memasukkan pengeluaran.</p>
              )}
            </div>

            <Separator />

            {/* Persetujuan */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Persetujuan</h3>
              <p className="text-sm text-muted-foreground mb-6">Informasi pihak yang akan menyetujui EER ini (diwariskan dari ATR).</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Head Approver</Label>
                  <Select onValueChange={(val) => setFormData(p => ({ ...p, approver_head_id: val }))} value={formData.approver_head_id}>
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
                  <Label>Finance Approver</Label>
                  <Select onValueChange={(val) => setFormData(p => ({ ...p, approver_finance_id: val }))} value={formData.approver_finance_id}>
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
                  <Label>Direktur Approver</Label>
                  <Select onValueChange={(val) => setFormData(p => ({ ...p, approver_direktur_id: val }))} value={formData.approver_direktur_id}>
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
    </AppSidebarLayout>
  );
}
