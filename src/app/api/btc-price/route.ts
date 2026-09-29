import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // CoinGecko's /simple/price is blocked (403), so price and 24h change are derived from market_chart
    const [thbRes, usdRes] = await Promise.all(
      ['thb', 'usd'].map((c) =>
        fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${c}&days=1`, {
          next: { revalidate: 60 },
        })
      )
    )

    if (!thbRes.ok || !usdRes.ok) {
      throw new Error('Failed to fetch data from CoinGecko')
    }

    const thbPrices: [number, number][] = (await thbRes.json()).prices
    const usdPrices: [number, number][] = (await usdRes.json()).prices
    if (!thbPrices?.length || !usdPrices?.length) {
      throw new Error('Empty price data from CoinGecko')
    }

    const sparkline = thbPrices.map(([timestamp, price]) => ({
      time: timestamp,
      price: price
    }))
    const first = thbPrices[0][1]
    const last = thbPrices[thbPrices.length - 1][1]

    return NextResponse.json({
      thb: last,
      usd: usdPrices[usdPrices.length - 1][1],
      change24h: ((last - first) / first) * 100,
      sparkline: sparkline,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Error fetching BTC price:', error)
    return NextResponse.json(
      { error: 'Failed to fetch BTC data' },
      { status: 500 }
    )
  }
}
