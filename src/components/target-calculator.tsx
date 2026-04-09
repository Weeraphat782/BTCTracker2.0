'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Rocket, Target, TrendingUp, Sparkles, Coins, X } from 'lucide-react'
import type { Portfolio } from '@/lib/types'

interface TargetCalculatorProps {
  portfolio: Portfolio
  onClose: () => void
}

export function TargetCalculator({ portfolio, onClose }: TargetCalculatorProps) {
  const [targetPrice, setTargetPrice] = useState<number>(portfolio.currentPricePerBtc * 2 || 3500000)

  const projection = useMemo(() => {
    const totalValue = portfolio.totalBtc * targetPrice
    const profit = totalValue - portfolio.totalCostThb
    const multiplier = portfolio.totalCostThb > 0 ? totalValue / portfolio.totalCostThb : 0
    return {
      totalValue,
      profit,
      multiplier
    }
  }, [portfolio, targetPrice])

  const formatThb = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handlePriceChange = (value: number[]) => {
    setTargetPrice(value[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0
    setTargetPrice(val)
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
      
      <Card className="relative w-full max-w-lg bg-card shadow-2xl rounded-t-[32px] sm:rounded-[32px] overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-500 bg-gradient-to-br from-card via-card to-indigo-500/5">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-muted rounded-full sm:hidden" />
        
        <CardHeader className="pt-10 sm:pt-8 pb-4 px-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-500 animate-pulse">
                <Rocket className="h-6 w-6 stroke-[3]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                  Moon Projection
                  <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </CardTitle>
                <CardDescription className="text-sm font-medium">What if Bitcoin hits your target?</CardDescription>
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

        <CardContent className="px-8 pb-10 space-y-8">
          {/* Input & Slider Section */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Target Price (THB)
                </label>
                <span className="text-xs font-black text-indigo-500 tabular-nums">
                  {formatThb(targetPrice)} / BTC
                </span>
              </div>
              <Input
                type="number"
                value={targetPrice}
                onChange={handleInputChange}
                className="h-14 rounded-2xl bg-secondary/50 border-none focus-visible:ring-indigo-500 text-lg font-black tabular-nums"
              />
            </div>
            
            <div className="px-1">
              <Slider
                defaultValue={[targetPrice]}
                max={targetPrice * 5}
                min={portfolio.currentPricePerBtc}
                step={10000}
                value={[targetPrice]}
                onValueChange={handlePriceChange}
                className="py-4"
              />
              <div className="flex justify-between text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest">
                <span>Current</span>
                <span>Moonbound</span>
              </div>
            </div>
          </div>

          {/* Projection Results */}
          <div className="grid gap-4">
            {/* Projected Total Value */}
            <div className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <Coins className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Future Value</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                  {projection.multiplier.toFixed(1)}x GAIN
                </div>
              </div>
              <p className="text-4xl font-black tabular-nums tracking-tight">
                {formatThb(projection.totalValue)}
              </p>
            </div>

            {/* Projected Profit */}
            <div className="p-5 rounded-3xl bg-green-500/10 border border-green-500/10 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-green-500" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-green-500/80">Projected Profit</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-green-500 tabular-nums tracking-tight">
                  +{formatThb(projection.profit)}
                </p>
                <TrendingUp className="h-4 w-4 text-green-500 animate-bounce" />
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.4em] pt-4">
            HODLING FOR THE NEXT 20 YEARS
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
