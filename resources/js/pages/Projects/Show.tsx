import React, { useState, useRef, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import StatusBadge from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import LocationPicker from '@/components/LocationPicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Loader, Hourglass, AlertCircle, Trash2, X, Pencil, FileText, Eye, Download, MapPin, Plus, Calendar, User, Upload } from 'lucide-react'
import MoneyInput from '@/components/MoneyInput'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  const { auth } = usePage().props as any;
  // const currentUserRole = auth.user?.role || 'Admin'; 
  const currentUserRole = 'Admin'; 

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

  // Dummy Multi-Locations (Showcase)
  const locations = project.locations && project.locations.length > 0 ? project.locations : [
    { id: '1', lat: -6.175392, lng: 106.827153, address: 'Monas, Gambir, Jakarta Pusat' },
    { id: '2', lat: -6.211544, lng: 106.845172, address: 'Tebet, Jakarta Selatan' },
    { id: '3', lat: -6.121435, lng: 106.774124, address: 'PIK, Jakarta Utara' },
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
  const [approvalNote, setApprovalNote] = useState("");
  const [isApproveAlertOpen, setIsApproveAlertOpen] = useState(false);
  const [isRevisionAlertOpen, setIsRevisionAlertOpen] = useState(false);
  const [selectedLocIndex, setSelectedLocIndex] = useState(0);
  const [isSubmitReportAlertOpen, setIsSubmitReportAlertOpen] = useState(false);

  const handleApproveAction = () => {
    setIsApproveAlertOpen(false);
    setToast({ show: true, message: 'Project berhasil di-approve.', type: 'success' });
  };

  const handleRevisionAction = () => {
    setIsRevisionAlertOpen(false);
    setToast({ show: true, message: 'Permintaan revisi dikirim.', type: 'success' });
  };

  // CLOSING STATE
  const [closingForm, setClosingForm] = useState({
    realization: 0,
    files: {
      laporan: null,
      bast: null,
      penagihan: null,
      lesson_learn: null
    }
  });

  // MONITORING STATE (Inline Form)
  const [monitoringList, setMonitoringList] = useState(project.monitoring_history || [
    {
      id: 1,
      date: "2025-01-25",
      uploader: "Siti Aminah (Head)",
      status: "approved",
      notes: "Project berjalan lancar sesuai timeline. Tidak ada kendala berarti.",
      files: [
        { title: "Laporan Mingguan Jan W4.pdf", size: "1.2 MB" },
        { title: "Dokumentasi Kegiatan.zip", size: "4.5 MB" }
      ]
    }
  ]);
  const [reportForm, setReportForm] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: '',
    files: [{ id: 1, title: '' }]
  });

  const addReportFileRow = () => {
    setReportForm({ ...reportForm, files: [...reportForm.files, { id: Date.now(), title: '' }] });
  };
  const removeReportFileRow = (id: number) => {
    setReportForm({ ...reportForm, files: reportForm.files.filter(f => f.id !== id) });
  };
  const handleReportFileChange = (id: number, field: string, value: string) => {
    setReportForm({
      ...reportForm,
      files: reportForm.files.map(f => f.id === id ? { ...f, [field]: value } : f)
    });
  };

  const submitReport = () => {
    const newReport = {
      id: Date.now(),
      date: reportForm.date,
      uploader: "Anda (Head)",
      status: "pending", // Default pending approval
      notes: reportForm.notes,
      files: reportForm.files.map(f => ({ title: f.title ? `${f.title}.pdf` : 'Untitled.pdf', size: 'Unknown' }))
    };
    setMonitoringList([newReport, ...monitoringList]);
    setToast({ show: true, message: 'Laporan berhasil ditambahkan.', type: 'success' });
    setReportForm({ date: new Date().toISOString().split('T')[0], notes: '', files: [{ id: Date.now(), title: '' }] });
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
    mock.status = 'completed';
    setToast({ show: true, message: 'Proyek berhasil ditutup (Closing Success).', type: 'success' });
  };

  const handleDeleteProject = () => {
    setIsDeleteAlertOpen(false);
    setToast({ show: true, message: 'Proyek berhasil dihapus.', type: 'success' });
    setTimeout(() => {
      window.location.href = '/projects';
    }, 1500);
  };

  // Approval Workflow Logic
  const workflows = [
    { role: 'Admin', name: 'Admin Project', status: 'approved', date: project.start_date, note: 'Dokumen administrasi dan kelengkapan proposal sudah valid.' },
    { role: 'Finance', name: 'Finance Team', status: currentStatus === 'draft' ? 'pending' : 'approved', date: currentStatus !== 'draft' ? project.start_date : '-', note: currentStatus !== 'draft' ? 'Budget tersedia dan sesuai dengan alokasi Q1.' : '' },
    { role: 'Direktur', name: 'Direktur', status: (currentStatus === 'completed' || isReadyForClosing) ? 'approved' : 'waiting', date: '-', note: (currentStatus === 'completed' || isReadyForClosing) ? 'Project berjalan baik, hasil sesuai target.' : '-' },
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

        {/* APPROVAL WORKFLOW */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Status Persetujuan (Approval)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workflows.map((flow, index) => {
              const isMyRole = currentUserRole === flow.role;
              return (
                <Card
                  key={index}
                  className={`transition-all duration-200 ${isMyRole
                    ? 'bg-[var(--sidebar)] text-white border-[var(--sidebar)] shadow-md'
                    : flow.status === 'pending'
                      ? 'border-yellow-500/50 bg-yellow-50/30'
                      : ''
                    }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className={`text-sm font-medium ${isMyRole ? 'text-white/80' : 'text-muted-foreground'}`}>{flow.role}</CardTitle>
                      {flow.status === 'approved' && <CheckCircle2 className={`h-5 w-5 ${isMyRole ? 'text-white' : 'text-green-600'}`} />}
                      {flow.status === 'pending' && <Hourglass className={`h-5 w-5 ${isMyRole ? 'text-white' : 'text-yellow-600'}`} />}
                      {flow.status === 'waiting' && <Circle className={`h-5 w-5 ${isMyRole ? 'text-white/50' : 'text-gray-300'}`} />}
                    </div>
                    <div className={`text-lg font-bold mt-1 ${isMyRole ? 'text-white' : 'text-[var(--sidebar)]'}`}>{flow.name}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className={`capitalize px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border
                                      ${isMyRole
                          ? 'bg-white/20 text-white border-white/20'
                          : flow.status === 'approved'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : flow.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}>
                        {flow.status === 'approved' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {flow.status === 'pending' && <Hourglass className="h-3.5 w-3.5" />}
                        {flow.status === 'waiting' && <Loader className="h-3.5 w-3.5 animate-spin" />}
                        {flow.status === 'pending' ? 'Pending' : flow.status}
                      </span>
                      <span className={`text-xs ${isMyRole ? 'text-white/80' : 'text-muted-foreground'}`}>{flow.date}</span>
                    </div>

                    {/* Notes Section */}
                    <div className={`p-3 rounded-lg border text-sm mt-3 ${isMyRole ? 'bg-white/10 border-white/20' : 'bg-white/50 border-gray-100'}`}>
                      <p className={`text-xs font-semibold mb-1 flex items-center gap-1 ${isMyRole ? 'text-white/90' : 'text-muted-foreground'}`}>
                        <FileText className="h-3 w-3" /> Catatan:
                      </p>
                      {flow.note && flow.note !== '-' ? (
                        <p className={`italic ${isMyRole ? 'text-white' : 'text-gray-700'}`}>"{flow.note}"</p>
                      ) : (
                        <p className={`italic text-xs ${isMyRole ? 'text-white/50' : 'text-gray-400'}`}>Belum ada catatan.</p>
                      )}
                    </div>
                  </CardContent>
                  {flow.status === 'pending' && (
                    <CardFooter>
                      <Button className={`w-full ${isMyRole ? 'bg-white text-[var(--sidebar)] hover:bg-gray-100' : 'bg-blue-600 hover:bg-blue-700'}`} size="sm">Approve Sekarang</Button>
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Approval Notes Input (Below Cards) */}
          <div className="mt-6 p-4 border rounded-xl bg-white shadow-sm">
            <Label htmlFor="approval-note" className="text-sm font-semibold mb-2 block">Catatan Approval / Evaluasi Project</Label>
            <span className="text-xs text-muted-foreground ml-1">
              *Catatan wajib diisi jika memilih Revisi.
            </span>
            <Textarea
              id="approval-note"
              placeholder="Tulis catatan, arahan, atau evaluasi terkait persetujuan proyek ini..."
              className="min-h-[100px] resize-y bg-gray-50 focus:bg-white transition-colors"
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
            />
            <div className="flex justify-end items-center mt-3">
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsRevisionAlertOpen(true)} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Revisi
                </Button>
                <Button onClick={() => setIsApproveAlertOpen(true)} className="bg-[#00763c] hover:bg-[#005f30] text-white shadow-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div ref={tabsListRef} className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max md:w-full min-w-full md:min-w-0">
              <TabsTrigger value="detail" className="flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[#00763c] data-[state=active]:text-white">Detail & Proposal</TabsTrigger>
              <TabsTrigger value="timeline" className="flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[#00763c] data-[state=active]:text-white">Timeline</TabsTrigger>
              <TabsTrigger value="budget" className="flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[#00763c] data-[state=active]:text-white">Budget</TabsTrigger>
              <TabsTrigger value="monitoring" className="flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[#00763c] data-[state=active]:text-white">Monitoring</TabsTrigger>
              <TabsTrigger value="closing" className="flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[#00763c] data-[state=active]:text-white">Closing</TabsTrigger>
            </TabsList>
          </div>

          {/* DETAIL TAB (Merged Proposal + Location) */}
          <TabsContent value="detail" className="mt-4">
            <div className="space-y-6">

              {/* PROPOSAL SECTION */}
              <Card className="bg-muted/30 border-none shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>{currentStatus === 'active' ? 'Dokumen Scope of Work (SOW)' : 'Dokumen Proposal Project'}</CardTitle>
                  <CardDescription>{currentStatus === 'active' ? 'Dokumen SOW utama yang telah disepakati.' : 'Dokumen proposal yang diajukan ke klien.'}</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="bg-white p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="bg-orange-50 p-2.5 rounded-lg text-orange-600 shrink-0 border border-orange-100">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{currentStatus === 'active' ? 'SOW_Main_Document.pdf' : 'Proposal_Project_Full.pdf'}</h4>
                      </div>
                    </div>
                    <Button className="gap-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs shadow-sm">
                      <Eye className="h-3.5 w-3.5" />
                      Preview PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* LOCATION SECTION (Merged) */}
              {/* Locations Section */}
              <Card className="border-none shadow-none bg-transparent mt-6">
                <CardHeader className="px-0 pt-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Lokasi Pelaksanaan</CardTitle>
                      <CardDescription>Klik pada list untuk melihat detail lokasi di peta.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* List */}
                    <Card className="lg:col-span-1 h-[400px] border rounded-xl shadow-sm overflow-hidden flex flex-col">
                      <div className="p-4 border-b bg-gray-50">
                        <h4 className="font-semibold text-sm">Daftar Titik ({locations.length})</h4>
                      </div>
                      <div className="overflow-y-auto p-4 space-y-3 flex-1 custom-scrollbar">
                        {locations.map((loc: any, idx: number) => {
                          const isActive = idx === selectedLocIndex;
                          return (
                            <div
                              key={idx}
                              onClick={() => setSelectedLocIndex(idx)}
                              className={`flex gap-3 items-start p-3 border rounded-lg cursor-pointer transition-all duration-200 group
                                ${isActive
                                  ? 'bg-gray-50 border-gray-500 shadow-sm ring-1 ring-gray-500'
                                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                              <div className={`mt-0.5 p-1.5 rounded-full ${isActive ? 'bg-gray-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600'}`}>
                                <MapPin className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <h4 className={`font-semibold text-xs ${isActive ? 'text-green-700' : 'text-gray-900'}`}>Titik {idx + 1}</h4>
                                  {isActive && <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">Aktif</span>}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{loc.address}</p>
                                <div className="text-[10px] text-gray-400 mt-2 font-mono flex items-center gap-1">
                                  <span>{loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>

                    {/* Map */}
                    <Card className="lg:col-span-2 overflow-hidden border-none shadow-none h-[400px]">
                      <div className="h-full w-full border rounded-xl overflow-hidden shadow-sm relative">
                        {/* Map uses active location index to re-center */}
                        {/* We pass key to force slight re-init or just rely on useEffect in LocationPicker */}
                        <LocationPicker
                          // Passing Key to force simpler update if internal state is complex, 
                          // but since we saw MapUpdater logic, props update should be enough.
                          // However, passing key ensures clean slate for search/markers states.
                          key={selectedLocIndex}
                          initialLat={locations[selectedLocIndex]?.lat || -6.2}
                          initialLng={locations[selectedLocIndex]?.lng || 106.8}
                          initialAddress={locations[selectedLocIndex]?.address}
                          readOnly={true}
                          // Map other locations
                          existingLocations={(locations || [])
                            .filter((_: any, i: number) => i !== selectedLocIndex)
                            .map((loc: any) => ({
                              lat: Number(loc.lat),
                              lng: Number(loc.lng),
                              address: loc.address
                            }))
                          }
                        />
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Progress</CardTitle>
                <CardDescription>Status tahapan pelaksanaan proyek.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Simple Date Visualization */}
                  <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl border">
                    <div className="text-center">
                      <p className="text-xs tracking-wider text-muted-foreground font-semibold mb-1">Tanggal Mulai</p>
                      <div className="text-lg font-semibold">{project.start_date ? new Date(project.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</div>
                    </div>
                    <div className="flex-1 mx-8 h-px bg-gray-300 relative">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
                        Durasi Pelaksanaan
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs tracking-wider text-muted-foreground font-semibold mb-1">Tanggal Selesai</p>
                      <div className="text-lg font-semibold">{project.end_date ? new Date(project.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="mt-4">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Anggaran & Keuangan</CardTitle>
                <CardDescription>Informasi nominal dan rincian anggaran biaya (RAB).</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6 pt-4">

                {/* Nominal */}
                <div className="flex flex-col justify-center p-6 bg-green-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 text-green-700 rounded-md">
                      <span className="font-bold text-xs">Rp</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {currentStatus === 'active' ? 'Total Anggaran Project' : 'Estimasi Anggaran Pengajuan'}
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 tracking-tight">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(mock.budget || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    *Anggaran yang diajukan dalam formulir project.
                  </p>
                </div>

                {/* Dokumen RAB */}
                <div className="flex flex-col justify-center p-6 border rounded-xl hover:bg-muted/5 transition-colors h-full bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 shrink-0 border border-blue-100">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">Rincian Anggaran (RAB).xlsx</h4>
                        <p className="text-xs text-muted-foreground">Excel File • 2.4 MB</p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="mt-4">
            <div className="space-y-8">
              {/* FORM INPUT SECTION (INLINE) */}
              <Card className="border shadow-sm">
                <CardHeader className="bg-gray-50/50 pb-4 border-b">
                  <CardTitle className="text-base font-semibold">Form Laporan & Monitoring</CardTitle>
                  <CardDescription>Isi form di bawah untuk melaporkan update progres bulan ini.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Date & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Tanggal Laporan</Label>
                      <Input
                        type="date"
                        value={reportForm.date}
                        onChange={(e) => setReportForm({ ...reportForm, date: e.target.value })}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status Project Saat Ini</Label>
                      <div className="relative">
                        <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                          <option value="on_track">On Track (Sesuai Jadwal)</option>
                          <option value="at_risk">At Risk (Ada Kendala)</option>
                          <option value="delayed">Off Track (Terlambat)</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down text-gray-500"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label>Catatan / Kendala / Progres</Label>
                    <Textarea
                      placeholder="Jelaskan secara detail progres yang dicapai atau kendala yang dihadapi..."
                      className="min-h-[120px] bg-white resize-y leading-relaxed"
                      value={reportForm.notes}
                      onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
                    />
                  </div>

                  {/* Dynamic Files */}
                  <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-blue-900 font-semibold">Lampiran Dokumen</Label>
                        <p className="text-[11px] text-muted-foreground">Upload bukti laporan (Foto, PDF, Excel).</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={addReportFileRow} className="h-7 text-xs gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 bg-white">
                        <Plus className="h-3 w-3" /> Tambah File
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {reportForm.files.map((file, idx) => (
                        <div key={file.id} className="flex gap-3 items-start group">
                          <div className="flex-[5] space-y-1">
                            <Input
                              placeholder="Judul Dokumen (Contoh: Laporan Keuangan)"
                              className="h-9 text-sm bg-white"
                              value={file.title}
                              onChange={(e) => handleReportFileChange(file.id, 'title', e.target.value)}
                            />
                          </div>
                          <div className="flex-[6]">
                            <Input type="file" className="h-9 text-sm file:text-xs file:font-medium bg-white cursor-pointer" />
                          </div>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 shrink-0" onClick={() => removeReportFileRow(file.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {reportForm.files.length === 0 && (
                        <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg text-center bg-white/50">
                          <p className="text-xs text-blue-400">Belum ada file dilampirkan. Klik "Tambah File" di atas.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between border-t p-4 bg-gray-50/50">
                  <p className="text-xs text-muted-foreground">Pastikan data yang diinput sudah benar sebelum submit.</p>
                  <Button onClick={() => setIsSubmitReportAlertOpen(true)} className="bg-[var(--sidebar)] hover:bg-[var(--sidebar-active)] text-white hover:text-black hover:border-black border-1 min-w-[180px]">
                    Submit Laporan
                  </Button>
                </CardFooter>
              </Card>

              {/* HISTORY SECTION */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Riwayat Laporan</h3>

                {monitoringList.length === 0 ? (
                  <div className="text-center py-12 border rounded-xl bg-gray-50 text-muted-foreground">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <FileText className="h-6 w-6 text-gray-300" />
                      </div>
                    </div>
                    <p className="text-sm">Belum ada riwayat laporan.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {monitoringList.map((history: any, idx: number) => (
                      <Card key={idx} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                        {/* Header Card */}
                        <div className="bg-white p-5 border-b flex flex-col md:flex-row gap-4 justify-between md:items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-base text-gray-900">
                                {new Date(history.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                              </h4>
                              <Badge variant="secondary" className={`text-[10px] uppercase tracking-wider ${history.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {history.status === 'approved' ? 'Approved' : 'Pending'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Dilaporkan oleh: <span className="font-medium text-gray-700">{history.uploader}</span> • {new Date(history.date).toLocaleDateString('id-ID')}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs">Edit</Button>
                            <Button variant="outline" size="sm" className="h-8 text-xs">Detail</Button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 bg-gray-50/30">
                          <div className="mb-4">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line border-l-2 border-gray-300 pl-3">
                              {history.notes}
                            </p>
                          </div>

                          {history.files && history.files.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                              {history.files.map((file: any, fIdx: number) => (
                                <div key={fIdx} className="flex items-center gap-3 bg-white border rounded p-2.5 hover:border-blue-400 cursor-pointer group transition-colors">
                                  <div className="bg-gray-100 p-2 rounded text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600">
                                    <FileText className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.title}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{file.size || 'Document'}</p>
                                  </div>
                                  <Download className="h-4 w-4 text-gray-300 group-hover:text-blue-600" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="closing" className="mt-4">
            <Card className="border shadow-sm">
              <CardHeader className="pb-4 border-b bg-gray-50/50">
                <CardTitle>Penutupan Proyek (Closing)</CardTitle>
                <CardDescription>Formulir finalisasi dan realisasi anggaran akhir.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-8 px-6 md:px-8">

                {/* Realisasi Section */}
                <div className="space-y-8">
                  {/* Item 1: Money Input */}
                  <div className="max-w-2xl">
                    <div className="space-y-1.5 mb-2">
                      <Label className="text-base font-semibold">Total Biaya Anggaran</Label>
                      <p className="text-sm text-muted-foreground">Total pengeluaran riil selama proyek berlangsung.</p>
                    </div>
                    <MoneyInput
                      value={closingForm.realization}
                      onValueChange={(values) => setClosingForm({ ...closingForm, realization: values.floatValue || 0 })}
                      placeholder="0"
                      prefix="Rp "
                      className="bg-white h-12 text-lg text-left"
                    />
                  </div>

                  <div className="border-t border-gray-200 my-6"></div>

                  {/* Document Uploads Grid */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4">Dokumen Kelengkapan </h4>
                    <div className="grid md:grid-cols-2 gap-6">

                      {/* Laporan Kegiatan */}
                      <div className="space-y-3">
                        <Label className="font-medium">Laporan Kegiatan <span className="text-red-500">*</span></Label>
                        <div className="border rounded-xl p-4 bg-white shadow-sm space-y-3">
                          <p className="text-xs text-gray-500">Upload Laporan Kegiatan (PDF).</p>
                          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-full group">
                            <div className="p-2.5 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform">
                              <Upload className="h-5 w-5 text-gray-600" />
                            </div>
                            <p className="text-[10px] text-muted-foreground">PDF, DOCX, JPG (Max 10MB)</p>
                            <p className="font-medium text-xs text-gray-900 text-center">Klik untuk upload atau drag & drop</p>
                            <Input type="file" className="hidden" />
                          </label>
                        </div>
                      </div>

                      {/* BAST */}
                      <div className="space-y-3">
                        <Label className="font-medium">Berita Acara Serah Terima (BAST) <span className="text-red-500">*</span></Label>
                        <div className="border rounded-xl p-4 bg-white shadow-sm space-y-3">
                          <p className="text-xs text-gray-500">Upload BAST.</p>
                          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-full group">
                            <div className="p-2.5 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform">
                              <Upload className="h-5 w-5 text-gray-600" />
                            </div>
                            <p className="text-[10px] text-muted-foreground">PDF, DOCX, JPG (Max 10MB)</p>
                            <p className="font-medium text-xs text-gray-900 text-center">Klik untuk upload atau drag & drop</p>
                            <Input type="file" className="hidden" />
                          </label>
                        </div>
                      </div>

                      {/* Penagihan */}
                      <div className="space-y-3">
                        <Label className="font-medium">Dokumen Penagihan <span className="text-red-500">*</span></Label>
                        <div className="border rounded-xl p-4 bg-white shadow-sm space-y-3">
                          <p className="text-xs text-gray-500">Invoice / Kwitansi / Bukti Transfer.</p>
                          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-full group">
                            <div className="p-2.5 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform">
                              <Upload className="h-5 w-5 text-gray-600" />
                            </div>
                            <p className="text-[10px] text-muted-foreground">PDF, DOCX, JPG (Max 10MB)</p>
                            <p className="font-medium text-xs text-gray-900 text-center">Klik untuk upload atau drag & drop</p>
                            <Input type="file" className="hidden" />
                          </label>
                        </div>
                      </div>

                      {/* Lesson Learned */}
                      <div className="space-y-3">
                        <Label className="font-medium">Lesson Learn <span className="text-red-500">*</span></Label>
                        <div className="border rounded-xl p-4 bg-white shadow-sm space-y-3">
                          <p className="text-xs text-gray-500">Catatan evaluasi dan pembelajaran project.</p>
                          <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-full group">
                            <div className="p-2.5 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform">
                              <Upload className="h-5 w-5 text-gray-600" />
                            </div>
                            <p className="text-[10px] text-muted-foreground">PDF, DOCX, JPG (Max 10MB)</p>
                            <p className="font-medium text-xs text-gray-900 text-center">Klik untuk upload atau drag & drop</p>
                            <Input type="file" className="hidden" />
                          </label>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Footer / Actions */}
                <div className="flex flex-col md:flex-row items-center justify-end gap-4 border-t pt-6">
                  <Button
                    variant="destructive"
                    size="lg"
                    className="gap-2 w-full md:w-auto"
                    onClick={() => setIsCloseAlertOpen(true)}
                  >
                    Tutup Proyek (Closing)
                  </Button>
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs and Toast Code remains same */}
      <Dialog open={isCloseAlertOpen} onOpenChange={setIsCloseAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penutupan</DialogTitle>
            <DialogDescription>Status akan berubah menjadi completed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloseAlertOpen(false)}>Batal</Button>
            <Button onClick={handleCloseProject}>Ya, Proses</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Proyek</DialogTitle>
            <DialogDescription>Apakah anda yakin?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAlertOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteProject}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isApproveAlertOpen} onOpenChange={setIsApproveAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Project</DialogTitle>
            <DialogDescription>Apakah anda yakin menyetujui project ini? Status akan tercatat sebagai Approved.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveAlertOpen(false)}>Batal</Button>
            <Button className="bg-[#00763c] hover:bg-[#005f30] text-white" onClick={handleApproveAction}>Ya, Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRevisionAlertOpen} onOpenChange={setIsRevisionAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Minta Revisi</DialogTitle>
            <DialogDescription>Apakah anda yakin meminta revisi? Catatan anda akan dikirim ke tim terkait.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevisionAlertOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleRevisionAction}>Kirim Revisi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubmitReportAlertOpen} onOpenChange={setIsSubmitReportAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Submit Laporan</DialogTitle>
            <DialogDescription>
              Apakah anda yakin data yang diinput sudah benar? Laporan ini akan dikirim ke atasan untuk approval.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitReportAlertOpen(false)}>Batal</Button>
            <Button className="bg-[#00763c] hover:bg-[#005f30] text-white" onClick={() => {
              submitReport();
              setIsSubmitReportAlertOpen(false);
            }}>Ya, Submit Laporan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-white border shadow-lg p-3 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm">{toast.message}</span>
          </div>
        </div>
      )}

    </AppSidebarLayout>
  )
}
