import { jsxs, jsx } from "react/jsx-runtime";
import React__default, { useState, useRef } from "react";
import { c as cn, B as Button } from "./button-hAi0Fg-Q.js";
import { UploadCloud, FileText, X } from "lucide-react";
function FileUploadDropzone({
  className,
  onFilesChange,
  accept,
  multiple = true,
  maxSize,
  labelText = "Klik untuk upload atau drag & drop",
  helperText = "PDF, DOCX, JPG, EXCEL (Max 10MB)"
}) {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const onFilesChangeRef = useRef(onFilesChange);
  onFilesChangeRef.current = onFilesChange;
  const isFirstRender = useRef(true);
  React__default.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (onFilesChangeRef.current) onFilesChangeRef.current(files);
  }, [files]);
  function validateFileAccept(file, acceptString) {
    if (!acceptString) return true;
    const rules = acceptString.split(",").map((r) => r.trim().toLowerCase());
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    return rules.some((rule) => {
      if (rule.startsWith(".")) {
        return fileName.endsWith(rule);
      } else if (rule.endsWith("/*")) {
        const prefix = rule.slice(0, -2);
        return fileType.startsWith(prefix);
      } else {
        return fileType === rule;
      }
    });
  }
  function onChange(e) {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    addFiles(newFiles);
    if (inputRef.current) inputRef.current.value = "";
  }
  function addFiles(newFiles) {
    let filteredFiles = newFiles;
    if (accept) {
      const checkedFiles = newFiles.filter((file) => validateFileAccept(file, accept));
      if (checkedFiles.length !== newFiles.length) {
        alert("Format file tidak didukung. File yang diperbolehkan: " + accept);
      }
      filteredFiles = checkedFiles;
    }
    if (maxSize) {
      const checkedFiles = filteredFiles.filter((file) => file.size <= maxSize);
      if (checkedFiles.length !== filteredFiles.length) {
        alert(`Ukuran file melebihi batas maksimal ${formatBytes(maxSize)}.`);
      }
      filteredFiles = checkedFiles;
    }
    if (!multiple) {
      setFiles(filteredFiles.slice(0, 1));
    } else {
      setFiles((prev) => [...prev, ...filteredFiles]);
    }
  }
  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  const [isDragging, setIsDragging] = useState(false);
  function onDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }
  function onDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }
  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: cn("relative flex flex-col", className), children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors flex-1 w-full",
          isDragging ? "border-primary bg-primary/5" : "hover:bg-muted/50 border-muted-foreground/25"
        ),
        onClick: () => inputRef.current?.click(),
        onDragOver,
        onDragLeave,
        onDrop,
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              multiple,
              accept,
              className: "hidden",
              ref: inputRef,
              onChange
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "bg-primary/10 p-2 rounded-full mb-2", children: /* @__PURE__ */ jsx(UploadCloud, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: labelText }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: helperText })
        ]
      }
    ),
    files.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: files.map((f, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/40 rounded border text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-blue-500 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "truncate", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: f.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: formatBytes(f.size) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", onClick: () => removeFile(idx), children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
    ] }, idx)) })
  ] });
}
export {
  FileUploadDropzone as F
};
