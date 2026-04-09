'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Bitcoin, Calendar, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Purchase } from '@/lib/types'

interface PurchaseHistoryProps {
  purchases: Purchase[]
  onDelete: (id: string) => void
}

export function PurchaseHistory({ purchases, onDelete }: PurchaseHistoryProps) {
  const [showAll, setShowAll] = useState(false)
  const displayPurchases = showAll ? purchases : purchases.slice(0, 5)

  const formatThb = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (purchases.length === 0) {
    return (
      <Card className="border-none bg-secondary/20 rounded-[32px] overflow-hidden">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center">
            <Bitcoin className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground/60 max-w-[200px]">
              Your Bitcoin purchase history will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {displayPurchases.map((purchase) => (
          <Card key={purchase.id} className="border-none bg-card/60 backdrop-blur-sm shadow-sm rounded-3xl group overflow-hidden transition-all duration-300 active:scale-[0.98]">
            <CardContent className="p-0">
              <div className="flex items-center p-4 pr-2 gap-4">
                {/* Icon Column */}
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Bitcoin className="h-6 w-6 text-primary" />
                </div>

                {/* Info Column */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base tracking-tight tabular-nums">
                      {purchase.btcAmount.toFixed(8)} BTC
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <Calendar className="h-3 w-3" />
                    {formatDate(purchase.date)}
                  </div>
                </div>

                {/* Price Column */}
                <div className="text-right space-y-0.5">
                  <p className="font-black text-base text-accent tabular-nums">
                    {formatThb(purchase.totalCost)}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 tabular-nums">
                    @{formatThb(purchase.pricePerBtc)}
                  </p>
                </div>

                {/* Action Column */}
                <div className="pl-2">
                   <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={() => onDelete(purchase.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {purchase.note && (
                <div className="mx-4 mb-4 p-3 rounded-2xl bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground/80 font-medium leading-relaxed italic">
                    "{purchase.note}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {purchases.length > 5 && (
        <Button
          variant="ghost"
          className="w-full h-12 rounded-2xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-secondary/40 gap-2"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Recent' : `View All Activity (${purchases.length})`}
          <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${showAll ? '-rotate-90' : 'rotate-90'}`} />
        </Button>
      )}
    </div>
  )
}
