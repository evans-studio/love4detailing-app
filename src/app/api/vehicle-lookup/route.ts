import { NextRequest, NextResponse } from 'next/server'
import { vehicleLogger } from '@/lib/utils/logger'
import { vehicleLookupSchema, type VehicleLookupRequest } from '@/lib/schemas/api'
import { rateLimit, RATE_LIMITS } from '@/lib/utils/rateLimit'
import { getOrSetCache, generateCacheKey, CACHE_CONFIGS } from '@/lib/utils/cache'
import { headers } from 'next/headers'
import { z } from 'zod'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// DVLA Vehicle Enquiry Service API
const DVLA_API_URL = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles'

interface DVLAResponse {
  make: string
  model: string
  yearOfManufacture: string
}

// Validation schema for request
const requestSchema = z.object({
  registration: z.string().min(2).max(10)
})

export async function GET(request: Request) {
  try {
    // Get registration from query params
    const { searchParams } = new URL(request.url)
    const registration = searchParams.get('registration')

    // Validate request
    const validatedData = requestSchema.parse({ registration })

    // Call DVLA API
    const response = await fetch(`${process.env.DVLA_API_URL}/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.DVLA_API_KEY || ''
      },
      body: JSON.stringify({
        registrationNumber: validatedData.registration
      })
    })

    if (!response.ok) {
      throw new Error('Vehicle lookup failed')
    }

    const data = await response.json()

    // Transform DVLA response to our format
    return NextResponse.json({
      make: data.make,
      model: data.model,
      year: parseInt(data.yearOfManufacture),
      color: data.colour,
      registration: validatedData.registration
    })

  } catch (error) {
    console.error('Vehicle lookup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid registration number' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Vehicle lookup failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = headers().get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0] || 'unknown'

    // Apply rate limiting
    const rateLimitResult = await rateLimit(ip, 'VEHICLE_LOOKUP')
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    // Validate request body
    const body = await request.json()
    const validationResult = vehicleLookupSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { registration } = validationResult.data as VehicleLookupRequest
    const cleanReg = registration.replace(/\s/g, '')

    // Generate cache key
    const cacheKey = generateCacheKey('vehicle', cleanReg)

    // Try to get from cache or fetch from DVLA
    const vehicleData = await getOrSetCache<DVLAResponse | null>(
      cacheKey,
      async () => {
        // Get DVLA API key from environment variables
        const apiKey = process.env.DVLA_API_KEY

        if (!apiKey) {
          vehicleLogger.warn('DVLA_API_KEY not found in environment variables. Using mock data.')
          return getMockVehicleData(cleanReg)
        }

        // Call DVLA API
        const response = await fetch(DVLA_API_URL, {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registrationNumber: cleanReg
          }),
        })

        if (!response.ok) {
          if (response.status === 404) {
            // Try mock data first before returning error
            const mockData = getMockVehicleData(cleanReg)
            if (mockData) {
              vehicleLogger.info('DVLA API returned 404, using mock data', { registration: cleanReg })
              return mockData
            }
            return null
          }
          
          const errorText = await response.text()
          vehicleLogger.error('DVLA API error', { status: response.status, error: errorText })
          
          // For any other error (including 403), try mock data as fallback
          const mockData = getMockVehicleData(cleanReg)
          if (mockData) {
            vehicleLogger.info('DVLA API failed, using mock data', { registration: cleanReg })
            return mockData
          }
          
          return null
        }

        return await response.json()
      },
      CACHE_CONFIGS.VEHICLE_LOOKUP.ttl
    )

    if (!vehicleData) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Transform DVLA response to our format
    const transformedData = {
      registration: cleanReg,
      make: vehicleData.make,
      model: vehicleData.model || '',
      year: parseInt(vehicleData.yearOfManufacture, 10)
    }

    return NextResponse.json(transformedData)

  } catch (error) {
    vehicleLogger.error('Vehicle lookup error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock data for development/demo when DVLA API key is not available
function getMockVehicleData(registrationNumber: string): DVLAResponse | null {
  const mockResponses: Record<string, DVLAResponse> = {
    'AB12CDE': {
      make: 'AUDI',
      model: 'A3',
      yearOfManufacture: '2020'
    },
    'XY34ZAB': {
      make: 'BMW',
      model: 'X5',
      yearOfManufacture: '2019'
    },
    'CD56EFG': {
      make: 'FORD',
      model: 'FOCUS',
      yearOfManufacture: '2018'
    },
    'HI78JKL': {
      make: 'VOLKSWAGEN',
      model: 'GOLF',
      yearOfManufacture: '2021'
    }
  }

  return mockResponses[registrationNumber] || null
} 