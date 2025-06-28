import type { Metadata } from 'next'
import { DashboardClient } from './DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard | Love4Detailing',
  description: 'View your bookings, rewards, and account information.',
}

export default async function DashboardPage() {
  return <DashboardClient />
} 