import React from 'react'

type Milestone = { id: string, title: string, date?: string, status?: 'planned'|'in-progress'|'done' }

export default function TimelineList({ items = [] }: { items?: Milestone[] }) {
  return (
    <ul className="space-y-3">
      {items.map((m) => (
        <li key={m.id} className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-muted mt-2" />
          <div>
            <div className="font-medium">{m.title}</div>
            <div className="text-sm text-muted-foreground">{m.date} • {m.status}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}
