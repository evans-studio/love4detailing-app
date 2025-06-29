'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  AdminOverviewSection,
  AnalyticsSection,
  BookingManagementSection,
  CalendarView,
  CustomerManagementSection,
  RewardsConfigSection,
  RewardsManagementSection,
  ServicesConfigSection,
  ServicesManagementSection
} from './sections'

type AdminTab = 'overview' | 'customers' | 'bookings' | 'services' | 'rewards'

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
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [isLoading] = useState(false)

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
      {/* Overview Section */}
      <AdminOverviewSection 
        _adminId={userId} 
        _adminRole={userRole}
      />

      {/* Analytics Section */}
      <AnalyticsSection 
        _adminId={userId} 
        _adminRole={userRole}
      />

      {/* Calendar View */}
      <CalendarView 
        _adminId={userId} 
        _adminRole={userRole}
        bookings={initialData?.recentBookings || []}
      />

      {/* Customer Management */}
      <CustomerManagementSection 
        _adminId={userId} 
        _adminRole={userRole}
        initialCustomers={initialData?.customers} 
      />

      {/* Services Management */}
      <ServicesManagementSection 
        _adminId={userId} 
        _adminRole={userRole}
      />

      {/* Services Configuration */}
      <ServicesConfigSection 
        _adminId={userId} 
        _adminRole={userRole}
      />

      {/* Rewards Management */}
      <RewardsManagementSection 
        _adminId={userId} 
        _adminRole={userRole}
      />

      {/* Rewards Configuration */}
      <RewardsConfigSection 
        _adminId={userId} 
        _adminRole={userRole}
      />
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'customers':
        return (
          <CustomerManagementSection 
            _adminId={userId} 
            _adminRole={userRole}
            initialCustomers={initialData?.customers} 
          />
        )
      case 'bookings':
        return (
          <BookingManagementSection 
            _adminId={userId} 
            _adminRole={userRole}
            initialBookings={initialData?.recentBookings} 
          />
        )
      case 'services':
        return (
          <ServicesManagementSection 
            _adminId={userId} 
            _adminRole={userRole}
          />
        )
      case 'rewards':
        return (
          <RewardsManagementSection 
            _adminId={userId} 
            _adminRole={userRole}
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