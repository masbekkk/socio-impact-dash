import React, { useMemo, useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardFooter } from '@/components/ui/card';
import {
    ArrowLeft, Save, FileText, User, AlertCircle,
    Building2, Briefcase, UserCheck, Loader2, Coins, Calendar
} from 'lucide-react';
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

interface Approver {
    id: number;
    name: string;
    email: string;
}

interface SimpleUser {
    id: number;
    name: string;
    email: string;
}

interface AuthUser {
    name: string;
    nip: string;
    email: string;
    division_name: string;
    position: string;
    join_date: string;
}

export default function CreateAllowance({ projects, approvers, authUser, users }: {
    projects: Project[],
    approvers: Record<string, Approver[]>,
    authUser: AuthUser,
    users: SimpleUser[]
}) {
    const { loading, errors, setErrors, getAutoFill, clearFieldError, submitReimbursement } = useReimbursementForm(projects);

    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        project_id: '',
        divisi: '',
        pic_project: '',
        approver_head_id: '',
        approver_hr_id: '',
        approver_direktur_id: '',
        usage_plan: '',
        amount: 0,
        urgency: 'normal',
        start_date: '',
        end_date: '',
        replacement_pic_id: '',
    });

    const [totalDays, setTotalDays] = useState(0);

    useEffect(() => {
        if (formData.start_date && formData.end_date) {
            const start = new Date(formData.start_date);
            const end = new Date(formData.end_date);
            if (start <= end) {
                let days = 0;
                const date = new Date(start);
                while (date <= end) {
                    if (date.getDay() !== 0 && date.getDay() !== 6) {
                        days++;
                    }
                    date.setDate(date.getDate() + 1);
                }
                setTotalDays(days);
            } else {
                setTotalDays(0);
            }
        } else {
            setTotalDays(0);
        }
    }, [formData.start_date, formData.end_date]);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reimbursement', href: '/reimbursements' },
        { title: 'Buat Allowance', href: '/reimbursements/create/allowance' },
    ];

    const handleProjectChange = (value: string) => {
        const autoFill = getAutoFill(value);
        setFormData(prev => ({
            ...prev,
            project_id: value,
            divisi: autoFill.division,
            pic_project: autoFill.pic,
        }));
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

    const handleAmountChange = (values: any) => {
        setFormData(prev => ({ ...prev, amount: values.floatValue || 0 }));
    };

    const handleSubmit = async () => {
        if (!formData.project_id) {
            setErrors({ project_id: ['Pilih project terlebih dahulu.'] });
            return;
        }

        if (!formData.approver_head_id || !formData.approver_hr_id || !formData.approver_direktur_id) {
            setErrors({ _general: ['Persetujuan (Head, HR, Direktur) wajib dipilih.'] });
            return;
        }

        if (formData.amount <= 0) {
            setErrors({ amount: ['Nominal pengajuan wajib diisi.'] });
            return;
        }

        const selected = projects.find(p => p.id === parseInt(formData.project_id));
        if (selected) {
            const remaining = (selected.allowance_budget ?? 0) - (selected.used_allowance_budget ?? 0);
            if (formData.amount > remaining) {
                setErrors({ amount: ['Nominal pengajuan melebihi sisa pagu allowance proyek.'] });
                return;
            }
        }

        const documents: { file: File; type: string }[] = [];
        if (attachmentFile) documents.push({ file: attachmentFile, type: 'other' });

        await submitReimbursement({
            type: 'allowance',
            project_id: formData.project_id,
            amount: formData.amount,
            usage_plan: formData.usage_plan,
            urgency: URGENCY_MAP[formData.urgency] ?? 'normal',
            documents,
            approver_head_id: formData.approver_head_id,
            approver_hr_id: formData.approver_hr_id,
            approver_direktur_id: formData.approver_direktur_id,
            start_date: formData.start_date,
            end_date: formData.end_date,
            replacement_pic_id: formData.replacement_pic_id,
        });
    };

    const selectedProject = useMemo(() => {
        if (!formData.project_id) return null;
        return projects.find(p => p.id === parseInt(formData.project_id)) ?? null;
    }, [formData.project_id, projects]);

    const remainingBudget = useMemo(() => {
        if (!selectedProject) return null;
        return (selectedProject.allowance_budget ?? 0) - (selectedProject.used_allowance_budget ?? 0);
    }, [selectedProject]);

    const budgetExceeded = remainingBudget !== null && formData.amount > remainingBudget;

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Allowance" />

            <div className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="-ml-2">
                        <Link href="/reimbursements"><ArrowLeft className="h-5 w-5" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Form Pengajuan Allowance</h1>
                        <p className="text-muted-foreground text-sm">Lengkapi data untuk mengajukan uang saku atau tunjangan proyek.</p>
                    </div>
                </div>

                {errors._general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{errors._general[0]}</div>
                )}

                <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        {/* Data Pemohon */}
                        <div className="p-6 md:p-8 bg-white">
                            <h3 className="text-lg font-semibold mb-1">Data Pemohon</h3>
                            <p className="text-sm text-muted-foreground mb-6">Informasi data diri Anda saat ini.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Nama Lengkap</Label>
                                    <Input value={authUser.name} readOnly className="bg-muted/50 border-transparent font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">NIP</Label>
                                    <Input value={authUser.nip} readOnly className="bg-muted/50 border-transparent font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Tanggal Bergabung</Label>
                                    <Input value={authUser.join_date} readOnly className="bg-muted/50 border-transparent font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Posisi / Jabatan</Label>
                                    <Input value={authUser.position} readOnly className="bg-muted/50 border-transparent font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Divisi</Label>
                                    <Input value={authUser.division_name} readOnly className="bg-muted/50 border-transparent font-medium" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Detail Pengajuan */}
                        <div className="p-6 md:p-8 bg-white">
                            <h3 className="text-lg font-semibold mb-1">Detail Pengajuan</h3>
                            <p className="text-sm text-muted-foreground mb-6">Pilih proyek dan tentukan nominal allowance yang diajukan.</p>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="project_id">Nama Project <span className="text-red-500">*</span></Label>
                                        <Select onValueChange={handleProjectChange} value={formData.project_id}>
                                            <SelectTrigger className="h-10">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Pilih project" />
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
                                        <Label htmlFor="amount">Nominal Allowance <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Coins className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                            <MoneyInput
                                                id="amount"
                                                value={formData.amount}
                                                onValueChange={handleAmountChange}
                                                className="h-10 pl-9"
                                                placeholder="Contoh: 1.000.000"
                                            />
                                        </div>
                                        {errors.amount && <p className="text-xs text-red-500 font-medium">{errors.amount[0]}</p>}
                                        {budgetExceeded && (
                                            <p className="text-xs text-red-600 font-medium mt-1">Nominal pengajuan melebihi batas pagu allowance proyek.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Tanggal Berangkat <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} className="pl-9 h-10" />
                                        </div>
                                        {errors.start_date && <p className="text-xs text-red-500">{errors.start_date[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">Tanggal Kembali <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleChange} className="pl-9 h-10" />
                                        </div>
                                        {errors.end_date && <p className="text-xs text-red-500">{errors.end_date[0]}</p>}
                                    </div>
                                    <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-md flex items-center justify-between border border-blue-100 h-10">
                                        <span className="text-sm font-medium">Durasi:</span>
                                        <span className="font-bold">{totalDays} Hari</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="replacement_pic_id">Pengganti PIC (Opsional)</Label>
                                        <Select value={formData.replacement_pic_id} onValueChange={(val) => handleSelectChange('replacement_pic_id', val)}>
                                            <SelectTrigger className="h-10">
                                                <div className="flex items-center gap-2">
                                                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Pilih pengganti PIC" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((u) => (
                                                    <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.replacement_pic_id && <p className="text-xs text-red-500">{errors.replacement_pic_id[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="divisi">Divisi Project</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="divisi" name="divisi" className="pl-9 h-10 bg-muted/30" value={formData.divisi} readOnly placeholder="Divisi project otomatis terisi" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Rencana Penggunaan */}
                        <div className="p-6 md:p-8 bg-white">
                            <h3 className="text-lg font-semibold mb-1">Rencana Penggunaan</h3>
                            <p className="text-sm text-muted-foreground mb-6">Jelaskan keperluan allowance dan tingkat urgensi.</p>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="usage_plan">Keterangan Keperluan <span className="text-red-500">*</span></Label>
                                    <Textarea id="usage_plan" name="usage_plan" placeholder="Jelaskan detail agenda dan tujuan perjalanan..." className="min-h-[120px] resize-y" value={formData.usage_plan} onChange={handleChange} />
                                    {errors.usage_plan && <p className="text-xs text-red-500 font-medium">{errors.usage_plan[0]}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 font-medium"><AlertCircle className="h-4 w-4 text-muted-foreground" /> Opsi Urgensi</Label>
                                    <RadioGroup value={formData.urgency} onValueChange={(v) => setFormData(prev => ({ ...prev, urgency: v }))} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer text-sm">
                                            <RadioGroupItem value="low" id="low" />
                                            <Label htmlFor="low" className="flex-1 cursor-pointer font-normal">
                                                <div className="font-medium">Rendah</div>
                                                <div className="text-[10px] text-muted-foreground">Tidak mendesak</div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer text-sm">
                                            <RadioGroupItem value="normal" id="normal" />
                                            <Label htmlFor="normal" className="flex-1 cursor-pointer font-normal">
                                                <div className="font-medium">Normal</div>
                                                <div className="text-[10px] text-muted-foreground">Urgensi standar</div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer text-sm">
                                            <RadioGroupItem value="high" id="high" />
                                            <Label htmlFor="high" className="flex-1 cursor-pointer font-normal">
                                                <div className="font-medium">Tinggi</div>
                                                <div className="text-[10px] text-muted-foreground">Mendesak</div>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Dokumen Pendukung */}
                        <div className="p-6 md:p-8 bg-white">
                            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" /> Dokumen Pendukung (Opsional)
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6">Unggah dokumen pendukung untuk allowance.</p>

                            <FileUploadDropzone className="w-full" onFilesChange={(files: File[]) => setAttachmentFile(files[0] ?? null)} />
                            <p className="text-xs text-muted-foreground mt-4 italic">Format: PDF, JPG, PNG (Max 5MB). Lampirkan bukti pendukung jika ada.</p>
                        </div>

                        <Separator />

                        {/* Persetujuan */}
                        <div className="p-6 md:p-8 bg-white">
                            <h3 className="text-lg font-semibold mb-1">Persetujuan</h3>
                            <p className="text-sm text-muted-foreground mb-6">Pilih pihak yang akan menyetujui pengajuan ini.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="approver_head_id">Head Approver <span className="text-red-500">*</span></Label>
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
                                <div className="space-y-2">
                                    <Label htmlFor="approver_hr_id">HR Approver <span className="text-red-500">*</span></Label>
                                    <Select onValueChange={(val) => handleSelectChange('approver_hr_id', val)} value={formData.approver_hr_id}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Pilih HR" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {approvers['hr']?.map((user) => (
                                                <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="approver_direktur_id">Direktur Approver <span className="text-red-500">*</span></Label>
                                    <Select onValueChange={(val) => handleSelectChange('approver_direktur_id', val)} value={formData.approver_direktur_id}>
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

                        <div className="px-6 md:px-8 pb-8 bg-white">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <p className="text-sm text-amber-800 font-medium mb-1 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" /> Catatan Penting:
                                </p>
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    Pastikan nominal allowance yang diajukan sudah sesuai dengan rencana penggunaan dan plafon anggaran proyek yang tersedia. Dokumen pendukung akan membantu mempercepat proses peninjauan oleh pihak penyetuju.
                                </p>
                            </div>
                        </div>

                        <CardFooter className="p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t">
                            <div className="text-sm text-muted-foreground">
                                {loading && <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</span>}
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" asChild size="lg">
                                    <Link href="/reimbursements">Batal</Link>
                                </Button>
                                <Button type="submit" size="lg" disabled={loading} className="bg-sidebar hover:bg-sidebar/90 min-w-[180px]">
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> Ajukan Allowance</>}
                                </Button>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
