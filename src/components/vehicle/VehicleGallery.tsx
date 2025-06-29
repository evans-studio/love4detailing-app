'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Camera, Upload, X, Plus, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { GalleryGridSkeleton, UploadProgressSkeleton } from '@/components/ui/skeletons'
import { EmptyState } from '@/components/ui/empty-state'
import { GALLERY_CONFIG } from '@/lib/types/vehicle'
import type { VehicleImage, UploadState, AllowedMimeType, UploadProgressEvent } from '@/lib/types/vehicle'
import { supabase } from '@/lib/supabase/client'

interface VehicleGalleryProps {
  vehicleId: string
  currentImages?: VehicleImage[]
  onImagesUpdate?: (images: VehicleImage[]) => void
  maxImages?: number
}

export function VehicleGallery({
  vehicleId,
  currentImages = [],
  onImagesUpdate,
  maxImages = GALLERY_CONFIG.maxFiles,
}: VehicleGalleryProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Validate file before upload
  const validateFile = (file: File): string | null => {
    if (!GALLERY_CONFIG.allowedTypes.includes(file.type as AllowedMimeType)) {
      return GALLERY_CONFIG.errorMessages.invalidType
    }
    if (file.size > GALLERY_CONFIG.maxFileSize) {
      return GALLERY_CONFIG.errorMessages.tooLarge
    }
    return null
  }

  // Upload file to Supabase
  const uploadFile = useCallback(async (file: File) => {
    const uploadId = Date.now().toString()
    
    setUploadStates(prev => ({
      ...prev,
      [uploadId]: { progress: 0, status: 'uploading' }
    }))

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${vehicleId}/${Date.now()}-${file.name}`

      // Upload to Supabase Storage with progress tracking
      const { error: uploadError, data } = await supabase.storage
        .from('vehicle-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(fileName)

      // Create new image object
      const newImage: VehicleImage = {
        id: uploadId,
        url: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        type: 'gallery'
      }

      // Update state
      const updatedImages = [...currentImages, newImage]
      onImagesUpdate?.(updatedImages)

      setUploadStates(prev => ({
        ...prev,
        [uploadId]: { progress: 100, status: 'success' }
      }))

      toast({
        title: "Image uploaded",
        description: "Vehicle photo has been uploaded successfully.",
      })

    } catch (error) {
      console.error('Upload error:', error)
      setUploadStates(prev => ({
        ...prev,
        [uploadId]: {
          progress: 0,
          status: 'error',
          error: GALLERY_CONFIG.errorMessages.uploadFailed
        }
      }))

      toast({
        title: "Upload failed",
        description: GALLERY_CONFIG.errorMessages.uploadFailed,
        variant: "destructive",
      })
    }
  }, [currentImages, onImagesUpdate, toast, vehicleId])

  // Handle file selection
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    // Check total file count
    if (currentImages.length + files.length > maxImages) {
      toast({
        title: "Too many files",
        description: GALLERY_CONFIG.errorMessages.tooMany,
        variant: "destructive",
      })
      return
    }

    // Validate and upload files
    for (const file of files) {
      const error = validateFile(file)
      if (error) {
        toast({
          title: "Invalid file",
          description: error,
          variant: "destructive",
        })
        continue
      }

      await uploadFile(file)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [currentImages.length, maxImages, toast, uploadFile])

  // Remove image
  const removeImage = async (image: VehicleImage) => {
    setIsLoading(true)
    try {
      // Extract filename from URL
      const urlParts = image.url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `${vehicleId}/${fileName}`

      // Remove from storage
      const { error } = await supabase.storage
        .from('vehicle-photos')
        .remove([filePath])

      if (error) throw error

      // Update state
      const updatedImages = currentImages.filter(img => img.id !== image.id)
      onImagesUpdate?.(updatedImages)

      toast({
        title: "Image removed",
        description: "Vehicle photo has been removed.",
      })

    } catch (error) {
      console.error('Remove error:', error)
      toast({
        title: "Remove failed",
        description: "Failed to remove photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  if (isLoading) {
    return <GalleryGridSkeleton count={currentImages.length || 3} />
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Vehicle Photos</h3>
        <span className="text-sm text-muted-foreground">
          {currentImages.length}/{maxImages} photos
        </span>
      </div>

      {/* Image Grid */}
      {currentImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {currentImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="relative group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <Image
                        src={image.url}
                        alt={image.fileName}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(image)}
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Upload Progress States */}
            {Object.entries(uploadStates).map(([id, state]) => (
              state.status === 'uploading' && (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Card className="relative">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${state.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(state.progress)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            ))}

            {/* Upload Button */}
            {currentImages.length < maxImages && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card
                  className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={openFileDialog}
                >
                  <CardContent className="p-0">
                    <div className="aspect-square flex flex-col items-center justify-center space-y-2">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Add Photo</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          icon={Camera}
          title="No photos yet"
          description="Add photos of your vehicle to help us provide better service"
          action={{
            label: "Add Photos",
            onClick: openFileDialog
          }}
        />
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={GALLERY_CONFIG.allowedTypes.join(',')}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button (when no images) */}
      {currentImages.length === 0 && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={openFileDialog}
            disabled={isLoading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Photos
          </Button>
          <span className="text-sm text-muted-foreground flex items-center">
            Add up to {maxImages} photos
          </span>
        </div>
      )}
    </div>
  )
} 