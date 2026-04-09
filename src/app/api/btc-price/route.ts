import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 1. Fetch current price and 24h change
    const priceRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=thb,usd&include_24hr_change=true',
      { next: { revalidate: 30 } }
    )

    // 2. Fetch 24h market chart (for sparkline)
    const chartRes = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=thb&days=1',
      { next: { revalidate: 60 } }
    )

    if (!priceRes.ok || !chartRes.ok) {
      throw new Error('Failed to fetch data from CoinGecko')
    }

    const priceData = await priceRes.json()
    const chartData = await chartRes.json()
    
    // Extract prices for sparkline (every 12th point to reduce data size if needed, 
    // but for 1 day there are ~288 points, which is fine for a chart)
    const sparkline = chartData.prices.map(([timestamp, price]: [number, number]) => ({
      time: timestamp,
      price: price
    }))

    return NextResponse.json({
      thb: priceData.bitcoin.thb,
      usd: priceData.bitcoin.usd,
      change24h: priceData.bitcoin.thb_24h_change,
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
