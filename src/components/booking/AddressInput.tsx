"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

interface AddressInputProps {
  value: string
  onChange: (value: string) => void
  onValidationChange: (isValid: boolean) => void
  onDistanceCheck: (result: DistanceCheckResult) => void
  className?: string
}

interface DistanceCheckResult {
  isWithinRange: boolean
  requiresManualApproval: boolean
  distance?: {
    miles: number
    text: string
  }
  error?: string
}

export function AddressInput({
  value,
  onChange,
  onValidationChange,
  onDistanceCheck,
  className = ''
}: AddressInputProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationResult, setValidationResult] = useState<DistanceCheckResult | null>(null)
  
  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    if (!debouncedValue) {
      setError(null)
      setValidationResult(null)
      onValidationChange(false)
      return
    }

    const checkAddress = async () => {
      setIsChecking(true)
      setError(null)

      try {
        const response = await fetch('/api/calculate-distance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postcode: debouncedValue }),
        })

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setValidationResult({
            isWithinRange: false,
            requiresManualApproval: true,
            error: data.error
          })
          onValidationChange(false)
        } else {
          const result = {
            isWithinRange: data.isWithinRange,
            requiresManualApproval: data.requiresManualApproval,
            distance: {
              miles: data.distance.miles,
              text: data.distance.text
            }
          }
          setValidationResult(result)
          onValidationChange(!data.requiresManualApproval)
        }
      } catch (err) {
        setError('Failed to check address. Please try again.')
        setValidationResult({
          isWithinRange: false,
          requiresManualApproval: true,
          error: 'Service unavailable'
        })
        onValidationChange(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAddress()
  }, [debouncedValue, onValidationChange])

  // Separate useEffect for handling distance check updates
  useEffect(() => {
    if (validationResult) {
      onDistanceCheck(validationResult)
    } else {
      onDistanceCheck({
        isWithinRange: false,
        requiresManualApproval: true
      })
    }
  }, [validationResult, onDistanceCheck])

  return (
    <div className={className}>
      <Label htmlFor="address">Address or Postcode</Label>
      <div className="relative">
        <Input
          id="address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your address or postcode"
          className={error ? 'border-red-500' : ''}
        />
        {isChecking && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Validation Messages */}
      {validationResult && !error && (
        <Badge variant="outline" className={`mt-2 ${validationResult.isWithinRange ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
          <div className="flex items-center gap-2 py-1">
            {validationResult.isWithinRange ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Your address is within our service area ({validationResult.distance?.text})</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span>
                  Your address is {validationResult.distance?.text} away. This is outside our standard service area and will require manual approval.
                </span>
              </>
            )}
          </div>
        </Badge>
      )}

      {error && (
        <Badge variant="alert" className="mt-2 bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-2 py-1">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-500">{error}</span>
          </div>
        </Badge>
      )}
    </div>
  )
} 