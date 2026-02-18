import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Calendar,
  CreditCard,
  Briefcase,
  Building2,
  Download,
  AlertCircle,
  DollarSign,
  MoreVertical
} from 'lucide-react';
import REIMBURSEMENTS_MOCK from './reimbursements.json';

export default function Show() {
  const { slug } = usePage().props as any;
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Find data by slug matching pattern from Index
  const data = REIMBURSEMENTS_MOCK.find(item => {
    const itemSlug = (item.requester + '-' + item.type + '-' + item.id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return itemSlug === slug;
  });

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
    { title: data ? `Detail ${data.type}` : 'Detail', href: '#' },
  ];

  if (!data) {
    return (
      <AppSidebarLayout breadcrumbs={breadcrumbs}>
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <div className="bg-muted p-4 rounded-full">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-muted-foreground">Data Pengajuan Tidak Ditemukan</h2>
          <Button asChild variant="outline">
            <Link href="/reimbursements">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
            </Link>
          </Button>
        </div>
      </AppSidebarLayout>
    );
  }

  // Helper for Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1 px-3 py-1"><CheckCircle className="h-3.5 w-3.5" /> Approved</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 gap-1 px-3 py-1"><XCircle className="h-3.5 w-3.5" /> Rejected</Badge>;
      case 'submitted': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 gap-1 px-3 py-1"><Clock className="h-3.5 w-3.5" /> Submitted</Badge>;
      case 'draft': return <Badge variant="outline" className="gap-1 px-3 py-1"><FileText className="h-3.5 w-3.5" /> Draft</Badge>;
      default: return <Badge variant="secondary" className="gap-1 px-3 py-1">{status}</Badge>;
    }
  };

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail ${data.type} - ${data.id}`} />

      <div className="p-6 md:p-8 space-y-6 w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="h-10 w-10">
              <Link href="/reimbursements">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">Detail {data.type === 'ATR' ? 'Advance Travel Request' : 'Employee Expense Report'}</h1>
                {getStatusBadge(data.status)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm font-mono">
                <FileText className="h-3.5 w-3.5" />
                {data.id}
                <span className="mx-1">•</span>
                <Calendar className="h-3.5 w-3.5" />
                {data.request_date}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreVertical className="mr-2 h-4 w-4" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => alert('Download PDF')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </DropdownMenuItem>
                {data.status === 'submitted' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-green-600 focus:text-green-600 focus:bg-green-50"
                      onClick={() => setApproveDialogOpen(true)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => setRejectDialogOpen(true)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Detail Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Detail Pengajuan {data.type}</CardTitle>
                <CardDescription>Informasi lengkap mengenai pengajuan ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">

                {/* Project Info if available */}
                {data.details?.project_name && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Nama Project</label>
                    <div className="font-medium text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      {data.details.project_name}
                    </div>
                  </div>
                )}

                {/* Sub-Type Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Jenis Pengajuan</label>
                    <div className="font-medium flex items-center gap-2">
                      {data.type === 'ATR' ? (
                        <Badge variant={data.details?.urgency === 'urgent' ? 'destructive' : 'default'} className="capitalize px-3">
                          {data.details?.urgency || 'Normal'} Urgency
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="capitalize px-3 border-blue-200 bg-blue-50 text-blue-700">
                          {data.details?.reimbursement_type || 'General'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {data.details?.financing_category && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Kategori</label>
                      <div className="font-medium">{data.details.financing_category}</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Tanggal Pengajuan</label>
                    <div className="font-medium text-lg">{data.request_date}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Total Biaya</label>
                    <div className="font-bold text-xl text-green-700 font-mono">
                      Rp {data.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase">Keterangan / Alasan</label>
                  <div className="p-4 bg-muted/40 rounded-lg text-sm leading-relaxed border border-muted/60">
                    {data.description}
                    {data.details?.usage_plan && (
                      <>
                        <Separator className="my-3" />
                        <p className="font-medium text-xs text-muted-foreground mb-1">Rencana Penggunaan:</p>
                        {data.details.usage_plan}
                      </>
                    )}
                  </div>
                </div>

                {/* Bank / Payment Info */}
                {(data.details?.bank_name || data.details?.payment_method) && (
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-3">
                    <div className="flex items-center gap-2 text-blue-800 font-medium text-sm">
                      <CreditCard className="h-4 w-4" /> Informasi Pembayaran
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {data.details?.bank_name && (
                        <div>
                          <span className="text-muted-foreground text-xs block">Bank:</span>
                          {data.details.bank_name} - {data.details.account_number}
                          <div className="text-xs text-muted-foreground">a.n {data.details.account_name}</div>
                        </div>
                      )}
                      {data.details?.payment_method && (
                        <div>
                          <span className="text-muted-foreground text-xs block">Metode:</span>
                          {data.details.payment_method}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="space-y-3">
                  <label className="text-xs font-medium text-muted-foreground uppercase">Dokumen Lampiran</label>
                  {data.details?.documents && data.details.documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.details.documents.map((doc: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                          <div className="bg-red-50 p-2 rounded text-red-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc}</p>
                            <p className="text-xs text-muted-foreground">Dokumen Pendukung</p>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">Tidak ada dokumen dilampirkan.</div>
                  )}
                </div>

                {/* Bukti Transfer - Only show for approved status */}
                {data.status === 'approved' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-muted-foreground uppercase">Bukti Transfer</label>
                      <Badge variant="outline" className="text-xs">Finance Only</Badge>
                    </div>

                    {data.details?.transfer_proof ? (
                      <div className="bg-green-50/50 p-4 rounded-lg border border-green-200 space-y-3">
                        <div className="flex items-center gap-2 text-green-800 font-medium text-sm">
                          <CheckCircle className="h-4 w-4" />
                          Transfer Telah Dilakukan
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-white">
                          <div className="bg-green-50 p-2 rounded text-green-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{data.details.transfer_proof}</p>
                            <p className="text-xs text-muted-foreground">Bukti Transfer</p>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        {data.details?.transfer_date && (
                          <div className="text-xs text-muted-foreground">
                            Ditransfer pada: {data.details.transfer_date}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-yellow-50/50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-900">Menunggu Upload Bukti Transfer</p>
                            <p className="text-xs text-yellow-700 mt-1">
                              Finance akan mengupload bukti transfer setelah pembayaran dilakukan.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Employee Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informasi Karyawan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                    {data.requester.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-base">{data.requester}</div>
                    <div className="text-sm text-muted-foreground">{data.details?.division || 'Karyawan'}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{data.details?.nip || '-'}</div>
                  </div>
                </div>
                {data.details?.pic && (
                  <div className="border-t pt-3 mt-2">
                    <div className="text-xs text-muted-foreground mb-1">PIC / Atasan</div>
                    <div className="text-sm font-medium flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {data.details.pic}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-4 ml-1 border-l-2 border-muted space-y-6 py-1">
                  {data.timeline && data.timeline.map((event: any, idx: number) => (
                    <div key={idx} className="relative group">
                      <span className={`absolute -left-[21px] top-1.5 h-3 w-3 rounded-full ring-4 ring-background transition-all ${event.status.toLowerCase().includes('approved') ? 'bg-green-500' : 'bg-blue-500'}`} />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium leading-none">{event.status}</span>
                        <div className="text-xs text-muted-foreground mt-1">{event.date}</div>
                        <div className="text-xs text-muted-foreground">by {event.by}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Konfirmasi Approve
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menyetujui pengajuan <strong>{data.type}</strong> dengan ID <strong className="font-mono">{data.id}</strong>?
              <br /><br />
              Setelah disetujui, pengajuan akan diproses lebih lanjut dan notifikasi akan dikirim ke pemohon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                alert(`Approved: ${data.id}`);
                setApproveDialogOpen(false);
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Ya, Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Konfirmasi Reject
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menolak pengajuan <strong>{data.type}</strong> dengan ID <strong className="font-mono">{data.id}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="rejection_reason">Alasan Penolakan <span className="text-red-500">*</span></Label>
            <Textarea
              id="rejection_reason"
              placeholder="Jelaskan alasan penolakan pengajuan ini..."
              className="min-h-[100px] resize-none"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Alasan penolakan akan dikirim ke pemohon</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setRejectDialogOpen(false);
              setRejectionReason('');
            }}>
              Batal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectionReason.trim()}
              onClick={() => {
                if (rejectionReason.trim()) {
                  alert(`Rejected: ${data.id}\nReason: ${rejectionReason}`);
                  setRejectDialogOpen(false);
                  setRejectionReason('');
                }
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Ya, Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppSidebarLayout>
  );
}
