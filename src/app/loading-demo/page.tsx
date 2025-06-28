import type { Metadata } from 'next'
import { LoadingDemoClient } from './LoadingDemoClient'

export const metadata: Metadata = {
  title: 'Loading Demo | Love4Detailing',
  description: 'Demo page for loading states and animations.',
}

export default async function LoadingDemoPage() {
  return <LoadingDemoClient />
} 