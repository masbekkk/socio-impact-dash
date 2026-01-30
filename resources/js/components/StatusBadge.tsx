import React from 'react'
import { Badge } from '@/components/ui/badge'

type Props = { status: string }

export default function StatusBadge({ status }: Props) {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800',
    finished: 'bg-blue-100 text-blue-800',
    blocked: 'bg-red-100 text-red-800',
  }
  const cls = map[status] || 'bg-muted-foreground'
  return <Badge className={cls}>{status}</Badge>
}
