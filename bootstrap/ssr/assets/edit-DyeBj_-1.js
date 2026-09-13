import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { U as UserPasswordController } from "./UserPasswordController-B6Cu06cG.js";
import { I as InputError } from "./input-error-CTtaK85m.js";
import { A as AppLayout } from "./app-layout-DWMXsgsr.js";
import { S as SettingsLayout, H as HeadingSmall } from "./layout-9wUouN7U.js";
import { Transition } from "@headlessui/react";
import { Head, Form } from "@inertiajs/react";
import { useRef } from "react";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { e as edit } from "./index-D2krJlAZ.js";
import "./index-3UqiGNe9.js";
import "./app-sidebar-layout-BRoV_jj3.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./use-permission-D0a8sZAO.js";
import "axios";
import "date-fns";
import "date-fns/locale";
import "./separator-CjIBof9L.js";
import "@radix-ui/react-separator";
import "./index-BWFTFaHT.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "./index-CfRrNjAS.js";
const breadcrumbs = [
  {
    title: "Password settings",
    href: edit().url
  }
];
function Password() {
  const passwordInput = useRef(null);
  const currentPasswordInput = useRef(null);
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Password settings" }),
    /* @__PURE__ */ jsx(SettingsLayout, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        HeadingSmall,
        {
          title: "Update password",
          description: "Ensure your account is using a long, random password to stay secure"
        }
      ),
      /* @__PURE__ */ jsx(
        Form,
        {
          ...UserPasswordController.update.form(),
          options: {
            preserveScroll: true
          },
          resetOnError: [
            "password",
            "password_confirmation",
            "current_password"
          ],
          resetOnSuccess: true,
          onError: (errors) => {
            if (errors.password) {
              passwordInput.current?.focus();
            }
            if (errors.current_password) {
              currentPasswordInput.current?.focus();
            }
          },
          className: "space-y-6",
          children: ({ errors, processing, recentlySuccessful }) => /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "current_password", children: "Current password" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "current_password",
                  ref: currentPasswordInput,
                  name: "current_password",
                  type: "password",
                  className: "mt-1 block w-full",
                  autoComplete: "current-password",
                  placeholder: "Current password"
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.current_password
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "New password" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "password",
                  ref: passwordInput,
                  name: "password",
                  type: "password",
                  className: "mt-1 block w-full",
                  autoComplete: "new-password",
                  placeholder: "New password"
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
                  name: "password_confirmation",
                  type: "password",
                  className: "mt-1 block w-full",
                  autoComplete: "new-password",
                  placeholder: "Confirm password"
                }
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors.password_confirmation
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  disabled: processing,
                  "data-test": "update-password-button",
                  children: "Save password"
                }
              ),
              /* @__PURE__ */ jsx(
                Transition,
                {
                  show: recentlySuccessful,
                  enter: "transition ease-in-out",
                  enterFrom: "opacity-0",
                  leave: "transition ease-in-out",
                  leaveTo: "opacity-0",
                  children: /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-600", children: "Saved" })
                }
              )
            ] })
          ] })
        }
      )
    ] }) })
  ] });
}
export {
  Password as default
};
