"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { Upload, X, Loader2, Plus } from 'lucide-react'

interface VehiclePhotosUploadProps {
  currentPhotos?: string[]
  onPhotosUpdate?: (photos: string[]) => void
  maxPhotos?: number
}

export default function VehiclePhotosUpload({ 
  currentPhotos = [], 
  onPhotosUpdate,
  maxPhotos = 5 
}: VehiclePhotosUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    // Check if adding these files would exceed the limit
    if (currentPhotos.length + files.length > maxPhotos) {
      toast({
        title: "Too many photos",
        description: `You can only upload up to ${maxPhotos} vehicle photos.`,
        variant: "destructive",
      })
      return
    }

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select only image files.",
          variant: "destructive",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select images smaller than 5MB each.",
          variant: "destructive",
        })
        return
      }
    }

    // Upload files
    uploadPhotos(files)
  }

  const uploadPhotos = async (files: File[]) => {
    if (!user) return

    setIsUploading(true)
    const newPhotoUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadingIndex(i)
        const file = files[i]
        
        // Create unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/vehicle-${Date.now()}-${i}.${fileExt}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('vehicle-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('vehicle-photos')
          .getPublicUrl(fileName)

        newPhotoUrls.push(publicUrl)
      }

      // Update user profile with new photos
      const updatedPhotos = [...currentPhotos, ...newPhotoUrls]
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ vehicle_photos: updatedPhotos })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast({
        title: "Vehicle photos uploaded",
        description: `${newPhotoUrls.length} photo${newPhotoUrls.length > 1 ? 's' : ''} uploaded successfully.`,
      })

      onPhotosUpdate?.(updatedPhotos)

    } catch (error) {
      console.error('Error uploading photos:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload photos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadingIndex(null)
    }
  }

  const removePhoto = async (photoUrl: string, index: number) => {
    if (!user) return

    setIsUploading(true)
    try {
      // Extract filename from URL
      const urlParts = photoUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `${user.id}/${fileName}`

      // Remove from storage
      await supabase.storage
        .from('vehicle-photos')
        .remove([filePath])

      // Update profile
      const updatedPhotos = currentPhotos.filter((_, i) => i !== index)
      const { error } = await supabase
        .from('profiles')
        .update({ vehicle_photos: updatedPhotos })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: "Photo removed",
        description: "Vehicle photo has been removed.",
      })

      onPhotosUpdate?.(updatedPhotos)

    } catch (error) {
      console.error('Error removing photo:', error)
      toast({
        title: "Remove failed",
        description: "Failed to remove photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Vehicle Photos</h3>
        <span className="text-sm text-muted-foreground">
          {currentPhotos.length}/{maxPhotos} photos
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Existing Photos */}
        {currentPhotos.map((photoUrl, index) => (
          <Card key={index} className="relative group overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square relative">
                <Image
                  src={photoUrl}
                  alt={`Vehicle photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePhoto(photoUrl, index)}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {isUploading && uploadingIndex === index && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Upload Button */}
        {currentPhotos.length < maxPhotos && (
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full h-full aspect-square flex-col gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading && uploadingIndex === null ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-8 h-8" />
                    <span className="text-sm">Add Photo</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {currentPhotos.length < maxPhotos && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Photos
          </Button>
          <span className="text-sm text-muted-foreground flex items-center">
            Add up to {maxPhotos - currentPhotos.length} more photos
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
} 