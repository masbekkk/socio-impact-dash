import React, { useMemo, useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, User, Briefcase, Building2, Loader2, UserCheck, AlertCircle, CheckCircle2, Receipt } from 'lucide-react';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import MoneyInput from '@/components/MoneyInput';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useReimbursementForm } from '@/hooks/use-reimbursement-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

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

interface SelectedEerItem {
  atr_item_id: number;
  actual_amount: number;
  receipt: File | null;
  notes: string;
}

const fmt = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

export default function CreateEER({ atrs = [], approvers = {} }: {
  atrs?: Atr[],
  approvers?: Record<string, Approver[]>
}) {
  const { authUser, loading, errors, setErrors, clearFieldError, submitReimbursement } = useReimbursementForm([]);

  const [selectedItems, setSelectedItems] = useState<SelectedEerItem[]>([]);

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
    setSelectedItems([]);

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

  // Group items by activity
  const groupedItems = useMemo(() => {
    if (!selectedAtr?.items?.length) return [];
    const groups: Record<number, { activity_name: string; items: AtrItem[] }> = {};
    for (const item of selectedAtr.items) {
      if (!groups[item.activity_id]) {
        groups[item.activity_id] = { activity_name: item.activity_name, items: [] };
      }
      groups[item.activity_id].items.push(item);
    }
    return Object.entries(groups).map(([id, data]) => ({ activity_id: parseInt(id), ...data }));
  }, [selectedAtr]);

  // Toggle item selection
  const toggleItem = (atrItemId: number, atrItem: AtrItem) => {
    setSelectedItems(prev => {
      const exists = prev.find(si => si.atr_item_id === atrItemId);
      if (exists) {
        return prev.filter(si => si.atr_item_id !== atrItemId);
      }
      const remaining = atrItem.amount - atrItem.used_eer_amount;
      return [...prev, { atr_item_id: atrItemId, actual_amount: remaining, receipt: null, notes: '' }];
    });
  };

  const updateSelectedItem = (atrItemId: number, field: keyof SelectedEerItem, value: any) => {
    setSelectedItems(prev => prev.map(si => si.atr_item_id === atrItemId ? { ...si, [field]: value } : si));
  };

  const isItemSelected = (atrItemId: number) => !!selectedItems.find(si => si.atr_item_id === atrItemId);

  const getSelectedItem = (atrItemId: number) => selectedItems.find(si => si.atr_item_id === atrItemId);

  const totalEerAmount = useMemo(() => {
    return selectedItems.reduce((sum, si) => sum + (si.actual_amount || 0), 0);
  }, [selectedItems]);

  // Validate: check if any item exceeds its ATR remaining
  const hasOverBudgetItems = useMemo(() => {
    if (!selectedAtr) return false;
    return selectedItems.some(si => {
      const atrItem = selectedAtr.items.find(i => i.id === si.atr_item_id);
      if (!atrItem) return false;
      return si.actual_amount > (atrItem.amount - atrItem.used_eer_amount);
    });
  }, [selectedItems, selectedAtr]);

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setErrors({ amount: ['Pilih minimal 1 item dari ATR.'] });
      return;
    }

    if (hasOverBudgetItems) {
      setErrors({ amount: ['Ada item dengan nominal melebihi sisa ATR.'] });
      return;
    }

    if (!formData.approver_head_id || !formData.approver_finance_id || !formData.approver_direktur_id) {
      setErrors({ _general: ['Persetujuan (Head, Finance, Direktur) wajib dipilih.'] });
      return;
    }

    const items = selectedItems.map(si => {
      const atrItem = selectedAtr?.items.find(i => i.id === si.atr_item_id);
      return {
        project_budget_detail_id: atrItem?.activity_id ?? 0,
        parent_item_id: si.atr_item_id,
        item_name: atrItem?.item_name ?? '',
        quantity: 1,
        unit_price: si.actual_amount,
        amount: si.actual_amount,
        receipt: si.receipt ?? undefined,
        notes: si.notes || undefined,
      };
    });

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
            <h1 className="text-xl font-bold tracking-tight">Pengajuan EER</h1>
            <p className="text-muted-foreground text-sm">Employee Expense Report — klaim biaya berdasarkan ATR yang sudah disetujui.</p>
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
              <p className="text-sm text-muted-foreground mb-6">Data pribadi dan pilih ATR yang akan diklaim.</p>

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

            {/* Item Selection */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Pilih Item ATR untuk Diklaim</h3>
              <p className="text-sm text-muted-foreground mb-6">Centang item yang akan diklaim, isi nominal aktual, dan upload bukti kwitansi.</p>

              {selectedAtr ? (
                groupedItems.length > 0 ? (
                  <div className="space-y-4">
                    {groupedItems.map(group => (
                      <div key={group.activity_id} className="border rounded-xl overflow-hidden">
                        <div className="bg-slate-50 p-3 border-b">
                          <h4 className="font-semibold text-sm text-slate-800">{group.activity_name}</h4>
                        </div>
                        <div className="divide-y">
                          {group.items.map(item => {
                            const remaining = item.amount - item.used_eer_amount;
                            const selected = isItemSelected(item.id);
                            const selectedData = getSelectedItem(item.id);
                            const overBudget = selectedData ? selectedData.actual_amount > remaining : false;

                            return (
                              <div key={item.id} className={cn("p-4 transition-colors", selected ? "bg-blue-50/50" : "hover:bg-slate-50/50")}>
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    id={`eer-item-${item.id}`}
                                    checked={selected}
                                    disabled={remaining <= 0}
                                    onCheckedChange={() => toggleItem(item.id, item)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label htmlFor={`eer-item-${item.id}`} className="cursor-pointer">
                                        <p className="text-sm font-medium">{item.item_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {item.expense_type && <span className="inline-block bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] mr-2">{item.expense_type}</span>}
                                          ATR: {fmt(item.amount)} · Diklaim: {fmt(item.used_eer_amount)} · <span className={cn(remaining <= 0 && "text-red-500")}>Sisa: {fmt(remaining)}</span>
                                        </p>
                                      </label>
                                      {remaining <= 0 && (
                                        <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Sudah diklaim penuh</span>
                                      )}
                                    </div>

                                    {selected && selectedData && (
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t mt-2">
                                        <div className="space-y-1">
                                          <Label className="text-xs">Nominal Aktual <span className="text-red-500">*</span></Label>
                                          <MoneyInput
                                            value={selectedData.actual_amount}
                                            onValueChange={(v) => updateSelectedItem(item.id, 'actual_amount', v.floatValue ?? 0)}
                                            placeholder="0"
                                            className={cn("h-9 text-sm", overBudget && "border-red-500")}
                                          />
                                          {overBudget && (
                                            <p className="text-xs text-red-500">Melebihi sisa ATR ({fmt(remaining)})</p>
                                          )}
                                          <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                              <div className={cn("h-full rounded-full", overBudget ? "bg-red-500" : "bg-blue-500")} style={{ width: `${Math.min((selectedData.actual_amount / item.amount) * 100, 100)}%` }} />
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">{((selectedData.actual_amount / item.amount) * 100).toFixed(0)}%</span>
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs">Kwitansi/Bukti</Label>
                                          <FileUploadDropzone
                                            className="!p-2 !min-h-0 bg-white"
                                            onFilesChange={(files: File[]) => updateSelectedItem(item.id, 'receipt', files[0] ?? null)}
                                          />
                                          {selectedData.receipt && (
                                            <p className="text-xs text-green-600">✓ {selectedData.receipt.name}</p>
                                          )}
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs">Catatan</Label>
                                          <Input
                                            value={selectedData.notes}
                                            onChange={(e) => updateSelectedItem(item.id, 'notes', e.target.value)}
                                            placeholder="Keterangan..."
                                            className="h-9 text-sm"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Total */}
                    {hasOverBudgetItems && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Peringatan</AlertTitle>
                        <AlertDescription>Ada item dengan nominal aktual melebihi sisa ATR. Perbaiki sebelum mengajukan.</AlertDescription>
                      </Alert>
                    )}

                    <div className={cn("border rounded-lg p-4 flex items-center justify-between", hasOverBudgetItems ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200")}>
                      <div>
                        <p className={cn("text-sm font-medium", hasOverBudgetItems ? "text-red-900" : "text-blue-900")}>Total Klaim EER</p>
                        <p className={cn("text-xs mt-0.5", hasOverBudgetItems ? "text-red-700" : "text-blue-700")}>{selectedItems.length} item dipilih</p>
                      </div>
                      <p className={cn("text-lg font-bold", hasOverBudgetItems ? "text-red-900" : "text-blue-900")}>{fmt(totalEerAmount)}</p>
                    </div>
                    {errors.amount && <p className="text-xs text-red-500 font-medium">{errors.amount[0]}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-yellow-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">ATR ini belum memiliki item. Pastikan ATR telah dibuat dengan flow baru.</p>
                )
              ) : (
                <p className="text-sm text-muted-foreground italic">Pilih ATR terlebih dahulu untuk melihat item yang bisa diklaim.</p>
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
