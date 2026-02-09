import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, Eye, FileText, Plane, Calendar, User, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

// Mock Data
const MOCK_LEAVES = [
  {
    id: 'L-2025-001',
    type: 'Cuti Tahunan',
    start: '2025-02-20',
    end: '2025-02-22',
    duration: '3 Hari',
    reason: 'Acara keluarga di Bandung',
    status: 'approved',
    approver: 'Budi Santoso (Head)',
    created_at: '2025-02-01'
  },
  {
    id: 'L-2025-002',
    type: 'Cuti Sakit',
    start: '2025-03-01',
    end: '2025-03-02',
    duration: '2 Hari',
    reason: 'Demam tinggi',
    status: 'pending',
    approver: '-',
    created_at: '2025-02-08'
  },
];

const MOCK_TRAVELS = [
  {
    id: 'TR-2025-001',
    destination: 'Surabaya',
    project: 'Pendampingan UMKM',
    start: '2025-04-10',
    end: '2025-04-12',
    duration: '3 Hari',
    purpose: 'Survey lapangan tahap awal',
    status: 'approved',
    approver: 'Director',
    created_at: '2025-01-20'
  }
];

export default function LeaveIndex() {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cuti & Dinas', href: '/leaves' },
  ];

  const [activeTab, setActiveTab] = useState('leave');

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Cuti & Dinas" />

      <div className="p-6 md:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manajemen Cuti & Dinas</h1>
            <p className="text-muted-foreground text-sm md:text-base">Kelola pengajuan cuti dan perjalanan dinas Anda.</p>
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)] transition-transform hover:scale-105 active:scale-95 shadow-sm">
                  <FileText className="h-4 w-4" />
                  Buat Pengajuan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Pilih Jenis Pengajuan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/leaves/create" className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" /> Pengajuan Cuti
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/leaves/create-travel" className="cursor-pointer">
                    <Plane className="mr-2 h-4 w-4" /> Perjalanan Dinas
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="leave" className="gap-2">
              <Calendar className="h-4 w-4" /> Riwayat Cuti
            </TabsTrigger>
            <TabsTrigger value="travel" className="gap-2">
              <Plane className="h-4 w-4" /> Perjalanan Dinas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leave">
            <Card className="border rounded-md">
              <CardHeader>
                <CardTitle className="text-lg">Daftar Pengajuan Cuti</CardTitle>
                <CardDescription>Riwayat pengajuan cuti tahunan, sakit, dan lainnya.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>Kode & Tanggal</TableHead>
                      <TableHead>Jenis Cuti</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_LEAVES.length > 0 ? MOCK_LEAVES.map((item) => (
                      <TableRow key={item.id} className="group">
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-sm">{item.id}</span>
                            <span className="text-xs text-muted-foreground">{item.created_at}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5 text-sm">
                            <span className="font-medium">{item.duration}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(item.end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate text-sm text-muted-foreground" title={item.reason}>{item.reason}</div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                          {item.status === 'approved' && item.approver !== '-' && (
                            <div className="text-[10px] text-muted-foreground mt-1">by {item.approver}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Lihat Detail
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Belum ada data cuti.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="travel">
            <Card className="border rounded-md">
              <CardHeader>
                <CardTitle className="text-lg">Daftar Perjalanan Dinas</CardTitle>
                <CardDescription>Riwayat pengajuan perjalanan dinas luar kantor.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>Kode & Tujuan</TableHead>
                      <TableHead>Proyek</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Keperluan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_TRAVELS.length > 0 ? MOCK_TRAVELS.map((item) => (
                      <TableRow key={item.id} className="group">
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-sm">{item.destination}</span>
                            <span className="text-xs text-muted-foreground">{item.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{item.project}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5 text-sm">
                            <span className="font-medium">{item.duration}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(item.end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate text-sm text-muted-foreground" title={item.purpose}>{item.purpose}</div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                          {item.status === 'approved' && item.approver !== '-' && (
                            <div className="text-[10px] text-muted-foreground mt-1">by {item.approver}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Lihat Detail
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Belum ada data perjalanan dinas.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppSidebarLayout>
  );
}
