// Server Component wrapper for proper metadata and static optimization
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bookings | Love4Detailing',
  description: 'View and manage your car valeting bookings.',
}

// Client Component for interactive bookings features
import BookingsClient from './BookingsClient'

export default function BookingsPage() {
  return <BookingsClient />
} 