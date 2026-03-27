import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Item {
    id: number;
    code: string;
    user?: { name: string };
    project?: { name: string };
    amount?: string | number;
    type?: string;
    reason?: string;
    start_date?: string;
    end_date?: string;
    [key: string]: any;
}

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
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>Pilih pengajuan yang akan disetujui secara massal.</DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-auto my-4 border rounded-md">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox 
                                        checked={selectedIds.length === items.length && items.length > 0} 
                                        onCheckedChange={toggleSelectAll} 
                                    />
                                </TableHead>
                                <TableHead className="font-bold">Kode</TableHead>
                                <TableHead className="font-bold">Pengaju</TableHead>
                                <TableHead className="font-bold">Projek</TableHead>
                                {type === 'reimbursement' ? (
                                    <>
                                        <TableHead className="font-bold">Tipe</TableHead>
                                        <TableHead className="text-right font-bold">Nominal</TableHead>
                                    </>
                                ) : (
                                    <>
                                        <TableHead className="font-bold">Tipe</TableHead>
                                        <TableHead className="font-bold">Durasi</TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length > 0 ? items.map((item) => (
                                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell>
                                        <Checkbox 
                                            checked={selectedIds.includes(item.id)} 
                                            onCheckedChange={() => toggleSelectItem(item.id)} 
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium text-xs">{item.code}</TableCell>
                                    <TableCell className="text-xs">{item.user?.name || '-'}</TableCell>
                                    <TableCell className="text-xs">{item.project?.name || '-'}</TableCell>
                                    {type === 'reimbursement' ? (
                                        <>
                                            <TableCell className="uppercase text-[10px] font-bold">
                                                <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">{item.type}</span>
                                            </TableCell>
                                            <TableCell className="text-right text-xs font-semibold">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(item.amount || 0))}
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="uppercase text-[10px] font-bold">
                                                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{item.type || 'Leave'}</span>
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {formatDate(item.start_date)} - {formatDate(item.end_date)}
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Tidak ada data pengajuan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter className="flex flex-row justify-between sm:justify-between items-center gap-4">
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
