"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { Settings, Clock, Users, DollarSign, Calendar, Shield, Save, RefreshCw } from 'lucide-react'

interface AdminSetting {
  id: string
  setting_key: string
  setting_value: any
  description: string
  updated_at: string
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

  useEffect(() => {
    if (user) {
      fetchAdminData()
    }
  }, [user])

  async function fetchAdminData() {
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
      const completedBookings = bookings?.filter(b => b.status === 'completed') || []
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
      const todayBookings = bookings?.filter(b => 
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
  }

  async function updateSetting(key: string, value: any) {
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
      const workingHourData = {
        day_of_week: dayOfWeek,
        start_time: updates.start_time || '10:00',
        end_time: updates.end_time || '17:00',
        is_active: updates.is_active !== undefined ? updates.is_active : true,
        slot_duration_minutes: updates.slot_duration_minutes || 90,
        max_bookings_per_slot: updates.max_bookings_per_slot || 1,
        ...updates // Override with any specific updates
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

  const getSetting = (key: string) => {
    const setting = settings.find(s => s.setting_key === key)
    return setting?.setting_value
  }

  const getWorkingHour = (dayOfWeek: number) => {
    return workingHours.find(wh => wh.day_of_week === dayOfWeek)
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
    <div className="space-y-6">
      {/* Business Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Total Revenue</p>
                <p className="text-2xl font-bold text-green-500">£{businessStats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Monthly Revenue</p>
                <p className="text-2xl font-bold text-blue-500">£{businessStats.monthlyRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Total Customers</p>
                <p className="text-2xl font-bold text-purple-500">{businessStats.totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Control Tabs */}
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Business Settings
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Working Hours
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Loyalty System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="max-daily-bookings">Max Daily Bookings</Label>
                  <Input
                    id="max-daily-bookings"
                    type="number"
                    value={getSetting('max_daily_bookings') || 5}
                    onChange={(e) => updateSetting('max_daily_bookings', parseInt(e.target.value))}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-advance-days">Booking Advance Days</Label>
                  <Input
                    id="booking-advance-days"
                    type="number"
                    value={getSetting('booking_advance_days') || 30}
                    onChange={(e) => updateSetting('booking_advance_days', parseInt(e.target.value))}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loyalty-points-rate">Loyalty Points Rate (%)</Label>
                  <Input
                    id="loyalty-points-rate"
                    type="number"
                    value={getSetting('loyalty_points_rate') || 10}
                    onChange={(e) => updateSetting('loyalty_points_rate', parseInt(e.target.value))}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellation-window">Cancellation Window (hours)</Label>
                  <Input
                    id="cancellation-window"
                    type="number"
                    value={getSetting('cancellation_window_hours') || 24}
                    onChange={(e) => updateSetting('cancellation_window_hours', parseInt(e.target.value))}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>
                <Badge variant="outline" className="text-green-600">
                  Auto-saved
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure your business hours. These will determine available booking slots.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Debug info */}
                <div className="text-xs text-muted-foreground mb-4">
                  Debug: Working hours loaded: {workingHours.length} entries
                </div>
                
                {/* Only show Monday to Friday (index 1-5) */}
                {dayNames.slice(1, 6).map((dayName, arrayIndex) => {
                  const dayIndex = arrayIndex + 1 // Monday = 1, Tuesday = 2, etc.
                  const workingHour = getWorkingHour(dayIndex)
                  console.log(`Day ${dayIndex} (${dayName}):`, workingHour)
                  
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
                    <motion.div
                      key={dayIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: arrayIndex * 0.1 }}
                      className="flex flex-col gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-24">
                            <Badge variant={currentData.is_active ? "default" : "secondary"}>
                              {dayName}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={currentData.is_active}
                              onCheckedChange={(checked: boolean) => 
                                updateWorkingHours(dayIndex, { 
                                  ...currentData,
                                  is_active: checked 
                                })
                              }
                              disabled={isSaving}
                            />
                            <span className="text-sm text-muted-foreground">Open</span>
                          </div>
                        </div>
                        
                        {currentData.is_active && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {currentData.start_time} - {currentData.end_time}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Always show time inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4 border-l-2 border-primary/20">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Start Time</Label>
                          <Input
                            type="time"
                            value={currentData.start_time}
                            onChange={(e) => 
                              updateWorkingHours(dayIndex, { 
                                ...currentData,
                                start_time: e.target.value 
                              })
                            }
                            className="w-full"
                            disabled={isSaving}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">End Time</Label>
                          <Input
                            type="time"
                            value={currentData.end_time}
                            onChange={(e) => 
                              updateWorkingHours(dayIndex, { 
                                ...currentData,
                                end_time: e.target.value 
                              })
                            }
                            className="w-full"
                            disabled={isSaving}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Slot Duration (minutes)</Label>
                          <Select
                            value={currentData.slot_duration_minutes?.toString() || "90"}
                            onValueChange={(value) => 
                              updateWorkingHours(dayIndex, { 
                                ...currentData,
                                slot_duration_minutes: parseInt(value) 
                              })
                            }
                            disabled={isSaving}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="60">60 minutes</SelectItem>
                              <SelectItem value="90">90 minutes</SelectItem>
                              <SelectItem value="120">120 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Show status */}
                      {!workingHour && (
                        <div className="text-xs text-platinum-silver bg-platinum-silver/10 px-2 py-1 rounded">
                          ⚠️ Using default values - will be saved when you make changes
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">How Time Slots Work</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Time slots are automatically generated based on your working hours and slot duration. 
                      For example: 10:00-17:00 with 90-minute slots creates slots at 10:00, 11:30, 13:00, 14:30, 16:00.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Current Loyalty Settings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Points Rate:</span>
                      <span className="font-medium">{getSetting('loyalty_points_rate') || 10}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Badges:</span>
                      <span className="font-medium">7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Loyalty Tiers:</span>
                      <span className="font-medium">4</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Manage Badges
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      View Customer Tiers
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Rewards
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Loyalty system is active and running
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 