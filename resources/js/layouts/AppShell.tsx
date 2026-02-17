import React, { ReactNode, useState } from 'react'
import AppSidebar from '@/components/AppSidebar'
import AppTopbar from '@/components/AppTopbar'

type Props = {
  children: ReactNode
}

export default function AppShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppTopbar />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}
