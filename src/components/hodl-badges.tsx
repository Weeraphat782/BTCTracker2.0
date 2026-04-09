'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Medal, X, Trophy, Heart, Shield, Star, Award } from 'lucide-react'
import type { Purchase, Portfolio } from '@/lib/types'

interface HodlBadgesProps {
  purchases: Purchase[]
  portfolio: Portfolio
  onClose: () => void
}

export function HodlBadges({ purchases, portfolio, onClose }: HodlBadgesProps) {
  // Logic to calculate badges
  const hasPurchases = purchases.length > 0
  const oldestPurchase = hasPurchases ? purchases.reduce((oldest, p) => 
    new Date(p.date) < new Date(oldest.date) ? p : oldest
  , purchases[0]) : null

  const daysHeld = oldestPurchase ? Math.floor((Date.now() - new Date(oldestPurchase.date).getTime()) / (1000 * 60 * 60 * 24)) : 0
  
  const totalBtc = portfolio.totalBtc
  const isProfit = portfolio.profitLossThb > 0

  const badges = [
    {
      id: 'early_bird',
      name: 'Pioneer Spirit',
      description: 'Recorded your first Bitcoin transaction.',
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      unlocked: hasPurchases,
      requirement: 'Add 1 purchase'
    },
    {
      id: 'hodler_30',
      name: 'Steady Hands',
      description: 'Held your Bitcoin for over 30 days.',
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      unlocked: daysHeld >= 30,
      requirement: 'Hold for 30 days'
    },
    {
      id: 'diamond_hands',
      name: 'Diamond Hands',
      description: 'Currently in profit and holding strong.',
      icon: <Award className="h-6 w-6 text-indigo-500" />,
      unlocked: isProfit && totalBtc > 0,
      requirement: 'HODL in profit'
    },
    {
      id: 'accumulation',
      name: 'Accumulator',
      description: 'Made at least 5 separate purchases.',
      icon: <Trophy className="h-6 w-6 text-orange-500" />,
      unlocked: purchases.length >= 5,
      requirement: '5+ transactions'
    },
    {
      id: 'true_believer',
      name: 'True Believer',
      description: 'Held for over 365 days (1 year).',
      icon: <Heart className="h-6 w-6 text-red-500" />,
      unlocked: daysHeld >= 365,
      requirement: 'Hold for 1 year'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <Card className="relative w-full max-w-lg bg-card shadow-2xl rounded-t-[32px] sm:rounded-[32px] overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-500">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-muted rounded-full sm:hidden" />
        
        <CardHeader className="pt-10 sm:pt-8 pb-4 px-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-600">
                <Medal className="h-6 w-6 stroke-[3]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">HODL Badges</CardTitle>
                <CardDescription className="text-sm font-medium">Your milestones & achievements</CardDescription>
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
          <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`p-5 rounded-[28px] border transition-all duration-300 flex items-center gap-5 ${
                  badge.unlocked 
                    ? 'bg-secondary/20 border-border/50' 
                    : 'bg-secondary/5 border-dashed border-border/20 opacity-40 grayscale'
                }`}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${badge.unlocked ? 'bg-background shadow-lg' : 'bg-muted'}`}>
                  {badge.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black tracking-tight">{badge.name}</h4>
                    {!badge.unlocked && <span className="text-[10px] font-bold uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full">{badge.requirement}</span>}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="p-4 rounded-3xl bg-primary/5 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tenure Score</p>
              <p className="text-2xl font-black tabular-nums">{daysHeld} Days Holding</p>
            </div>
          </div>

          <Button 
            onClick={onClose}
            className="w-full h-16 rounded-[24px] bg-secondary text-secondary-foreground hover:bg-secondary/90 font-black text-lg"
          >
            Trophy Room Closed
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
