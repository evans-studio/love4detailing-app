'use client'

import React, { useState } from 'react'
import { content } from '@/lib/content'
import { formatDate } from '@/lib/utils/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormSection } from '@/components/ui/FormSection'
import { InputGroup } from '@/components/ui/InputGroup'

interface ProfileSectionProps {
  userId: string
  userProfile?: {
    id: string
    fullName: string
    email: string
    phone?: string
    address?: string
    postcode?: string
    loyaltyPoints: number
    tier: string
    createdAt: string
  }
}

interface ProfileFormData {
  fullName: string
  email: string
  phone: string
  address: string
  postcode: string
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  userId,
  userProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: userProfile?.fullName || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    postcode: userProfile?.postcode || '',
  })

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // TODO: Implement actual API call to update profile
      console.log('Updating profile:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      fullName: userProfile?.fullName || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || '',
      postcode: userProfile?.postcode || '',
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            {content.pages.dashboard.profile.title}
          </h2>
          <p className="text-muted-foreground">
            {content.pages.dashboard.profile.subtitle}
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {/* Account Overview */}
      <Card className="bg-gradient-to-r from-[var(--purple-50)] to-[var(--purple-100)] border-[var(--purple-200)]">
        <CardHeader>
          <CardTitle className="text-lg text-[var(--color-primary)] flex items-center gap-2">
            👤 Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Member Since</p>
              <p className="text-muted-foreground">
                {userProfile?.createdAt 
                  ? formatDate(new Date(userProfile.createdAt), 'long')
                  : 'Not available'
                }
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Loyalty Tier</p>
              <p className="text-[var(--color-primary)] font-semibold capitalize">
                {userProfile?.tier || 'Bronze'} Member
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Points Balance</p>
              <p className="text-[var(--color-success)] font-bold">
                {userProfile?.loyaltyPoints?.toLocaleString() || '0'} pts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Personal Information */}
              <FormSection
                title="Personal Information"
                description="Your basic contact details"
                variant="default"
              >
                <InputGroup layout="responsive" columns={2}>
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </InputGroup>
                
                <Input
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  helperText="We'll use this to contact you about your bookings"
                />
              </FormSection>

              {/* Address Information */}
              <FormSection
                title="Address Information"
                description="Your default service address"
                variant="default"
              >
                <div className="space-y-4">
                  <Input
                    label="Postcode"
                    placeholder="Enter your postcode"
                    value={formData.postcode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value.toUpperCase() }))}
                    helperText="Used to calculate service availability and travel fees"
                  />
                  
                  <Input
                    label="Full Address"
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    helperText="Include property number, street name, and any access instructions"
                  />
                </div>
              </FormSection>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isLoading}
                  loading={isLoading}
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="font-medium text-[var(--color-text)] mb-3">Personal Information</h4>
                <div className="bg-background/50 rounded-lg p-4 border">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">Full Name</p>
                      <p className="text-muted-foreground">
                        {userProfile?.fullName || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">Email</p>
                      <p className="text-muted-foreground">
                        {userProfile?.email || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">Phone</p>
                      <p className="text-muted-foreground">
                        {userProfile?.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h4 className="font-medium text-[var(--color-text)] mb-3">Address Information</h4>
                <div className="bg-background/50 rounded-lg p-4 border">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">Postcode</p>
                      <p className="text-muted-foreground">
                        {userProfile?.postcode || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">Address</p>
                      <p className="text-muted-foreground">
                        {userProfile?.address || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-xl">🔒</span>
              <span className="font-medium">Change Password</span>
              <span className="text-xs text-muted-foreground">Update your login password</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-xl">📧</span>
              <span className="font-medium">Email Preferences</span>
              <span className="text-xs text-muted-foreground">Manage notifications</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-xl">📱</span>
              <span className="font-medium">Download Data</span>
              <span className="text-xs text-muted-foreground">Export your information</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Legal */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Legal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border">
              <div>
                <p className="font-medium text-[var(--color-text)]">Privacy Policy</p>
                <p className="text-muted-foreground">How we handle your data</p>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border">
              <div>
                <p className="font-medium text-[var(--color-text)]">Terms of Service</p>
                <p className="text-muted-foreground">Our service agreement</p>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg border">
              <div>
                <p className="font-medium text-[var(--color-text)]">Delete Account</p>
                <p className="text-muted-foreground">Permanently remove your account</p>
              </div>
              <Button variant="ghost" size="sm" className="text-[var(--color-error)]">
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 