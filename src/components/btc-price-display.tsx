'use client'

import { useBtcPrice } from '@/hooks/use-btc-price'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Bitcoin } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts'
import { useState, useEffect } from 'react'

export function BtcPriceDisplay() {
  const { price, isLoading, isError } = useBtcPrice()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatThb = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatUsd = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
        <CardContent className="p-6 text-center">
          <p className="text-sm font-semibold text-destructive">Failed to load market data</p>
        </CardContent>
      </Card>
    )
  }

  const isPositive = (price?.change24h || 0) >= 0

  return (
    <Card className="border-none bg-gradient-to-br from-card to-secondary/30 shadow-2xl shadow-primary/5 overflow-hidden relative group transition-all duration-300">
      {/* Decorative Background Element */}
      <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none">
        <Bitcoin className="h-48 w-48 rotate-12" />
      </div>

      <CardContent className="p-5 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
              <Bitcoin className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Bitcoin Market</span>
            </div>
            
            {!isLoading && price && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isPositive ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'
              }`}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isPositive ? '+' : ''}{price.change24h.toFixed(2)}%
              </div>
            )}
          </div>

          <div className="space-y-1 relative">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-48 rounded-lg" />
                <Skeleton className="h-6 w-32 rounded-md" />
              </div>
            ) : (
              <>
                {/* 24h Trend Sparkline Background */}
                {mounted && price?.sparkline && (
                  <div className="absolute inset-0 -top-4 -bottom-4 opacity-50 pointer-events-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={price.sparkline}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isPositive ? 'var(--accent)' : 'var(--destructive)'} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={isPositive ? 'var(--accent)' : 'var(--destructive)'} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={isPositive ? 'var(--accent)' : 'var(--destructive)'}
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                          isAnimationActive={true}
                          animationDuration={2000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                <div className="relative z-10">
                  <h2 className="text-4xl font-black tracking-tight text-foreground tabular-nums leading-none">
                    {price ? formatThb(price.thb) : '--'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <p className="text-base font-medium text-muted-foreground tabular-nums">
                      {price ? formatUsd(price.usd) : '--'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-border/10 flex items-center justify-between">
            <div className="flex items-center gap-2 shrink-0">
              <div className={`h-2 w-2 rounded-full animate-pulse ${isPositive ? 'bg-accent' : 'bg-destructive'}`} />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none">24H MARKET TREND</span>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground/50 tabular-nums">
              {mounted ? new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
