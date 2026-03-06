import React, { useMemo, useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, CreditCard, User, AlertCircle, Building2, Briefcase, UserCheck, Loader2, Plus, X, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MoneyInput from '@/components/MoneyInput';
import { useReimbursementForm } from '@/hooks/use-reimbursement-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DatePicker from '@/components/DatePicker';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/reimbursement';

const URGENCY_MAP: Record<string, string> = {
  low: 'rendah',
  normal: 'normal',
  high: 'tinggi',
  urgent: 'mendesak',
};

interface Approver {
  id: number;
  name: string;
  email: string;
}

interface ExpenseTypeOption {
  value: string;
  label: string;
}

interface ChildItem {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  amount: number;
  expense_type: string;
  notes: string;
}

interface SelectedActivity {
  budget_detail_id: number;
  expanded: boolean;
  detail_aktivitas: string;
  children: ChildItem[];
}

const fmt = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

export default function CreateATR({ projects, approvers, expenseTypes = [] }: {
  projects: Project[],
  approvers: Record<string, Approver[]>,
  expenseTypes?: ExpenseTypeOption[],
}) {
  const { authUser, loading, errors, setErrors, getAutoFill, clearFieldError, submitReimbursement } = useReimbursementForm(projects);

  const [selectedActivities, setSelectedActivities] = useState<SelectedActivity[]>([]);

  const [formData, setFormData] = useState({
    nama: authUser?.name ?? '',
    nip: authUser?.nip ?? '',
    project_id: '',
    divisi: '',
    pic_project: '',
    approver_head_id: '',
    approver_finance_id: '',
    approver_direktur_id: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    usage_plan: '',
    urgency: 'normal',
    start_date: '',
    end_date: '',
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
    }));
    setSelectedActivities([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const selectedProject = useMemo(() => {
    if (!formData.project_id) return null;
    return projects.find(p => p.id === parseInt(formData.project_id)) ?? null;
  }, [formData.project_id, projects]);

  const addActivity = (budgetDetailId: number) => {
    if (selectedActivities.find(a => a.budget_detail_id === budgetDetailId)) return;
    setSelectedActivities(prev => [...prev, {
      budget_detail_id: budgetDetailId,
      expanded: true,
      detail_aktivitas: '',
      children: [{ id: crypto.randomUUID(), item_name: '', quantity: 1, unit_price: 0, amount: 0, expense_type: '', notes: '' }],
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

  const updateActivityDetail = (budgetDetailId: number, detail: string) => {
    setSelectedActivities(prev => prev.map(a =>
      a.budget_detail_id === budgetDetailId ? { ...a, detail_aktivitas: detail } : a
    ));
  };

  const handleValueChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  // Child item management
  const addChildItem = (budgetDetailId: number) => {
    setSelectedActivities(prev => prev.map(a => {
      if (a.budget_detail_id !== budgetDetailId) return a;
      return { ...a, children: [...a.children, { id: crypto.randomUUID(), item_name: '', quantity: 1, unit_price: 0, amount: 0, expense_type: '', notes: '' }] };
    }));
  };

  const removeChildItem = (budgetDetailId: number, itemId: string) => {
    setSelectedActivities(prev => prev.map(a => {
      if (a.budget_detail_id !== budgetDetailId) return a;
      return { ...a, children: a.children.filter(c => c.id !== itemId) };
    }));
  };

  const updateChildItem = (budgetDetailId: number, itemId: string, field: keyof ChildItem, value: string | number) => {
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

  // Budget calculations
  const getActivityChildrenTotal = (budgetDetailId: number) => {
    const activity = selectedActivities.find(a => a.budget_detail_id === budgetDetailId);
    return activity?.children.reduce((sum, c) => sum + (c.amount || 0), 0) ?? 0;
  };

  const totalAmount = useMemo(() => {
    return selectedActivities.reduce((sum, a) => sum + a.children.reduce((s, c) => s + (c.amount || 0), 0), 0);
  }, [selectedActivities]);

  const remainingBudget = useMemo(() => {
    if (!selectedProject) return null;
    return (selectedProject.operational_budget ?? 0) - (selectedProject.used_operational_budget ?? 0);
  }, [selectedProject]);

  const budgetExceeded = remainingBudget !== null && totalAmount > remainingBudget;

  // Available activities (not yet selected)
  const availableActivities = useMemo(() => {
    if (!selectedProject?.budget_details) return [];
    return selectedProject.budget_details.filter(
      bd => !selectedActivities.find(a => a.budget_detail_id === bd.id) && bd.remaining_amount > 0
    );
  }, [selectedProject, selectedActivities]);

  const handleSubmit = async () => {
    if (selectedActivities.length === 0 || totalAmount <= 0) {
      setErrors({ amount: ['Tambahkan minimal 1 item pada kegiatan yang dipilih.'] });
      return;
    }

    if (!formData.start_date) {
      setErrors({ start_date: ['Tanggal penggunaan wajib diisi.'] });
      return;
    }

    if (!formData.approver_head_id) {
      setErrors({ _general: ['Head Approver wajib dipilih.'] });
      return;
    }

    // Validate per-activity budget
    for (const activity of selectedActivities) {
      const detail = selectedProject?.budget_details?.find(bd => bd.id === activity.budget_detail_id);
      if (detail) {
        const childTotal = activity.children.reduce((s, c) => s + (c.amount || 0), 0);
        if (childTotal > detail.remaining_amount) {
          setErrors({ amount: [`Total item pada kegiatan "${detail.item_name}" melebihi sisa anggaran (${fmt(detail.remaining_amount)}).`] });
          return;
        }
      }
    }

    const items = selectedActivities.flatMap(a =>
      a.children.filter(c => c.amount > 0 && c.item_name).map(c => ({
        project_budget_detail_id: a.budget_detail_id,
        item_name: c.item_name,
        quantity: c.quantity,
        unit_price: c.unit_price,
        amount: c.amount,
        expense_type: c.expense_type || undefined,
        notes: c.notes || undefined,
      }))
    );

    const selected_budget_details = selectedActivities.map(a => ({
      project_budget_detail_id: a.budget_detail_id,
      amount: a.children.reduce((s, c) => s + (c.amount || 0), 0),
      notes: a.detail_aktivitas || undefined
    })).filter(a => a.amount > 0);

    await submitReimbursement({
      type: 'atr',
      project_id: formData.project_id,
      amount: totalAmount,
      bank_name: formData.bank_name,
      bank_account: formData.account_number,
      account_holder: formData.account_name,
      usage_plan: formData.usage_plan,
      urgency: URGENCY_MAP[formData.urgency] ?? 'normal',
      start_date: formData.start_date || undefined,
      items,
      selected_budget_details,
      approver_head_id: formData.approver_head_id,
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
                  {errors.project_id && <p className="text-xs text-red-500 font-medium">{errors.project_id[0]}</p>}
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

            {/* Kegiatan & Item Section */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Kegiatan & Item Anggaran</h3>
              <p className="text-sm text-muted-foreground mb-6">Pilih kegiatan dari proyek, lalu tambahkan item detail untuk setiap kegiatan.</p>

              {selectedProject ? (
                <div className="space-y-4">
                  {/* Activity Selector */}
                  {availableActivities.length > 0 && (
                    <div className="space-y-2">
                      <Label>Tambah Kegiatan</Label>
                      <Select onValueChange={(v) => addActivity(parseInt(v))}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Pilih kegiatan yang akan diajukan..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableActivities.map(bd => (
                            <SelectItem key={bd.id} value={bd.id.toString()}>
                              {bd.item_name} — Sisa: {fmt(bd.remaining_amount)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedActivities.length === 0 && (
                    <p className="text-sm text-muted-foreground italic py-4 text-center">Pilih kegiatan di atas untuk mulai menambahkan item.</p>
                  )}

                  {/* Selected Activities */}
                  {selectedActivities.map((activity) => {
                    const detail = selectedProject.budget_details?.find(bd => bd.id === activity.budget_detail_id);
                    if (!detail) return null;
                    const childTotal = getActivityChildrenTotal(activity.budget_detail_id);
                    const overBudget = childTotal > detail.remaining_amount;

                    return (
                      <div key={activity.budget_detail_id} className="border rounded-xl overflow-hidden shadow-sm">
                        {/* Activity Header */}
                        <div
                          className={cn("flex items-center justify-between p-4 cursor-pointer transition-colors", overBudget ? "bg-red-50 hover:bg-red-100" : "bg-slate-50 hover:bg-slate-100")}
                          onClick={() => toggleActivity(activity.budget_detail_id)}
                        >
                          <div className="flex items-center gap-3">
                            {activity.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            <div>
                              <h4 className="font-semibold text-sm">{detail.item_name}</h4>
                              <p className="text-xs text-muted-foreground">
                                Pagu: {fmt(detail.amount_pelaksanaan && detail.amount_pelaksanaan > 0 ? detail.amount_pelaksanaan : detail.amount)} · Terpakai: {fmt(detail.used_amount)} · Sisa: <span className={cn(overBudget && "text-red-600 font-bold")}>{fmt(detail.remaining_amount)}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn("text-sm font-bold", overBudget ? "text-red-600" : "text-emerald-700")}>{fmt(childTotal)}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); removeActivity(activity.budget_detail_id); }}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Children */}
                        {activity.expanded && (
                          <div className="p-4 space-y-4 bg-white">
                            <div className="space-y-1.5 pb-2">
                              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detail Aktivitas (Opsional)</Label>
                              <Input
                                value={activity.detail_aktivitas}
                                onChange={(e) => updateActivityDetail(activity.budget_detail_id, e.target.value)}
                                placeholder="Masukkan detail aktivitas untuk kegiatan ini..."
                                className="h-9 text-sm"
                              />
                            </div>

                            {overBudget && (
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Melebihi Sisa Anggaran</AlertTitle>
                                <AlertDescription>Total item ({fmt(childTotal)}) melebihi sisa anggaran kegiatan ini ({fmt(detail.remaining_amount)}).</AlertDescription>
                              </Alert>
                            )}

                            {activity.children.map((child, idx) => (
                              <div key={child.id} className="border rounded-lg p-4 space-y-3 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-muted-foreground">Item #{idx + 1}</span>
                                  {activity.children.length > 1 && (
                                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeChildItem(activity.budget_detail_id, child.id)}>
                                      <X className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                  <div className="md:col-span-4 space-y-1">
                                    <Label className="text-xs">Nama Item <span className="text-red-500">*</span></Label>
                                    <Input value={child.item_name} onChange={(e) => updateChildItem(activity.budget_detail_id, child.id, 'item_name', e.target.value)} placeholder="Nama item..." className="h-9 text-sm" />
                                  </div>
                                  <div className="md:col-span-1 space-y-1">
                                    <Label className="text-xs">Qty</Label>
                                    <Input type="number" min={1} value={child.quantity} onChange={(e) => updateChildItem(activity.budget_detail_id, child.id, 'quantity', parseInt(e.target.value) || 1)} className="h-9 text-sm" />
                                  </div>
                                  <div className="md:col-span-2 space-y-1">
                                    <Label className="text-xs">Nominal</Label>
                                    <MoneyInput value={child.unit_price} onValueChange={(v) => updateChildItem(activity.budget_detail_id, child.id, 'unit_price', v.floatValue || 0)} placeholder="0" className="h-9 text-sm" />
                                  </div>
                                  <div className="md:col-span-2 space-y-1">
                                    <Label className="text-xs">Jumlah</Label>
                                    <Input value={fmt(child.amount)} readOnly className="h-9 text-sm bg-muted/30 font-medium" />
                                  </div>
                                  <div className="md:col-span-3 space-y-1">
                                    <Label className="text-xs">Jenis Expense</Label>
                                    <Select value={child.expense_type} onValueChange={(v) => updateChildItem(activity.budget_detail_id, child.id, 'expense_type', v)}>
                                      <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Pilih..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {expenseTypes.map(et => (
                                          <SelectItem key={et.value} value={et.value}>{et.label}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            ))}

                            <Button type="button" variant="outline" size="sm" onClick={() => addChildItem(activity.budget_detail_id)} className="gap-2 border-dashed">
                              <Plus className="h-3.5 w-3.5" /> Tambah Item
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Grand Total */}
                  <div className={cn("border rounded-lg p-4 flex items-center justify-between", budgetExceeded ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200")}>
                    <div>
                      <p className={cn("text-sm font-medium", budgetExceeded ? "text-red-900" : "text-emerald-900")}>Total Pengajuan ATR</p>
                      <p className={cn("text-xs mt-0.5", budgetExceeded ? "text-red-700" : "text-emerald-700")}>{selectedActivities.reduce((s, a) => s + a.children.length, 0)} item dari {selectedActivities.length} kegiatan</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-lg font-bold", budgetExceeded ? "text-red-900" : "text-emerald-900")}>{fmt(totalAmount)}</p>
                      {remainingBudget !== null && (
                        <p className={cn("text-xs", budgetExceeded ? "text-red-700 font-bold" : "text-emerald-700")}>
                          Sisa pagu operasional: {fmt(remainingBudget)}
                          {budgetExceeded && ' (Melebihi!)'}
                        </p>
                      )}
                    </div>
                  </div>
                  {errors.amount && <p className="text-xs text-red-500 font-medium">{errors.amount[0]}</p>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Pilih proyek terlebih dahulu.</p>
              )}
            </div>

            <Separator />

            {/* Rencana Penggunaan */}
            <div className="p-6 md:p-8 bg-white">
              <h3 className="text-lg font-semibold mb-1">Rencana Penggunaan</h3>
              <p className="text-sm text-muted-foreground mb-6">Jelaskan rencana penggunaan dana, jadwal pemakaian, dan tingkat urgensi.</p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Tanggal Penggunaan</Label>
                    <DatePicker
                      value={formData.start_date}
                      onChange={(v) => handleValueChange('start_date', v)}
                      error={!!errors.start_date}
                    />
                    {errors.start_date && <p className="text-xs text-red-500 font-medium">{errors.start_date[0]}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usage_plan">Rencana untuk Penggunaannya</Label>
                  <Textarea
                    id="usage_plan"
                    name="usage_plan"
                    placeholder="Jelaskan secara detail rencana penggunaan dana ATR ini..."
                    className={`min-h-[120px] resize-none ${errors.usage_plan ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    value={formData.usage_plan}
                    onChange={handleChange}
                  />
                  {errors.usage_plan && <p className="text-xs text-red-500 font-medium">{errors.usage_plan[0]}</p>}
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
                  <Label htmlFor="approver_head_id">Head Approver</Label>
                  <Select onValueChange={(val) => handleSelectChange('approver_head_id', val)} value={formData.approver_head_id}>
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
