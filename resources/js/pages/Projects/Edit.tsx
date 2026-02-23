import React, { useState, useRef, useEffect } from 'react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FileUploadDropzone from '@/components/FileUploadDropzone'
import { Button } from '@/components/ui/button'
import LocationPicker from '@/components/LocationPicker'
import MoneyInput from '@/components/MoneyInput'
import { ArrowLeft, ArrowRight, X, Save, Building2, Plus } from 'lucide-react'
import { Head, Link, usePage, router } from '@inertiajs/react'
import { PROJECT_MAPPINGS } from '@/constants/project-mappings'
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectsEdit({ project_slug, divisions, employees }: { project_slug: string | number, divisions: any[], employees: any[] }) {
    const { props } = usePage<any>();
    const permissions = props.auth?.permissions || [];
    const canUpdateCode = permissions.includes('create_code_project');

    const [project, setProject] = useState<any>(null);
    const [step, setStep] = useState('basic')
    const [budget, setBudget] = useState<number>(0)
    const [status, setStatus] = useState('draft')
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        division_id: '',
        account_manager_id: '',
        head_id: '',
        pic_id: '',
        project_type: '',
        start_date: '',
        end_date: '',
        status: 'active',
    });

    const [sowFile, setSowFile] = useState<File | null>(null);
    const [rabFile, setRabFile] = useState<File | null>(null);

    const [locations, setLocations] = useState<{ id: string, name: string, lat: number, lng: number, address: string }[]>([])
    // State Termin Pembayaran
    const [paymentTerms, setPaymentTerms] = useState<{ id: string, nominal: number, notes: string, date: string, isNew?: boolean }[]>([])
    const [deletePaymentTerms, setDeletePaymentTerms] = useState<string[]>([])

    // Dynamic Docs State
    const [supportingDocs, setSupportingDocs] = useState<{ id: number | string, type: string, file?: File, original_name?: string, path?: string, isExisting?: boolean }[]>([{ id: 1, type: '' }]);
    const addSupportingDoc = () => {
        if (supportingDocs.length < 5) {
            setSupportingDocs([...supportingDocs, { id: Date.now(), type: '' }]);
        }
    };
    const updateSupportingDocType = (id: number | string, type: string) => {
        setSupportingDocs(supportingDocs.map(d => d.id === id ? { ...d, type } : d));
    };
    const removeSupportingDocLocal = (id: number | string) => {
        if (supportingDocs.length > 1) {
            setSupportingDocs(supportingDocs.filter(d => d.id !== id));
        }
    };

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/v1/projects/${project_slug}`);
                const data = response.data.data;
                setProject(data);
                setBudget(data.budget_total);
                setStatus(data.status);
                setFormData({
                    code: data.code || '',
                    name: data.name,
                    description: data.description || '',
                    division_id: data.division_id ? data.division_id.toString() : '',
                    account_manager_id: data.account_manager_id ? data.account_manager_id.toString() : '',
                    head_id: data.head_id ? data.head_id.toString() : '',
                    pic_id: data.pic_id ? data.pic_id.toString() : '',
                    project_type: data.project_type,
                    start_date: data.start_date || '',
                    end_date: data.end_date || '',
                    status: data.status,
                });

                if (data.documents && data.documents.length > 0) {
                    const docs = data.documents.filter((d: any) => !['SOW', 'PROPOSAL', 'KONTRAK', 'RAB'].includes(d.type));
                    if (docs.length > 0) {
                        setSupportingDocs(docs.map((d: any) => ({
                            id: d.id, // Use actual ID for existing docs
                            type: d.type,
                            original_name: d.original_name, // Store original name for display
                            path: d.path,
                            isExisting: true
                        })));
                    } else {
                        setSupportingDocs([{ id: Date.now(), type: '' }]);
                    }
                }

                if (data.locations && data.locations.length > 0) {
                    setLocations(data.locations.map((loc: any) => ({
                        id: loc.id.toString(),
                        name: loc.name || 'Lokasi',
                        lat: parseFloat(loc.latitude),
                        lng: parseFloat(loc.longitude),
                        address: loc.detail_address || ''
                    })));
                }

                if (data.termin_payments && data.termin_payments.length > 0) {
                    setPaymentTerms(data.termin_payments.map((term: any) => ({
                        id: term.id.toString(),
                        nominal: parseFloat(term.nominal),
                        notes: term.notes || '',
                        date: term.due_date || ''
                    })));
                } else {
                    setPaymentTerms([{ id: crypto.randomUUID(), nominal: 0, notes: '', date: '', isNew: true }]);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [project_slug]);

    const addLocation = (lat: number, lng: number, addr: string) => {
        const isDuplicate = locations.some(loc =>
            Math.abs(loc.lat - lat) < 0.0001 && Math.abs(loc.lng - lng) < 0.0001
        );
        if (!isDuplicate) {
            setLocations([...locations, { id: crypto.randomUUID(), name: `Lokasi ${locations.length + 1}`, lat, lng, address: addr }])
        }
    }

    const removeLocation = (id: string) => {
        setLocations(locations.filter(l => l.id !== id))
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Payment Terms Functions
    const addPaymentTerm = () => {
        setPaymentTerms([...paymentTerms, { id: crypto.randomUUID(), nominal: 0, notes: '', date: '', isNew: true }]);
    };
    const removePaymentTerm = (id: string, isNew?: boolean) => {
        if (paymentTerms.length > 1) {
            setPaymentTerms(paymentTerms.filter(t => t.id !== id));
            if (!isNew) {
                setDeletePaymentTerms([...deletePaymentTerms, id]);
            }
        }
    };
    const updatePaymentTerm = (id: string, field: 'nominal' | 'notes' | 'date', value: any) => {
        setPaymentTerms(paymentTerms.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const handleSubmit = async () => {
        setSaving(true);
        setErrors({});

        const submitData = new FormData();
        // Laravel method spoofing for PUT with multipart/form-data
        submitData.append('_method', 'PUT');

        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });

        submitData.append('budget_total', budget.toString());
        submitData.append('status', status);

        let docIndex = 0;

        if (rabFile) {
            submitData.append(`documents[${docIndex}][file]`, rabFile);
            submitData.append(`documents[${docIndex}][type]`, 'RAB');
            docIndex++;
        }

        if (sowFile) {
            submitData.append(`documents[${docIndex}][file]`, sowFile);
            submitData.append(`documents[${docIndex}][type]`, status === 'proposal' ? 'PROPOSAL' : 'KONTRAK');
            docIndex++;
        }

        locations.forEach((loc, index) => {
            submitData.append(`locations[${index}][latitude]`, loc.lat.toString());
            submitData.append(`locations[${index}][longitude]`, loc.lng.toString());
            submitData.append(`locations[${index}][detail_address]`, loc.address);
        });

        supportingDocs.forEach((doc: any) => {
            if (doc.file) {
                submitData.append(`documents[${docIndex}][file]`, doc.file);
                submitData.append(`documents[${docIndex}][type]`, doc.type);
                docIndex++;
            }
        });

        paymentTerms.forEach((term, index) => {
            if (!term.isNew) {
                submitData.append(`termin_payments[${index}][id]`, term.id);
            }
            submitData.append(`termin_payments[${index}][nominal]`, term.nominal.toString());
            submitData.append(`termin_payments[${index}][due_date]`, term.date);
            if (term.notes) submitData.append(`termin_payments[${index}][notes]`, term.notes);
        });

        deletePaymentTerms.forEach((id, index) => {
            submitData.append(`delete_termin_payments[${index}]`, id);
        });

        try {
            await axios.post(`/api/v1/projects/${project_slug}`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            router.visit(`/projects/${project_slug}`);
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error updating project:", error);
            }
        } finally {
            setSaving(false);
        }
    };

    const tabsListRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (tabsListRef.current) {
            const container = tabsListRef.current
            const activeTab = container.querySelector('[data-state="active"]') as HTMLElement
            if (activeTab) {
                const containerRect = container.getBoundingClientRect()
                const activeRect = activeTab.getBoundingClientRect()
                const scrollLeft = container.scrollLeft + (activeRect.left - containerRect.left) - (containerRect.width / 2) + (activeRect.width / 2)
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
            }
        }
    }, [step])

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Proyek', href: '/projects' },
        { title: 'Edit', href: '#' },
    ];

    const stepsList = ['basic', 'stakeholders', 'detail', 'location', 'budget'];

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

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${project.name}`} />

            <div className="flex flex-col h-full">
                {/* Header Section */}
                <div className="bg-background border-b px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/projects">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">Edit Proyek</h1>
                            <p className="text-xs text-muted-foreground hidden sm:block">{project.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">Step {stepsList.indexOf(step) + 1}/5</span>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(stepsList.indexOf(step) + 1) * (100 / 5)}%` }} />
                        </div>
                    </div>
                </div>

                <Tabs value={step} onValueChange={(v) => setStep(v)} className="flex-1 w-full p-6">

                    {/* Tab Navigation */}
                    <div ref={tabsListRef} className="mb-6 w-full overflow-x-auto scrollbar-hide border-b bg-background">
                        <TabsList className="inline-flex h-auto min-w-full w-max md:w-full flex-nowrap gap-2 bg-muted/50 p-1 justify-start md:grid md:grid-cols-5 md:gap-0">
                            {stepsList.map((tabValue, idx) => (
                                <TabsTrigger
                                    key={tabValue}
                                    value={tabValue}
                                    className="flex-none px-4 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm md:flex-1 md:w-auto md:px-3 md:py-2.5 md:text-xs lg:text-sm"
                                >
                                    <span className="mr-1.5 inline md:mr-2">{idx + 1}.</span>
                                    {tabValue === 'basic' ? 'Identitas' : tabValue === 'stakeholders' ? 'Stakeholder' : tabValue === 'detail' ? 'Detail & Proposal' : tabValue === 'location' ? 'Lokasi' : 'Anggaran'}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {/* Step 1: Identitas */}
                    <TabsContent value="basic" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                        <Card className="border-none shadow-md">
                            <CardHeader className="px-6 pt-6 bg-white rounded-t-xl border-b pb-4">
                                <CardTitle>Informasi Dasar</CardTitle>
                                <CardDescription>Perbarui nama dan jenis proyek.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Jenis Project <span className="text-red-500">*</span></Label>
                                        <Select value={formData.project_type} onValueChange={(v) => handleInputChange('project_type', v)}>
                                            <SelectTrigger className={errors.project_type ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih Jenis Project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pendampingan">Pendampingan</SelectItem>
                                                <SelectItem value="pelatihan">Pelatihan</SelectItem>
                                                <SelectItem value="dokumen">Dokumen</SelectItem>
                                                <SelectItem value="event">Event</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.project_type && <p className="text-xs text-red-500">{errors.project_type}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Divisi & Anak Perusahaan <span className="text-red-500">*</span></Label>
                                        <Select value={formData.division_id} onValueChange={(v) => handleInputChange('division_id', v)}>
                                            <SelectTrigger className={errors.division_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih Divisi & Anak Perusahaan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {divisions.map((div) => (
                                                    <SelectItem key={div.id} value={div.id.toString()}>
                                                        {div.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.division_id && <p className="text-xs text-red-500">{errors.division_id}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {canUpdateCode && (
                                        <div className="space-y-2">
                                            <Label>Kode Proyek</Label>
                                            <Input
                                                placeholder="Contoh: PRJ-2024-001"
                                                value={formData.code}
                                                onChange={(e) => handleInputChange('code', e.target.value)}
                                                className={errors.code ? 'border-red-500' : ''}
                                            />
                                            {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
                                        </div>
                                    )}

                                    <div className={`space-y-2 ${!canUpdateCode ? 'md:col-span-2' : ''}`}>
                                        <Label>Nama Project <span className="text-red-500">*</span></Label>
                                        <Input
                                            placeholder="Nama Lengkap Proyek ..."
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl">
                                <Button onClick={() => setStep('stakeholders')} className="w-auto px-8">
                                    Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Step 2: Stakeholders */}
                    < TabsContent value="stakeholders" className="mt-0 focus-visible:ring-0 focus-visible:outline-none" >
                        <Card className="border-none shadow-md">
                            <CardHeader className="px-6 pt-6 bg-white rounded-t-xl border-b pb-4">
                                <CardTitle>Tim & Stakeholder</CardTitle>
                                <CardDescription>Perbarui penanggung jawab dan tim pelaksana.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label>Account Manager <span className="text-red-500">*</span></Label>
                                        <Select value={formData.account_manager_id} onValueChange={(v) => handleInputChange('account_manager_id', v)}>
                                            <SelectTrigger className={errors.account_manager_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih Account Manager" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employees.map((emp) => (
                                                    <SelectItem key={emp.id} value={emp.id.toString()}>{emp.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.account_manager_id && <p className="text-xs text-red-500">{errors.account_manager_id}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Head Implementation <span className="text-red-500">*</span></Label>
                                        <Select value={formData.head_id} onValueChange={(v) => handleInputChange('head_id', v)}>
                                            <SelectTrigger className={errors.head_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih Head Implementation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employees.map((emp) => (
                                                    <SelectItem key={emp.id} value={emp.id.toString()}>{emp.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.head_id && <p className="text-xs text-red-500">{errors.head_id}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>PIC Project <span className="text-red-500">*</span></Label>
                                        <Select value={formData.pic_id} onValueChange={(v) => handleInputChange('pic_id', v)}>
                                            <SelectTrigger className={errors.pic_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih PIC Project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employees.map((emp) => (
                                                    <SelectItem key={emp.id} value={emp.id.toString()}>{emp.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.pic_id && <p className="text-xs text-red-500">{errors.pic_id}</p>}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl">
                                <Button variant="outline" onClick={() => setStep('basic')} title="Kembali">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                                </Button>
                                <Button onClick={() => setStep('detail')} className="w-auto px-8">
                                    Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent >

                    {/* Step 3: Detail & Proposal */}
                    < TabsContent value="detail" className="mt-0 focus-visible:ring-0 focus-visible:outline-none" >
                        <Card className="border-none shadow-md">
                            <CardHeader className="px-6 pt-6 bg-white rounded-t-xl border-b pb-4">
                                <CardTitle>Detail & {status === 'proposal' ? 'Proposal' : 'Dokumen Kontrak'}</CardTitle>
                                <CardDescription>Dokumen {status === 'proposal' ? 'proposal' : 'Kontrak'}, durasi, dan lingkup kerja.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                {/* DOCUMENT UPLOAD SECTION */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>{status === 'active' ? 'Dokumen Kontrak' : 'Dokumen Proposal Project'} <span className="text-red-500">*</span></Label>
                                        <div className={cn("border rounded-lg p-6 space-y-4 hover:bg-muted/30 transition-colors bg-white h-full", errors.sow && 'border-red-500')}>
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">
                                                    {status === 'active' ? 'Upload dokumen Kontrak yang telah disepakati (PDF).' : 'Upload dokumen Proposal lengkap (PDF).'}
                                                </p>
                                                {project.documents?.find((d: any) => ['SOW', 'KONTRAK', 'PROPOSAL'].includes(d.type)) && (
                                                    <p className="text-xs text-blue-600">File saat ini: {project.documents.find((d: any) => ['SOW', 'KONTRAK', 'PROPOSAL'].includes(d.type))?.original_name}</p>
                                                )}
                                            </div>
                                            <FileUploadDropzone onFilesChange={(files) => setSowFile(files[0])} />
                                            {errors.sow && <p className="text-xs text-red-500">{errors.sow}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {/* Optional Doc */}
                                        <Label>Dokumen Lainnya <span className="text-xs font-normal text-muted-foreground ml-1">(Tidak Wajib)</span></Label>

                                        {supportingDocs.map((doc, idx) => {
                                            return (
                                                <div key={doc.id} className="relative border rounded-lg p-5 space-y-3 hover:bg-muted/30 transition-colors bg-white group animate-in fade-in slide-in-from-top-2">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="space-y-2 w-full flex flex-col sm:flex-row justify-between sm:items-center">
                                                            <div>
                                                                <Label className="text-xs font-medium text-muted-foreground">Nama Dokumen Pendukung #{idx + 1}</Label>
                                                                {doc.isExisting && !doc.file && (
                                                                    <p className="text-xs text-blue-600 mt-1">File saat ini: {doc.original_name}</p>
                                                                )}
                                                            </div>
                                                            <Input
                                                                value={doc.type}
                                                                onChange={(e) => updateSupportingDocType(doc.id, e.target.value)}
                                                                placeholder="Masukkan nama dokumen..."
                                                                className="h-8 w-full sm:w-[220px] bg-white border-gray-300 text-xs"
                                                            />
                                                        </div>
                                                        {supportingDocs.length > 1 && (
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 shrink-0 mt-6" onClick={() => removeSupportingDocLocal(doc.id)}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <FileUploadDropzone onFilesChange={(files) => {
                                                        setSupportingDocs(prev => prev.map(d => d.id === doc.id ? { ...d, file: files[0] } : d));
                                                    }} />
                                                </div>
                                            )
                                        })}

                                        {supportingDocs.length < 5 && (
                                            <Button variant="outline" size="sm" onClick={addSupportingDoc} className="w-full border-dashed border-gray-400 text-muted-foreground hover:text-primary hover:border-primary gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                                Tambah Dokumen Lainnya
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Catatan (Notes)</Label>
                                    <Textarea
                                        placeholder="Tambahkan catatan..."
                                        className="min-h-[100px] bg-white"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                    />
                                </div>

                                {/* TIMELINE */}
                                <div className="space-y-2">
                                    <Label>Timeline (Durasi)</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-normal text-muted-foreground">Tanggal Mulai</Label>
                                            <Input
                                                type="date"
                                                className={cn("bg-white", errors.start_date && 'border-red-500')}
                                                value={formData.start_date}
                                                onChange={(e) => handleInputChange('start_date', e.target.value)}
                                            />
                                            {errors.start_date && <p className="text-xs text-red-500">{errors.start_date}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-normal text-muted-foreground">Tanggal Selesai</Label>
                                            <Input
                                                type="date"
                                                className={cn("bg-white", errors.end_date && 'border-red-500')}
                                                value={formData.end_date}
                                                onChange={(e) => handleInputChange('end_date', e.target.value)}
                                            />
                                            {errors.end_date && <p className="text-xs text-red-500">{errors.end_date}</p>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground pt-1">Estimasi durasi pelaksanaan.</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl">
                                <Button variant="outline" onClick={() => setStep('stakeholders')} title="Kembali">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                                </Button>
                                <Button onClick={() => setStep('location')} className="w-auto px-8">
                                    Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent >

                    {/* Step 4: Location (SEPARATE TAB) */}
                    < TabsContent value="location" className="mt-0 focus-visible:ring-0 focus-visible:outline-none" >
                        <Card className="border-none shadow-md">
                            <CardHeader className="px-6 pt-6 bg-white rounded-t-xl border-b pb-4">
                                <CardTitle>Lokasi Pelaksanaan</CardTitle>
                                <CardDescription>Kelola titik lokasi proyek (Multi-location).</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 md:p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* List Lokasi */}
                                    <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
                                        <div className="flex items-center justify-between">
                                            <Label>Daftar Lokasi ({locations.length})</Label>
                                        </div>
                                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                            {locations.length === 0 ? (
                                                <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground text-sm bg-gray-50">
                                                    Belum ada lokasi dipilih. <br />
                                                    Klik peta untuk menambahkan.
                                                </div>
                                            ) : (
                                                locations.map((loc, idx) => (
                                                    <div key={loc.id} className="p-3 border rounded-lg bg-white shadow-sm group hover:border-primary transition-colors">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-semibold text-sm">Titik {idx + 1}</span>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-500 -mt-1 -mr-1" onClick={() => removeLocation(loc.id)}>
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground line-clamp-2" title={loc.address}>{loc.address || 'Alamat tidak terdeteksi'}</p>
                                                        <div className="mt-2 flex gap-2 text-[10px] items-center text-gray-500 font-mono">
                                                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">{loc.lat.toFixed(6)}</span>
                                                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">{loc.lng.toFixed(6)}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Picker */}
                                    <div className="lg:col-span-2 order-1 lg:order-2">
                                        <div className="border rounded-lg p-1 bg-white h-full min-h-[400px]">
                                            <LocationPicker
                                                onLocationSelect={(lat, lng, address) => addLocation(lat, lng, address)}
                                                initialLat={locations[0]?.lat || -6.200000}
                                                initialLng={locations[0]?.lng || 106.816666}
                                                existingLocations={locations}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl">
                                <Button variant="outline" onClick={() => setStep('detail')} title="Kembali">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                                </Button>
                                <Button onClick={() => setStep('budget')} className="w-auto px-8">
                                    Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent >

                    {/* Step 5: Budget */}
                    < TabsContent value="budget" className="mt-0 focus-visible:ring-0 focus-visible:outline-none" >
                        <Card className="border-none shadow-md">
                            <CardHeader className="px-6 pt-6 bg-white rounded-t-xl border-b pb-4">
                                <CardTitle>Anggaran & Keuangan</CardTitle>
                                <CardDescription>Masukkan Nominal dan lampirkan rincian anggaran (RAB).</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 space-y-6">

                                {/* Main Budget Section (Gray Box like screenshot) */}
                                <div className="bg-gray-50 border rounded-xl p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                                        {/* Left: Input Section */}
                                        <div className="flex-1 space-y-4 w-full">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-semibold text-gray-900">Nominal Project</h3>
                                            </div>

                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold z-10">Rp</span>
                                                <MoneyInput
                                                    value={budget}
                                                    onValueChange={(vals) => setBudget(vals.floatValue || 0)}
                                                    placeholder="0"
                                                    className="pl-12 text-xl font-bold h-14 bg-white border-gray-200 shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Right: Visualization Card */}
                                        <div className="w-full md:w-[320px] shrink-0">
                                            <div className="bg-white border rounded-xl p-6 shadow-sm text-center space-y-2">
                                                <p className="text-sm text-gray-500 font-medium">Total Anggaran Project</p>
                                                <div className="text-3xl font-bold text-red-600 tracking-tight">
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(budget).replace('Rp', 'Rp ')}
                                                </div>
                                                <p className="text-xs text-muted-foreground pt-1">
                                                    100% dari Total Project
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload RAB & Negotiation */}
                                <div className={`grid grid-cols-1 ${status !== 'proposal' ? 'md:grid-cols-2' : ''} gap-6 pt-2`}>
                                    {/* RAB */}
                                    <div className="space-y-2">
                                        <Label>Rincian Anggaran (RAB)</Label> <span className="text-red-500">*</span>
                                        <div className={cn("border border-dashed border-gray-300 rounded-lg p-6 space-y-4 hover:bg-gray-50 transition-colors bg-white h-full", errors['documents.0.file'] && 'border-red-500')}>
                                            <div className="flex items-center gap-4">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-medium text-gray-900">Upload File RAB.</h4>
                                                    <p className="text-xs text-muted-foreground">Lampirkan detail Rencana Anggaran Biaya.</p>
                                                    {project.documents?.find((d: any) => d.type === 'RAB') && (
                                                        <p className="text-xs text-blue-600">File saat ini: {project.documents.find((d: any) => d.type === 'RAB').original_name}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <FileUploadDropzone onFilesChange={(files) => setRabFile(files[0])} />
                                            {errors['documents.0.file'] && <p className="text-xs text-red-500">{errors['documents.0.file']}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Termin Pembayaran Section */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="text-base font-semibold">Termin Pembayaran</Label>
                                            <p className="text-xs text-muted-foreground mt-1">Atur jadwal pembayaran bertahap untuk proyek ini.</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addPaymentTerm}
                                            className="gap-2 border-dashed hover:border-solid"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Tambah Termin
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {paymentTerms.map((term, idx) => (
                                            <div key={term.id} className="border rounded-xl p-5 bg-white shadow-sm space-y-4 group hover:border-gray-300 transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-sm text-gray-900">Termin #{idx + 1}</h4>
                                                    {paymentTerms.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removePaymentTerm(term.id, term.isNew)}
                                                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {/* Nominal */}
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-medium text-muted-foreground">Nominal Pembayaran</Label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-sm z-10">Rp</span>
                                                            <MoneyInput
                                                                value={term.nominal}
                                                                onValueChange={(vals) => updatePaymentTerm(term.id, 'nominal', vals.floatValue || 0)}
                                                                placeholder="0"
                                                                className="pl-10 bg-white h-10"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Tanggal */}
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-medium text-muted-foreground">Tanggal Jatuh Tempo</Label>
                                                        <Input
                                                            type="date"
                                                            value={term.date}
                                                            onChange={(e) => updatePaymentTerm(term.id, 'date', e.target.value)}
                                                            className="bg-white h-10"
                                                        />
                                                    </div>

                                                    {/* Notes */}
                                                    <div className="space-y-2 md:col-span-1">
                                                        <Label className="text-xs font-medium text-muted-foreground">Keterangan</Label>
                                                        <Input
                                                            type="text"
                                                            value={term.notes}
                                                            onChange={(e) => updatePaymentTerm(term.id, 'notes', e.target.value)}
                                                            placeholder="Contoh: DP 30%, Pelunasan, dll"
                                                            className="bg-white h-10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">Total Termin Pembayaran</p>
                                            <p className="text-xs text-blue-700 mt-0.5">{paymentTerms.length} termin terjadwal</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-blue-900">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                                                    paymentTerms.reduce((sum, term) => sum + (term.nominal || 0), 0)
                                                )}
                                            </p>
                                            <p className="text-xs text-blue-700">
                                                {budget > 0 ? `${((paymentTerms.reduce((sum, term) => sum + (term.nominal || 0), 0) / budget) * 100).toFixed(1)}% dari total` : '0%'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </CardContent>
                            <CardFooter className="flex justify-between gap-3 px-6 pb-6 pt-2 border-t bg-gray-50/50 rounded-b-xl">
                                <Button variant="outline" onClick={() => setStep('location')} title="Kembali">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    className="w-auto px-8 min-w-32 bg-green-600 hover:bg-green-700 hover:scale-105 transition-transform"
                                >
                                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent >

                </Tabs >
            </div >
        </AppSidebarLayout >
    )
}
