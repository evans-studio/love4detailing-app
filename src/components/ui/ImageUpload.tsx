'use client'

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './Button'
import { Upload, Trash } from 'lucide-react'

interface ImageUploadProps {
  value: string[]
  onChange: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  accept?: string
  disabled?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  maxFiles = 3,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept: _accept = 'image/*',
  disabled = false,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (value.length + acceptedFiles.length > maxFiles) {
      // Show error toast
      return
    }
    onChange(acceptedFiles)
  }, [onChange, value.length, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize,
    maxFiles: maxFiles - value.length,
    disabled: disabled || value.length >= maxFiles
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-[var(--color-primary)] bg-[var(--purple-50)]' : 'border-border'}
          ${disabled || value.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : 'hover:border-[var(--color-primary)]/50'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm">
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <>
                <p>Drag & drop vehicle photos here, or click to select files</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {`Maximum ${maxFiles} photos, up to ${Math.round(maxSize / 1024 / 1024)}MB each`}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Preview uploaded images */}
      {value.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((url, index) => (
            <div key={url} className="relative aspect-video rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Vehicle photo ${index + 1}`}
                className="object-cover w-full h-full"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => {
                  const _newValue = value.filter(v => v !== url)
                  onChange([]) // Hack: we're passing empty array since we only have URLs
                  // In a real app, you'd want to delete the file from storage here
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 