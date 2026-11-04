import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import { A as AppSidebarLayout } from "./app-sidebar-layout-CQ-8azZr.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DAjHeOuX.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-C8TeAzVF.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { ArrowLeft, Plus, Trash2, FileText } from "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "./use-permission-D0a8sZAO.js";
import "date-fns";
import "date-fns/locale";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
function EmployeeProjectShow({ project, monitorings }) {
  const [date, setDate] = useState((/* @__PURE__ */ new Date()).toLocaleDateString("sv-SE"));
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([{ id: 1, title: "", file: null }]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("laporan");
  const submitReport = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("report_date", date);
    data.append("notes", notes);
    files.filter((entry) => entry.file).forEach((entry, index) => {
      data.append(`documents[${index}][file]`, entry.file);
      if (entry.title) data.append(`documents[${index}][title]`, entry.title);
    });
    setSubmitting(true);
    setMessage(null);
    try {
      await axios.post(`/api/v1/projects/${project.uuid}/monitorings`, data);
      setNotes("");
      setFiles([{ id: Date.now(), title: "", file: null }]);
      setMessage({ text: "Laporan berhasil dikirim.", error: false });
      setActiveTab("monitoring");
      router.reload({ only: ["monitorings"] });
    } catch {
      setMessage({ text: "Gagal mengirim laporan. Periksa tanggal dan lampiran, lalu coba lagi.", error: true });
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs: [{ title: "Proyek", href: "/projects" }, { title: project.name, href: `/projects/${project.uuid}` }], children: [
    /* @__PURE__ */ jsx(Head, { title: `Laporan ${project.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-4xl space-y-6 p-4 md:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Link, { href: "/projects", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }),
          " Kembali ke daftar proyek"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: [project.code, project.initial_project, project.name].filter(Boolean).join(" - ") })
      ] }),
      message && /* @__PURE__ */ jsx("p", { role: "status", className: `rounded-lg border p-3 text-sm ${message.error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`, children: message.text }),
      /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [
        /* @__PURE__ */ jsxs(TabsList, { children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "laporan", children: "Laporan" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "monitoring", children: "Monitoring" })
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "laporan", className: "mt-4 space-y-6", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Isi Laporan Proyek" }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: submitReport, className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "report-date", children: "Tanggal Laporan" }),
                /* @__PURE__ */ jsx(Input, { id: "report-date", type: "date", required: true, value: date, onChange: (event) => setDate(event.target.value) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "report-notes", children: "Catatan / Kendala / Progres" }),
                /* @__PURE__ */ jsx(Textarea, { id: "report-notes", value: notes, onChange: (event) => setNotes(event.target.value), placeholder: "Tuliskan perkembangan proyek", rows: 5 })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Lampiran Dokumen" }),
                  /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setFiles([...files, { id: Date.now(), title: "", file: null }]), children: [
                    /* @__PURE__ */ jsx(Plus, { className: "mr-1 size-4" }),
                    " Tambah File"
                  ] })
                ] }),
                files.map((entry) => /* @__PURE__ */ jsxs("div", { className: "grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto]", children: [
                  /* @__PURE__ */ jsx(Input, { "aria-label": "Judul dokumen", placeholder: "Judul dokumen", value: entry.title, onChange: (event) => setFiles(files.map((file) => file.id === entry.id ? { ...file, title: event.target.value } : file)) }),
                  /* @__PURE__ */ jsx(Input, { "aria-label": "Pilih file", type: "file", accept: ".pdf,.jpg,.jpeg,.png", onChange: (event) => setFiles(files.map((file) => file.id === entry.id ? { ...file, file: event.target.files?.[0] || null } : file)) }),
                  /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", "aria-label": "Hapus baris file", onClick: () => setFiles(files.filter((file) => file.id !== entry.id)), children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" }) })
                ] }, entry.id))
              ] }),
              /* @__PURE__ */ jsx(Button, { type: "submit", disabled: submitting, children: submitting ? "Mengirim..." : "Kirim Laporan" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Dokumen yang Sudah Diunggah" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Periksa daftar laporan dan lampiran proyek ini sebelum mengunggah dokumen baru." })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
              monitorings.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Belum ada laporan atau dokumen yang diunggah." }) : monitorings.map((report) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border p-4 space-y-2", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium", children: [
                  new Date(report.report_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
                  /* @__PURE__ */ jsxs("span", { className: "ml-2 font-normal text-muted-foreground", children: [
                    "oleh ",
                    report.creator_name || "-"
                  ] })
                ] }),
                report.notes && /* @__PURE__ */ jsx("p", { className: "line-clamp-2 text-sm text-muted-foreground", children: report.notes }),
                report.documents.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Tanpa lampiran" }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-x-4 gap-y-2", children: report.documents.map((document) => document.url ? /* @__PURE__ */ jsxs("a", { href: document.url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 text-sm text-primary underline-offset-2 hover:underline", children: [
                  /* @__PURE__ */ jsx(FileText, { className: "size-4" }),
                  " ",
                  document.title || document.original_name
                ] }, document.id) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(FileText, { className: "size-4" }),
                  " ",
                  document.title || document.original_name,
                  " (",
                  document.upload_status === "failed" ? "gagal diunggah" : "sedang diproses",
                  ")"
                ] }, document.id)) })
              ] }, report.id)),
              monitorings.length > 0 && /* @__PURE__ */ jsx(Button, { type: "button", variant: "link", className: "px-0", onClick: () => setActiveTab("monitoring"), children: "Lihat riwayat monitoring lengkap" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "monitoring", className: "mt-4 space-y-3", children: monitorings.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rounded-lg border p-6 text-sm text-muted-foreground", children: "Belum ada laporan monitoring." }) : monitorings.map((report) => /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: new Date(report.report_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Dilaporkan oleh ",
              report.creator_name || "-"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap text-sm", children: report.notes || "-" }),
            report.documents.map((document) => document.url ? /* @__PURE__ */ jsxs("a", { href: document.url, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 text-sm text-primary underline-offset-2 hover:underline", children: [
              /* @__PURE__ */ jsx(FileText, { className: "size-4" }),
              " ",
              document.title || document.original_name
            ] }, document.id) : /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(FileText, { className: "size-4" }),
              " ",
              document.title || document.original_name,
              " (",
              document.upload_status === "failed" ? "gagal diunggah" : "sedang diproses",
              ")"
            ] }, document.id))
          ] })
        ] }, report.id)) })
      ] })
    ] })
  ] });
}
export {
  EmployeeProjectShow as default
};
