import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

type Row = { id: string, label: string, planned: number, actual: number }

export default function BudgetEditor({ initial = [] as Row[] }: { initial?: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial.length ? initial : [{ id: '1', label: 'Item 1', planned: 1000000, actual: 500000 }])

  function addRow() {
    setRows((s) => [...s, { id: String(s.length + 1), label: 'Item ' + (s.length + 1), planned: 0, actual: 0 }])
  }

  function update(i: number, patch: Partial<Row>) {
    setRows((s) => s.map((r, idx) => idx === i ? { ...r, ...patch } : r))
  }

  const totalPlanned = rows.reduce((a, b) => a + b.planned, 0)
  const totalActual = rows.reduce((a, b) => a + b.actual, 0)

  return (
    <div>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.id} className="grid grid-cols-12 gap-2 items-center">
            <input className="col-span-4 p-2 border rounded" value={r.label} onChange={(e) => update(i, { label: e.target.value })} />
            <input type="number" className="col-span-3 p-2 border rounded" value={r.planned} onChange={(e) => update(i, { planned: Number(e.target.value) })} />
            <input type="number" className="col-span-3 p-2 border rounded" value={r.actual} onChange={(e) => update(i, { actual: Number(e.target.value) })} />
            <Button variant="ghost" onClick={() => setRows((s) => s.filter((_, idx) => idx !== i))}>Hapus</Button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <strong>Total Planning:</strong> Rp {totalPlanned.toLocaleString()} • <strong>Actual:</strong> Rp {totalActual.toLocaleString()}
        </div>
        <Button onClick={addRow}>Tambahkan item</Button>
      </div>
    </div>
  )
}
