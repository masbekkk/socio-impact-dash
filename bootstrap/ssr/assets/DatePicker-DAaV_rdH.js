import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { PatternFormat } from "react-number-format";
import { c as cn } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { CalendarIcon } from "lucide-react";
import { parse, isValid, format } from "date-fns";
const DatePicker = ({
  value = "",
  onChange,
  placeholder = "DD/MM/YYYY",
  className,
  error,
  disabled
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const nativeInputRef = useRef(null);
  useEffect(() => {
    if (value) {
      try {
        const date = parse(value, "yyyy-MM-dd", /* @__PURE__ */ new Date());
        if (isValid(date)) {
          setDisplayValue(format(date, "dd/MM/yyyy"));
        } else {
          setDisplayValue("");
        }
      } catch (e) {
        setDisplayValue("");
      }
    } else {
      setDisplayValue("");
    }
  }, [value]);
  const handleValueChange = (values) => {
    const { formattedValue } = values;
    setDisplayValue(formattedValue);
    if (formattedValue.length === 10) {
      try {
        const date = parse(formattedValue, "dd/MM/yyyy", /* @__PURE__ */ new Date());
        if (isValid(date)) {
          onChange(format(date, "yyyy-MM-dd"));
        }
      } catch (e) {
      }
    } else if (formattedValue === "") {
      onChange("");
    }
  };
  const handleNativeChange = (e) => {
    const newValue = e.target.value;
    if (newValue) {
      onChange(newValue);
    }
  };
  const triggerPicker = () => {
    if (disabled) return;
    if (nativeInputRef.current?.showPicker) {
      nativeInputRef.current.showPicker();
    } else {
      nativeInputRef.current?.click();
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        ref: nativeInputRef,
        type: "date",
        value: value || "",
        onChange: handleNativeChange,
        className: "absolute inset-0 opacity-0 -z-10 pointer-events-none",
        tabIndex: -1,
        disabled
      }
    ),
    /* @__PURE__ */ jsx(
      PatternFormat,
      {
        format: "##/##/####",
        mask: "_",
        value: displayValue,
        onValueChange: handleValueChange,
        placeholder,
        disabled,
        customInput: Input,
        className: cn(
          "pl-10 pr-10",
          error && "border-red-500",
          className
        )
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors", children: /* @__PURE__ */ jsx(CalendarIcon, { className: "h-4 w-4" }) }),
    !disabled && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: triggerPicker,
        className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted",
        title: "Pilih Tanggal",
        children: /* @__PURE__ */ jsx(CalendarIcon, { className: "h-4 w-4" })
      }
    )
  ] });
};
export {
  DatePicker as D
};
