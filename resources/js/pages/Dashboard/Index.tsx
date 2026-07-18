import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, CardAction } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, TrendingUp, TrendingDown, Clock, Users, Building2, FileText, Banknote, CheckCircle2, Wallet, Receipt, PieChart } from 'lucide-react';
import { type SharedData } from '@/types';
import { usePermission } from '@/hooks/use-permission';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RealTimeClockSimple = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span suppressHydrationWarning className="tabular-nums tracking-tight">
      {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}
    </span>
  );
};

import { ApprovalStatisticCard } from '@/components/dashboard/ApprovalStatisticCard';
import { BulkApprovalModal } from '@/components/dashboard/BulkApprovalModal';

interface AccountManagerLeaderboardEntry {
  id: number;
  name: string;
  total_budget: number;
  atr_expenses: number;
  eer_expenses: number;
  allowance_expenses: number;
  total_expenses: number;
  profit: number;
  utilization_percentage: number;
}

interface DivisionLeaderboardEntry {
  division: string;
  total_budget: number;
}

interface ProjectLocation {
  id: number;
  project_id: number;
  latitude: number;
  longitude: number;
  detail_address: string;
  project: {
    id: number;
    name: string;
  };
}

interface DivisionEntry {
  division: string;
  count: number;
}

interface ApprovalItem {
  id: number;
  code: string;
  type: string;
  amount: string;
  user: { name: string };
  project: { name: string };
  start_date?: string;
  end_date?: string;
}

interface YearlySummary {
  year: number | string;
  total_budget: number;
  atr_expenses: number;
  eer_expenses: number;
  allowance_expenses: number;
  total_management_budget: number;
  total_expenses: number;
  remaining_profit: number;
  utilization_percentage: number;
  remaining_percentage: number;
}

interface DashboardProps extends SharedData {
  totalUsers: number;
  totalDivisions: number;
  totalLetterRequests: number;
  totalYearClaims: number;
  yearlySummary?: YearlySummary;
  accountManagerLeaderboard: AccountManagerLeaderboardEntry[];
  divisionLeaderboard: DivisionLeaderboardEntry[];
  locations: ProjectLocation[];
  projectsByDivision: DivisionEntry[];
  approvalItems: {
    head_reimbursements: ApprovalItem[];
    head_leaves: ApprovalItem[];
    finance_reimbursements: ApprovalItem[];
    direktur_reimbursements: ApprovalItem[];
    direktur_leaves: ApprovalItem[];
    hr_leaves: ApprovalItem[];
    hr_allowances: ApprovalItem[];
    finance_request_funds: ApprovalItem[];
  };
  availableYears: number[];
  selectedYear: number | null;
  totalBudget?: number;
  totalManagementBudget?: number;
}

