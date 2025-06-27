"use client"

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useProtectedRoute } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import ProfileImageUpload from '@/components/profile/ProfileImageUpload'
import VehiclePhotosUpload from '@/components/profile/VehiclePhotosUpload'
import { User, Car, Save, Loader2, Camera } from 'lucide-react'
import { CardDescription } from '@/components/ui/Card'

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone?: string
  profile_image_url?: string
  vehicle_photos: string[]
  vehicle_make?: string
  vehicle_model?: string
  vehicle_year?: number
  vehicle_color?: string
}

const LoadingSkeleton = () => (
  <div className="space-y-8">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useProtectedRoute()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const fetchProfile = useCallback(async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setProfile(profile)
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
  }, [toast, user?.id])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user, fetchProfile])

  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      setProfile({ ...profile, ...updates })
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleVehicleInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile) return

    const formData = new FormData(e.currentTarget)
    const updates = {
      vehicle_make: formData.get('vehicle_make') as string,
      vehicle_model: formData.get('vehicle_model') as string,
      vehicle_year: parseInt(formData.get('vehicle_year') as string) || undefined,
      vehicle_color: formData.get('vehicle_color') as string,
      phone: formData.get('phone') as string,
    }

    await handleProfileUpdate(updates)
  }

  if (authLoading || isLoading) {
    return <LoadingSkeleton />
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile information and vehicle details
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="glass" className="backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5 text-purple-400" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div>
                <Label className="text-sm font-medium mb-4 block text-purple-100">
                  Profile Picture
                </Label>
                <ProfileImageUpload
                  currentImageUrl={profile.profile_image_url}
                  onImageUpdate={(url) => handleProfileUpdate({ profile_image_url: url })}
                  size="lg"
                />
              </div>

              <Separator className="bg-purple-800/30" />

              {/* Basic Info */}
              <form onSubmit={handleVehicleInfoSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="full_name" className="text-purple-100">
                      Full Name
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      defaultValue={profile.full_name}
                      disabled
                      className="bg-purple-900/50 border-purple-700 text-purple-100"
                    />
                    <p className="text-xs text-purple-300 mt-1">
                      Contact support to change your name
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-purple-100">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={profile.email}
                      disabled
                      className="bg-purple-900/50 border-purple-700 text-purple-100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone" className="text-purple-100">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={profile.phone}
                      placeholder="+44 7700 900000"
                      className="bg-purple-950/30 border-purple-700 text-purple-100 placeholder:text-purple-400"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicle Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card variant="glass" className="backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Car className="h-5 w-5 text-purple-400" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVehicleInfoSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="vehicle_make" className="text-purple-100">
                      Make
                    </Label>
                    <Input
                      id="vehicle_make"
                      name="vehicle_make"
                      placeholder="e.g., BMW, Mercedes"
                      defaultValue={profile.vehicle_make}
                      className="bg-purple-950/30 border-purple-700 text-purple-100 placeholder:text-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle_model" className="text-purple-100">
                      Model
                    </Label>
                    <Input
                      id="vehicle_model"
                      name="vehicle_model"
                      placeholder="e.g., 3 Series, C-Class"
                      defaultValue={profile.vehicle_model}
                      className="bg-purple-950/30 border-purple-700 text-purple-100 placeholder:text-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle_year" className="text-purple-100">
                      Year
                    </Label>
                    <Input
                      id="vehicle_year"
                      name="vehicle_year"
                      type="number"
                      placeholder="e.g., 2020"
                      defaultValue={profile.vehicle_year}
                      className="bg-purple-950/30 border-purple-700 text-purple-100 placeholder:text-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle_color" className="text-purple-100">
                      Color
                    </Label>
                    <Input
                      id="vehicle_color"
                      name="vehicle_color"
                      placeholder="e.g., Black, White"
                      defaultValue={profile.vehicle_color}
                      className="bg-purple-950/30 border-purple-700 text-purple-100 placeholder:text-purple-400"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Vehicle Info...
                    </>
                  ) : (
                    <>
                      <Car className="mr-2 h-4 w-4" />
                      Save Vehicle Info
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicle Photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card variant="glass" className="backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Camera className="h-5 w-5 text-purple-400" />
                Vehicle Photos
              </CardTitle>
              <CardDescription>
                Upload photos of your vehicle to help us provide better service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VehiclePhotosUpload
                currentPhotos={profile.vehicle_photos || []}
                onPhotosUpdate={(urls) => handleProfileUpdate({ vehicle_photos: urls })}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 