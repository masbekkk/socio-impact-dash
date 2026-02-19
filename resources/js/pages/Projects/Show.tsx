import React, { useState, useRef, useEffect } from 'react'
import ProjectTabs from './ProjectTabs'
import { Link, usePage, Head, router } from '@inertiajs/react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import StatusBadge from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import LocationPicker from '@/components/LocationPicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Loader, Hourglass, AlertCircle, Trash2, X, Pencil, FileText, Eye, Download, MapPin, Plus, Calendar, User, Upload, Handshake, Archive, Loader2 } from 'lucide-react'
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

export default function ProjectsShow({ project_slug }: { project_slug: string | number }) {
  const { auth } = usePage().props as any;
  const permissions = auth.permissions || [];
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const currentUserRole = auth.user?.role_name;
  const currentUserId = auth.user?.id;
  const canUpdateCode = permissions.includes('create_code_project');

  // Project Code State
  const [projectCode, setProjectCode] = useState('');
  const [isUpdatingCode, setIsUpdatingCode] = useState(false);

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Proyek', href: '/projects' },
    { title: 'Detail Proyek', href: '#' },
  ];

  // State moved inside useEffect or updated after fetch
  const [currentStatus, setCurrentStatus] = useState('draft');
  const [isProjectDealed, setIsProjectDealed] = useState(false);
  const [monitoringList, setMonitoringList] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  // Dialog & Toast States
  const [isCloseAlertOpen, setIsCloseAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [approvalNote, setApprovalNote] = useState("");
  const [isApproveAlertOpen, setIsApproveAlertOpen] = useState(false);
  const [isRevisionAlertOpen, setIsRevisionAlertOpen] = useState(false);
  const [isSubmitReportAlertOpen, setIsSubmitReportAlertOpen] = useState(false);
  const [isDealAlertOpen, setIsDealAlertOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/projects/${project_slug}`);
        const data = response.data.data;
        setProject(data);
        setCurrentStatus(data.status);
        setMonitoringList(data.monitoring_history || []);

        if (data.locations && data.locations.length > 0) {
          setLocations(data.locations.map((loc: any) => ({
            id: loc.id.toString(),
            lat: parseFloat(loc.latitude),
            lng: parseFloat(loc.longitude),
            address: loc.detail_address || ''
          })));
        }
        else {
          setLocations([]);
        }

        // Initialize project code
        setProjectCode(data.code || '');

        // Initialize closing form with saved data
        setClosingForm(prev => ({
          ...prev,
          actual_budget: data.actual_budget || 0
        }));
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [project_slug]);

  const handleDealProject = async () => {
    try {
      await axios.post(`/api/v1/projects/${project_slug}/deal`);
      setIsDealAlertOpen(false);
      setIsProjectDealed(true);
      setCurrentStatus('active');
      setToast({ show: true, message: 'Project berhasil di-Deal! Menu Penutupan Proyek kini aktif.', type: 'success' });
      // Refresh project data
      router.visit(window.location.pathname, { preserveScroll: true });
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: 'Gagal melakukan deal project.', type: 'error' });
    }
  };

  const handleApproveAction = async () => {
    try {
      await axios.post(`/api/v1/projects/${project_slug}/approve`, { notes: approvalNote });
      setIsApproveAlertOpen(false);
      setToast({ show: true, message: 'Project berhasil di-approve.', type: 'success' });
      router.visit(window.location.pathname, { preserveScroll: true });
    } catch (error) {
      console.error("Error approving project:", error);
      setToast({ show: true, message: 'Gagal approve project.', type: 'error' });
    }
  };

  const handleRevisionAction = async () => {
    try {
      await axios.post(`/api/v1/projects/${project_slug}/reject`, { notes: approvalNote });
      setIsRevisionAlertOpen(false);
      setToast({ show: true, message: 'Permintaan revisi dikirim.', type: 'success' });
      router.visit(window.location.pathname, { preserveScroll: true });
    } catch (error) {
      console.error("Error rejecting project:", error);
      setToast({ show: true, message: 'Gagal mengirim revisi.', type: 'error' });
    }
  };

  // CLOSING STATE
  const [closingForm, setClosingForm] = useState({
    actual_budget: 0, // Will be set from project data or input
    // Files will be handled by ProjectTabs or a separate state there, but we need to receive them here if we submit from here.
    // However, the submit logic seems to be inside ProjectTabs or a function passed to it.
    // Let's see handleCloseProject.
    files: {
      laporan: null,
      bast: null,
      penagihan: null,
      lesson_learn: null
    } as any
  });


  // MONITORING STATE (Inline Form)
  const [reportForm, setReportForm] = useState<{
    date: string;
    notes: string;
    files: { id: number; title: string; file?: File }[];
  }>({
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
  const handleReportFileChange = (id: number, field: string, value: any) => {
    setReportForm({
      ...reportForm,
      files: reportForm.files.map(f => f.id === id ? { ...f, [field]: value } : f)
    });
  };

  const submitReport = async () => {
    const formData = new FormData();
    formData.append('report_date', reportForm.date);
    formData.append('notes', reportForm.notes);

    let fileIndex = 0;
    reportForm.files.forEach((f) => {
      if (f.file) {
        formData.append(`documents[${fileIndex}][file]`, f.file);
        fileIndex++;
      }
    });

    try {
      await axios.post(`/api/v1/projects/${project_slug}/monitorings`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setToast({ show: true, message: 'Laporan berhasil ditambahkan.', type: 'success' });
      setReportForm({ date: new Date().toISOString().split('T')[0], notes: '', files: [{ id: Date.now(), title: '' }] });
      router.visit(window.location.pathname, { preserveScroll: true });
    } catch (error) {
      console.error("Error submitting report:", error);
      setToast({ show: true, message: 'Gagal mengirim laporan.', type: 'error' });
    }
  };


  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleCloseProject = async () => {
    const formData = new FormData();
    formData.append('actual_budget', closingForm.actual_budget.toString());

    // Map closing files to documents array with types
    const fileTypes: Record<string, string> = {
      laporan: 'report_activity',
      bast: 'bast',
      penagihan: 'invoice', // or other type
      lesson_learn: 'lesson_learn'
    };

    let idx = 0;
    Object.entries(closingForm.files).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(`documents[${idx}][file]`, file);
        formData.append(`documents[${idx}][type]`, fileTypes[key] || 'other');
        idx++;
      }
    });

    try {
      await axios.post(`/api/v1/projects/${project_slug}/close`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsCloseAlertOpen(false);
      setCurrentStatus('completed');
      setToast({ show: true, message: 'Proyek berhasil ditutup (Closing Success).', type: 'success' });
      router.visit(window.location.pathname, { preserveScroll: true });
    } catch (error) {
      console.error("Error closing project:", error);
      setToast({ show: true, message: 'Gagal menutup proyek.', type: 'error' });
    }
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(`/api/v1/projects/${project_slug}`);
      setIsDeleteAlertOpen(false);
      setToast({ show: true, message: 'Proyek berhasil dihapus.', type: 'success' });
      setTimeout(() => {
        router.visit('/projects');
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: 'Gagal menghapus proyek.', type: 'error' });
    }
  };

  const handleUpdateCode = async () => {
    if (!projectCode || projectCode === project.code) return;

    setIsUpdatingCode(true);
    try {
      // Use axios directly to update only the code
      // We are using PUT/PATCH to update the project resource
      await axios.post(`/api/v1/projects/${project_slug}`, {
        _method: 'PUT',
        code: projectCode
      });

      setToast({ show: true, message: 'Kode proyek berhasil diperbarui.', type: 'success' });

      // Update local state to reflect change without full reload if possible, 
      // but router.visit ensures everything is in sync
      router.visit(window.location.pathname, { preserveScroll: true });
    } catch (error: any) {
      console.error("Error updating project code:", error);
      setToast({
        show: true,
        message: error.response?.data?.message || 'Gagal memperbarui kode proyek.',
        type: 'error'
      });
    } finally {
      setIsUpdatingCode(false);
    }
  };

  if (loading) {
    return (
      <AppSidebarLayout breadcrumbs={breadcrumbs}>
        <div className="p-8 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppSidebarLayout>
    );
  }

  const isAssignedFinance = project?.account_manager_id === currentUserId;
  const isAssignedHR = project?.head_id === currentUserId;
  const isAssignedDirektur = project?.pic_id === currentUserId;
  const isAssignedStakeholder = isAssignedFinance || isAssignedHR || isAssignedDirektur;

  const isReadyForClosing = currentStatus === 'active';

  const workflows = project.approvals && project.approvals.length > 0 ? project.approvals.map((ap: any) => {
    let roleName = '';
    switch (ap.approval_type) {
      case 'finance': roleName = 'ACCOUNT MANAGER'; break;
      case 'hr': roleName = 'HEAD IMPLEMENTATION'; break;
      case 'direktur': roleName = 'PIC PROJECT'; break;
      default: roleName = ap.approval_type;
    }

    return {
      ...ap,
      role: roleName,
      name: ap.approved_by?.name || '-',
      status: ap.approval_status,
      note: ap.notes,
      date: ap.updated_at
    };
  }) : [];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-4 md:p-8 pb-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <Badge variant="outline">{project.code}</Badge>
          </div>
          <p className="text-muted-foreground">{project.division?.name || '-'}</p>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-2 w-full md:w-auto">
          <StatusBadge status={currentStatus} />

          <div className="flex gap-2 w-full md:w-auto">
            <Link href={`/projects/${project.id}/edit`} className="flex-1 md:flex-none">
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

        {/* stakeholder WORKFLOW */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Stakeholders</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'Account Manager', user: project.account_manager },
              { role: 'Head Implementation', user: project.head },
              { role: 'PIC Project', user: project.pic }
            ].map((stakeholder, index) => (
              <Card
                key={index}
                className="transition-all duration-200 bg-[var(--sidebar)] text-white border-[var(--sidebar)] shadow-md hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-white/80 uppercase tracking-wide">
                      {stakeholder.role}
                    </CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-lg font-bold mt-1 text-white truncate" title={stakeholder.user?.name}>
                    {stakeholder.user?.name || '-'}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="capitalize px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border bg-white/20 text-white border-white/20 backdrop-blur-sm">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Assigned
                    </span>
                  </div>

                  {/* Notes Section - Optional */}
                  <div className="p-3 rounded-lg border text-sm mt-3 bg-white/10 border-white/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-white/80">
                      <User className="h-3.5 w-3.5" />
                      <span className="text-xs truncate">{stakeholder.user?.name || '-'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Approval Notes Input (Below Cards) */}
          {(isAssignedStakeholder || canUpdateCode) && (
            <div className="mt-6 p-4 border rounded-xl bg-white shadow-sm">
              {/* Project Code Input - Based on permission */}
              {canUpdateCode && (
                <div className="mb-4 space-y-2 border-b pb-4">
                  <Label htmlFor="project-code" className="text-sm font-semibold">
                    Tetapkan Kode Proyek <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <Input
                        id="project-code"
                        className="max-w-md bg-white border-gray-300 font-mono"
                        placeholder="Contoh: PRJ-2025-001"
                        value={projectCode}
                        onChange={(e) => setProjectCode(e.target.value)}
                      />
                      <Button
                        size="sm"
                        onClick={handleUpdateCode}
                        disabled={isUpdatingCode || !projectCode || projectCode === project.code}
                      >
                        {isUpdatingCode ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Simpan"
                        )}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Kode proyek wajib diisi untuk identifikasi unik sebelum menyetujui.
                    </p>
                  </div>
                </div>
              )}

              {isAssignedStakeholder && (
                <>
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
                </>
              )}
            </div>
          )}
        </section>

        <ProjectTabs
          project={project}
          currentStatus={currentStatus}
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
          isProjectDealed={true}
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitReportAlertOpen(false)}>Batal</Button>
            <Button onClick={submitReport}>Submit Laporan</Button>
          </DialogFooter>
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
