import { NextRequest, NextResponse } from 'next/server'
import { distanceCalculationSchema } from '@/lib/schemas/api'
import { rateLimit, RATE_LIMITS } from '@/lib/utils/rateLimit'
import { getFromCache, generateCacheKey, CACHE_CONFIGS } from '@/lib/utils/cache'
import { headers } from 'next/headers'

const MAX_DISTANCE_METERS = 16093 // 10 miles in meters
const HQ_POSTCODE = 'SW9' // Base location

interface DistanceResponse {
  rows: Array<{
    elements: Array<{
      distance: {
        value: number;
        text: string;
      };
      duration: {
        value: number;
        text: string;
      };
      status: string;
    }>;
  }>;
  status: string;
}

interface SuccessResponse {
  distance: {
    meters: number;
    miles: number;
    text: string;
  };
  isWithinRange: boolean;
  requiresManualApproval: boolean;
}

interface ErrorResponse {
  error: string;
  requiresManualApproval: boolean;
}

type ApiResponse = SuccessResponse | ErrorResponse

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = headers().get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0] || 'unknown'

    // Apply rate limiting
    const rateLimitResult = await rateLimit(ip, 'distance_calc', RATE_LIMITS.DISTANCE_CALC)
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    // Validate request body
    const body = await request.json()
    const validationResult = distanceCalculationSchema.safeParse(body)

    if (!validationResult.success) {
      const errorResponse: ErrorResponse = {
        error: 'Invalid request',
        requiresManualApproval: true
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const { postcode } = validationResult.data

    // Generate cache key
    const cacheKey = generateCacheKey('distance', HQ_POSTCODE, postcode)

    // Try to get from cache or calculate fresh
    const result = await getFromCache<ApiResponse>(
      cacheKey,
      async () => {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY
        if (!apiKey) {
          return {
            error: 'Service temporarily unavailable',
            requiresManualApproval: true
          }
        }

        const apiResponse = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${HQ_POSTCODE}&destinations=${encodeURIComponent(
            postcode
          )}&key=${apiKey}`
        )

        const data: DistanceResponse = await apiResponse.json()

        // Check for valid response
        if (data.status !== 'OK' || !data.rows?.[0]?.elements?.[0]) {
          return {
            error: 'Could not calculate distance',
            requiresManualApproval: true
          }
        }

        const element = data.rows[0].elements[0]
        
        if (element.status !== 'OK') {
          return {
            error: 'Invalid address or postcode',
            requiresManualApproval: true
          }
        }

        const distanceInMeters = element.distance.value
        const distanceInMiles = distanceInMeters / 1609.34

        const successResponse: SuccessResponse = {
          distance: {
            meters: distanceInMeters,
            miles: distanceInMiles,
            text: element.distance.text
          },
          isWithinRange: distanceInMeters <= MAX_DISTANCE_METERS,
          requiresManualApproval: distanceInMeters > MAX_DISTANCE_METERS
        }

        return successResponse
      },
      CACHE_CONFIGS.DISTANCE_CALC
    )

    if ('error' in result) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error calculating distance:', error)
    const errorResponse: ErrorResponse = {
      error: 'Failed to process request',
      requiresManualApproval: true
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
} 