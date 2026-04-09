'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Thermometer, X, Info, AlertTriangle, Zap } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface FngData {
  value: number
  classification: string
  timestamp: string
}

interface FngInsightProps {
  onClose: () => void
}

export function FngInsight({ onClose }: FngInsightProps) {
  const [data, setData] = useState<FngData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/fng')
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getColor = (value: number) => {
    if (value <= 25) return 'text-destructive fill-destructive'
    if (value <= 45) return 'text-orange-500 fill-orange-500'
    if (value <= 55) return 'text-yellow-500 fill-yellow-500'
    if (value <= 75) return 'text-accent fill-accent'
    return 'text-green-500 fill-green-500'
  }

  const getBgColor = (value: number) => {
    if (value <= 25) return 'bg-destructive/10'
    if (value <= 45) return 'bg-orange-500/10'
    if (value <= 55) return 'bg-yellow-500/10'
    if (value <= 75) return 'bg-accent/10'
    return 'bg-green-500/10'
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
      <div className="absolute inset-0" onClick={onClose} />
      
      <Card className="relative w-full max-w-lg bg-card shadow-2xl rounded-t-[32px] sm:rounded-[32px] overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-500">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-muted rounded-full sm:hidden" />
        
        <CardHeader className="pt-10 sm:pt-8 pb-4 px-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-500">
                <Thermometer className="h-6 w-6 stroke-[3]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Market Sentiment</CardTitle>
                <CardDescription className="text-sm font-medium">Bitcoin Fear & Greed Index</CardDescription>
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
          {loading ? (
            <div className="space-y-6 py-4">
              <Skeleton className="h-24 w-full rounded-[32px]" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Main Gauge Display */}
              <div className={`p-8 rounded-[40px] ${getBgColor(data.value)} flex flex-col items-center text-center space-y-4 border border-white/5`}>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">Status</span>
                <h3 className={`text-5xl font-black tracking-tight ${getColor(data.value).split(' ')[0]}`}>
                  {data.classification}
                </h3>
                <div className="flex items-center gap-3 py-2 px-6 rounded-full bg-white/10 backdrop-blur-sm">
                  <span className="text-2xl font-black tabular-nums">{data.value}</span>
                  <div className="h-4 w-px bg-white/20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">SCORE</span>
                </div>
              </div>

              {/* Tips Section */}
              <div className="grid gap-4">
                <div className="flex gap-4 p-4 rounded-3xl bg-secondary/30">
                  <div className="mt-1">
                    {data.value < 40 ? <AlertTriangle className="h-5 w-5 text-orange-500" /> : <Zap className="h-5 w-5 text-accent" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">Trading Insight</p>
                    <p className="text-sm font-medium leading-relaxed">
                      {data.value < 40 
                        ? "Market is fearful. This is historically often a good opportunity for long-term HODLers to accumulate."
                        : data.value > 60 
                        ? "Market is greedy. Be cautious of potential over-extension and FOMO in the short term."
                        : "Market is in balance. Maintain your steady DCA strategy and ignore the daily noise."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 opacity-40">
                  <Info className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Updates daily via Alternative.me</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center py-10 font-bold text-destructive">Failed to fetch sentiment data.</p>
          )}

          <Button 
            onClick={onClose}
            className="w-full h-16 rounded-[24px] bg-secondary text-secondary-foreground hover:bg-secondary/90 font-black text-lg"
          >
            Got it
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
