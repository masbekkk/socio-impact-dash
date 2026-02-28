import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, router } from '@inertiajs/react';
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
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateFilterPresets } from '@/components/DateFilterPresets';
import { X as XIcon } from 'lucide-react';

// --- Types ---
interface PresenceData {
  id: number;
  date: string;
  check_in_at: string;
  status: string;
  project: {
    name: string;
  } | null;
  activity: string;
  check_in_latitude: string;
  check_in_longitude: string;
  user: {
    name: string;
    email: string;
  };
  check_out_at: string | null;
  check_out_latitude: string | null;
  check_out_longitude: string | null;
  notes: string | null;
}

interface PaginatedPresences {
  data: PresenceData[];
  links: { url: string | null; label: string; active: boolean }[];
  current_page: number;
  from: number;
  to: number;
  total: number;
  last_page: number;
}

interface PageProps {
  presences: PaginatedPresences;
  todayPresence: PresenceData | null;
}

export default function PresenceIndex({ presences, todayPresence }: PageProps) {
  // --- State ---
  const [breadcrumbs] = useState([
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Presensi', href: '/presences' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

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
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: 'approve' | 'reject' | null; log: PresenceData | null }>({
    open: false,
    type: null,
    log: null
  });

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Checkout State
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    latitude: '',
    longitude: '',
    notes: ''
  });

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

  const handleFetchCheckoutLocation = () => {
    setLoadingLocation(true);
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser ini.');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCheckoutData(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString()
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

    // Reset form or optimistically update UI here
  };

  const handleCheckoutSubmit = () => {
    if (!checkoutData.latitude) {
      alert('Harap ambil lokasi terlebih dahulu.');
      return;
    }

    router.post(route('presences.checkout'), checkoutData, {
      onSuccess: () => {
        setIsCheckoutDialogOpen(false);
        setCheckoutData({ latitude: '', longitude: '', notes: '' });
      }
    });
  };

  const openActionDialog = (type: 'approve' | 'reject', log: PresenceData) => {
    setActionDialog({ open: true, type, log });
  };

  const handleActionConfirm = () => {
    if (!actionDialog.log || !actionDialog.type) return;
    alert(`Konfirmasi: ${actionDialog.type === 'approve' ? 'Menyetujui' : 'Menolak'} presensi untuk ${actionDialog.log.user.name}`);
    setActionDialog({ open: false, type: null, log: null });
    // In real app, make API call here
  };

  // Use backend pagination data
  const paginatedLogs = presences.data;
  const totalPages = presences.last_page;
  const currentPage = presences.current_page;
  const totalLogs = presences.total;

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Presensi" />

      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-8 py-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Presensi Di Luar Kantor</h1>
          <p className="text-muted-foreground text-sm md:text-base">Catat kehadiran, lokasi, dan aktivitas di luar kantor.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          {!todayPresence ? (
            <Link href="/presences/create">
              <Button className="w-full sm:w-auto gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)] transition-transform hover:scale-105 active:scale-95 shadow-sm">
                <PlusIcon className="h-4 w-4" />
                Check-In Baru
              </Button>
            </Link>
          ) : !todayPresence.check_out_at ? (
            <Button
              onClick={() => {
                setIsCheckoutDialogOpen(true);
                handleFetchCheckoutLocation();
              }}
              className="w-full sm:w-auto gap-2 bg-rose-600 text-white hover:bg-rose-700 transition-transform hover:scale-105 active:scale-95 shadow-sm"
            >
              <XIcon className="h-4 w-4" />
              Check-Out Sekarang
            </Button>
          ) : (
            <div className="flex flex-col items-end">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 py-1.5 px-3">
                <CheckCircle className="h-4 w-4 mr-2" />
                Selesai Kerja Hari Ini
              </Badge>
              <span className="text-[10px] text-muted-foreground mt-1">Check-out jam {format(new Date(todayPresence.check_out_at), 'HH:mm')}</span>
            </div>
          )}
        </div>
      </CardContent>

      <Card className="mx-4 md:mx-8 mb-8 border-none rounded-xl overflow-hidden shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4 px-4 md:px-8">
          <CardTitle className="text-base font-normal hidden md:block">Riwayat Presensi</CardTitle>
          <div className="flex w-full md:w-auto items-center gap-2 flex-wrap md:flex-nowrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari presensi..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
            </div>

            {/* Date Range Filter */}
            {/* Date Range Filter */}
            {/* Desktop View */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-[240px] px-3 border-dashed hidden md:flex",
                    !startDate && "text-muted-foreground",
                    (startDate || endDate) && "border-solid bg-emerald-50/50 border-emerald-200 text-emerald-700"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
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
                      <XIcon className="h-3 w-3" />
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

            {/* Mobile View Icon */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className={cn("md:hidden", (startDate || endDate) ? "bg-accent text-accent-foreground border-primary" : "")}>
                  <Calendar className="h-4 w-4" />
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
                    Menunggu
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('approved')} className={filterStatus === 'approved' ? 'bg-accent' : ''}>
                    Disetujui
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('rejected')} className={filterStatus === 'rejected' ? 'bg-accent' : ''}>
                    Ditolak
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
                        <p className="text-xs text-muted-foreground">{log.check_in_at ? format(new Date(log.check_in_at), 'HH:mm') : '-'}</p>
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
                        <div className="font-medium">{log.project?.name || '-'}</div>
                      </div>
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground mb-0.5">Kegiatan</p>
                        <div className="line-clamp-2 text-muted-foreground">{log.activity}</div>
                      </div>
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground mb-0.5">Lokasi</p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${log.check_in_latitude},${log.check_in_longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline"
                        >
                          <MapPin className="h-3 w-3" />
                          {Number(log.check_in_latitude || 0).toFixed(4)}, {Number(log.check_in_longitude || 0).toFixed(4)}
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
                          <span className="text-xs text-muted-foreground">{log.check_in_at ? format(new Date(log.check_in_at), 'HH:mm') : '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{log.user?.name || 'Unknown User'}</span>
                          <span className="text-xs text-muted-foreground">{log.user?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.project?.name || '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[300px]">
                        <div className="truncate text-muted-foreground" title={log.activity}>
                          {log.activity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px] font-normal gap-1 hover:bg-muted cursor-pointer" asChild>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${log.check_in_latitude},${log.check_in_longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MapPin className="h-3 w-3" />
                            {Number(log.check_in_latitude || 0).toFixed(4)}, {Number(log.check_in_longitude || 0).toFixed(4)}
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
            Menampilkan {presences.from || 0} sampai {presences.to || 0} dari {totalLogs} hasil
          </div>
          <div className="flex w-full items-center gap-2 lg:w-fit overflow-x-auto pb-2">
            {presences.links.map((link, i) => (
              <Link key={i} href={link.url || '#'} preserveScroll preserveState>
                <Button
                  variant={link.active ? "default" : "outline"}
                  size="sm"
                  disabled={!link.url}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              </Link>
            ))}
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
              Proyek: {actionDialog.log?.project?.name || '-'} <br />
              Waktu: {actionDialog.log?.date} {actionDialog.log?.check_in_at ? format(new Date(actionDialog.log.check_in_at), 'HH:mm') : ''}
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

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check-Out Kerja</DialogTitle>
            <DialogDescription>
              Pastikan Anda sudah menyelesaikan pekerjaan sebelum melakukan check-out.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>Lokasi Check-out</Label>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md border border-dashed">
                {loadingLocation ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> <span className="text-sm italic">Mengambil lokasi...</span></>
                ) : checkoutData.latitude ? (
                  <><MapPin className="h-4 w-4 text-emerald-600" /> <span className="text-sm font-mono">{Number(checkoutData.latitude).toFixed(6)}, {Number(checkoutData.longitude).toFixed(6)}</span></>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleFetchCheckoutLocation}>Ambil Lokasi</Button>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="checkout-notes">Catatan (Opsional)</Label>
              <Textarea
                id="checkout-notes"
                placeholder="Apa yang telah diselesaikan hari ini?"
                value={checkoutData.notes}
                onChange={(e) => setCheckoutData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>Batal</Button>
            <Button
              onClick={handleCheckoutSubmit}
              disabled={!checkoutData.latitude || loadingLocation}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Confirm Check-Out
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
