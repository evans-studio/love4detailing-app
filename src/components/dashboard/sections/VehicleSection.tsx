'use client'

import React, { useState } from 'react'
import { content } from '@/lib/content'
import { SERVICES } from '@/lib/constants'
import { formatVehicleDescription } from '@/lib/utils/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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
  initialVehicles?: VehicleData[]
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

export const VehicleSection: React.FC<VehicleSectionProps> = ({
  userId,
  initialVehicles = [],
}) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>(initialVehicles)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveVehicle = async (vehicleData: Partial<VehicleData>) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual API call
      if (editingVehicle) {
        // Update existing vehicle
        const updatedVehicle = { ...editingVehicle, ...vehicleData }
        setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? updatedVehicle : v))
      } else {
        // Add new vehicle
        const newVehicle: VehicleData = {
          id: Date.now().toString(),
          make: vehicleData.make || '',
          model: vehicleData.model || '',
          year: vehicleData.year,
          color: vehicleData.color,
          registration: vehicleData.registration,
          size: vehicleData.size || 'medium',
          isDefault: vehicles.length === 0, // First vehicle is default
          createdAt: new Date().toISOString(),
        }
        setVehicles(prev => [...prev, newVehicle])
      }
      
      setShowAddForm(false)
      setEditingVehicle(undefined)
    } catch (error) {
      console.error('Failed to save vehicle:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return
    
    setIsLoading(true)
    try {
      // TODO: Implement actual API call
      setVehicles(prev => prev.filter(v => v.id !== vehicleId))
    } catch (error) {
      console.error('Failed to delete vehicle:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (vehicleId: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual API call
      setVehicles(prev => prev.map(v => ({ ...v, isDefault: v.id === vehicleId })))
    } catch (error) {
      console.error('Failed to set default vehicle:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditVehicle = (vehicle: VehicleData) => {
    setEditingVehicle(vehicle)
    setShowAddForm(true)
  }

  const handleCancelForm = () => {
    setShowAddForm(false)
    setEditingVehicle(undefined)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">My Vehicles</h2>
          <p className="text-muted-foreground">
            {content.pages.dashboard.profile.sections.vehicles.description}
          </p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)}>
            Add Vehicle
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <AddVehicleForm
          onSave={handleSaveVehicle}
          onCancel={handleCancelForm}
          editingVehicle={editingVehicle}
        />
      )}

      {/* Vehicles List */}
      {isLoading && !showAddForm ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
            <span className="text-muted-foreground">Loading vehicles...</span>
          </div>
        </div>
      ) : vehicles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
              No vehicles saved yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your vehicles to make booking faster and easier
            </p>
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)}>
                Add Your First Vehicle
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
    </div>
  )
} 