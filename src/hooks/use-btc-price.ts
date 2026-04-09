import useSWR from 'swr'

interface BtcPrice {
  thb: number
  usd: number
  change24h: number
  sparkline: { time: number; price: number }[]
  timestamp: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useBtcPrice() {
  const { data, error, isLoading, mutate } = useSWR<BtcPrice>(
    '/api/btc-price',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  )

  return {
    price: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}
