import type { Metadata } from 'next'
import { RewardsClient } from './RewardsClient'

export const metadata: Metadata = {
  title: 'Rewards | Love4Detailing',
  description: 'View your rewards points and redeem special offers.',
}

export default async function RewardsPage() {
  return <RewardsClient />
} 