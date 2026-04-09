'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Timer, X, Box, Milestone, RefreshCw, Calendar } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface HalvingData {
  currentHeight: number
  nextHalvingBlock: number
  blocksRemaining: number
  daysRemaining: number
  estimatedDate: string
}

interface HalvingCountdownProps {
  onClose: () => void
}

export function HalvingCountdown({ onClose }: HalvingCountdownProps) {
  const [data, setData] = useState<HalvingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/halving')
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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
        
        <CardHeader className="pt-10 sm:pt-8 pb-4 px-8 relative border-b border-border/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-500">
                <Timer className="h-6 w-6 stroke-[3]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Halving Countdown</CardTitle>
                <CardDescription className="text-sm font-medium">The next Scarcity milestone</CardDescription>
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

        <CardContent className="px-8 py-10 space-y-10">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-32 w-full rounded-[32px]" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-3xl" />
                <Skeleton className="h-20 rounded-3xl" />
              </div>
            </div>
          ) : data ? (
            <div className="space-y-10">
              {/* Main Countdown Display */}
              <div className="text-center space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">Estimated Time</span>
                <div className="flex items-baseline justify-center gap-2">
                  <h3 className="text-7xl font-black tracking-tighter tabular-nums">
                    {data.daysRemaining}
                  </h3>
                  <span className="text-2xl font-black text-muted-foreground">DAYS</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  ~ {new Date(data.estimatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {/* Progress Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-[32px] bg-secondary/30 space-y-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <Box className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Blocks Left</span>
                  </div>
                  <p className="text-xl font-black tabular-nums">{data.blocksRemaining.toLocaleString()}</p>
                </div>
                <div className="p-5 rounded-[32px] bg-secondary/30 space-y-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <Milestone className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Target Block</span>
                  </div>
                  <p className="text-xl font-black tabular-nums">{data.nextHalvingBlock.toLocaleString()}</p>
                </div>
              </div>

              {/* Wisdom Section */}
              <div className="p-6 rounded-[32px] bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                <div className="flex items-center gap-2 text-indigo-500">
                  <Info className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Why it matters?</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground/80">
                  Every 210,000 blocks, the amount of new Bitcoin created is cut in half. This reduces supply and is historically a major driver for long-term value appreciation.
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 px-4 opacity-30">
                <RefreshCw className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Network data via Mempool.space</span>
              </div>
            </div>
          ) : (
            <p className="text-center py-10 font-bold text-destructive">Failed to fetch network data.</p>
          )}

          <Button 
            onClick={onClose}
            className="w-full h-16 rounded-[24px] bg-indigo-500 text-white hover:bg-indigo-600 font-black text-lg shadow-xl shadow-indigo-500/10"
          >
            Stay Patient
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
