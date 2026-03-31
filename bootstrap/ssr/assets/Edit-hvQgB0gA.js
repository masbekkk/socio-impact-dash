import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent, f as CardFooter } from "./card-DAjHeOuX.js";
import { ArrowLeft, Loader2, User, FileText, Save } from "lucide-react";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { D as DatePicker } from "./DatePicker-DAaV_rdH.js";
import { format } from "date-fns";
import axios from "axios";
import { u as usePermission } from "./use-permission-D0a8sZAO.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "date-fns/locale";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "react-number-format";
function Edit({ projects, letterRequestId }) {
  const { auth } = usePage().props;
  const { hasRole } = usePermission();
  const userRole = auth.user.role_name;
  const [data, setData] = useState({
    project_id: "",
    letter_date: "",
    recipient: "",
    subject: "",
    pic_id: "",
    letter_code_id: "",
    letter_division_id: "",
    division_id: "",
    keterangan: ""
  });
  const [letterCodes, setLetterCodes] = useState([]);
  const [letterDivisions, setLetterDivisions] = useState([]);
  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [codesRes, divisionsRes, usersRes, mainDivRes, requestRes] = await Promise.all([
          axios.get("/api/v1/letter-codes"),
          axios.get("/api/v1/letter-divisions"),
          axios.get("/api/v1/users?per_page=1000"),
          axios.get("/api/v1/divisions?per_page=1000"),
          axios.get(`/api/v1/letter-requests/${letterRequestId}`)
        ]);
        setLetterCodes(codesRes.data.data);
        const allLetterDivs = divisionsRes.data.data;
        const filteredDivCodes = [];
        if (hasRole(["direktur", "superadmin"])) {
          filteredDivCodes.push("Direktur", "Finance", "HCM", "BOD");
        }
        if (hasRole("hr")) {
          filteredDivCodes.push("HR", "HCM");
        }
        if (hasRole("finance")) {
          filteredDivCodes.push("Finance", "FA");
        }
        if (hasRole("head") || filteredDivCodes.length === 0) {
          filteredDivCodes.push("PM");
        }
        const uniqueCodes = [...new Set(filteredDivCodes)];
        const filteredLetterDivs = allLetterDivs.filter(
          (d) => uniqueCodes.includes(d.code)
        );
        setLetterDivisions(filteredLetterDivs);
        setUsers(usersRes.data.data.data);
        setDivisions(mainDivRes.data.data.data);
        const reqData = requestRes.data.data;
        setData({
          project_id: reqData.project_id?.toString() || "",
          letter_date: reqData.letter_date ? format(new Date(reqData.letter_date), "yyyy-MM-dd") : "",
          recipient: reqData.recipient || "",
          subject: reqData.subject || "",
          pic_id: reqData.pic_id?.toString() || "",
          letter_code_id: reqData.letter_code_id?.toString() || "",
          letter_division_id: reqData.letter_division_id?.toString() || "",
          division_id: reqData.division_id?.toString() || "",
          keterangan: reqData.keterangan || ""
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Gagal memuat data nomor surat.");
        router.visit("/letter-requests");
      } finally {
        setLoadingData(false);
      }
    };
    fetchAllData();
  }, [letterRequestId, userRole]);
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Nomor Surat", href: "/letter-requests" },
    { title: "Edit Nomor Surat", href: `/letter-requests/${letterRequestId}/edit` }
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    try {
      await axios.put(`/api/v1/letter-requests/${letterRequestId}`, data);
      router.visit("/letter-requests");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error updating letter request:", error);
        alert("Terjadi kesalahan saat memperbarui nomor surat.");
      }
    } finally {
      setProcessing(false);
    }
  };
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Edit Nomor Surat" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "-ml-2", children: /* @__PURE__ */ jsx(Link, { href: "/letter-requests", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold tracking-tight", children: "Edit Nomor Surat" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Perbarui detail nomor surat Anda." })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "border-none shadow-sm rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "bg-white", children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Informasi Surat" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Ubah tujuan dan perihal surat atau data lainnya." })
        ] }),
        loadingData ? /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-48", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsx(CardContent, { className: "space-y-6 pt-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "project_id", children: [
              "Proyek Terkait ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              SearchableSelect,
              {
                options: projects.map((p) => ({ value: p.id.toString(), label: `${p.code} - ${p.name}` })),
                value: data.project_id,
                onValueChange: (val) => setData({ ...data, project_id: val }),
                placeholder: "Pilih proyek"
              }
            ),
            errors.project_id && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium", children: errors.project_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "letter_date", children: [
              "Tanggal Surat ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              DatePicker,
              {
                value: data.letter_date,
                onChange: (v) => setData({ ...data, letter_date: v })
              }
            ),
            errors.letter_date && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium", children: errors.letter_date })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "letter_code_id", children: [
              "Kode Surat ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              SearchableSelect,
              {
                options: letterCodes.map((code) => ({
                  value: code.id.toString(),
                  label: `${code.code} ${code.description ? `- ${code.description}` : ""}`
                })),
                value: data.letter_code_id,
                onValueChange: (val) => setData({ ...data, letter_code_id: val }),
                placeholder: "Pilih kode surat"
              }
            ),
            errors.letter_code_id && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium", children: errors.letter_code_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "letter_division_id", children: [
              "Divisi Surat ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              SearchableSelect,
              {
                options: letterDivisions.map((div) => ({
                  value: div.id.toString(),
                  label: `${div.code} ${div.description ? `- ${div.description}` : ""}`
                })),
                value: data.letter_division_id,
                onValueChange: (val) => setData({ ...data, letter_division_id: val }),
                placeholder: "Pilih divisi"
              }
            ),
            errors.letter_division_id && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium", children: errors.letter_division_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "recipient", children: [
              "Surat Tertuju Kepada ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "recipient",
                  placeholder: "Contoh: Direktur PT Sinergi Alam",
                  className: "pl-9 h-10 w-full",
                  value: data.recipient,
                  onChange: (e) => setData({ ...data, recipient: e.target.value })
                }
              )
            ] }),
            errors.recipient && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium", children: errors.recipient })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "subject", children: [
              "Perihal ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(FileText, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "subject",
                  placeholder: "Contoh: Permohonan Izin Lokasi",
                  className: "pl-9 h-10 w-full",
                  value: data.subject,
                  onChange: (e) => setData({ ...data, subject: e.target.value })
                }
              )
            ] }),
            errors.subject && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium", children: errors.subject })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "division_id", children: [
              "Divisi Perusahaan ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              SearchableSelect,
              {
                options: Array.from(new Map(divisions.map((d) => [d.division_code?.id, d.division_code])).values()).filter((dc) => dc !== void 0 && dc !== null).map((dc) => ({
                  value: dc.id.toString(),
                  label: `${dc.code} - ${dc.name}`
                })),
                value: data.division_id,
                onValueChange: (val) => setData({ ...data, division_id: val }),
                placeholder: "Pilih divisi perusahaan"
              }
            ),
            errors.division_id && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium", children: errors.division_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "keterangan", children: "Keterangan (Opsional)" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "keterangan",
                placeholder: "Tambahkan keterangan tambahan jika ada...",
                className: "min-h-[100px] w-full",
                value: data.keterangan,
                onChange: (e) => setData({ ...data, keterangan: e.target.value })
              }
            ),
            errors.keterangan && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium", children: errors.keterangan })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(CardFooter, { className: "bg-gray-50 border-t flex justify-end gap-3 p-6 mt-4", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", type: "button", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/letter-requests", children: "Batal" }) }),
          /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: processing || loadingData, className: "bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)]/90", children: [
            processing ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
            "Simpan Perubahan"
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Edit as default
};
