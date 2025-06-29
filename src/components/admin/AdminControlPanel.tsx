"use client"

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { Settings, Clock, Users, DollarSign, Shield, RefreshCw } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Search, User } from 'lucide-react'
import { BookingStatus } from '@/lib/enums'

type NumericSetting = 
  | 'max_daily_bookings'
  | 'booking_advance_days'
  | 'loyalty_points_rate'
  | 'cancellation_window_hours'
  | 'loyalty_points_per_pound'
  | 'points_redemption_rate'
  | 'welcome_bonus_points'
  | 'referral_bonus_points'

type BooleanSetting = 'loyalty_program_enabled'

type SettingKey = NumericSetting | BooleanSetting

interface AdminSetting {
  id: string
  setting_key: SettingKey
  setting_value: number | boolean
  description: string
  updated_at: string
  updated_by?: string
}

interface WorkingHour {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  max_bookings_per_slot: number
  slot_duration_minutes: number
  is_active: boolean
}

interface BusinessStats {
  totalRevenue: number
  totalBookings: number
  totalCustomers: number
  monthlyRevenue: number
  averageBookingValue: number
  todayBookings: number
}

interface Booking {
  total_price: number
  status: BookingStatus
  created_at: string
  user_id: string
}

export default function AdminControlPanel() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [settings, setSettings] = useState<AdminSetting[]>([])
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([])
  const [businessStats, setBusinessStats] = useState<BusinessStats>({
    totalRevenue: 0,
    totalBookings: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    averageBookingValue: 0,
    todayBookings: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const fetchAdminData = useCallback(async () => {
    try {
      // Fetch admin settings
      const { data: settingsData } = await supabase
        .from('admin_settings')
        .select('*')
        .order('setting_key')

      // Fetch working hours
      const { data: hoursData, error: hoursError } = await supabase
        .from('working_hours')
        .select('*')
        .order('day_of_week')

      console.log('Working hours data:', hoursData)
      console.log('Working hours error:', hoursError)

      // Fetch business stats
      const { data: bookings } = await supabase
        .from('bookings')
        .select('total_price, status, created_at, user_id')

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')

      // Calculate stats
      const completedBookings = (bookings as Booking[] || []).filter(b => b.status === 'completed')
      const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
      const totalBookings = completedBookings.length
      const totalCustomers = profiles?.length || 0

      // Monthly revenue (current month)
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyBookings = completedBookings.filter(b => {
        const bookingDate = new Date(b.created_at)
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
      })
      const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)

      // Today's bookings
      const today = new Date().toDateString()
      const todayBookings = (bookings as Booking[] || []).filter(b => 
        new Date(b.created_at).toDateString() === today
      ).length || 0

      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

      setSettings(settingsData || [])
      setWorkingHours(hoursData || [])
      setBusinessStats({
        totalRevenue,
        totalBookings,
        totalCustomers,
        monthlyRevenue,
        averageBookingValue,
        todayBookings
      })

    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (user) {
      fetchAdminData()
    }
  }, [user, fetchAdminData])

  async function updateSetting(key: SettingKey, value: number | boolean) {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Setting updated successfully"
      })

      // Refresh settings
      fetchAdminData()

    } catch (error) {
      console.error('Error updating setting:', error)
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function updateWorkingHours(dayOfWeek: number, updates: Partial<WorkingHour>) {
    setIsSaving(true)
    try {
      // Ensure we have all required fields for upsert
      const workingHourData: Omit<WorkingHour, 'id'> = {
        day_of_week: dayOfWeek,
        start_time: updates.start_time || '10:00',
        end_time: updates.end_time || '17:00',
        is_active: typeof updates.is_active === 'boolean' ? updates.is_active : true,
        slot_duration_minutes: updates.slot_duration_minutes || 90,
        max_bookings_per_slot: updates.max_bookings_per_slot || 1
      }

      const { error } = await supabase
        .from('working_hours')
        .upsert(workingHourData, {
          onConflict: 'day_of_week'
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Working hours updated successfully"
      })

      // Refresh working hours
      fetchAdminData()

    } catch (error) {
      console.error('Error updating working hours:', error)
      toast({
        title: "Error",
        description: "Failed to update working hours",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getNumericSetting = (key: NumericSetting): number => {
    const setting = settings.find(s => s.setting_key === key)
    return (setting?.setting_value as number) || 0
  }

  const getBooleanSetting = (key: BooleanSetting): boolean => {
    const setting = settings.find(s => s.setting_key === key)
    return (setting?.setting_value as boolean) || true
  }

  const getWorkingHour = (dayOfWeek: number): WorkingHour | undefined => {
    return workingHours.find(h => h.day_of_week === dayOfWeek)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* Business Stats Overview - Enhanced Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-full">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-green-700 dark:text-green-300 truncate">
                  £{businessStats.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-full">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Monthly Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-300 truncate">
                  £{businessStats.monthlyRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-full">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Total Customers</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {businessStats.totalCustomers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Admin Control Tabs with Fixed Z-Index */}
      <div className="relative z-0">
        <Tabs defaultValue="settings" className="space-y-4">
          <div className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
                <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Business </span>Settings
                </TabsTrigger>
                <TabsTrigger value="hours" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Working </span>Hours
                </TabsTrigger>
                <TabsTrigger value="loyalty" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-background">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Loyalty </span>System
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>

          <TabsContent value="settings" className="space-y-4 relative z-0">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Business Settings</CardTitle>
                <p className="text-sm text-muted-foreground">Configure your business operations and booking rules</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="max-daily-bookings" className="text-sm font-medium">Max Daily Bookings</Label>
                    <Input
                      id="max-daily-bookings"
                      type="number"
                      className="touch-target"
                      value={getNumericSetting('max_daily_bookings')}
                      onChange={(e) => updateSetting('max_daily_bookings', parseInt(e.target.value))}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booking-advance-days" className="text-sm font-medium">Booking Advance Days</Label>
                    <Input
                      id="booking-advance-days"
                      type="number"
                      className="touch-target"
                      value={getNumericSetting('booking_advance_days')}
                      onChange={(e) => updateSetting('booking_advance_days', parseInt(e.target.value))}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loyalty-points-rate" className="text-sm font-medium">Loyalty Points Rate (%)</Label>
                    <Input
                      id="loyalty-points-rate"
                      type="number"
                      className="touch-target"
                      value={getNumericSetting('loyalty_points_rate')}
                      onChange={(e) => updateSetting('loyalty_points_rate', parseInt(e.target.value))}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancellation-window" className="text-sm font-medium">Cancellation Window (hours)</Label>
                    <Input
                      id="cancellation-window"
                      type="number"
                      className="touch-target"
                      value={getNumericSetting('cancellation_window_hours')}
                      onChange={(e) => updateSetting('cancellation_window_hours', parseInt(e.target.value))}
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last updated: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Auto-saved
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="space-y-4 relative z-0">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Working Hours Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure your business hours. These will determine available booking slots.
                </p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {/* Only show Monday to Friday (index 1-5) */}
                    {dayNames.slice(1, 6).map((dayName, arrayIndex) => {
                      const dayIndex = arrayIndex + 1 // Monday = 1, Tuesday = 2, etc.
                      const workingHour = getWorkingHour(dayIndex)
                      
                      // Use existing data or defaults
                      const currentData = workingHour || {
                        day_of_week: dayIndex,
                        start_time: '10:00',
                        end_time: '17:00',
                        is_active: true,
                        slot_duration_minutes: 90,
                        max_bookings_per_slot: 1
                      }
                      
                      return (
                        <Card key={dayIndex} className="border border-muted">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <Switch
                                  checked={currentData.is_active}
                                  onCheckedChange={(checked) => 
                                    updateWorkingHours(dayIndex, { is_active: checked })
                                  }
                                  disabled={isSaving}
                                />
                                <div>
                                  <h4 className="font-medium text-sm sm:text-base">{dayName}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {currentData.is_active ? 'Open' : 'Closed'}
                                  </p>
                                </div>
                              </div>
                              
                              {currentData.is_active && (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="time"
                                      value={currentData.start_time}
                                      onChange={(e) => 
                                        updateWorkingHours(dayIndex, { start_time: e.target.value })
                                      }
                                      disabled={isSaving}
                                      className="w-24 sm:w-28 text-xs sm:text-sm touch-target"
                                    />
                                    <span className="text-xs text-muted-foreground">to</span>
                                    <Input
                                      type="time"
                                      value={currentData.end_time}
                                      onChange={(e) => 
                                        updateWorkingHours(dayIndex, { end_time: e.target.value })
                                      }
                                      disabled={isSaving}
                                      className="w-24 sm:w-28 text-xs sm:text-sm touch-target"
                                    />
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={currentData.slot_duration_minutes.toString()}
                                      onValueChange={(value) => 
                                        updateWorkingHours(dayIndex, { slot_duration_minutes: parseInt(value) })
                                      }
                                      disabled={isSaving}
                                    >
                                      <SelectTrigger className="w-20 sm:w-24 text-xs sm:text-sm touch-target">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="60">60m</SelectItem>
                                        <SelectItem value="90">90m</SelectItem>
                                        <SelectItem value="120">120m</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-4 relative z-0">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Loyalty System</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage customer rewards and loyalty program settings
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="points-per-pound" className="text-sm font-medium">Points per £1 spent</Label>
                    <Input
                      id="points-per-pound"
                      type="number"
                      className="touch-target"
                      value={getNumericSetting('loyalty_points_per_pound')}
                      onChange={(e) => updateSetting('loyalty_points_per_pound', parseInt(e.target.value))}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="redemption-rate" className="text-sm font-medium">Points redemption rate</Label>
                    <Input
                      id="redemption-rate"
                      type="number"
                      className="touch-target"
                      placeholder="100 points = £1"
                      value={getNumericSetting('points_redemption_rate')}
                      onChange={(e) => updateSetting('points_redemption_rate', parseInt(e.target.value))}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="welcome-bonus" className="text-sm font-medium">Welcome bonus points</Label>
                    <Input
                      id="welcome-bonus"
                      type="number"
                      className="touch-target"
                      value={getNumericSetting('welcome_bonus_points')}
                      onChange={(e) => updateSetting('welcome_bonus_points', parseInt(e.target.value))}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referral-bonus" className="text-sm font-medium">Referral bonus points</Label>
                    <Input
                      id="referral-bonus"
                      type="number"
                      className="touch-target"
                      value={getNumericSetting('referral_bonus_points')}
                      onChange={(e) => updateSetting('referral_bonus_points', parseInt(e.target.value))}
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center space-x-2">
                  <Switch
                    id="loyalty-program"
                    checked={getBooleanSetting('loyalty_program_enabled')}
                    onCheckedChange={(checked) => updateSetting('loyalty_program_enabled', checked)}
                    disabled={isSaving}
                  />
                  <Label htmlFor="loyalty-program">Enable Loyalty Program</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 