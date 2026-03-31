import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BNdhpAvu.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { T as Textarea } from "./textarea-CdP6R3x0.js";
import { D as DatePicker } from "./DatePicker-DAaV_rdH.js";
import { S as SearchableSelect } from "./SearchableSelect-CmVlDmTG.js";
import { A as AppSidebarLayout } from "./app-sidebar-layout-5JGZFayF.js";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, parseISO, addMonths, subMonths, startOfDay, endOfDay, isWithinInterval, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "react-number-format";
import "./scroll-area-BShF3M_R.js";
import "@radix-ui/react-popover";
import "radix-ui";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
import "./use-permission-D0a8sZAO.js";
import "axios";
const EVENT_STYLES = {
  event: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
};
function CalendarIndex({
  events = [],
  projects = []
}) {
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Kalender", href: "/calendar" }
  ];
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { auth } = usePage().props;
  const canDelete = auth.permissions.includes("delete_event");
  const canAdd = auth.permissions.includes("add_event_calendar");
  const [visibleTypes, setVisibleTypes] = useState({
    event: true
  });
  const { data, setData, post, processing, errors, reset, transform } = useForm({
    name: "",
    start_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
    end_date: "",
    project_id: "none",
    notes: ""
  });
  const handleOpenDialog = (date = /* @__PURE__ */ new Date()) => {
    setSelectedDate(date);
    setData("start_date", format(date, "yyyy-MM-dd"));
    setData("end_date", "");
    setIsDialogOpen(true);
  };
  const handleOpenDetail = (event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };
  const submitForm = (e) => {
    e.preventDefault();
    transform((data2) => ({
      ...data2,
      project_id: data2.project_id === "none" ? "" : data2.project_id
    }));
    post(route("calendar.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDialogOpen(false);
        reset();
      }
    });
  };
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(/* @__PURE__ */ new Date());
  const handleDelete = () => {
    if (!selectedEvent) return;
    const id2 = selectedEvent.id.replace("event_", "");
    router.delete(route("calendar.destroy", id2), {
      onSuccess: () => {
        setIsDeleteConfirmOpen(false);
        setIsDetailOpen(false);
        setSelectedEvent(null);
      }
    });
  };
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const getEventsForDay = (day) => {
    return events.filter((event) => visibleTypes[event.type]).filter((event) => {
      const eventStartDate = startOfDay(parseISO(event.date));
      if (event.endDate) {
        const eventEndDate = endOfDay(parseISO(event.endDate));
        return isWithinInterval(day, {
          start: eventStartDate,
          end: eventEndDate
        });
      }
      return isSameDay(eventStartDate, day);
    });
  };
  return /* @__PURE__ */ jsxs(AppSidebarLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Kalender" }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-[calc(100vh-6rem)] flex-col space-y-6 p-6 md:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-between gap-4 sm:flex-row", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center gap-4 sm:w-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center rounded-md border bg-white shadow-sm", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: prevMonth,
                className: "h-9 w-9 rounded-r-none border-r",
                children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                onClick: goToToday,
                className: "h-9 rounded-none px-4 text-sm font-medium hover:bg-gray-50",
                children: "Hari Ini"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: nextMonth,
                className: "h-9 w-9 rounded-l-none border-l",
                children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight text-gray-800 capitalize", children: format(currentDate, "MMMM yyyy", { locale: id }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center gap-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0", children: [
          canAdd && /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: () => handleOpenDialog(),
              className: "shrink-0 gap-2 bg-[var(--sidebar)] text-white shadow-sm transition-all hover:scale-105 hover:bg-[var(--sidebar)] active:scale-95",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
                "Agenda Baru"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Dialog,
            {
              open: isDialogOpen,
              onOpenChange: setIsDialogOpen,
              children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[500px]", children: /* @__PURE__ */ jsxs("form", { onSubmit: submitForm, children: [
                /* @__PURE__ */ jsxs(DialogHeader, { children: [
                  /* @__PURE__ */ jsx(DialogTitle, { children: "Buat Agenda Baru" }),
                  /* @__PURE__ */ jsxs(DialogDescription, { children: [
                    "Tambahkan jadwal kegiatan, meeting, atau milestone untuk tanggal",
                    " ",
                    selectedDate ? format(
                      selectedDate,
                      "dd MMMM yyyy",
                      { locale: id }
                    ) : "ini",
                    "."
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                    /* @__PURE__ */ jsxs(Label, { htmlFor: "name", children: [
                      "Judul Kegiatan",
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "name",
                        placeholder: "Contoh: Meeting Proyek Alpha",
                        value: data.name,
                        onChange: (e) => setData(
                          "name",
                          e.target.value
                        )
                      }
                    ),
                    errors.name && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500", children: errors.name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "project_id", children: "Pilih Project (Opsional)" }),
                    /* @__PURE__ */ jsx(
                      SearchableSelect,
                      {
                        options: [
                          { label: "-- Tidak ada Project (Umum) --", value: "none" },
                          ...projects.map((proj) => ({ label: proj.name, value: proj.id.toString() }))
                        ],
                        value: data.project_id,
                        onValueChange: (val) => setData("project_id", val),
                        placeholder: "Pilih Project"
                      }
                    ),
                    errors.project_id && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500", children: errors.project_id })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                      /* @__PURE__ */ jsxs(Label, { htmlFor: "start_date", children: [
                        "Tanggal Mulai",
                        " ",
                        /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsx(
                        DatePicker,
                        {
                          value: data.start_date,
                          onChange: (v) => setData("start_date", v),
                          error: !!errors.start_date
                        }
                      ),
                      errors.start_date && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500", children: errors.start_date })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                      /* @__PURE__ */ jsx(Label, { htmlFor: "end_date", children: "Tanggal Selesai (Opsional)" }),
                      /* @__PURE__ */ jsx(
                        DatePicker,
                        {
                          value: data.end_date,
                          onChange: (v) => setData("end_date", v),
                          error: !!errors.end_date
                        }
                      ),
                      errors.end_date && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500", children: errors.end_date })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Catatan Tambahan / Deskripsi" }),
                    /* @__PURE__ */ jsx(
                      Textarea,
                      {
                        id: "notes",
                        placeholder: "Tambahkan catatan atau detail kegiatan...",
                        className: "resize-none",
                        rows: 3,
                        value: data.notes,
                        onChange: (e) => setData(
                          "notes",
                          e.target.value
                        )
                      }
                    ),
                    errors.notes && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500", children: errors.notes })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(DialogFooter, { children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: () => setIsDialogOpen(false),
                      children: "Batal"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: processing,
                      className: "bg-[var(--sidebar)] text-white hover:bg-[var(--sidebar)]",
                      children: processing ? "Menyimpan..." : "Simpan Agenda"
                    }
                  )
                ] })
              ] }) })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col overflow-hidden rounded-xl border bg-white shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 border-b bg-gray-50/50", children: weekDays.map((day, idx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "border-r py-2 text-center text-[10px] font-semibold tracking-wider text-gray-500 uppercase last:border-r-0 md:py-3 md:text-sm",
            children: [
              /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: day }),
              /* @__PURE__ */ jsx("span", { className: "md:hidden", children: day.charAt(0) })
            ]
          },
          day
        )) }),
        /* @__PURE__ */ jsx("div", { className: "grid flex-1 auto-rows-fr grid-cols-7 divide-x divide-y md:grid-rows-5", children: calendarDays.map((day, dayIdx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(
            day,
            currentDate
          );
          const isTodayDate = isToday(day);
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: cn(
                "group relative flex min-h-[80px] flex-col gap-0.5 bg-white p-1 transition-all hover:bg-gray-50 md:min-h-[120px] md:gap-1 md:p-2",
                !isCurrentMonth && "bg-gray-50/30 text-gray-400"
              ),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-0.5 flex items-center justify-between md:mb-1", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn(
                        "flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium transition-colors md:h-7 md:w-7 md:text-sm",
                        isTodayDate ? "bg-[var(--sidebar)] text-white shadow-sm" : "text-gray-700",
                        !isCurrentMonth && "text-gray-400"
                      ),
                      children: format(day, "d")
                    }
                  ),
                  dayEvents.length > 0 && /* @__PURE__ */ jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "h-4 px-1 text-[9px] md:h-5 md:px-1.5 md:text-[10px]",
                      children: dayEvents.length
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5 overflow-hidden md:gap-1.5", children: [
                  dayEvents.slice(0, 4).map((event) => {
                    const Inner = () => /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: cn(
                            "h-1 w-1 shrink-0 rounded-full md:h-1.5 md:w-1.5 bg-slate-500"
                          )
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "flex-1 truncate", children: event.title })
                    ] });
                    const className = cn(
                      "flex items-center gap-1 truncate rounded-md border px-1 py-0.5 text-[9px] font-medium shadow-sm transition-all hover:scale-[1.02] hover:shadow-md md:gap-1.5 md:px-2 md:py-1 md:text-[11px]",
                      EVENT_STYLES[event.type]
                    );
                    const clickHandler = () => {
                      if (event.route) {
                        window.location.href = event.route;
                      } else {
                        handleOpenDetail(event);
                      }
                    };
                    return /* @__PURE__ */ jsx(
                      "div",
                      {
                        title: event.description || event.title,
                        className: cn(className, "cursor-pointer"),
                        onClick: clickHandler,
                        children: /* @__PURE__ */ jsx(Inner, {})
                      },
                      event.id
                    );
                  }),
                  dayEvents.length > 4 && /* @__PURE__ */ jsxs("div", { className: "px-1 text-[9px] font-medium text-gray-500 md:px-2 md:text-[10px]", children: [
                    "+",
                    dayEvents.length - 4,
                    " lagi"
                  ] })
                ] }),
                canAdd && /* @__PURE__ */ jsx("div", { className: "absolute right-1 bottom-1 z-10 opacity-0 transition-opacity group-hover:opacity-100", children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "ghost",
                    className: "h-5 w-5 rounded-full border bg-white shadow-sm hover:bg-gray-200 md:h-[22px] md:w-[22px]",
                    onClick: (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenDialog(day);
                    },
                    children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3 text-gray-500" })
                  }
                ) })
              ]
            },
            day.toString()
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: isDetailOpen, onOpenChange: setIsDetailOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-xl font-bold", children: "Detail Agenda" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Informasi detail mengenai agenda yang dipilih." })
      ] }),
      selectedEvent && /* @__PURE__ */ jsxs("div", { className: "grid gap-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Nama Agenda" }),
          /* @__PURE__ */ jsx("div", { className: "text-base font-semibold", children: selectedEvent.title })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Tanggal" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", children: format(
              parseISO(selectedEvent.date),
              "EEEE, d MMMM yyyy",
              { locale: id }
            ) })
          ] }),
          selectedEvent.endDate && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Sampai Tanggal" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", children: format(
              parseISO(selectedEvent.endDate),
              "EEEE, d MMMM yyyy",
              { locale: id }
            ) })
          ] })
        ] }),
        selectedEvent.project_name && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Proyek Terkait" }),
          /* @__PURE__ */ jsx(
            Badge,
            {
              variant: "outline",
              className: "w-fit bg-emerald-50 text-emerald-700 border-emerald-200",
              children: selectedEvent.project_name
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Catatan" }),
          /* @__PURE__ */ jsx("div", { className: "rounded-md border bg-gray-50 p-3 text-sm text-gray-700 whitespace-pre-wrap", children: selectedEvent.description || "Tidak ada catatan." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "flex justify-between items-center sm:justify-between", children: [
        canDelete && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "destructive",
            size: "sm",
            onClick: () => setIsDeleteConfirmOpen(true),
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
              "Hapus"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setIsDetailOpen(false),
            children: "Tutup"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      Dialog,
      {
        open: isDeleteConfirmOpen,
        onOpenChange: setIsDeleteConfirmOpen,
        children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[400px]", children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsx(DialogTitle, { children: "Hapus Agenda" }),
            /* @__PURE__ */ jsxs(DialogDescription, { children: [
              'Apakah Anda yakin ingin menghapus agenda "',
              selectedEvent?.title,
              '"? Tindakan ini tidak dapat dibatalkan.'
            ] })
          ] }),
          /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2 sm:gap-0 mt-4", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setIsDeleteConfirmOpen(false),
                className: "w-full sm:w-auto",
                children: "Batal"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "destructive",
                onClick: handleDelete,
                className: "w-full sm:w-auto",
                children: "Hapus Sekarang"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  CalendarIndex as default
};
