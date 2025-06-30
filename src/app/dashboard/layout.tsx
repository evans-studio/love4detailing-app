"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import Container from '@/components/ui/Container'
import { Home, Calendar, User, Gift, Users } from 'lucide-react'

const sidebarItems = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: <Home className="w-5 h-5" />,
  },
  {
    href: '/dashboard/bookings',
    label: 'Bookings',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: <User className="w-5 h-5" />,
  },
  {
    href: '/dashboard/rewards',
    label: 'Rewards',
    icon: <Gift className="w-5 h-5" />,
  },
  {
    href: '/dashboard/customers',
    label: 'Customers',
    icon: <Users className="w-5 h-5" />,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  // Filter out customer-only routes for non-admin users
  const filteredItems = profile?.role === 'admin'
    ? sidebarItems
    : sidebarItems.filter(item => item.href !== '/dashboard/customers')

  return (
    <div className="flex min-h-screen">
      <Sidebar items={filteredItems} />
      <main className="flex-1 bg-background">
        <Container className="py-8">
          {children}
        </Container>
      </main>
    </div>
  )
} 