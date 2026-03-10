import React from 'react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import StatusBadge from '@/components/StatusBadge'
import { Head, Link, router, usePage } from '@inertiajs/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Search, Plus, Filter, MoreHorizontal, Eye, Edit, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pencil, Trash2, CheckCircle2, X, FileText, Cpu, BarChart3, Users, Globe, HeartHandshake, Layers, Building, Wallet } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  SelectValue,
} from "@/components/ui/select"
import { SearchableSelect } from '@/components/SearchableSelect';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateFilterPresets } from '@/components/DateFilterPresets';
import axios from 'axios';

export default function ProjectsIndex({ filters, divisions }: { filters?: any, divisions?: any[] }) {
  const { auth } = usePage().props as any;
  const permissions = auth.permissions || [];
  const canUpdateCode = permissions.includes('create_code_project');

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Proyek', href: '/projects' },
  ];

  const [projects, setProjects] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState<any>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0
  });
  const [loading, setLoading] = React.useState(true);

  const [search, setSearch] = React.useState(filters?.search || '');
  const [startDate, setStartDate] = React.useState(filters?.start_date || '');
  const [endDate, setEndDate] = React.useState(filters?.end_date || '');
  const [status, setStatus] = React.useState(filters?.status || 'all');
  const [division, setDivision] = React.useState(filters?.division || 'all');
  const [perPage, setPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Delete Dialog & Toast State
  const [projectToDelete, setProjectToDelete] = React.useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/projects', {
        params: {
          search,
          status,
          division,
          start_date: startDate,
          end_date: endDate,
          per_page: perPage,
          page: currentPage
        },
      });
      setProjects(response.data.data.data);
      setPagination({
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total,
        from: response.data.data.from,
        to: response.data.data.to,
        prev_page_url: response.data.data.prev_page_url,
        next_page_url: response.data.data.next_page_url,
        first_page_url: response.data.data.first_page_url,
        last_page_url: response.data.data.last_page_url,
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toast Timer
  React.useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const confirmDelete = (project: any) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!projectToDelete) return;
    try {
      await axios.delete(`/api/v1/projects/${projectToDelete.uuid}`);
      setToast({ show: true, message: 'Proyek berhasil dihapus.', type: 'success' });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      setToast({ show: true, message: 'Gagal menghapus proyek.', type: 'error' });
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  // Fetch data on filter change
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, startDate, endDate, status, division, perPage, currentPage]);

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') setStatus(value);
    if (key === 'division') setDivision(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const renderPagination = () => {
    const { current_page, last_page } = pagination;
    const pages = [];
    const delta = 1; // Number of siblings to show on each side

    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 ||
        i === last_page ||
        (i >= current_page - delta && i <= current_page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages.map((page, index) => (
      <Button
        key={index}
        variant={page === current_page ? "default" : "outline"}
        size="icon"
        className={cn(
          "size-8 text-xs",
          page === "..." && "cursor-default hover:bg-transparent border-none shadow-none"
        )}
        onClick={() => typeof page === "number" && setCurrentPage(page)}
        disabled={page === "..."}
      >
        {page}
      </Button>
    ));
  };

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Proyek" />
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-8 py-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyek</h1>
          <p className="text-muted-foreground text-sm md:text-base">Kelola semua proyek, pantau progress dan budget.</p>
        </div>
        <Link href="/projects/create?type=active">
          <Button className="w-full sm:w-auto gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)] transition-transform hover:scale-105 active:scale-95 shadow-sm">
            <Plus className="h-4 w-4" />
            Proyek Baru
          </Button>
        </Link>
      </CardContent>

      <Card className="mx-4 md:mx-8 mb-8 border-none rounded-xl overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4 px-4 md:px-8">
          <CardTitle className="text-base font-normal hidden md:block">Daftar Proyek</CardTitle>
          <div className="flex w-full md:w-auto items-center gap-2 flex-wrap md:flex-nowrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari proyek..."
                className="w-full pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

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
              <SearchableSelect
                options={[
                  { label: 'Semua Divisi', value: 'all' },
                  ...(divisions || []).map((div: any) => ({
                    label: `${div.division_code?.code} - ${div.name}`,
                    value: div.id.toString()
                  }))
                ]}
                value={division}
                onValueChange={(val) => handleFilterChange('division', val)}
                placeholder="Filter Divisi"
                className="w-40"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 md:px-8">

          {/* MOBILE VIEW (CARDS) */}
          <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-md">Belum ada proyek.</div>
            ) : (
              projects.map((p: any) => (
                <Card key={p.id} className="overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                        {p.client_name && (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">
                            <Building className="h-3 w-3" />
                            {p.client_name}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">{p.code}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Divisi</p>
                        <p className="font-medium truncate">{p.division_name || (p.division ? p.division.name : '-')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Nilai Kontrak</p>
                        <p className="font-medium text-green-700">
                          {p.budget_total ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.budget_total) : '-'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t flex justify-end gap-2">
                      <Link href={`/projects/${p.uuid}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">Lihat Detail</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* DESKTOP VIEW (TABLE) */}
          <div className="rounded-md border hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Proyek</TableHead>
                  <TableHead>Client</TableHead>
                  {canUpdateCode && <TableHead>Initial Project</TableHead>}
                  <TableHead>Divisi</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead className="text-right">Nilai Kontrak</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canUpdateCode ? 10 : 9} className="h-24 text-center">
                      Belum ada proyek. Silakan tambah proyek baru.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((p: any) => (
                    <TableRow key={p.id} className="group">
                      <TableCell className="font-medium">{p.code}</TableCell>
                      <TableCell>
                        <div className="font-medium">{p.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground italic">{p.client_name || '-'}</div>
                      </TableCell>
                      {canUpdateCode && (
                        <TableCell>
                          <div className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded inline-block">
                            {p.initial_project || '-'}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        {(() => {
                          const divName = (p.division_name || (p.division ? p.division.name : '')).toLowerCase();
                          let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
                          let Icon = Building;

                          if (divName.includes('tech') || divName.includes('it') || divName.includes('dev')) {
                            badgeStyle = "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
                            Icon = Cpu;
                          } else if (divName.includes('finance') || divName.includes('keuangan')) {
                            badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
                            Icon = BarChart3;
                          } else if (divName.includes('hr') || divName.includes('human') || divName.includes('sdm')) {
                            badgeStyle = "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
                            Icon = Users;
                          } else if (divName.includes('marketing') || divName.includes('sales') || divName.includes('cmo')) {
                            badgeStyle = "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
                            Icon = Globe;
                          } else if (divName.includes('social') || divName.includes('sosial') || divName.includes('impact')) {
                            badgeStyle = "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
                            Icon = HeartHandshake;
                          } else if (divName.includes('ops') || divName.includes('operasional')) {
                            badgeStyle = "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
                            Icon = Layers;
                          }

                          return (
                            <Badge variant="outline" className={`gap-1.5 py-1 px-2.5 font-medium ${badgeStyle}`}>
                              <Icon className="h-3.5 w-3.5" />
                              {p.division_name || (p.division ? p.division.name : '-')}
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium">{(p.creator ? p.creator.name : '-')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs">
                            {p.start_date ? new Date(p.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                          </span>
                          <span className="text-[10px] text-gray-400">s/d</span>
                          <span className="text-xs">
                            {p.end_date ? new Date(p.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {p.budget_total ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(p.budget_total) : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/projects/${p.uuid}`} className="flex items-center cursor-pointer">
                                <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Lihat Detail
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/projects/${p.uuid}/edit`} className="flex items-center cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4 text-muted-foreground" /> Edit Proyek
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                              onClick={() => confirmDelete(p)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus Proyek
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION CONTROLS */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              Menampilkan {pagination.from || 0} sampai {pagination.to || 0} dari {pagination.total} hasil
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Baris per halaman
                </Label>
                <SearchableSelect
                  options={[10, 20, 30, 40, 50].map(s => ({ label: s.toString(), value: s.toString() }))}
                  value={`${pagination.per_page}`}
                  onValueChange={(value) => {
                    setPerPage(parseInt(value));
                    setCurrentPage(1);
                  }}
                  className="w-20 h-8"
                  placeholder={`${pagination.per_page}`}
                />
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium gap-1">
                {renderPagination()}
              </div>
              <div className="ml-auto flex items-center gap-1 lg:ml-0">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={pagination.current_page === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={pagination.current_page === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => setCurrentPage(pagination.last_page)}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Hapus Proyek?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus proyek <strong>{projectToDelete?.name}</strong>? <br />
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={executeDelete}>
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREATE OPTION DIALOG */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Proyek Baru</DialogTitle>
            <DialogDescription>
              Pilih jenis inisiasi proyek yang ingin Anda buat.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Link href="/projects/create?type=proposal" onClick={() => setIsCreateDialogOpen(false)}>
              <div className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-6 hover:border-black hover:bg-gray-50 transition-all text-center h-full flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Proposal Project</h3>
                  <p className="text-xs text-muted-foreground mt-1">Pengajuan proposal.</p>
                </div>
              </div>
            </Link>
            <Link href="/projects/create?type=active" onClick={() => setIsCreateDialogOpen(false)}>
              <div className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-6 hover:border-black hover:bg-gray-50 transition-all text-center h-full flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Active Project</h3>
                  <p className="text-xs text-muted-foreground mt-1">Yang sudah (disetujui)</p>
                </div>
              </div>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-xl rounded-lg p-4 pr-10 min-w-[300px]">
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Trash2 className="h-5 w-5 text-red-600" />
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-900">
                {toast.type === 'success' ? 'Sukses' : 'Info'}
              </span>
              <span className="text-xs text-muted-foreground">{toast.message}</span>
            </div>
            <button
              onClick={() => setToast({ ...toast, show: false })}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </AppSidebarLayout>
  )
}
