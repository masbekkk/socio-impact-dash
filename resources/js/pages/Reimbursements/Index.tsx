import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
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
import { FileText, Plus, Receipt, Eye, Search, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, ListFilter, Calendar as CalendarIcon, X, MoreHorizontal, Wallet } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import REIMBURSEMENTS_MOCK from './reimbursements.json';
import {
  format,
  startOfMonth,
  endOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

import { DateFilterPresets } from '@/components/DateFilterPresets';

// --- Preset Date Filter Component ---


export default function ReimbursementsIndex() {
  const [activeTab, setActiveTab] = useState('atr');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
  ];

  // Filter logic
  const filteredData = REIMBURSEMENTS_MOCK.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = item.type.toLowerCase() === activeTab;

    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requester.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate =
      (!startDate || item.request_date >= startDate) &&
      (!endDate || item.request_date <= endDate);

    return matchesStatus && matchesType && matchesSearch && matchesDate;
  });

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  function setTypeFilter(arg0: string) {
    throw new Error('Function not implemented.');
  }

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Reimbursement" />
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reimbursement</h1>
            <p className="text-muted-foreground">Pengelolaan ATR (Advance Travel Request) & EER (Employee Expense Report)</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)] transition-transform hover:scale-105 active:scale-95 shadow-sm w-full sm:w-auto">
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
                    Kelola data pengajuan {activeTab.toUpperCase()}.
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="w-full md:w-auto">
                  <TabsList>
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
                      placeholder="Cari ID, Nama..."
                      className="pl-9 h-10 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* --- MOBILE VIEW: Icon Actions (Date & Status) --- */}
                  <div className="flex items-center gap-2 md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className={(startDate || endDate) ? "bg-accent text-accent-foreground border-primary" : ""}>
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-auto p-0 bg-white" align="end">
                        <DateFilterPresets
                          startDate={startDate}
                          endDate={endDate}
                          onSelect={(start, end) => { setStartDate(start); setEndDate(end); }}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className={statusFilter !== 'all' ? "bg-accent text-accent-foreground border-primary" : ""}>
                          <ListFilter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked={statusFilter === 'all'} onCheckedChange={() => setStatusFilter('all')}>All</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={statusFilter === 'submitted'} onCheckedChange={() => setStatusFilter('submitted')}>Submitted</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={statusFilter === 'approved'} onCheckedChange={() => setStatusFilter('approved')}>Approved</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={statusFilter === 'rejected'} onCheckedChange={() => setStatusFilter('rejected')}>Rejected</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={statusFilter === 'draft'} onCheckedChange={() => setStatusFilter('draft')}>Draft</DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* --- DESKTOP VIEW: Full Inputs (Date & Status) --- */}
                  <div className="hidden md:flex items-center gap-2">

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal w-[240px] px-3 border-dashed",
                            !startDate && "text-muted-foreground",
                            (startDate || endDate) && "border-solid bg-emerald-50/50 border-emerald-200 text-emerald-700"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? (
                            endDate ? (
                              <>
                                {format(new Date(startDate), "dd MMM yyyy", { locale: id })} -{" "}
                                {format(new Date(endDate), "dd MMM yyyy", { locale: id })}
                              </>
                            ) : (
                              format(new Date(startDate), "dd MMM yyyy", { locale: id })
                            )
                          ) : (
                            <span>Pilih Rentang Tanggal</span>
                          )}
                          {(startDate || endDate) && (
                            <div className="ml-auto hover:bg-emerald-200 rounded-full p-0.5 transition-colors" role="button" onClick={(e) => { e.stopPropagation(); setStartDate(''); setEndDate(''); }}>
                              <X className="h-3 w-3" />
                            </div>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-auto p-0 bg-white" align="start">
                        <DateFilterPresets
                          startDate={startDate}
                          endDate={endDate}
                          onSelect={(start, end) => { setStartDate(start); setEndDate(end); }}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <div className="flex items-center gap-2">
                          <ListFilter className="h-3.5 w-3.5 text-muted-foreground" />
                          <SelectValue placeholder="Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredData.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Pengajuan</TableHead>

                      <TableHead>Tanggal</TableHead>
                      <TableHead>Pemohon</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Total Biaya</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium font-mono">{item.id}</TableCell>

                        <TableCell>{item.request_date}</TableCell>
                        <TableCell>{item.requester}</TableCell>
                        <TableCell className="max-w-[200px]" title={item.description}>
                          <div className="flex flex-col gap-1">
                            <span className="truncate">{item.description}</span>
                            <div className="flex gap-1">
                              {/* @ts-ignore */}
                              {item.type === 'ATR' && item.details?.urgency === 'urgent' && <Badge variant="destructive" className="h-5 text-[10px] px-1">Urgent</Badge>}
                              {/* @ts-ignore */}
                              {item.type === 'EER' && item.details?.reimbursement_type && <Badge variant="outline" className="h-5 text-[10px] px-1 capitalize">{item.details.reimbursement_type}</Badge>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>Rp {item.amount.toLocaleString('id-ID')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.status === 'approved' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1"><CheckCircle className="h-3 w-3" /> Approved</Badge>}
                            {item.status === 'rejected' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>}
                            {item.status === 'submitted' && <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 gap-1"><Clock className="h-3 w-3" /> Submitted</Badge>}
                            {item.status === 'draft' && <Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" /> Draft</Badge>}
                            {!['approved', 'rejected', 'submitted', 'draft'].includes(item.status) && <Badge variant="secondary" className="gap-1">{item.status}</Badge>}
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
                                <Link
                                  href={`/reimbursements/${(item.requester + '-' + item.type + '-' + item.id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                                  className="cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Detail
                                </Link>
                              </DropdownMenuItem>
                              {item.status === 'submitted' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50"
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setApproveDialogOpen(true);
                                    }}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setRejectDialogOpen(true);
                                    }}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-md border border-dashed flex flex-col items-center gap-2">
                <div className="bg-gray-100 p-3 rounded-full">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <p>Tidak ada data pengajuan yang sesuai dengan filter.</p>
                <Button variant="link" onClick={() => { setStatusFilter('all'); setTypeFilter('all'); setSearchQuery(''); setStartDate(''); setEndDate(''); }} className="text-[var(--sidebar)]">
                  Reset Filter
                </Button>
              </div>
            )}
          </CardContent>
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 ">
              <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
              </div>
              <div className="flex w-full items-center gap-8 lg:w-fit">
                <div className="hidden items-center gap-2 lg:flex">
                  <Label htmlFor="rows-per-page" className="text-sm font-medium">
                    Rows per page
                  </Label>
                  <Select
                    value={`${itemsPerPage}`}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-16 h-8 text-xs" id="rows-per-page">
                      <SelectValue placeholder={itemsPerPage} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-fit items-center justify-center text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden size-8 lg:flex"
                    size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
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
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Konfirmasi Approve
            </DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <>
                  Apakah Anda yakin ingin menyetujui pengajuan <strong>{selectedItem.type}</strong> dengan ID <strong className="font-mono">{selectedItem.id}</strong> dari <strong>{selectedItem.requester}</strong>?
                  <br /><br />
                  Setelah disetujui, pengajuan akan diproses lebih lanjut dan notifikasi akan dikirim ke pemohon.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (selectedItem) {
                  alert(`Approved: ${selectedItem.id}`);
                  setApproveDialogOpen(false);
                  setSelectedItem(null);
                }
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Ya, Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Konfirmasi Reject
            </DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <>
                  Apakah Anda yakin ingin menolak pengajuan <strong>{selectedItem.type}</strong> dengan ID <strong className="font-mono">{selectedItem.id}</strong> dari <strong>{selectedItem.requester}</strong>?
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
            <Button variant="outline" onClick={() => {
              setRejectDialogOpen(false);
              setRejectionReason('');
            }}>
              Batal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectionReason.trim()}
              onClick={() => {
                if (selectedItem && rejectionReason.trim()) {
                  alert(`Rejected: ${selectedItem.id}\nReason: ${rejectionReason}`);
                  setRejectDialogOpen(false);
                  setSelectedItem(null);
                  setRejectionReason('');
                }
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Ya, Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppSidebarLayout>
  );
}
