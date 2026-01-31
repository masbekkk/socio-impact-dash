import React, { useState } from 'react'
import { Link } from '@inertiajs/react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import PageHeader from '@/components/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import StatusBadge from '@/components/StatusBadge'
import TimelineList from '@/components/TimelineList'
import BudgetEditor from '@/components/BudgetEditor'
import FileUploadDropzone from '@/components/FileUploadDropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock, AlertCircle, Trash2, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"

export default function ProjectsShow({ project }: any) {
  // Use data from backend passed via Inertia
  const mock = {
    slug: project.slug,
    code: project.code,
    name: project.name,
    client: project.client,
    status: project.status,
    budget: project.budget_total,
    division: project.division_name || project.division_code,
    sow: project.sow
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Proyek', href: '/projects' },
    { title: 'Detail Proyek', href: '#' },
  ];

  // Issues Data from JSON
  const mockIssues = project.issues || [];
  const hasOpenIssues = mockIssues.some((i: any) => i.status === 'open');
  // Local state to simulate status change without backend refresh
  const [currentStatus, setCurrentStatus] = useState(mock.status);
  const isReadyForClosing = currentStatus === 'active' && !hasOpenIssues;

  // Dialog & Toast States
  const [isCloseAlertOpen, setIsCloseAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  React.useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleCloseProject = () => {
    setIsCloseAlertOpen(false);
    setCurrentStatus('completed');
    // Simulate updating mock object for UI
    mock.status = 'completed';
    setToast({ show: true, message: 'Proyek berhasil ditutup (Closing Success).', type: 'success' });
  };

  const handleDeleteProject = () => {
    setIsDeleteAlertOpen(false);
    setToast({ show: true, message: 'Proyek berhasil dihapus.', type: 'success' }); // Red toast logic can be handled in UI
    setTimeout(() => {
      // Dummy Redirect
      window.location.href = '/projects';
    }, 1500);
  };

  // Derive Workflow Status from Team Data (Dummy Logic for UI showcase)
  // In real app, this would come from a separate 'workflows' relation
  const workflows = [
    { role: 'Account Manager', name: project.team?.am || 'Unassigned', status: 'approved', date: project.start_date },
    { role: 'Head Implementation', name: project.team?.head || 'Unassigned', status: currentStatus === 'draft' ? 'pending' : 'approved', date: currentStatus !== 'draft' ? project.start_date : '-' },
    { role: 'PIC Project', name: project.team?.pic || 'Unassigned', status: (currentStatus === 'completed' || isReadyForClosing) ? 'approved' : 'waiting', date: '-' },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-4 md:p-8 pb-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{mock.name}</h1>
            <Badge variant="outline">{mock.code}</Badge>
          </div>
          <p className="text-muted-foreground">Client: {mock.client} • {mock.division}</p>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-2 w-full md:w-auto">
          <StatusBadge status={currentStatus} />

          <div className="flex gap-2 w-full md:w-auto">
            <Link href={`/projects/${mock.slug || project.slug}/edit`} className="flex-1 md:flex-none">
              <Button variant="outline" className="w-full">Edit Project</Button>
            </Link>
            <Button variant="destructive" size="icon" onClick={() => setIsDeleteAlertOpen(true)} title="Hapus Proyek">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>


      <div className="p-4 md:p-8 pt-0 space-y-8">

        {/* APPROVAL WORKFLOW SECTION */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Status Persetujuan (Approval)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workflows.map((flow, index) => (
              <Card key={index} className={flow.status === 'pending' ? 'border-blue-500/50 bg-blue-50/50' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">{flow.role}</CardTitle>
                    {flow.status === 'approved' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    {flow.status === 'pending' && <Clock className="h-5 w-5 text-blue-600 animate-pulse" />}
                    {flow.status === 'waiting' && <Circle className="h-5 w-5 text-gray-300" />}
                  </div>
                  <div className="text-lg font-bold mt-1">{flow.name}</div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium 
                                    ${flow.status === 'approved' ? 'bg-green-100 text-green-700' :
                        flow.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {flow.status === 'pending' ? 'Menunggu Approval' : flow.status}
                    </span>
                    <span className="text-muted-foreground text-xs">{flow.date}</span>
                  </div>
                </CardContent>
                {flow.status === 'pending' && (
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">Approve Sekarang</Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* DETAILS TABS */}
        <Tabs defaultValue="detail" className="w-full">
          <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-auto md:w-full min-w-full md:min-w-0">
              <TabsTrigger value="detail" className="flex-1 whitespace-nowrap px-4">Detail & SOW</TabsTrigger>
              <TabsTrigger value="timeline" className="flex-1 whitespace-nowrap px-4">Timeline</TabsTrigger>
              <TabsTrigger value="budget" className="flex-1 whitespace-nowrap px-4">Budget</TabsTrigger>
              <TabsTrigger value="docs" className="flex-1 whitespace-nowrap px-4">Dokumen</TabsTrigger>
              <TabsTrigger value="monitoring" className="flex-1 whitespace-nowrap px-4">Monitoring</TabsTrigger>
              <TabsTrigger value="closing" className="flex-1 whitespace-nowrap px-4">Closing</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="detail" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Scope of Work (SOW)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-relaxed">{mock.sow}</p>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 text-sm">Menunggu Full Approval</h4>
                    <p className="text-yellow-700 text-xs mt-1">Anda dapat mengedit SOW setelah semua pihak menyetujui inisiasi proyek ini.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-gray-50 text-center">
              <Clock className="h-10 w-10 text-gray-300 mb-3" />
              <h3 className="font-semibold text-gray-900">Timeline Belum Tersedia</h3>
              <p className="text-sm text-gray-500 max-w-sm mt-1">Timeline dapat diisi setelah Approval fase selesai dan SOW disepakati.</p>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Estimasi Budget</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-gray-900">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(mock.budget)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Budget bersifat estimasi awal. Detail pos anggaran dibuka setelah approval.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded p-4">
                <h4 className="font-medium mb-2">Proposal</h4>
                <div className="text-sm text-blue-600 underline cursor-pointer">proposal_kegiatan_v1.pdf</div>
              </div>
              <div className="border rounded p-4 opacity-50 bg-gray-50">
                <h4 className="font-medium mb-2">Kontrak / SPK</h4>
                <div className="text-sm text-gray-400">Belum diupload</div>
              </div>
            </div>
          </TabsContent>

          {/* MONITORING TAB - GAMBAR 2 */}
          <TabsContent value="monitoring" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Laporan Bulanan & Monitoring</CardTitle>
                <CardDescription>Update progres, kendala, dan status proyek.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Update Bulan Ini</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Kendala / Isu (Jika ada)</label>
                      <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Jelaskan kendala yang dialami..."></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status Project Saat Ini</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="on_track">On Track (Sesuai Jadwal)</option>
                        <option value="risk">At Risk (Berisiko Terlambat)</option>
                        <option value="delayed">Delayed (Terlambat)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Riwayat Laporan</h4>
                  {(project.monitoring_history && project.monitoring_history.length > 0) ? (
                    <div className="space-y-3">
                      {project.monitoring_history.map((history: any, idx: number) => (
                        <div key={idx} className="flex flex-col gap-1 p-3 border rounded-lg bg-background">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{history.month}</span>
                            <Badge variant={
                              history.status === 'on_track' ? 'outline' :
                                history.status === 'risk' ? 'secondary' : 'destructive'
                            } className={
                              history.status === 'on_track' ? 'text-green-600 border-green-600 bg-green-50' : ''
                            }>
                              {history.status === 'on_track' ? 'On Track' :
                                history.status === 'risk' ? 'At Risk' : 'Delayed'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 border-l-2 border-gray-200 pl-2 mt-1">
                            {history.notes}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
                      Belum ada laporan monitoring dibuat.
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button>Submit Laporan Bulanan</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* CLOSING TAB - GAMBAR 3 */}
          <TabsContent value="closing" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Penutupan Proyek (Closing)</CardTitle>
                <CardDescription>Formulir finalisasi dan realisasi anggaran.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Issues Recap Section */}
                <div>
                  <h4 className="font-semibold mb-3">Rekapitulasi Kendala (Issues)</h4>
                  <div className="space-y-2 mb-6">
                    {mockIssues.map((issue: any) => (
                      <div key={issue.id} className="flex items-start justify-between p-3 border rounded-lg bg-background">
                        <div>
                          <p className="font-medium text-sm">{issue.title}</p>
                          <p className="text-xs text-muted-foreground">{issue.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Tanggal: {issue.date}</p>
                        </div>
                        <Badge variant={issue.status === 'resolved' ? 'outline' : 'destructive'}>
                          {issue.status === 'resolved' ? 'Resolved' : 'Open'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {hasOpenIssues && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <span>Terdapat kendala yang masih <b>OPEN</b>. Harap selesaikan sebelum closing.</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Realisasi Anggaran (Final)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm font-semibold text-muted-foreground">Rp</span>
                      <input
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono font-bold text-green-700"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Input manual total pengeluaran riil.</p>
                  </div>
                  {/* <div className="space-y-2">
                    <label className="text-sm font-medium">Sisa Anggaran</label>
                    <div className="text-xl font-bold font-mono text-gray-600">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(mock.budget)}
                    </div>
                  </div> */}
                </div>

                {/* <div className="space-y-2">
                  <label className="text-sm font-medium">File Laporan Akhir (Final Report)</label>
                  <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <p className="text-sm font-medium">Upload Laporan Akhir</p>
                    <p className="text-xs text-muted-foreground">PDF, Max 20MB</p>
                  </div>
                </div> */}
              </CardContent>
              <CardFooter className="justify-between flex-col md:flex-row gap-4">
                {!isReadyForClosing ? (
                  <div className="text-sm text-amber-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {hasOpenIssues ? 'Selesaikan semua Issue sebelum closing.' : 'Closing hanya bisa dilakukan jika status "Active".'}
                  </div>
                ) : (
                  <div className="text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Proyek siap untuk ditutup.
                  </div>
                )}

                <Button
                  variant="destructive"
                  disabled={!isReadyForClosing}
                  onClick={() => setIsCloseAlertOpen(true)}
                >
                  Tutup Proyek (Closing)
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

      </div>

      {/* CLOSE PROJECT DIALOG */}
      <Dialog open={isCloseAlertOpen} onOpenChange={setIsCloseAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penutupan Proyek</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin melakukan <strong>Closing</strong> untuk proyek ini? <br />
              Pastikan semua laporan dan administrasi sudah selesai. Status akan berubah menjadi Completed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloseAlertOpen(false)}>Batal</Button>
            <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleCloseProject}>
              Ya, Tutup Proyek
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE PROJECT DIALOG */}
      <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Hapus Proyek?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data proyek beserta semua riwayat akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAlertOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CUSTOM TOAST (SONNER STYLE) */}
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
                {toast.type === 'success' ? 'Sukses' : 'Dihapus'}
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
