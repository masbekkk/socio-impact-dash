import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ChevronLeft, Wallet, CheckCircle2, Hourglass, Circle, Loader, AlertCircle, FileText, Edit } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import MoneyInput from '@/components/MoneyInput';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface AllowancePageProps {
    project: any;
}

export default function Allowance({ project }: AllowancePageProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Proyek', href: '/projects' },
        { title: project.name, href: `/projects/${project.slug}` },
        { title: 'Allowance', href: '#' },
    ];

    const [approvalNote, setApprovalNote] = useState("");
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [allowanceValue, setAllowanceValue] = useState(1000000); // Default 1 Million
    const [isLocked, setIsLocked] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
    const currentUserRole = 'Finance'; // Mock role for demonstration

    // Mock Workflows for Allowance
    const workflows = [
        { role: 'Finance', name: 'Finance Dept', status: 'approved', date: '2025-01-01' },
        { role: 'HR', name: 'HR Department', status: 'waiting', date: '-' },
    ];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Allowance - ${project.name}`} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-4 md:p-8 pb-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href={`/projects/${project.slug}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 mr-1">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">Allowance Proyek</h1>
                        <Badge variant="outline" className="ml-2">{project.code}</Badge>
                    </div>
                    <p className="text-muted-foreground ml-9">Tambahkan allowance untuk Proyek {project.name}.</p>
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge status={project.status} />
                </div>
            </div>

            <hr className="border-gray-200" />

            <div className="p-4 md:p-8 space-y-8">
                {/* Approval Section */}
                <section>
                    <h3 className="text-lg font-semibold mb-4">Status Persetujuan Allowance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {workflows.map((flow, index) => {
                            const isMyRole = currentUserRole === flow.role;
                            return (
                                <Card
                                    key={index}
                                    className={`transition-all duration-200 ${isMyRole
                                        ? 'bg-[var(--sidebar)] text-white border-[var(--sidebar)] shadow-md'
                                        : flow.status === 'pending'
                                            ? 'border-yellow-500/50 bg-yellow-50/30'
                                            : ''
                                        }`}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className={`text-sm font-medium ${isMyRole ? 'text-white/80' : 'text-muted-foreground'}`}>{flow.role}</CardTitle>
                                            {flow.status === 'approved' && <CheckCircle2 className={`h-5 w-5 ${isMyRole ? 'text-white' : 'text-green-600'}`} />}
                                            {flow.status === 'pending' && <Hourglass className={`h-5 w-5 ${isMyRole ? 'text-white' : 'text-yellow-600'}`} />}
                                            {flow.status === 'waiting' && <Circle className={`h-5 w-5 ${isMyRole ? 'text-white/50' : 'text-gray-300'}`} />}
                                        </div>
                                        <div className={`text-lg font-bold mt-1 ${isMyRole ? 'text-white' : 'text-[var(--sidebar)]'}`}>{flow.name}</div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm mb-3">
                                            <span className={`capitalize px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border
                                      ${isMyRole
                                                    ? 'bg-white/20 text-white border-white/20'
                                                    : flow.status === 'approved'
                                                        ? 'bg-green-100 text-green-700 border-green-200'
                                                        : flow.status === 'pending'
                                                            ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                                                            : 'bg-gray-100 text-gray-500 border-gray-200'
                                                }`}>
                                                {flow.status === 'approved' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                {flow.status === 'pending' && <Hourglass className="h-3.5 w-3.5" />}
                                                {flow.status === 'waiting' && <Loader className="h-3.5 w-3.5 animate-spin" />}
                                                {flow.status === 'pending' ? 'Pending' : flow.status}
                                            </span>
                                            <span className={`text-xs ${isMyRole ? 'text-white/80' : 'text-muted-foreground'}`}>{flow.date}</span>
                                        </div>
                                    </CardContent>
                                    {flow.status === 'approved' && (
                                        <CardFooter>
                                            <Dialog open={activeCardIndex === index} onOpenChange={(open) => setActiveCardIndex(open ? index : null)}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        className={`w-full ${isMyRole ? 'bg-white text-[var(--sidebar)] hover:bg-gray-100' : 'bg-blue-600 hover:bg-blue-700'}`}
                                                        size="sm"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Proses Approval
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Proses Persetujuan</DialogTitle>
                                                        <DialogDescription>
                                                            Apakah Anda Yakin ingin menyetujui . <br />
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="gap-2 sm:gap-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setActiveCardIndex(null)}
                                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 hover:scale-105"
                                                        >
                                                            Batal
                                                        </Button>
                                                        <Button
                                                            className="bg-[var(--sidebar)] hover:scale-105 hover:bg-[var(--sidebar)] text-white"
                                                            onClick={() => {
                                                                setActiveCardIndex(null);
                                                                document.getElementById('nominal')?.scrollIntoView({ behavior: 'smooth' });
                                                                setTimeout(() => document.getElementById('nominal')?.focus(), 500);
                                                            }}
                                                        >
                                                            Ya, Saya Setuju
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </CardFooter>
                                    )}
                                </Card>
                            );
                        })}
                    </div>

                    {/* Approval Form (Inputs & Notes) */}
                    <div className="mt-6 p-6 border rounded-xl bg-white shadow-sm space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nominal Input */}
                            <div className="space-y-2">
                                <Label htmlFor="nominal" className="text-sm font-semibold">
                                    Nominal Allowance <span className="text-red-500">*</span>
                                </Label>
                                <MoneyInput
                                    id="nominal"
                                    value={allowanceValue}
                                    onValueChange={(values) => setAllowanceValue(values.floatValue || 0)}
                                    prefix="Rp "
                                    placeholder="Rp 0"
                                    disabled={isLocked}
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Masukan jumlah allowance yang disetujui.
                                </p>
                            </div>

                            {/* File Input */}
                            <div className="space-y-2">
                                <Label htmlFor="file-upload" className="text-sm font-semibold">
                                    Dokumen Pendukung <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    className="cursor-pointer bg-gray-50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLocked}
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Upload bukti transfer atau dokumen persetujuan (PDF/JPG).
                                </p>
                            </div>
                        </div>

                        {/* Notes Input */}
                        {/* <div className="space-y-2">
                            <Label htmlFor="approval-note" className="text-sm font-semibold">Catatan Approval / Evaluasi</Label>
                            <span className="text-xs text-muted-foreground ml-1">
                                *Catatan wajib diisi jika memilih Revisi.
                            </span>
                            <Textarea
                                id="approval-note"
                                placeholder="Tulis catatan, arahan, atau evaluasi terkait..."
                                className="min-h-[100px] resize-y bg-gray-50 focus:bg-white transition-colors"
                                value={approvalNote}
                                onChange={(e) => setApprovalNote(e.target.value)}
                            />
                        </div> */}

                        <div className="flex justify-end items-center pt-2">
                            <div className="flex gap-3">
                                {isLocked ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsLocked(false)}
                                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-600 transition-transform hover:scale-105 active:scale-95"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Perbaiki
                                    </Button>
                                ) : (
                                    <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-[var(--sidebar)] hover:bg-[var(--sidebar)] text-white shadow-sm transition-transform hover:scale-105 active:scale-95">
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Simpan Perubahan
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Konfirmasi Persetujuan</DialogTitle>
                                                <DialogDescription>
                                                    {allowanceValue !== 1000000 ? (
                                                        <span>
                                                            Nominal allowance telah diubah dari <b>Rp 1.000.000</b> menjadi <b>{formatCurrency(allowanceValue)}</b>. <br />
                                                            Apakah Anda yakin perubahan ini sudah benar?
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            Apakah Anda yakin ingin menyetujui allowance ini? <br />
                                                            Pastikan nominal dan dokumen pendukung sudah sesuai.
                                                        </span>
                                                    )}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Batal</Button>
                                                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                                                    console.log("Approved with value:", allowanceValue);
                                                    setIsLocked(true);
                                                    setIsApproveDialogOpen(false);
                                                }}>
                                                    Ya, Simpan
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppSidebarLayout>
    );
}
