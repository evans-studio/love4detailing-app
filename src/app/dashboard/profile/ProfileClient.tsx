'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { useProtectedRoute } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { User, Settings, Bell, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { content } from '@/lib/content'

interface Profile {
  id: string
  full_name: string
  email: string
  phone: string
  avatar_url?: string
  notifications_enabled?: boolean
  marketing_emails?: boolean
  two_factor_enabled?: boolean
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
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

export function ProfileClient() {
  const { user, isLoading: authLoading } = useProtectedRoute()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const fetchProfile = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return

    try {
      setIsSaving(true)
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      setProfile({ ...profile, ...updates })
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading || isLoading) {
    return <LoadingSkeleton />
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No profile found</h3>
        <p className="text-muted-foreground">
          Please try refreshing the page
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{content.profile.settings.title}</h1>
          <p className="text-sm text-muted-foreground">{content.profile.settings.subtitle}</p>
        </div>
      </motion.div>

      {/* Profile Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">{content.profile.settings.tabs.general}</TabsTrigger>
            <TabsTrigger value="notifications">{content.profile.settings.tabs.notifications}</TabsTrigger>
            <TabsTrigger value="security">{content.profile.settings.tabs.security}</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>{content.profile.settings.sections.personalInfo.title}</CardTitle>
                <CardDescription>{content.profile.settings.sections.personalInfo.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback>{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">{content.profile.settings.sections.personalInfo.buttons.changePhoto}</Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">{content.profile.settings.sections.personalInfo.fields.fullName}</Label>
                    <Input
                      id="name"
                      value={profile.full_name}
                      onChange={(e) => handleUpdateProfile({ full_name: e.target.value })}
                      placeholder={`Enter your ${content.profile.settings.sections.personalInfo.fields.fullName.toLowerCase()}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{content.profile.settings.sections.personalInfo.fields.email}</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{content.profile.settings.sections.personalInfo.fields.phone}</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleUpdateProfile({ phone: e.target.value })}
                      placeholder={`Enter your ${content.profile.settings.sections.personalInfo.fields.phone.toLowerCase()}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your bookings
                      </p>
                    </div>
                    <Switch
                      checked={profile.notifications_enabled}
                      onCheckedChange={(checked) => handleUpdateProfile({ notifications_enabled: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about special offers and updates
                      </p>
                    </div>
                    <Switch
                      checked={profile.marketing_emails}
                      onCheckedChange={(checked) => handleUpdateProfile({ marketing_emails: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={profile.two_factor_enabled}
                      onCheckedChange={(checked) => handleUpdateProfile({ two_factor_enabled: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
} 