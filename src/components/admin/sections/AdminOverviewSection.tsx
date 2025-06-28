'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface AdminOverviewSectionProps {
  adminId: string
  adminRole: 'admin' | 'staff' | 'manager'
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({
  adminId,
  adminRole,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Business summary and key metrics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Overview features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 