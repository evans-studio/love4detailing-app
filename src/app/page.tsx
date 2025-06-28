// Server Component wrapper for proper metadata and static optimization
import type { Metadata } from 'next'
import { HomeClient } from './HomeClient'
import config from '@/config/config'

export const metadata: Metadata = {
  title: `${config.branding.appName} | Professional Mobile Car Detailing`,
  description: 'Premium mobile car detailing service that comes to you. Book your professional car detailing service today.',
}

export default async function HomePage() {
  return <HomeClient config={config} />
}
