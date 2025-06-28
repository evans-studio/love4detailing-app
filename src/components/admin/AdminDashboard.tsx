'use client'

import React, { useState, useEffect } from 'react'
import { content } from '@/lib/content'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AdminOverviewSection } from './sections/AdminOverviewSection'
import { CustomerManagementSection } from './sections/CustomerManagementSection'
import { BookingManagementSection } from './sections/BookingManagementSection'
import { ServicesManagementSection } from './sections/ServicesManagementSection'
import { RewardsManagementSection } from './sections/RewardsManagementSection'

interface AdminDashboardProps {
  userId: string
  userRole: 'admin' | 'staff' | 'manager'
  adminProfile?: {
    id: string
    fullName: string
    email: string
    role: string
    permissions: string[]
    createdAt: string
  }
  initialData?: {
    stats?: {
      totalBookings: number
      todayBookings: number
      totalRevenue: number
      totalCustomers: number
      activeBookings: number
      pendingBookings: number
    }
    recentBookings?: any[]
    customers?: any[]
  }
}

type AdminTab = 'overview' | 'customers' | 'bookings' | 'services' | 'rewards'

// Permission definitions
const PERMISSIONS = {
  admin: ['all'],
  manager: ['view_customers', 'manage_bookings', 'manage_services', 'view_reports'],
  staff: ['view_bookings', 'update_bookings', 'view_customers'],
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userId,
  userRole,
  adminProfile,
  initialData = {},
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [isLoading, setIsLoading] = useState(false)

  // Check if user has permission for a specific action
  const hasPermission = (permission: string): boolean => {
    const userPermissions = PERMISSIONS[userRole] || []
    return userPermissions.includes('all') || userPermissions.includes(permission)
  }

  // Navigation items with permission checks
  const navigationItems = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: '📊',
      description: 'Dashboard summary',
      permission: 'view_overview',
    },
    {
      id: 'customers' as const,
      label: 'Customers',
      icon: '👥',
      description: 'Manage customer accounts',
      permission: 'view_customers',
    },
    {
      id: 'bookings' as const,
      label: 'Bookings',
      icon: '📅',
      description: 'Manage appointments',
      permission: 'view_bookings',
    },
    {
      id: 'services' as const,
      label: 'Services & Pricing',
      icon: '⚙️',
      description: 'Configure services',
      permission: 'manage_services',
    },
    {
      id: 'rewards' as const,
      label: 'Rewards Program',
      icon: '🎁',
      description: 'Manage loyalty program',
      permission: 'manage_rewards',
    },
  ].filter(item => hasPermission(item.permission))

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-[var(--purple-50)] to-[var(--purple-100)] border-[var(--purple-200)]">
        <CardHeader>
          <CardTitle className="text-2xl text-[var(--color-primary)]">
            Welcome back, {adminProfile?.fullName?.split(' ')[0] || 'Admin'}! 👋
          </CardTitle>
          <p className="text-muted-foreground">
            Here's what's happening with your business today
          </p>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-info)]/10 rounded-lg flex items-center justify-center">
                📅
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Today's Bookings</p>
                <p className="text-2xl font-bold text-[var(--color-info)]">
                  {initialData.stats?.todayBookings || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-success)]/10 rounded-lg flex items-center justify-center">
                💰
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Total Revenue</p>
                <p className="text-2xl font-bold text-[var(--color-success)]">
                  £{(initialData.stats?.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center">
                👥
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Total Customers</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">
                  {initialData.stats?.totalCustomers || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-warning)]/10 rounded-lg flex items-center justify-center">
                ⏳
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Pending Bookings</p>
                <p className="text-2xl font-bold text-[var(--color-warning)]">
                  {initialData.stats?.pendingBookings || 0}
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {hasPermission('manage_bookings') && (
              <Button
                variant="outline"
                onClick={() => setActiveTab('bookings')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">📅</span>
                <span className="font-medium">Manage Bookings</span>
                <span className="text-xs text-muted-foreground">View & update appointments</span>
              </Button>
            )}

            {hasPermission('view_customers') && (
              <Button
                variant="outline"
                onClick={() => setActiveTab('customers')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">👥</span>
                <span className="font-medium">Customer Management</span>
                <span className="text-xs text-muted-foreground">Search & manage accounts</span>
              </Button>
            )}

            {hasPermission('manage_services') && (
              <Button
                variant="outline"
                onClick={() => setActiveTab('services')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">⚙️</span>
                <span className="font-medium">Service Settings</span>
                <span className="text-xs text-muted-foreground">Configure pricing & services</span>
              </Button>
            )}

            {hasPermission('manage_rewards') && (
              <Button
                variant="outline"
                onClick={() => setActiveTab('rewards')}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">🎁</span>
                <span className="font-medium">Rewards Program</span>
                <span className="text-xs text-muted-foreground">Manage loyalty & points</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {initialData.recentBookings && initialData.recentBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {initialData.recentBookings.slice(0, 5).map((booking: any) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-3 bg-background/50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--purple-100)] rounded-full flex items-center justify-center">
                      📅
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text)]">
                        {booking.customer_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.service_name} • {booking.booking_date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--color-primary)]">
                      £{booking.total_amount}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                        : booking.status === 'pending'
                        ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'customers':
        return (
          <CustomerManagementSection 
            adminId={userId} 
            adminRole={userRole}
            initialCustomers={initialData.customers} 
          />
        )
      case 'bookings':
        return (
          <BookingManagementSection 
            adminId={userId} 
            adminRole={userRole}
            initialBookings={initialData.recentBookings} 
          />
        )
      case 'services':
        return (
          <ServicesManagementSection 
            adminId={userId} 
            adminRole={userRole}
          />
        )
      case 'rewards':
        return (
          <RewardsManagementSection 
            adminId={userId} 
            adminRole={userRole}
          />
        )
      default:
        return renderOverview()
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Role Badge */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your detailing business</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              userRole === 'admin' 
                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                : userRole === 'manager'
                ? 'bg-[var(--color-info)]/10 text-[var(--color-info)]'
                : 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]'
            }`}>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </div>
        </div>
      </div>

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
              <CardTitle className="text-lg">Navigation</CardTitle>
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