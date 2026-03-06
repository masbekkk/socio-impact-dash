import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { UploadCloud, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FileUploadDropzone({ className, onFilesChange }: { className?: string, onFilesChange?: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    addFiles(Array.from(e.target.files))
  }

  function addFiles(newFiles: File[]) {
    setFiles((prev) => {
      const updated = [...prev, ...newFiles];
      if (onFilesChange) onFilesChange(updated);
      return updated;
    })
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (onFilesChange) onFilesChange(updated);
      return updated;
    })
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
          multiple
          className="hidden"
          ref={inputRef}
          onChange={onChange}
        />
        <div className="bg-primary/10 p-2 rounded-full mb-2">
          <UploadCloud className="h-5 w-5 text-primary" />
        </div>
        <p className="text-sm font-medium">Klik untuk upload atau drag & drop</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">PDF, DOCX, JPG (Max 50MB)</p>
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
