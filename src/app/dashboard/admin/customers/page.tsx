// Server Component wrapper for proper metadata and static optimization
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Customers | Love4Detailing',
  description: 'Manage customer accounts and view detailed customer information.',
}

// Client Component for interactive admin customer management
import AdminCustomersClient from './AdminCustomersClient'

export default function AdminCustomersPage() {
  return <AdminCustomersClient />
} 