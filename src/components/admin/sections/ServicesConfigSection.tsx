'use client'

import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SERVICES } from '@/lib/constants'

// Services configuration schema
const servicesConfigSchema = z.object({
  packages: z.record(z.object({
    name: z.string(),
    description: z.string(),
    duration: z.string(),
    basePrice: z.number().min(0),
    features: z.array(z.string()),
    availability: z.array(z.string()),
  })),
  vehicleSizes: z.record(z.object({
    label: z.string(),
    description: z.string(),
    multiplier: z.number().min(1),
  })),
  addOns: z.record(z.object({
    name: z.string(),
    description: z.string(),
    price: z.number().min(0),
    duration: z.string(),
    compatibility: z.array(z.string()),
  })),
})

type ServicesConfigValues = z.infer<typeof servicesConfigSchema>

interface ServicesConfigSectionProps {
  adminId: string
  adminRole: 'admin' | 'manager'
}

export const ServicesConfigSection: React.FC<ServicesConfigSectionProps> = ({
  adminId,
  adminRole,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  // Transform SERVICES data to match the schema
  const transformedPackages = Object.entries(SERVICES.packages).reduce((acc, [key, pkg]) => ({
    ...acc,
    [key]: {
      name: pkg.name,
      description: pkg.description,
      duration: pkg.duration,
      basePrice: 0, // Set default base price
      features: Array.isArray(pkg.features) ? pkg.features : [],
      availability: ['Monday-Friday', 'Weekends'], // Default availability
    },
  }), {} as ServicesConfigValues['packages'])

  const transformedVehicleSizes = Object.entries(SERVICES.vehicleSizes).reduce((acc, [key, size]) => ({
    ...acc,
    [key]: {
      label: size.label,
      description: size.description,
      multiplier: 1, // Set default multiplier
    },
  }), {} as ServicesConfigValues['vehicleSizes'])

  const transformedAddOns = Object.entries(SERVICES.addOns).reduce((acc, [key, addon]) => ({
    ...acc,
    [key]: {
      name: addon.name,
      description: addon.description,
      price: addon.price,
      duration: '30 minutes', // Default duration
      compatibility: ['all'], // Default compatibility
    },
  }), {} as ServicesConfigValues['addOns'])

  // Config form
  const configForm = useForm<ServicesConfigValues>({
    resolver: zodResolver(servicesConfigSchema),
    defaultValues: {
      packages: transformedPackages,
      vehicleSizes: transformedVehicleSizes,
      addOns: transformedAddOns,
    },
  })

  // Handle config update
  const handleConfigUpdate: SubmitHandler<ServicesConfigValues> = async (data) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/services/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update services configuration')
      
      // Show success message
    } catch (error) {
      console.error('Error updating services config:', error)
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Services Configuration</h2>
        <p className="text-muted-foreground">
          Configure service packages, vehicle sizes, and add-ons
        </p>
      </div>

      <form onSubmit={configForm.handleSubmit(handleConfigUpdate)}>
        <Tabs defaultValue="packages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="packages">Service Packages</TabsTrigger>
            <TabsTrigger value="vehicleSizes">Vehicle Sizes</TabsTrigger>
            <TabsTrigger value="addOns">Add-ons</TabsTrigger>
          </TabsList>

          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>Service Packages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(configForm.watch('packages')).map(([packageId, pkg]) => (
                  <div key={packageId} className="space-y-4 p-4 border rounded-lg">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Package Name</label>
                        <Input
                          {...configForm.register(`packages.${packageId}.name`)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Duration</label>
                        <Input
                          {...configForm.register(`packages.${packageId}.duration`)}
                          className="mt-1"
                          placeholder="e.g. 2 hours"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Base Price</label>
                        <Input
                          type="number"
                          {...configForm.register(`packages.${packageId}.basePrice`, { valueAsNumber: true })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        {...configForm.register(`packages.${packageId}.description`)}
                        className="mt-1 h-24"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Features (comma-separated)</label>
                      <Input
                        {...configForm.register(`packages.${packageId}.features`)}
                        className="mt-1"
                        placeholder="Interior vacuum, Exterior wash, etc."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Availability (comma-separated)</label>
                      <Input
                        {...configForm.register(`packages.${packageId}.availability`)}
                        className="mt-1"
                        placeholder="Monday-Friday, Weekends, etc."
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicleSizes">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Sizes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(configForm.watch('vehicleSizes')).map(([sizeId, size]) => (
                  <div key={sizeId} className="space-y-4 p-4 border rounded-lg">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Size Label</label>
                        <Input
                          {...configForm.register(`vehicleSizes.${sizeId}.label`)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Price Multiplier</label>
                        <Input
                          type="number"
                          step="0.1"
                          {...configForm.register(`vehicleSizes.${sizeId}.multiplier`, { valueAsNumber: true })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        {...configForm.register(`vehicleSizes.${sizeId}.description`)}
                        className="mt-1 h-24"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addOns">
            <Card>
              <CardHeader>
                <CardTitle>Service Add-ons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(configForm.watch('addOns')).map(([addOnId, addOn]) => (
                  <div key={addOnId} className="space-y-4 p-4 border rounded-lg">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Add-on Name</label>
                        <Input
                          {...configForm.register(`addOns.${addOnId}.name`)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Price</label>
                        <Input
                          type="number"
                          {...configForm.register(`addOns.${addOnId}.price`, { valueAsNumber: true })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Duration</label>
                        <Input
                          {...configForm.register(`addOns.${addOnId}.duration`)}
                          className="mt-1"
                          placeholder="e.g. 30 minutes"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        {...configForm.register(`addOns.${addOnId}.description`)}
                        className="mt-1 h-24"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Compatible Packages (comma-separated)</label>
                      <Input
                        {...configForm.register(`addOns.${addOnId}.compatibility`)}
                        className="mt-1"
                        placeholder="basic, premium, etc."
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
} 