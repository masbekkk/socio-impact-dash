import React, { useState, useRef, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button'
import LocationPicker from '@/components/LocationPicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Loader, AlertCircle, Trash2, Pencil, FileText, Eye, Download, MapPin, Plus, User, Upload, Handshake, Archive, Save, Loader2 } from 'lucide-react'
import MoneyInput from '@/components/MoneyInput'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePage } from '@inertiajs/react'
import axios from 'axios'
import Editor from '@/components/Editor';

interface ProjectTabsProps {
    project: any;
    currentStatus: string;
    locations: any[];
    userRole?: string; // 'admin' | 'finance' | 'user'
    refetchProject?: () => void;
    onShowToast?: (msg: string, type: 'success' | 'error') => void;

    // Monitoring
    reportForm: any;
    setReportForm: (val: any) => void;
    handleReportFileChange: (id: number, field: string, value: any) => void;
    addReportFileRow: () => void;
    removeReportFileRow: (id: number) => void;
    isSubmittingReport: boolean;
    onSubmitReport: () => void;
    onDeleteReport?: (id: number | string) => void;
    monitoringList: any[];

    // Closing
    closingForm: any;
    setClosingForm: (val: any) => void;
    isProjectDealed: boolean;
    setIsDealAlertOpen: (val: boolean) => void;
    setIsCloseAlertOpen: (val: boolean) => void;
}

