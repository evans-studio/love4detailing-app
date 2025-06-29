'use client'

import React, { useState } from 'react'
import { content } from '@/lib/content'
import { SERVICES } from '@/lib/constants'
import { formatVehicleDescription } from '@/lib/utils/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Car } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

interface VehicleData {
  id: string
  make: string
  model: string
  year?: number
  color?: string
  registration?: string
  size: string
  isDefault: boolean
  createdAt: string
}

interface VehicleSectionProps {
  userId: string
  initialData: {
    vehicles?: Array<{
      id: string
      make: string
      model: string
      year: string
      color: string
      registration: string
      size: string
      created_at: string
    }>
  }
}

const VehicleCard: React.FC<{ 
  vehicle: VehicleData
  onEdit: (vehicle: VehicleData) => void
  onDelete: (vehicleId: string) => void
  onSetDefault: (vehicleId: string) => void
}> = ({ vehicle, onEdit, onDelete, onSetDefault }) => {
  const sizeData = SERVICES.vehicleSizes[vehicle.size as keyof typeof SERVICES.vehicleSizes]
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-1">
              {formatVehicleDescription(vehicle.make, vehicle.model, vehicle.year)}
            </h4>
            <p className="text-sm text-muted-foreground">
              {sizeData?.label} • {vehicle.color || 'Color not specified'}
            </p>
            {vehicle.registration && (
              <p className="text-xs text-muted-foreground mt-1">
                Registration: {vehicle.registration}
              </p>
            )}
          </div>
          {vehicle.isDefault && (
            <span className="px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-medium rounded-full">
              Default
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(vehicle)}>
            Edit
          </Button>
          {!vehicle.isDefault && (
            <Button size="sm" variant="ghost" onClick={() => onSetDefault(vehicle.id)}>
              Set Default
            </Button>
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-[var(--color-error)]"
            onClick={() => onDelete(vehicle.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const AddVehicleForm: React.FC<{
  onSave: (vehicle: Partial<VehicleData>) => void
  onCancel: () => void
  editingVehicle?: VehicleData
}> = ({ onSave, onCancel, editingVehicle }) => {
  const [formData, setFormData] = useState<Partial<VehicleData>>({
    make: editingVehicle?.make || '',
    model: editingVehicle?.model || '',
    year: editingVehicle?.year,
    color: editingVehicle?.color || '',
    registration: editingVehicle?.registration || '',
    size: editingVehicle?.size || 'medium',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Make"
              placeholder="e.g. BMW"
              value={formData.make || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
              required
            />
            <Input
              label="Model"
              placeholder="e.g. 320i"
              value={formData.model || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              type="number"
              label="Year"
              placeholder="e.g. 2020"
              value={formData.year || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value ? parseInt(e.target.value) : undefined }))}
            />
            <Input
              label="Color"
              placeholder="e.g. Black"
              value={formData.color || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            />
          </div>

          <Input
            label="Registration (Optional)"
            placeholder="e.g. AB12 CDE"
            value={formData.registration || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, registration: e.target.value.toUpperCase() }))}
          />

          {/* Vehicle Size Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[var(--color-text)]">Vehicle Size *</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(SERVICES.vehicleSizes).map(([sizeId, sizeData]) => (
                <button
                  key={sizeId}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, size: sizeId }))}
                  className={`
                    p-3 rounded-lg border text-left transition-all duration-200
                    ${formData.size === sizeId
                      ? 'border-[var(--color-primary)] bg-[var(--purple-50)]'
                      : 'border-border bg-background hover:border-[var(--color-primary)]/50'
                    }
                  `}
                >
                  <p className="font-medium text-[var(--color-text)]">{sizeData.label}</p>
                  <p className="text-xs text-muted-foreground">{sizeData.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function VehicleSection({ userId, initialData }: VehicleSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const vehicles = initialData.vehicles || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
                <span className="text-muted-foreground">Loading...</span>
              </div>
            </div>
          ) : vehicles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Car className="w-5 h-5 text-[var(--color-primary)]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                          <p>Year: {vehicle.year}</p>
                          <p>Color: {vehicle.color}</p>
                          <p>Registration: {vehicle.registration}</p>
                          <p>Size: {vehicle.size}</p>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Added on {new Date(vehicle.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Car}
              title="No vehicles found"
              description="Add your first vehicle to get started"
              action={{
                label: "Add Vehicle",
                onClick: () => window.location.href = '/dashboard/vehicles/new'
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 