export default function Dashboard({
  totalUsers,
  totalDivisions,
  totalLetterRequests,
  totalYearClaims: initialTotalYearClaims,
  yearlySummary: initialYearlySummary,
  accountManagerLeaderboard: initialAccountManagerLeaderboard,
  divisionLeaderboard: initialDivisionLeaderboard,
  locations,
  projectsByDivision,
  approvalItems,
  availableYears,
  selectedYear: initialSelectedYear,
  totalBudget,
  totalManagementBudget,
}: DashboardProps) {
  const { hasRole } = usePermission();
  const isPegawai = hasRole('pegawai') && !hasRole('superadmin');

  const [localYear, setLocalYear] = useState<string>(String(initialSelectedYear ?? 'all'));
  const [totalYearClaims, setTotalYearClaims] = useState(initialTotalYearClaims);
  const [yearlySummary, setYearlySummary] = useState<YearlySummary | undefined>(initialYearlySummary);
  const [accountManagerLeaderboard, setAccountManagerLeaderboard] = useState(initialAccountManagerLeaderboard);
  const [divisionLeaderboard, setDivisionLeaderboard] = useState(initialDivisionLeaderboard);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  const fetchLeaderboard = useCallback(async (year: string) => {
    setLeaderboardLoading(true);
    try {
      const params = year === 'all' ? {} : { year };
      const res = await axios.get('/api/v1/dashboard/leaderboard', { params });
      setTotalYearClaims(res.data.totalYearClaims);
      if (res.data.yearlySummary) setYearlySummary(res.data.yearlySummary);
      setAccountManagerLeaderboard(res.data.accountManagerLeaderboard);
      setDivisionLeaderboard(res.data.divisionLeaderboard);
    } catch {
      // silently fail, keep current data
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ title: string; items: any[]; type: 'reimbursement' | 'leave', role: string, actionType?: 'approve' | 'request_fund' }>({
    title: '',
    items: [],
    type: 'reimbursement',
    role: '',
    actionType: 'approve'
  });

  const openApprovalModal = (title: string, items: any[], type: 'reimbursement' | 'leave', role: string, actionType: 'approve' | 'request_fund' = 'approve') => {
    setModalData({ title, items, type, role, actionType });
    setModalOpen(true);
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
  ];

  const totalProjectsCount = useMemo(() => {
    return projectsByDivision?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  }, [projectsByDivision]);

  const projectsByDivisionWithPercentage = useMemo(() => {
    const colors = ['#1b4841', '#00733c', '#00a549', '#8cbe3b', '#cee5ad'];
    return projectsByDivision?.map((item, index) => ({
      ...item,
      percentage: totalProjectsCount > 0 ? Math.round((item.count / totalProjectsCount) * 100) : 0,
      fill: colors[index % colors.length]
    })) ?? [];
  }, [projectsByDivision, totalProjectsCount]);

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="p-6 md:p-8 space-y-6">

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="bg-[var(--sidebar)] border-none shadow-md text-white">
            <CardHeader>
              <CardDescription className="text-emerald-100/90">Presensi</CardDescription>
              <CardTitle className="text-2xl text-white font-semibold flex flex-col gap-1">
                <span suppressHydrationWarning className="text-lg font-normal opacity-90">
                  {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </CardTitle>
              <CardAction>
                <Badge variant="outline" className="text-white border-white/20 bg-white/5">
                  <Clock className="h-4 w-4 mr-1" />
                  <RealTimeClockSimple />
                  WIB
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 text-sm mt-auto pb-4">
              <Link href="/presences/create" className="w-full">
                <div className="bg-white text-[#1a5f4a] hover:bg-emerald-50 w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-95 hover:scale-105">
                  <MapPin className="h-4 w-4" /> Presensi
                </div>
              </Link>
            </CardFooter>
          </Card>

          {!isPegawai && (
            <>
              <Card className="bg-white shadow-md border-0 flex flex-col justify-between">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                  <Users className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-800">{totalUsers}</div>
                </CardContent>
                <CardFooter className="pt-0"><div className="text-xs text-muted-foreground">Aktif di sistem</div></CardFooter>
              </Card>

              <Card className="bg-white shadow-md border-0 flex flex-col justify-between">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Divisions</CardTitle>
                  <Building2 className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-800">{totalDivisions}</div>
                </CardContent>
                <CardFooter className="pt-0"><div className="text-xs text-muted-foreground">Struktur organisasi</div></CardFooter>
              </Card>

              <Card className="bg-white shadow-md border-0 flex flex-col justify-between">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Letter Requests</CardTitle>
                  <FileText className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-800">{totalLetterRequests}</div>
                </CardContent>
                <CardFooter className="pt-0"><div className="text-xs text-muted-foreground">Dibuat via sistem</div></CardFooter>
              </Card>
            </>
          )}
        </div>

        {/* Approval Statistics Section */}
        {(!isPegawai || hasRole(['head', 'finance', 'direktur', 'hr'])) && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#1a5f4a]" />
              Persetujuan Terpending
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Role: Head */}
              {hasRole('head') && (
                <>
                  <ApprovalStatisticCard
                    title="ATR Menunggu Approval (Head)"
                    count={approvalItems.head_reimbursements.filter(i => i.type === 'atr').length}
                    color="emerald"
                    onClick={() => openApprovalModal("ATR Menunggu Approval (Head)", approvalItems.head_reimbursements.filter(i => i.type === 'atr'), 'reimbursement', 'head')}
                    icon={<Banknote className="h-4 w-4" />}
                  />
                  <ApprovalStatisticCard
                    title="EER Menunggu Approval (Head)"
                    count={approvalItems.head_reimbursements.filter(i => i.type === 'eer').length}
                    color="emerald"
                    onClick={() => openApprovalModal("EER Menunggu Approval (Head)", approvalItems.head_reimbursements.filter(i => i.type === 'eer'), 'reimbursement', 'head')}
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <ApprovalStatisticCard
                    title="Allowance Menunggu Approval (Head)"
                    count={approvalItems.head_reimbursements.filter(i => i.type === 'allowance').length}
                    color="emerald"
                    onClick={() => openApprovalModal("Allowance Menunggu Approval (Head)", approvalItems.head_reimbursements.filter(i => i.type === 'allowance'), 'reimbursement', 'head')}
                    icon={<Users className="h-4 w-4" />}
                  />
                  <ApprovalStatisticCard
                    title="Cuti Menunggu Approval (Head)"
                    count={approvalItems.head_leaves.length}
                    color="emerald"
                    onClick={() => openApprovalModal("Cuti Menunggu Approval (Head)", approvalItems.head_leaves, 'leave', 'head')}
                    icon={<Clock className="h-4 w-4" />}
                  />
                </>
              )}

              {/* Role: Finance */}
              {hasRole('finance') && (
                <>
                  <ApprovalStatisticCard
                    title="ATR Menunggu Approval (Finance)"
                    count={approvalItems.finance_reimbursements.filter(i => i.type === 'atr').length}
                    color="blue"
                    onClick={() => openApprovalModal("ATR Menunggu Approval (Finance)", approvalItems.finance_reimbursements.filter(i => i.type === 'atr'), 'reimbursement', 'finance')}
                    icon={<Banknote className="h-4 w-4" />}
                  />
                  <ApprovalStatisticCard
                    title="EER Menunggu Approval (Finance)"
                    count={approvalItems.finance_reimbursements.filter(i => i.type === 'eer').length}
                    color="blue"
                    onClick={() => openApprovalModal("EER Menunggu Approval (Finance)", approvalItems.finance_reimbursements.filter(i => i.type === 'eer'), 'reimbursement', 'finance')}
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <ApprovalStatisticCard
                    title="Allowance Menunggu Approval (Finance)"
                    count={approvalItems.finance_reimbursements.filter(i => i.type === 'allowance').length}
                    color="blue"
                    onClick={() => openApprovalModal("Allowance Menunggu Approval (Finance)", approvalItems.finance_reimbursements.filter(i => i.type === 'allowance'), 'reimbursement', 'finance')}
                    icon={<Users className="h-4 w-4" />}
                  />
                  <ApprovalStatisticCard
                    title="Request Fund Pending (Finance)"
                    count={approvalItems.finance_request_funds.length}
                    color="orange"
                    onClick={() => openApprovalModal("Request Fund Pending (Finance)", approvalItems.finance_request_funds, 'reimbursement', 'finance', 'request_fund')}
                    icon={<Banknote className="h-4 w-4" />}
                  />
                </>
              )}

              {/* Role: Direktur */}
              {hasRole('direktur') && (
                <>
                  <ApprovalStatisticCard
                    title="ATR Menunggu Approval (Direktur)"
                    count={approvalItems.direktur_reimbursements.filter(i => i.type === 'atr').length}
                    color="amber"
                    onClick={() => openApprovalModal("ATR Menunggu Approval (Direktur)", approvalItems.direktur_reimbursements.filter(i => i.type === 'atr'), 'reimbursement', 'direktur')}
                    icon={<Banknote className="h-4 w-4" />}
                  />
                  <ApprovalStatisticCard
                    title="EER Menunggu Approval (Direktur)"
                    count={approvalItems.direktur_reimbursements.filter(i => i.type === 'eer').length}
                    color="amber"
                    onClick={() => openApprovalModal("EER Menunggu Approval (Direktur)", approvalItems.direktur_reimbursements.filter(i => i.type === 'eer'), 'reimbursement', 'direktur')}
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <ApprovalStatisticCard
                    title="Allowance Menunggu Approval (Direktur)"
                    count={approvalItems.direktur_reimbursements.filter(i => i.type === 'allowance').length}
                    color="amber"
                    onClick={() => openApprovalModal("Allowance Menunggu Approval (Direktur)", approvalItems.direktur_reimbursements.filter(i => i.type === 'allowance'), 'reimbursement', 'direktur')}
                    icon={<Users className="h-4 w-4" />}
                  />
                  <ApprovalStatisticCard
                    title="Cuti Menunggu Approval (Direktur)"
                    count={approvalItems.direktur_leaves.length}
                    color="amber"
                    onClick={() => openApprovalModal("Cuti Menunggu Approval (Direktur)", approvalItems.direktur_leaves, 'leave', 'direktur')}
                    icon={<Clock className="h-4 w-4" />}
                  />
                </>
              )}

              {/* Role: HR */}
              {hasRole('hr') && (
                <>
                  <ApprovalStatisticCard
                    title="Cuti Menunggu Approval (HR)"
                    count={approvalItems.hr_leaves.length}
                    color="rose"
                    onClick={() => openApprovalModal("Cuti Menunggu Approval (HR)", approvalItems.hr_leaves, 'leave', 'hr')}
                    icon={<Clock className="h-4 w-4" />}
                  />
                  <ApprovalStatisticCard
                    title="Allowance Menunggu Approval (HR)"
                    count={approvalItems.hr_allowances.length}
                    color="rose"
                    onClick={() => openApprovalModal("Allowance Menunggu Approval (HR)", approvalItems.hr_allowances, 'reimbursement', 'hr')}
                    icon={<Users className="h-4 w-4" />}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {!isPegawai && (
          <>
            {/* Top Budget Contributors - Split View */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Total Tahun Anggaran</span>
                <span className="text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  {formatIDR(totalYearClaims || 0)}
                  {localYear !== 'all' && <span className="font-normal text-purple-500 ml-1">({localYear})</span>}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Filter Tahun:</span>
                <Select
                  value={localYear}
                  onValueChange={(val) => {
                    setLocalYear(val);
                    fetchLeaderboard(val);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Semua Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {availableYears.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {yearlySummary && (
              <div className={`space-y-4 mb-6 transition-opacity duration-300 ${leaderboardLoading ? 'opacity-60' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Total Budget */}
                  <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="p-5 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold text-emerald-800">Total Budget</CardTitle>
                        <div className="bg-emerald-100 p-2 rounded-full">
                          <Wallet className="h-4 w-4 text-emerald-700" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <div className="text-2xl font-bold text-emerald-900 truncate">
                        {formatIDR(yearlySummary.total_budget)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Total allocated budget for {yearlySummary.year === 'all' ? 'semua tahun' : yearlySummary.year}</p>
                    </CardContent>
                  </Card>

                  {/* Card 2: Total Expenses */}
                  <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white flex flex-col">
                    <CardHeader className="p-5 pb-2 shrink-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold text-orange-800">Total Expenses</CardTitle>
                        <div className="bg-orange-100 p-2 rounded-full">
                          <Receipt className="h-4 w-4 text-orange-600" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 flex-1 flex flex-col">
                      <div className="flex items-end gap-2 mb-2">
                        <div className="text-2xl font-bold text-orange-700 truncate">
                          {formatIDR(yearlySummary.total_expenses)}
                        </div>
                        {yearlySummary.total_budget > 0 && (
                          <div className="text-sm font-semibold text-orange-600 mb-0.5" title="% of Total Budget">
                            ({((yearlySummary.total_expenses / yearlySummary.total_budget) * 100).toFixed(0)}%)
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground border-t border-gray-100 pt-2 mt-auto">
                        <div className="flex justify-between">
                          <span className="flex items-center before:content-['•'] before:mr-1">ATR</span>
                          <span className="text-blue-600 font-medium">{formatIDR(yearlySummary.atr_expenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center before:content-['•'] before:mr-1">EER</span>
                          <span className="text-indigo-600 font-medium">{formatIDR(yearlySummary.eer_expenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center before:content-['•'] before:mr-1">Allowance</span>
                          <span className="text-purple-600 font-medium">{formatIDR(yearlySummary.allowance_expenses)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 3: Remaining Profit */}
                  <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white flex flex-col">
                    <CardHeader className="p-5 pb-2 shrink-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-sm font-semibold ${yearlySummary.remaining_profit >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>Remaining Budget</CardTitle>
                        <div className={`${yearlySummary.remaining_profit >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} p-2 rounded-full`}>
                          {yearlySummary.remaining_profit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 flex-1 flex flex-col justify-end">
                      <div className={`text-2xl font-bold truncate mb-1 ${yearlySummary.remaining_profit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {formatIDR(yearlySummary.remaining_profit)}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {yearlySummary.remaining_percentage.toFixed(0)}% Remaining Budget
                      </p>
                    </CardContent>
                  </Card>

                  {/* Card 4: Management Budget */}
                  <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white flex flex-col">
                    <CardHeader className="p-5 pb-2 shrink-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold text-gray-800">Management Budget</CardTitle>
                        <div className="bg-pink-50 p-2 rounded-full">
                          <Building2 className="h-4 w-4 text-pink-600" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 flex-1 flex flex-col justify-end">
                      <div className="flex items-end gap-2 mb-1">
                        <div className="text-2xl font-bold text-pink-600 truncate">
                          {formatIDR(yearlySummary.total_management_budget)}
                        </div>
                        {yearlySummary.total_budget > 0 && (
                          <div className="text-sm font-semibold text-pink-500 mb-0.5" title="% of Total Budget">
                            ({((yearlySummary.total_management_budget / yearlySummary.total_budget) * 100).toFixed(0)}%)
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Portioned from year claims
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Stacked Bar */}
                {/* {yearlySummary.total_budget > 0 && (
                  <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white p-5">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-bold text-gray-800">Budget Allocation Breakdown</h4>
                    </div>
                    <div className="w-full h-4 bg-gray-100 rounded-full flex overflow-hidden group">
                      <div className="h-full bg-blue-500 transition-all duration-700 border-r border-white/20 last:border-0 hover:opacity-90" style={{ width: `${(yearlySummary.atr_expenses / yearlySummary.total_budget) * 100}%` }} title={`ATR: ${formatIDR(yearlySummary.atr_expenses)}`} />
                      <div className="h-full bg-indigo-500 transition-all duration-700 border-r border-white/20 last:border-0 hover:opacity-90" style={{ width: `${(yearlySummary.eer_expenses / yearlySummary.total_budget) * 100}%` }} title={`EER: ${formatIDR(yearlySummary.eer_expenses)}`} />
                      <div className="h-full bg-purple-500 transition-all duration-700 border-r border-white/20 last:border-0 hover:opacity-90" style={{ width: `${(yearlySummary.allowance_expenses / yearlySummary.total_budget) * 100}%` }} title={`Allowance: ${formatIDR(yearlySummary.allowance_expenses)}`} />
                      <div className="h-full bg-pink-500 transition-all duration-700 border-r border-white/20 last:border-0 hover:opacity-90" style={{ width: `${(yearlySummary.total_management_budget / yearlySummary.total_budget) * 100}%` }} title={`Management: ${formatIDR(yearlySummary.total_management_budget)}`} />
                      {yearlySummary.remaining_profit > 0 && (
                        <div className="h-full bg-emerald-400 transition-all duration-700 hover:opacity-90" style={{ width: `${(yearlySummary.remaining_profit / yearlySummary.total_budget) * 100}%` }} title={`Remaining: ${formatIDR(yearlySummary.remaining_profit)}`} />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-[11px] font-medium text-gray-600">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" /> ATR</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm" /> EER</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" /> Allowance</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-pink-500 shadow-sm" /> Management</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" /> Remaining Profit</div>
                    </div>
                  </Card>
                )} */}
              </div>
            )}

            <div className={`grid grid-cols-1 gap-6 transition-opacity duration-300 ${leaderboardLoading ? 'opacity-60' : ''}`}>
              {/* By Account Manager */}
              <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="p-5 pb-3 border-b border-gray-50">
                  <CardTitle className="text-sm font-bold text-gray-800">Top Account Manager</CardTitle>
                  <CardDescription className="text-xs">Berdasarkan alokasi tahun anggaran</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {accountManagerLeaderboard.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">Belum ada data</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground bg-gray-50 uppercase border-b">
                          <tr>
                            <th className="px-5 py-3 font-semibold w-12 text-center">Rank</th>
                            <th className="px-5 py-3 font-semibold">Account Manager</th>
                            <th className="px-5 py-3 font-semibold text-right">Budget</th>
                            <th className="px-5 py-3 font-semibold text-right">Expenses</th>
                            <th className="px-5 py-3 font-semibold text-right">ATR</th>
                            <th className="px-5 py-3 font-semibold text-right">EER</th>
                            <th className="px-5 py-3 font-semibold text-right">Allowance</th>
                            <th className="px-5 py-3 font-semibold text-right">Profit</th>
                            <th className="px-5 py-3 font-semibold">Utilization</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {accountManagerLeaderboard.map((entry, idx) => {
                            const pct = entry.utilization_percentage;
                            const barColor = pct > 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-emerald-500';
                            return (
                              <tr key={entry.id || entry.name} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-4 text-center font-bold text-muted-foreground/60">#{idx + 1}</td>
                                <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">
                                  <Link
                                    href={`/projects?account_manager_id=${entry.id}${localYear !== 'all' ? `&year=${localYear}` : ''}`}
                                    className="hover:text-[var(--sidebar)] hover:underline transition-colors"
                                  >
                                    {entry.name}
                                  </Link>
                                </td>
                                <td className="px-5 py-4 font-bold text-emerald-700 text-right whitespace-nowrap">{formatIDR(entry.total_budget)}</td>
                                <td className="px-5 py-4 font-medium text-orange-600 text-right whitespace-nowrap">{formatIDR(entry.total_expenses)}</td>
                                <td className="px-5 py-4 text-blue-600 text-right whitespace-nowrap">{formatIDR(entry.atr_expenses)}</td>
                                <td className="px-5 py-4 text-indigo-600 text-right whitespace-nowrap">{formatIDR(entry.eer_expenses)}</td>
                                <td className="px-5 py-4 text-purple-600 text-right whitespace-nowrap">{formatIDR(entry.allowance_expenses)}</td>
                                <td className={`px-5 py-4 font-bold text-right whitespace-nowrap ${entry.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatIDR(entry.profit)}</td>
                                <td className="px-5 py-4 min-w-[120px]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                      <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">{pct.toFixed(0)}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* By Division */}
              {/* <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="p-5 pb-3 border-b border-gray-50">
                  <CardTitle className="text-sm font-bold text-gray-800">Top Division</CardTitle>
                  <CardDescription className="text-xs">Berdasarkan alokasi tahun anggaran</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {divisionLeaderboard.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">Belum ada data</div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {divisionLeaderboard.map((entry, idx) => {
                        const totalAll = divisionLeaderboard.reduce((s, e) => s + e.total_budget, 0);
                        const pct = totalAll > 0 ? (entry.total_budget / totalAll) * 100 : 0;
                        return (
                          <div key={entry.division} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                            <span className="w-6 text-center text-xs font-bold text-muted-foreground/60 shrink-0">#{idx + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-gray-800 truncate">{entry.division}</span>
                                <span className="text-sm font-bold text-blue-700 shrink-0">{formatIDR(entry.total_budget)}</span>
                              </div>
                              <div className="mt-1.5 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card> */}
            </div>
            {/* Budget Highlight Cards 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1"><CardTitle className="text-sm font-medium text-emerald-800">Total Keseluruhan Budget Projek</CardTitle></div>
                  <div className="bg-emerald-200 p-2 rounded-full"><Banknote className="h-5 w-5 text-emerald-700" /></div>
                </CardHeader>
                <CardContent><div className="text-2xl sm:text-3xl font-bold text-emerald-900">{formatIDR(totalBudget || 0)}</div></CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1"><CardTitle className="text-sm font-medium text-blue-800">Total Management Budget</CardTitle></div>
                  <div className="bg-blue-200 p-2 rounded-full"><TrendingUp className="h-5 w-5 text-blue-700" /></div>
                </CardHeader>
                <CardContent><div className="text-2xl sm:text-3xl font-bold text-blue-900">{formatIDR(totalManagementBudget || 0)}</div></CardContent>
              </Card>
            </div>
            */}
            {/* Charts Area - Rearranged to Full Width */}
            <div className="space-y-8">
              {/* Map - Full Width */}
              <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-[450px] z-0">
                <div className="absolute inset-0 z-0">
                  <MapContainer center={[-2.5, 118.0]} zoom={5} style={{ height: '100%', width: '100%', background: '#e5e7eb' }} zoomControl={true} scrollWheelZoom={true}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap' />
                    {locations?.map((loc: any) => (
                      <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                        <Popup className="custom-popup" closeButton={false}>
                          <div className="px-2 py-1 text-center">
                            <span className="font-bold text-gray-800 block text-sm">{loc.project?.name || 'Project'}</span>
                            <span className="text-xs text-muted-foreground mt-0.5">{loc.detail_address}</span>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
                <div className="absolute top-0 left-0 right-0 p-6 z-[400] flex justify-center items-start pointer-events-none">
                  <h3 className="text-sm font-medium text-gray-800 tracking-tight flex items-center gap-2 drop-shadow-sm bg-white/80 backdrop-blur-[2px] px-3 py-1 rounded-full border border-gray-200">
                    <span className="w-2 h-2 rounded-full bg-[var(--sidebar)] animate-pulse"></span>
                    Persebaran Wilayah Proyek Aktif
                  </h3>
                </div>
              </div>
              {/* Division Chart - Full Width */}
              <div className="grid grid-cols-1 gap-8">
                <Card className="border shadow-sm p-0 h-[400px] flex flex-col rounded-3xl bg-white">
                  <CardHeader className="p-6 pb-2 shrink-0 border-b border-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-800">Projects by Division</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 min-h-0">
                    <ChartContainer config={{ percentage: { label: "Percentage" } }} className="h-full w-full aspect-auto">
                      <BarChart data={projectsByDivisionWithPercentage} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                        <YAxis domain={[0, 100]} hide />
                        <XAxis dataKey="division" tickLine={false} tickMargin={10} axisLine={false} tick={{ fontSize: 12 }} />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="rounded-lg border bg-white p-2 shadow-sm text-xs">
                                  <div className="font-bold text-gray-900 mb-1">{data.division}</div>
                                  <div className="text-gray-600">Total: <strong>{data.count} Projects</strong></div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="percentage" radius={8} barSize={60}>
                          <LabelList position="top" offset={12} className="fill-gray-700 font-bold" fontSize={12} formatter={(v: any) => `${v}%`} />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

            </div>
          </>
        )}

      </div>

      <BulkApprovalModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        title={modalData.title}
        items={modalData.items}
        type={modalData.type}
        role={modalData.role}
        actionType={modalData.actionType}
      />
    </AppSidebarLayout>
  );
}
