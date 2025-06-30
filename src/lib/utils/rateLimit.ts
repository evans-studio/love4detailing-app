import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

// Rate limit configurations
export const RATE_LIMITS = {
  VEHICLE_LOOKUP: { points: 5, duration: 60 }, // 5 requests per minute
  BOOKING_CREATE: { points: 3, duration: 60 }, // 3 requests per minute
  DISTANCE_CALC: { points: 10, duration: 60 }, // 10 requests per minute
  GENERAL_API: { points: 100, duration: 60 }, // 100 requests per minute
}

interface RateLimitConfig {
  points: number
  duration: number
}

interface RateLimitResult {
  success: boolean
  remaining?: number
  reset?: number
  response?: NextResponse
}

/**
 * Rate limiting implementation using the token bucket algorithm
 */
export async function rateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMITS,
  config?: RateLimitConfig
): Promise<RateLimitResult> {
  const { points, duration } = config || RATE_LIMITS[type]
  const key = `rate_limit:${type}:${identifier}`
  const now = Date.now()

  try {
    // Get the current bucket
    const bucket = await redis.get<{ tokens: number; reset: number }>(key)

    if (!bucket) {
      // Create a new bucket
      await redis.set(key, {
        tokens: points - 1,
        reset: now + duration * 1000
      }, { ex: duration })

      return {
        success: true,
        remaining: points - 1,
        reset: now + duration * 1000
      }
    }

    // Check if the bucket should be reset
    if (now > bucket.reset) {
      await redis.set(key, {
        tokens: points - 1,
        reset: now + duration * 1000
      }, { ex: duration })

      return {
        success: true,
        remaining: points - 1,
        reset: now + duration * 1000
      }
    }

    // Check if there are tokens available
    if (bucket.tokens <= 0) {
      return {
        success: false,
        remaining: 0,
        reset: bucket.reset,
        response: new NextResponse(
          JSON.stringify({
            error: 'Too many requests',
            message: `Please try again in ${Math.ceil((bucket.reset - now) / 1000)} seconds`
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': points.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': bucket.reset.toString(),
              'Retry-After': Math.ceil((bucket.reset - now) / 1000).toString()
            }
          }
        )
      }
    }

    // Update the bucket
    await redis.set(key, {
      tokens: bucket.tokens - 1,
      reset: bucket.reset
    }, { ex: Math.ceil((bucket.reset - now) / 1000) })

    return {
      success: true,
      remaining: bucket.tokens - 1,
      reset: bucket.reset
    }

  } catch (error) {
    console.error('Rate limit error:', error)
    // If Redis fails, allow the request but log the error
    return {
      success: true,
      remaining: -1,
      reset: -1
    }
  }
} 