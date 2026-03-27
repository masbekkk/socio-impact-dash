import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

import { CheckCircle, XCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface Item {
    id: number;
    code: string;
    type: string;
    amount?: string | number;
    user?: { id: number; name: string; email?: string };
    project?: { id: number; name: string; code?: string; initial_project?: string | null; division_name?: string };
    start_date?: string;
    end_date?: string;
    created_at: string;
    status: string;
    approvals?: {
        id: number;
        role: string;
        status: string;
        approver?: { id: number; name: string };
    }[];
    [key: string]: any;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700 border-gray-200', icon: FileText },
    submitted: { label: 'Diajukan', className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    revised: { label: 'Sudah Direvisi', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
    approved: { label: 'Disetujui', className: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    head_approved: { label: 'Head Approved', className: 'bg-blue-50 text-blue-600 border-blue-100', icon: CheckCircle },
    hr_approved: { label: 'HR Approved', className: 'bg-blue-50 text-blue-600 border-blue-100', icon: CheckCircle },
    finance_approved: { label: 'Finance Approved', className: 'bg-blue-50 text-blue-600 border-blue-100', icon: CheckCircle },
    request_fund: { label: 'Request Fund', className: 'bg-orange-50 text-orange-600 border-orange-100', icon: Clock },
    transferred: { label: 'Sudah Ditransfer', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
    revision: { label: 'Revisi', className: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle },
    rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const LEAVE_TYPE_LABELS: Record<string, string> = {
    annual: 'Cuti Tahunan',
    sick: 'Cuti Sakit',
    unpaid: 'Cuti Tanpa Gaji',
    travel: 'Perjalanan Dinas',
    berduka: 'Cuti Berduka',
    wedding: 'Cuti Menikah',
    birth: 'Cuti Melahirkan',
    important: 'Cuti Alasan Penting',
};

interface BulkApprovalModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    items: Item[];
    type: 'reimbursement' | 'leave';
}

export function BulkApprovalModal({ isOpen, onOpenChange, title, items, type }: BulkApprovalModalProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelectAll = () => {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map(item => item.id));
        }
    };

    const toggleSelectItem = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleApproveSelected = () => {
        if (selectedIds.length === 0) return;
        
        const routeName = type === 'reimbursement' ? 'reimbursements.bulk-approve' : 'leaves.bulk-approve';
        
        router.post(route(routeName), { ids: selectedIds }, {
            onSuccess: () => {
                onOpenChange(false);
                setSelectedIds([]);
            }
        });
    };

    const handleApproveAll = () => {
        const allIds = items.map(item => item.id);
        const routeName = type === 'reimbursement' ? 'reimbursements.bulk-approve' : 'leaves.bulk-approve';

        router.post(route(routeName), { ids: allIds }, {
            onSuccess: () => {
                onOpenChange(false);
                setSelectedIds([]);
            }
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd MMM yyyy', { locale: localeId });
        } catch (e) {
            return '-';
        }
    };

    const isATR = items.length > 0 && items[0].type === 'atr';

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[95vw] w-full max-h-[90vh] flex flex-col p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                    <DialogDescription className="text-sm">Pilih pengajuan yang akan disetujui secara massal.</DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-auto my-4 border rounded-md">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox 
                                        checked={selectedIds.length === items.length && items.length > 0} 
                                        onCheckedChange={toggleSelectAll} 
                                    />
                                </TableHead>
                                {type === 'reimbursement' ? (
                                    isATR ? (
                                        <>
                                            <TableHead className="font-bold">Kode ATR</TableHead>
                                            <TableHead className="font-bold">Kode Project</TableHead>
                                            <TableHead className="font-bold">Inisial Project</TableHead>
                                            <TableHead className="font-bold">Nominal</TableHead>
                                            <TableHead className="font-bold">Status Approval</TableHead>
                                            <TableHead className="font-bold">Status</TableHead>
                                        </>
                                    ) : (
                                        <>
                                            <TableHead className="font-bold">Kode</TableHead>
                                            <TableHead className="font-bold">Tanggal</TableHead>
                                            <TableHead className="font-bold">Pemohon</TableHead>
                                            <TableHead className="font-bold">Divisi</TableHead>
                                            <TableHead className="font-bold">Proyek</TableHead>
                                            <TableHead className="font-bold text-right">Total Biaya</TableHead>
                                            <TableHead className="font-bold">Status Approval</TableHead>
                                            <TableHead className="font-bold">Status</TableHead>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <TableHead className="font-bold">Kode & Tanggal</TableHead>
                                        <TableHead className="font-bold">Karyawan</TableHead>
                                        <TableHead className="font-bold">Jenis Cuti</TableHead>
                                        <TableHead className="font-bold">Durasi</TableHead>
                                        <TableHead className="font-bold">Status Approval</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length > 0 ? items.map((item) => {
                                const statusCfg = STATUS_CONFIG[item.status] ?? { label: item.status, className: 'bg-gray-100 text-gray-600', icon: Clock };
                                const StatusIcon = statusCfg.icon;

                                return (
                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            <Checkbox 
                                                checked={selectedIds.includes(item.id)} 
                                                onCheckedChange={() => toggleSelectItem(item.id)} 
                                            />
                                        </TableCell>
                                        {type === 'reimbursement' ? (
                                            isATR ? (
                                                <>
                                                    <TableCell className="font-medium font-mono text-xs">{item.code}</TableCell>
                                                    <TableCell className="text-xs font-mono">{item.project?.code ?? '-'}</TableCell>
                                                    <TableCell className="text-xs">{item.project?.initial_project ?? '-'}</TableCell>
                                                    <TableCell className="text-xs font-semibold">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(item.amount || 0))}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1 min-w-[120px]">
                                                            {item.approvals && [...item.approvals].sort((a, b) => {
                                                                const p: Record<string, number> = { head: 1, hr: 2, finance: 3, direktur: 4 };
                                                                return (p[a.role] || 99) - (p[b.role] || 99);
                                                            }).map((approval) => (
                                                                <div key={approval.id} className="text-[10px] flex items-center gap-1">
                                                                    {approval.status === 'approved' ? (
                                                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                                                    ) : approval.status === 'revised' ? (
                                                                        <AlertCircle className="h-3 w-3 text-blue-500" />
                                                                    ) : (
                                                                        <XCircle className="h-3 w-3 text-red-400" />
                                                                    )}
                                                                    <span className={cn(
                                                                        "font-medium",
                                                                        approval.status === 'approved' ? "text-green-700" :
                                                                          approval.status === 'revised' ? "text-blue-700" :
                                                                            "text-red-700"
                                                                    )}>
                                                                        {approval.approver?.name || approval.role}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={cn('gap-1 text-[10px] px-2 py-0', statusCfg.className)}>
                                                            <StatusIcon className="h-3 w-3" />
                                                            {statusCfg.label}
                                                        </Badge>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell className="font-medium font-mono text-xs">{item.code}</TableCell>
                                                    <TableCell className="text-xs">{formatDate(item.created_at)}</TableCell>
                                                    <TableCell className="text-xs">{item.user?.name ?? '-'}</TableCell>
                                                    <TableCell className="text-xs truncate max-w-[100px]">{item.project?.division_name ?? '-'}</TableCell>
                                                    <TableCell className="text-xs truncate max-w-[150px]">{item.project?.name ?? '-'}</TableCell>
                                                    <TableCell className="text-right text-xs font-semibold">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(item.amount || 0))}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1 min-w-[120px]">
                                                            {item.approvals && [...item.approvals].sort((a, b) => {
                                                                const p: Record<string, number> = { head: 1, hr: 2, finance: 3, direktur: 4 };
                                                                return (p[a.role] || 99) - (p[b.role] || 99);
                                                            }).map((approval) => (
                                                                <div key={approval.id} className="text-[10px] flex items-center gap-1">
                                                                    {approval.status === 'approved' ? (
                                                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                                                    ) : approval.status === 'revised' ? (
                                                                        <AlertCircle className="h-3 w-3 text-blue-500" />
                                                                    ) : (
                                                                        <XCircle className="h-3 w-3 text-red-400" />
                                                                    )}
                                                                     <span className={cn(
                                                                        "font-medium",
                                                                        approval.status === 'approved' ? "text-green-700" :
                                                                          approval.status === 'revised' ? "text-blue-700" :
                                                                            "text-red-700"
                                                                    )}>
                                                                        {approval.approver?.name || approval.role}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={cn('gap-1 text-[10px] px-2 py-0', statusCfg.className)}>
                                                            <StatusIcon className="h-3 w-3" />
                                                            {statusCfg.label}
                                                        </Badge>
                                                    </TableCell>
                                                </>
                                            )
                                        ) : (
                                            <>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-medium text-xs font-mono">{item.code}</span>
                                                        <span className="text-[10px] text-muted-foreground">{formatDate(item.created_at)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium">{item.user?.name ?? '-'}</span>
                                                        <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{item.user?.email ?? '-'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-normal text-[10px] bg-blue-50 text-blue-700 border-blue-100">
                                                        {LEAVE_TYPE_LABELS[item.type] ?? item.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs">
                                                        <span className="font-semibold text-emerald-700">
                                                            {(() => {
                                                                const s = new Date(item.start_date || '');
                                                                const e = new Date(item.end_date || '');
                                                                const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                                                                return `${diff} Hari`;
                                                            })()}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                            {format(new Date(item.start_date || ''), 'dd MMM', { locale: localeId })} - {format(new Date(item.end_date || ''), 'dd MMM', { locale: localeId })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                     <div className="flex flex-col gap-1 min-w-[120px]">
                                                        {item.approvals?.map((a) => (
                                                            <div key={a.id} className="flex items-center gap-1.5 text-[10px]">
                                                                {a.status === 'approved' ? (
                                                                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                                                                ) : (
                                                                    <XCircle className="h-3 w-3 text-rose-400" />
                                                                )}
                                                                <span className={cn(
                                                                    "font-medium",
                                                                    a.status === 'approved' ? 'text-emerald-700' : 'text-rose-700'
                                                                )}>
                                                                    {a.approver?.name || a.role}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={cn('gap-1 text-[10px] px-2 py-0', statusCfg.className)}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusCfg.label}
                                                    </Badge>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                );
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                                        Tidak ada data pengajuan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter className="flex flex-row justify-between sm:justify-between items-center gap-4 pt-4 border-t">
                    <div className="text-sm font-medium text-gray-500">
                        {selectedIds.length} item dipilih dari {items.length}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button variant="outline" className="border-[#1a5f4a] text-[#1a5f4a] hover:bg-emerald-50" onClick={handleApproveAll} disabled={items.length === 0}>Setujui Semua</Button>
                        <Button 
                            className="bg-[#1a5f4a] hover:bg-[#144a39] min-w-[140px]" 
                            disabled={selectedIds.length === 0}
                            onClick={handleApproveSelected}
                        >
                            Setujui Terpilih ({selectedIds.length})
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
