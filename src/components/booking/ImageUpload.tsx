"use client"

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid'
import { X, Upload, Camera, Image as ImageIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

interface ImageUploadProps {
  form: any // Replace with your form type
  name: string
}

const MAX_FILES = 3
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface PreviewFile extends File {
  preview: string
}

export function ImageUpload({ form, name }: ImageUploadProps) {
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'File type must be JPEG, PNG, or WebP'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB'
    }
    return null
  }

  const processFiles = useCallback((files: File[]) => {
    const currentCount = previewFiles.length
    const remainingSlots = MAX_FILES - currentCount

    if (files.length > remainingSlots) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${MAX_FILES} images (${remainingSlots} remaining)`,
        variant: "destructive"
      })
      return
    }

    const validFiles: PreviewFile[] = []
    const errors: string[] = []

    for (const file of files) {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
        continue
      }

      const preview = URL.createObjectURL(file)
      validFiles.push(Object.assign(file, { preview }))
    }

    if (errors.length > 0) {
      toast({
        title: "Invalid files",
        description: errors.join('\n'),
        variant: "destructive"
      })
    }

    if (validFiles.length > 0) {
      setPreviewFiles(prev => [...prev, ...validFiles])
      
      // Update form value with new files
      const currentUrls = form.getValues(name) || []
      form.setValue(name, [...currentUrls, ...validFiles], { shouldValidate: true })

      toast({
        title: "Images added",
        description: `${validFiles.length} image(s) added successfully`,
      })
    }
  }, [form, name, previewFiles.length, toast])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [processFiles])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }, [processFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = useCallback((index: number) => {
    const fileToRemove = previewFiles[index]
    URL.revokeObjectURL(fileToRemove.preview)
    
    setPreviewFiles(prev => prev.filter((_, i) => i !== index))
    const currentFiles = form.getValues(name) || []
    form.setValue(name, currentFiles.filter((_: any, i: number) => i !== index), { shouldValidate: true })

    toast({
      title: "Image removed",
      description: "Image has been removed from your upload",
    })
  }, [form, name, previewFiles, toast])

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `bookings/${fileName}`

    const { data, error } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath)

    return publicUrl
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="space-y-4">
            {/* Upload Area */}
            <Card 
              className={`border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-primary/50 ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : previewFiles.length >= MAX_FILES 
                    ? 'border-muted-foreground/30 bg-muted/30' 
                    : 'border-muted-foreground/30 hover:bg-muted/30'
              }`}
              onClick={previewFiles.length < MAX_FILES ? openFileDialog : undefined}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    isDragOver 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {isDragOver ? (
                      <Upload className="w-8 h-8" />
                    ) : (
                      <Camera className="w-8 h-8" />
                    )}
                  </div>
                  
                  {previewFiles.length >= MAX_FILES ? (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-muted-foreground">Maximum files reached</h3>
                      <p className="text-sm text-muted-foreground">
                        You've uploaded the maximum of {MAX_FILES} images
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-foreground">
                        {isDragOver ? 'Drop your images here' : 'Upload vehicle photos'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Drag & drop or click to browse • Up to {MAX_FILES} images • Max 5MB each
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports JPEG, PNG, WebP formats
                      </p>
                    </div>
                  )}

                  {previewFiles.length < MAX_FILES && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        openFileDialog()
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Preview Grid */}
            {previewFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {previewFiles.length} of {MAX_FILES} images
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {previewFiles.map((file, index) => (
                      <motion.div
                        key={file.preview}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
                          <div className="aspect-square relative">
                            <Image
                              src={file.preview}
                              alt={`Vehicle image ${index + 1}`}
                              width={120}
                              height={80}
                              className="rounded-lg object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            
                            {/* Remove Button */}
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* File Info */}
                          <CardContent className="p-3">
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-foreground truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(1)} MB
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 