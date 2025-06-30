'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useBookingStore } from '@/lib/stores/booking'
import { VehicleSize } from '@/lib/enums'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { toast } from '@/hooks/use-toast'

const vehicleSchema = z.object({
  registration: z.string()
    .min(1, 'Registration is required')
    .regex(/^[A-Z0-9 ]{4,8}$/, 'Invalid registration format'),
  size: z.nativeEnum(VehicleSize),
  images: z.array(z.string().url()).max(3, 'Maximum 3 images allowed')
})

type VehicleFormData = z.infer<typeof vehicleSchema>

export function VehicleDetailsStep() {
  const [isLookingUp, setIsLookingUp] = useState(false)
  const store = useBookingStore()
  
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registration: store.vehicle?.registration || '',
      size: store.vehicleSize,
      images: store.vehicleImages
    }
  })
  
  const handleLookup = async (registration: string) => {
    setIsLookingUp(true)
    
    try {
      const response = await fetch(`/api/vehicle/lookup?registration=${registration}`)
      
      if (!response.ok) {
        throw new Error('Vehicle lookup failed')
      }
      
      const data = await response.json()
      
      // Update form with vehicle data
      form.setValue('size', data.size)
      store.setVehicle({
        registration: data.registration,
        make: data.make,
        model: data.model,
        year: data.year
      })
      store.setVehicleSize(data.size)
      
    } catch (error) {
      toast({
        title: 'Lookup Failed',
        description: 'Could not find vehicle details. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLookingUp(false)
    }
  }
  
  const handleImageUpload = async (files: File[]) => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const { urls } = await response.json()
      form.setValue('images', urls)
      store.setVehicleImages(urls)
      
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Could not upload images. Please try again.',
        variant: 'destructive'
      })
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Registration Input */}
      <div>
        <Input
          placeholder="e.g. AB12 CDE"
          error={form.formState.errors.registration?.message}
          {...form.register('registration')}
        />
        <Button
          variant="outline"
          onClick={() => handleLookup(form.getValues('registration'))}
          disabled={isLookingUp || !form.getValues('registration')}
          className="mt-2"
        >
          {isLookingUp ? 'Looking up...' : 'Lookup Vehicle'}
        </Button>
      </div>
      
      {/* Vehicle Size */}
      <Select
        defaultValue={form.watch('size')}
        onValueChange={(value: VehicleSize) => {
          form.setValue('size', value)
          store.setVehicleSize(value)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select vehicle size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={VehicleSize.SMALL}>
            Small (e.g. Fiesta, Polo)
          </SelectItem>
          <SelectItem value={VehicleSize.MEDIUM}>
            Medium (e.g. Golf, Focus)
          </SelectItem>
          <SelectItem value={VehicleSize.LARGE}>
            Large (e.g. BMW X5, Range Rover)
          </SelectItem>
          <SelectItem value={VehicleSize.VAN}>
            Van (e.g. Transit, Sprinter)
          </SelectItem>
        </SelectContent>
      </Select>
      
      {/* Vehicle Images */}
      <ImageUpload
        value={form.watch('images')}
        onChange={handleImageUpload}
        maxFiles={3}
        accept="image/jpeg,image/png"
      />
      
      {/* Vehicle Details (if found) */}
      {store.vehicle && (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Vehicle Details</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex">
              <dt className="w-20 text-muted-foreground">Make:</dt>
              <dd>{store.vehicle.make}</dd>
            </div>
            <div className="flex">
              <dt className="w-20 text-muted-foreground">Model:</dt>
              <dd>{store.vehicle.model}</dd>
            </div>
            <div className="flex">
              <dt className="w-20 text-muted-foreground">Year:</dt>
              <dd>{store.vehicle.year}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
} 