import React, { ReactNode } from 'react'
import { Card } from '@/components/ui/card'

type Props = {
  filters?: ReactNode
  children?: ReactNode
}

export default function DataTable({ filters, children }: Props) {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>{filters}</div>
      </div>
      <div>{children}</div>
    </Card>
  )
}
