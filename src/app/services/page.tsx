import type { Metadata } from 'next'
import { ServicesClient } from './ServicesClient'

export const metadata: Metadata = {
  title: 'Services | Love4Detailing',
  description: 'View our professional car detailing services.',
}

export default async function ServicesPage() {
  return <ServicesClient />
} 