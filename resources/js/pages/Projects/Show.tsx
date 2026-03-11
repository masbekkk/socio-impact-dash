import React, { useState, useEffect, useCallback } from 'react'
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
import { CheckCircle2, Pencil, Plus, Calendar, User, Handshake, Loader2, ShieldCheck, Hash, BarChart3, Layers, Users, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils';
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
import { usePermission } from '@/hooks/use-permission';

export default function ProjectsShow({ project_slug }: { project_slug: string | number }) {
  const { auth } = usePage().props as any;
  const { hasRole, hasPermission } = usePermission();
  const permissions = auth.permissions || [];
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const currentUserRole = auth.user?.role_name;
  const currentUserId = auth.user?.id;
  const canUpdateCode = hasPermission('create_code_project');

  // Project Code State
  const [projectCode, setProjectCode] = useState('');
  const [initialProject, setInitialProject] = useState('');
  const [isUpdatingCode, setIsUpdatingCode] = useState(false);
  const [isUpdatingInitialProject, setIsUpdatingInitialProject] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

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
  const [isDealAlertOpen, setIsDealAlertOpen] = useState(false);

  const fetchProject = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
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
      setInitialProject(data.initial_project || '');

      // Initialize closing form with saved data
      setClosingForm(prev => ({
        ...prev,
        actual_budget: data.actual_budget || 0,
        lesson_learned: data.lesson_learned || ''
      }));
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [project_slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleDealProject = async () => {
    try {
      await axios.post(`/api/v1/projects/${project_slug}/deal`);
      setIsDealAlertOpen(false);
      setIsProjectDealed(true);
      setCurrentStatus('active');
      setToast({ show: true, message: 'Project berhasil di-Deal! Menu Penutupan Proyek kini aktif.', type: 'success' });
      // Refresh project data without full reload
      fetchProject(false);
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
      fetchProject(false);
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
      fetchProject(false);
    } catch (error) {
      console.error("Error rejecting project:", error);
      setToast({ show: true, message: 'Gagal mengirim revisi.', type: 'error' });
    }
  };

  // CLOSING STATE
  const [closingForm, setClosingForm] = useState({
    actual_budget: 0, // Will be set from project data or input
    lesson_learned: '',
    files: {
      laporan: null,
      bast: null,
      penagihan: null
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
        if (f.title) {
          formData.append(`documents[${fileIndex}][title]`, f.title);
        }
        fileIndex++;
      }
    });

    setIsSubmittingReport(true);
    try {
      await axios.post(`/api/v1/projects/${project_slug}/monitorings`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setToast({ show: true, message: 'Laporan berhasil ditambahkan.', type: 'success' });
      setReportForm({ date: new Date().toISOString().split('T')[0], notes: '', files: [{ id: Date.now(), title: '' }] });
      fetchProject(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      setToast({ show: true, message: 'Gagal mengirim laporan.', type: 'error' });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleDeleteReport = async (monitoringId: number | string) => {
    try {
      await axios.delete(`/api/v1/projects/${project_slug}/monitorings/${monitoringId}`);
      setToast({ show: true, message: 'Laporan berhasil dihapus.', type: 'success' });
      fetchProject(false);
    } catch (error) {
      console.error("Error deleting report:", error);
      setToast({ show: true, message: 'Gagal menghapus laporan.', type: 'error' });
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
      penagihan: 'invoice'
    };

    let idx = 0;
    Object.entries(closingForm.files).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(`documents[${idx}][file]`, file);
        formData.append(`documents[${idx}][type]`, fileTypes[key] || 'other');
        idx++;
      }
    });

    formData.append('lesson_learned', closingForm.lesson_learned || '');

    try {
      await axios.post(`/api/v1/projects/${project_slug}/close`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsCloseAlertOpen(false);
      setCurrentStatus('completed');
      setToast({ show: true, message: 'Proyek berhasil ditutup (Closing Success).', type: 'success' });
      fetchProject(false);
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
      fetchProject(false);
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

  const handleUpdateInitialProject = async () => {
    if (!initialProject || initialProject === project.initial_project) return;

    setIsUpdatingInitialProject(true);
    try {
      await axios.post(`/api/v1/projects/${project_slug}`, {
        _method: 'PUT',
        initial_project: initialProject
      });

      setToast({ show: true, message: 'Initial project berhasil diperbarui.', type: 'success' });
      fetchProject(false);
    } catch (error: any) {
      console.error("Error updating initial project:", error);
      setToast({
        show: true,
        message: error.response?.data?.message || 'Gagal memperbarui initial project.',
        type: 'error'
      });
    } finally {
      setIsUpdatingInitialProject(false);
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
  const isAssignedPIC = project?.pic_id === currentUserId;
  const isAssignedStakeholder = isAssignedFinance || isAssignedHR || isAssignedPIC;

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
            <Link href={`/projects/${project.uuid}/edit`} className="flex-1 md:flex-none">
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

        {/* STAKEHOLDER WORKFLOW */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-bold">Stakeholders</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'Account Manager', user: project.account_manager, icon: Handshake, color: 'emerald' },
              { role: 'Head Implementation', user: project.head, icon: ShieldCheck, color: 'blue' },
              { role: 'PIC Project', user: project.pic, icon: User, color: 'purple' }
            ].map((stakeholder, index) => {
              const Icon = stakeholder.icon;
              return (
                <Card
                  key={index}
                  className="transition-all duration-300 border-none shadow-sm hover:shadow-md overflow-hidden group"
                >
                  <div className={cn(
                    "h-1.5 w-full",
                    stakeholder.color === 'emerald' ? "bg-emerald-500" :
                      stakeholder.color === 'blue' ? "bg-blue-500" : "bg-purple-500"
                  )} />
                  <CardHeader className="pb-3 px-5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Icon className="h-3 w-3" />
                        {stakeholder.role}
                      </span>
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[10px] h-5 border-emerald-100">
                        Assigned
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold truncate group-hover:text-emerald-700 transition-colors">
                      {stakeholder.user?.name || '-'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg border border-muted/50">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center border shadow-sm shrink-0">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="truncate">{stakeholder.user?.email || 'No email provided'}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* PROJECT IDENTITY & ACTIONS */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
              <CardHeader className="pb-3 bg-slate-50/50 border-b">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-600" />
                  <CardTitle className="text-base font-bold text-slate-800">Identitas & Klasifikasi Proyek</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Project Code & Initial Project */}
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="project-code" className="text-sm font-bold flex items-center gap-2">
                        <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                        Kode Proyek
                      </Label>
                      {canUpdateCode ? (
                        <div className="flex gap-2 group">
                          <div className="relative flex-1">
                            <Input
                              id="project-code"
                              className="bg-white border-gray-200 font-mono text-sm h-10 transition-all focus:ring-2 focus:ring-emerald-500/20"
                              placeholder="PRJ-XXXX-XXX"
                              value={projectCode}
                              onChange={(e) => setProjectCode(e.target.value)}
                            />
                            {projectCode === project.code && project.code && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 absolute right-3 top-3" />
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="default"
                            className="h-10 w-10 shrink-0 bg-emerald-600 hover:bg-emerald-700 transition-transform active:scale-95 shadow-sm"
                            onClick={handleUpdateCode}
                            disabled={isUpdatingCode || !projectCode || projectCode === project.code}
                          >
                            {isUpdatingCode ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="h-10 px-3 bg-muted/30 rounded-lg flex items-center border border-muted/50 font-mono text-sm text-slate-600">
                          {project.code || 'BELUM DITETAPKAN'}
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground italic pl-1">
                        *Kode unik internal untuk identifikasi proyek.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="initial-project" className="text-sm font-bold flex items-center gap-2">
                        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                        Initial Project
                      </Label>
                      {canUpdateCode ? (
                        <div className="flex gap-2 group">
                          <div className="relative flex-1">
                            <Input
                              id="initial-project"
                              className="bg-white border-gray-200 font-mono text-sm h-10 transition-all focus:ring-2 focus:ring-emerald-500/20"
                              placeholder="Initial Project ..."
                              value={initialProject}
                              onChange={(e) => setInitialProject(e.target.value)}
                            />
                            {initialProject === project.initial_project && project.initial_project && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 absolute right-3 top-3" />
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="default"
                            className="h-10 w-10 shrink-0 bg-emerald-600 hover:bg-emerald-700 transition-transform active:scale-95 shadow-sm"
                            onClick={handleUpdateInitialProject}
                            disabled={isUpdatingInitialProject || !initialProject || initialProject === project.initial_project}
                          >
                            {isUpdatingInitialProject ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="h-10 px-3 bg-muted/30 rounded-lg flex items-center border border-muted/50 font-mono text-sm text-slate-600">
                          {project.initial_project || 'BELUM DITETAPKAN'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Project Type */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-bold flex items-center gap-2 text-slate-700">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                        Jenis / Kategori Proyek
                      </Label>
                      <div className="h-20 p-4 border rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50/30 flex items-center justify-between border-emerald-100 shadow-sm transition-all hover:shadow-md">
                        <div>
                          <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest mb-1">Classification Target</p>
                          <p className="font-extrabold text-lg text-slate-800 capitalize leading-none">
                            {project.project_type || 'General'}
                          </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
                          <Layers className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Summary / Status Card */}
            <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative group">
              <div className="absolute -right-8 -bottom-8 opacity-10 transition-transform group-hover:scale-110 duration-500">
                <BarChart3 className="h-48 w-48 text-white" />
              </div>
              <CardHeader className="pb-2 border-b border-white/10">
                <CardTitle className="text-sm font-medium text-white/60 uppercase tracking-widest">Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 relative z-10">
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Contract Value</p>
                  <p className="text-2xl font-black text-emerald-400 font-mono">
                    {project.budget_total ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(project.budget_total) : 'Rp 0'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Timeline</p>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                      <Calendar className="h-3 w-3 text-emerald-400" />
                      <span>{project.start_date ? new Date(project.start_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : '-'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Division</p>
                    <p className="text-xs font-bold text-white/90 truncate">{project.division?.name || '-'}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-2 text-[10px] text-white/50 italic">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span>Verified Project Data</span>
                </div>
              </CardFooter>
            </Card>
          </div>
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
          isSubmittingReport={isSubmittingReport}
          onSubmitReport={submitReport}
          onDeleteReport={handleDeleteReport}
          monitoringList={monitoringList}
          closingForm={closingForm}
          setClosingForm={setClosingForm}
          isProjectDealed={true}
          setIsDealAlertOpen={setIsDealAlertOpen}
          setIsCloseAlertOpen={setIsCloseAlertOpen}
          refetchProject={() => fetchProject(false)}
          onShowToast={(msg: string, type: 'success' | 'error') => setToast({ show: true, message: msg, type })}
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
            <DialogTitle>Setujui Proyek</DialogTitle>
            <DialogDescription>Apakah anda yakin menyetujui proyek ini? Status akan tercatat sebagai Disetujui.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveAlertOpen(false)}>Batal</Button>
            <Button className="bg-[#00763c] hover:bg-[#005f30] text-white" onClick={handleApproveAction}>Ya, Setujui</Button>
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
