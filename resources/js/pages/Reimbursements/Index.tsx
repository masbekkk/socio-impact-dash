import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, Plus, Receipt, Eye, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import REIMBURSEMENTS_MOCK from './reimbursements.json';
import StatusBadge from '@/components/StatusBadge';

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline" | "active" | "inactive" | "pending" | "banned"> = {
  submitted: 'pending',
  approved: 'active',
  rejected: 'destructive',
  draft: 'secondary',
};

export default function ReimbursementsIndex() {
  const [tab, setTab] = useState('atr');
  const [searchQuery, setSearchQuery] = useState('');

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reimbursement', href: '/reimbursements' },
  ];

  // Filter mocks based on tab and search
  const filteredData = REIMBURSEMENTS_MOCK.filter((item) => {
    const matchesTab =
      tab === 'my' ? item.requester === 'Budi Santoso' : // Mock "My" is Budi
        tab === 'approvals' ? item.status === 'submitted' : // Mock "Approvals" are submitted ones
          item.type.toLowerCase() === tab;

    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requester.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Reimbursement" />
      <div className="p-6 md:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reimbursement</h1>
            <p className="text-muted-foreground">Pengelolaan ATR (Advance Travel Request) & EER (Employee Expense Report)</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari pengajuan..."
                className="pl-9 h-10 w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)] transition-transform hover:scale-105 active:scale-95 shadow-sm">
                  <Plus className="h-4 w-4" />
                  Buat Pengajuan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Pilih Jenis Pengajuan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/reimbursements/create/atr" className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" /> Pengajuan ATR
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/reimbursements/create/eer" className="cursor-pointer">
                    <Receipt className="mr-2 h-4 w-4" /> Pengajuan EER
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="atr">ATR</TabsTrigger>
            <TabsTrigger value="eer">EER</TabsTrigger>
            <TabsTrigger value="my">Pengajuan Saya</TabsTrigger>
            <TabsTrigger value="approvals">Persetujuan</TabsTrigger>
          </TabsList>

          <TabsContent value={tab}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">
                  {tab === 'my' ? 'Pengajuan Saya' :
                    tab === 'approvals' ? 'Menunggu Persetujuan' :
                      `Daftar ${tab.toUpperCase()}`}
                </CardTitle>
                <CardDescription>
                  {tab === 'my' ? 'Riwayat pengajuan Anda.' :
                    tab === 'approvals' ? 'Pengajuan yang perlu ditinjau.' :
                      `Data pengajuan ${tab.toUpperCase()} yang terdaftar.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredData.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Pengajuan</TableHead>
                          <TableHead>Tipe</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Pemohon</TableHead>
                          <TableHead>Deskripsi</TableHead>
                          <TableHead>Total Biaya</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium font-mono">{item.id}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.type}</Badge>
                            </TableCell>
                            <TableCell>{item.request_date}</TableCell>
                            <TableCell>{item.requester}</TableCell>
                            <TableCell className="max-w-[200px] truncate" title={item.description}>
                              {item.description}
                            </TableCell>
                            <TableCell>Rp {item.amount.toLocaleString('id-ID')}</TableCell>
                            <TableCell>
                              {/* @ts-ignore */}
                              <StatusBadge status={item.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/reimbursements/${item.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                    Tidak ada data ditemukan.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppSidebarLayout>
  );
}
