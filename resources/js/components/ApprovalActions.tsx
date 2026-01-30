import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface ApprovalActionsProps {
  onApprove?: () => void
  onReject?: (reason?: string) => void
}

export default function ApprovalActions({ onApprove, onReject }: ApprovalActionsProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  return (
    <div className="flex gap-2">
      <Button variant="default" onClick={() => onApprove && onApprove()}>Setujui</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Tolak</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <h3 className="text-lg font-bold">Alasan penolakan</h3>
            <p className="text-sm text-muted-foreground">Berikan alasan untuk menolak pengajuan ini.</p>
          </DialogHeader>
          <Textarea 
            value={reason} 
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
            placeholder="Jelaskan alasan penolakan..."
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={() => { onReject && onReject(reason); setOpen(false) }}>Kirim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
