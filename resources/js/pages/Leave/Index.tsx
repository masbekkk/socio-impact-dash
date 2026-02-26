import React, { useState, useEffect, useCallback } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  MoreHorizontal, Eye, FileText, Plane, Calendar, Search, Filter,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, ArrowUpDown,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateFilterPresets } from '@/components/DateFilterPresets';
import { X as XIcon } from 'lucide-react';
import axios from 'axios';

interface LeaveItem {
  id: number;
  code: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  phone: string | null;
  destination: string | null;
  lokasi: string | null;
  reason: string | null;
  attachment_path: string | null;
  project: { id: number; code: string; name: string } | null;
  replacement_pic: { id: number; name: string; email: string } | null;
  user: { id: number; name: string; email: string } | null;
  approvals: {
    id: number;
    role: string;
    status: string;
    notes: string | null;
    approved_at: string | null;
    approver: { id: number; name: string; email: string } | null;
  }[];
  created_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

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

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Superadmin Approved', value: 'superadmin_approved' },
  { label: 'Head Approved', value: 'head_approved' },
  { label: 'HR Approved', value: 'hr_approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Draft', value: 'draft' },
];

function durationDays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function useLeaveData(typeFilter: string | null) {
  const [data, setData] = useState<LeaveItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: 10, total: 0, from: null, to: null });
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_dir: sortDir,
      };
      if (typeFilter) params.type = typeFilter;
      if (search) params.search = search;
      if (status !== 'all') params.status = status;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await axios.get('/api/v1/leaves', { params });
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, sortBy, sortDir, search, status, startDate, endDate, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
    setPage(1);
  };

  return {
    data, meta, loading,
    search, setSearch: (v: string) => { setSearch(v); setPage(1); },
    status, setStatus: (v: string) => { setStatus(v); setPage(1); },
    startDate, setStartDate, endDate, setEndDate,
    setDateRange: (s: string, e: string) => { setStartDate(s); setEndDate(e); setPage(1); },
    clearDates: () => { setStartDate(''); setEndDate(''); setPage(1); },
    page, setPage,
    perPage, setPerPage: (v: number) => { setPerPage(v); setPage(1); },
    sortBy, sortDir, toggleSort,
  };
}

export default function LeaveIndex() {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cuti & Dinas', href: '/leaves' },
  ];

  const [activeTab, setActiveTab] = useState('leave');

  // Use a combined type filter: leave tab shows non-travel, travel tab shows travel only
  // We filter "travel" type for travel tab. For leave, we exclude travel.
  // Since backend only supports single type filter, we'll use it for travel tab
  // and leave the leave tab without type filter, then exclude travel in the query.
  // Actually, let's use null for leave tab (show all except travel) and 'travel' for travel tab.
  // We need to update the backend... but the simpler approach: leave tab = no type filter (show all),
  // travel tab = type=travel. The leave tab will also show travel items though.
  // Better: use 'leave' as a special type filter that the backend interprets as "not travel".

  const leave = useLeaveData('leave');
  const travel = useLeaveData('travel');

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Cuti & Dinas" />

      <div className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manajemen Cuti & Dinas</h1>
            <p className="text-muted-foreground text-sm md:text-base">Kelola pengajuan cuti dan perjalanan dinas Anda.</p>
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-sidebar text-white hover:bg-sidebar/90 transition-transform hover:scale-105 active:scale-95 shadow-sm">
                  <FileText className="h-4 w-4" />
                  Buat Pengajuan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Pilih Jenis Pengajuan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/leaves/create" className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" /> Pengajuan Cuti
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/leaves/create-travel" className="cursor-pointer">
                    <Plane className="mr-2 h-4 w-4" /> Dinas Luar
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="leave" className="gap-2">
              <Calendar className="h-4 w-4" /> Riwayat Cuti
            </TabsTrigger>
            <TabsTrigger value="travel" className="gap-2">
              <Plane className="h-4 w-4" /> Dinas Luar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leave">
            <LeaveTable
              title="Daftar Pengajuan Cuti"
              description="Riwayat pengajuan cuti tahunan, sakit, dan lainnya."
              hook={leave}
              isTravel={false}
            />
          </TabsContent>

          <TabsContent value="travel">
            <LeaveTable
              title="Daftar Dinas Luar"
              description="Riwayat pengajuan dinas luar kantor."
              hook={travel}
              isTravel={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppSidebarLayout>
  );
}

interface LeaveTableProps {
  title: string;
  description: string;
  hook: ReturnType<typeof useLeaveData>;
  isTravel: boolean;
}

