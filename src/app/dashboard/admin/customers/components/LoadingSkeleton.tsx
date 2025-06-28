'use client'

import { Card, CardContent } from '@/components/ui/Card'

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-muted rounded animate-pulse w-32" />
                <div className="h-4 bg-muted rounded animate-pulse w-48" />
              </div>
              <div className="h-8 bg-muted rounded animate-pulse w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 