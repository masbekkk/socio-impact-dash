import { jsxs, jsx } from "react/jsx-runtime";
import { U as UserPasswordController } from "./UserPasswordController-B6Cu06cG.js";
import { Head, Form } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { I as InputError } from "./input-error-CTtaK85m.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { A as AuthLayout } from "./auth-layout-Dq_8XSAP.js";
import "./index-3UqiGNe9.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "./app-logo-icon-DnEiA1J9.js";
import "./index-BUew7iDO.js";
function ResetPassword({ token, email }) {
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Reset password",
      description: "Please enter your new password below",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Reset password" }),
        /* @__PURE__ */ jsx(
          Form,
          {
            ...UserPasswordController.store.form(),
            transform: (data) => ({ ...data, token, email }),
            resetOnSuccess: ["password", "password_confirmation"],
            children: ({ processing, errors }) => /* @__PURE__ */ jsxs("div", { className: "grid gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "email",
                    type: "email",
                    name: "email",
                    autoComplete: "email",
                    value: email,
                    className: "mt-1 block w-full",
                    readOnly: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: errors.email,
                    className: "mt-2"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "password",
                    type: "password",
                    name: "password",
                    autoComplete: "new-password",
                    className: "mt-1 block w-full",
                    autoFocus: true,
                    placeholder: "Password"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.password })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Confirm password" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "password_confirmation",
                    type: "password",
                    name: "password_confirmation",
                    autoComplete: "new-password",
                    className: "mt-1 block w-full",
                    placeholder: "Confirm password"
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: errors.password_confirmation,
                    className: "mt-2"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "submit",
                  className: "mt-4 w-full",
                  disabled: processing,
                  "data-test": "reset-password-button",
                  children: [
                    processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                    "Reset password"
                  ]
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
export {
  ResetPassword as default
};
