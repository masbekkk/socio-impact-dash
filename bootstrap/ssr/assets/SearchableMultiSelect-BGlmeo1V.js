import { jsxs, jsx } from "react/jsx-runtime";
import { B as Button, c as cn } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent, S as ScrollArea } from "./scroll-area-BShF3M_R.js";
import { X, ChevronDown, Search, Check } from "lucide-react";
import * as React from "react";
import { B as Badge } from "./badge-Bu5jvMvW.js";
function SearchableMultiSelect({
  options,
  value = [],
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
  const handleSelect = (optionValue) => {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue));
    } else {
      onValueChange([...value, optionValue]);
    }
  };
  const handleRemove = (e, optionValue) => {
    e.stopPropagation();
    onValueChange(value.filter((v) => v !== optionValue));
  };
  const handleClearAll = (e) => {
    e.stopPropagation();
    onValueChange([]);
  };
  const selectedLabels = value.map((v) => options.find((o) => o.value === v)?.label || v);
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        role: "combobox",
        "aria-expanded": open,
        className: cn(
          "w-full justify-between font-normal h-auto min-h-10 px-3 py-2",
          value.length === 0 && "text-muted-foreground",
          className
        ),
        disabled,
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 flex-1 overflow-hidden pr-2", children: value.length === 0 ? /* @__PURE__ */ jsx("span", { className: "truncate py-0.5", children: placeholder }) : selectedLabels.map((label, index) => /* @__PURE__ */ jsxs(
            Badge,
            {
              variant: "secondary",
              className: "mr-1 mb-1 font-normal",
              children: [
                /* @__PURE__ */ jsx("span", { className: "truncate max-w-[100px] sm:max-w-xs", children: label }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    role: "button",
                    onClick: (e) => handleRemove(e, value[index]),
                    className: "ml-1 rounded-full outline-hidden ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3 text-muted-foreground hover:text-foreground" })
                  }
                )
              ]
            },
            index
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            value.length > 0 && /* @__PURE__ */ jsx(
              "div",
              {
                role: "button",
                onClick: handleClearAll,
                className: "mr-1 hover:text-foreground text-muted-foreground",
                children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 opacity-50" })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0 min-w-[200px]", align: "start", children: [
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
          onClick: () => handleSelect(option.value),
          className: cn(
            "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
            value.includes(option.value) && "bg-accent/50 text-accent-foreground font-medium"
          ),
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-4 w-4 items-center justify-center rounded-sm border border-primary mr-2 shrink-0", children: /* @__PURE__ */ jsx(
              Check,
              {
                className: cn(
                  "h-3 w-3 text-primary",
                  value.includes(option.value) ? "opacity-100" : "opacity-0"
                )
              }
            ) }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 truncate text-left text-wrap", children: option.label })
          ]
        },
        option.value
      )) }) })
    ] })
  ] });
}
export {
  SearchableMultiSelect as S
};
