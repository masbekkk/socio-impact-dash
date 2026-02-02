import React, { useState, useRef, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import PageHeader from '@/components/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import StatusBadge from '@/components/StatusBadge'
import TimelineList from '@/components/TimelineList'
import BudgetEditor from '@/components/BudgetEditor'
import FileUploadDropzone from '@/components/FileUploadDropzone'
import { Button } from '@/components/ui/button'
import LocationPicker from '@/components/LocationPicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock, Loader2, Loader, Hourglass, AlertCircle, Trash2, X, Pencil, FileText, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
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

  // Tab Handling
  const [activeTab, setActiveTab] = useState('detail');
  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsListRef.current) {
      const container = tabsListRef.current;
      const activeTrigger = container.querySelector(`[data-state="active"]`) as HTMLElement;

      if (activeTrigger) {
        const containerRect = container.getBoundingClientRect();
        const triggerRect = activeTrigger.getBoundingClientRect();

        const scrollLeft = container.scrollLeft + (triggerRect.left - containerRect.left) - (containerRect.width / 2) + (triggerRect.width / 2);

        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  // Dialog & Toast States
  const [isCloseAlertOpen, setIsCloseAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Budget Items State
  const [budgetItems, setBudgetItems] = useState([
    {
      category: 'ATK (Alat Tulis Kantor)',
      subtotal: 2500000,
      icon: '📦',
      items: [
        { id: 1, name: 'Kertas A4 80gsm (Rim)', qty: 10, price: 50000, total: 500000, approvedQty: 10, isApproved: true },
        { id: 2, name: 'Tinta Printer Epson 003 (Set)', qty: 5, price: 400000, total: 2000000, approvedQty: 5, isApproved: true },
      ]
    },
    {
      category: 'Operasional & Transport',
      subtotal: 23000000,
      icon: '🚗',
      items: [
        { id: 3, name: 'Sewa Mobil (Hari)', qty: 7, price: 1000000, total: 7000000, approvedQty: 7, isApproved: false },
        { id: 4, name: 'Uang Saku Tim (Orang/Hari)', qty: 20, price: 300000, total: 6000000, approvedQty: 20, isApproved: false },
        { id: 5, name: 'Akomodasi Hotel (Malam)', qty: 10, price: 1000000, total: 10000000, approvedQty: 10, isApproved: true },
      ]
    }
  ]);

  const toggleBudgetApproval = (catIndex: number, itemId: number) => {
    setBudgetItems(prev => {
      const newItems = [...prev];
      const category = newItems[catIndex];
      const itemIndex = category.items.findIndex(i => i.id === itemId);
      if (itemIndex > -1) {
        category.items[itemIndex].isApproved = !category.items[itemIndex].isApproved;
      }
      return newItems;
    });
  };

  const updateApprovedQty = (catIndex: number, itemId: number, qty: number) => {
    setBudgetItems(prev => {
      const newItems = [...prev];
      const category = newItems[catIndex];
      const itemIndex = category.items.findIndex(i => i.id === itemId);
      if (itemIndex > -1) {
        category.items[itemIndex].approvedQty = qty;
      }
      return newItems;
    });
  };

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
              <Button variant="outline" className="w-full gap-2">
                <Pencil className="h-4 w-4" />
                Edit Project
              </Button>
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
              <Card key={index} className={flow.status === 'pending' ? 'border-yellow-500/50 bg-yellow-50/30' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">{flow.role}</CardTitle>
                    {flow.status === 'approved' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    {flow.status === 'pending' && <Hourglass className="h-5 w-5 text-yellow-600" />}
                    {flow.status === 'waiting' && <Circle className="h-5 w-5 text-gray-300" />}
                  </div>
                  <div className="text-lg font-bold mt-1">{flow.name}</div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`capitalize px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border
                                    ${flow.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                        flow.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {flow.status === 'approved' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {flow.status === 'pending' && <Hourglass className="h-3.5 w-3.5" />}
                      {flow.status === 'waiting' && <Loader className="h-3.5 w-3.5 animate-spin" />}
                      {flow.status === 'pending' ? 'Pending' : flow.status}
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div ref={tabsListRef} className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max md:w-full min-w-full md:min-w-0">
              <TabsTrigger value="detail" className="flex-none md:flex-1 whitespace-nowrap px-4">Detail & SOW</TabsTrigger>
              <TabsTrigger value="timeline" className="flex-none md:flex-1 whitespace-nowrap px-4">Timeline</TabsTrigger>
              <TabsTrigger value="budget" className="flex-none md:flex-1 whitespace-nowrap px-4">Budget</TabsTrigger>
              <TabsTrigger value="docs" className="flex-none md:flex-1 whitespace-nowrap px-4">Dokumen</TabsTrigger>
              <TabsTrigger value="monitoring" className="flex-none md:flex-1 whitespace-nowrap px-4">Monitoring</TabsTrigger>
              <TabsTrigger value="closing" className="flex-none md:flex-1 whitespace-nowrap px-4">Closing</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="detail" className="mt-4">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle>Dokumen Project Initiation (SOW)</CardTitle>
                <CardDescription>Preview dokumen SOW dan file pendukung.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* PDF ATTACHMENT LINK */}
                <div className="mb-6 bg-white p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="bg-red-100 p-2 rounded text-red-600 shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">proposal_kegiatan_v1.pdf</p>
                      <p className="text-xs text-muted-foreground">PDF Document • 2.4 MB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="gap-2 w-full sm:w-auto">
                    <a href="/public/proposal_kegiatan_v1.pdf" target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                      Lihat PDF
                    </a>
                  </Button>
                </div>

                <div className="mt-6 border-t pt-6">
                  <h4 className="font-semibold mb-3 text-sm">Lokasi Pelaksanaan</h4>
                  <div className="border rounded-lg p-4">
                    <LocationPicker
                      initialLat={-6.200000} // Nanti ambil dari props project
                      initialLng={106.816666}
                      initialAddress="Jakarta, Indonesia"
                      readOnly={true}
                    />
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <div className="space-y-6">
              {/* TIMELINE STEPPER PROGRESS */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline Progress</CardTitle>
                  <CardDescription>Status tahapan pelaksanaan proyek saat ini.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-8 mt-2">
                    {/* Progress Bar Background */}
                    <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded -z-10"></div>
                    {/* Active Progress Bar (100% for completed project) */}
                    <div className="absolute top-4 left-0 h-1 bg-green-500 rounded -z-0 transition-all duration-500" style={{ width: '100%' }}></div>

                    <div className="flex justify-between w-full">
                      {[
                        { label: 'Inisiasi', status: 'completed' },
                        { label: 'Closing', status: 'completed' },
                      ].map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 group cursor-default">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white transition-all
                            ${step.status === 'completed' ? 'border-green-500 bg-green-600 text-white' :
                              step.status === 'current' ? 'border-green-500 text-green-600 ring-4 ring-green-100' :
                                'border-gray-300 text-gray-300'}
                          `}>
                            {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                              step.status === 'current' ? <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" /> :
                                <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />
                            }
                          </div>
                          <span className={`text-xs font-medium ${step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DATES ROW */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t mt-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Tanggal Mulai</p>
                      <p className="font-semibold">{project.start_date ? new Date(project.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Estimasi Selesai</p>
                      <p className="font-semibold">{project.end_date ? new Date(project.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="mt-4">
            <Card>
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Estimasi Budget & Approval</CardTitle>
                  <CardDescription>Review dan setujui rincian anggaran proyek.</CardDescription>
                </div>
                <div className="text-left md:text-right w-full md:w-auto bg-green-50 p-3 rounded-lg md:bg-transparent md:p-0 border md:border-none border-green-100">
                  <div className="text-sm font-medium text-muted-foreground">Total Budget</div>
                  <div className="text-2xl font-bold font-mono text-green-700">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(25500000)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">

                {budgetItems.map((category, catIndex) => (
                  <div key={catIndex} className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/40 p-3 px-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        {category.category}
                      </h4>
                      <span className="text-sm font-mono font-medium text-muted-foreground">
                        Subtotal: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(category.subtotal)}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[800px]">
                        <thead className="bg-muted/10 text-xs text-muted-foreground font-semibold">
                          <tr>
                            <th className="p-3 pl-4 text-left w-[35%]">Nama Item</th>
                            <th className="p-3 text-center w-[10%]">Jumlah</th>
                            <th className="p-3 text-right w-[20%]">Harga Satuan</th>
                            <th className="p-3 text-right w-[20%]">Total</th>
                            <th className="p-3 text-center w-[10%]">Jml Disetujui</th>
                            <th className="p-3 text-center w-[5%]">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {category.items.map((item) => (
                            <tr key={item.id} className="group hover:bg-muted/5">
                              <td className="p-3 pl-4 font-medium">{item.name}</td>
                              <td className="p-3 text-center">{item.qty}</td>
                              <td className="p-3 text-right font-mono">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                              </td>
                              <td className="p-3 text-right font-mono font-semibold">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.total)}
                              </td>
                              <td className="p-3 text-center">
                                <Input
                                  type="number"
                                  className="h-8 w-20 text-center mx-auto"
                                  value={item.approvedQty}
                                  onChange={(e) => updateApprovedQty(catIndex, item.id, Number(e.target.value))}
                                />
                              </td>
                              <td className="p-3 text-center">
                                <Button
                                  size="icon"
                                  variant={item.isApproved ? "outline" : "ghost"}
                                  className={`h-8 w-8 transition-colors ${item.isApproved ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100' : 'text-gray-300 hover:text-green-600 hover:bg-green-50'}`}
                                  onClick={() => toggleBudgetApproval(catIndex, item.id)}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

              </CardContent>
              <CardFooter className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t bg-muted/20 p-4">
                <Button variant="outline" className="w-full sm:w-auto">Tolak Semua</Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">Setujui Budget</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Konfirmasi Persetujuan Budget</DialogTitle>
                      <DialogDescription>
                        Anda akan menyetujui estimasi budget proyek ini sebesar <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(25500000)}</strong>.
                        Tindakan ini akan mengunci item budget yang telah disetujui.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                      </DialogClose>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => {/* Handle approval logic here */ }}>
                        Ya, Setujui
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
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
                </div>
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
