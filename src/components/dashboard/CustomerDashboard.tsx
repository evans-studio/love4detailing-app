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

interface CustomerDashboardProps {
  userId: string
  userProfile?: {
    id: string
    fullName: string
    email: string
    phone?: string
    address?: string
    postcode?: string
    loyaltyPoints: number
    tier: string
    createdAt: string
  }
  initialData?: {
    bookings?: any[]
    vehicles?: any[]
    rewards?: {
      points: number
      tier: string
      history: any[]
    }
  }
}

type DashboardTab = 'overview' | 'bookings' | 'rewards' | 'vehicles' | 'profile'

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
      icon: '🏠',
      description: 'Dashboard summary',
    },
    {
      id: 'bookings' as const,
      label: content.navigation.dashboard[0].label,
      icon: '📅',
      description: content.pages.dashboard.bookings.subtitle,
    },
    {
      id: 'rewards' as const,
      label: content.navigation.dashboard[3].label,
      icon: '⭐',
      description: content.pages.dashboard.rewards.subtitle,
    },
    {
      id: 'vehicles' as const,
      label: 'My Vehicles',
      icon: '🚗',
      description: content.pages.dashboard.profile.sections.vehicles.description,
    },
    {
      id: 'profile' as const,
      label: content.navigation.dashboard[1].label,
      icon: '👤',
      description: content.pages.dashboard.profile.subtitle,
    },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-[var(--purple-50)] to-[var(--purple-100)] border-[var(--purple-200)]">
        <CardHeader>
          <CardTitle className="text-2xl text-[var(--color-primary)]">
            {content.pages.dashboard.welcome.title}, {userProfile?.fullName?.split(' ')[0] || 'there'}! 👋
          </CardTitle>
          <p className="text-muted-foreground">
            {content.pages.dashboard.welcome.subtitle}
          </p>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--purple-100)] rounded-lg flex items-center justify-center">
                📅
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Total Bookings</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">
                  {initialData.bookings?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-success)]/10 rounded-lg flex items-center justify-center">
                ⭐
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Loyalty Points</p>
                <p className="text-2xl font-bold text-[var(--color-success)]">
                  {userProfile?.loyaltyPoints || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-info)]/10 rounded-lg flex items-center justify-center">
                🏆
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Current Tier</p>
                <p className="text-lg font-bold text-[var(--color-info)] capitalize">
                  {userProfile?.tier || 'Bronze'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-warning)]/10 rounded-lg flex items-center justify-center">
                🚗
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Saved Vehicles</p>
                <p className="text-2xl font-bold text-[var(--color-warning)]">
                  {initialData.vehicles?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              variant="outline"
              onClick={() => window.location.href = ROUTES.booking}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">📅</span>
              <span className="font-medium">Book New Service</span>
              <span className="text-xs text-muted-foreground">Schedule your next detail</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setActiveTab('bookings')}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">📋</span>
              <span className="font-medium">View Bookings</span>
              <span className="text-xs text-muted-foreground">Manage appointments</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setActiveTab('rewards')}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">🎁</span>
              <span className="font-medium">Redeem Rewards</span>
              <span className="text-xs text-muted-foreground">Use your points</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'bookings':
        return (
          <BookingsSection 
            userId={userId} 
            initialBookings={initialData.bookings} 
          />
        )
      case 'rewards':
        return (
          <RewardsSection 
            userId={userId} 
            userProfile={userProfile}
            initialRewards={initialData.rewards} 
          />
        )
      case 'vehicles':
        return (
          <VehicleSection 
            userId={userId} 
            initialVehicles={initialData.vehicles} 
          />
        )
      case 'profile':
        return (
          <ProfileSection 
            userId={userId} 
            userProfile={userProfile} 
          />
        )
      default:
        return renderOverview()
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Mobile Navigation */}
      <div className="block lg:hidden mb-6">
        <Card>
          <CardContent className="p-2">
            <div className="flex gap-1 overflow-x-auto">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className="flex-shrink-0 text-xs"
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Desktop Sidebar Navigation */}
        <div className="hidden lg:block lg:col-span-3">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${activeTab === item.id
                        ? 'bg-[var(--purple-50)] text-[var(--color-primary)] border-r-2 border-[var(--color-primary)]'
                        : 'text-muted-foreground hover:bg-muted hover:text-[var(--color-text)]'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs opacity-75">{item.description}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
                <span className="text-muted-foreground">Loading...</span>
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  )
} 