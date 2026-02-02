import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Box, Calculator } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type BudgetItem = {
  id: string
  name: string
  qty: number
  price: number
}

type BudgetCategory = {
  id: string
  name: string
  items: BudgetItem[]
}

export default function BudgetEditor() {
  const [revenue, setRevenue] = useState<number>(0)
  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      id: '1',
      name: 'ATK (Alat Tulis Kantor)',
      items: [
        { id: '101', name: 'Bolpen', qty: 10, price: 2000 },
        { id: '102', name: 'Kertas A4', qty: 5, price: 45000 },
      ]
    }
  ])

  // --- Category Handlers ---
  function addCategory() {
    setCategories(s => [
      ...s,
      { id: crypto.randomUUID(), name: '', items: [] }
    ])
  }

  function removeCategory(catId: string) {
    setCategories(s => s.filter(c => c.id !== catId))
  }

  function updateCategoryName(catId: string, name: string) {
    setCategories(s => s.map(c => c.id === catId ? { ...c, name } : c))
  }

  // --- Item Handlers ---
  function addItem(catId: string) {
    setCategories(s => s.map(c => {
      if (c.id !== catId) return c
      return {
        ...c,
        items: [...c.items, { id: crypto.randomUUID(), name: '', qty: 1, price: 0 }]
      }
    }))
  }

  function removeItem(catId: string, itemId: string) {
    setCategories(s => s.map(c => {
      if (c.id !== catId) return c
      return {
        ...c,
        items: c.items.filter(i => i.id !== itemId)
      }
    }))
  }

  function updateItem(catId: string, itemId: string, field: keyof BudgetItem, value: any) {
    setCategories(s => s.map(c => {
      if (c.id !== catId) return c
      return {
        ...c,
        items: c.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
      }
    }))
  }

  // --- Calculations ---
  const calculateCategoryTotal = (items: BudgetItem[]) => {
    return items.reduce((sum, item) => sum + (item.qty * item.price), 0)
  }

  const totalExpense = categories.reduce((sum, cat) => sum + calculateCategoryTotal(cat.items), 0)
  const margin = revenue - totalExpense
  const marginPercentage = revenue > 0 ? (margin / revenue) * 100 : 0

  return (
    <div className="space-y-8">

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

      {/* SECTION 2: BUDGET DETAIL PER CATEGORY */}
      <div className="space-y-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Rincian Anggaran
            </h3>
            <p className="text-sm text-muted-foreground">Buat rincian kebutuhan anggaran per kategori.</p>
          </div>
          <Button onClick={addCategory} variant="default" size="sm" className="w-full sm:w-auto gap-2">
            <Plus className="w-4 h-4" /> Tambah Kategori
          </Button>
        </div>

        {categories.map((category, idx) => {
          const catTotal = calculateCategoryTotal(category.items);
          return (
            <Card key={category.id} className="relative overflow-hidden border-muted-foreground/20">
              <CardHeader className="bg-muted/30 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-primary/10 rounded-md shrink-0">
                      <Box className="w-5 h-5 text-primary" />
                    </div>
                    <Input
                      className="font-semibold text-lg bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto w-full placeholder:text-muted-foreground/50"
                      placeholder="Nama Kategori (Contoh: ATK, Konsumsi, Transportasi)"
                      value={category.name}
                      onChange={(e) => updateCategoryName(category.id, e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-muted-foreground block">Subtotal</span>
                      <span className="font-mono font-bold text-primary">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(catTotal)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(category.id)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/10 text-xs uppercase text-muted-foreground">
                        <th className="px-4 py-3 text-left font-medium w-[40%]">Nama Barang</th>
                        <th className="px-4 py-3 text-center font-medium w-[15%]">Jumlah</th>
                        <th className="px-4 py-3 text-right font-medium w-[20%]">Harga Satuan</th>
                        <th className="px-4 py-3 text-right font-medium w-[20%]">Total</th>
                        <th className="px-2 py-3 w-[5%]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {category.items.map((item) => (
                        <tr key={item.id} className="group hover:bg-muted/5">
                          <td className="p-2 pl-4">
                            <Input
                              className="h-8 border-transparent hover:border-input focus:border-input bg-transparent"
                              placeholder="Nama barang..."
                              value={item.name}
                              onChange={(e) => updateItem(category.id, item.id, 'name', e.target.value)}
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              className="h-8 text-center border-transparent hover:border-input focus:border-input bg-transparent"
                              placeholder="0"
                              value={item.qty || ''}
                              onChange={(e) => updateItem(category.id, item.id, 'qty', Number(e.target.value))}
                            />
                          </td>
                          <td className="p-2">
                            <div className="relative">
                              <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">Rp</span>
                              <Input
                                type="number"
                                className="h-8 pl-8 text-right border-transparent hover:border-input focus:border-input bg-transparent font-mono"
                                placeholder="0"
                                value={item.price || ''}
                                onChange={(e) => updateItem(category.id, item.id, 'price', Number(e.target.value))}
                              />
                            </div>
                          </td>
                          <td className="p-2 pr-4 text-right font-mono font-medium text-muted-foreground">
                            {new Intl.NumberFormat('id-ID').format(item.qty * item.price)}
                          </td>
                          <td className="p-2 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeItem(category.id, item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {category.items.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground italic border-dashed border-b">
                            Belum ada item anggaran di kategori ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 bg-muted/10 border-t flex justify-center">
                  <Button variant="outline" size="sm" onClick={() => addItem(category.id)} className="w-full border-dashed text-muted-foreground hover:text-primary hover:border-primary">
                    <Plus className="w-3.5 h-3.5 mr-2" /> Tambah Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* GRAND TOTAL */}
        <div className="flex justify-end pt-4">
          <div className="bg-muted p-4 rounded-lg flex flex-col items-end min-w-[300px]">
            <span className="text-sm font-medium text-muted-foreground">Total Estimasi Pengeluaran</span>
            <span className="text-2xl font-bold text-primary font-mono">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalExpense)}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
