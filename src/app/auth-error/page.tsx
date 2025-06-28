import type { Metadata } from 'next'
import { AuthErrorClient } from './AuthErrorClient'

export const metadata: Metadata = {
  title: 'Authentication Error | Love4Detailing',
  description: 'There was a problem authenticating your account.',
}

export default async function AuthErrorPage() {
  return <AuthErrorClient />
} 