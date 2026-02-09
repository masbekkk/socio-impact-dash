import React from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ApprovalActions from '@/components/ApprovalActions';
import { ArrowLeft, Download, FileText, CheckCircle, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function ReimbursementShow({ reimbursement }: { reimbursement?: any }) {
  // Mock data if no prop passed (for dev/preview)
  const data = reimbursement || {
    id: 'ATR-2023-001',
    type: 'ATR',
    status: 'submitted',
    amount: 2500000,
    description: 'Pengajuan dana awal untuk Project A',
    requester: 'Budi Santoso',
    date: '2023-10-25',
    documents: ['Proposal_Project_A.pdf', 'RAB_Final.xlsx']
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
    { title: data.id, href: '#' },
  ];

  const handleApprove = () => {
    alert('Approved!');
  };

  const handleReject = (reason?: string) => {
    alert(`Rejected. Reason: ${reason}`);
  };

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail ${data.type}`} />

      <div className="p-6 md:p-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="-ml-2">
              <Link href="/reimbursements">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">{data.id}</h1>
                <Badge variant={data.status === 'submitted' ? 'default' : 'secondary'}>{data.status}</Badge>
              </div>
              <p className="text-muted-foreground text-sm">Detail pengajuan {data.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Download Dokumen
            </Button>
            <ApprovalActions onApprove={handleApprove} onReject={handleReject} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pengajuan</CardTitle>
                <CardDescription>Detail lengkap mengenai pengajuan ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Tipe Pengajuan</h4>
                    <p className="font-medium">{data.type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Total Nominal</h4>
                    <p className="font-medium">Rp {data.amount.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Pemohon</h4>
                    <p className="font-medium">{data.requester}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Tanggal Pengajuan</h4>
                    <p className="font-medium">{data.date}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Keterangan</h4>
                  <p className="text-sm leading-relaxed">{data.description}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Dokumen Lampiran</h4>
                  <div className="flex flex-col gap-2">
                    {data.documents.map((doc: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded border bg-muted/40 text-sm">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Timeline */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Audit</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-6 border-l-2 border-muted pl-4 ml-2">
                  <li className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 ring-4 ring-white" />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Draft Dibuat</span>
                      <span className="text-xs text-muted-foreground">Oleh {data.requester}</span>
                      <span className="text-xs text-muted-foreground">2023-10-24 10:00</span>
                    </div>
                  </li>
                  <li className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Diajukan (Submitted)</span>
                      <span className="text-xs text-muted-foreground">Menunggu persetujuan Head</span>
                      <span className="text-xs text-muted-foreground">2023-10-25 09:30</span>
                    </div>
                  </li>
                  <li className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-muted border border-muted-foreground ring-4 ring-white" />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-muted-foreground">Persetujuan Finance</span>
                      <span className="text-xs text-muted-foreground">Menunggu</span>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}
