'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ANALYTICS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils/formatters'

type TimeframeKey = 'day' | 'week' | 'month' | 'year'

interface ServiceData {
  bookings: number
  revenue: number
  growth: number
}

interface RetentionData {
  repeatRate: number
  repeatCount: number
  averageVisits: number
  churnRate: number
}

interface RewardsData {
  pointsEarned: number
  pointsRedeemed: number
  activeMembers: number
  redemptionValue: number
}

interface Analytics {
  revenue: Record<TimeframeKey, number>
  revenueGrowth: Record<TimeframeKey, number>
  bookings: Record<TimeframeKey, number>
  bookingsGrowth: Record<TimeframeKey, number>
  averageOrderValue: Record<TimeframeKey, number>
  aovGrowth: Record<TimeframeKey, number>
  satisfaction: Record<TimeframeKey, number>
  reviews: Record<TimeframeKey, number>
  services: Record<TimeframeKey, Record<string, ServiceData>>
  retention: Record<TimeframeKey, RetentionData>
  rewards: Record<TimeframeKey, RewardsData>
}

interface AnalyticsSectionProps {
  _adminId: string
  _adminRole: 'admin' | 'staff' | 'manager'
}

export function AnalyticsSection({
  _adminId,
  _adminRole,
}: AnalyticsSectionProps) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>('month')
  const analytics = ANALYTICS as Analytics

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Analytics & Insights</h2>
          <p className="text-muted-foreground">
            Monitor business performance and trends
          </p>
        </div>

        <Select
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as TimeframeKey)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-text)]">
              {formatCurrency(analytics.revenue[timeframe])}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +{analytics.revenueGrowth[timeframe]}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-text)]">
              {analytics.bookings[timeframe]}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +{analytics.bookingsGrowth[timeframe]}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-text)]">
              {formatCurrency(analytics.averageOrderValue[timeframe])}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +{analytics.aovGrowth[timeframe]}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-text)]">
              {analytics.satisfaction[timeframe]}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {analytics.reviews[timeframe]} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.services[timeframe]).map(([service, data]) => (
              <div key={service} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-[var(--color-text)]">
                    {service}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.bookings} bookings
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {formatCurrency(data.revenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {data.growth}% growth
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-[var(--color-text)]">
                    Repeat Customers
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analytics.retention[timeframe].repeatRate}% of total
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {analytics.retention[timeframe].repeatCount} customers
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-[var(--color-text)]">
                    Average Visits
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Per customer
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {analytics.retention[timeframe].averageVisits} visits
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-[var(--color-text)]">
                    Churn Rate
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Lost customers
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {analytics.retention[timeframe].churnRate}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rewards Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-[var(--color-text)]">
                    Points Earned
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total points
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {analytics.rewards[timeframe].pointsEarned} points
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-[var(--color-text)]">
                    Points Redeemed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Used for rewards
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {analytics.rewards[timeframe].pointsRedeemed} points
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-[var(--color-text)]">
                    Active Members
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Program participants
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {analytics.rewards[timeframe].activeMembers} members
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-[var(--color-text)]">
                    Redemption Value
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total value redeemed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {formatCurrency(analytics.rewards[timeframe].redemptionValue)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 