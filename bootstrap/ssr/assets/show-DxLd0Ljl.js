import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { I as InputError } from "./input-error-CTtaK85m.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { I as Input } from "./input-BYMPkoD-.js";
import { I as InputOTP, O as OTP_MAX_LENGTH, a as InputOTPGroup, b as InputOTPSlot } from "./use-two-factor-auth-BDU9-V-I.js";
import { A as AuthLayout } from "./auth-layout-Dq_8XSAP.js";
import { a as store } from "./index-BWFTFaHT.js";
import { Head, Form } from "@inertiajs/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, useMemo } from "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "./app-logo-icon-DnEiA1J9.js";
import "./index-BUew7iDO.js";
import "./index-3UqiGNe9.js";
function Show() {
  const [showRecoveryInput, setShowRecoveryInput] = useState(false);
  const [code, setCode] = useState("");
  const authConfigContent = useMemo(() => {
    if (showRecoveryInput) {
      return {
        title: "Recovery Code",
        description: "Please confirm access to your account by entering one of your emergency recovery codes.",
        toggleText: "login using an authentication code"
      };
    }
    return {
      title: "Authentication Code",
      description: "Enter the authentication code provided by your authenticator application.",
      toggleText: "login using a recovery code"
    };
  }, [showRecoveryInput]);
  const toggleRecoveryMode = (clearErrors) => {
    setShowRecoveryInput(!showRecoveryInput);
    clearErrors();
    setCode("");
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: authConfigContent.title,
      description: authConfigContent.description,
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Two-Factor Authentication" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx(
          Form,
          {
            ...store.form(),
            className: "space-y-4",
            resetOnError: true,
            resetOnSuccess: !showRecoveryInput,
            children: ({ errors, processing, clearErrors }) => /* @__PURE__ */ jsxs(Fragment, { children: [
              showRecoveryInput ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    name: "recovery_code",
                    type: "text",
                    placeholder: "Enter recovery code",
                    autoFocus: showRecoveryInput,
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: errors.recovery_code
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center space-y-3 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "flex w-full items-center justify-center", children: /* @__PURE__ */ jsx(
                  InputOTP,
                  {
                    name: "code",
                    maxLength: OTP_MAX_LENGTH,
                    value: code,
                    onChange: (value) => setCode(value),
                    disabled: processing,
                    pattern: REGEXP_ONLY_DIGITS,
                    children: /* @__PURE__ */ jsx(InputOTPGroup, { children: Array.from(
                      { length: OTP_MAX_LENGTH },
                      (_, index) => /* @__PURE__ */ jsx(
                        InputOTPSlot,
                        {
                          index
                        },
                        index
                      )
                    ) })
                  }
                ) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.code })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "submit",
                  className: "w-full",
                  disabled: processing,
                  children: "Continue"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "text-center text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx("span", { children: "or you can " }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "cursor-pointer text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500",
                    onClick: () => toggleRecoveryMode(clearErrors),
                    children: authConfigContent.toggleText
                  }
                )
              ] })
            ] })
          }
        ) })
      ]
    }
  );
}
export {
  Show as default
};
