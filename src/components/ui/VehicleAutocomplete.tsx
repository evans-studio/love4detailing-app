"use client"

import { useState, useEffect, useRef } from 'react'
import { Input } from './Input'
import { 
  searchVehicles, 
  VehicleSearchResult, 
  isUKLicensePlate, 
  lookupByLicensePlate, 
  LicensePlateResult 
} from '@/lib/utils/vehicleDatabase'
import { CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VehicleAutocompleteProps {
  value: string
  onChange: (value: string, vehicleData?: VehicleSearchResult | LicensePlateResult) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function VehicleAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Enter reg plate (AB12 CDE) or search vehicle...", 
  className,
  disabled = false 
}: VehicleAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [prediction, setPrediction] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSearchResult | LicensePlateResult | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update query when value prop changes
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Detect input type and search accordingly
  useEffect(() => {
    const detectAndSearch = async () => {
      if (query.length < 2) {
        setPrediction('')
        setSelectedVehicle(null)
        setShowConfirmation(false)
        return
      }

      const isRegPlate = isUKLicensePlate(query)

      if (isRegPlate && query.replace(/\s+/g, '').length >= 6) {
        // License plate lookup
        setIsLoading(true)
        try {
          const result = await lookupByLicensePlate(query)
          if (result) {
            setSelectedVehicle(result)
            setShowConfirmation(true)
            setPrediction('')
          } else {
            setSelectedVehicle(null)
            setShowConfirmation(false)
            setPrediction('')
          }
        } catch (error) {
          console.error('License plate lookup failed:', error)
          setSelectedVehicle(null)
          setShowConfirmation(false)
          setPrediction('')
        }
        setIsLoading(false)
      } else {
        // Predictive text search
        const results = searchVehicles(query, 1)
        if (results.length > 0) {
          const topResult = results[0]
          const displayName = topResult.displayName.toLowerCase()
          const queryLower = query.toLowerCase()
          
          // Only show prediction if the result starts with what user typed
          if (displayName.startsWith(queryLower) && displayName !== queryLower) {
            setPrediction(topResult.displayName)
            setSelectedVehicle(topResult)
            setShowConfirmation(false)
          } else if (displayName === queryLower) {
            // Exact match - show confirmation
            setPrediction('')
            setSelectedVehicle(topResult)
            setShowConfirmation(true)
          } else {
            setPrediction('')
            setSelectedVehicle(null)
            setShowConfirmation(false)
          }
        } else {
          setPrediction('')
          setSelectedVehicle(null)
          setShowConfirmation(false)
        }
      }
    }

    const debounceTimer = setTimeout(detectAndSearch, isUKLicensePlate(query) ? 300 : 100)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    onChange(newValue)
  }

  const acceptPrediction = () => {
    if (prediction && selectedVehicle) {
      setQuery(prediction)
      onChange(prediction, selectedVehicle)
      setPrediction('')
      setShowConfirmation(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Tab':
      case 'ArrowRight':
        if (prediction) {
          e.preventDefault()
          acceptPrediction()
        }
        break
      case 'Enter':
        if (prediction) {
          e.preventDefault()
          acceptPrediction()
        } else if (selectedVehicle && showConfirmation) {
          e.preventDefault()
          // Already confirmed, do nothing
        }
        break
      case 'Escape':
        setPrediction('')
        setSelectedVehicle(null)
        setShowConfirmation(false)
        inputRef.current?.blur()
        break
    }
  }

  const getSizeColor = (size: string) => {
    switch (size) {
      case 's': return 'bg-green-100 text-green-800'
      case 'm': return 'bg-blue-100 text-blue-800'
              case 'l': return 'bg-deep-purple/20 text-deep-purple'
      case 'xl': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 's': return 'Small'
      case 'm': return 'Medium'
      case 'l': return 'Large'
      case 'xl': return 'Extra Large'
      default: return 'Medium'
    }
  }

  const isLicensePlateResult = (vehicle: any): vehicle is LicensePlateResult => {
    return vehicle && 'registrationNumber' in vehicle
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

        {/* Prediction text (gray background text) */}
        {prediction && !isLoading && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full flex items-center px-3 text-gray-400">
              <span className="invisible">{query}</span>
              <span className="text-gray-400">
                {prediction.slice(query.length)}
              </span>
            </div>
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
          className={cn("relative z-10 bg-transparent", isLoading && "pr-10", className)}
          disabled={disabled}
          autoComplete="off"
        />
      </div>

      {/* Subtle prediction hint */}
      {prediction && !isLoading && (
        <div className="mt-1 text-xs text-muted-foreground">
          Press Tab to complete: <span className="font-medium">{prediction}</span>
        </div>
      )}

      {/* Clean confirmation message */}
      {showConfirmation && selectedVehicle && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div className="flex-1">
              {isLicensePlateResult(selectedVehicle) ? (
                // License plate result
                <div>
                  <div className="text-sm font-medium text-green-900">
                    {selectedVehicle.make} {selectedVehicle.model || ''}
                  </div>
                  <div className="text-xs text-green-700">
                    {selectedVehicle.registrationNumber} • {selectedVehicle.yearOfManufacture} • {selectedVehicle.fuelType}
                  </div>
                </div>
              ) : (
                // Search result
                <div>
                  <div className="text-sm font-medium text-green-900">
                    {selectedVehicle.make} {selectedVehicle.model}
                  </div>
                  <div className="text-xs text-green-700">
                    {selectedVehicle.trim}
                  </div>
                </div>
              )}
            </div>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getSizeColor(selectedVehicle.size)
            )}>
              {getSizeLabel(selectedVehicle.size)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 