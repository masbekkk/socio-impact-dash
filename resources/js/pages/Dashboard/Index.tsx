import React, { useState } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, MapPin, Activity, FileText, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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
    ]
  },
  division_dashboard: {
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
    project_health: [
      { status: "Sehat", count: 15, percentage: 60 },
      { status: "Waspada", count: 5, percentage: 20 },
      { status: "Kritikal", count: 3, percentage: 12 },
      { status: "Sangat Kritikal", count: 2, percentage: 8 }
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
    ]
  }
};

export default function Dashboard() {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
  ];

  const [activeTab, setActiveTab] = useState('executive');

  const { executive_summary, division_dashboard } = DASHBOARD_DATA;

  // Color schemes
  const divisionColors = {
    'Task Force': 'bg-[#1a5f4a]',
    'Research': 'bg-[#2d7a5f]',
    'Learning': 'bg-[#3d9573]',
    'Lestari': 'bg-[#7fb069]',
    'Marketing': 'bg-[#a8c686]'
  };

  const statusColors = {
    'Not Started': 'bg-gray-600',
    'On Track': 'bg-[#2d7a5f]',
    'At Risk': 'bg-[#3d9573]',
    'Delayed': 'bg-[#7fb069]',
    'Completed': 'bg-[#a8c686]'
  };

  const healthColors = {
    'Sehat': 'bg-[#2d7a5f]',
    'Waspada': 'bg-orange-500',
    'Kritikal': 'bg-red-400',
    'Sangat Kritikal': 'bg-red-600'
  };

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="p-6 md:p-10 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-[#1a5f4a] to-[#2d7a5f] text-white p-6 rounded-2xl shadow-xl">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <BarChart3 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dashboard Manajemen Proyek</h1>
            <p className="text-white/90">CSR Consulting</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-11">
            <TabsTrigger value="executive" className="data-[state=active]:bg-[#1a5f4a] data-[state=active]:text-white">
              Executive Summary
            </TabsTrigger>
            <TabsTrigger value="division" className="data-[state=active]:bg-[#1a5f4a] data-[state=active]:text-white">
              Divisi
            </TabsTrigger>
          </TabsList>

          {/* Executive Summary Tab */}
          <TabsContent value="executive" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projects by Division - Modern Card */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">Jumlah Project Per Divisi</CardTitle>
                      <CardDescription className="text-sm mt-1">Total {executive_summary.total_projects} project</CardDescription>
                    </div>
                    <div className="bg-[#1a5f4a]/10 p-3 rounded-xl">
                      <Users className="h-5 w-5 text-[#1a5f4a]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    count: {
                      label: "Projects",
                      color: "#1a5f4a",
                    },
                  }} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={executive_summary.projects_by_division}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="division"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="count" fill="#1a5f4a" radius={8} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Map - Modern Card */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-[#1a5f4a]" />
                        Persebaran Wilayah Project
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">Total {executive_summary.total_projects} project</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px] relative">
                    <MapContainer
                      center={[-2.5, 118]}
                      zoom={4.5}
                      style={{ height: '100%', width: '100%' }}
                      zoomControl={true}
                      scrollWheelZoom={true}
                      attributionControl={false}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution=""
                      />
                      {executive_summary.projects_by_region.map((item) => (
                        <Marker key={item.region} position={[item.lat, item.lng]}>
                          <Popup>
                            <div className="text-center font-semibold">
                              <div className="text-[#1a5f4a]">{item.region}</div>
                              <div className="text-sm text-gray-600">{item.count} Projects</div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t">
                    <div className="grid grid-cols-5 gap-2">
                      {executive_summary.projects_by_region.map((item, index) => (
                        <div key={item.region} className="flex items-center gap-2 text-xs">
                          <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-[#1a5f4a]' : index === 1 ? 'bg-[#2d7a5f]' : index === 2 ? 'bg-[#3d9573]' : index === 3 ? 'bg-[#7fb069]' : 'bg-[#a8c686]'}`} />
                          <span className="font-medium text-gray-700">{item.region}</span>
                          <span className="font-bold text-[#1a5f4a]">: {item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Status - Modern Card */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">Status Project</CardTitle>
                      <CardDescription className="text-sm mt-1">Total {executive_summary.total_projects} Project</CardDescription>
                    </div>
                    <div className="bg-blue-500/10 p-3 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    count: {
                      label: "Projects",
                      color: "#2563eb",
                    },
                  }} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={executive_summary.projects_by_status}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="status"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 10)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {executive_summary.projects_by_status.map((entry, index) => {
                          const colorMap: Record<string, string> = {
                            'Not Started': '#4b5563',
                            'On Track': '#15803d',
                            'At Risk': '#b45309',
                            'Delayed': '#c2410c',
                            'Completed': '#1a5f4a'
                          };
                          return <Cell key={`cell-${index}`} fill={colorMap[entry.status] || '#1a5f4a'} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Project Types - Modern Card */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-green-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#1a5f4a]" />
                        Jenis Project
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">Total {executive_summary.total_projects} Project</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    count: {
                      label: "Projects",
                      color: "#1a5f4a",
                    },
                  }} className="min-h-[200px] w-full">
                    <BarChart
                      accessibilityLayer
                      data={executive_summary.projects_by_type}
                      layout="vertical"
                      margin={{
                        left: 0,
                      }}
                    >
                      <CartesianGrid horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="type"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        width={100}
                        className="text-xs font-semibold"
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="count" radius={4} fill="#1a5f4a">
                        <LabelList dataKey="count" position="right" fill="#1a5f4a" className="font-bold" />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Division Tab - Similar modern styling */}
          <TabsContent value="division" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projects by Division */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">Jumlah Project Per Divisi</CardTitle>
                      <CardDescription className="text-sm mt-1">Total {division_dashboard.total_projects} project</CardDescription>
                    </div>
                    <div className="bg-[#1a5f4a]/10 p-3 rounded-xl">
                      <Users className="h-5 w-5 text-[#1a5f4a]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {division_dashboard.projects_by_division.map((item) => (
                      <div key={item.division} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-700">{item.division}</span>
                          <span className="text-[#1a5f4a] font-bold">{item.percentage}%</span>
                        </div>
                        <div className="relative">
                          <div className="flex-1 bg-gray-200 rounded-full h-11 overflow-hidden shadow-inner">
                            <div
                              className={`h-full ${divisionColors[item.division as keyof typeof divisionColors]} flex items-center justify-center text-white text-sm font-bold transition-all duration-700 ease-out hover:opacity-90`}
                              style={{ width: `${item.percentage}%` }}
                            >
                              {item.count}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Map for Division */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-[#1a5f4a]" />
                        Persebaran Wilayah Project
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">Total {division_dashboard.total_projects} project</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px] relative">
                    <MapContainer
                      center={[-2.5, 118]}
                      zoom={4.5}
                      style={{ height: '100%', width: '100%' }}
                      zoomControl={true}
                      scrollWheelZoom={true}
                      attributionControl={false}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution=""
                      />
                      {division_dashboard.projects_by_region.map((item) => (
                        <Marker key={item.region} position={[item.lat, item.lng]}>
                          <Popup>
                            <div className="text-center font-semibold">
                              <div className="text-[#1a5f4a]">{item.region}</div>
                              <div className="text-sm text-gray-600">{item.count} Projects</div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t">
                    <div className="grid grid-cols-5 gap-2">
                      {division_dashboard.projects_by_region.map((item, index) => (
                        <div key={item.region} className="flex items-center gap-2 text-xs">
                          <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-[#1a5f4a]' : index === 1 ? 'bg-[#2d7a5f]' : index === 2 ? 'bg-[#3d9573]' : index === 3 ? 'bg-[#7fb069]' : 'bg-[#a8c686]'}`} />
                          <span className="font-medium text-gray-700">{item.region}</span>
                          <span className="font-bold text-[#1a5f4a]">: {item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Health */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-orange-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-orange-600" />
                        Project Health
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">Total {division_dashboard.total_projects} Project</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {division_dashboard.project_health.map((item) => (
                      <div key={item.status} className="flex items-center gap-3">
                        <div className="w-36 text-sm font-semibold text-gray-700">{item.status}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-11 overflow-hidden shadow-inner">
                          <div
                            className={`h-full ${healthColors[item.status as keyof typeof healthColors]} flex items-center px-4 text-white text-sm font-bold transition-all duration-700 ease-out hover:opacity-90`}
                            style={{ width: `${item.percentage}%` }}
                          >
                            {item.count}
                          </div>
                        </div>
                        <div className="w-16 text-sm font-bold text-right text-[#1a5f4a]">{item.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Project Status */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">Status Project</CardTitle>
                      <CardDescription className="text-sm mt-1">Total {division_dashboard.total_projects} Project</CardDescription>
                    </div>
                    <div className="bg-blue-500/10 p-3 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-3 h-40">
                    {division_dashboard.projects_by_status.map((item) => {
                      const maxCount = Math.max(...division_dashboard.projects_by_status.map(s => s.count));
                      const heightPercentage = (item.count / maxCount) * 100;

                      return (
                        <div key={item.status} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-t-xl overflow-hidden shadow-md flex items-end" style={{ height: '120px' }}>
                            <div
                              className={`w-full ${statusColors[item.status as keyof typeof statusColors]} flex items-center justify-center text-white text-xs font-bold transition-all duration-700 ease-out hover:opacity-90`}
                              style={{ height: `${heightPercentage}%` }}
                            >
                              {item.count}
                            </div>
                          </div>
                          <div className="text-xs font-medium text-center text-gray-600 leading-tight">{item.status}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Project Types - Horizontal */}
              <Card className="lg:col-span-2 border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-green-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#1a5f4a]" />
                        Jenis Project
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">Total {division_dashboard.total_projects} Project</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {division_dashboard.projects_by_type.map((item, index) => {
                      const maxCount = Math.max(...division_dashboard.projects_by_type.map(t => t.count));
                      const widthPercentage = (item.count / maxCount) * 100;

                      return (
                        <div key={item.type} className="space-y-2">
                          <div className="text-sm font-semibold text-gray-700">{item.type}</div>
                          <div className="bg-gray-200 rounded-full h-14 overflow-hidden shadow-inner">
                            <div
                              className={`h-full ${index === 0 ? 'bg-gradient-to-r from-[#1a5f4a] to-[#2d7a5f]' : index === 1 ? 'bg-gradient-to-r from-[#2d7a5f] to-[#3d9573]' : index === 2 ? 'bg-gradient-to-r from-[#3d9573] to-[#7fb069]' : 'bg-gradient-to-r from-[#7fb069] to-[#a8c686]'} flex items-center px-5 text-white font-bold text-lg transition-all duration-700 ease-out hover:opacity-90`}
                              style={{ width: `${widthPercentage}%` }}
                            >
                              {item.count}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppSidebarLayout>
  );
}
