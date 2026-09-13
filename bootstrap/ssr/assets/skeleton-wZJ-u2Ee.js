import { jsx } from "react/jsx-runtime";
import { c as cn } from "./button-hAi0Fg-Q.js";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-primary/10 animate-pulse rounded-md", className),
      ...props
    }
  );
}
export {
  Skeleton as S
};
