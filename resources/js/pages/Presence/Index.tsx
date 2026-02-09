import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Camera, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Eye, Building, Calendar, Download, FileText, CheckCircle, XCircle } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { Label } from '@/components/ui/label';

// --- Types ---
interface Project {
  id: string;
  name: string;
}

interface PresenceLog {
  id: string;
  date: string;
  time: string;
  project: string;
  activity: string;
  notes?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  user: {
    name: string;
    email: string;
  };
}

// --- Mock Data ---
import MOCK_LOGS_DATA from './presence_logs.json';

const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Socio Impact Development' },
  { id: '2', name: 'Community Outreach Phase 1' },
  { id: '3', name: 'Education Fund Assessment' },
];

export default function PresenceIndex() {
  // --- State ---
  const [breadcrumbs] = useState([
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Presensi', href: '/presences' },
  ]);

  const [logs, setLogs] = useState<PresenceLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    activity: '',
    notes: '',
    lat: '',
    lng: '',
    image: null as File | null,
  });

  // Action Dialog State
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'approve' | 'reject' | null; log: PresenceLog | null }>({
    open: false,
    type: null,
    log: null
  });

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // --- Effects ---
  useEffect(() => {
    // Load mock data
    // @ts-ignore
    setLogs(MOCK_LOGS_DATA);
  }, []);

  // --- Handlers ---
  const handleFetchLocation = () => {
    setLoadingLocation(true);
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser ini.');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          lat: pos.coords.latitude.toString(),
          lng: pos.coords.longitude.toString()
        }));
        setLoadingLocation(false);
      },
      (err) => {
        alert('Gagal mengambil lokasi: ' + err.message);
        setLoadingLocation(false);
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = () => {
    // Here you would normally send formData to your backend via Inertia or Axios
    if (!formData.project_id || !formData.activity || !formData.lat || !formData.image) {
      alert('Harap lengkapi semua data wajib (Project, Kegiatan, Lokasi, dan Foto).');
      return;
    }

    alert('Data siap dikirim ke Backend:\n' + JSON.stringify({
      ...formData,
      image_name: formData.image.name
    }, null, 2));

    setIsDialogOpen(false);
    // Reset form or optimistically update UI here
  };

  const openActionDialog = (type: 'approve' | 'reject', log: PresenceLog) => {
    setActionDialog({ open: true, type, log });
  };

  const handleActionConfirm = () => {
    if (!actionDialog.log || !actionDialog.type) return;
    alert(`Konfirmasi: ${actionDialog.type === 'approve' ? 'Menyetujui' : 'Menolak'} presensi untuk ${actionDialog.log.user.name}`);
    setActionDialog({ open: false, type: null, log: null });
    // In real app, make API call here
  };

  // --- Filtering & Pagination Logic (Frontend Mock) ---
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Presensi" />

      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-8 py-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Presensi Harian</h1>
          <p className="text-muted-foreground text-sm md:text-base">Catat kehadiran, lokasi, dan aktivitas harian Anda.</p>
        </div>

        <Link href="/presences/create">
          <Button className="w-full sm:w-auto gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)] transition-transform hover:scale-105 active:scale-95 shadow-sm">
            <PlusIcon className="h-4 w-4" />
            Check-In Baru
          </Button>
        </Link>
      </CardContent>

      <Card className="mx-4 md:mx-8 mb-8 border-none rounded-xl overflow-hidden shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4 px-4 md:px-8">
          <CardTitle className="text-base font-normal hidden md:block">Riwayat Presensi</CardTitle>
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari presensi..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex-none">
              <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => alert('Mendownload rekap presensi (CSV)...')}>
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>
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
                  <DropdownMenuLabel>Filter Harian</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Hari Ini</DropdownMenuItem>
                  <DropdownMenuItem>Minggu Ini</DropdownMenuItem>
                  <DropdownMenuItem>Bulan Ini</DropdownMenuItem>
                  <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus('all')} className={filterStatus === 'all' ? 'bg-accent' : ''}>
                    Semua Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('pending')} className={filterStatus === 'pending' ? 'bg-accent' : ''}>
                    Menunggu (Pending)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('approved')} className={filterStatus === 'approved' ? 'bg-accent' : ''}>
                    Disetujui (Approved)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('rejected')} className={filterStatus === 'rejected' ? 'bg-accent' : ''}>
                    Ditolak (Rejected)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 md:px-8">
          {/* MOBILE VIEW (CARDS) */}
          <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
            {paginatedLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-md border-dashed">Belum ada data presensi.</div>
            ) : (
              paginatedLogs.map((log) => (
                <Card key={log.id} className="overflow-hidden border shadow-none">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-sm">{log.date}</h3>
                        <p className="text-xs text-muted-foreground">{log.time}</p>
                      </div>
                      <StatusBadge status={log.status} />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground mb-0.5">Karyawan</p>
                        <div className="font-medium">{log.user?.name || 'Unknown User'}</div>
                      </div>
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground mb-0.5">Proyek</p>
                        <div className="font-medium">{log.project}</div>
                      </div>
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground mb-0.5">Kegiatan</p>
                        <div className="line-clamp-2 text-muted-foreground">{log.activity}</div>
                      </div>
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground mb-0.5">Lokasi</p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${log.location.lat},${log.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline"
                        >
                          <MapPin className="h-3 w-3" />
                          {log.location.lat.toFixed(4)}, {log.location.lng.toFixed(4)}
                        </a>
                      </div>
                    </div>

                    <div className="pt-2 border-t flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="w-full h-8 text-xs">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* DESKTOP VIEW (TABLE) */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[180px]">Tanggal & Waktu</TableHead>
                  <TableHead>Karyawan</TableHead>
                  <TableHead>Proyek</TableHead>
                  <TableHead className="hidden md:table-cell">Kegiatan</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right w-[80px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Belum ada data presensi yang ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id} className="group">
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{log.date}</span>
                          <span className="text-xs text-muted-foreground">{log.time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{log.user?.name || 'Unknown User'}</span>
                          <span className="text-xs text-muted-foreground">{log.user?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.project}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[300px]">
                        <div className="truncate text-muted-foreground" title={log.activity}>
                          {log.activity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px] font-normal gap-1 hover:bg-muted cursor-pointer" asChild>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${log.location.lat},${log.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MapPin className="h-3 w-3" />
                            {log.location.lat.toFixed(4)}, {log.location.lng.toFixed(4)}
                          </a>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* @ts-ignore */}
                        <StatusBadge status={log.status} />
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
                              {/* Using name/slug in URL as requested */}
                              <Link href={`/presences/${log.user.name.split(' ').join('-').toLowerCase()}`} className="cursor-pointer flex items-center">
                                <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Lihat Detail
                              </Link>
                            </DropdownMenuItem>
                            {log.status === 'pending' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openActionDialog('approve', log)} className="text-emerald-600 focus:text-emerald-600 cursor-pointer">
                                  <CheckCircle className="mr-2 h-4 w-4" /> Setujui
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openActionDialog('reject', log)} className="text-rose-600 focus:text-rose-600 cursor-pointer">
                                  <XCircle className="mr-2 h-4 w-4" /> Tolak
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Pagination */}
        <div className="flex items-center justify-between px-8 py-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} results
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
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {currentPage} of {totalPages || 1}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog(prev => ({ ...prev, open: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionDialog.type === 'approve' ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-600" />
              )}
              Konfirmasi Aksi
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin {actionDialog.type === 'approve' ? 'menyetujui' : 'menolak'} presensi dari <b>{actionDialog.log?.user.name}</b>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Proyek: {actionDialog.log?.project} <br />
              Waktu: {actionDialog.log?.date} {actionDialog.log?.time}
            </p>
            {actionDialog.type === 'reject' && (
              <Textarea placeholder="Alasan penolakan (opsional)" className="mt-4" />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(prev => ({ ...prev, open: false }))}>
              Batal
            </Button>
            <Button
              variant={actionDialog.type === 'approve' ? 'default' : 'destructive'}
              onClick={handleActionConfirm}
              className="gap-2"
            >
              {actionDialog.type === 'approve' ? (
                <><CheckCircle className="h-4 w-4" /> Setujui Presensi</>
              ) : (
                <><XCircle className="h-4 w-4" /> Tolak Presensi</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppSidebarLayout>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
