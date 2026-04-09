import useSWR from 'swr'
import { getCarriedForward, saveCarriedForward } from '@/lib/db'
import type { CarriedForward } from '@/lib/types'

const CF_KEY = 'supabase:carried-forward'

export function useCarriedForward() {
  const { data, error, isLoading, mutate } = useSWR<CarriedForward | null>(
    CF_KEY,
    getCarriedForward,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  const handleSaveCarriedForward = async (
    cfData: Omit<CarriedForward, 'id' | 'createdAt'>
  ) => {
    const existingId = data?.id

    // Optimistic update
    const optimisticCf: CarriedForward = {
      id: existingId || crypto.randomUUID(),
      ...cfData,
      createdAt: data?.createdAt || new Date().toISOString(),
    }

    await mutate(
      async () => {
        return await saveCarriedForward(cfData, existingId)
      },
      {
        optimisticData: optimisticCf,
        rollbackOnError: true,
        revalidate: false,
      }
    )
  }

  return {
    carriedForward: data ?? null,
    isLoading,
    isError: error,
    saveCarriedForward: handleSaveCarriedForward,
    refresh: mutate,
  }
}
