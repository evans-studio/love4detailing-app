// Server Component wrapper for proper metadata and static optimization
import type { Metadata } from 'next'
import { HomeClient } from './HomeClient'
import { love4detailingConfig } from '@/config/clients/love4detailing'

export const metadata: Metadata = {
  title: `${love4detailingConfig.branding.appName} | Professional Mobile Car Detailing`,
  description: 'Premium mobile car detailing service that comes to you. Book your professional car detailing service today.',
}

export default async function HomePage() {
  return <HomeClient config={love4detailingConfig} />
}
