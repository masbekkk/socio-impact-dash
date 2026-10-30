import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import { A as AppSidebarLayout } from "./app-sidebar-layout-CQ-8azZr.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DAjHeOuX.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { ArrowLeft, FileText } from "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./button-hAi0Fg-Q.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "./use-permission-D0a8sZAO.js";
import "date-fns";
import "date-fns/locale";
import "@radix-ui/react-label";
const rupiah = (amount) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
function TerminUpload({ project, termins }) {
  const [savingTermId, setSavingTermId] = useState(null);
  const [message, setMessage] = useState(null);
  const updateTermin = async (termId, data, successMessage) => {
    setSavingTermId(termId);
    setMessage(null);
    try {
      await axios.post(`/api/v1/projects/${project.uuid}/termins/${termId}`, data);
      setMessage({ text: successMessage, error: false });
      router.reload({ only: ["termins"] });
    } catch {
      setMessage({ text: "Perubahan termin gagal disimpan. Periksa file dan coba lagi.", error: true });
    } finally {
      setSavingTermId(null);
    }
  };
  const upload = (termId, field, file) => {
    if (!file) return;
    const data = new FormData();
    data.append(field, file);
    void updateTermin(termId, data, "Dokumen termin berhasil diunggah.");
  };
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs: [{ title: "Proyek", href: "/projects" }, { title: "Upload Termin", href: `/projects/${project.uuid}/termins` }], children: [
    /* @__PURE__ */ jsx(Head, { title: `Upload Termin ${project.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-4xl space-y-6 p-4 md:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Link, { href: "/projects", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }),
          " Kembali ke daftar proyek"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Upload Termin" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: [project.code, project.initial_project, project.name].filter(Boolean).join(" - ") })
      ] }),
      message && /* @__PURE__ */ jsx("p", { role: "status", className: `rounded-lg border p-3 text-sm ${message.error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`, children: message.text }),
      termins.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rounded-lg border p-6 text-sm text-muted-foreground", children: "Belum ada termin pembayaran untuk proyek ini." }) : termins.map((term, index) => /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg", children: [
              "Termin #",
              index + 1
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Jatuh tempo: ",
              term.due_date ? new Date(term.due_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-right font-mono text-sm font-semibold", children: rupiah(Number(term.nominal)) })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 text-sm sm:grid-cols-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Deliverables" }),
              /* @__PURE__ */ jsx("p", { children: term.notes || "-" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Nomor Surat" }),
              /* @__PURE__ */ jsx("p", { children: term.nomor_surat || "-" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Tertuju" }),
              /* @__PURE__ */ jsx("p", { children: term.tertuju || "-" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-5 border-t pt-5 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: `billing-${term.id}`, children: "Dokumen Penagihan" }),
              term.billing_document_url && /* @__PURE__ */ jsxs("a", { href: term.billing_document_url, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 text-sm text-primary underline-offset-2 hover:underline", children: [
                /* @__PURE__ */ jsx(FileText, { className: "size-4" }),
                " Lihat dokumen yang sudah diunggah"
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: `billing-${term.id}`,
                  type: "file",
                  accept: ".pdf,.jpg,.jpeg,.png",
                  "aria-label": term.billing_document_url ? "Ganti dokumen penagihan" : "Upload dokumen penagihan",
                  disabled: savingTermId === term.id,
                  onChange: (event) => {
                    upload(term.id, "billing_file", event.target.files?.[0]);
                    event.target.value = "";
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: `proof-${term.id}`, children: "Bukti Pembayaran" }),
              term.proof_payment_url && /* @__PURE__ */ jsxs("a", { href: term.proof_payment_url, target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 text-sm text-primary underline-offset-2 hover:underline", children: [
                /* @__PURE__ */ jsx(FileText, { className: "size-4" }),
                " Lihat bukti yang sudah diunggah"
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: `proof-${term.id}`,
                  type: "file",
                  accept: ".pdf,.jpg,.jpeg,.png",
                  "aria-label": term.proof_payment_url ? "Ganti bukti pembayaran" : "Upload bukti pembayaran",
                  disabled: savingTermId === term.id,
                  onChange: (event) => {
                    upload(term.id, "proof_file", event.target.files?.[0]);
                    event.target.value = "";
                  }
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 border-t pt-4 text-sm", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: Boolean(term.verified_by),
                disabled: savingTermId === term.id,
                onChange: () => void updateTermin(term.id, { is_verified: !term.verified_by }, "Status verifikasi termin diperbarui.")
              }
            ),
            "Pembayaran terverifikasi"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Format: PDF, JPG, atau PNG. Maksimum 50 MB per file." })
        ] })
      ] }, term.id))
    ] })
  ] });
}
export {
  TerminUpload as default
};
