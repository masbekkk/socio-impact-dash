import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  MoreHorizontal,
  Eye,
  FileText,
  Plane,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

// Import Mock Data
import MOCK_LEAVES_DATA from './leaves.json';
import MOCK_TRAVELS_DATA from './travels.json';
import MOCK_DETAIL_DATA from './leave-detail.json';

// Types
interface LeaveItem {
  id: string;
  slug?: string;
  type: string;
  leave_type?: string; // For detail data
  start: string;
  end: string;
  duration: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    position: string;
  };
  rejection_reason?: string;
}

interface TravelItem {
  id: string;
  slug?: string;
  destination: string;
  project: string;
  start: string;
  end: string;
  duration: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    position: string;
  };
  transportation: string;
  accommodation: string;
  rejection_reason?: string;
}

export default function LeaveIndex() {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cuti & Dinas', href: '/leaves' },
  ];

  const [activeTab, setActiveTab] = useState('leave');

  // Leave State
  const [leaves, setLeaves] = useState<LeaveItem[]>([]);
  const [leaveSearchQuery, setLeaveSearchQuery] = useState('');
  const [leaveFilterStatus, setLeaveFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [leaveCurrentPage, setLeaveCurrentPage] = useState(1);
  const [leaveItemsPerPage, setLeaveItemsPerPage] = useState(10);

  // Travel State
  const [travels, setTravels] = useState<TravelItem[]>([]);
  const [travelSearchQuery, setTravelSearchQuery] = useState('');
  const [travelFilterStatus, setTravelFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [travelCurrentPage, setTravelCurrentPage] = useState(1);
  const [travelItemsPerPage, setTravelItemsPerPage] = useState(10);

  // Load data
  useEffect(() => {
    // @ts-ignore - Use detail data which has slug field
    const detailData = MOCK_DETAIL_DATA;

    // Separate by type
    // @ts-ignore
    const leaveData = detailData.filter((item: any) => item.type === 'leave');
    // @ts-ignore
    const travelData = detailData.filter((item: any) => item.type === 'travel');

    // @ts-ignore
    setLeaves(leaveData.length > 0 ? leaveData : MOCK_LEAVES_DATA);
    // @ts-ignore
    setTravels(travelData.length > 0 ? travelData : MOCK_TRAVELS_DATA);
  }, []);

  // Leave Filtering & Pagination
  const filteredLeaves = leaves.filter(item => {
    const matchesSearch =
      item.id.toLowerCase().includes(leaveSearchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(leaveSearchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(leaveSearchQuery.toLowerCase()) ||
      item.user.name.toLowerCase().includes(leaveSearchQuery.toLowerCase());

    const matchesStatus = leaveFilterStatus === 'all' || item.status === leaveFilterStatus;

    return matchesSearch && matchesStatus;
  });

  const leaveTotalPages = Math.ceil(filteredLeaves.length / leaveItemsPerPage);
  const paginatedLeaves = filteredLeaves.slice(
    (leaveCurrentPage - 1) * leaveItemsPerPage,
    leaveCurrentPage * leaveItemsPerPage
  );

  // Travel Filtering & Pagination
  const filteredTravels = travels.filter(item => {
    const matchesSearch =
      item.id.toLowerCase().includes(travelSearchQuery.toLowerCase()) ||
      item.destination.toLowerCase().includes(travelSearchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(travelSearchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(travelSearchQuery.toLowerCase()) ||
      item.user.name.toLowerCase().includes(travelSearchQuery.toLowerCase());

    const matchesStatus = travelFilterStatus === 'all' || item.status === travelFilterStatus;

    return matchesSearch && matchesStatus;
  });

  const travelTotalPages = Math.ceil(filteredTravels.length / travelItemsPerPage);
  const paginatedTravels = filteredTravels.slice(
    (travelCurrentPage - 1) * travelItemsPerPage,
    travelCurrentPage * travelItemsPerPage
  );

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Cuti & Dinas" />

      <div className="p-6 md:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manajemen Cuti & Dinas</h1>
            <p className="text-muted-foreground text-sm md:text-base">Kelola pengajuan cuti dan perjalanan dinas Anda.</p>
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)] transition-transform hover:scale-105 active:scale-95 shadow-sm">
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

          {/* LEAVE TAB */}
          <TabsContent value="leave">
            <Card className="border rounded-md">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg">Daftar Pengajuan Cuti</CardTitle>
                  <CardDescription>Riwayat pengajuan cuti tahunan, sakit, dan lainnya.</CardDescription>
                </div>
                <div className="flex w-full md:w-auto items-center gap-2">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari cuti..."
                      className="pl-8 w-full"
                      value={leaveSearchQuery}
                      onChange={(e) => {
                        setLeaveSearchQuery(e.target.value);
                        setLeaveCurrentPage(1);
                      }}
                    />
                  </div>

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
                        <DropdownMenuItem onClick={() => setLeaveFilterStatus('all')} className={leaveFilterStatus === 'all' ? 'bg-accent' : ''}>
                          Semua Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLeaveFilterStatus('pending')} className={leaveFilterStatus === 'pending' ? 'bg-accent' : ''}>
                          Menunggu (Pending)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLeaveFilterStatus('approved')} className={leaveFilterStatus === 'approved' ? 'bg-accent' : ''}>
                          Disetujui (Approved)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLeaveFilterStatus('rejected')} className={leaveFilterStatus === 'rejected' ? 'bg-accent' : ''}>
                          Ditolak (Rejected)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 md:px-8">
                {/* DESKTOP VIEW (TABLE) */}
                <div className="rounded-md border hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Kode & Tanggal</TableHead>
                        <TableHead>Karyawan</TableHead>
                        <TableHead>Jenis Cuti</TableHead>
                        <TableHead>Durasi</TableHead>
                        <TableHead>Keterangan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedLeaves.length > 0 ? paginatedLeaves.map((item) => (
                        <TableRow key={item.id} className="group">
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-sm">{item.id}</span>
                              <span className="text-xs text-muted-foreground">{item.created_at}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{item.user.name}</span>
                              <span className="text-xs text-muted-foreground">{item.user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                              {item.leave_type || item.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-0.5 text-sm">
                              <span className="font-medium">{item.duration}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(item.end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="truncate text-sm text-muted-foreground" title={item.reason}>{item.reason}</div>
                          </TableCell>
                          <TableCell>
                            {/* @ts-ignore */}
                            <StatusBadge status={item.status} />
                            {item.status === 'approved' && item.approver !== '-' && (
                              <div className="text-[10px] text-muted-foreground mt-1">by {item.approver}</div>
                            )}
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
                                  <Link href={`/leaves/${item.slug || item.user.name.toLowerCase().replace(/\s+/g, '-')}`} className="cursor-pointer flex items-center">
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
                            Belum ada data cuti yang ditemukan.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Leave Pagination */}
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                    Showing {(leaveCurrentPage - 1) * leaveItemsPerPage + 1} to {Math.min(leaveCurrentPage * leaveItemsPerPage, filteredLeaves.length)} of {filteredLeaves.length} results
                  </div>
                  <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                      <Label htmlFor="leave-rows-per-page" className="text-sm font-medium">
                        Rows per page
                      </Label>
                      <Select
                        value={`${leaveItemsPerPage}`}
                        onValueChange={(value) => {
                          setLeaveItemsPerPage(Number(value));
                          setLeaveCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-16 h-8 text-xs" id="leave-rows-per-page">
                          <SelectValue placeholder={leaveItemsPerPage} />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                      Page {leaveCurrentPage} of {leaveTotalPages || 1}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                      <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setLeaveCurrentPage(1)}
                        disabled={leaveCurrentPage === 1}
                      >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setLeaveCurrentPage(p => Math.max(1, p - 1))}
                        disabled={leaveCurrentPage === 1}
                      >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setLeaveCurrentPage(p => Math.min(leaveTotalPages, p + 1))}
                        disabled={leaveCurrentPage === leaveTotalPages}
                      >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setLeaveCurrentPage(leaveTotalPages)}
                        disabled={leaveCurrentPage === leaveTotalPages}
                      >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TRAVEL TAB */}
          <TabsContent value="travel">
            <Card className="border rounded-md">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg">Daftar Dinas Luar</CardTitle>
                  <CardDescription>Riwayat pengajuan dinas luar kantor.</CardDescription>
                </div>
                <div className="flex w-full md:w-auto items-center gap-2">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari Dinas ..."
                      className="pl-8 w-full"
                      value={travelSearchQuery}
                      onChange={(e) => {
                        setTravelSearchQuery(e.target.value);
                        setTravelCurrentPage(1);
                      }}
                    />
                  </div>

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
                        <DropdownMenuItem onClick={() => setTravelFilterStatus('all')} className={travelFilterStatus === 'all' ? 'bg-accent' : ''}>
                          Semua Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTravelFilterStatus('pending')} className={travelFilterStatus === 'pending' ? 'bg-accent' : ''}>
                          Menunggu (Pending)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTravelFilterStatus('approved')} className={travelFilterStatus === 'approved' ? 'bg-accent' : ''}>
                          Disetujui (Approved)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTravelFilterStatus('rejected')} className={travelFilterStatus === 'rejected' ? 'bg-accent' : ''}>
                          Ditolak (Rejected)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 md:px-8">
                {/* DESKTOP VIEW (TABLE) */}
                <div className="rounded-md border hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Kode & Tujuan</TableHead>
                        <TableHead>Karyawan</TableHead>
                        <TableHead>Proyek</TableHead>
                        <TableHead>Durasi</TableHead>
                        <TableHead>Keperluan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTravels.length > 0 ? paginatedTravels.map((item) => (
                        <TableRow key={item.id} className="group">
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-sm">{item.destination}</span>
                              <span className="text-xs text-muted-foreground">{item.id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{item.user.name}</span>
                              <span className="text-xs text-muted-foreground">{item.user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{item.project}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-0.5 text-sm">
                              <span className="font-medium">{item.duration}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(item.end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="truncate text-sm text-muted-foreground" title={item.purpose}>{item.purpose}</div>
                          </TableCell>
                          <TableCell>
                            {/* @ts-ignore */}
                            <StatusBadge status={item.status} />
                            {item.status === 'approved' && item.approver !== '-' && (
                              <div className="text-[10px] text-muted-foreground mt-1">by {item.approver}</div>
                            )}
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
                                  <Link href={`/leaves/${item.slug || item.user.name.toLowerCase().replace(/\s+/g, '-')}`} className="cursor-pointer flex items-center">
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
                            Belum ada data perjalanan dinas yang ditemukan.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Travel Pagination */}
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                    Showing {(travelCurrentPage - 1) * travelItemsPerPage + 1} to {Math.min(travelCurrentPage * travelItemsPerPage, filteredTravels.length)} of {filteredTravels.length} results
                  </div>
                  <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                      <Label htmlFor="travel-rows-per-page" className="text-sm font-medium">
                        Rows per page
                      </Label>
                      <Select
                        value={`${travelItemsPerPage}`}
                        onValueChange={(value) => {
                          setTravelItemsPerPage(Number(value));
                          setTravelCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-16 h-8 text-xs" id="travel-rows-per-page">
                          <SelectValue placeholder={travelItemsPerPage} />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                      Page {travelCurrentPage} of {travelTotalPages || 1}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                      <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setTravelCurrentPage(1)}
                        disabled={travelCurrentPage === 1}
                      >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setTravelCurrentPage(p => Math.max(1, p - 1))}
                        disabled={travelCurrentPage === 1}
                      >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setTravelCurrentPage(p => Math.min(travelTotalPages, p + 1))}
                        disabled={travelCurrentPage === travelTotalPages}
                      >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setTravelCurrentPage(travelTotalPages)}
                        disabled={travelCurrentPage === travelTotalPages}
                      >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppSidebarLayout>
  );
}
