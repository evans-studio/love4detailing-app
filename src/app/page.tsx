// Server Component wrapper for proper metadata and static optimization
import type { Metadata } from 'next'
import { HomeClient } from './HomeClient'

export const metadata: Metadata = {
  title: 'Love4Detailing | Professional Mobile Car Detailing',
  description: 'Premium mobile car detailing service that comes to you. Book your professional car detailing service today.',
}

export default async function HomePage() {
  return <HomeClient />
}
