import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { U as UserController } from "./UserController-BLxxbhHo.js";
import { I as InputError } from "./input-error-CTtaK85m.js";
import { T as TextLink } from "./text-link-DcmxdwZx.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { L as Label } from "./label-7wn1ZQI4.js";
import { a as login } from "./index-BUew7iDO.js";
import { Head, Form } from "@inertiajs/react";
import { EyeOff, Eye, LoaderCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { A as AppLogoIcon } from "./app-logo-icon-DnEiA1J9.js";
import "./index-3UqiGNe9.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen w-full lg:grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsx(Head, { title: "Registrasi" }),
    /* @__PURE__ */ jsxs("div", { className: "relative hidden flex-col justify-between p-10 text-white lg:flex overflow-hidden bg-black", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/assets/loginimg.webp",
            alt: "SocialImpact.ID Background",
            className: "h-full w-full object-cover opacity-90"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#0a3825]/90 to-[#06251b]/95 mix-blend-multiply" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-2 text-lg font-medium opacity-90", children: [
        /* @__PURE__ */ jsx(AppLogoIcon, { className: "h-10 w-10 text-white" }),
        /* @__PURE__ */ jsx("span", { className: "text-xl font-bold tracking-tight", children: "SocialImpact.ID" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-lg space-y-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-5xl font-bold leading-tight tracking-tight", children: "Kelola Proyek Anda Dengan Mudah" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-white/80", children: "Platform manajemen proyek terintegrasi untuk memantau, mengelola, dan melaporkan keberhasilan proyek sosial Anda." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative z-10 flex items-center justify-between text-xs text-white/50", children: /* @__PURE__ */ jsx("p", { children: "© 2026 SocialImpact.ID" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col items-center justify-center p-6 bg-background lg:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center gap-2 text-lg font-medium lg:hidden", children: [
        /* @__PURE__ */ jsx(AppLogoIcon, { className: "h-10 w-10 text-[#0a3825]" }),
        /* @__PURE__ */ jsx("span", { className: "text-xl font-bold tracking-tight text-[#0a3825]", children: "SocialImpact.ID" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-[400px] space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center lg:text-left", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold", children: "Registrasi" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Buat akun baru untuk mulai mengelola." })
        ] }),
        /* @__PURE__ */ jsx(
          Form,
          {
            ...UserController.store.form(),
            resetOnSuccess: ["password", "password_confirmation"],
            disableWhileProcessing: true,
            className: "space-y-4",
            children: ({ processing, errors }) => /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nama Lengkap" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "name",
                    type: "text",
                    required: true,
                    autoFocus: true,
                    tabIndex: 1,
                    autoComplete: "name",
                    name: "name",
                    placeholder: "Nama Lengkap",
                    className: "h-12"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "email",
                    type: "email",
                    required: true,
                    tabIndex: 2,
                    autoComplete: "email",
                    name: "email",
                    placeholder: "example@gmail.com",
                    className: "h-12"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.email })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "password",
                      type: showPassword ? "text" : "password",
                      required: true,
                      tabIndex: 3,
                      autoComplete: "new-password",
                      name: "password",
                      placeholder: "••••••••",
                      className: "h-12 pr-10"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword(!showPassword),
                      className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                      tabIndex: -1,
                      children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(InputError, { message: errors.password })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Konfirmasi Password" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "password_confirmation",
                      type: showConfirmPassword ? "text" : "password",
                      required: true,
                      tabIndex: 4,
                      autoComplete: "new-password",
                      name: "password_confirmation",
                      placeholder: "••••••••",
                      className: "h-12 pr-10"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowConfirmPassword(!showConfirmPassword),
                      className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                      tabIndex: -1,
                      children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(InputError, { message: errors.password_confirmation })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "submit",
                  className: "mt-2 h-12 w-full bg-[#0a7a3b] hover:bg-[#0a6632] text-white text-base font-medium transition-all",
                  tabIndex: 5,
                  "data-test": "register-user-button",
                  children: [
                    processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                    "Daftar Sekarang",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "text-center text-sm text-muted-foreground", children: [
          "Sudah punya akun?",
          " ",
          /* @__PURE__ */ jsx(TextLink, { href: login(), tabIndex: 6, className: "font-bold text-green-700 hover:text-green-800", children: "Masuk" })
        ] })
      ] })
    ] })
  ] });
}
export {
  Register as default
};
