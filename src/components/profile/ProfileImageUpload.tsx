"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { Camera, Upload, X, Loader2 } from 'lucide-react'

interface ProfileImageUploadProps {
  currentImageUrl?: string
  onImageUpdate?: (url: string) => void
  size?: 'sm' | 'md' | 'lg'
  showUploadButton?: boolean
}

export default function ProfileImageUpload({ 
  currentImageUrl, 
  onImageUpdate, 
  size = 'md',
  showUploadButton = true 
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadImage(file)
  }

  const uploadImage = async (file: File) => {
    if (!user) return

    setIsUploading(true)
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/profile-${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast({
        title: "Profile image updated",
        description: "Your profile image has been successfully updated.",
      })

      onImageUpdate?.(publicUrl)
      setPreviewUrl(null)

    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = async () => {
    if (!user || !currentImageUrl) return

    setIsUploading(true)
    try {
      // Extract filename from URL
      const urlParts = currentImageUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `${user.id}/${fileName}`

      // Remove from storage
      await supabase.storage
        .from('profile-images')
        .remove([filePath])

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ profile_image_url: null })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: "Profile image removed",
        description: "Your profile image has been removed.",
      })

      onImageUpdate?.('')

    } catch (error) {
      console.error('Error removing image:', error)
      toast({
        title: "Remove failed",
        description: "Failed to remove image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const displayUrl = previewUrl || currentImageUrl

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={displayUrl} alt="Profile" />
          <AvatarFallback>
            {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
          </AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
        )}

        {showUploadButton && (
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera className="w-3 h-3" />
          </Button>
        )}
      </div>

      {showUploadButton && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {currentImageUrl ? 'Change' : 'Upload'}
          </Button>
          
          {currentImageUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={removeImage}
              disabled={isUploading}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
} 