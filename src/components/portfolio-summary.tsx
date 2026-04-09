'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, Target, Bitcoin, Layers } from 'lucide-react'
import type { Portfolio } from '@/lib/types'

interface PortfolioSummaryProps {
  portfolio: Portfolio
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const formatThb = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatBtc = (value: number) => {
    return value.toFixed(8)
  }

  const isProfit = portfolio.profitLossThb >= 0

  return (
    <div className="grid gap-4">
      {/* Primary Focus Card: Current Value + Profit/Loss */}
      <Card className={`border-none ${isProfit ? 'bg-primary shadow-primary/20' : 'bg-destructive shadow-destructive/20'} text-white shadow-xl overflow-hidden relative transition-colors duration-500`}>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
          <Wallet className="h-48 w-48" />
        </div>
        <CardContent className="p-6 relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-80">
              <Wallet className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Current Balance</span>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20`}>
              {isProfit ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isProfit ? '+' : ''}{portfolio.profitLossPercent.toFixed(2)}%
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-4xl font-black tracking-tight tabular-nums">
              {formatThb(portfolio.currentValueThb)}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 opacity-80">
                <Bitcoin className="h-3.5 w-3.5" />
                <span className="text-xs font-bold tabular-nums">{formatBtc(portfolio.totalBtc)} BTC</span>
              </div>
              <p className="text-sm font-bold opacity-90 tabular-nums">
                {isProfit ? '+' : ''}{formatThb(portfolio.profitLossThb)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Stats Group */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none bg-card/60 backdrop-blur-sm shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 opacity-60">
              <Layers className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Investment</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-lg font-bold tabular-nums">{formatThb(portfolio.totalCostThb)}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Accumulated Cost</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/60 backdrop-blur-sm shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 opacity-60">
              <Target className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Break-even Price</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-lg font-bold tabular-nums">{formatThb(portfolio.averageCostPerBtc)}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Average Buy Price</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
