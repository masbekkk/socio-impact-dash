import React from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ApprovalActions from '@/components/ApprovalActions';
import { ArrowLeft, Download, FileText, CheckCircle, XCircle, Clock, Calendar, User, DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import REIMBURSEMENTS_MOCK from './reimbursements.json';

export default function ReimbursementShow({ reimbursement }: { reimbursement?: any }) {
  // Mock logic: Get ID from URL if prop is missing (client-side simulation)
  let data = reimbursement;
  if (!data && typeof window !== 'undefined') {
    const urlParts = window.location.pathname.split('/');
    const idFromUrl = urlParts[urlParts.length - 1]; // e.g. "ATR-2023-001"
    data = REIMBURSEMENTS_MOCK.find((r) => r.id === idFromUrl);
  }

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
    { title: data?.id || 'Detail', href: '#' },
  ];

  if (!data) {
    return (
      <AppSidebarLayout breadcrumbs={breadcrumbs}>
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-semibold text-muted-foreground">Data Pengajuan Tidak Ditemukan</h2>
          <Button asChild variant="outline">
            <Link href="/reimbursements">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
            </Link>
          </Button>
        </div>
      </AppSidebarLayout>
    )
  }

  const handleApprove = () => {
    alert('Approved (Demo)!');
  };

  const handleReject = (reason?: string) => {
    alert(`Rejected (Demo). Reason: ${reason}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1 px-3 py-1"><CheckCircle className="h-3.5 w-3.5" /> Approved</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 gap-1 px-3 py-1"><XCircle className="h-3.5 w-3.5" /> Rejected</Badge>;
      case 'submitted': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 gap-1 px-3 py-1"><Clock className="h-3.5 w-3.5" /> Submitted</Badge>;
      case 'draft': return <Badge variant="outline" className="gap-1 px-3 py-1"><FileText className="h-3.5 w-3.5" /> Draft</Badge>;
      default: return <Badge variant="secondary" className="gap-1 px-3 py-1">{status}</Badge>;
    }
  }

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail ${data.type} - ${data.id}`} />

      <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-sidebar p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10 bg-background/20 hover:bg-background/40">
              <Link href="/reimbursements">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{data.id}</h1>
                {getStatusBadge(data.status)}
              </div>
              <p className="text-muted-foreground mt-1 text-sm">Diajukan pada {data.request_date}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            {/* Show Actions only if submitted */}
            {data.status === 'submitted' && (
              <ApprovalActions onApprove={handleApprove} onReject={handleReject} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Informasi Pengajuan
                </CardTitle>
                <CardDescription>Detail lengkap mengenai pengajuan reimbursement ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Tipe Pengajuan</label>
                    <div className="font-medium text-base flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">{data.type}</Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Total Nominal</label>
                    <div className="font-bold text-xl text-green-600 flex items-center gap-1">
                      <DollarSign className="h-5 w-5" />
                      Rp {data.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Pemohon</label>
                    <div className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {data.requester}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Proyek Terkait</label>
                    <div className="font-medium">
                      {data.project || '-'}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Deskripsi / Keterangan</label>
                  <div className="p-4 bg-muted/30 rounded-lg text-sm leading-relaxed border border-muted">
                    {data.description}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Dokumen Lampiran ({data.documents?.length || 0})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.documents && data.documents.map((doc: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group">
                        <div className="bg-blue-100 p-2 rounded text-blue-600 group-hover:bg-blue-200 transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc}</p>
                          <p className="text-xs text-muted-foreground">PDF / Image</p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(!data.documents || data.documents.length === 0) && (
                      <div className="text-sm text-muted-foreground italic col-span-2">Tidak ada dokumen dilampirkan.</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Timeline Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-4 ml-2 border-l-2 border-muted space-y-8 py-2">
                  {data.timeline && data.timeline.map((event: any, idx: number) => (
                    <div key={idx} className="relative group">
                      <span className={`absolute -left-[21px] top-1.5 h-3 w-3 rounded-full ring-4 ring-background transition-all
                                    ${event.status.includes('Approved') ? 'bg-green-500' :
                          event.status.includes('Rejected') ? 'bg-red-500' :
                            event.status.includes('Submitted') ? 'bg-blue-500' : 'bg-gray-400'}
                                `} />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium leading-none">{event.status}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <User className="h-3 w-3" /> {event.by}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {event.date}
                        </div>
                        {event.reason && (
                          <div className="mt-2 text-xs bg-red-50 text-red-600 p-2 rounded border border-red-100 italic">
                            " {event.reason} "
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-100 shadow-sm">
              <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <span className="font-semibold block mb-1">Status Pembayaran</span>
                  {data.status === 'approved' ? 'Menunggu proses transfer dari Finance.' : 'Pembayaran akan diproses setelah disetujui.'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}
