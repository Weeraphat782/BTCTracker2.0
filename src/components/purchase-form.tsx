'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Zap, Calculator, X, Calendar, Wallet } from 'lucide-react'
import { useBtcPrice } from '@/hooks/use-btc-price'
import type { Purchase } from '@/lib/types'

interface PurchaseFormProps {
  onAdd: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => void
  onClose: () => void
}

export function PurchaseForm({ onAdd, onClose }: PurchaseFormProps) {
  const { price } = useBtcPrice()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [btcAmount, setBtcAmount] = useState('')
  const [pricePerBtc, setPricePerBtc] = useState('')
  const [note, setNote] = useState('')

  const totalCost = btcAmount && pricePerBtc 
    ? parseFloat(btcAmount) * parseFloat(pricePerBtc) 
    : 0

  const formatThb = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleUseCurrentPrice = () => {
    if (price?.thb) {
      setPricePerBtc(price.thb.toString())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!btcAmount || !pricePerBtc) return

    onAdd({
      date,
      btcAmount: parseFloat(btcAmount),
      pricePerBtc: parseFloat(pricePerBtc),
      totalCost: parseFloat(btcAmount) * parseFloat(pricePerBtc),
      note: note || undefined,
    })
  }

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Backdrop overlay for closing */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <Card className="relative w-full max-w-lg bg-card shadow-2xl rounded-t-[32px] sm:rounded-[32px] overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-500">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-muted rounded-full sm:hidden" />
        
        <CardHeader className="pt-10 sm:pt-8 pb-6 px-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/20">
                <Plus className="h-6 w-6 stroke-[3]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">New Transaction</CardTitle>
                <CardDescription className="text-sm font-medium">Record a Bitcoin purchase</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-secondary h-10 w-10 shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              {/* Date Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Purchase Date
                  </label>
                </div>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-14 rounded-2xl bg-secondary/50 border-none focus-visible:ring-accent text-base font-semibold"
                  required
                />
              </div>

              {/* BTC Amount */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    BTC Amount
                  </label>
                </div>
                <Input
                  type="number"
                  step="0.00000001"
                  placeholder="0.00000000"
                  value={btcAmount}
                  onChange={(e) => setBtcAmount(e.target.value)}
                  className="h-14 rounded-2xl bg-secondary/50 border-none focus-visible:ring-accent text-lg font-black"
                  required
                />
              </div>

              {/* Price Per BTC */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Market Price (THB/BTC)
                  </label>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={pricePerBtc}
                    onChange={(e) => setPricePerBtc(e.target.value)}
                    className="h-14 rounded-2xl bg-secondary/50 border-none focus-visible:ring-accent flex-1 text-lg font-black"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUseCurrentPrice}
                    disabled={!price?.thb}
                    className="h-14 px-4 rounded-2xl border-accent/20 text-accent hover:bg-accent/10 shrink-0 font-bold gap-2"
                  >
                    <Zap className="h-5 w-5 fill-accent" />
                    <span className="hidden sm:inline">Use Live</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Total Cost Highlight */}
            <div className="p-5 rounded-3xl bg-accent text-accent-foreground shadow-xl shadow-accent/10 space-y-1">
              <div className="flex items-center gap-2 opacity-80">
                <Calculator className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Calculated Total</span>
              </div>
              <p className="text-3xl font-black tabular-nums font-mono">
                {totalCost > 0 ? formatThb(totalCost) : '฿0'}
              </p>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                Note (optional)
              </label>
              <Textarea
                placeholder="e.g. Weekly Savings Accumulation"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-2xl bg-secondary/50 border-none focus-visible:ring-accent min-h-[80px] text-sm font-medium resize-none px-4 py-3"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 rounded-[24px] bg-accent text-accent-foreground hover:bg-accent/90 font-black text-lg shadow-xl shadow-accent/20"
            >
              Confirm Purchase
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
