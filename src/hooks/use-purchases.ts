import useSWR from 'swr'
import { getPurchases, addPurchase, deletePurchase } from '@/lib/db'
import type { Purchase } from '@/lib/types'

const PURCHASES_KEY = 'supabase:purchases'

export function usePurchases() {
  const { data, error, isLoading, mutate } = useSWR<Purchase[]>(
    PURCHASES_KEY,
    getPurchases,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  const handleAddPurchase = async (
    purchaseData: Omit<Purchase, 'id' | 'createdAt'>
  ) => {
    // Optimistic update  
    const optimisticPurchase: Purchase = {
      id: crypto.randomUUID(),
      ...purchaseData,
      createdAt: new Date().toISOString(),
    }

    await mutate(
      async (current) => {
        const newPurchase = await addPurchase(purchaseData)
        return [newPurchase, ...(current || [])]
      },
      {
        optimisticData: [optimisticPurchase, ...(data || [])],
        rollbackOnError: true,
        revalidate: false,
      }
    )
  }

  const handleDeletePurchase = async (id: string) => {
    await mutate(
      async (current) => {
        await deletePurchase(id)
        return (current || []).filter((p) => p.id !== id)
      },
      {
        optimisticData: (data || []).filter((p) => p.id !== id),
        rollbackOnError: true,
        revalidate: false,
      }
    )
  }

  return {
    purchases: data || [],
    isLoading,
    isError: error,
    addPurchase: handleAddPurchase,
    deletePurchase: handleDeletePurchase,
    refresh: mutate,
  }
}
