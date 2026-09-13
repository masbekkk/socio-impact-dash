import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent, S as ScrollArea } from "./scroll-area-BShF3M_R.js";
import { ChevronDown, Search, Check } from "lucide-react";
import * as React from "react";
function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Cari...",
  emptyText = "Tidak ditemukan.",
  className,
  disabled = false
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (option) => option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);
  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        role: "combobox",
        "aria-expanded": open,
        className: cn(
          "w-full justify-between font-normal h-10 px-3",
          !value && "text-muted-foreground",
          className
        ),
        disabled,
        children: [
          /* @__PURE__ */ jsx("span", { className: "truncate", children: selectedOption ? selectedOption.label : placeholder }),
          /* @__PURE__ */ jsx(ChevronDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0", align: "start", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b px-3 py-2", children: [
        /* @__PURE__ */ jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: searchPlaceholder,
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "h-8 border-none focus-visible:ring-0 px-0 text-sm bg-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(ScrollArea, { className: "max-h-[300px] overflow-y-auto p-1", children: filteredOptions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-6 text-center text-sm text-muted-foreground italic", children: emptyText }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: filteredOptions.map((option) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            onValueChange(option.value);
            setOpen(false);
            setSearchQuery("");
          },
          className: cn(
            "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
            value === option.value && "bg-accent/50 text-accent-foreground font-medium"
          ),
          children: [
            /* @__PURE__ */ jsx("span", { className: "flex-1 truncate text-left text-wrap", children: option.label }),
            value === option.value && /* @__PURE__ */ jsx(Check, { className: "ml-2 h-4 w-4 shrink-0" })
          ]
        },
        option.value
      )) }) })
    ] })
  ] });
}
export {
  SearchableSelect as S
};
