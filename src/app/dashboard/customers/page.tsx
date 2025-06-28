import type { Metadata } from 'next'
import { CustomersClient } from './CustomersClient'

export const metadata: Metadata = {
  title: 'Customers | Love4Detailing',
  description: 'View and manage your customer information.',
}

export default async function CustomersPage() {
  return <CustomersClient />
} 