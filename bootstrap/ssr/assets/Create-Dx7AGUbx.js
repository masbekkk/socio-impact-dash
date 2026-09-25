import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-BRoV_jj3.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { C as Card } from "./card-DAjHeOuX.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { ArrowLeft, Camera, X, RotateCcw, Loader2, MapPin, Save } from "lucide-react";
import { S as Separator } from "./separator-CjIBof9L.js";
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
import "date-fns";
import "date-fns/locale";
import "clsx";
import "tailwind-merge";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "@radix-ui/react-label";
import "@radix-ui/react-separator";
function CreatePresence({ projects }) {
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Presensi", href: "/presences" },
    { title: "Buat Presensi", href: "/presences/create" }
  ];
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState("user");
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);
  useEffect(() => {
    handleFetchLocation();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  const { data, setData, post, processing, errors } = useForm({
    project_id: "",
    activity: "",
    notes: "",
    lat: "",
    lng: "",
    image: null
  });
  const handleFetchLocation = () => {
    setLoadingLocation(true);
    if (!window.isSecureContext) {
      alert("Fitur lokasi membutuhkan koneksi aman (HTTPS). Silakan akses aplikasi menggunakan HTTPS atau localhost.");
      setLoadingLocation(false);
      return;
    }
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser ini.");
      setLoadingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setData((prev) => ({
          ...prev,
          lat: pos.coords.latitude.toString(),
          lng: pos.coords.longitude.toString()
        }));
        setLoadingLocation(false);
      },
      (err) => {
        let errorMessage = "Gagal mengambil lokasi.";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Akses lokasi ditolak. Harap izinkan akses lokasi di pengaturan browser Anda.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Informasi lokasi tidak tersedia. Pastikan GPS perangkat Anda aktif.";
            break;
          case err.TIMEOUT:
            errorMessage = "Permintaan lokasi kehabisan waktu.";
            break;
        }
        alert(errorMessage);
        console.error("Geolocation Error:", err);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 1e4,
        maximumAge: 0
      }
    );
  };
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
            const file = new File([blob], `presence_${Date.now()}.jpg`, { type: "image/jpeg" });
            setData("image", file);
            stopCamera();
          }
        }, "image/jpeg", 0.8);
      }
    }
  };
  const retakePhoto = () => {
    setData("image", null);
    startCamera(cameraFacingMode);
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setData("image", e.target.files[0]);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.activity || !data.lat || !data.image) {
      alert("Harap lengkapi semua data wajib (Kegiatan, Lokasi, dan Foto).");
      return;
    }
    post("/presences", {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Buat Presensi" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "-ml-2", children: /* @__PURE__ */ jsx(Link, { href: "/presences", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight", children: "Form Presensi Di Luar Kantor" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Isi formulir di bawah ini untuk melakukan presensi di luar kantor." })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "border-none shadow-sm rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-white space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Detail Kegiatan" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Informasi proyek dan aktivitas yang dilakukan." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "project", children: "Proyek" }),
                /* @__PURE__ */ jsx(
                  SearchableSelect,
                  {
                    options: projects.map((p) => ({ value: p.id.toString(), label: `${p.code} - ${p.initial_project} - ${p.name}` })),
                    value: data.project_id,
                    onValueChange: (val) => setData("project_id", val),
                    placeholder: "Pilih Proyek..."
                  }
                ),
                errors.project_id && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: errors.project_id })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "activity", children: [
                  "Kegiatan ",
                  /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "activity",
                    placeholder: "Judul kegiatan singkat...",
                    value: data.activity,
                    onChange: (e) => setData("activity", e.target.value),
                    className: "h-10"
                  }
                ),
                errors.activity && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: errors.activity })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-1", children: "Bukti Kehadiran" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Lokasi dan foto dokumentasi wajib disertakan." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "documentation", children: [
                "Dokumentasi (Foto) ",
                /* @__PURE__ */ jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsx("canvas", { ref: canvasRef, className: "hidden" }),
              !isCameraOpen && !data.image && /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed rounded-lg h-[250px] flex flex-col items-center justify-center p-6 bg-muted/30 gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "h-12 w-12 bg-muted rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Camera, { className: "h-6 w-6 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxs("div", { className: "text-center space-y-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: "Ambil Foto Presensi" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground max-w-[200px] mx-auto", children: "Pastikan wajah dan lokasi terlihat jelas" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-3 mt-2", children: [
                  /* @__PURE__ */ jsxs(Button, { type: "button", onClick: () => startCamera("user"), variant: "outline", className: "gap-2", children: [
                    /* @__PURE__ */ jsx(Camera, { className: "h-4 w-4" }),
                    "Buka Kamera"
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      ref: fileInputRef,
                      onChange: handleFileChange,
                      accept: "image/*",
                      className: "hidden"
                    }
                  )
                ] })
              ] }),
              isCameraOpen && /* @__PURE__ */ jsxs("div", { className: "relative rounded-lg overflow-hidden bg-black aspect-[3/4] md:aspect-video flex flex-col", children: [
                /* @__PURE__ */ jsx(
                  "video",
                  {
                    ref: videoRef,
                    autoPlay: true,
                    playsInline: true,
                    className: "flex-1 object-cover w-full h-full"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-6 items-center", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "secondary",
                      size: "icon",
                      onClick: stopCamera,
                      className: "h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white border-0",
                      children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      size: "icon",
                      className: "h-16 w-16 rounded-full border-4 border-white bg-transparent hover:bg-white/20",
                      onClick: capturePhoto,
                      children: /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-white" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "secondary",
                      size: "icon",
                      onClick: switchCamera,
                      className: "h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white border-0",
                      children: /* @__PURE__ */ jsx(RotateCcw, { className: "h-5 w-5" })
                    }
                  )
                ] })
              ] }),
              data.image && !isCameraOpen && /* @__PURE__ */ jsxs("div", { className: "relative rounded-lg overflow-hidden border bg-muted aspect-[3/4] md:aspect-video group", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: URL.createObjectURL(data.image),
                    alt: "Preview",
                    className: "w-full h-full object-cover"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxs(Button, { type: "button", onClick: retakePhoto, variant: "secondary", children: [
                  /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4 mr-2" }),
                  "Foto Ulang"
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded", children: data.image.name })
              ] }),
              errors.image && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: errors.image })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 bg-gray-50 flex justify-between items-center border-t", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-sm text-muted-foreground overflow-hidden", children: loadingLocation ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin shrink-0" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "truncate", children: "Mengambil lokasi..." })
          ] }) : data.lat ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 text-primary shrink-0" }),
            " ",
            /* @__PURE__ */ jsxs("span", { className: "truncate hidden sm:inline", children: [
              "Lokasi: ",
              Number(data.lat).toFixed(4),
              ", ",
              Number(data.lng).toFixed(4)
            ] }),
            /* @__PURE__ */ jsx("span", { className: "truncate sm:hidden", children: "Lokasi Terkunci" })
          ] }) : /* @__PURE__ */ jsxs("span", { className: "text-destructive flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 shrink-0" }),
            " Gagal ambil lokasi"
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 w-full sm:w-auto ml-2 shrink-0", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", type: "button", className: "w-full sm:w-auto", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/presences", children: "Batal" }) }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "submit",
                className: "w-full sm:w-auto bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90",
                disabled: processing || !data.lat || !data.image,
                title: !data.lat ? "Menunggu lokasi..." : !data.image ? "Upload foto terlebih dahulu" : "Kirim Presensi",
                children: [
                  /* @__PURE__ */ jsx(Save, { className: "h-4 w-4 mr-2" }),
                  "Kirim Presensi"
                ]
              }
            )
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  CreatePresence as default
};
