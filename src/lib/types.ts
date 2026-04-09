// Types for BTC Tracker - prepared for Supabase integration

export interface Purchase {
  id: string
  date: string // ISO date string
  btcAmount: number
  pricePerBtc: number // THB per BTC
  totalCost: number // THB
  note?: string
  createdAt: string
}

export interface CarriedForward {
  id: string
  btcAmount: number
  averageCost: number // THB per BTC
  totalCost: number // THB
  note?: string
  createdAt: string
}

export interface Portfolio {
  totalBtc: number
  totalCostThb: number
  averageCostPerBtc: number
  currentPricePerBtc: number
  currentValueThb: number
  profitLossThb: number
  profitLossPercent: number
}

// Supabase table types (for future integration)
// These match the expected Supabase table structure
export interface DbPurchase {
  id: string
  user_id: string
  date: string
  btc_amount: number
  price_per_btc: number
  total_cost: number
  note: string | null
  created_at: string
}

export interface DbCarriedForward {
  id: string
  user_id: string
  btc_amount: number
  average_cost: number
  total_cost: number
  note: string | null
  created_at: string
}
