import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppSidebarLayout, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, e as DropdownMenuItem, d as DropdownMenuSeparator } from "./app-sidebar-layout-BRoV_jj3.js";
import { Link, Head } from "@inertiajs/react";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DAjHeOuX.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { S as Separator } from "./separator-CjIBof9L.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, ChevronDown, CheckCircle, XCircle, Briefcase, FileText, MapPin } from "lucide-react";
import { S as StatusBadge } from "./StatusBadge-CfpbUrIp.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { id } from "date-fns/locale";
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
import "@radix-ui/react-separator";
import "@radix-ui/react-label";
function PresenceShow({ presence }) {
  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: null
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const openActionDialog = (type) => {
    setActionDialog({ open: true, type });
  };
  const handleActionConfirm = () => {
    if (!actionDialog.type) return;
    const action = actionDialog.type === "approve" ? "Menyetujui" : "Menolak";
    const message = actionDialog.type === "reject" && rejectionReason ? `${action} presensi untuk ${presence.user?.name}
Alasan: ${rejectionReason}` : `${action} presensi untuk ${presence.user?.name}`;
    alert(`Konfirmasi: ${message}`);
    setActionDialog({ open: false, type: null });
    setRejectionReason("");
  };
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Presensi", href: "/presences" },
    { title: "Detail Presensi", href: "#" }
  ];
  if (!presence || !presence.id) {
    return /* @__PURE__ */ jsx(AppSidebarLayout, { breadcrumbs, children: /* @__PURE__ */ jsxs("div", { className: "p-10 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Data Presensi Tidak Ditemukan" }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4", variant: "outline", children: /* @__PURE__ */ jsx(Link, { href: "/presences", children: "Kembali" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: `Detail Presensi - ${presence.user?.name || "Unknown"}` }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 w-full mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "-ml-2", children: /* @__PURE__ */ jsx(Link, { href: "/presences", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Detail Presensi" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-sm mt-1", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5" }),
              " ",
              format(new Date(presence.date), "dd MMMM yyyy", { locale: id }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "|" }),
              /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5" }),
              " ",
              presence.check_in_at ? format(new Date(presence.check_in_at), "HH:mm") : "-"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(StatusBadge, { status: presence.status }),
          presence.status === "pending" && /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2", children: [
              "Aksi ",
              /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
            ] }) }),
            /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-emerald-600 focus:text-emerald-600 cursor-pointer", onClick: () => openActionDialog("approve"), children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "mr-2 h-4 w-4" }),
                " Setujui"
              ] }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "text-rose-600 focus:text-rose-600 cursor-pointer", onClick: () => openActionDialog("reject"), children: [
                /* @__PURE__ */ jsx(XCircle, { className: "mr-2 h-4 w-4" }),
                " Tolak"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Detail Kegiatan" }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: "Proyek" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-medium text-base", children: [
                  /* @__PURE__ */ jsx(Briefcase, { className: "h-4 w-4 text-primary" }),
                  presence.project?.name || "Unknown Project"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground ml-6", children: presence.project?.code })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: "Aktifitas" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed bg-muted/30 p-4 rounded-lg border", children: presence.activity })
              ] }),
              presence.notes && /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-muted-foreground", children: "Catatan Tambahan" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2 text-sm text-foreground/80", children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 mt-0.5 text-muted-foreground" }),
                  presence.notes
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Dokumentasi Foto" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold text-emerald-600 uppercase tracking-wider", children: "Foto Check-In" }),
                /* @__PURE__ */ jsx("div", { className: "rounded-lg overflow-hidden border bg-muted relative group aspect-[4/3]", children: presence.image_url ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: presence.image_url,
                    alt: "Foto Check-In",
                    className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  }
                ) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(CameraIcon, { className: "h-8 w-8 mb-2 opacity-20" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs", children: "Tidak ada foto" })
                ] }) }),
                /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground italic flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                  " ",
                  presence.check_in_at ? format(new Date(presence.check_in_at), "HH:mm") : "-"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold text-rose-600 uppercase tracking-wider", children: "Foto Check-Out" }),
                /* @__PURE__ */ jsx("div", { className: "rounded-lg overflow-hidden border bg-muted relative group aspect-[4/3]", children: presence.checkout_image_url ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: presence.checkout_image_url,
                    alt: "Foto Check-Out",
                    className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  }
                ) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(CameraIcon, { className: "h-8 w-8 mb-2 opacity-20" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs", children: "Belum check-out / Tidak ada foto" })
                ] }) }),
                /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground italic flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                  " ",
                  presence.check_out_at ? format(new Date(presence.check_out_at), "HH:mm") : "-"
                ] })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Informasi Karyawan" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg", children: presence.user?.name?.charAt(0) || "U" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold", children: presence.user?.name || "Unknown User" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: presence.user?.position || "N/A" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: presence.user?.email || "No Email" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Lokasi & Waktu" }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[10px]", children: "Check-In" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: presence.check_in_at ? format(new Date(presence.check_in_at), "HH:mm") : "-" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-muted/30 p-3 rounded-md border flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "truncate", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono text-muted-foreground", children: "Coordinates" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium truncate", children: [
                      presence.check_in_latitude,
                      ", ",
                      presence.check_in_longitude
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full text-xs h-8", asChild: true, children: /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: `https://www.google.com/maps/search/?api=1&query=${presence.check_in_latitude},${presence.check_in_longitude}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: "View on Maps"
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsx(Separator, {}),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-rose-50 text-rose-700 border-rose-200 uppercase text-[10px]", children: "Check-Out" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: presence.check_out_at ? format(new Date(presence.check_out_at), "HH:mm") : "Belum Check-out" })
                ] }),
                presence.check_out_at && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-muted/30 p-3 rounded-md border flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "truncate", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-mono text-muted-foreground", children: "Coordinates" }),
                      /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium truncate", children: [
                        presence.check_out_latitude,
                        ", ",
                        presence.check_out_longitude
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full text-xs h-8", asChild: true, children: /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: `https://www.google.com/maps/search/?api=1&query=${presence.check_out_latitude},${presence.check_out_longitude}`,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      children: "View on Maps"
                    }
                  ) })
                ] })
              ] })
            ] })
          ] })
        ] })
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
          /* @__PURE__ */ jsx("b", { children: presence.user?.name }),
          "?"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Proyek: ",
          presence.project?.name || "-",
          " ",
          /* @__PURE__ */ jsx("br", {}),
          "Waktu: ",
          presence.date,
          " ",
          presence.check_in_at ? format(new Date(presence.check_in_at), "HH:mm") : "-"
        ] }),
        actionDialog.type === "reject" && /* @__PURE__ */ jsx(
          Textarea,
          {
            placeholder: "Alasan penolakan (opsional)",
            className: "mt-4",
            value: rejectionReason,
            onChange: (e) => setRejectionReason(e.target.value)
          }
        )
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
    ] }) })
  ] });
}
function CameraIcon(props) {
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
        /* @__PURE__ */ jsx("path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "13", r: "3" })
      ]
    }
  );
}
export {
  PresenceShow as default
};
