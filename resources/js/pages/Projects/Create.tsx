import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
  Briefcase, Calendar, CheckCircle2, DollarSign, FileText, LayoutDashboard, MapPin,
  MoreVertical, ArrowRight, ArrowLeft, Save, Plus, X, UploadCloud, AlertCircle, Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LocationPicker from '@/components/LocationPicker';
import FileUploadDropzone from '@/components/FileUploadDropzone';

// Helper for Toast
interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

interface CreateProps {
  divisions: any[];
  employees: any[];
}

export default function ProjectsCreate({ divisions, employees }: CreateProps) {
  const [step, setStep] = useState('basic'); // basic, details, budget, locations, review

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    client: '',
    code: '', // Validated on backend usually, but can be input
    description: '',
    division_id: '',
    account_manager_id: '',
    head_id: '',
    pic_id: '',
    status: 'draft',
    project_type: 'pendampingan',
    start_date: '',
    end_date: '',
    budget_total: 0,
    sow: null as File | null,
    locations: [] as any[],
    termin_payments: [] as any[],
    documents: [] as any[], // Supporting docs
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

  // Local state for complex UI interactions before syncing to form data
  const [locations, setPositions] = useState<any[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<{ id: string, nominal: number, notes: string, date: string }[]>([]);
  const [locationInput, setLocationInput] = useState({ lat: -6.2088, lng: 106.8456, address: '' });

  // Sync complex state to form data
  useEffect(() => {
    setData('locations', locations.map(l => ({
      latitude: l.lat,
      longitude: l.lng,
      detail_address: l.address
    })));
  }, [locations]);

  useEffect(() => {
    setData('termin_payments', paymentTerms.map(t => ({
      nominal: t.nominal,
      due_date: t.date,
      notes: t.notes
    })));
  }, [paymentTerms]);

  const handleStepChange = (value: string) => {
    setStep(value);
  };

  const nextStep = () => {
    const steps = ['basic', 'details', 'budget', 'locations', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps = ['basic', 'details', 'budget', 'locations', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const addLocation = () => {
    if (locationInput.address) {
      setPositions([...locations, { ...locationInput, id: Date.now().toString() }]);
      showToast("Lokasi ditambahkan");
      // Reset input handled by LocationPicker effectively
    }
  };

  const removeLocation = (index: number) => {
    setPositions(locations.filter((_, i) => i !== index));
  };

  const addPaymentTerm = () => {
    setPaymentTerms([...paymentTerms, { id: Date.now().toString(), nominal: 0, notes: '', date: '' }]);
  };

  const updatePaymentTerm = (index: number, field: string, value: any) => {
    const newTerms = [...paymentTerms];
    newTerms[index] = { ...newTerms[index], [field]: value };
    setPaymentTerms(newTerms);
  };

  const removePaymentTerm = (index: number) => {
    setPaymentTerms(paymentTerms.filter((_, i) => i !== index));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('projects.store'), {
      onSuccess: () => showToast("Project berhasil dibuat!"),
      onError: (err) => {
        console.error(err);
        showToast("Gagal membuat project. Periksa input anda.", 'error');
      }
    });
  };

  // Calculate totals for budget validation
  const totalTermin = paymentTerms.reduce((sum, term) => sum + Number(term.nominal), 0);
  const budgetRemaining = Number(data.budget_total) - totalTermin;

  return (
    <AppLayout breadcrumbs={[
      { title: 'Projects', href: route('projects.index') },
      { title: 'Create', href: route('projects.create') },
    ]}>
      <Head title="Create Project" />

      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-none p-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Buat Project Baru</h1>
              <p className="text-sm text-muted-foreground">Mulai inisiasi project sosial baru</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => window.history.back()}>Batal</Button>
              <Button onClick={submit} disabled={processing}>
                {processing ? 'Menyimpan...' : 'Simpan Project'}
              </Button>
            </div>
          </div>

          {/* Steps Indicator */}
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
              <Tabs value={step} onValueChange={handleStepChange} className="w-full">

                {/* BASIC INFO */}
                <TabsContent value="basic" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                        Informasi Dasar
                      </CardTitle>
                      <CardDescription>Detail utama identitas project</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1 space-y-2">
                          <Label htmlFor="name">Nama Project <span className="text-red-500">*</span></Label>
                          <Input
                            id="name"
                            placeholder="Contoh: Pendampingan UMKM JaBoDeTaBek"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                          />
                          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="col-span-2 md:col-span-1 space-y-2">
                          <Label htmlFor="client">Klien (Pemberi Kerja) <span className="text-red-500">*</span></Label>
                          <Input
                            id="client"
                            placeholder="Nama instansi/perusahaan klien"
                            value={data.client}
                            onChange={e => setData('client', e.target.value)}
                          />
                          {errors.client && <p className="text-sm text-red-500">{errors.client}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label>Tipe Project</Label>
                          <Select value={data.project_type} onValueChange={v => setData('project_type', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendampingan">Pendampingan</SelectItem>
                              <SelectItem value="survey">Survey / Riset</SelectItem>
                              <SelectItem value="event">Event Organizer</SelectItem>
                              <SelectItem value="csr_management">CSR Management</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Divisi Utama</Label>
                          <Select value={data.division_id} onValueChange={v => setData('division_id', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih divisi" />
                            </SelectTrigger>
                            <SelectContent>
                              {divisions.map((div: any) => (
                                <SelectItem key={div.id} value={div.id.toString()}>{div.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.division_id && <p className="text-sm text-red-500">{errors.division_id}</p>}
                        </div>

                        <div className="col-span-2 space-y-2">
                          <Label>Deskripsi Singkat</Label>
                          <Textarea
                            placeholder="Jelaskan tujuan dan scope project secara singkat..."
                            className="min-h-[100px]"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Tanggal Mulai</Label>
                          <Input
                            type="date"
                            value={data.start_date}
                            onChange={e => setData('start_date', e.target.value)}
                          />
                          {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label>Tanggal Selesai (Estimasi)</Label>
                          <Input
                            type="date"
                            value={data.end_date}
                            onChange={e => setData('end_date', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t p-4">
                      <Button type="button" onClick={nextStep}>
                        Lanjut: Detail & Tim <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* DETAILS & TEAM */}
                <TabsContent value="details" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Tim & Dokumen Awal
                      </CardTitle>
                      <CardDescription>Tunjuk struktur tim dan upload dokumen dasar (SOW/Verifikasi)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label>Account Manager (Sales)</Label>
                          <Select value={data.account_manager_id} onValueChange={v => setData('account_manager_id', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih AM" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map((emp: any) => (
                                <SelectItem key={emp.id} value={emp.id.toString()}>{emp.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.account_manager_id && <p className="text-sm text-red-500">{errors.account_manager_id}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label>Head of Project</Label>
                          <Select value={data.head_id} onValueChange={v => setData('head_id', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Head" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map((emp: any) => (
                                <SelectItem key={emp.id} value={emp.id.toString()}>{emp.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>PIC Project (PM)</Label>
                          <Select value={data.pic_id} onValueChange={v => setData('pic_id', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih PM" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map((emp: any) => (
                                <SelectItem key={emp.id} value={emp.id.toString()}>{emp.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <h3 className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4" /> Upload SOW / Proposal Final
                        </h3>
                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
                          <Input
                            type="file"
                            className="hidden"
                            id="sow-upload"
                            onChange={e => setData('sow', e.target.files ? e.target.files[0] : null)}
                          />
                          <Label htmlFor="sow-upload" className="cursor-pointer flex flex-col items-center">
                            <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm font-medium">Klik untuk upload SOW</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              {data.sow ? data.sow.name : 'PDF/DOCX Max 10MB'}
                            </span>
                          </Label>
                        </div>
                        {/* Supporting Docs */}
                        <div className="space-y-2">
                          <Label>Dokumen Pendukung Lainnya (TOR, KAK, RFP)</Label>
                          <FileUploadDropzone onFilesChange={(files) => {
                            // Map files to the format expected by backend if needed, or just handle array of files
                            const docs = files.map(f => ({ file: f, type: 'other' }));
                            setData('documents', docs);
                          }} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-4">
                      <Button type="button" variant="ghost" onClick={prevStep}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                      </Button>
                      <Button type="button" onClick={nextStep}>
                        Lanjut: Anggaran & Termin <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* BUDGET & TERMIN */}
                <TabsContent value="budget" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Anggaran & Termin Pembayaran
                      </CardTitle>
                      <CardDescription>Total nilai project dan rencana penagihan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-muted/50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-2 w-full">
                          <Label>Total Nilai Project (RAB)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">Rp</span>
                            <Input
                              type="number"
                              className="pl-10 text-lg font-bold"
                              placeholder="0"
                              value={data.budget_total}
                              onChange={e => setData('budget_total', Number(e.target.value))}
                            />
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded border shadow-sm w-full md:w-auto min-w-[200px]">
                          <p className="text-xs text-muted-foreground">Sisa Alokasi Termin</p>
                          <p className={`text-xl font-bold ${budgetRemaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            Rp {budgetRemaining.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm">Rencana Termin (Invoice)</h3>
                          <Button type="button" size="sm" variant="outline" onClick={addPaymentTerm}>
                            <Plus className="h-4 w-4 mr-1" /> Tambah Termin
                          </Button>
                        </div>

                        {paymentTerms.length === 0 && (
                          <div className="text-center py-8 bg-muted/20 border-2 border-dashed rounded-lg">
                            <p className="text-sm text-muted-foreground">Belum ada rencana termin pembayaran.</p>
                          </div>
                        )}

                        <div className="space-y-3">
                          {paymentTerms.map((term, index) => (
                            <div key={term.id} className="grid grid-cols-12 gap-3 items-start bg-card border p-3 rounded-lg shadow-sm">
                              <div className="col-span-1 flex items-center justify-center pt-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="col-span-11 md:col-span-4 space-y-1">
                                <Label className="text-xs">Nominal (Rp)</Label>
                                <Input
                                  type="number"
                                  value={term.nominal}
                                  onChange={(e) => updatePaymentTerm(index, 'nominal', Number(e.target.value))}
                                />
                              </div>
                              <div className="col-span-11 md:col-span-3 space-y-1 md:col-start-6">
                                <Label className="text-xs">Jatuh Tempo</Label>
                                <Input
                                  type="date"
                                  value={term.date}
                                  onChange={(e) => updatePaymentTerm(index, 'date', e.target.value)}
                                />
                              </div>
                              <div className="col-span-11 md:col-span-3 space-y-1">
                                <Label className="text-xs">Keterangan</Label>
                                <Input
                                  placeholder="Misal: DP 30%"
                                  value={term.notes}
                                  onChange={(e) => updatePaymentTerm(index, 'notes', e.target.value)}
                                />
                              </div>
                              <div className="col-span-1 md:col-span-1 flex items-center justify-end pt-6">
                                <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => removePaymentTerm(index)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-4">
                      <Button type="button" variant="ghost" onClick={prevStep}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                      </Button>
                      <Button type="button" onClick={nextStep}>
                        Lanjut: Lokasi <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* LOCATIONS */}
                <TabsContent value="locations" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Titik Lokasi Project
                      </CardTitle>
                      <CardDescription>Tentukan lokasi pelaksanaan (bisa lebih dari satu)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          <Label className="mb-2 block">Pilih di Peta</Label>
                          <LocationPicker
                            onLocationSelect={(lat, lng, address) => {
                              setLocationInput({ lat, lng, address });
                            }}
                            initialLat={locationInput.lat}
                            initialLng={locationInput.lng}
                            initialAddress={locationInput.address}
                            existingLocations={locations}
                          />
                          <div className="mt-2 flex gap-2">
                            <Input
                              value={locationInput.address}
                              readOnly
                              placeholder="Alamat akan muncul disini..."
                              className="flex-1 bg-muted"
                            />
                            <Button type="button" onClick={addLocation} disabled={!locationInput.address}>
                              <Plus className="h-4 w-4 mr-2" /> Tambah Lokasi
                            </Button>
                          </div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 h-full border">
                          <h3 className="font-medium mb-3 flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" /> Daftar Lokasi ({locations.length})
                          </h3>
                          <div className="h-[300px] overflow-y-auto pr-3">
                            <div className="space-y-3">
                              {locations.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-10">Belum ada lokasi ditambahkan.</p>
                              ) : (
                                locations.map((loc, idx) => (
                                  <div key={idx} className="bg-background p-3 rounded border shadow-sm text-sm relative group">
                                    <p className="font-medium line-clamp-2 pr-6">{loc.address}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Lat: {loc.lat.toFixed(6)}, Lng: {loc.lng.toFixed(6)}</p>
                                    <button
                                      type="button"
                                      onClick={() => removeLocation(idx)}
                                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-4">
                      <Button type="button" variant="ghost" onClick={prevStep}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                      </Button>
                      <Button type="button" onClick={nextStep}>
                        Lanjut: Review <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* REVIEW */}
                <TabsContent value="review" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Review & Submit
                      </CardTitle>
                      <CardDescription>Pastikan semua data sudah benar sebelum disimpan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-muted p-4 rounded-lg space-y-2">
                            <h3 className="font-semibold">{data.name || 'Nama Project Belum Diisi'}</h3>
                            <p className="text-sm text-muted-foreground">{data.client}</p>
                            <Badge variant="outline" className="capitalize">{data.project_type}</Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="text-muted-foreground">Budget Total</Label>
                              <p className="font-medium">Rp {Number(data.budget_total).toLocaleString()}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Periode</Label>
                              <p className="font-medium">{data.start_date} s/d {data.end_date}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-sm border-b pb-1">Summary Data</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span>Termin Pembayaran</span>
                              <span className="font-medium">{paymentTerms.length} tahap</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Lokasi Project</span>
                              <span className="font-medium">{locations.length} titik</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Dokumen Pendukung</span>
                              <span className="font-medium">{data.documents ? data.documents.length : 0} file</span>
                            </li>
                          </ul>

                          {budgetRemaining !== 0 && (
                            <div className="bg-yellow-50 text-yellow-800 p-3 rounded text-xs flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                              <span>Warning: Total termin pembayaran belum match dengan total budget project. Selisih: Rp {budgetRemaining.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-4">
                      <Button type="button" variant="ghost" onClick={prevStep}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                      </Button>
                      <Button
                        onClick={submit}
                        className="bg-primary hover:bg-primary/90 min-w-[150px]"
                        disabled={processing}
                      >
                        {processing ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                        ) : (
                          <><Save className="mr-2 h-4 w-4" /> Simpan Project</>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </div>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 text-white animate-in slide-in-from-bottom-5 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
