import React, { useState, useEffect } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link } from '@inertiajs/react';

const RealTimeClock = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right hidden md:block">
      <div className="text-3xl font-bold font-mono tracking-wider">
        {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-sm font-medium opacity-90">
        {date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  );
};

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

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, CardAction } from '@/components/ui/card';
import { BarChart3, MapPin, TrendingUp, TrendingDown, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Define Region Colors
const REGION_COLORS: Record<string, string> = {
  Sumatera: '#1b4841',
  Jawa: '#00733c',
  Kalimantan: '#00a549',
  Sulawesi: '#8cbe3b',
  Bali: '#cee5ad',
  Default: '#6b7280'
};

const getRegionColor = (region: string) => REGION_COLORS[region] || REGION_COLORS.Default;

const createCustomIcon = (region: string) => {
  const color = getRegionColor(region);
  // SVG Map Pin Icon
  return L.divIcon({
    className: '', // Reset default Leaflet divIcon styles
    html: `
      <div class="relative group cursor-pointer" style="width: 40px; height: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full drop-shadow-md transition-transform duration-300 hover:scale-110 hover:-translate-y-1">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40], // Point to bottom center
    popupAnchor: [0, -40]  // Popup above the pin
  });
};

// Embedded dashboard data
const DASHBOARD_DATA = {
  executive_summary: {
    total_projects: 25,
    projects_by_division: [
      { division: "Task Force", count: 9, percentage: 36 },
      { division: "Research", count: 3, percentage: 14 },
      { division: "Learning", count: 2, percentage: 9 },
      { division: "Lestari", count: 5, percentage: 23 },
      { division: "Marketing", count: 4, percentage: 18 }
    ],
    projects_by_region: [
      { region: "Sumatera", count: 5, lat: 0.5897, lng: 101.3431 },
      { region: "Jawa", count: 5, lat: -7.2575, lng: 112.7521 },
      { region: "Kalimantan", count: 5, lat: -0.9683, lng: 114.8416 },
      { region: "Sulawesi", count: 5, lat: -0.8999, lng: 119.8707 },
      { region: "Bali", count: 5, lat: -8.4095, lng: 115.1889 }
    ],
    projects_by_status: [
      { status: "Not Started", count: 2 },
      { status: "On Track", count: 15 },
      { status: "At Risk", count: 1 },
      { status: "Delayed", count: 3 },
      { status: "Completed", count: 4 }
    ],
    projects_by_type: [
      { type: "Pendampingan", count: 10 },
      { type: "Event", count: 1 },
      { type: "Dokumen", count: 5 },
      { type: "Pelatihan", count: 4 }
    ],
    project_health: [
      { status: "Sehat", count: 15, fill: "#16a34a" },
      { status: "Waspada", count: 5, fill: "#f59e0b" },
      { status: "Kritikal", count: 3, fill: "#f87171" },
      { status: "Sangat Kritikal", count: 2, fill: "#991b1b" }
    ]
  }
};

export default function Dashboard() {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
  ];

  // Map Instance State
  const [map, setMap] = useState<L.Map | null>(null);

  // Helper to fly to region
  const handleRegionClick = (lat: number, lng: number) => {
    if (map) {
      map.flyTo([lat, lng], 6, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  };

  const { executive_summary } = DASHBOARD_DATA;

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="p-6 md:p-8 space-y-6">
        {/* Quick Stats Cards Styled */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="@container/card bg-[var(--sidebar)] border-none shadow-md text-white">
            <CardHeader>
              <CardDescription className="text-emerald-100/90">Presensi</CardDescription>
              <CardTitle className="text-2xl text-white font-semibold tabular-nums @[250px]/card:text-3xl flex flex-col gap-1">
                <span suppressHydrationWarning className="text-lg font-normal opacity-90">
                  {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </CardTitle>
              <CardAction>
                <Badge variant="outline" className="text-white border-white/20 bg-white/5 hover:bg-white/10">
                  <Clock className="h-4 w-4 mr-1" />
                  <RealTimeClockSimple />
                  WIB
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 text-sm mt-auto">
              <div className="text-emerald-50/90 font-medium line-clamp-1">
                Catat kehadiran anda saat berada di luar kantor.
              </div>
              <Link href="/presences/create" className="w-full">
                <div className="bg-white text-[#1a5f4a] hover:bg-emerald-50 w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-95 hover:scale-105">
                  <MapPin className="h-4 w-4" />
                  Presensi 
                </div>
              </Link>
            </CardFooter>
          </Card>

          <Card className="@container/card bg-white shadow-md border-0">
            <CardHeader>
              <CardDescription>Total Active Projects</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {executive_summary.total_projects}
              </CardTitle>
              <CardAction>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium text-emerald-600">
                Trending up this month <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Consistent project initiation
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card bg-white shadow-md border-0">
            <CardHeader>
              <CardDescription>On Track Performance</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {executive_summary.projects_by_status.find(s => s.status === 'On Track')?.count || 0}
              </CardTitle>
              <CardAction>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5.2%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium text-blue-600">
                Projects running smoothly <TrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Strong project management
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Dashboard Content - Single View */}
        <div className="space-y-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border shadow-sm lg:col-span-1 h-[400px] flex flex-col">
              <Card className="border-0 shadow-none p-0 h-full flex flex-col">
                <CardHeader className="p-0 pb-4 shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-800">Projects by Division</CardTitle>
                    <span className="text-xs font-medium bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">Total: {executive_summary.total_projects} Projects</span>
                  </div>
                  <CardDescription>Performance Distribution (%)</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0">
                  <ChartContainer config={{
                    percentage: {
                      label: "Percentage",
                      color: "#1a5f4a",
                    },
                  }} className="h-full w-full aspect-auto">
                    <BarChart
                      accessibilityLayer
                      data={[
                        { division: "Task Force", percentage: 36, count: 18, fill: "#1b4841" },
                        { division: "Research", percentage: 14, count: 7, fill: "#00733c" },
                        { division: "Learning", percentage: 9, count: 5, fill: "#00a549" },
                        { division: "Lestari", percentage: 23, count: 11, fill: "#8cbe3b" },
                        { division: "Marketing", percentage: 18, count: 9, fill: "#cee5ad" },
                      ]}
                      margin={{
                        top: 20,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <YAxis domain={[0, 100]} hide />
                      <XAxis
                        dataKey="division"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)} // Shorten division names
                      />
                      <ChartTooltip
                        cursor={false}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="rounded-lg border bg-white p-2 shadow-sm text-xs">
                                <div className="font-bold text-gray-900 mb-1">{data.division}</div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.fill }}></span>
                                  <span>Total: <strong>{data.count} Projects</strong></span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="percentage" radius={8}>
                        <LabelList
                          position="top"
                          offset={12}
                          className="fill-foreground font-bold"
                          fontSize={12}
                          formatter={(value: number) => `${value}%`}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm p-0 pt-4 border-t border-gray-100 mt-auto shrink-0">
                  <div className="flex gap-2 leading-none font-medium">
                    Dominan di Task Force (36%) <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-muted-foreground leading-none">
                    Distribusi beban kerja antar divisi
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Natural Floating Map Layout - Full Overlay */}
            <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-100 lg:col-span-2 h-[400px]">
              <div className="absolute inset-0 z-0">
                <MapContainer
                  center={[-4.0, 115.0]}
                  zoom={5}
                  style={{ height: '100%', width: '100%', background: '#f8fafc', zIndex: 0 }}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  dragging={true}
                  doubleClickZoom={false}
                  attributionControl={false}
                  ref={setMap as any}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  {executive_summary.projects_by_region.map((item) => (
                    <Marker
                      key={item.region}
                      position={[item.lat, item.lng]}
                      icon={createCustomIcon(item.region)}
                      eventHandlers={{
                        click: () => handleRegionClick(item.lat, item.lng),
                      }}
                    >
                      <Popup autoPan={true} className="custom-popup" closeButton={false}>
                        <div className="px-2 py-1 text-center">
                          <span className="font-bold text-gray-800 block text-sm" style={{ color: getRegionColor(item.region) }}>{item.region}</span>
                          <span className="text-xs text-muted-foreground">{item.count} Projects Active</span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Floating Header - Centered Pill */}
              <div className="absolute top-0 left-0 right-0 p-6 z-[400] flex justify-center items-start pointer-events-none">
                <h3 className="text-sm font-medium text-gray-800 tracking-tight flex items-center gap-2 drop-shadow-sm bg-white/40 backdrop-blur-[2px] px-3 py-1 rounded-full border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[var(--sidebar)] animate-pulse"></span>
                  Persebaran Wilayah Proyek: <span className="font-bold text-gray-900">Total {executive_summary.total_projects} Projects</span>
                </h3>
              </div>

              {/* Floating Footer Stats - Inline Pill */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-[400] flex justify-center pointer-events-none">
                <div className="px-6 py-3  pointer-events-auto flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                  {executive_summary.projects_by_region.map((item) => (
                    <div
                      key={item.region}
                      className="flex items-center gap-2 group cursor-pointer transition-transform hover:scale-105 active:scale-95"
                      onClick={() => handleRegionClick(item.lat, item.lng)}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: getRegionColor(item.region) }}
                      ></span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{item.region} :</span>
                      <span className="text-xs font-medium text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Project Health Chart - Horizontal Bar */}
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <Card className="border-0 shadow-none p-0">
              <CardHeader>
                <CardTitle>Project Health: Total {executive_summary.total_projects} Project</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: { label: "Projects" },
                    Sehat: { label: "Sehat", color: "#16a34a" },
                    Waspada: { label: "Waspada", color: "#f59e0b" },
                    Kritikal: { label: "Kritikal", color: "#f87171" },
                    "Sangat Kritikal": { label: "Sangat Kritikal", color: "#991b1b" },
                  }}
                  className="h-[300px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={executive_summary.project_health}
                    layout="vertical"
                    margin={{ left: 0, right: 50 }}
                  >
                    <YAxis
                      dataKey="status"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      width={100}
                    />
                    <XAxis dataKey="count" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm text-xs">
                              <div className="font-bold text-gray-900 mb-1">{data.status}</div>
                              <div>Total: {data.count} Projects</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" layout="vertical" radius={5} barSize={40}>
                      <LabelList
                        dataKey="count"
                        position="center"
                        fill="white"
                        offset={10}
                        fontSize={14}
                        fontWeight="bold"
                      />
                      <LabelList
                        dataKey="count"
                        position="right"
                        offset={10}
                        className="fill-foreground font-bold"
                        fontSize={14}
                        formatter={(value: any) => `${Math.round((value / executive_summary.total_projects) * 100)}%`}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Status - Bar Chart */}
            <div className="h-[350px] flex flex-col">
              <Card className="border shadow-sm p-0 h-full flex flex-col rounded-3xl">
                <CardHeader className="p-6 pb-4 shrink-0">
                  <div className="flex flex-col items-center justify-center w-full">
                    <CardTitle className="text-lg font-bold text-gray-800 text-center">
                      Jumlah Status Project : Total {executive_summary.total_projects} Project
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0 mx-6">
                  <ChartContainer config={{
                    count: { label: "Projects", color: "#2563eb" },
                  }} className="h-full w-full aspect-auto">
                    <BarChart
                      accessibilityLayer
                      data={executive_summary.projects_by_status.map((item, index) => ({
                        ...item,
                        fill: ['#14532d', '#166534', '#15803d', '#4ade80', '#bbf7d0'][index % 5]
                      }))}
                      margin={{ top: 20, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis
                        dataKey="status"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        fontSize={12}
                      />
                      <ChartTooltip
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-xl min-w-[120px] z-50">
                                <p className="text-sm font-bold text-gray-900 mb-1.5 pb-1 border-b border-gray-50">{data.status}</p>
                                <div className="flex items-center justify-between gap-3 text-xs">
                                  <div className="flex items-center gap-1.5 text-gray-600">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.fill }}></span>
                                    Total
                                  </div>
                                  <span className="font-bold text-gray-900">{data.count}</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={60}>
                        <LabelList
                          position="top"
                          offset={12}
                          className="fill-gray-700 font-bold"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="p-6 pt-2 shrink-0 border-t border-gray-50 mt-auto">
                  <div className="text-xs text-gray-500">
                    Monitoring status proyek secara real-time.
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Project Types - Bar Chart */}
            <div className="h-[350px] flex flex-col">
              <Card className="border shadow-sm p-0 h-full flex flex-col rounded-3xl">
                <CardHeader className="p-6 pb-4 shrink-0">
                  <div className="flex flex-col items-center justify-center w-full">
                    <CardTitle className="text-lg font-bold text-gray-800 text-center">
                      Jumlah Jenis Project : Total {executive_summary.total_projects} Project
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0 mx-6">
                  <ChartContainer config={{
                    count: { label: "Projects", color: "#1a5f4a" },
                  }} className="h-full w-full aspect-auto">
                    <BarChart
                      accessibilityLayer
                      data={executive_summary.projects_by_type.map((item, index) => ({
                        ...item,
                        fill: ['#064e3b', '#166534', '#22c55e', '#86efac'][index % 4]
                      }))}
                      margin={{ top: 20, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis
                        dataKey="type"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        fontSize={12}
                      />
                      <ChartTooltip
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-xl min-w-[120px] z-50">
                                <p className="text-sm font-bold text-gray-900 mb-1.5 pb-1 border-b border-gray-50">{data.type}</p>
                                <div className="flex items-center justify-between gap-3 text-xs">
                                  <div className="flex items-center gap-1.5 text-gray-600">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.fill }}></span>
                                    Total
                                  </div>
                                  <span className="font-bold text-gray-900">{data.count}</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={60}>
                        <LabelList
                          position="top"
                          offset={12}
                          className="fill-gray-700 font-bold"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="p-6 pt-2 shrink-0 border-t border-gray-50 mt-auto">
                  <div className="text-xs text-gray-500">
                    Distribusi tipe kegiatan proyek.
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}
