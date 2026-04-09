import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BTC Tracker',
    short_name: 'BTC Tracker',
    description: 'Track your Bitcoin purchases with real-time prices and average cost tracking',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#f7931a',
    icons: [
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
