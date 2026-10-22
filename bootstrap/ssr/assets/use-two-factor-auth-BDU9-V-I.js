import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState, useMemo, useCallback } from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-react";
import { c as cn } from "./button-hAi0Fg-Q.js";
import { q as qrCode, b as secretKey, r as recoveryCodes } from "./index-BWFTFaHT.js";
const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => /* @__PURE__ */ jsx(
  OTPInput,
  {
    ref,
    containerClassName: cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    ),
    className: cn("disabled:cursor-not-allowed", className),
    ...props
  }
));
InputOTP.displayName = "InputOTP";
const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center", className), ...props }));
InputOTPGroup.displayName = "InputOTPGroup";
const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      ),
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" }) })
      ]
    }
  );
});
InputOTPSlot.displayName = "InputOTPSlot";
const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, role: "separator", ...props, children: /* @__PURE__ */ jsx(Minus, {}) }));
InputOTPSeparator.displayName = "InputOTPSeparator";
const OTP_MAX_LENGTH = 6;
const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return response.json();
};
const useTwoFactorAuth = () => {
  const [qrCodeSvg, setQrCodeSvg] = useState(null);
  const [manualSetupKey, setManualSetupKey] = useState(null);
  const [recoveryCodesList, setRecoveryCodesList] = useState([]);
  const [errors, setErrors] = useState([]);
  const hasSetupData = useMemo(
    () => qrCodeSvg !== null && manualSetupKey !== null,
    [qrCodeSvg, manualSetupKey]
  );
  const fetchQrCode = useCallback(async () => {
    try {
      const { svg } = await fetchJson(qrCode.url());
      setQrCodeSvg(svg);
    } catch {
      setErrors((prev) => [...prev, "Failed to fetch QR code"]);
      setQrCodeSvg(null);
    }
  }, []);
  const fetchSetupKey = useCallback(async () => {
    try {
      const { secretKey: key } = await fetchJson(
        secretKey.url()
      );
      setManualSetupKey(key);
    } catch {
      setErrors((prev) => [...prev, "Failed to fetch a setup key"]);
      setManualSetupKey(null);
    }
  }, []);
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);
  const clearSetupData = useCallback(() => {
    setManualSetupKey(null);
    setQrCodeSvg(null);
    clearErrors();
  }, [clearErrors]);
  const fetchRecoveryCodes = useCallback(async () => {
    try {
      clearErrors();
      const codes = await fetchJson(recoveryCodes.url());
      setRecoveryCodesList(codes);
    } catch {
      setErrors((prev) => [...prev, "Failed to fetch recovery codes"]);
      setRecoveryCodesList([]);
    }
  }, [clearErrors]);
  const fetchSetupData = useCallback(async () => {
    try {
      clearErrors();
      await Promise.all([fetchQrCode(), fetchSetupKey()]);
    } catch {
      setQrCodeSvg(null);
      setManualSetupKey(null);
    }
  }, [clearErrors, fetchQrCode, fetchSetupKey]);
  return {
    qrCodeSvg,
    manualSetupKey,
    recoveryCodesList,
    hasSetupData,
    errors,
    clearErrors,
    clearSetupData,
    fetchQrCode,
    fetchSetupKey,
    fetchSetupData,
    fetchRecoveryCodes
  };
};
export {
  InputOTP as I,
  OTP_MAX_LENGTH as O,
  InputOTPGroup as a,
  InputOTPSlot as b,
  useTwoFactorAuth as u
};
