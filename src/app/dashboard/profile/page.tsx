import type { Metadata } from 'next'
import { ProfileClient } from './ProfileClient'

export const metadata: Metadata = {
  title: 'Profile | Love4Detailing',
  description: 'Manage your profile settings and preferences.',
}

export default async function ProfilePage() {
  return <ProfileClient />
} 