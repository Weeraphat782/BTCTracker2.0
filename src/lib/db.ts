import { supabase } from './supabase'
import type { Purchase, CarriedForward } from './types'

// ─── Purchases ────────────────────────────────────────────────────────────────

export async function getPurchases(): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching purchases:', error)
    throw error
  }

  return (data || []).map(mapDbPurchase)
}

export async function addPurchase(
  purchase: Omit<Purchase, 'id' | 'createdAt'>
): Promise<Purchase> {
  const { data, error } = await supabase
    .from('purchases')
    .insert({
      date: purchase.date,
      btc_amount: purchase.btcAmount,
      price_per_btc: purchase.pricePerBtc,
      total_cost: purchase.totalCost,
      note: purchase.note || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding purchase:', error)
    throw error
  }

  return mapDbPurchase(data)
}

export async function deletePurchase(id: string): Promise<void> {
  const { error } = await supabase
    .from('purchases')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting purchase:', error)
    throw error
  }
}

// ─── Carried Forward ──────────────────────────────────────────────────────────

export async function getCarriedForward(): Promise<CarriedForward | null> {
  const { data, error } = await supabase
    .from('carried_forward')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching carried forward:', error)
    throw error
  }

  return data ? mapDbCarriedForward(data) : null
}

export async function saveCarriedForward(
  cf: Omit<CarriedForward, 'id' | 'createdAt'>,
  existingId?: string
): Promise<CarriedForward> {
  if (existingId) {
    // Update existing record
    const { data, error } = await supabase
      .from('carried_forward')
      .update({
        btc_amount: cf.btcAmount,
        average_cost: cf.averageCost,
        total_cost: cf.totalCost,
        note: cf.note || null,
      })
      .eq('id', existingId)
      .select()
      .single()

    if (error) {
      console.error('Error updating carried forward:', error)
      throw error
    }

    return mapDbCarriedForward(data)
  } else {
    // Insert new record (delete old ones first to ensure only 1 row)
    await supabase.from('carried_forward').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const { data, error } = await supabase
      .from('carried_forward')
      .insert({
        btc_amount: cf.btcAmount,
        average_cost: cf.averageCost,
        total_cost: cf.totalCost,
        note: cf.note || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting carried forward:', error)
      throw error
    }

    return mapDbCarriedForward(data)
  }
}

// ─── Mappers (snake_case DB → camelCase Frontend) ─────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbPurchase(row: any): Purchase {
  return {
    id: row.id,
    date: row.date,
    btcAmount: Number(row.btc_amount),
    pricePerBtc: Number(row.price_per_btc),
    totalCost: Number(row.total_cost),
    note: row.note || undefined,
    createdAt: row.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbCarriedForward(row: any): CarriedForward {
  return {
    id: row.id,
    btcAmount: Number(row.btc_amount),
    averageCost: Number(row.average_cost),
    totalCost: Number(row.total_cost),
    note: row.note || undefined,
    createdAt: row.created_at,
  }
}
