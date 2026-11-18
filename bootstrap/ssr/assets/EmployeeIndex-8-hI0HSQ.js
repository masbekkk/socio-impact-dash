import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-CQ-8azZr.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { Search, FileText } from "lucide-react";
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
import "axios";
import "date-fns";
import "date-fns/locale";
function EmployeeProjectIndex({ projects }) {
  const [search, setSearch] = useState("");
  const filteredProjects = projects.filter(
    (project) => `${project.code} ${project.initial_project || ""} ${project.name}`.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs: [{ title: "Proyek", href: "/projects" }], children: [
    /* @__PURE__ */ jsx(Head, { title: "Laporan Proyek" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-3xl space-y-6 p-4 md:p-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Laporan & Monitoring Proyek" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Pilih proyek untuk mengisi laporan atau melihat monitoring." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            "aria-label": "Cari proyek",
            placeholder: "Cari kode, inisial, atau nama proyek",
            value: search,
            onChange: (event) => setSearch(event.target.value),
            className: "pl-10"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filteredProjects.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rounded-lg border p-6 text-center text-sm text-muted-foreground", children: "Tidak ada proyek aktif yang cocok." }) : filteredProjects.map((project) => /* @__PURE__ */ jsxs(
        Link,
        {
          href: `/projects/${project.uuid}`,
          className: "flex items-center gap-3 rounded-lg border bg-white p-4 hover:border-primary hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          children: [
            /* @__PURE__ */ jsx(FileText, { className: "size-5 shrink-0 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "min-w-0 text-sm font-medium", children: [project.code, project.initial_project, project.name].filter(Boolean).join(" - ") })
          ]
        },
        project.uuid
      )) })
    ] })
  ] });
}
export {
  EmployeeProjectIndex as default
};
