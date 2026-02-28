import React, { useState } from 'react';
import axios from 'axios';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Receipt, Eye, Search, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ListFilter, Calendar as CalendarIcon, X, MoreHorizontal, Wallet, ArrowUpDown, ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateFilterPresets } from '@/components/DateFilterPresets';

interface ReimbursementApproval {
  id: number;
  status: string;
  notes: string | null;
  approved_at: string | null;
  approver: { id: number; name: string } | null;
}

interface Reimbursement {
  id: number;
  code: string;
  type: string;
  eer_type: string | null;
  status: string;
  amount: string;
  usage_plan: string | null;
  urgency: string | null;
  created_at: string;
  user: { id: number; name: string } | null;
  project: { id: number; name: string; code: string } | null;
  approvals: ReimbursementApproval[];
}

interface PaginatedData {
  data: Reimbursement[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

interface Filters {
  type: string;
  status: string;
  search: string;
  start_date: string;
  end_date: string;
  sort_by: string;
  sort_dir: string;
  per_page: number;
}

interface Props {
  reimbursements: PaginatedData;
  filters: Filters;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200', icon: FileText },
  submitted: { label: 'Diajukan', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200', icon: Clock },
  head_approved: { label: 'Disetujui Head', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200', icon: CheckCircle },
  finance_approved: { label: 'Disetujui Finance', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200', icon: DollarSign },
  transferred: { label: 'Sudah Ditransfer', className: 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200', icon: CheckCircle },
  rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200', icon: XCircle },
};

export default function ReimbursementsIndex({ reimbursements, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search ?? '');
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
  ];

  const navigate = (params: Record<string, string | number | undefined>) => {
    const query: Record<string, string> = {};

    const merged = { ...filters, ...params };

    if (merged.type) query.type = String(merged.type);
    if (merged.status) query.status = String(merged.status);
    if (merged.search) query.search = String(merged.search);
    if (merged.start_date) query.start_date = String(merged.start_date);
    if (merged.end_date) query.end_date = String(merged.end_date);
    if (merged.sort_by && merged.sort_by !== 'created_at') query.sort_by = String(merged.sort_by);
    if (merged.sort_dir && merged.sort_dir !== 'desc') query.sort_dir = String(merged.sort_dir);
    if (merged.per_page && merged.per_page !== 10) query.per_page = String(merged.per_page);
    if (params.page && Number(params.page) > 1) query.page = String(params.page);

    router.get('/reimbursements', query, { preserveState: true, preserveScroll: true });
  };

  const handleSearch = () => {
    navigate({ search: searchQuery, page: 1 });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSort = (column: string) => {
    const newDir = filters.sort_by === column && filters.sort_dir === 'asc' ? 'desc' : 'asc';
    navigate({ sort_by: column, sort_dir: newDir, page: 1 });
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (filters.sort_by !== column) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />;
    return filters.sort_dir === 'asc'
      ? <ArrowUp className="ml-1 h-3 w-3" />
      : <ArrowDown className="ml-1 h-3 w-3" />;
  };

  const activeTab = filters.type || 'all';
  const { data, current_page, last_page, total, from, to } = reimbursements;

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Reimbursement" />
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reimbursement</h1>
            <p className="text-muted-foreground">Pengelolaan ATR, EER & Allowance</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-sidebar text-white hover:bg-sidebar/90 transition-transform hover:scale-105 active:scale-95 shadow-sm w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Buat Pengajuan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Pilih Jenis Pengajuan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/reimbursements/create/atr" className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" /> Pengajuan ATR
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/reimbursements/create/eer" className="cursor-pointer">
                    <Receipt className="mr-2 h-4 w-4" /> Pengajuan EER
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/reimbursements/create/allowance" className="cursor-pointer">
                    <Wallet className="mr-2 h-4 w-4" /> Pengajuan Allowance
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                <div className="space-y-1">
                  <CardTitle>Daftar Pengajuan</CardTitle>
                  <CardDescription>
                    {total} pengajuan ditemukan{activeTab !== 'all' ? ` (${activeTab.toUpperCase()})` : ''}.
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Tabs value={activeTab} onValueChange={(v) => navigate({ type: v === 'all' ? '' : v, page: 1 })} className="w-full md:w-auto">
                  <TabsList>
                    <TabsTrigger value="all">Semua</TabsTrigger>
                    <TabsTrigger value="atr">ATR</TabsTrigger>
                    <TabsTrigger value="eer">EER</TabsTrigger>
                    <TabsTrigger value="allowance">Allowance</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex flex-1 items-center gap-2 w-full md:w-auto justify-end">
                  <div className="relative flex-1 md:w-auto min-w-[140px] max-w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Cari kode, nama..."
                      className="pl-9 h-10 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                    />
                  </div>

                  {/* MOBILE: Icon Actions */}
                  <div className="flex items-center gap-2 md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className={(filters.start_date || filters.end_date) ? "bg-accent text-accent-foreground border-primary" : ""}>
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-auto p-0 bg-white" align="end">
                        <DateFilterPresets
                          startDate={filters.start_date}
                          endDate={filters.end_date}
                          onSelect={(start, end) => navigate({ start_date: start, end_date: end, page: 1 })}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className={filters.status ? "bg-accent text-accent-foreground border-primary" : ""}>
                          <ListFilter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked={!filters.status} onCheckedChange={() => navigate({ status: '', page: 1 })}>Semua</DropdownMenuCheckboxItem>
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                          <DropdownMenuCheckboxItem key={key} checked={filters.status === key} onCheckedChange={() => navigate({ status: key, page: 1 })}>{cfg.label}</DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* DESKTOP: Full Inputs */}
                  <div className="hidden md:flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal w-[240px] px-3 border-dashed",
                            !filters.start_date && "text-muted-foreground",
                            (filters.start_date || filters.end_date) && "border-solid bg-emerald-50/50 border-emerald-200 text-emerald-700"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.start_date ? (
                            filters.end_date ? (
                              <>
                                {format(new Date(filters.start_date), "dd MMM yyyy", { locale: localeId })} -{" "}
                                {format(new Date(filters.end_date), "dd MMM yyyy", { locale: localeId })}
                              </>
                            ) : (
                              format(new Date(filters.start_date), "dd MMM yyyy", { locale: localeId })
                            )
                          ) : (
                            <span>Pilih Rentang Tanggal</span>
                          )}
                          {(filters.start_date || filters.end_date) && (
                            <div className="ml-auto hover:bg-emerald-200 rounded-full p-0.5 transition-colors" role="button" onClick={(e) => { e.stopPropagation(); navigate({ start_date: '', end_date: '', page: 1 }); }}>
                              <X className="h-3 w-3" />
                            </div>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-auto p-0 bg-white" align="start">
                        <DateFilterPresets
                          startDate={filters.start_date}
                          endDate={filters.end_date}
                          onSelect={(start, end) => navigate({ start_date: start, end_date: end, page: 1 })}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Select value={filters.status || 'all'} onValueChange={(v) => navigate({ status: v === 'all' ? '' : v, page: 1 })}>
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <ListFilter className="h-3.5 w-3.5 text-muted-foreground" />
                          <SelectValue placeholder="Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                          <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {data.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button className="flex items-center font-medium" onClick={() => handleSort('code')}>
                          Kode <SortIcon column="code" />
                        </button>
                      </TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>
                        <button className="flex items-center font-medium" onClick={() => handleSort('created_at')}>
                          Tanggal <SortIcon column="created_at" />
                        </button>
                      </TableHead>
                      <TableHead>Pemohon</TableHead>
                      <TableHead>Proyek</TableHead>
                      <TableHead>
                        <button className="flex items-center font-medium" onClick={() => handleSort('amount')}>
                          Total Biaya <SortIcon column="amount" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button className="flex items-center font-medium" onClick={() => handleSort('status')}>
                          Status <SortIcon column="status" />
                        </button>
                      </TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item) => {
                      const statusCfg = STATUS_CONFIG[item.status] ?? { label: item.status, className: 'bg-gray-100 text-gray-600', icon: Clock };
                      const StatusIcon = statusCfg.icon;

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium font-mono text-sm">{item.code}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{item.type}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(item.created_at), 'dd MMM yyyy', { locale: localeId })}
                          </TableCell>
                          <TableCell>{item.user?.name ?? '-'}</TableCell>
                          <TableCell className="max-w-[150px]">
                            <span className="truncate block">{item.project?.name ?? '-'}</span>
                          </TableCell>
                          <TableCell className="font-medium">
                            Rp {parseFloat(item.amount).toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1.5">
                              <Badge className={cn('gap-1 w-fit', statusCfg.className)}>
                                <StatusIcon className="h-3 w-3" />
                                {statusCfg.label}
                              </Badge>
                              {item.approvals && item.approvals.length > 0 && (
                                <div className="mt-1 flex flex-col gap-1 inline-flex">
                                  {item.approvals.map((approval) => (
                                    <div key={approval.id} className="text-xs flex items-center gap-1.5">
                                      {approval.status === 'approved' ? (
                                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                      ) : (
                                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                                      )}
                                      <span className={cn(
                                        "whitespace-nowrap",
                                        approval.status === 'approved' ? "text-green-700 font-medium" : "text-red-700 font-medium"
                                      )}>
                                        {approval.status === 'approved' ? 'Disetujui' : 'Ditolak'}{' '}
                                        <span className="font-normal text-muted-foreground">{approval.approver?.name}</span>
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/reimbursements/${item.code}`} className="cursor-pointer">
                                    <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-md border border-dashed flex flex-col items-center gap-2">
                <div className="bg-gray-100 p-3 rounded-full">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <p>Tidak ada data pengajuan yang sesuai dengan filter.</p>
                <Button variant="link" onClick={() => router.get('/reimbursements')} className="text-sidebar">
                  Reset Filter
                </Button>
              </div>
            )}
          </CardContent>

          {/* Pagination */}
          {total > 0 && (
            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                Menampilkan {from} sampai {to} dari {total} hasil
              </div>
              <div className="flex w-full items-center gap-8 lg:w-fit">
                <div className="hidden items-center gap-2 lg:flex">
                  <Label htmlFor="rows-per-page" className="text-sm font-medium">Baris per halaman</Label>
                  <Select
                    value={`${filters.per_page}`}
                    onValueChange={(value) => navigate({ per_page: Number(value), page: 1 })}
                  >
                    <SelectTrigger className="w-16 h-8 text-xs" id="rows-per-page">
                      <SelectValue placeholder={filters.per_page} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 30, 50].map((size) => (
                        <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-fit items-center justify-center text-sm font-medium">
                  Halaman {current_page} dari {last_page}
                </div>
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                  <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" disabled={current_page === 1} onClick={() => navigate({ page: 1 })}>
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="size-8" size="icon" disabled={current_page === 1} onClick={() => navigate({ page: current_page - 1 })}>
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="size-8" size="icon" disabled={current_page === last_page} onClick={() => navigate({ page: current_page + 1 })}>
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="hidden size-8 lg:flex" size="icon" disabled={current_page === last_page} onClick={() => navigate({ page: last_page })}>
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Approve Dialog */}
      {/* <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Konfirmasi Approve
            </DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <>
                  Apakah Anda yakin ingin menyetujui pengajuan <strong>{selectedItem.type.toUpperCase()}</strong> dengan kode <strong className="font-mono">{selectedItem.code}</strong> dari <strong>{selectedItem.user?.name}</strong>?
                  <br /><br />
                  Setelah disetujui, pengajuan akan diproses lebih lanjut.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)} disabled={actionLoading}>Batal</Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={actionLoading}
              onClick={async () => {
                if (selectedItem) {
                  setActionLoading(true);
                  try {
                    await axios.patch(`/api/v1/reimbursements/${selectedItem.code}/status`, { action: 'approved' });
                    setApproveDialogOpen(false);
                    setSelectedItem(null);
                    router.reload({ only: ['reimbursements'] });
                  } catch {
                    alert('Gagal menyetujui pengajuan.');
                  } finally {
                    setActionLoading(false);
                  }
                }
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {actionLoading ? 'Memproses...' : 'Ya, Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Reject Dialog */}
      {/* <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Konfirmasi Reject
            </DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <>
                  Apakah Anda yakin ingin menolak pengajuan <strong>{selectedItem.type.toUpperCase()}</strong> dengan kode <strong className="font-mono">{selectedItem.code}</strong> dari <strong>{selectedItem.user?.name}</strong>?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="rejection_reason_index">Alasan Penolakan <span className="text-red-500">*</span></Label>
            <Textarea
              id="rejection_reason_index"
              placeholder="Jelaskan alasan penolakan pengajuan ini..."
              className="min-h-[100px] resize-none"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Alasan penolakan akan dikirim ke pemohon</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectDialogOpen(false); setRejectionReason(''); }} disabled={actionLoading}>Batal</Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectionReason.trim() || actionLoading}
              onClick={async () => {
                if (selectedItem && rejectionReason.trim()) {
                  setActionLoading(true);
                  try {
                    await axios.patch(`/api/v1/reimbursements/${selectedItem.code}/status`, {
                      action: 'rejected',
                      notes: rejectionReason,
                    });
                    setRejectDialogOpen(false);
                    setSelectedItem(null);
                    setRejectionReason('');
                    router.reload({ only: ['reimbursements'] });
                  } catch {
                    alert('Gagal menolak pengajuan.');
                  } finally {
                    setActionLoading(false);
                  }
                }
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {actionLoading ? 'Memproses...' : 'Ya, Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </AppSidebarLayout>
  );
}
