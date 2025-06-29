import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Home, Calendar, Star, Car, Gift } from 'lucide-react'

interface OverviewSectionProps {
  userId: string
  initialData: {
    bookings?: any[]
    vehicles?: any[]
    rewards?: {
      points: number
      tier: string
      history: any[]
    }
  }
}

export function OverviewSection({ userId, initialData }: OverviewSectionProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-[var(--purple-50)] to-[var(--purple-100)] border-[var(--purple-200)]">
        <CardHeader>
          <CardTitle className="text-2xl text-[var(--color-primary)]">
            Welcome back! 👋
          </CardTitle>
          <p className="text-muted-foreground">
            Here's an overview of your account
          </p>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--purple-100)] rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
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
                <Star className="w-5 h-5 text-[var(--color-success)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Loyalty Points</p>
                <p className="text-2xl font-bold text-[var(--color-success)]">
                  {initialData.rewards?.points || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-info)]/10 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-[var(--color-info)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">Current Tier</p>
                <p className="text-lg font-bold text-[var(--color-info)] capitalize">
                  {initialData.rewards?.tier || 'Bronze'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-warning)]/10 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-[var(--color-warning)]" />
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
              onClick={() => window.location.href = '/booking'}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Calendar className="w-6 h-6" />
              <span className="font-medium">Book New Service</span>
              <span className="text-xs text-muted-foreground">Schedule your next detail</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard/bookings'}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Home className="w-6 h-6" />
              <span className="font-medium">View Bookings</span>
              <span className="text-xs text-muted-foreground">Manage appointments</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard/rewards'}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Gift className="w-6 h-6" />
              <span className="font-medium">Redeem Rewards</span>
              <span className="text-xs text-muted-foreground">Use your points</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 