function LeaveTable({ title, description, hook, isTravel }: LeaveTableProps) {
  const { data, meta, loading, search, setSearch, status, setStatus, startDate, endDate, setDateRange, clearDates, page, setPage, perPage, setPerPage, sortBy, toggleSort } = hook;

  const SortHeader = ({ col, children }: { col: string; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort(col)}>
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={cn("h-3 w-3", sortBy === col ? "text-foreground" : "text-muted-foreground/50")} />
      </div>
    </TableHead>
  );

  return (
    <Card className="border rounded-md">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2 flex-wrap md:flex-nowrap">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari..." className="pl-8 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {/* Date Range Filter Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn(
                "justify-start text-left font-normal w-[240px] px-3 border-dashed hidden md:flex",
                !startDate && "text-muted-foreground",
                (startDate || endDate) && "border-solid bg-emerald-50/50 border-emerald-200 text-emerald-700"
              )}>
                <Calendar className="mr-2 h-4 w-4" />
                {startDate ? (
                  endDate ? (
                    <>{format(new Date(startDate), "dd MMM yyyy", { locale: localeId })} - {format(new Date(endDate), "dd MMM yyyy", { locale: localeId })}</>
                  ) : format(new Date(startDate), "dd MMM yyyy", { locale: localeId })
                ) : <span>Pilih Rentang Tanggal</span>}
                {(startDate || endDate) && (
                  <div className="ml-auto hover:bg-emerald-200 rounded-full p-0.5 transition-colors" role="button" onClick={(e) => { e.stopPropagation(); clearDates(); }}>
                    <XIcon className="h-3 w-3" />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto p-0 bg-white" align="start">
              <DateFilterPresets startDate={startDate} endDate={endDate} onSelect={(s, e) => setDateRange(s, e)} />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range Filter Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className={cn("md:hidden", (startDate || endDate) ? "bg-accent text-accent-foreground border-primary" : "")}>
                <Calendar className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto p-0 bg-white" align="end">
              <DateFilterPresets startDate={startDate} endDate={endDate} onSelect={(s, e) => setDateRange(s, e)} />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <div className="flex-none">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {STATUS_OPTIONS.map(opt => (
                  <DropdownMenuItem key={opt.value} onClick={() => setStatus(opt.value)} className={status === opt.value ? 'bg-accent' : ''}>
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 md:px-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Memuat data...</span>
          </div>
        )}

        {!loading && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <SortHeader col="code">{isTravel ? 'Kode & Tujuan' : 'Kode & Tanggal'}</SortHeader>
                  <TableHead>Karyawan</TableHead>
                  <SortHeader col="type">{isTravel ? 'Proyek' : 'Jenis Cuti'}</SortHeader>
                  <SortHeader col="start_date">Durasi</SortHeader>
                  <TableHead>Keterangan</TableHead>
                  <SortHeader col="status">Status</SortHeader>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? data.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {isTravel ? (
                          <>
                            <span className="font-medium text-sm">{item.destination ?? '-'}</span>
                            <span className="text-xs text-muted-foreground">{item.code}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-medium text-sm">{item.code}</span>
                            <span className="text-xs text-muted-foreground">{item.created_at ? format(new Date(item.created_at), 'dd MMM yyyy', { locale: localeId }) : '-'}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.user?.name ?? '-'}</span>
                        <span className="text-xs text-muted-foreground">{item.user?.email ?? '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isTravel ? (
                        <div className="text-sm font-medium">{item.project?.name ?? '-'}</div>
                      ) : (
                        <Badge variant="outline" className="font-normal border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                          {LEAVE_TYPE_LABELS[item.type] ?? item.type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5 text-sm">
                        <span className="font-medium">{durationDays(item.start_date, item.end_date)} Hari</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(item.start_date), 'dd MMM', { locale: localeId })} - {format(new Date(item.end_date), 'dd MMM yyyy', { locale: localeId })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate text-sm text-muted-foreground" title={item.reason ?? ''}>{item.reason ?? '-'}</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={['head_approved', 'hr_approved', 'superadmin_approved'].includes(item.status) ? 'approved' : item.status} />
                      {item.approvals?.length > 0 && (() => {
                        const last = item.approvals[item.approvals.length - 1];
                        return last.approver ? (
                          <div className="text-[10px] text-muted-foreground mt-1">
                            by {last.approver.name} - {last.role}
                          </div>
                        ) : null;
                      })()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/leaves/${item.code}`} className="cursor-pointer flex items-center">
                              <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Lihat Detail
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Belum ada data yang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!loading && meta.total > 0 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              Showing {meta.from} to {meta.to} of {meta.total} results
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label className="text-sm font-medium">Rows per page</Label>
                <Select value={`${perPage}`} onValueChange={(v) => setPerPage(Number(v))}>
                  <SelectTrigger className="w-16 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 50].map(s => <SelectItem key={s} value={`${s}`}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {meta.current_page} of {meta.last_page}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPage(Math.min(meta.last_page, page + 1))} disabled={page === meta.last_page}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => setPage(meta.last_page)} disabled={page === meta.last_page}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
