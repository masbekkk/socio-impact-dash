import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { A as AppSidebarLayout, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuSeparator, e as DropdownMenuItem } from "./app-sidebar-layout-5JGZFayF.js";
import { Head, Link, router } from "@inertiajs/react";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { a as CardContent, C as Card, b as CardHeader, c as CardTitle } from "./card-DAjHeOuX.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Cose3haZ.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { X, CheckCircle, Search, Calendar, Download, Filter, MapPin, MoreHorizontal, Eye, XCircle, Loader2, Camera, RotateCcw } from "lucide-react";
import { S as StatusBadge } from "./StatusBadge-Bj9jreC2.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { D as DateFilterPresets } from "./DateFilterPresets-BffSLq1i.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "./use-permission-D0a8sZAO.js";
import "axios";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "./DatePicker-DAaV_rdH.js";
import "react-number-format";
function PresenceIndex({ presences, todayPresence }) {
  const [breadcrumbs] = useState([
    { title: "Dashboard", href: "/dashboard" },
    { title: "Presensi", href: "/presences" }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [formData, setFormData] = useState({
    project_id: "",
    activity: "",
    notes: "",
    lat: "",
    lng: "",
    image: null
  });
  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: null,
    log: null
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    latitude: "",
    longitude: "",
    notes: "",
    image: null
  });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState("user");
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);
  const startCamera = async (facingMode = "user") => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      setStream(newStream);
      setIsCameraOpen(true);
      setCameraFacingMode(facingMode);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Gagal membuka kamera. Pastikan izin kamera diberikan.");
      setIsCameraOpen(false);
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };
  const switchCamera = () => {
    const newMode = cameraFacingMode === "user" ? "environment" : "user";
    startCamera(newMode);
  };
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `checkout_${Date.now()}.jpg`, { type: "image/jpeg" });
            setCheckoutData((prev) => ({ ...prev, image: file }));
            stopCamera();
          }
        }, "image/jpeg", 0.8);
      }
    }
  };
  const retakePhoto = () => {
    setCheckoutData((prev) => ({ ...prev, image: null }));
    startCamera(cameraFacingMode);
  };
  const handleFetchCheckoutLocation = () => {
    setLoadingLocation(true);
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser ini.");
      setLoadingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCheckoutData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString()
        }));
        setLoadingLocation(false);
      },
      (err) => {
        alert("Gagal mengambil lokasi: " + err.message);
        setLoadingLocation(false);
      }
    );
  };
  const handleCheckoutSubmit = () => {
    if (!checkoutData.latitude) {
      alert("Harap ambil lokasi terlebih dahulu.");
      return;
    }
    if (!checkoutData.image) {
      alert("Harap ambil foto checkout terlebih dahulu.");
      return;
    }
    router.post(route("presences.checkout"), {
      ...checkoutData,
      photo: checkoutData.image
    }, {
      onSuccess: () => {
        setIsCheckoutDialogOpen(false);
        setCheckoutData({ latitude: "", longitude: "", notes: "", image: null });
        stopCamera();
      }
    });
  };
  const openActionDialog = (type, log) => {
    setActionDialog({ open: true, type, log });
  };
  const handleActionConfirm = () => {
    if (!actionDialog.log || !actionDialog.type) return;
    alert(`Konfirmasi: ${actionDialog.type === "approve" ? "Menyetujui" : "Menolak"} presensi untuk ${actionDialog.log.user.name}`);
    setActionDialog({ open: false, type: null, log: null });
  };
  const paginatedLogs = presences.data;
  presences.last_page;
  presences.current_page;
  const totalLogs = presences.total;
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Presensi" }),
    /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between px-8 py-6 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Presensi Di Luar Kantor" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm md:text-base", children: "Catat kehadiran, lokasi, dan aktivitas di luar kantor." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0", children: !todayPresence ? /* @__PURE__ */ jsx(Link, { href: "/presences/create", children: /* @__PURE__ */ jsxs(Button, { className: "w-full sm:w-auto gap-2 bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)] transition-transform hover:scale-105 active:scale-95 shadow-sm", children: [
        /* @__PURE__ */ jsx(PlusIcon, { className: "h-4 w-4" }),
        "Check-In Baru"
      ] }) }) : !todayPresence.check_out_at ? /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => {
            setIsCheckoutDialogOpen(true);
            handleFetchCheckoutLocation();
          },
          className: "w-full sm:w-auto gap-2 bg-rose-600 text-white hover:bg-rose-700 transition-transform hover:scale-105 active:scale-95 shadow-sm",
          children: [
            /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
            "Check-Out Sekarang"
          ]
        }
      ) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end", children: [
        /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "bg-emerald-50 text-emerald-700 border-emerald-200 py-1.5 px-3", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 mr-2" }),
          "Selesai Kerja Hari Ini"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground mt-1", children: [
          "Check-out jam ",
          format(new Date(todayPresence.check_out_at), "HH:mm")
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mx-4 md:mx-8 mb-8 border-none rounded-xl overflow-hidden shadow-sm", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4 px-4 md:px-8", children: [
        /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-normal hidden md:block", children: "Riwayat Presensi" }),
        /* @__PURE__ */ jsxs("div", { className: "flex w-full md:w-auto items-center gap-2 flex-wrap md:flex-nowrap", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1 md:w-64", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Cari presensi...",
                className: "pl-8 w-full",
                value: searchQuery,
                onChange: (e) => {
                  setSearchQuery(e.target.value);
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: cn(
                  "justify-start text-left font-normal w-[240px] px-3 border-dashed hidden md:flex",
                  !startDate && "text-muted-foreground",
                  (startDate || endDate) && "border-solid bg-emerald-50/50 border-emerald-200 text-emerald-700"
                ),
                children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4" }),
                  startDate ? endDate ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    format(new Date(startDate), "dd MMM yyyy", { locale: id }),
                    " -",
                    " ",
                    format(new Date(endDate), "dd MMM yyyy", { locale: id })
                  ] }) : format(new Date(startDate), "dd MMM yyyy", { locale: id }) : /* @__PURE__ */ jsx("span", { children: "Pilih Rentang Tanggal" }),
                  (startDate || endDate) && /* @__PURE__ */ jsx("div", { className: "ml-auto hover:bg-emerald-200 rounded-full p-0.5 transition-colors", role: "button", onClick: (e) => {
                    e.stopPropagation();
                    setStartDate("");
                    setEndDate("");
                  }, children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(DropdownMenuContent, { className: "w-auto p-0 bg-white", align: "start", children: /* @__PURE__ */ jsx(
              DateFilterPresets,
              {
                startDate,
                endDate,
                onSelect: (start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", className: cn("md:hidden", startDate || endDate ? "bg-accent text-accent-foreground border-primary" : ""), children: /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsx(DropdownMenuContent, { className: "w-auto p-0 bg-white", align: "end", children: /* @__PURE__ */ jsx(
              DateFilterPresets,
              {
                startDate,
                endDate,
                onSelect: (start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-none", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "h-9 gap-2", onClick: () => alert("Mendownload rekap presensi (CSV)..."), children: [
            /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Export" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-none", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "h-9 gap-2", children: [
              /* @__PURE__ */ jsx(Filter, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Filter" })
            ] }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Filter Harian" }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsx(DropdownMenuItem, { children: "Hari Ini" }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { children: "Minggu Ini" }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { children: "Bulan Ini" }),
              /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Filter Status" }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setFilterStatus("all"), className: filterStatus === "all" ? "bg-accent" : "", children: "Semua Status" }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setFilterStatus("pending"), className: filterStatus === "pending" ? "bg-accent" : "", children: "Menunggu" }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setFilterStatus("approved"), className: filterStatus === "approved" ? "bg-accent" : "", children: "Disetujui" }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setFilterStatus("rejected"), className: filterStatus === "rejected" ? "bg-accent" : "", children: "Ditolak" })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { className: "px-4 md:px-8", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 md:hidden mb-6", children: paginatedLogs.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-muted-foreground border rounded-md border-dashed", children: "Belum ada data presensi." }) : paginatedLogs.map((log) => /* @__PURE__ */ jsx(Card, { className: "overflow-hidden border shadow-none", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm", children: log.date }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: log.check_in_at ? format(new Date(log.check_in_at), "HH:mm") : "-" })
            ] }),
            /* @__PURE__ */ jsx(StatusBadge, { status: log.status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Karyawan" }),
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: log.user?.name || "Unknown User" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Proyek" }),
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: log.project?.name || "-" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Kegiatan" }),
              /* @__PURE__ */ jsx("div", { className: "line-clamp-2 text-muted-foreground", children: log.activity })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Check-In" }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: log.check_in_at ? format(new Date(log.check_in_at), "HH:mm") : "-" }),
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: `https://www.google.com/maps/search/?api=1&query=${log.check_in_latitude},${log.check_in_longitude}`,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "flex items-center gap-1 text-[10px] text-emerald-600 hover:underline",
                      children: [
                        /* @__PURE__ */ jsx(MapPin, { className: "h-2 w-2" }),
                        "View Maps"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Check-Out" }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: log.check_out_at ? format(new Date(log.check_out_at), "HH:mm") : "-" }),
                  log.check_out_at && /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: `https://www.google.com/maps/search/?api=1&query=${log.check_out_latitude},${log.check_out_longitude}`,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "flex items-center gap-1 text-[10px] text-rose-600 hover:underline",
                      children: [
                        /* @__PURE__ */ jsx(MapPin, { className: "h-2 w-2" }),
                        "View Maps"
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-2 border-t flex justify-end gap-2", children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", className: "w-full h-8 text-xs", children: "View Details" }) })
        ] }) }, log.id)) }),
        /* @__PURE__ */ jsx("div", { className: "hidden md:block rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50 hover:bg-muted/50", children: [
            /* @__PURE__ */ jsx(TableHead, { className: "w-[180px]", children: "Tanggal & Waktu" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Karyawan" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Proyek" }),
            /* @__PURE__ */ jsx(TableHead, { className: "hidden md:table-cell", children: "Kegiatan" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-[200px]", children: "Check-In / Out" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-right w-[80px]", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: paginatedLogs.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "h-24 text-center text-muted-foreground", children: "Belum ada data presensi yang ditemukan." }) }) : paginatedLogs.map((log) => /* @__PURE__ */ jsxs(TableRow, { className: "group", children: [
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: format(new Date(log.date), "dd MMM yyyy", { locale: id }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium text-emerald-600 underline decoration-emerald-200 decoration-offset-2", children: log.check_in_at ? format(new Date(log.check_in_at), "HH:mm") : "-" }),
                /* @__PURE__ */ jsx("span", { children: "→" }),
                /* @__PURE__ */ jsx("span", { className: cn("font-medium", log.check_out_at ? "text-rose-600 underline decoration-rose-200 decoration-offset-2" : "text-muted-foreground"), children: log.check_out_at ? format(new Date(log.check_out_at), "HH:mm") : "-" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: log.user?.name || "Unknown User" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: log.user?.email })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: log.project?.name || "-" }),
            /* @__PURE__ */ jsx(TableCell, { className: "hidden md:table-cell max-w-[300px]", children: /* @__PURE__ */ jsx("div", { className: "truncate text-muted-foreground", title: log.activity, children: log.activity }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-mono text-[9px] font-normal gap-1 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 cursor-pointer w-fit py-0 px-2 h-5", asChild: true, title: "Check-In Location", children: /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `https://www.google.com/maps/search/?api=1&query=${log.check_in_latitude},${log.check_in_longitude}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-emerald-600 font-bold mr-1", children: "IN" }),
                    Number(log.check_in_latitude || 0).toFixed(4),
                    ", ",
                    Number(log.check_in_longitude || 0).toFixed(4)
                  ]
                }
              ) }),
              log.check_out_at ? /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "font-mono text-[9px] font-normal gap-1 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 cursor-pointer w-fit py-0 px-2 h-5", asChild: true, title: "Check-Out Location", children: /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `https://www.google.com/maps/search/?api=1&query=${log.check_out_latitude},${log.check_out_longitude}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-rose-600 font-bold mr-1", children: "OUT" }),
                    Number(log.check_out_latitude || 0).toFixed(4),
                    ", ",
                    Number(log.check_out_longitude || 0).toFixed(4)
                  ]
                }
              ) }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] text-muted-foreground italic ml-2", children: "Belum checkout" })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: log.status }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-foreground", children: [
                /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" })
              ] }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Aksi" }),
                /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/presences/${log.id}`, className: "cursor-pointer flex items-center", children: [
                  /* @__PURE__ */ jsx(Eye, { className: "mr-2 h-4 w-4 text-muted-foreground" }),
                  " Lihat Detail"
                ] }) }),
                log.status === "pending" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => openActionDialog("approve", log), className: "text-emerald-600 focus:text-emerald-600 cursor-pointer", children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "mr-2 h-4 w-4" }),
                    " Setujui"
                  ] }),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => openActionDialog("reject", log), className: "text-rose-600 focus:text-rose-600 cursor-pointer", children: [
                    /* @__PURE__ */ jsx(XCircle, { className: "mr-2 h-4 w-4" }),
                    " Tolak"
                  ] })
                ] })
              ] })
            ] }) })
          ] }, log.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-8 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground hidden flex-1 text-sm lg:flex", children: [
          "Menampilkan ",
          presences.from || 0,
          " sampai ",
          presences.to || 0,
          " dari ",
          totalLogs,
          " hasil"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex w-full items-center gap-2 lg:w-fit overflow-x-auto pb-2", children: presences.links.map((link, i) => /* @__PURE__ */ jsx(Link, { href: link.url || "#", preserveScroll: true, preserveState: true, children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: link.active ? "default" : "outline",
            size: "sm",
            disabled: !link.url,
            dangerouslySetInnerHTML: { __html: link.label }
          }
        ) }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: actionDialog.open, onOpenChange: (open) => !open && setActionDialog((prev) => ({ ...prev, open: false })), children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          actionDialog.type === "approve" ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-emerald-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5 text-rose-600" }),
          "Konfirmasi Aksi"
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Apakah Anda yakin ingin ",
          actionDialog.type === "approve" ? "menyetujui" : "menolak",
          " presensi dari ",
          /* @__PURE__ */ jsx("b", { children: actionDialog.log?.user.name }),
          "?"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Proyek: ",
          actionDialog.log?.project?.name || "-",
          " ",
          /* @__PURE__ */ jsx("br", {}),
          "Waktu: ",
          actionDialog.log?.date,
          " ",
          actionDialog.log?.check_in_at ? format(new Date(actionDialog.log.check_in_at), "HH:mm") : ""
        ] }),
        actionDialog.type === "reject" && /* @__PURE__ */ jsx(Textarea, { placeholder: "Alasan penolakan (opsional)", className: "mt-4" })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setActionDialog((prev) => ({ ...prev, open: false })), children: "Batal" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: actionDialog.type === "approve" ? "default" : "destructive",
            onClick: handleActionConfirm,
            className: "gap-2",
            children: actionDialog.type === "approve" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
              " Setujui Presensi"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
              " Tolak Presensi"
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: isCheckoutDialogOpen, onOpenChange: setIsCheckoutDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Check-Out Kerja" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Pastikan Anda sudah menyelesaikan pekerjaan sebelum melakukan check-out." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Lokasi Check-out" }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 p-3 bg-muted/30 rounded-md border border-dashed", children: loadingLocation ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-sm italic", children: "Mengambil lokasi..." })
          ] }) : checkoutData.latitude ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-emerald-600" }),
            " ",
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-mono", children: [
              Number(checkoutData.latitude).toFixed(6),
              ", ",
              Number(checkoutData.longitude).toFixed(6)
            ] })
          ] }) : /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: handleFetchCheckoutLocation, children: "Ambil Lokasi" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "checkout-notes", children: "Catatan (Opsional)" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "checkout-notes",
              placeholder: "Apa yang telah diselesaikan hari ini?",
              value: checkoutData.notes,
              onChange: (e) => setCheckoutData((prev) => ({ ...prev, notes: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxs(Label, { children: [
            "Foto Check-out ",
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsx("canvas", { ref: canvasRef, className: "hidden" }),
          !isCameraOpen && !checkoutData.image && /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed rounded-lg h-[200px] flex flex-col items-center justify-center p-4 bg-muted/30 gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-muted rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Camera, { className: "h-5 w-5 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-center space-y-1", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-xs", children: "Ambil Foto Check-out" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground max-w-[150px] mx-auto", children: "Wajib sebagai bukti penyelesaian kerja" })
            ] }),
            /* @__PURE__ */ jsxs(Button, { type: "button", onClick: () => startCamera("user"), variant: "outline", size: "sm", className: "gap-2", children: [
              /* @__PURE__ */ jsx(Camera, { className: "h-4 w-4" }),
              "Buka Kamera"
            ] })
          ] }),
          isCameraOpen && /* @__PURE__ */ jsxs("div", { className: "relative rounded-lg overflow-hidden bg-black aspect-video flex flex-col border", children: [
            /* @__PURE__ */ jsx(
              "video",
              {
                ref: videoRef,
                autoPlay: true,
                playsInline: true,
                className: "flex-1 object-cover w-full h-full"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-4 items-center", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "secondary",
                  size: "icon",
                  onClick: stopCamera,
                  className: "h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white border-0",
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  size: "icon",
                  className: "h-12 w-12 rounded-full border-2 border-white bg-transparent hover:bg-white/20",
                  onClick: capturePhoto,
                  children: /* @__PURE__ */ jsx("div", { className: "h-9 w-9 rounded-full bg-white" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "secondary",
                  size: "icon",
                  onClick: switchCamera,
                  className: "h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white border-0",
                  children: /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }),
          checkoutData.image && !isCameraOpen && /* @__PURE__ */ jsxs("div", { className: "relative rounded-lg overflow-hidden border bg-muted aspect-video group", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: URL.createObjectURL(checkoutData.image),
                alt: "Preview",
                className: "w-full h-full object-cover"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxs(Button, { type: "button", onClick: retakePhoto, variant: "secondary", size: "sm", children: [
              /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4 mr-2" }),
              "Foto Ulang"
            ] }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
          setIsCheckoutDialogOpen(false);
          stopCamera();
        }, children: "Batal" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleCheckoutSubmit,
            disabled: !checkoutData.latitude || loadingLocation || !checkoutData.image,
            className: "bg-rose-600 hover:bg-rose-700",
            children: "Confirm Check-Out"
          }
        )
      ] })
    ] }) })
  ] });
}
function PlusIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M5 12h14" }),
        /* @__PURE__ */ jsx("path", { d: "M12 5v14" })
      ]
    }
  );
}
export {
  PresenceIndex as default
};
