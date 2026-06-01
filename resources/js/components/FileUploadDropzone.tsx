import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { UploadCloud, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FileUploadDropzone({ 
  className, 
  onFilesChange,
  accept,
  multiple = true,
  maxSize,
  labelText = "Klik untuk upload atau drag & drop",
  helperText = "PDF, DOCX, JPG, EXCEL (Max 10MB)"
}: { 
  className?: string, 
  onFilesChange?: (files: File[]) => void,
  accept?: string,
  multiple?: boolean,
  maxSize?: number,
  labelText?: string,
  helperText?: string
}) {
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const onFilesChangeRef = useRef(onFilesChange)
  onFilesChangeRef.current = onFilesChange
  const isFirstRender = useRef(true)

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (onFilesChangeRef.current) onFilesChangeRef.current(files);
  }, [files])

  function validateFileAccept(file: File, acceptString?: string): boolean {
    if (!acceptString) return true;
    const rules = acceptString.split(',').map((r) => r.trim().toLowerCase());
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    return rules.some((rule) => {
      if (rule.startsWith('.')) {
        return fileName.endsWith(rule);
      } else if (rule.endsWith('/*')) {
        const prefix = rule.slice(0, -2);
        return fileType.startsWith(prefix);
      } else {
        return fileType === rule;
      }
    });
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files);
    addFiles(newFiles)
    if (inputRef.current) inputRef.current.value = '';
  }

  function addFiles(newFiles: File[]) {
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
      setFiles((prev) => [...prev, ...filteredFiles])
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const [isDragging, setIsDragging] = useState(false)

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files))
      e.dataTransfer.clearData()
    }
  }

  return (
    <div className={cn("relative flex flex-col", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors flex-1 w-full",
          isDragging ? 'border-primary bg-primary/5' : 'hover:bg-muted/50 border-muted-foreground/25'
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          ref={inputRef}
          onChange={onChange}
        />
        <div className="bg-primary/10 p-2 rounded-full mb-2">
          <UploadCloud className="h-5 w-5 text-primary" />
        </div>
        <p className="text-sm font-medium">{labelText}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{helperText}</p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted/40 rounded border text-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <div className="truncate">
                  <p className="font-medium truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(idx)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
