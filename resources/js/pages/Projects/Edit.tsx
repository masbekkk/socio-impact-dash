import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft, ArrowRight, Save, UploadCloud, FileText, X, Plus, MapPin,
    CheckCircle2, AlertCircle, Loader2, DollarSign, LayoutDashboard, Briefcase
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LocationPicker from '@/components/LocationPicker';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Helper for Toast
interface ToastState {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

interface EditProps {
    project: any;
    divisions: any[];
    employees: any[];
}

export default function ProjectsEdit({ project, divisions, employees }: EditProps) {
    const [step, setStep] = useState('basic');

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: project.name || '',
        client: project.client || '',
        code: project.code || '',
        description: project.description || '',
        division_id: project.division_id ? project.division_id.toString() : '',
        account_manager_id: project.account_manager_id ? project.account_manager_id.toString() : '',
        head_id: project.head_id ? project.head_id.toString() : '',
        pic_id: project.pic_id ? project.pic_id.toString() : '',
        status: project.status || 'draft',
        project_type: project.project_type || 'pendampingan',
        start_date: project.start_date ? project.start_date.split('T')[0] : '',
        end_date: project.end_date ? project.end_date.split('T')[0] : '',
        budget_total: project.budget_total || 0,
        sow: null as File | null,

        // Arrays
        locations: project.locations ? project.locations.map((l: any) => ({
            id: l.id,
            latitude: l.latitude,
            longitude: l.longitude,
            detail_address: l.detail_address
        })) : [],

        termin_payments: project.termin_payments ? project.termin_payments.map((t: any) => ({
            id: t.id,
            nominal: t.nominal,
            due_date: t.due_date ? t.due_date.split('T')[0] : '',
            notes: t.notes
        })) : [],

        documents: [] as { file: File, type: string }[], // New documents to upload

        // Tracker for deletions
        delete_locations: [] as number[],
        delete_termin_payments: [] as number[],
        delete_documents: [] as number[],
    });

    // Local Toast State
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
    };

    // Local State for interactive UI before syncing to data
    const [activeLocations, setActiveLocations] = useState<any[]>(data.locations);
    const [activePayments, setActivePayments] = useState<any[]>(data.termin_payments);

    // Sync local to form data
    useEffect(() => {
        setData('locations', activeLocations);
    }, [activeLocations]);

    useEffect(() => {
        setData('termin_payments', activePayments);
    }, [activePayments]);

    // Location Handlers
    const [locationInput, setLocationInput] = useState({ lat: -6.2088, lng: 106.8456, address: '' });

    const addLocation = () => {
        if (locationInput.address) {
            setActiveLocations([...activeLocations, {
                latitude: locationInput.lat,
                longitude: locationInput.lng,
                detail_address: locationInput.address
            }]);
            showToast("Lokasi ditambahkan");
        }
    };

    const removeLocation = (index: number) => {
        const loc = activeLocations[index];
        if (loc.id) {
            setData('delete_locations', [...data.delete_locations, loc.id]);
        }
        setActiveLocations(activeLocations.filter((_, i) => i !== index));
    };

    // Payment Handlers
    const addPaymentTerm = () => {
        setActivePayments([...activePayments, { nominal: 0, notes: '', due_date: '' }]);
    };

    const updatePaymentTerm = (index: number, field: string, value: any) => {
        const newTerms = [...activePayments];
        newTerms[index] = { ...newTerms[index], [field]: value };
        setActivePayments(newTerms);
    };

    const removePaymentTerm = (index: number) => {
        const term = activePayments[index];
        if (term.id) {
            setData('delete_termin_payments', [...data.delete_termin_payments, term.id]);
        }
        setActivePayments(activePayments.filter((_, i) => i !== index));
    };

    // Document Handlers (Existing docs are not in 'data.documents', only new ones)
    // We display existing docs from project.documents and allow deletion
    const [displayDocs, setDisplayDocs] = useState(project.documents || []);

    const handleDeleteExistingDoc = (docId: number) => {
        setData('delete_documents', [...data.delete_documents, docId]);
        setDisplayDocs(displayDocs.filter((d: any) => d.id !== docId));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.update', project.id), {
            onSuccess: () => showToast("Project berhasil diperbarui!"),
            onError: (err) => {
                console.error(err);
                showToast("Gagal memperbarui project. Periksa input anda.", 'error');
            }
        });
    };

    const nextStep = () => {
        const steps = ['basic', 'details', 'budget', 'locations', 'review'];
        const currentIndex = steps.indexOf(step);
        if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
    };

    const prevStep = () => {
        const steps = ['basic', 'details', 'budget', 'locations', 'review'];
        const currentIndex = steps.indexOf(step);
        if (currentIndex > 0) setStep(steps[currentIndex - 1]);
    };

    const budgetRemaining = Number(data.budget_total) - activePayments.reduce((sum, t) => sum + Number(t.nominal), 0);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Projects', href: route('projects.index') },
            { title: project.code || 'Detail', href: route('projects.show', project.id) },
            { title: 'Edit', href: '#' },
        ]}>
            <Head title={`Edit Project: ${project.name}`} />

            <div className="flex flex-col h-[calc(100vh-4rem)]">
                <div className="flex-none p-6 pb-2">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Edit Project</h1>
                            <p className="text-sm text-muted-foreground">{project.code} - {project.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href={route('projects.show', project.id)}>
                                <Button variant="outline">Batal</Button>
                            </Link>
                            <Button onClick={submit} disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="flex w-full items-center gap-2 py-4 overflow-x-auto">
                        {['basic', 'details', 'budget', 'locations', 'review'].map((s, i) => (
                            <div key={s} className="flex items-center">
                                <button
                                    onClick={() => setStep(s)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step === s
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                        }`}
                                >
                                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                                        {i + 1}
                                    </span>
                                    <span className="capitalize">{s}</span>
                                </button>
                                {i < 4 && <div className="w-8 h-[1px] bg-border mx-2" />}
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto pb-20">
                        <form onSubmit={submit}>
                            <Tabs value={step} onValueChange={setStep} className="w-full">

                                {/* BASIC */}
                                <TabsContent value="basic" className="space-y-6 mt-0">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Informasi Dasar</CardTitle>
                                            <CardDescription>Update identitas utama project</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2 space-y-2">
                                                    <Label>Nama Project</Label>
                                                    <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <Label>Klien</Label>
                                                    <Input value={data.client} onChange={e => setData('client', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Tipe Project</Label>
                                                    <Select value={data.project_type} onValueChange={v => setData('project_type', v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pendampingan">Pendampingan</SelectItem>
                                                            <SelectItem value="survey">Survey / Riset</SelectItem>
                                                            <SelectItem value="event">Event Organizer</SelectItem>
                                                            <SelectItem value="csr_management">CSR Management</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Status</Label>
                                                    <Select value={data.status} onValueChange={v => setData('status', v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="draft">Draft</SelectItem>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="completed">Completed</SelectItem>
                                                            <SelectItem value="hold">Hold</SelectItem>
                                                            <SelectItem value="canceled">Canceled</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Divisi</Label>
                                                    <Select value={data.division_id} onValueChange={v => setData('division_id', v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {divisions.map((d: any) => (
                                                                <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <Label>Deskripsi</Label>
                                                    <Textarea value={data.description} onChange={e => setData('description', e.target.value)} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Start Date</Label>
                                                    <Input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Date</Label>
                                                    <Input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="justify-end border-t p-4">
                                            <Button type="button" onClick={nextStep}>Lanjut <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>

                                {/* DETAILS */}
                                <TabsContent value="details" className="space-y-6 mt-0">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Tim & Dokumen</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <Label>Account Manager</Label>
                                                    <Select value={data.account_manager_id} onValueChange={v => setData('account_manager_id', v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {employees.map((e: any) => (
                                                                <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Head of Project</Label>
                                                    <Select value={data.head_id} onValueChange={v => setData('head_id', v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {employees.map((e: any) => (
                                                                <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>PIC (Project Manager)</Label>
                                                    <Select value={data.pic_id} onValueChange={v => setData('pic_id', v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {employees.map((e: any) => (
                                                                <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <Label>SOW / Proposal</Label>
                                                {project.sow_path && (
                                                    <div className="flex items-center gap-2 p-3 bg-muted rounded">
                                                        <FileText className="h-4 w-4" />
                                                        <span className="text-sm truncate flex-1">{project.sow_original_name || 'Current SOW'}</span>
                                                        <Badge variant="outline">Current</Badge>
                                                    </div>
                                                )}
                                                <Input
                                                    type="file"
                                                    onChange={e => setData('sow', e.target.files ? e.target.files[0] : null)}
                                                />
                                                <p className="text-xs text-muted-foreground">Upload baru untuk mengganti file lama.</p>
                                            </div>

                                            <div className="space-y-4">
                                                <Label>Dokumen Pendukung</Label>
                                                {/* Existing */}
                                                {displayDocs.length > 0 && (
                                                    <div className="space-y-2 mb-4">
                                                        {displayDocs.map((doc: any) => (
                                                            <div key={doc.id} className="flex justify-between items-center p-3 border rounded">
                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                                    <div className="text-sm truncate">
                                                                        <p className="font-medium">{doc.original_name}</p>
                                                                        <p className="text-xs text-muted-foreground">{doc.type}</p>
                                                                    </div>
                                                                </div>
                                                                <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteExistingDoc(doc.id)}>
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {/* New Uploads */}
                                                <FileUploadDropzone onFilesChange={(files) => {
                                                    setData('documents', files.map(f => ({ file: f, type: 'other' })));
                                                }} />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="justify-between border-t p-4">
                                            <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                                            <Button type="button" onClick={nextStep}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>

                                {/* BUDGET */}
                                <TabsContent value="budget" className="space-y-6 mt-0">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Anggaran & Termin</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <Label>Total Budget (RAB)</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-muted-foreground">Rp</span>
                                                    <Input
                                                        type="number"
                                                        className="pl-10 text-lg font-bold"
                                                        value={data.budget_total}
                                                        onChange={e => setData('budget_total', Number(e.target.value))}
                                                    />
                                                </div>
                                                <p className={`text-sm text-right ${budgetRemaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                    Sisa: Rp {budgetRemaining.toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label>Termin Pembayaran</Label>
                                                    <Button type="button" size="sm" variant="outline" onClick={addPaymentTerm}><Plus className="h-4 w-4 mr-1" /> Tambah</Button>
                                                </div>
                                                <div className="space-y-3">
                                                    {activePayments.map((term, idx) => (
                                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded bg-card">
                                                            <div>
                                                                <Label className="text-xs">Nominal</Label>
                                                                <Input type="number" value={term.nominal} onChange={e => updatePaymentTerm(idx, 'nominal', Number(e.target.value))} />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">Jatuh Tempo</Label>
                                                                <Input type="date" value={term.due_date} onChange={e => updatePaymentTerm(idx, 'due_date', e.target.value)} />
                                                            </div>
                                                            <div className="flex gap-2 items-end">
                                                                <div className="flex-1">
                                                                    <Label className="text-xs">Note</Label>
                                                                    <Input value={term.notes} onChange={e => updatePaymentTerm(idx, 'notes', e.target.value)} />
                                                                </div>
                                                                <Button type="button" variant="ghost" size="icon" className="text-red-500 text-xs" onClick={() => removePaymentTerm(idx)}><X className="h-4 w-4" /></Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="justify-between border-t p-4">
                                            <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                                            <Button type="button" onClick={nextStep}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>

                                {/* LOCATIONS */}
                                <TabsContent value="locations" className="space-y-6 mt-0">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Lokasi Project</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                <div className="lg:col-span-2">
                                                    <LocationPicker
                                                        onLocationSelect={(lat, lng, addr) => setLocationInput({ lat, lng, address: addr })}
                                                        initialLat={locationInput.lat}
                                                        initialLng={locationInput.lng}
                                                        initialAddress={locationInput.address}
                                                    />
                                                    <div className="mt-2 flex gap-2">
                                                        <Input readOnly value={locationInput.address} placeholder="Pilih lokasi di peta..." className="bg-muted" />
                                                        <Button type="button" onClick={addLocation} disabled={!locationInput.address}>Tambah</Button>
                                                    </div>
                                                </div>
                                                <div className="border rounded-lg p-4 bg-muted/30">
                                                    <h4 className="font-medium mb-3">Daftar Lokasi</h4>
                                                    <div className="h-[300px] overflow-y-auto pr-2">
                                                        <div className="space-y-3">
                                                            {activeLocations.map((loc, idx) => (
                                                                <div key={idx} className="p-3 bg-white rounded border shadow-sm relative">
                                                                    <p className="text-sm font-medium">{loc.detail_address}</p>
                                                                    <p className="text-xs text-muted-foreground">{Number(loc.latitude).toFixed(4)}, {Number(loc.longitude).toFixed(4)}</p>
                                                                    <button type="button" onClick={() => removeLocation(idx)} className="absolute top-2 right-2 text-red-500"><X className="h-4 w-4" /></button>
                                                                </div>
                                                            ))}
                                                            {activeLocations.length === 0 && <p className="text-muted-foreground text-sm">Belum ada lokasi.</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="justify-between border-t p-4">
                                            <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                                            <Button type="button" onClick={nextStep}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>

                                {/* REVIEW */}
                                <TabsContent value="review" className="space-y-6 mt-0">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Review & Save</CardTitle>
                                            <CardDescription>Pastikan perubahan sudah benar.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="bg-muted p-3 rounded">
                                                    <span className="block text-muted-foreground text-xs">Project Name</span>
                                                    <span className="font-medium">{data.name}</span>
                                                </div>
                                                <div className="bg-muted p-3 rounded">
                                                    <span className="block text-muted-foreground text-xs">Client</span>
                                                    <span className="font-medium">{data.client}</span>
                                                </div>
                                                <div className="bg-muted p-3 rounded">
                                                    <span className="block text-muted-foreground text-xs">Budget</span>
                                                    <span className="font-medium">Rp {Number(data.budget_total).toLocaleString()}</span>
                                                </div>
                                                <div className="bg-muted p-3 rounded">
                                                    <span className="block text-muted-foreground text-xs">Termin</span>
                                                    <span className="font-medium">{activePayments.length} termin</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="justify-between border-t p-4">
                                            <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                                            <Button onClick={submit} className="bg-green-600 hover:bg-green-700 min-w-[150px]">
                                                {processing ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                                Simpan Perubahan
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>

                            </Tabs>
                        </form>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 text-white animate-in slide-in-from-bottom-5 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span className="font-medium">{toast.message}</span>
                </div>
            )}
        </AppLayout>
    );
}
