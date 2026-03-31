import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { D as DatePicker } from "./DatePicker-DAaV_rdH.js";
import { format, subMonths, startOfMonth, endOfMonth, subDays } from "date-fns";
const DateFilterPresets = ({ startDate, endDate, onSelect }) => {
  const applyPreset = (type) => {
    const today = /* @__PURE__ */ new Date();
    let start = today;
    let end = today;
    switch (type) {
      case "today":
        break;
      case "yesterday":
        start = subDays(today, 1);
        end = subDays(today, 1);
        break;
      case "thisMonth":
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case "last3Months":
        start = subMonths(today, 3);
        end = today;
        break;
    }
    onSelect(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-auto min-w-[340px] bg-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-2 grid grid-cols-2 gap-2 border-b bg-muted/20", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => applyPreset("today"), className: "text-xs h-8", children: "Hari Ini" }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => applyPreset("yesterday"), className: "text-xs h-8", children: "Kemarin" }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => applyPreset("thisMonth"), className: "text-xs h-8", children: "Bulan Ini" }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => applyPreset("last3Months"), className: "text-xs h-8", children: "3 Bulan Terakhir" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-3 border-b space-y-3", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 relative", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-[10px] text-muted-foreground uppercase font-bold", children: "Dari" }),
        /* @__PURE__ */ jsx(
          DatePicker,
          {
            value: startDate,
            onChange: (v) => onSelect(v, endDate),
            className: "h-8 text-xs"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 relative", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-[10px] text-muted-foreground uppercase font-bold", children: "Sampai" }),
        /* @__PURE__ */ jsx(
          DatePicker,
          {
            value: endDate,
            onChange: (v) => onSelect(startDate, v),
            className: "h-8 text-xs"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-2 border-t bg-gray-50 flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground font-medium", children: startDate && endDate ? `${format(new Date(startDate), "dd MMM")} - ${format(new Date(endDate), "dd MMM")}` : "Pilih tanggal" }),
      (startDate || endDate) && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => onSelect("", ""), className: "h-6 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50", children: "Reset" })
    ] })
  ] });
};
export {
  DateFilterPresets as D
};
