"use client"

import { useState, useEffect, useRef } from 'react'
import { Input } from './Input'
import { CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VehicleData } from '@/types'
import type { VehicleSize } from '@/lib/constants'

interface VehicleAutocompleteProps {
  value: string
  onChange: (value: string, vehicleData?: VehicleData) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function VehicleAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Enter reg plate (AB12 CDE)...", 
  className,
  disabled = false 
}: VehicleAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update query when value prop changes
  useEffect(() => {
    setQuery(value)
  }, [value])

  // UK license plate format validation
  const isUKLicensePlate = (input: string): boolean => {
    const cleanInput = input.replace(/\s+/g, '').toUpperCase()
    return /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/.test(cleanInput)
  }

  // Detect input type and search using DVLA API
  useEffect(() => {
    const detectAndSearch = async () => {
      if (query.length < 2) {
        setSelectedVehicle(null)
        setShowConfirmation(false)
        return
      }

      const isRegPlate = isUKLicensePlate(query.replace(/\s+/g, ''))

      if (isRegPlate) {
        // License plate lookup via DVLA API
        setIsLoading(true)
        try {
          const response = await fetch(`/api/dvla/vehicle-details?registration=${query}`)
          const data = await response.json()
          
          if (response.ok && data) {
            setSelectedVehicle(data)
            setShowConfirmation(true)
          } else {
            setSelectedVehicle(null)
            setShowConfirmation(false)
          }
        } catch (error) {
          console.error('License plate lookup failed:', error)
          setSelectedVehicle(null)
          setShowConfirmation(false)
        }
        setIsLoading(false)
      } else {
        setSelectedVehicle(null)
        setShowConfirmation(false)
      }
    }

    const debounceTimer = setTimeout(detectAndSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    onChange(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedVehicle && showConfirmation) {
      e.preventDefault()
      // Already confirmed, do nothing
    } else if (e.key === 'Escape') {
      setSelectedVehicle(null)
      setShowConfirmation(false)
      inputRef.current?.blur()
    }
  }

  const getSizeColor = (size: VehicleSize) => {
    switch (size) {
      case 's': return 'bg-green-100 text-green-800'
      case 'm': return 'bg-blue-100 text-blue-800'
      case 'l': return 'bg-deep-purple/20 text-deep-purple'
      case 'xl': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSizeLabel = (size: VehicleSize) => {
    switch (size) {
      case 's': return 'Small'
      case 'm': return 'Medium'
      case 'l': return 'Large'
      case 'xl': return 'Extra Large'
      default: return 'Medium'
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Actual input */}
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "pr-10",
            showConfirmation && "pr-16",
            className
          )}
          disabled={disabled}
          autoComplete="off"
        />

        {/* Confirmation checkmark */}
        {showConfirmation && selectedVehicle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>

      {/* Vehicle details preview */}
      {selectedVehicle && showConfirmation && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white border rounded-md shadow-lg z-50">
          <div className="text-sm">
            <div className="font-medium">
              {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.yearOfManufacture})
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {selectedVehicle.colour} • {selectedVehicle.fuelType}
              {selectedVehicle.engineCapacity && ` • ${selectedVehicle.engineCapacity}cc`}
            </div>
            {selectedVehicle.size && (
              <div className={cn(
                "inline-block px-2 py-0.5 rounded text-xs mt-2",
                getSizeColor(selectedVehicle.size as VehicleSize)
              )}>
                {getSizeLabel(selectedVehicle.size as VehicleSize)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 