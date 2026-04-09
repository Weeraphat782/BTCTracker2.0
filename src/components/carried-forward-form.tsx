'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Archive, Calculator, ChevronDown, ChevronUp, Check, Edit2 } from 'lucide-react'
import type { CarriedForward } from '@/lib/types'

interface CarriedForwardFormProps {
  carriedForward: CarriedForward | null
  onSave: (data: Omit<CarriedForward, 'id' | 'createdAt'>) => void
}

export function CarriedForwardForm({ carriedForward, onSave }: CarriedForwardFormProps) {
  const [btcAmount, setBtcAmount] = useState(carriedForward?.btcAmount?.toString() || '')
  const [averageCost, setAverageCost] = useState(carriedForward?.averageCost?.toString() || '')
  const [note, setNote] = useState(carriedForward?.note || '')
  const [isEditing, setIsEditing] = useState(!carriedForward)
  const [isOpen, setIsOpen] = useState(false)

  const totalCost = btcAmount && averageCost 
    ? parseFloat(btcAmount) * parseFloat(averageCost) 
    : 0

  const formatThb = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!btcAmount || !averageCost) return

    onSave({
      btcAmount: parseFloat(btcAmount),
      averageCost: parseFloat(averageCost),
      totalCost: parseFloat(btcAmount) * parseFloat(averageCost),
      note: note || undefined,
    })
    setIsEditing(false)
    setIsOpen(false)
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Card className="border-none bg-card/40 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300">
      <CardHeader
        className="cursor-pointer select-none px-6 py-5 hover:bg-secondary/20 transition-colors"
        onClick={toggleOpen}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Archive className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <CardTitle className="text-base font-bold">Legacy Balance</CardTitle>
              <CardDescription className="text-xs font-medium">
                {carriedForward
                  ? `${carriedForward.btcAmount.toFixed(8)} BTC • ${formatThb(carriedForward.totalCost)}`
                  : 'Pre-existing BTC holdings'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {carriedForward && !isOpen && (
              <div className="h-6 w-6 flex items-center justify-center rounded-full bg-accent/20">
                <Check className="h-3.5 w-3.5 text-accent" />
              </div>
            )}
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-secondary">
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5" onClick={(e) => e.stopPropagation()}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                    BTC Amount
                  </label>
                  <Input
                    type="number"
                    step="0.00000001"
                    placeholder="0.00000000"
                    value={btcAmount}
                    onChange={(e) => setBtcAmount(e.target.value)}
                    className="h-12 rounded-2xl bg-secondary/50 border-none focus-visible:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                    Avg Cost (THB/BTC)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={averageCost}
                    onChange={(e) => setAverageCost(e.target.value)}
                    className="h-12 rounded-2xl bg-secondary/50 border-none focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

              {totalCost > 0 && (
                <div className="flex items-center gap-2 rounded-2xl bg-primary/5 p-4 border border-primary/10">
                  <Calculator className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Calculated Legacy Cost:{' '}
                    <span className="font-black text-foreground">
                      {formatThb(totalCost)}
                    </span>
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                  Reference Note (optional)
                </label>
                <Textarea
                  placeholder="e.g. Holdings from Binance before tracking"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="rounded-2xl bg-secondary/50 border-none focus-visible:ring-primary min-h-[80px] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 h-12 rounded-2xl bg-primary font-bold shadow-lg shadow-primary/10">
                  Save Balance
                </Button>
                {carriedForward && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(false)
                      setIsOpen(false)
                    }}
                    className="h-12 px-6 rounded-2xl font-bold"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">BTC Amount</p>
                  <p className="text-xl font-black tabular-nums">{carriedForward?.btcAmount.toFixed(8)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Avg Cost</p>
                  <p className="text-xl font-black tabular-nums">{formatThb(carriedForward?.averageCost || 0)}</p>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-secondary/30 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Legacy Value</p>
                <p className="text-2xl font-black text-primary tabular-nums">{formatThb(carriedForward?.totalCost || 0)}</p>
              </div>

              {carriedForward?.note && (
                <div className="px-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Note</p>
                  <p className="text-xs font-medium text-muted-foreground/80 italic mt-1 leading-relaxed">
                    "{carriedForward.note}"
                  </p>
                </div>
              )}
              
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                className="w-full h-12 rounded-2xl font-bold border-border/60 gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Legacy Settings
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
