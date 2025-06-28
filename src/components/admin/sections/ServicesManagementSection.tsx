'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { SERVICES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils/formatters'

interface ServicesManagementSectionProps {
  adminId: string
  adminRole: 'admin' | 'staff' | 'manager'
}

// Service form schema
const serviceFormSchema = z.object({
  id: z.string().min(1, "Service ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
})

type ServiceFormValues = z.infer<typeof serviceFormSchema>

// Vehicle size form schema
const vehicleSizeFormSchema = z.object({
  id: z.string().min(1, "Size ID is required"),
  label: z.string().min(1, "Label is required"),
  description: z.string().min(1, "Description is required"),
  examples: z.array(z.string()).min(1, "At least one example is required"),
  pricing: z.object({
    essential: z.number().min(0),
    premium: z.number().min(0),
    ultimate: z.number().min(0),
  }),
})

type VehicleSizeFormValues = z.infer<typeof vehicleSizeFormSchema>

// Add-on form schema
const addOnFormSchema = z.object({
  id: z.string().min(1, "Add-on ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0),
})

type AddOnFormValues = z.infer<typeof addOnFormSchema>

export const ServicesManagementSection: React.FC<ServicesManagementSectionProps> = ({
  adminId,
  adminRole,
}) => {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedVehicleSize, setSelectedVehicleSize] = useState<string | null>(null)
  const [selectedAddOn, setSelectedAddOn] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Service form
  const serviceForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
  })

  // Vehicle size form
  const vehicleSizeForm = useForm<VehicleSizeFormValues>({
    resolver: zodResolver(vehicleSizeFormSchema),
  })

  // Add-on form
  const addOnForm = useForm<AddOnFormValues>({
    resolver: zodResolver(addOnFormSchema),
  })

  // Handle service update
  const handleServiceUpdate = async (data: ServiceFormValues) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/services/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update service')

      // Reset form and selection
      serviceForm.reset()
      setSelectedService(null)
    } catch (error) {
      console.error('Error updating service:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle vehicle size update
  const handleVehicleSizeUpdate = async (data: VehicleSizeFormValues) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/vehicle-sizes/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update vehicle size')

      // Reset form and selection
      vehicleSizeForm.reset()
      setSelectedVehicleSize(null)
    } catch (error) {
      console.error('Error updating vehicle size:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle add-on update
  const handleAddOnUpdate = async (data: AddOnFormValues) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/add-ons/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update add-on')

      // Reset form and selection
      addOnForm.reset()
      setSelectedAddOn(null)
    } catch (error) {
      console.error('Error updating add-on:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Services Management</h2>
        <p className="text-muted-foreground">
          Configure service packages, vehicle sizes, and add-ons
        </p>
      </div>

      {/* Service Packages */}
      <Card>
        <CardHeader>
          <CardTitle>Service Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(SERVICES.packages).map(([id, service]) => (
              <Sheet key={id}>
                <SheetTrigger asChild>
                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-[var(--color-text)]">
                            {service.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Duration: {service.duration}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {service.features.map((feature) => (
                              <Badge key={feature} variant="outline">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedService(id)
                            serviceForm.reset({
                              id,
                              name: service.name,
                              description: service.description,
                              duration: service.duration,
                              features: [...service.features],
                            })
                          }}
                        >
                          Edit Service
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit Service Package</SheetTitle>
                  </SheetHeader>
                  <form onSubmit={serviceForm.handleSubmit(handleServiceUpdate)} className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Name</label>
                      <Input
                        {...serviceForm.register('name')}
                        placeholder="Service name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Description</label>
                      <Textarea
                        {...serviceForm.register('description')}
                        placeholder="Service description"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Duration</label>
                      <Input
                        {...serviceForm.register('duration')}
                        placeholder="e.g., 2-3 hours"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Features</label>
                      <div className="space-y-2 mt-1">
                        {serviceForm.watch('features')?.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              {...serviceForm.register(`features.${index}`)}
                              placeholder="Feature description"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const features = serviceForm.watch('features')
                                serviceForm.setValue(
                                  'features',
                                  features.filter((_, i) => i !== index)
                                )
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const features = serviceForm.watch('features') || []
                            serviceForm.setValue('features', [...features, ''])
                          }}
                        >
                          Add Feature
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          serviceForm.reset()
                          setSelectedService(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(SERVICES.vehicleSizes).map(([id, size]) => (
              <Sheet key={id}>
                <SheetTrigger asChild>
                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-[var(--color-text)]">
                            {size.label}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {size.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {size.examples.map((example) => (
                              <Badge key={example} variant="outline">
                                {example}
                              </Badge>
                            ))}
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Essential</p>
                              <p className="font-medium">{formatCurrency(size.pricing.essential)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Premium</p>
                              <p className="font-medium">{formatCurrency(size.pricing.premium)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Ultimate</p>
                              <p className="font-medium">{formatCurrency(size.pricing.ultimate)}</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVehicleSize(id)
                            vehicleSizeForm.reset({
                              id,
                              label: size.label,
                              description: size.description,
                              examples: [...size.examples],
                              pricing: { ...size.pricing },
                            })
                          }}
                        >
                          Edit Size
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit Vehicle Size</SheetTitle>
                  </SheetHeader>
                  <form onSubmit={vehicleSizeForm.handleSubmit(handleVehicleSizeUpdate)} className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Label</label>
                      <Input
                        {...vehicleSizeForm.register('label')}
                        placeholder="Size label"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Description</label>
                      <Textarea
                        {...vehicleSizeForm.register('description')}
                        placeholder="Size description"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Examples</label>
                      <div className="space-y-2 mt-1">
                        {vehicleSizeForm.watch('examples')?.map((example, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              {...vehicleSizeForm.register(`examples.${index}`)}
                              placeholder="Vehicle example"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const examples = vehicleSizeForm.watch('examples')
                                vehicleSizeForm.setValue(
                                  'examples',
                                  examples.filter((_, i) => i !== index)
                                )
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const examples = vehicleSizeForm.watch('examples') || []
                            vehicleSizeForm.setValue('examples', [...examples, ''])
                          }}
                        >
                          Add Example
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Pricing</label>
                      <div className="grid grid-cols-3 gap-4 mt-1">
                        <div>
                          <label className="text-xs text-muted-foreground">Essential</label>
                          <Input
                            type="number"
                            {...vehicleSizeForm.register('pricing.essential', { valueAsNumber: true })}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Premium</label>
                          <Input
                            type="number"
                            {...vehicleSizeForm.register('pricing.premium', { valueAsNumber: true })}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Ultimate</label>
                          <Input
                            type="number"
                            {...vehicleSizeForm.register('pricing.ultimate', { valueAsNumber: true })}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          vehicleSizeForm.reset()
                          setSelectedVehicleSize(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add-ons */}
      <Card>
        <CardHeader>
          <CardTitle>Add-on Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(SERVICES.addOns).map(([id, addOn]) => (
              <Sheet key={id}>
                <SheetTrigger asChild>
                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-[var(--color-text)]">
                            {addOn.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {addOn.description}
                          </p>
                          <p className="text-sm font-medium text-[var(--color-primary)]">
                            {formatCurrency(addOn.price)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAddOn(id)
                            addOnForm.reset({
                              id,
                              name: addOn.name,
                              description: addOn.description,
                              price: addOn.price,
                            })
                          }}
                        >
                          Edit Add-on
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit Add-on Service</SheetTitle>
                  </SheetHeader>
                  <form onSubmit={addOnForm.handleSubmit(handleAddOnUpdate)} className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Name</label>
                      <Input
                        {...addOnForm.register('name')}
                        placeholder="Add-on name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Description</label>
                      <Textarea
                        {...addOnForm.register('description')}
                        placeholder="Add-on description"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Price</label>
                      <Input
                        type="number"
                        {...addOnForm.register('price', { valueAsNumber: true })}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          addOnForm.reset()
                          setSelectedAddOn(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 