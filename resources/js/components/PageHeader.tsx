import React, { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  )
}
