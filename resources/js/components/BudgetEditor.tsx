import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

type ExpenseItem = { id: string, label: string, amount: number }

export default function BudgetEditor({ initial = [] as ExpenseItem[] }: { initial?: ExpenseItem[] }) {
  const [revenue, setRevenue] = useState<number>(0)
  const [expenses, setExpenses] = useState<ExpenseItem[]>([{ id: '1', label: 'Operasional Lapangan', amount: 0 }])

  function addRow() {
    setExpenses((s) => [...s, { id: crypto.randomUUID(), label: '', amount: 0 }])
  }

  function updateRow(i: number, patch: Partial<ExpenseItem>) {
    setExpenses((s) => s.map((r, idx) => idx === i ? { ...r, ...patch } : r))
  }

  function removeRow(i: number) {
    setExpenses((s) => s.filter((_, idx) => idx !== i))
  }

  const totalExpense = expenses.reduce((a, b) => a + b.amount, 0)
  const margin = revenue - totalExpense
  const marginPercentage = revenue > 0 ? (margin / revenue) * 100 : 0

  return (
    <div className="space-y-6">

      {/* SECTION 1: NOMINAL PROJECT (INCOME) */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-full md:w-1/2">
              <Label className="text-base font-semibold">Nominal Project</Label>
              <p className="text-sm text-muted-foreground mb-3">Nilai kontrak yang akan diterima dari Client (Revenue).</p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-semibold">Rp</span>
                <Input
                  type="number"
                  className="pl-9 text-lg font-mono font-semibold"
                  value={revenue || ''}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4 bg-background rounded-lg border text-center">
              <Label className="text-sm text-muted-foreground">Estimasi Sisa Anggaran</Label>
              <div className={`text-2xl font-bold font-mono mt-1 ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(margin)}
              </div>
              <div className={`text-xs font-medium mt-1 ${marginPercentage >= 0 ? 'text-gray-600' : 'text-red-600'}`}>
                {marginPercentage.toFixed(1)}% dari Total Project
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: PROYEKSI KEUANGAN (EXPENSES) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Proyeksi Pengeluaran (Cost)</h4>
            <p className="text-sm text-muted-foreground">Rincian rencana penggunaan anggaran.</p>
          </div>
          <Button size="sm" variant="outline" onClick={addRow} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Anggaran
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left w-[60%]">Anggaran</th>
                <th className="p-3 text-left">Jumlah (Rp)</th>
                <th className="p-3 w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {expenses.map((r, i) => (
                <tr key={r.id} className="bg-background">
                  <td className="p-2">
                    <Input
                      className="border-none shadow-none focus-visible:ring-0"
                      placeholder="Nama item pengeluaran..."
                      value={r.label}
                      onChange={(e) => updateRow(i, { label: e.target.value })}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      className="border-none shadow-none focus-visible:ring-0 font-mono"
                      value={r.amount || ''}
                      onChange={(e) => updateRow(i, { amount: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <Button variant="ghost" size="icon" onClick={() => removeRow(i)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/50 font-medium">
              <tr>
                <td className="p-3 text-right">Total Estimasi Pengeluaran:</td>
                <td className="p-3 font-mono">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalExpense)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  )
}