export default function ProjectTabs({
    project,
    currentStatus,
    locations,
    userRole: initialUserRole,
    refetchProject,
    onShowToast,
    reportForm,
    setReportForm,
    handleReportFileChange,
    addReportFileRow,
    removeReportFileRow,
    isSubmittingReport,
    onSubmitReport,
    onDeleteReport,
    monitoringList,
    closingForm,
    setClosingForm,
    isProjectDealed,
    setIsDealAlertOpen,
    setIsCloseAlertOpen,
}: ProjectTabsProps) {
    // Tab Handling
    const [activeTab, setActiveTab] = useState('detail');
    const tabsListRef = useRef<HTMLDivElement>(null);
    const [selectedLocIndex, setSelectedLocIndex] = useState(0);
    const quillRef = useRef<any>(null);

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
    // Use project.termin_payments from props if available
    const [localPaymentTerms, setLocalPaymentTerms] = useState<any[]>(project.termin_payments || []);

    useEffect(() => {
        if (project.termin_payments) {
            setLocalPaymentTerms(project.termin_payments);
        }
    }, [project.termin_payments]);

    // Budget Partitions State
    const [editPartitions, setEditPartitions] = useState(false);
    const [opsBudget, setOpsBudget] = useState<number>(project.operational_budget || 0);
    const [mgmtBudget, setMgmtBudget] = useState<number>(project.management_budget || 0);
    const [allowanceBudget, setAllowanceBudget] = useState<number>(project.allowance_budget || 0);
    const [savingBudget, setSavingBudget] = useState(false);
    const [localBudgetStatus, setLocalBudgetStatus] = useState(project.budget_partition_status || 'draft');

    const authUserRole = (usePage().props as any).auth?.user?.role_name || 'user';
    const userRole = initialUserRole || authUserRole;

    // Permissions
    const isAdminOrFinance = userRole === 'superadmin' || userRole === 'finance';
    const permissions = (usePage().props as any).auth?.permissions || [];
    const canInputBudget = isAdminOrFinance;
    const canApproveBudget = permissions.includes('approval_budget_partition');
    const canManageDetailBudget = permissions.includes('manage_detail_budget');

    // Detail Budget State
    const [detailBudgets, setDetailBudgets] = useState<any[]>(project.budget_details || []);
    const [editDetailBudget, setEditDetailBudget] = useState(false);
    const [savingDetailBudget, setSavingDetailBudget] = useState(false);
    const [deleteDetailBudgets, setDeleteDetailBudgets] = useState<string[]>([]);

    // Additional Budget Request State
    const [isRequestBudgetOpen, setIsRequestBudgetOpen] = useState(false);
    const [requestBudgetAmount, setRequestBudgetAmount] = useState<number>(0);
    const [requestBudgetNotes, setRequestBudgetNotes] = useState('');
    const [isSubmittingRequestBudget, setIsSubmittingRequestBudget] = useState(false);

    useEffect(() => {
        setOpsBudget(project.operational_budget || 0);
        setMgmtBudget(project.management_budget || 0);
        setAllowanceBudget(project.allowance_budget || 0);
        setLocalBudgetStatus(project.budget_partition_status || 'draft');
    }, [project]);

    const handleSaveBudget = async () => {
        setSavingBudget(true);
        try {
            await axios.put(`/api/v1/projects/${project.uuid}`, {
                operational_budget: opsBudget,
                management_budget: mgmtBudget,
                allowance_budget: allowanceBudget
            });
            setEditPartitions(false);
            if (onShowToast) onShowToast('Pembagian anggaran berhasil disimpan', 'success');
        } catch (error: any) {
            console.error(error);
            if (onShowToast) onShowToast(error?.response?.data?.message || 'Gagal menyimpan anggaran', 'error');
        } finally {
            setSavingBudget(false);
        }
    };

    const handleApproveBudget = async () => {
        setSavingBudget(true);
        try {
            await axios.put(`/api/v1/projects/${project.uuid}`, {
                budget_partition_status: 'approved'
            });
            setLocalBudgetStatus('approved');
            if (onShowToast) onShowToast('Pembagian anggaran berhasil disetujui', 'success');
        } catch (error: any) {
            console.error(error);
            if (onShowToast) onShowToast(error?.response?.data?.message || 'Gagal menyetujui anggaran', 'error');
        } finally {
            setSavingBudget(false);
        }
    };

    const handleSaveDetailBudget = async () => {
        setSavingDetailBudget(true);
        const currentTotalProposal = detailBudgets.reduce((sum, item) => sum + (Number(item.amount_proposal) || 0), 0);
        if (currentTotalProposal > opsBudget) {
            setSavingDetailBudget(false);
            if (onShowToast) onShowToast('Gagal menyimpan: Total amount proposal melebihi budget operasional. Sesuaikan RAB atau ajukan tambahan operasional.', 'error');
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('_method', 'PUT');

            detailBudgets.forEach((detail, index) => {
                if (!detail.isNew) {
                    submitData.append(`detail_budgets[${index}][id]`, detail.id);
                }
                submitData.append(`detail_budgets[${index}][item_name]`, detail.item_name || '');
                if (detail.quantity) submitData.append(`detail_budgets[${index}][quantity]`, detail.quantity.toString());
                submitData.append(`detail_budgets[${index}][item_price]`, (detail.item_price || 0).toString());
                submitData.append(`detail_budgets[${index}][amount]`, (detail.amount || (detail.item_price || 0)).toString());
                submitData.append(`detail_budgets[${index}][amount_pelaksanaan]`, (detail.amount_pelaksanaan || 0).toString());
                submitData.append(`detail_budgets[${index}][amount_proposal]`, (detail.amount_proposal || 0).toString());
                if (detail.notes) submitData.append(`detail_budgets[${index}][notes]`, detail.notes);
            });

            deleteDetailBudgets.forEach((id, index) => {
                submitData.append(`delete_detail_budgets[${index}]`, id);
            });

            await axios.post(`/api/v1/projects/${project.uuid}`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setEditDetailBudget(false);
            if (onShowToast) onShowToast('Rincian anggaran berhasil disimpan', 'success');
            if (refetchProject) refetchProject();
        } catch (error: any) {
            console.error(error);
            if (onShowToast) onShowToast(error?.response?.data?.message || error?.response?.data?.errors?.detail_budgets || 'Gagal menyimpan rincian anggaran', 'error');
        } finally {
            setSavingDetailBudget(false);
        }
    };

    // Handler to toggle verification status
    const toggleVerification = async (termId: number, currentVerified: boolean) => {
        try {
            const { data } = await axios.post(`/api/v1/projects/${project.uuid}/termins/${termId}`, {
                is_verified: !currentVerified
            });
            setLocalPaymentTerms(prev =>
                prev.map(t => t.id === termId ? { ...t, ...data.data } : t)
            );
            if (onShowToast) onShowToast(!currentVerified ? 'Termin berhasil diverifikasi' : 'Verifikasi dibatalkan', 'success');
        } catch (error: any) {
            console.error("Error toggling verification:", error);
            if (onShowToast) onShowToast(error?.response?.data?.message || 'Gagal mengubah verifikasi', 'error');
        }
    };

    const handleTerminProofUpload = async (termId: number, file: File) => {
        const formData = new FormData();
        formData.append('proof_file', file);
        try {
            const { data } = await axios.post(`/api/v1/projects/${project.uuid}/termins/${termId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setLocalPaymentTerms(prev =>
                prev.map(t => t.id === termId ? { ...t, ...data.data } : t)
            );
            if (onShowToast) onShowToast('Bukti pembayaran berhasil diunggah', 'success');
        } catch (error: any) {
            console.error("Error uploading proof:", error);
            if (onShowToast) onShowToast(error?.response?.data?.message || 'Gagal mengunggah bukti', 'error');
        }
    };

    const [savingClosing, setSavingClosing] = useState(false);

    const handleSaveClosingChanges = async () => {
        setSavingClosing(true);
        try {
            await axios.put(`/api/v1/projects/${project.uuid}`, {
                actual_budget: closingForm.actual_budget,
                lesson_learned: closingForm.lesson_learned
            });
            if (refetchProject) refetchProject();
            if (onShowToast) onShowToast('Perubahan data closing berhasil disimpan.', 'success');
        } catch (error: any) {
            console.error("Error saving closing changes:", error);
            if (onShowToast) onShowToast(error?.response?.data?.message || 'Gagal menyimpan perubahan.', 'error');
        } finally {
            setSavingClosing(false);
        }
    };

    const handleRequestAdditionalBudget = async () => {
        if (!requestBudgetAmount || requestBudgetAmount <= 0) {
            if (onShowToast) onShowToast('Nominal tambahan budget harus diisi', 'error');
            return;
        }
        setIsSubmittingRequestBudget(true);
        try {
            // For now, save this request as a new Activity/Budget Detail as a placeholder
            // In a real scenario, this might be a distinct API endpoint like /api/v1/projects/{uuid}/request-budget
            const submitData = new FormData();
            submitData.append('_method', 'PUT');

            detailBudgets.forEach((detail, index) => {
                if (!detail.isNew) {
                    submitData.append(`detail_budgets[${index}][id]`, detail.id);
                }
                submitData.append(`detail_budgets[${index}][item_name]`, detail.item_name || '');
                if (detail.quantity) submitData.append(`detail_budgets[${index}][quantity]`, detail.quantity.toString());
                submitData.append(`detail_budgets[${index}][item_price]`, (detail.item_price || 0).toString());
                submitData.append(`detail_budgets[${index}][amount]`, (detail.amount || (detail.item_price || 0)).toString());
                submitData.append(`detail_budgets[${index}][amount_pelaksanaan]`, (detail.amount_pelaksanaan || 0).toString());
                submitData.append(`detail_budgets[${index}][amount_proposal]`, (detail.amount_proposal || 0).toString());
                if (detail.notes) submitData.append(`detail_budgets[${index}][notes]`, detail.notes);
            });

            // Append the new requested budget as a special budget detail
            const newIndex = detailBudgets.length;
            submitData.append(`detail_budgets[${newIndex}][item_name]`, 'Pengajuan Tambahan Budget Operasional');
            submitData.append(`detail_budgets[${newIndex}][amount_proposal]`, requestBudgetAmount.toString());
            submitData.append(`detail_budgets[${newIndex}][amount_pelaksanaan]`, '0');
            submitData.append(`detail_budgets[${newIndex}][amount]`, requestBudgetAmount.toString());
            submitData.append(`detail_budgets[${newIndex}][notes]`, requestBudgetNotes || 'Pengajuan request tambahan budget');

            await axios.post(`/api/v1/projects/${project.uuid}`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsRequestBudgetOpen(false);
            setRequestBudgetAmount(0);
            setRequestBudgetNotes('');
            if (onShowToast) onShowToast('Pengajuan tambahan budget berhasil dikirim', 'success');
            if (refetchProject) refetchProject();
        } catch (error: any) {
            console.error('Error requesting additional budget:', error);
            if (onShowToast) onShowToast(error?.response?.data?.message || 'Gagal mengajukan tambahan budget', 'error');
        } finally {
            setIsSubmittingRequestBudget(false);
        }
    };


    const totalPelaksanaan = detailBudgets.reduce((sum, item) => sum + (Number(item.amount_pelaksanaan) || 0), 0);
    const totalProposal = detailBudgets.reduce((sum, item) => sum + (Number(item.amount_proposal) || 0), 0);
    const estimasiProfit = (project.budget_total || 0) - totalPelaksanaan;

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div ref={tabsListRef} className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide">
                <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max md:w-full min-w-full md:min-w-0">
                    <TabsTrigger value="detail" className="flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white">Detail & Proposal</TabsTrigger>
                    <TabsTrigger value="timeline" className="flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white">Timeline</TabsTrigger>
                    <TabsTrigger value="budget" className="flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white">Nilai Kontrak</TabsTrigger>
                    <TabsTrigger value="monitoring" className="flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white">Monitoring</TabsTrigger>
                    <TabsTrigger value="closing" className="flex-none md:flex-1 whitespace-nowrap px-4 data-[state=active]:bg-[var(--sidebar)] data-[state=active]:text-white">Closing</TabsTrigger>
                </TabsList>
            </div>

            {/* DETAIL TAB (Merged Proposal + Location) */}
            <TabsContent value="detail" className="mt-4">
                <div className="space-y-6">

                    {/* PROPOSAL SECTION */}
                    <Card className="bg-muted/30 border-none shadow-none">
                        <CardHeader className="px-0 pt-0">
                            <CardTitle>{currentStatus === 'active' ? 'Dokumen Kontrak' : 'Dokumen Proposal Project'}</CardTitle>
                            <CardDescription>{currentStatus === 'active' ? 'List Dokumen Kontrak utama yang telah disepakati.' : 'Dokumen proposal yang diajukan ke klien.'}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            {project.supporting_docs && project.supporting_docs.length > 0 ? (
                                <div className="space-y-3">
                                    {project.supporting_docs.map((doc: any, i: number) => (
                                        <div key={i} className="bg-white p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                <div className="bg-orange-50 p-2.5 rounded-lg text-orange-600 shrink-0 border border-orange-100">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-sm">{doc.filename}</h4>
                                                    <Badge variant="secondary" className="mt-1 text-[10px] uppercase font-bold tracking-wider">{doc.type}</Badge>
                                                </div>
                                            </div>
                                            <Button
                                                className="gap-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs shadow-sm"
                                                onClick={() => window.open(doc.url || doc.path, '_blank')}
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Preview
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white p-8 rounded-xl border border-dashed text-center">
                                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <FileText className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900">Belum ada dokumen</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Belum ada dokumen proposal atau TOR yang diunggah.</p>
                                </div>
                            )}
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
                                        <LocationPicker
                                            key={selectedLocIndex}
                                            initialLat={locations[selectedLocIndex]?.lat || -6.2}
                                            initialLng={locations[selectedLocIndex]?.lng || 106.8}
                                            initialAddress={locations[selectedLocIndex]?.address}
                                            readOnly={true}
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
                            {/* Dynamic Timeline Visualization */}
                            {(() => {
                                // Use monitoring list directly. If empty, it will just show start/end points.
                                const data = monitoringList || [];
                                const currentYear = new Date().getFullYear();
                                const startDate = project.start_date ? new Date(project.start_date) : new Date(Number(currentYear), 0, 1);
                                const endDate = project.end_date ? new Date(project.end_date) : new Date(startDate.getFullYear(), 11, 31);

                                return (
                                    <div className="relative w-full overflow-x-auto pb-32 pt-32 px-4">
                                        <div className="min-w-[900px] px-32">
                                            {/* Main Line */}
                                            <div className="relative h-1.5 bg-slate-200 w-full rounded-full mt-12 mb-12">

                                                {/* Start Point Label */}
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                                                    <div className="h-5 w-5 bg-[var(--sidebar)] rounded-full border-4 border-white shadow-md z-10"></div>
                                                    <div className="text-center w-32 absolute top-8">
                                                        <p className="text-sm font-bold text-slate-800">{startDate.getFullYear()}</p>
                                                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">START</p>
                                                        <p className="text-[10px] text-slate-500 mt-0.5 font-medium bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                                                            {startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* End Point Label */}
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex flex-col items-center gap-2">
                                                    <div className="h-5 w-5 bg-slate-600 rounded-full border-4 border-white shadow-md z-10"></div>
                                                    <div className="text-center w-32 absolute top-8">
                                                        <p className="text-sm font-bold text-slate-800">{endDate.getFullYear()}</p>
                                                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">FINISH</p>
                                                        <p className="text-[10px] text-slate-500 mt-0.5 font-medium bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                                                            {endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Data Points */}
                                                {data.map((item: any, index: number) => {
                                                    const start = startDate.getTime();
                                                    const end = endDate.getTime();
                                                    const current = new Date(item.report_date || item.date).getTime();

                                                    // Calculate position (0-100%)
                                                    let percentage = ((current - start) / (end - start)) * 100;
                                                    percentage = Math.max(2, Math.min(98, percentage)); // Clamp to keep inside line

                                                    const isTop = index % 2 === 0;

                                                    return (
                                                        <div
                                                            key={index}
                                                            className="absolute top-1/2 -translate-y-1/2"
                                                            style={{ left: `${percentage}%` }}
                                                        >
                                                            {/* Dot on Line */}
                                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full border-[3px] border-[var(--sidebar)] shadow-md z-10 group-hover:scale-125 transition-transform duration-300"></div>

                                                            {/* Content Card Wrapper */}
                                                            <div className={`absolute flex flex-col items-center w-52 transition-all duration-300 hover:z-30 cursor-pointer group
                                                                ${isTop ? 'bottom-8 left-1/2 -translate-x-1/2 hover:-translate-y-2' : 'top-8 left-1/2 -translate-x-1/2 hover:translate-y-2'}
                                                            `}>
                                                                {/* Dashed Connector Line */}
                                                                <div className={`absolute left-1/2 -translate-x-1/2 w-0 border-l border-dashed border-slate-300 h-8 
                                                                    ${isTop ? 'top-full' : 'bottom-full'}
                                                                `}></div>

                                                                {/* Card Bubble */}
                                                                <div className={`bg-white p-4 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 text-center w-full relative
                                                                    ${isTop ? 'mb-2' : 'mt-2'}
                                                                `}>
                                                                    {/* Little Triangle/Arrow */}
                                                                    <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-slate-100
                                                                         ${isTop ? '-bottom-1.5 border-t-0 border-l-0 shadow-[2px_2px_2px_-1px_rgba(0,0,0,0.05)]' : '-top-1.5 border-b-0 border-r-0 border-t border-l shadow-[-1px_-1px_2px_-1px_rgba(0,0,0,0.05)]'}
                                                                    `}></div>

                                                                    <div className="mb-2 pb-2 border-b border-slate-50">
                                                                        <p className="text-[var(--sidebar)] font-bold text-xl leading-none">
                                                                            {(item.report_date || item.date) ? new Date(item.report_date || item.date).getDate() : '-'}
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                                            {(item.report_date || item.date) ? new Date(item.report_date || item.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : '-'}
                                                                        </p>
                                                                    </div>

                                                                    <h4 className="font-semibold text-xs text-slate-800 line-clamp-1 mb-1">
                                                                        {item.title || "Laporan Monitoring"}
                                                                    </h4>
                                                                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                                                                        {item.notes || "Tidak ada catatan."}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="budget" className="mt-4">
                <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle>Keuangan</CardTitle>
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
                                    Total Anggaran Project
                                </p>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 tracking-tight">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(project.budget_total || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                *Keuangan project.
                            </p>
                        </div>

                        {/* Dokumen RAB Dynamic */}
                        <div className="flex flex-col justify-center p-6 border rounded-xl hover:bg-muted/5 transition-colors h-full bg-white">
                            {(() => {
                                const rabDoc = project.supporting_docs?.find((d: any) => d.type === 'RAB' || d.type === 'Budget');
                                if (rabDoc) {
                                    return (
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 shrink-0 border border-blue-100">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-semibold text-sm text-gray-900 truncate">{rabDoc.filename}</h4>
                                                    <p className="text-xs text-muted-foreground">Document RAB • Ready</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    onClick={() => window.open(rabDoc.url || rabDoc.path, '_blank')}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    onClick={() => window.open(rabDoc.url || rabDoc.path, '_blank')}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="text-center py-4">
                                            <p className="text-sm text-muted-foreground">Belum ada dokumen Rincian Anggaran (RAB).</p>
                                        </div>
                                    );
                                }
                            })()}
                        </div>

                        {/* Budget Partitions */}
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900">Pembagian Anggaran</h4>
                                    <p className="text-xs text-muted-foreground">Rincian alokasi anggaran operasional, manajemen, dan allowance.</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    {localBudgetStatus === 'approved' && (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 uppercase text-[10px]">Telah Disetujui</Badge>
                                    )}
                                    {localBudgetStatus !== 'approved' && canInputBudget && !editPartitions && (
                                        <Button variant="outline" size="sm" onClick={() => setEditPartitions(true)}>
                                            <Pencil className="w-4 h-4 mr-2" /> Atur Anggaran
                                        </Button>
                                    )}
                                    {editPartitions && (
                                        <>
                                            <Button variant="outline" size="sm" onClick={() => setEditPartitions(false)} disabled={savingBudget}>Batal</Button>
                                            <Button size="sm" onClick={handleSaveBudget} disabled={savingBudget}>
                                                {savingBudget ? <Loader className="w-4 h-4 animate-spin" /> : 'Simpan'}
                                            </Button>
                                        </>
                                    )}
                                    {localBudgetStatus !== 'approved' && canApproveBudget && (
                                        <Button size="sm" onClick={handleApproveBudget} disabled={savingBudget} className="bg-green-600 hover:bg-green-700 text-white">
                                            {savingBudget ? <Loader className="w-4 h-4 animate-spin" /> : 'Setujui Pembagian'}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {opsBudget < totalPelaksanaan && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <AlertTitle>Peringatan Anggaran</AlertTitle>
                                            <AlertDescription>
                                                Project activity memiliki pagu lebih besar dari operational, update/ remove project activity terlebih dahulu atau ajukan tambahan budget operational beserta catatannya (jika diperlukan).
                                            </AlertDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="whitespace-nowrap bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                                            onClick={() => setIsRequestBudgetOpen(true)}
                                        >
                                            Ajukan Tambahan
                                        </Button>
                                    </div>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-5 border rounded-xl bg-white shadow-sm space-y-1 hover:border-blue-200 transition-colors">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">Operasional</p>
                                    {editPartitions ? (
                                        <MoneyInput
                                            value={opsBudget}
                                            onValueChange={(values) => {
                                                const val = values.floatValue || 0;
                                                setOpsBudget(val);
                                                if (userRole === 'finance' || userRole === 'superadmin') {
                                                    const allowance = project.budget_total - val - mgmtBudget;
                                                    setAllowanceBudget(allowance > 0 ? allowance : 0);
                                                }
                                            }}
                                            placeholder="Nilai Operasional"
                                            disabled={!isAdminOrFinance}
                                        />
                                    ) : (
                                        <div className="text-xl font-bold text-slate-900 tracking-tight">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(opsBudget)}
                                        </div>
                                    )}
                                    <p className="text-[10px] text-muted-foreground pt-1">Maksimum pagu operasional {(project.budget_total > 0 ? ((opsBudget / project.budget_total) * 100).toFixed(1) : 0)}%</p>
                                </div>
                                <div className="p-5 border rounded-xl bg-white shadow-sm space-y-1 hover:border-purple-200 transition-colors">
                                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-2">Manajemen</p>
                                    {editPartitions ? (
                                        <MoneyInput
                                            value={mgmtBudget}
                                            onValueChange={(values) => {
                                                const val = values.floatValue || 0;
                                                setMgmtBudget(val);
                                                if (userRole === 'finance' || userRole === 'superadmin') {
                                                    const allowance = project.budget_total - opsBudget - val;
                                                    setAllowanceBudget(allowance > 0 ? allowance : 0);
                                                }
                                            }}
                                            placeholder="Nilai Manajemen"
                                            disabled={!isAdminOrFinance}
                                        />
                                    ) : (
                                        <div className="text-xl font-bold text-slate-900 tracking-tight">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(mgmtBudget)}
                                        </div>
                                    )}
                                    <p className="text-[10px] text-muted-foreground pt-1">Pagu manajemen {(project.budget_total > 0 ? ((mgmtBudget / project.budget_total) * 100).toFixed(1) : 0)}%</p>
                                </div>
                                <div className="p-5 border rounded-xl bg-white shadow-sm space-y-1 hover:border-amber-200 transition-colors">
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">Allowance</p>
                                    {editPartitions ? (
                                        <MoneyInput
                                            value={allowanceBudget}
                                            onValueChange={(values) => {
                                                const val = values.floatValue || 0;
                                                setAllowanceBudget(val);
                                                if (userRole === 'finance' || userRole === 'superadmin') {
                                                    const ops = project.budget_total - val - mgmtBudget;
                                                    setOpsBudget(ops > 0 ? ops : 0);
                                                }
                                            }}
                                            placeholder="Nilai Allowance"
                                            disabled={!isAdminOrFinance}
                                        />
                                    ) : (
                                        <div className="text-xl font-bold text-slate-900 tracking-tight">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(allowanceBudget)}
                                        </div>
                                    )}
                                    <p className="text-[10px] text-muted-foreground pt-1">Maksimum pagu allowance {(project.budget_total > 0 ? ((allowanceBudget / project.budget_total) * 100).toFixed(1) : 0)}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Budget Details (Rincian Anggaran - RAB) */}
                        <div className="md:col-span-2 pt-6 border-t mt-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900">Kegiatan Anggaran Proyek</h4>
                                    <p className="text-xs text-muted-foreground">Detail pengelokasian kegiatan anggaran.</p>
                                </div>
                                {canManageDetailBudget && !editDetailBudget && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditDetailBudget(true)}
                                        className="h-8 gap-1.5"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        Edit Rincian
                                    </Button>
                                )}
                            </div>

                            {!editDetailBudget ? (
                                <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-4 py-3 font-medium text-gray-500 w-12 text-center">No</th>
                                                <th className="px-4 py-3 font-medium text-gray-500">Nama Kegiatan</th>
                                                <th className="px-4 py-3 font-medium text-gray-500 text-right">Amount Proposal</th>
                                                <th className="px-4 py-3 font-medium text-gray-500 text-right">Amount Pelaksanaan</th>
                                                <th className="px-4 py-3 font-medium text-gray-500 text-right">Selisih</th>
                                                <th className="px-4 py-3 font-medium text-gray-500">Catatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {detailBudgets.length > 0 ? (
                                                detailBudgets.map((detail, idx) => {
                                                    const proposal = Number(detail.amount_proposal) || 0;
                                                    const pelaksanaan = Number(detail.amount_pelaksanaan) || 0;
                                                    const selisih = proposal - pelaksanaan;
                                                    return (
                                                        <tr key={idx} className="hover:bg-gray-50/50">
                                                            <td className="px-4 py-3 text-center text-muted-foreground">{idx + 1}</td>
                                                            <td className="px-4 py-3 font-medium text-gray-900">{detail.item_name || '-'}</td>
                                                            <td className="px-4 py-3 text-right font-mono">
                                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(proposal)}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-mono">
                                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(pelaksanaan)}
                                                            </td>
                                                            <td className={`px-4 py-3 text-right font-mono font-semibold ${selisih >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(selisih)}
                                                            </td>
                                                            <td className="px-4 py-3 text-muted-foreground">{detail.notes || '-'}</td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground italic">
                                                        Belum ada rincian anggaran.
                                                    </td>
                                                </tr>
                                            )}
                                            {detailBudgets.length > 0 && (
                                                <>
                                                    <tr className="bg-gray-50/80 font-semibold border-t-2">
                                                        <td colSpan={2} className="px-4 py-3 text-right text-gray-700">Total ({project.budget_total > 0 ? ((totalProposal / project.budget_total) * 100).toFixed(1) : 0}%):</td>
                                                        <td className="px-4 py-3 text-right font-mono text-primary">
                                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalProposal)}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-mono text-primary">
                                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalPelaksanaan)}
                                                        </td>
                                                        <td className={`px-4 py-3 text-right font-mono font-bold ${(totalProposal - totalPelaksanaan) >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalProposal - totalPelaksanaan)}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                    <tr className="bg-emerald-50/80 border-t">
                                                        <td colSpan={2} className="px-4 py-3 text-right text-emerald-800 font-bold">Estimasi Profit (Total Pagu - Pelaksanaan) ({project.budget_total > 0 ? ((estimasiProfit / project.budget_total) * 100).toFixed(1) : 0}%):</td>
                                                        <td colSpan={4} className={`px-4 py-3 text-right font-mono text-lg font-bold ${estimasiProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(estimasiProfit)}
                                                        </td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="border rounded-xl p-5 bg-gray-50/50 space-y-4">
                                    <div className="space-y-3">
                                        {detailBudgets.map((detail, idx) => (
                                            <div key={detail.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-muted-foreground">Kegiatan #{idx + 1}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                        onClick={() => {
                                                            const toDelete = detailBudgets[idx];
                                                            const newDetails = detailBudgets.filter((_, i) => i !== idx);
                                                            setDetailBudgets(newDetails);
                                                            if (!toDelete.isNew && toDelete.id) {
                                                                setDeleteDetailBudgets([...deleteDetailBudgets, toDelete.id]);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="md:col-span-2 space-y-1.5">
                                                        <Label className="text-xs text-muted-foreground">Nama Kegiatan</Label>
                                                        <Input
                                                            type="text"
                                                            value={detail.item_name || ''}
                                                            onChange={(e) => {
                                                                const newDetails = [...detailBudgets];
                                                                newDetails[idx].item_name = e.target.value;
                                                                setDetailBudgets(newDetails);
                                                            }}
                                                            placeholder="Sewa Gedung, Konsumsi, dll..."
                                                            className="h-9"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-muted-foreground">Amount Proposal</Label>
                                                        <MoneyInput
                                                            value={detail.amount_proposal || 0}
                                                            onValueChange={(vals) => {
                                                                const newDetails = [...detailBudgets];
                                                                newDetails[idx].amount_proposal = vals.floatValue || 0;
                                                                newDetails[idx].amount = vals.floatValue || 0;
                                                                setDetailBudgets(newDetails);
                                                            }}
                                                            placeholder="0"
                                                            prefix="Rp "
                                                            className="h-9"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-muted-foreground">Amount Pelaksanaan</Label>
                                                        <MoneyInput
                                                            value={detail.amount_pelaksanaan || 0}
                                                            onValueChange={(vals) => {
                                                                const newDetails = [...detailBudgets];
                                                                newDetails[idx].amount_pelaksanaan = vals.floatValue || 0;
                                                                setDetailBudgets(newDetails);
                                                            }}
                                                            placeholder="0"
                                                            prefix="Rp "
                                                            className="h-9"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-1.5">
                                                        <Label className="text-xs text-muted-foreground">Catatan / Keterangan</Label>
                                                        <Input
                                                            type="text"
                                                            value={detail.notes || ''}
                                                            onChange={(e) => {
                                                                const newDetails = [...detailBudgets];
                                                                newDetails[idx].notes = e.target.value;
                                                                setDetailBudgets(newDetails);
                                                            }}
                                                            placeholder="Catatan tambahan (Opsional)..."
                                                            className="h-9"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDetailBudgets([...detailBudgets, { id: crypto.randomUUID(), item_name: '', quantity: null, item_price: 0, amount: 0, amount_pelaksanaan: 0, amount_proposal: 0, notes: '', isNew: true }])}
                                            className="gap-1.5 border-dashed"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Tambah Kegiatan
                                        </Button>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setEditDetailBudget(false);
                                                    // Revert changes from project props
                                                    setDetailBudgets(project.budget_details || []);
                                                    setDeleteDetailBudgets([]);
                                                }}
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleSaveDetailBudget}
                                                disabled={savingDetailBudget}
                                                className="gap-1.5 bg-blue-600 hover:bg-blue-700"
                                            >
                                                {savingDetailBudget ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                                Simpan Rincian
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </CardContent>

                    {/* Payment Terms Section */}
                    <CardContent className="space-y-4 border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Termin Pembayaran</h3>
                                <p className="text-sm text-muted-foreground">Jadwal pembayaran bertahap untuk proyek ini</p>
                            </div>
                        </div>

                        {/* Actual Payment Terms Data */}
                        {(() => {
                            const terms = localPaymentTerms;
                            return terms.length > 0 ? (
                                <div className="space-y-3">
                                    {terms.map((term: any, idx: number) => {
                                        const isVerified = !!term.verified_by;
                                        return (
                                            <div key={term.id} className={`border rounded-xl p-5 bg-white shadow-sm transition-all ${isVerified ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    {/* Left: Term Info */}
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="font-semibold text-base text-gray-900">Termin #{idx + 1}</h4>
                                                            {isVerified ? (
                                                                <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                                                                    <CheckCircle2 className="h-3 w-3" />
                                                                    Verified
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="text-orange-700 border-orange-200 bg-orange-50">
                                                                    Pending
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Nominal</p>
                                                                <p className="font-bold text-gray-900 flex items-center gap-2">
                                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(term.nominal)}
                                                                    {project.budget_total > 0 && (
                                                                        <Badge variant="secondary" className="text-[10px] font-medium px-1.5 py-0 border-gray-200">
                                                                            {((parseFloat(term.nominal) / project.budget_total) * 100).toFixed(1)}%
                                                                        </Badge>
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Jatuh Tempo</p>
                                                                <p className="font-medium text-gray-900">
                                                                    {new Date(term.due_date || term.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Deliverables</p>
                                                                <p className="font-medium text-gray-900">{term.notes}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right: Verification Section (Admin/Finance Only) */}
                                                    {isAdminOrFinance && (
                                                        <div className="flex flex-col gap-3 md:w-64 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-medium text-muted-foreground">Verifikasi Pembayaran</Label>

                                                                {/* Checkbox */}
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`verify-${term.id}`}
                                                                        checked={isVerified}
                                                                        onChange={() => toggleVerification(term.id, isVerified)}
                                                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                                                                    />
                                                                    <label htmlFor={`verify-${term.id}`} className="text-sm font-medium cursor-pointer">
                                                                        {isVerified ? 'Pembayaran Terverifikasi' : 'Tandai sebagai Terverifikasi'}
                                                                    </label>
                                                                </div>

                                                                {/* File Upload */}
                                                                <div className="space-y-1.5">
                                                                    <Label className="text-xs font-medium text-muted-foreground">Bukti Pembayaran</Label>
                                                                    {term.proof_payment ? (
                                                                        <div className="flex items-center gap-2 p-2 bg-gray-50 border rounded-lg">
                                                                            <FileText className="h-4 w-4 text-gray-500" />
                                                                            <span className="text-xs font-medium text-gray-700 flex-1 truncate">Bukti Pembayaran.pdf</span>
                                                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600 hover:text-blue-700" onClick={() => window.open(term.proof_payment_url || term.proof_payment, '_blank')}>
                                                                                <Eye className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        <label className="block">
                                                                            <Input
                                                                                type="file"
                                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                                className="text-xs h-9 cursor-pointer file:cursor-pointer file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-sm file:px-2 file:mr-2 hover:file:bg-gray-200"
                                                                                onChange={(e) => {
                                                                                    const file = e.target.files?.[0];
                                                                                    if (file) handleTerminProofUpload(term.id, file);
                                                                                }}
                                                                            />
                                                                        </label>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Summary Card */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mt-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-900">Total Termin Pembayaran</p>
                                                <p className="text-xs text-blue-700 mt-1">
                                                    {terms.filter((t: any) => t.verified_by).length} dari {terms.length} termin terverifikasi
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-blue-900">
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                                                        terms.reduce((sum: number, term: any) => sum + parseFloat(term.nominal), 0)
                                                    )}
                                                </p>
                                                <p className="text-xs text-blue-700 mt-1">
                                                    {terms.length} termin terjadwal
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed rounded-xl bg-gray-50">
                                    <p className="text-sm text-muted-foreground">Belum ada termin pembayaran yang terdaftar.</p>
                                </div>
                            );
                        })()}
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
                                {/* <div className="space-y-2">
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
                                </div> */}
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
                            <div className="bg-gray-50/30 border border-gray-100 rounded-xl p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-gray-900 font-semibold">Lampiran Dokumen</Label>
                                        <p className="text-[11px] text-muted-foreground">Upload bukti laporan (Foto, PDF, Excel).</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addReportFileRow}
                                        className="h-8 gap-1.5 border-dashed border-gray-300 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors hover:scale-105"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Tambah File
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {reportForm.files.map((file: any) => (
                                        <div key={file.id} className="flex gap-3 items-center group">
                                            <div className="flex-[5]">
                                                <Input
                                                    placeholder="Judul Dokumen (Contoh: Laporan Keuangan)"
                                                    className="h-9 text-sm bg-white"
                                                    value={file.title}
                                                    onChange={(e) => handleReportFileChange(file.id, 'title', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-[6]">
                                                <Input
                                                    type="file"
                                                    className="h-9 w-full text-sm bg-white cursor-pointer file:cursor-pointer file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-sm file:px-3 file:mr-3 hover:file:bg-gray-200 transition-all"
                                                    onChange={(e) => {
                                                        const selectedFile = e.target.files?.[0];
                                                        if (selectedFile) handleReportFileChange(file.id, 'file', selectedFile);
                                                    }}
                                                />
                                                {file.file && (
                                                    <p className="text-[10px] font-medium text-green-600 mt-1 truncate px-1">
                                                        ✓ Terpilih: {file.file.name}
                                                    </p>
                                                )}
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 shrink-0" onClick={() => removeReportFileRow(file.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {reportForm.files.length === 0 && (
                                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center bg-white/50">
                                            <p className="text-xs text-gray-400">Belum ada file dilampirkan. Klik "Tambah File" di atas.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-between border-t p-4 bg-gray-50/50">
                            <p className="text-xs text-muted-foreground">Pastikan data yang diinput sudah benar sebelum submit.</p>
                            <Button
                                onClick={onSubmitReport}
                                disabled={isSubmittingReport}
                                className="bg-[var(--sidebar)] text-white border-1 min-w-[180px] hover:bg-[var(--sidebar)] hover:scale-105"
                            >
                                {isSubmittingReport ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : 'Submit Laporan'}
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
                                {monitoringList.map((history: any) => {
                                    const documents = history.documents || history.files || [];
                                    return (
                                        <Card key={history.id || Math.random()} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                                            {/* Header Card */}
                                            <div className="bg-white p-5 border-b flex flex-col md:flex-row gap-4 justify-between md:items-center">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-base text-gray-900">
                                                            {new Date(history.report_date || history.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                        </h4>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                        <User className="h-3.5 w-3.5 text-gray-400" />
                                                        Dilaporkan oleh: <span className="font-medium text-gray-700">{history.creator?.name || history.uploader_name || history.uploader || '-'}</span> • {new Date(history.report_date || history.date).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                                                        onClick={() => {
                                                            if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
                                                                onDeleteReport?.(history.id);
                                                            }
                                                        }}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>

                                            </div>

                                            {/* Content */}
                                            <div className="p-5 bg-gray-50/30">
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line border-l-2 border-gray-300 pl-3">
                                                        {history.notes}
                                                    </p>
                                                </div>

                                                {documents && documents.length > 0 && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                                        {documents.map((file: any, fIdx: number) => (
                                                            <div key={fIdx} className="flex items-center gap-3 bg-white border rounded p-2.5 hover:border-blue-400 cursor-pointer group transition-colors" onClick={() => window.open(file.url || file.path, '_blank')}>
                                                                <div className="bg-gray-100 p-2 rounded text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600">
                                                                    <FileText className="h-4 w-4" />
                                                                </div>
                                                                <div className="flex-1 overflow-hidden">
                                                                    <p className="text-sm font-medium text-gray-900 truncate">{file.title || file.original_name || file.filename}</p>
                                                                    <p className="text-[10px] text-muted-foreground truncate">{file.original_name ? 'Document' : (file.type || 'Document')}</p>
                                                                </div>
                                                                <Download className="h-4 w-4 text-gray-300 group-hover:text-blue-600" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    );
                                })}
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
                                    value={closingForm.actual_budget}
                                    onValueChange={(values: any) => setClosingForm({ ...closingForm, actual_budget: values.floatValue || 0 })}
                                    placeholder="0"
                                    prefix="Rp "
                                    className="bg-white h-12 text-lg text-left"
                                />
                            </div>

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
                                        {project.documents?.some((d: any) => d.type === 'report_activity') ? (
                                            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-100 rounded-lg">
                                                <FileText className="h-4 w-4 text-green-600" />
                                                <span className="text-xs font-medium text-green-700 flex-1 truncate">Laporan Kegiatan Terupload</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600" onClick={() => window.open(project.documents.find((d: any) => d.type === 'report_activity').url || project.documents.find((d: any) => d.type === 'report_activity').path, '_blank')}>
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        ) : <p className="text-xs text-gray-500">Upload Laporan Kegiatan (PDF).</p>}
                                        <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-full group">
                                            <div className="p-2.5 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                                <Upload className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">{closingForm.files.laporan ? closingForm.files.laporan.name : 'PDF, DOCX, JPG (Max 50MB)'}</p>
                                            <p className="font-medium text-xs text-gray-900 text-center">Klik untuk ganti atau upload baru</p>
                                            <Input type="file" className="hidden" onChange={(e) => setClosingForm({ ...closingForm, files: { ...closingForm.files, laporan: e.target.files?.[0] } })} />
                                        </label>
                                    </div>
                                </div>

                                {/* BAST */}
                                <div className="space-y-3">
                                    <Label className="font-medium">Berita Acara Serah Terima (BAST) <span className="text-red-500">*</span></Label>
                                    <div className="border rounded-xl p-4 bg-white shadow-sm space-y-3">
                                        {project.documents?.some((d: any) => d.type === 'bast') ? (
                                            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-100 rounded-lg">
                                                <FileText className="h-4 w-4 text-green-600" />
                                                <span className="text-xs font-medium text-green-700 flex-1 truncate">BAST Terupload</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600" onClick={() => window.open(project.documents.find((d: any) => d.type === 'bast').url || project.documents.find((d: any) => d.type === 'bast').path, '_blank')}>
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        ) : <p className="text-xs text-gray-500">Upload BAST.</p>}
                                        <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-full group">
                                            <div className="p-2.5 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                                <Upload className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">{closingForm.files.bast ? closingForm.files.bast.name : 'PDF, DOCX, JPG (Max 50MB)'}</p>
                                            <p className="font-medium text-xs text-gray-900 text-center">Klik untuk ganti atau upload baru</p>
                                            <Input type="file" className="hidden" onChange={(e) => setClosingForm({ ...closingForm, files: { ...closingForm.files, bast: e.target.files?.[0] } })} />
                                        </label>
                                    </div>
                                </div>

                                {/* Penagihan */}
                                <div className="space-y-3 md:col-span-2">
                                    <Label className="font-medium">Dokumen Penagihan <span className="text-red-500">*</span></Label>
                                    <div className="border rounded-xl p-4 bg-white shadow-sm space-y-3">
                                        {project.documents?.some((d: any) => d.type === 'invoice') ? (
                                            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-100 rounded-lg">
                                                <FileText className="h-4 w-4 text-green-600" />
                                                <span className="text-xs font-medium text-green-700 flex-1 truncate">Invoice Terupload</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600" onClick={() => window.open(project.documents.find((d: any) => d.type === 'invoice').url || project.documents.find((d: any) => d.type === 'invoice').path, '_blank')}>
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        ) : <p className="text-xs text-gray-500">Invoice / Kwitansi / Bukti Transfer.</p>}
                                        <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-full group">
                                            <div className="p-2.5 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                                <Upload className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">{closingForm.files.penagihan ? closingForm.files.penagihan.name : 'PDF, DOCX, JPG (Max 50MB)'}</p>
                                            <p className="font-medium text-xs text-gray-900 text-center">Klik untuk ganti atau upload baru</p>
                                            <Input type="file" className="hidden" onChange={(e) => setClosingForm({ ...closingForm, files: { ...closingForm.files, penagihan: e.target.files?.[0] } })} />
                                        </label>
                                    </div>
                                </div>

                                {/* Lesson Learned */}
                                <div className="space-y-3 md:col-span-2">
                                    <Label className="font-medium">Lesson Learned <span className="text-muted-foreground font-normal">(Catatan evaluasi dan pembelajaran proyek)</span></Label>
                                    <div className="bg-white rounded-xl shadow-sm border p-4 resize-y overflow-auto min-h-[300px]">
                                        <Editor
                                            defaultValue={closingForm.lesson_learned || ''}
                                            onTextChange={(content: string) => setClosingForm({ ...closingForm, lesson_learned: content })}
                                            ref={quillRef}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="flex flex-col md:flex-row items-center justify-end gap-3 border-t pt-6 transition-all duration-300 mt-8">
                            {/* Logic: Show Deal Button first -> meaningful action -> then show Close/Delete */}
                            {!isProjectDealed ? (
                                <Button
                                    size="lg"
                                    className="gap-2 w-full md:w-auto bg-[#00763c] hover:bg-[#005f30] text-white shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                                    onClick={() => setIsDealAlertOpen(true)}
                                >
                                    <Handshake className="h-5 w-5" />
                                    Deal Project
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="gap-2 w-full md:w-auto hover:bg-gray-50 shadow-sm transition-transform hover:scale-105 active:scale-95"
                                        onClick={handleSaveClosingChanges}
                                        disabled={savingClosing}
                                    >
                                        {savingClosing ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        Simpan Perubahan
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="lg"
                                        className="gap-2 w-full md:w-auto animate-in fade-in zoom-in duration-300 shadow-md hover:scale-105 active:scale-95 transition-transform"
                                        onClick={() => setIsCloseAlertOpen(true)}
                                    >
                                        <Archive className="h-4 w-4" />
                                        Tutup Proyek (Closing)
                                    </Button>
                                </>
                            )}
                        </div>

                    </CardContent>
                </Card>
            </TabsContent>

            {/* Request Additional Budget Modal */}
            <Dialog open={isRequestBudgetOpen} onOpenChange={setIsRequestBudgetOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Ajukan Tambahan Budget Operasional</DialogTitle>
                        <DialogDescription>
                            Silakan masukkan nominal tambahan budget yang dibutuhkan beserta alasannya. Pengajuan ini akan ditambahkan sebagai rincian RAB baru (atau disesuaikan melalui proses approval).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="req-amount">Nominal Tambahan</Label>
                            <MoneyInput
                                id="req-amount"
                                value={requestBudgetAmount}
                                onValueChange={(vals) => setRequestBudgetAmount(vals.floatValue || 0)}
                                placeholder="0"
                                prefix="Rp "
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="req-notes">Catatan / Alasan Tambahan</Label>
                            <Textarea
                                id="req-notes"
                                value={requestBudgetNotes}
                                onChange={(e) => setRequestBudgetNotes(e.target.value)}
                                placeholder="Jelaskan secara singkat mengapa tambahan budget operasional diperlukan..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRequestBudgetOpen(false)} disabled={isSubmittingRequestBudget}>
                            Batal
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={handleRequestAdditionalBudget}
                            disabled={isSubmittingRequestBudget || requestBudgetAmount <= 0}
                        >
                            {isSubmittingRequestBudget ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Mengajukan...
                                </>
                            ) : (
                                'Ajukan Tambahan'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Tabs >
    )
}
