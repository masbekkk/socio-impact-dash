import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./input-error-CTtaK85m.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { A as AuthLayout } from "./auth-layout-Dq_8XSAP.js";
import { s as store } from "./index-CfRrNjAS.js";
import { Head, Form } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "./app-logo-icon-DnEiA1J9.js";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
function Create() {
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Confirm your password",
      description: "This is a secure area of the application. Please confirm your password before continuing.",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Confirm password" }),
        /* @__PURE__ */ jsx(Form, { ...store.form(), resetOnSuccess: ["password"], children: ({ processing, errors }) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "password",
                type: "password",
                name: "password",
                placeholder: "Password",
                autoComplete: "current-password",
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsx(InputError, { message: errors.password })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs(
            Button,
            {
              className: "w-full",
              disabled: processing,
              "data-test": "confirm-password-button",
              children: [
                processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                "Confirm password"
              ]
            }
          ) })
        ] }) })
      ]
    }
  );
}
export {
  Create as default
};
