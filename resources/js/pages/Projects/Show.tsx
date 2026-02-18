import React, { useState, useRef, useEffect } from 'react'
import ProjectTabs from './ProjectTabs'
import { Link, usePage } from '@inertiajs/react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import StatusBadge from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import LocationPicker from '@/components/LocationPicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Loader, Hourglass, AlertCircle, Trash2, X, Pencil, FileText, Eye, Download, MapPin, Plus, Calendar, User, Upload, Handshake, Archive } from 'lucide-react'
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

  // Mapping role backend (lowercase) ke Role Tampilan Frontend (Capitalized)
  const rawRole = auth.user?.roles?.[0]?.name || 'Admin';
  const roleMap: Record<string, string> = {
    'superadmin': 'Admin',
    'finance': 'Finance',
    'head': 'Direktur', // Mapping Head ke Direktur untuk alur persetujuan
  };
  const currentUserRole = roleMap[rawRole] || rawRole;

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

  // Dialog & Toast States
  const [isCloseAlertOpen, setIsCloseAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [approvalNote, setApprovalNote] = useState("");
  const [isApproveAlertOpen, setIsApproveAlertOpen] = useState(false);
  const [isRevisionAlertOpen, setIsRevisionAlertOpen] = useState(false);
  const [isSubmitReportAlertOpen, setIsSubmitReportAlertOpen] = useState(false);
  const [isDealAlertOpen, setIsDealAlertOpen] = useState(false);
  const [isProjectDealed, setIsProjectDealed] = useState(false); // Dummy state for deal flow

  const handleDealProject = () => {
    setIsDealAlertOpen(false);
    setIsProjectDealed(true);
    setToast({ show: true, message: 'Project berhasil di-Deal! Menu Penutupan Proyek kini aktif.', type: 'success' });
  };

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
    allowance: 15000000,
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
  const defaultWorkflows = [
    { role: 'Admin', name: 'Admin Project', status: 'approved', date: project.start_date, note: 'Dokumen administrasi dan kelengkapan proposal sudah valid.' },
    { role: 'Finance', name: 'Finance Team', status: currentStatus === 'draft' ? 'pending' : 'approved', date: currentStatus !== 'draft' ? project.start_date : '-', note: currentStatus !== 'draft' ? 'Budget tersedia dan sesuai dengan alokasi Q1.' : '' },
    { role: 'Direktur', name: 'Direktur', status: (currentStatus === 'completed' || isReadyForClosing) ? 'approved' : 'waiting', date: '-', note: (currentStatus === 'completed' || isReadyForClosing) ? 'Project berjalan baik, hasil sesuai target.' : '-' },
  ];

  const workflows = project.approvals ? project.approvals.map((ap: any) => ({
    ...ap,
    name: ap.role === 'Admin' ? 'Admin Project' : ap.role === 'Finance' ? 'Finance Team' : ap.role
  })) : defaultWorkflows;

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
            {workflows.map((flow: any, index: number) => {
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
                </Card>
              );
            })}
          </div>

          {/* Approval Notes Input (Below Cards) */}
          <div className="mt-6 p-4 border rounded-xl bg-white shadow-sm">
            {/* Project Code Input - Only for Finance */}
            {currentUserRole === 'Admin' && (
              <div className="mb-4 space-y-2 border-b pb-4">
                <Label htmlFor="project-code" className="text-sm font-semibold">
                  Tetapkan Kode Proyek <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col gap-1">
                  <Input
                    id="project-code"
                    className="max-w-md bg-white border-gray-300 font-mono"
                    placeholder="Contoh: PRJ-2025-001"
                    defaultValue={mock.code !== 'PRJ-2025-001' ? mock.code : ''}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Kode proyek wajib diisi untuk identifikasi unik sebelum menyetujui.
                  </p>
                </div>
              </div>
            )}

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
                <Button variant="outline" onClick={() => setIsRevisionAlertOpen(true)} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-transform hover:scale-105 active:scale-95">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Revisi
                </Button>
                <Button onClick={() => setIsApproveAlertOpen(true)} className="bg-[var(--sidebar)] hover:bg-[var(--sidebar)] text-white shadow-sm transition-transform hover:scale-105 active:scale-95">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </section>

        <ProjectTabs
          project={project}
          currentStatus={currentStatus}
          mock={mock}
          locations={locations}
          reportForm={reportForm}
          setReportForm={setReportForm}
          handleReportFileChange={handleReportFileChange}
          addReportFileRow={addReportFileRow}
          removeReportFileRow={removeReportFileRow}
          setIsSubmitReportAlertOpen={setIsSubmitReportAlertOpen}
          monitoringList={monitoringList}
          closingForm={closingForm}
          setClosingForm={setClosingForm}
          isProjectDealed={isProjectDealed}
          setIsDealAlertOpen={setIsDealAlertOpen}
          setIsCloseAlertOpen={setIsCloseAlertOpen}
        />
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
        </DialogContent>
      </Dialog>

      <Dialog open={isDealAlertOpen} onOpenChange={setIsDealAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Deal Project</DialogTitle>
            <DialogDescription>
              Apakah anda yakin ingin menyepakati project ini? <br />
              Setelah ini, status project akan berubah menjadi <strong>Active</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDealAlertOpen(false)}>Batal</Button>
            <Button className="bg-[#00763c] hover:bg-[#005f30] text-white" onClick={handleDealProject}>
              <Handshake className="h-4 w-4 mr-2" />
              Ya, Deal Project
            </Button>
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
