import { jsx } from "react/jsx-runtime";
import React__default from "react";
import { NumericFormat } from "react-number-format";
import { c as cn } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
const MoneyInput = React__default.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      NumericFormat,
      {
        ...props,
        getInputRef: ref,
        thousandSeparator: ".",
        decimalSeparator: ",",
        allowNegative: false,
        customInput: Input,
        className: cn("text-left font-mono", className)
      }
    );
  }
);
MoneyInput.displayName = "MoneyInput";
export {
  MoneyInput as M
};
