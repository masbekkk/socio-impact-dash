import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function FileUploadDropzone() {
  const [files, setFiles] = useState<File[]>([])

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    setFiles((s) => [...s, ...Array.from(e.target.files)])
  }

  return (
    <div className="border-dashed border rounded p-4">
      <input type="file" multiple onChange={onChange} />
      <div className="mt-3">
        {files.map((f, idx) => (
          <div key={idx} className="text-sm">{f.name}</div>
        ))}
      </div>
    </div>
  )
}
