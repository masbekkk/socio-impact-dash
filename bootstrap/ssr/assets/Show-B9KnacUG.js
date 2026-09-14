import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppSidebarLayout } from "./app-sidebar-layout-BRoV_jj3.js";
import { Head, Link } from "@inertiajs/react";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { C as Card, a as CardContent } from "./card-DAjHeOuX.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Calendar, Clock, MapPin, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
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
import "@radix-ui/react-label";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
const mockDate = /* @__PURE__ */ new Date();
const selectedDateString = format(mockDate, "yyyy-MM-dd");
const allEvents = calendarEventsData;
const mockEvents = allEvents.filter((event) => event.date === selectedDateString);
const EVENT_TYPE_CONFIG = {
  meeting: {
    color: "bg-blue-500 border-blue-600",
    textColor: "text-white"
  },
  deadline: {
    color: "bg-red-500 border-red-600",
    textColor: "text-white"
  },
  task: {
    color: "bg-slate-500 border-slate-600",
    textColor: "text-white"
  },
  holiday: {
    color: "bg-orange-500 border-orange-600",
    textColor: "text-white"
  },
  project: {
    color: "bg-emerald-600 border-emerald-700",
    textColor: "text-white"
  }
};
function CalendarShow() {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: selectedDateString,
    start_time: "09:00",
    end_time: "10:00",
    type: "meeting",
    location: "",
    description: "",
    organizer: "",
    participants: ""
  });
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Kalender", href: "/calendar" },
    { title: format(mockDate, "dd MMMM yyyy", { locale: id }), href: "#" }
  ];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const getEventsForHour = (hour) => {
    return mockEvents.filter((event) => {
      const startHour = parseInt(event.start_time.split(":")[0]);
      const endHour = parseInt(event.end_time.split(":")[0]);
      return hour >= startHour && hour < endHour;
    });
  };
  const getEventStyle = (event) => {
    const [startHour, startMinute] = event.start_time.split(":").map(Number);
    const [endHour, endMinute] = event.end_time.split(":").map(Number);
    const startPosition = startMinute / 60 * 100;
    const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) / 60;
    const height = duration * 100;
    return {
      top: `${startPosition}%`,
      height: `${height}%`
    };
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    setFormData({
      title: "",
      date: selectedDateString,
      start_time: "09:00",
      end_time: "10:00",
      type: "meeting",
      location: "",
      description: "",
      organizer: "",
      participants: ""
    });
    setIsAddEventOpen(false);
    alert("Agenda berhasil ditambahkan!");
  };
  const prevDay = () => {
  };
  const nextDay = () => {
  };
  const goToToday = () => {
  };
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: `Agenda - ${format(mockDate, "dd MMMM yyyy", { locale: id })}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-h-[calc(100vh-6rem)] p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 md:gap-3", children: [
          /* @__PURE__ */ jsx(Link, { href: "/calendar", children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8 md:h-9 md:w-9 shrink-0", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-3.5 w-3.5 md:h-4 md:w-4" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 capitalize truncate", children: format(mockDate, "EEEE", { locale: id }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1", children: format(mockDate, "dd MMMM yyyy", { locale: id }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto sm:self-end", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center rounded-md border shadow-sm bg-white flex-1 sm:flex-initial", children: [
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: prevDay, className: "rounded-r-none border-r h-8 w-8 md:h-9 md:w-9 shrink-0", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5 md:h-4 md:w-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: goToToday, className: "rounded-none px-3 md:px-4 font-medium text-xs md:text-sm h-8 md:h-9 hover:bg-gray-50 flex-1 sm:flex-initial", children: "Hari Ini" }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: nextDay, className: "rounded-l-none border-l h-8 w-8 md:h-9 md:w-9 shrink-0", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5 md:h-4 md:w-4" }) })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: () => setIsAddEventOpen(true),
              className: "bg-[var(--sidebar)] hover:bg-[var(--sidebar)] text-white shadow-sm gap-1.5 md:gap-2 h-8 md:h-9 px-3 md:px-4 text-xs md:text-sm",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5 md:h-4 md:w-4" }),
                /* @__PURE__ */ jsx("span", { className: "hidden xs:inline", children: "Tambah" }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Agenda" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-14 md:w-20 flex-shrink-0 border-r bg-gray-50/50", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 md:h-12 border-b" }),
          " ",
          hours.map((hour) => /* @__PURE__ */ jsx("div", { className: "h-16 md:h-24 border-b flex items-start justify-end pr-2 md:pr-3 pt-1", children: /* @__PURE__ */ jsxs("span", { className: "text-[10px] md:text-xs font-medium text-gray-500", children: [
            hour.toString().padStart(2, "0"),
            ":00"
          ] }) }, hour))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 relative overflow-x-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 md:h-12 border-b bg-gray-50/50 flex items-center justify-center sticky top-0 z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 md:gap-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs md:text-sm font-semibold text-gray-700", children: [
              mockEvents.length,
              " Agenda"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "relative", children: hours.map((hour) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-16 md:h-24 border-b hover:bg-gray-50/50 transition-colors relative",
              children: getEventsForHour(hour).map((event) => {
                const eventConfig = EVENT_TYPE_CONFIG[event.type];
                const style = getEventStyle(event);
                const isFirstHour = parseInt(event.start_time.split(":")[0]) === hour;
                return isFirstHour ? /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: `/calendar/event/${event.id}`,
                    className: "absolute left-0.5 right-0.5 md:left-1 md:right-1 z-10",
                    style: {
                      top: style.top,
                      height: style.height,
                      minHeight: "48px"
                    },
                    children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: cn(
                          "h-full rounded-md md:rounded-lg border-l-2 md:border-l-4 p-1.5 md:p-2 shadow-sm hover:shadow-md transition-all cursor-pointer",
                          eventConfig.color,
                          eventConfig.textColor
                        ),
                        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-1 md:gap-2 h-full", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col", children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 md:gap-1.5 mb-0.5 md:mb-1", children: [
                              /* @__PURE__ */ jsx(Clock, { className: "h-2.5 w-2.5 md:h-3 md:w-3 opacity-90 shrink-0" }),
                              /* @__PURE__ */ jsxs("span", { className: "text-[10px] md:text-xs font-medium opacity-90 truncate", children: [
                                event.start_time,
                                " - ",
                                event.end_time
                              ] })
                            ] }),
                            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-xs md:text-sm mb-0.5 md:mb-1 line-clamp-2", children: event.title }),
                            event.location && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs opacity-90 mb-0.5", children: [
                              /* @__PURE__ */ jsx(MapPin, { className: "h-2.5 w-2.5 md:h-3 md:w-3 shrink-0" }),
                              /* @__PURE__ */ jsx("span", { className: "truncate", children: event.location })
                            ] }),
                            event.description && /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs opacity-80 mt-auto line-clamp-1 md:line-clamp-2 hidden md:block", children: event.description })
                          ] }),
                          /* @__PURE__ */ jsx(
                            Button,
                            {
                              size: "icon",
                              variant: "ghost",
                              className: "h-5 w-5 md:h-6 md:w-6 shrink-0 hover:bg-white/20",
                              onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              },
                              children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-2.5 w-2.5 md:h-3 md:w-3" })
                            }
                          )
                        ] })
                      }
                    )
                  },
                  event.id
                ) : null;
              })
            },
            hour
          )) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs md:text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          "Total ",
          mockEvents.length,
          " agenda pada hari ini"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 md:gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 md:gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 md:w-3 md:h-3 rounded bg-blue-500" }),
            /* @__PURE__ */ jsx("span", { children: "Meeting" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 md:gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 md:w-3 md:h-3 rounded bg-slate-500" }),
            /* @__PURE__ */ jsx("span", { children: "Task" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: isAddEventOpen, onOpenChange: setIsAddEventOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[500px] max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-xl md:text-2xl font-bold", children: "Tambah Agenda" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: format(mockDate, "EEEE, dd MMMM yyyy", { locale: id }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "title", className: "text-sm font-semibold", children: [
            "Nama Acara ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "title",
              placeholder: "Contoh: Meeting Tim, Presentasi Client, Deadline Report",
              value: formData.title,
              onChange: (e) => handleInputChange("title", e.target.value),
              required: true,
              className: "w-full text-base",
              autoFocus: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "start_time", className: "text-sm font-semibold", children: [
              "Jam Mulai ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "start_time",
                type: "time",
                value: formData.start_time,
                onChange: (e) => handleInputChange("start_time", e.target.value),
                required: true,
                className: "w-full text-base"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "end_time", className: "text-sm font-semibold", children: [
              "Jam Selesai ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "end_time",
                type: "time",
                value: formData.end_time,
                onChange: (e) => handleInputChange("end_time", e.target.value),
                required: true,
                className: "w-full text-base"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "type", className: "text-sm font-medium", children: "Tipe" }),
          /* @__PURE__ */ jsx(
            SearchableSelect,
            {
              options: [
                { label: "Meeting", value: "meeting" },
                { label: "Task", value: "task" },
                { label: "Deadline", value: "deadline" },
                { label: "Project", value: "project" }
              ],
              value: formData.type,
              onValueChange: (value) => handleInputChange("type", value),
              placeholder: "Pilih tipe"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "location", className: "text-sm font-medium flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
            "Lokasi ",
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "(opsional)" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "location",
              placeholder: "Ruang Meeting, Zoom, dll",
              value: formData.location,
              onChange: (e) => handleInputChange("location", e.target.value),
              className: "w-full"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "description", className: "text-sm font-medium", children: [
            "Catatan ",
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "(opsional)" })
          ] }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "description",
              placeholder: "Tambahkan catatan atau deskripsi singkat",
              value: formData.description,
              onChange: (e) => handleInputChange("description", e.target.value),
              rows: 3,
              className: "w-full resize-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2 sm:gap-0 pt-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => setIsAddEventOpen(false),
              className: "w-full sm:w-auto",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "submit",
              className: "bg-[var(--sidebar)] hover:bg-[var(--sidebar)]/90 text-white w-full sm:w-auto",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
                "Simpan"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  CalendarShow as default
};
