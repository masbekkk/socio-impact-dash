import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { S as SettingsLayout, H as HeadingSmall } from "./layout-9wUouN7U.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-DAjHeOuX.js";
import { c as regenerateRecoveryCodes, d as confirm, e as disable, f as enable, s as show } from "./index-BWFTFaHT.js";
import { Form, Head } from "@inertiajs/react";
import { AlertCircleIcon, LockKeyhole, EyeOff, Eye, RefreshCw, ScanLine, Loader2, Check, Copy, ShieldBan, ShieldCheck } from "lucide-react";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-BkuvEnvZ.js";
import { I as InputError } from "./input-error-CTtaK85m.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-BNdhpAvu.js";
import { I as InputOTP, O as OTP_MAX_LENGTH, a as InputOTPGroup, b as InputOTPSlot, u as useTwoFactorAuth } from "./use-two-factor-auth-BDU9-V-I.js";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { B as Badge } from "./badge-Bu5jvMvW.js";
import { A as AppLayout } from "./app-layout-DWMXsgsr.js";
import "./separator-CjIBof9L.js";
import "@radix-ui/react-separator";
import "./index-D2krJlAZ.js";
import "./index-3UqiGNe9.js";
import "./index-CfRrNjAS.js";
import "./app-sidebar-layout-BRoV_jj3.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-BUew7iDO.js";
import "./use-permission-D0a8sZAO.js";
import "axios";
import "date-fns";
import "date-fns/locale";
import "clsx";
import "tailwind-merge";
function AlertError({
  errors,
  title
}) {
  return /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
    /* @__PURE__ */ jsx(AlertCircleIcon, {}),
    /* @__PURE__ */ jsx(AlertTitle, { children: title || "Something went wrong." }),
    /* @__PURE__ */ jsx(AlertDescription, { children: /* @__PURE__ */ jsx("ul", { className: "list-inside list-disc text-sm", children: Array.from(new Set(errors)).map((error, index) => /* @__PURE__ */ jsx("li", { children: error }, index)) }) })
  ] });
}
function TwoFactorRecoveryCodes({
  recoveryCodesList,
  fetchRecoveryCodes,
  errors
}) {
  const [codesAreVisible, setCodesAreVisible] = useState(false);
  const codesSectionRef = useRef(null);
  const canRegenerateCodes = recoveryCodesList.length > 0 && codesAreVisible;
  const toggleCodesVisibility = useCallback(async () => {
    if (!codesAreVisible && !recoveryCodesList.length) {
      await fetchRecoveryCodes();
    }
    setCodesAreVisible(!codesAreVisible);
    if (!codesAreVisible) {
      setTimeout(() => {
        codesSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      });
    }
  }, [codesAreVisible, recoveryCodesList.length, fetchRecoveryCodes]);
  useEffect(() => {
    if (!recoveryCodesList.length) {
      fetchRecoveryCodes();
    }
  }, [recoveryCodesList.length, fetchRecoveryCodes]);
  const RecoveryCodeIconComponent = codesAreVisible ? EyeOff : Eye;
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxs(CardTitle, { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(LockKeyhole, { className: "size-4", "aria-hidden": "true" }),
        "2FA Recovery Codes"
      ] }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Recovery codes let you regain access if you lose your 2FA device. Store them in a secure password manager." })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 select-none sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: toggleCodesVisibility,
            className: "w-fit",
            "aria-expanded": codesAreVisible,
            "aria-controls": "recovery-codes-section",
            children: [
              /* @__PURE__ */ jsx(
                RecoveryCodeIconComponent,
                {
                  className: "size-4",
                  "aria-hidden": "true"
                }
              ),
              codesAreVisible ? "Hide" : "View",
              " Recovery Codes"
            ]
          }
        ),
        canRegenerateCodes && /* @__PURE__ */ jsx(
          Form,
          {
            ...regenerateRecoveryCodes.form(),
            options: { preserveScroll: true },
            onSuccess: fetchRecoveryCodes,
            children: ({ processing }) => /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "secondary",
                type: "submit",
                disabled: processing,
                "aria-describedby": "regenerate-warning",
                children: [
                  /* @__PURE__ */ jsx(RefreshCw, {}),
                  " Regenerate Codes"
                ]
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          id: "recovery-codes-section",
          className: `relative overflow-hidden transition-all duration-300 ${codesAreVisible ? "h-auto opacity-100" : "h-0 opacity-0"}`,
          "aria-hidden": !codesAreVisible,
          children: /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-3", children: errors?.length ? /* @__PURE__ */ jsx(AlertError, { errors }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                ref: codesSectionRef,
                className: "grid gap-1 rounded-lg bg-muted p-4 font-mono text-sm",
                role: "list",
                "aria-label": "Recovery codes",
                children: recoveryCodesList.length ? recoveryCodesList.map((code, index) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    role: "listitem",
                    className: "select-text",
                    children: code
                  },
                  index
                )) : /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "space-y-2",
                    "aria-label": "Loading recovery codes",
                    children: Array.from(
                      { length: 8 },
                      (_, index) => /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "h-4 animate-pulse rounded bg-muted-foreground/20",
                          "aria-hidden": "true"
                        },
                        index
                      )
                    )
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground select-none", children: /* @__PURE__ */ jsxs("p", { id: "regenerate-warning", children: [
              "Each recovery code can be used once to access your account and will be removed after use. If you need more, click",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Regenerate Codes" }),
              " ",
              "above."
            ] }) })
          ] }) })
        }
      )
    ] })
  ] });
}
function useClipboard() {
  const [copiedText, setCopiedText] = useState(null);
  const copy = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  }, []);
  return [copiedText, copy];
}
function GridScanIcon() {
  return /* @__PURE__ */ jsx("div", { className: "mb-3 rounded-full border border-border bg-card p-0.5 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-full border border-border bg-muted p-2.5", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid grid-cols-5 opacity-50", children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "border-r border-border last:border-r-0"
      },
      `col-${i + 1}`
    )) }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid grid-rows-5 opacity-50", children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "border-b border-border last:border-b-0"
      },
      `row-${i + 1}`
    )) }),
    /* @__PURE__ */ jsx(ScanLine, { className: "relative z-20 size-6 text-foreground" })
  ] }) });
}
function TwoFactorSetupStep({
  qrCodeSvg,
  manualSetupKey,
  buttonText,
  onNextStep,
  errors
}) {
  const [copiedText, copy] = useClipboard();
  const IconComponent = copiedText === manualSetupKey ? Check : Copy;
  return /* @__PURE__ */ jsx(Fragment, { children: errors?.length ? /* @__PURE__ */ jsx(AlertError, { errors }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto flex max-w-md overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "mx-auto aspect-square w-64 rounded-lg border border-border", children: /* @__PURE__ */ jsx("div", { className: "z-10 flex h-full w-full items-center justify-center p-5", children: qrCodeSvg ? /* @__PURE__ */ jsx(
      "div",
      {
        dangerouslySetInnerHTML: {
          __html: qrCodeSvg
        }
      }
    ) : /* @__PURE__ */ jsx(Loader2, { className: "flex size-4 animate-spin" }) }) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex w-full space-x-5", children: /* @__PURE__ */ jsx(Button, { className: "w-full", onClick: onNextStep, children: buttonText }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex w-full items-center justify-center", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 top-1/2 h-px w-full bg-border" }),
      /* @__PURE__ */ jsx("span", { className: "relative bg-card px-2 py-1", children: "or, enter the code manually" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex w-full space-x-2", children: /* @__PURE__ */ jsx("div", { className: "flex w-full items-stretch overflow-hidden rounded-xl border border-border", children: !manualSetupKey ? /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-muted p-3", children: /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin" }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          readOnly: true,
          value: manualSetupKey,
          className: "h-full w-full bg-background p-3 text-foreground outline-none"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => copy(manualSetupKey),
          className: "border-l border-border px-3 hover:bg-muted",
          children: /* @__PURE__ */ jsx(IconComponent, { className: "w-4" })
        }
      )
    ] }) }) })
  ] }) });
}
function TwoFactorVerificationStep({
  onClose,
  onBack
}) {
  const [code, setCode] = useState("");
  const pinInputContainerRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      pinInputContainerRef.current?.querySelector("input")?.focus();
    }, 0);
  }, []);
  return /* @__PURE__ */ jsx(
    Form,
    {
      ...confirm.form(),
      onSuccess: () => onClose(),
      resetOnError: true,
      resetOnSuccess: true,
      children: ({
        processing,
        errors
      }) => /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: pinInputContainerRef,
          className: "relative w-full space-y-3",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-center space-y-3 py-2", children: [
              /* @__PURE__ */ jsx(
                InputOTP,
                {
                  id: "otp",
                  name: "code",
                  maxLength: OTP_MAX_LENGTH,
                  onChange: setCode,
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
              ),
              /* @__PURE__ */ jsx(
                InputError,
                {
                  message: errors?.confirmTwoFactorAuthentication?.code
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex w-full space-x-5", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  className: "flex-1",
                  onClick: onBack,
                  disabled: processing,
                  children: "Back"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "submit",
                  className: "flex-1",
                  disabled: processing || code.length < OTP_MAX_LENGTH,
                  children: "Confirm"
                }
              )
            ] })
          ]
        }
      ) })
    }
  );
}
function TwoFactorSetupModal({
  isOpen,
  onClose,
  twoFactorEnabled,
  qrCodeSvg,
  manualSetupKey,
  clearSetupData,
  fetchSetupData,
  errors
}) {
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const modalConfig = useMemo(() => {
    if (twoFactorEnabled) {
      return {
        title: "Two-Factor Authentication Enabled",
        description: "Two-factor authentication is now enabled. Scan the QR code or enter the setup key in your authenticator app.",
        buttonText: "Close"
      };
    }
    if (showVerificationStep) {
      return {
        title: "Verify Authentication Code",
        description: "Enter the 6-digit code from your authenticator app",
        buttonText: "Continue"
      };
    }
    return {
      title: "Enable Two-Factor Authentication",
      description: "To finish enabling two-factor authentication, scan the QR code or enter the setup key in your authenticator app",
      buttonText: "Continue"
    };
  }, [twoFactorEnabled, showVerificationStep]);
  const handleModalNextStep = useCallback(() => {
    setShowVerificationStep(true);
  }, []);
  const resetModalState = useCallback(() => {
    setShowVerificationStep(false);
    if (twoFactorEnabled) {
      clearSetupData();
    }
  }, [twoFactorEnabled, clearSetupData]);
  useEffect(() => {
    if (!isOpen) {
      resetModalState();
      return;
    }
    if (!qrCodeSvg) {
      fetchSetupData();
    }
  }, [isOpen, qrCodeSvg, fetchSetupData, resetModalState]);
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: "flex items-center justify-center", children: [
      /* @__PURE__ */ jsx(GridScanIcon, {}),
      /* @__PURE__ */ jsx(DialogTitle, { children: modalConfig.title }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-center", children: modalConfig.description })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center space-y-5", children: showVerificationStep ? /* @__PURE__ */ jsx(
      TwoFactorVerificationStep,
      {
        onClose,
        onBack: () => setShowVerificationStep(false)
      }
    ) : /* @__PURE__ */ jsx(
      TwoFactorSetupStep,
      {
        qrCodeSvg,
        manualSetupKey,
        buttonText: modalConfig.buttonText,
        onNextStep: handleModalNextStep,
        errors
      }
    ) })
  ] }) });
}
const breadcrumbs = [
  {
    title: "Two-Factor Authentication",
    href: show.url()
  }
];
function TwoFactor({
  twoFactorEnabled = false
}) {
  const {
    qrCodeSvg,
    hasSetupData,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    recoveryCodesList,
    fetchRecoveryCodes,
    errors
  } = useTwoFactorAuth();
  const [showSetupModal, setShowSetupModal] = useState(false);
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Two-Factor Authentication" }),
    /* @__PURE__ */ jsx(SettingsLayout, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        HeadingSmall,
        {
          title: "Two-Factor Authentication",
          description: "Manage your two-factor authentication settings"
        }
      ),
      twoFactorEnabled ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-start space-y-4", children: [
        /* @__PURE__ */ jsx(Badge, { variant: "default", children: "Enabled" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "With two-factor authentication enabled, you will be prompted for a secure, random pin during login, which you can retrieve from the TOTP-supported application on your phone." }),
        /* @__PURE__ */ jsx(
          TwoFactorRecoveryCodes,
          {
            recoveryCodesList,
            fetchRecoveryCodes,
            errors
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "relative inline", children: /* @__PURE__ */ jsx(Form, { ...disable.form(), children: ({ processing }) => /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "destructive",
            type: "submit",
            disabled: processing,
            children: [
              /* @__PURE__ */ jsx(ShieldBan, {}),
              " Disable 2FA"
            ]
          }
        ) }) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-start space-y-4", children: [
        /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "Disabled" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "When you enable two-factor authentication, you will be prompted for a secure pin during login. This pin can be retrieved from a TOTP-supported application on your phone." }),
        /* @__PURE__ */ jsx("div", { children: hasSetupData ? /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => setShowSetupModal(true),
            children: [
              /* @__PURE__ */ jsx(ShieldCheck, {}),
              "Continue Setup"
            ]
          }
        ) : /* @__PURE__ */ jsx(
          Form,
          {
            ...enable.form(),
            onSuccess: () => setShowSetupModal(true),
            children: ({ processing }) => /* @__PURE__ */ jsxs(
              Button,
              {
                type: "submit",
                disabled: processing,
                children: [
                  /* @__PURE__ */ jsx(ShieldCheck, {}),
                  "Enable 2FA"
                ]
              }
            )
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(
        TwoFactorSetupModal,
        {
          isOpen: showSetupModal,
          onClose: () => setShowSetupModal(false),
          twoFactorEnabled,
          qrCodeSvg,
          manualSetupKey,
          clearSetupData,
          fetchSetupData,
          errors
        }
      )
    ] }) })
  ] });
}
export {
  TwoFactor as default
};
