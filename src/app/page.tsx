'use client'

import { useMemo, useState } from 'react'
import { BtcPriceDisplay } from '@/components/btc-price-display'
import { PortfolioSummary } from '@/components/portfolio-summary'
import { CarriedForwardForm } from '@/components/carried-forward-form'
import { PurchaseForm } from '@/components/purchase-form'
import { PurchaseHistory } from '@/components/purchase-history'
import { TargetCalculator } from '@/components/target-calculator'
import { useBtcPrice } from '@/hooks/use-btc-price'
import { usePurchases } from '@/hooks/use-purchases'
import { useCarriedForward } from '@/hooks/use-carried-forward'
import { ThemeToggle } from '@/components/theme-toggle'
import { Plus, RefreshCw, Rocket, Thermometer, Timer, Medal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Portfolio } from '@/lib/types'
import { FngInsight } from '@/components/fng-insight'
import { HalvingCountdown } from '@/components/halving-countdown'
import { HodlBadges } from '@/components/hodl-badges'

export default function HomePage() {
  const { price, refresh: refreshPrice, isLoading: isPriceLoading } = useBtcPrice()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isMoonModalOpen, setIsMoonModalOpen] = useState(false)
  const [isFngModalOpen, setIsFngModalOpen] = useState(false)
  const [isHalvingModalOpen, setIsHalvingModalOpen] = useState(false)
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false)
  
  const {
    purchases,
    isLoading: purchasesLoading,
    addPurchase,
    deletePurchase,
  } = usePurchases()
  
  const {
    carriedForward,
    isLoading: cfLoading,
    saveCarriedForward,
  } = useCarriedForward()

  // Calculate portfolio summary
  const portfolio = useMemo<Portfolio>(() => {
    const currentPrice = price?.thb || 0

    // Sum from carried forward
    const cfBtc = carriedForward?.btcAmount || 0
    const cfCost = carriedForward?.totalCost || 0

    // Sum from purchases
    const purchaseBtc = purchases.reduce((sum, p) => sum + p.btcAmount, 0)
    const purchaseCost = purchases.reduce((sum, p) => sum + p.totalCost, 0)

    // Total
    const totalBtc = cfBtc + purchaseBtc
    const totalCostThb = cfCost + purchaseCost
    const averageCostPerBtc = totalBtc > 0 ? totalCostThb / totalBtc : 0
    const currentValueThb = totalBtc * currentPrice
    const profitLossThb = currentValueThb - totalCostThb
    const profitLossPercent = totalCostThb > 0 ? (profitLossThb / totalCostThb) * 100 : 0

    return {
      totalBtc,
      totalCostThb,
      averageCostPerBtc,
      currentPricePerBtc: currentPrice,
      currentValueThb,
      profitLossThb,
      profitLossPercent,
    }
  }, [carriedForward, purchases, price])

  const isLoading = purchasesLoading || cfLoading

  const handleAddPurchase = async (data: any) => {
    await addPurchase(data)
    setIsAddModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header - Minimal & Sticky */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="currentColor">
                <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z" />
                <path fill="currentColor" className="text-white dark:text-background" d="M17.27 10.086c.24-1.6-.98-2.46-2.64-3.03l.54-2.16-1.32-.33-.53 2.1c-.35-.09-.7-.17-1.06-.25l.53-2.12-1.32-.33-.54 2.16c-.29-.07-.57-.13-.85-.2l-1.82-.45-.35 1.4s.98.23.96.24c.54.13.63.5.62.78l-.62 2.5c.04.01.09.02.14.04l-.14-.04-.87 3.5c-.07.16-.23.4-.6.31.01.02-.96-.24-.96-.24l-.66 1.5 1.72.43c.32.08.63.16.94.24l-.55 2.2 1.32.33.54-2.16c.36.1.71.19 1.05.27l-.54 2.15 1.32.33.55-2.2c2.26.43 3.96.26 4.68-1.79.58-1.65-.03-2.6-1.22-3.22.87-.2 1.52-.77 1.7-1.94zm-3.04 4.27c-.41 1.65-3.2.76-4.1.53l.73-2.93c.9.22 3.81.67 3.37 2.4zm.41-4.3c-.37 1.5-2.69.74-3.44.55l.66-2.66c.75.19 3.17.54 2.78 2.11z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">BTC Tracker</h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
             <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsBadgesModalOpen(true)}
              className="rounded-full hover:bg-secondary text-yellow-600"
              title="HODL Badges"
            >
              <Medal className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFngModalOpen(true)}
              className="rounded-full hover:bg-secondary text-orange-500"
              title="Market Sentiment"
            >
              <Thermometer className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsHalvingModalOpen(true)}
              className="rounded-full hover:bg-secondary text-indigo-500"
              title="Halving Countdown"
            >
              <Timer className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMoonModalOpen(true)}
              className="rounded-full hover:bg-secondary text-purple-500"
              title="Moon Projection"
            >
              <Rocket className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-border/40 mx-1 hidden sm:block" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refreshPrice()}
              disabled={isPriceLoading}
              className="rounded-full hover:bg-secondary"
            >
              <RefreshCw className={`h-5 w-5 ${isPriceLoading ? 'animate-spin' : ''}`} />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container max-w-lg mx-auto px-6 py-6 pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Price Hero Section */}
        <section>
          <BtcPriceDisplay />
        </section>

        {/* Global Portfolio Summary */}
        <section>
          <PortfolioSummary portfolio={portfolio} />
        </section>

        {/* Setup / Config Sections */}
        <section className="space-y-4">
          <CarriedForwardForm
            carriedForward={carriedForward}
            onSave={saveCarriedForward}
          />
        </section>

        {/* Lists & Activity */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Activity</h2>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest px-2 py-1 rounded bg-secondary/50">History</span>
          </div>
          <PurchaseHistory
            purchases={purchases}
            onDelete={deletePurchase}
          />
        </section>

        {isLoading && (
          <div className="flex items-center justify-center py-10 opacity-60">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Syncing with Supabase...</span>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Button
          size="lg"
          onClick={() => setIsAddModalOpen(true)}
          className="h-14 px-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-200 gap-2 font-bold"
        >
          <Plus className="h-6 w-6 stroke-[3]" />
          Add Purchase
        </Button>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <PurchaseForm 
          onAdd={handleAddPurchase} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}

      {/* Moon Projection Modal */}
      {isMoonModalOpen && (
        <TargetCalculator 
          portfolio={portfolio} 
          onClose={() => setIsMoonModalOpen(false)} 
        />
      )}

      {/* Market Sentiment Modal */}
      {isFngModalOpen && (
        <FngInsight 
          onClose={() => setIsFngModalOpen(false)} 
        />
      )}

      {/* Halving Countdown Modal */}
      {isHalvingModalOpen && (
        <HalvingCountdown 
          onClose={() => setIsHalvingModalOpen(false)} 
        />
      )}

      {/* HODL Badges Modal */}
      {isBadgesModalOpen && (
        <HodlBadges 
          purchases={purchases}
          portfolio={portfolio}
          onClose={() => setIsBadgesModalOpen(false)} 
        />
      )}

      <footer className="w-full text-center py-10 opacity-40">
        <p className="text-xs font-medium uppercase tracking-widest">
          Powered by CoinGecko & Supabase
        </p>
      </footer>
    </div>
  )
}
