import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://mempool.space/api/blocks/tip/height', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error('Failed to fetch block height')
    }

    const currentHeight = await response.json()
    
    // Halving happens every 210,000 blocks
    // Next milestones: 840,000 (2024), 1,050,000 (2028), 1,260,000 (2032)
    const nextHalvingBlock = Math.ceil(currentHeight / 210000) * 210000
    const blocksRemaining = nextHalvingBlock - currentHeight
    
    // Average block time is 10 minutes
    const minutesRemaining = blocksRemaining * 10
    const daysRemaining = Math.floor(minutesRemaining / (60 * 24))
    
    return NextResponse.json({
      currentHeight,
      nextHalvingBlock,
      blocksRemaining,
      daysRemaining,
      estimatedDate: new Date(Date.now() + minutesRemaining * 60 * 1000).toISOString(),
    })
  } catch (error) {
    console.error('Error fetching Halving data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch network data' },
      { status: 500 }
    )
  }
}
