import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { q as queryParams } from "./index-3UqiGNe9.js";
import { l as logout } from "./index-BUew7iDO.js";
import { Head, Form } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { T as TextLink } from "./text-link-DcmxdwZx.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { A as AuthLayout } from "./auth-layout-Dq_8XSAP.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "./app-logo-icon-DnEiA1J9.js";
const create = (options) => ({
  url: create.url(options),
  method: "get"
});
create.definition = {
  methods: ["get", "head"],
  url: "/verify-email"
};
create.url = (options) => {
  return create.definition.url + queryParams(options);
};
create.get = (options) => ({
  url: create.url(options),
  method: "get"
});
create.head = (options) => ({
  url: create.url(options),
  method: "head"
});
const createForm = (options) => ({
  action: create.url(options),
  method: "get"
});
createForm.get = (options) => ({
  action: create.url(options),
  method: "get"
});
createForm.head = (options) => ({
  action: create.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
create.form = createForm;
const store = (options) => ({
  url: store.url(options),
  method: "post"
});
store.definition = {
  methods: ["post"],
  url: "/email/verification-notification"
};
store.url = (options) => {
  return store.definition.url + queryParams(options);
};
store.post = (options) => ({
  url: store.url(options),
  method: "post"
});
const storeForm = (options) => ({
  action: store.url(options),
  method: "post"
});
storeForm.post = (options) => ({
  action: store.url(options),
  method: "post"
});
store.form = storeForm;
const UserEmailVerificationNotificationController = { store };
function VerifyEmail({ status }) {
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Verify email",
      description: "Please verify your email address by clicking on the link we just emailed to you.",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Email verification" }),
        status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mb-4 text-center text-sm font-medium text-green-600", children: "A new verification link has been sent to the email address you provided during registration." }),
        /* @__PURE__ */ jsx(
          Form,
          {
            ...UserEmailVerificationNotificationController.store.form(),
            className: "space-y-6 text-center",
            children: ({ processing }) => /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(Button, { disabled: processing, variant: "secondary", children: [
                processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                "Resend verification email"
              ] }),
              /* @__PURE__ */ jsx(
                TextLink,
                {
                  href: logout(),
                  className: "mx-auto block text-sm",
                  children: "Log out"
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
  VerifyEmail as default
};
