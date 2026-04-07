import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { router, Link } from '@inertiajs/react';

import { CheckCircle, XCircle, Clock, AlertCircle, FileText, Eye } from 'lucide-react';
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

export interface BulkApprovalModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    items: Item[];
    type: 'reimbursement' | 'leave';
    role: string;
    actionType?: 'approve' | 'request_fund';
}

export function BulkApprovalModal({ isOpen, onOpenChange, title, items, type, role, actionType = 'approve' }: BulkApprovalModalProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [actionMode, setActionMode] = useState<'approve' | 'reject' | 'revision' | null>(null);
    const [notes, setNotes] = useState<Record<number, string>>({});
    const [globalNote, setGlobalNote] = useState('');

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
        
        const routeName = actionType === 'request_fund' 
            ? 'reimbursements.bulk-request-fund' 
            : (type === 'reimbursement' ? 'reimbursements.bulk-approve' : 'leaves.bulk-approve');
        
        router.post(route(routeName), { ids: selectedIds, role }, {
            onSuccess: () => {
                onOpenChange(false);
                setSelectedIds([]);
                setActionMode(null);
                setNotes({});
            }
        });
    };

    const handleConfirmAction = () => {
        if (selectedIds.length === 0 || !actionMode) return;

        const routeMap = {
            approve: actionType === 'request_fund' 
                ? 'reimbursements.bulk-request-fund' 
                : (type === 'reimbursement' ? 'reimbursements.bulk-approve' : 'leaves.bulk-approve'),
            reject: type === 'reimbursement' ? 'reimbursements.bulk-reject' : 'leaves.bulk-reject',
            revision: type === 'reimbursement' ? 'reimbursements.bulk-revision' : 'leaves.bulk-revision',
        };

        const routeName = routeMap[actionMode];
        
        router.post(route(routeName), { 
            ids: selectedIds,
            notes: notes,
            role: role
        }, {
            onSuccess: () => {
                onOpenChange(false);
                setSelectedIds([]);
                setActionMode(null);
                setNotes({});
            }
        });
    };

    const handleActionSelected = (action: 'reject' | 'revision') => {
        if (selectedIds.length === 0) return;
        setActionMode(action);
        // Initialize notes for selected items if they don't exist
        const newNotes = { ...notes };
        selectedIds.forEach(id => {
            if (!newNotes[id]) newNotes[id] = '';
        });
        setNotes(newNotes);
    };

    const handleActionAll = (action: 'reject' | 'revision') => {
        const allIds = items.map(item => item.id);
        setSelectedIds(allIds);
        setActionMode(action);
        const newNotes: Record<number, string> = {};
        allIds.forEach(id => {
            newNotes[id] = '';
        });
        setNotes(newNotes);
    };

    const updateNote = (id: number, note: string) => {
        setNotes(prev => ({ ...prev, [id]: note }));
    };

    const applyGlobalNote = () => {
        const newNotes = { ...notes };
        selectedIds.forEach(id => {
            newNotes[id] = globalNote;
        });
        setNotes(newNotes);
    };

    const handleApproveAll = () => {
        const allIds = items.map(item => item.id);
        const routeName = actionType === 'request_fund' 
            ? 'reimbursements.bulk-request-fund' 
            : (type === 'reimbursement' ? 'reimbursements.bulk-approve' : 'leaves.bulk-approve');

        router.post(route(routeName), { ids: allIds, role }, {
            onSuccess: () => {
                onOpenChange(false);
                setSelectedIds([]);
                setActionMode(null);
                setNotes({});
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
                    <DialogTitle className="text-xl font-bold">
                        {actionMode === 'reject' ? 'Konfirmasi Penolakan Massal' : 
                         actionMode === 'revision' ? 'Konfirmasi Permintaan Revisi Massal' : 
                         title}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {actionMode ? 'Berikan alasan untuk setiap item yang dipilih.' : 'Pilih pengajuan yang akan diproses secara massal.'}
                    </DialogDescription>
                </DialogHeader>
                
                {actionMode ? (
                    <div className="flex-1 overflow-auto my-4 flex flex-col gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg border flex flex-col gap-2">
                            <Label htmlFor="global-note" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Catatan Global (Opsional)</Label>
                            <div className="flex gap-2">
                                <Textarea 
                                   id="global-note"
                                   placeholder="Masukkan catatan untuk semua item..." 
                                   className="bg-white resize-none h-20 text-xs"
                                   value={globalNote}
                                   onChange={(e) => setGlobalNote(e.target.value)}
                                />
                                <Button 
                                    variant="outline" 
                                    className="h-20 border-emerald-600 text-emerald-600 hover:bg-emerald-50 shrink-0"
                                    onClick={applyGlobalNote}
                                >
                                    Terapkan ke Semua
                                </Button>
                            </div>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-1/4 font-bold">Informasi Item</TableHead>
                                        <TableHead className="font-bold">Catatan / Alasan {actionMode === 'reject' ? 'Penolakan' : 'Revisi'}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.filter(item => selectedIds.includes(item.id)).map((item) => (
                                        <TableRow key={item.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-bold text-[10px]">{item.code}</span>
                                                        <Badge variant="outline" className="text-[8px] px-1 py-0">{item.type.toUpperCase()}</Badge>
                                                    </div>
                                                    <span className="text-[10px] font-medium">{item.user?.name}</span>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatDate(item.created_at)}</span>
                                                    <span className="text-[10px] font-semibold text-emerald-700">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(item.amount || 0))}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Textarea 
                                                    placeholder={`Alasan ${actionMode === 'reject' ? 'ditolak' : 'revisi'}...`}
                                                    className="min-h-[80px] text-xs resize-none"
                                                    value={notes[item.id] || ''}
                                                    onChange={(e) => updateNote(item.id, e.target.value)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ) : (
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
                                        <>
                                            <TableHead className="font-bold">Tipe</TableHead>
                                            <TableHead className="font-bold">Kode</TableHead>
                                            <TableHead className="font-bold">Tgl</TableHead>
                                            <TableHead className="font-bold">Pemohon</TableHead>
                                            <TableHead className="font-bold">Kode Project</TableHead>
                                            <TableHead className="font-bold">Initial Project</TableHead>
                                            <TableHead className="font-bold min-w-[150px]">Detail Kegiatan</TableHead>
                                            <TableHead className="font-bold">Nominal</TableHead>
                                            <TableHead className="font-bold">Status Approval</TableHead>
                                            <TableHead className="font-bold">Status</TableHead>
                                            <TableHead className="font-bold text-right">Aksi</TableHead>
                                        </>
                                    ) : (
                                        <>
                                            <TableHead className="font-bold">Kode & Tanggal</TableHead>
                                            <TableHead className="font-bold">Karyawan</TableHead>
                                            <TableHead className="font-bold">Jenis Cuti</TableHead>
                                            <TableHead className="font-bold">Durasi</TableHead>
                                            <TableHead className="font-bold">Status Approval</TableHead>
                                            <TableHead className="font-bold">Status</TableHead>
                                            <TableHead className="font-bold text-right">Aksi</TableHead>
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
                                                <>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <Badge variant="outline" className="uppercase text-[10px] w-fit">{item.type}</Badge>
                                                            {item.type === 'eer' && item.eer_type && (
                                                                <span className={cn(
                                                                    "text-[9px] font-medium px-1 py-0.5 rounded-full border w-fit text-center",
                                                                    item.eer_type === 'refund' ? "bg-orange-50 text-orange-600 border-orange-200" :
                                                                    item.eer_type === 'reimbursement' ? "bg-blue-50 text-blue-600 border-blue-200" :
                                                                    "bg-purple-50 text-purple-600 border-purple-200"
                                                                )}>
                                                                    {item.eer_type === 'refund' ? 'Refund' :
                                                                    item.eer_type === 'reimbursement' ? 'Reimbursement' :
                                                                    'Balance'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium font-mono text-[10px]">{item.code}</TableCell>
                                                    <TableCell className="text-[10px] whitespace-nowrap">{formatDate(item.created_at)}</TableCell>
                                                    <TableCell className="text-[10px]">{item.user?.name ?? '-'}</TableCell>
                                                    <TableCell className="text-[10px] font-mono">{item.project?.code ?? '-'}</TableCell>
                                                    <TableCell className="text-[10px]">{item.project?.initial_project ?? '-'}</TableCell>
                                                    <TableCell className="text-[10px] min-w-[150px] max-w-[250px] leading-relaxed">
                                                        <span className="whitespace-normal break-words">{item.usage_plan ?? '-'}</span>
                                                    </TableCell>
                                                    <TableCell className="text-[10px] font-semibold whitespace-nowrap">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(item.amount || 0))}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1 min-w-[100px]">
                                                            {item.approvals && [...item.approvals].sort((a, b) => {
                                                                const p: Record<string, number> = { head: 1, hr: 2, finance: 3, direktur: 4 };
                                                                return (p[a.role] || 99) - (p[b.role] || 99);
                                                            }).map((approval) => (
                                                                <div key={approval.id} className="text-[9px] flex items-center gap-1">
                                                                    {approval.status === 'approved' ? (
                                                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                                                    ) : approval.status === 'revised' ? (
                                                                        <AlertCircle className="h-3 w-3 text-blue-500" />
                                                                    ) : (
                                                                        <XCircle className="h-3 w-3 text-red-400" />
                                                                    )}
                                                                    <span className={cn(
                                                                        "font-medium truncate max-w-[80px]",
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
                                                        <Badge className={cn('gap-1 text-[9px] px-1.5 py-0 whitespace-nowrap', statusCfg.className)}>
                                                            <StatusIcon className="h-2.5 w-2.5" />
                                                            {statusCfg.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Link href={`/reimbursements/${item.id}`} className="text-emerald-700 hover:text-emerald-800" target="_blank">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </TableCell>
                                                </>
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
                                                    <TableCell className="text-right">
                                                        <Link href={`/leaves/${item.code}`} className="text-emerald-700 hover:text-emerald-800" target="_blank">
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={type === 'reimbursement' ? 11 : 7} className="text-center py-12 text-muted-foreground text-xs">
                                            Tidak ada data pengajuan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
                    <div className="text-xs font-medium text-muted-foreground w-full sm:w-auto">
                        {selectedIds.length} item dipilih dari {items.length}
                    </div>
                    
                    {actionMode ? (
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <Button variant="ghost" className="text-xs" onClick={() => setActionMode(null)}>Kembali</Button>
                            <Button 
                                className={cn(
                                    "min-w-[140px] text-xs font-bold",
                                    actionMode === 'reject' ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"
                                )}
                                onClick={handleConfirmAction}
                            >
                                Konfirmasi {actionMode === 'reject' ? 'Tolak' : 'Revisi'} ({selectedIds.length})
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                            <Button variant="ghost" className="text-xs" onClick={() => onOpenChange(false)}>Batal</Button>
                            
                            <div className="flex gap-2 border-l pl-2 ml-2">
                                <Button 
                                    variant="outline" 
                                    className="border-red-200 text-red-700 hover:bg-red-50 text-[10px] h-8" 
                                    onClick={() => handleActionAll('reject')}
                                    disabled={items.length === 0}
                                >
                                    Tolak Semua
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="border-orange-200 text-orange-700 hover:bg-orange-50 text-[10px] h-8" 
                                    onClick={() => handleActionAll('revision')}
                                    disabled={items.length === 0}
                                >
                                    Revisi Semua
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-[10px] h-8 font-bold" 
                                    onClick={handleApproveAll} 
                                    disabled={items.length === 0}
                                >
                                    {actionType === 'request_fund' ? 'Request Fund Semua' : 'Setujui Semua'}
                                </Button>
                            </div>

                            <div className="flex gap-2 border-l pl-2 ml-2">
                                <Button 
                                    variant="outline" 
                                    className="border-red-600 text-red-600 hover:bg-red-50 text-[10px] h-8" 
                                    disabled={selectedIds.length === 0}
                                    onClick={() => handleActionSelected('reject')}
                                >
                                    Tolak Terpilih
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="border-orange-600 text-orange-600 hover:bg-orange-50 text-[10px] h-8" 
                                    disabled={selectedIds.length === 0}
                                    onClick={() => handleActionSelected('revision')}
                                >
                                    Revisi Terpilih
                                </Button>
                                <Button 
                                    className="bg-emerald-700 hover:bg-emerald-800 min-w-[120px] text-[10px] h-8 font-bold" 
                                    disabled={selectedIds.length === 0}
                                    onClick={handleApproveSelected}
                                >
                                    {actionType === 'request_fund' ? `Request Fund (${selectedIds.length})` : `Setujui Terpilih (${selectedIds.length})`}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}
