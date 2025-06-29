'use client'

import React, { useState, useEffect } from 'react'
import { content } from '@/lib/content'
import { ROUTES } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BookingsSection } from './sections/BookingsSection'
import { RewardsSection } from './sections/RewardsSection'
import { VehicleSection } from './sections/VehicleSection'
import { ProfileSection } from './sections/ProfileSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProtectedRoute } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { Home, Calendar, Star, Car, User } from 'lucide-react'
import { DashboardTab } from '@/types'
import { OverviewSection } from './sections/OverviewSection'

interface CustomerDashboardProps {
  userId: string
  userProfile: any
  initialData?: any
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  userId,
  userProfile,
  initialData = {},
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [isLoading, setIsLoading] = useState(false)

  // Navigation items with icons and descriptions
  const navigationItems = [
    {
      id: 'overview' as const,
      label: 'Overview',
      Icon: Home,
      description: 'Dashboard summary',
    },
    {
      id: 'bookings' as const,
      label: 'Bookings',
      Icon: Calendar,
      description: 'View and manage your appointments',
    },
    {
      id: 'rewards' as const,
      label: 'Rewards',
      Icon: Star,
      description: 'View your rewards and points',
    },
    {
      id: 'vehicles' as const,
      label: 'My Vehicles',
      Icon: Car,
      description: 'Manage your saved vehicles',
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      Icon: User,
      description: 'Update your profile information',
    },
  ]

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DashboardTab)}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {navigationItems.map(({ id, label, Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-8">
          <TabsContent value="overview">
            <OverviewSection userId={userId} initialData={initialData} />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsSection userId={userId} initialData={initialData} />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardsSection userId={userId} initialData={initialData} />
          </TabsContent>

          <TabsContent value="vehicles">
            <VehicleSection userId={userId} initialData={initialData} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSection userId={userId} userProfile={userProfile} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
} 