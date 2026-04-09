import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=1', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Fear & Greed Index')
    }

    const data = await response.json()
    
    return NextResponse.json({
      value: parseInt(data.data[0].value),
      classification: data.data[0].value_classification,
      timestamp: data.data[0].timestamp,
    })
  } catch (error) {
    console.error('Error fetching F&G Index:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market sentiment' },
      { status: 500 }
    )
  }
}
