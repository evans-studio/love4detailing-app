// Server Component wrapper for proper metadata and static optimization
import type { Metadata } from 'next'
import { FAQClient } from './FAQClient'

export const metadata: Metadata = {
  title: 'FAQ | Love4Detailing',
  description: 'Frequently asked questions about our services.',
}

export default async function FAQPage() {
  return <FAQClient />
} 