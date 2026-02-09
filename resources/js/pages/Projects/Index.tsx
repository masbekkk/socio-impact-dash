import React from 'react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import StatusBadge from '@/components/StatusBadge'
import { Head, Link, router } from '@inertiajs/react'
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
import { Search, Plus, Filter, MoreHorizontal, Eye, Edit, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pencil, Trash2, CheckCircle2, X, FileText, Cpu, BarChart3, Users, Globe, HeartHandshake, Layers, Building, Wallet } from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProjectsIndex({ projects, filters, divisions }: { projects: any, filters?: any, divisions?: any[] }) {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Proyek', href: '/projects' },
  ];

  const projectList = projects.data || [];
  const meta = projects;
  const [search, setSearch] = React.useState(filters?.search || '');

  // Delete Dialog & Toast State
  const [projectToDelete, setProjectToDelete] = React.useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });

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

  const executeDelete = () => {
    setIsDeleteDialogOpen(false);
    setToast({ show: true, message: 'Proyek berhasil dihapus.', type: 'success' });
    setProjectToDelete(null);
    // In real app: router.delete(...) or reload data
  };

  // Debounce search
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search !== (filters?.search || '')) {
        router.get('/projects',
          { search: search, per_page: meta.per_page, status: filters?.status, division: filters?.division },
          { preserveState: true, replace: true }
        );
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleFilterChange = (key: string, value: string) => {
    router.get('/projects',
      {
        search: search,
        per_page: meta.per_page,
        status: key === 'status' ? value : filters?.status,
        division: key === 'division' ? value : filters?.division
      },
      { preserveState: true }
    );
  };

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Proyek" />
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-8 py-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyek</h1>
          <p className="text-muted-foreground text-sm md:text-base">Kelola semua proyek, pantau progress dan budget.</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)] transition-transform hover:scale-105 active:scale-95 shadow-sm">
          <Plus className="h-4 w-4" />
          Proyek Baru
        </Button>
      </CardContent>

      <Card className="mx-4 md:mx-8 mb-8 border-none rounded-xl overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4 px-4 md:px-8">
          <CardTitle className="text-base font-normal hidden md:block">Daftar Proyek</CardTitle>
          <div className="flex w-full md:w-auto items-center gap-2">
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

            <div className="flex-none">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={filters?.status || filters?.division ? "default" : "outline"} className="gap-2 px-3 sm:px-4">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleFilterChange('status', 'all')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('status', 'active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterChange('status', 'proposal')}>
                    Proposal
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Divisi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleFilterChange('division', 'all')}>
                    All Division
                  </DropdownMenuItem>
                  {(divisions || []).map((div: any) => (
                    <DropdownMenuItem key={div.id} onClick={() => handleFilterChange('division', div.name)}>
                      {div.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 md:px-8">

          {/* MOBILE VIEW (CARDS) */}
          <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
            {projectList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-md">Belum ada proyek.</div>
            ) : (
              projectList.map((p: any) => (
                <Card key={p.id} className="overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                        <p className="text-xs text-muted-foreground">{p.code}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Client</p>
                        <p className="font-medium truncate">{p.client}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Divisi</p>
                        <p className="font-medium truncate">{p.division_name || (p.division ? p.division.name : '-')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium text-green-700">
                          {p.budget_total ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.budget_total) : '-'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t flex justify-end gap-2">
                      <Link href={`/projects/${p.slug}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">View Details</Button>
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
                  <TableHead>Divisi</TableHead>
                  <TableHead>PIC / AM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Belum ada proyek. Silakan ajukan proyek baru.
                    </TableCell>
                  </TableRow>
                ) : (
                  projectList.map((p: any) => (
                    <TableRow key={p.id} className="group">
                      <TableCell className="font-medium">{p.code}</TableCell>
                      <TableCell>
                        <div className="font-medium">{p.name}</div>
                      </TableCell>
                      <TableCell>{p.client}</TableCell>
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
                          <span className="text-xs font-medium">PIC: {p.team?.pic || (p.pic ? p.pic.name : '-')}</span>
                          <span className="text-xs text-muted-foreground">AM: {p.team?.am || (p.account_manager ? p.account_manager.name : '-')}</span>
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
                              <Link href={`/projects/${p.slug}`} className="flex items-center cursor-pointer">
                                <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/projects/${p.slug}/edit`} className="flex items-center cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4 text-muted-foreground" /> Edit Project
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/projects/${p.slug}/allowance`} className="flex items-center cursor-pointer">
                                <Wallet className="mr-2 h-4 w-4 text-muted-foreground" /> Allowance
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                              onClick={() => confirmDelete(p)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Project
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
              Showing {meta.from || 0} to {meta.to || 0} of {meta.total} results
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${meta.per_page}`}
                  onValueChange={(value) => {
                    router.get('/projects', { per_page: value, search: filters?.search }, { preserveState: true })
                  }}
                >
                  <SelectTrigger className="w-20 h-8 text-xs" id="rows-per-page">
                    <SelectValue placeholder={meta.per_page} />
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
                Page {meta.current_page} of {meta.last_page}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  disabled={!meta.prev_page_url}
                  onClick={() => router.get(meta.first_page_url)}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  disabled={!meta.prev_page_url}
                  onClick={() => router.get(meta.prev_page_url)}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  disabled={!meta.next_page_url}
                  onClick={() => router.get(meta.next_page_url)}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  disabled={!meta.next_page_url}
                  onClick={() => router.get(meta.last_page_url)}
                >
                  <span className="sr-only">Go to last page</span>
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
