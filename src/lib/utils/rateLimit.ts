import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

interface RateLimitConfig {
  limit: number // Number of requests
  window: number // Time window in seconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  limit: 10,
  window: 60 // 1 minute
}

export async function rateLimit(
  ip: string,
  endpoint: string,
  config: RateLimitConfig = DEFAULT_CONFIG
) {
  const key = `rate_limit:${endpoint}:${ip}`
  
  try {
    const requests = await redis.incr(key)
    
    // Set expiry on first request
    if (requests === 1) {
      await redis.expire(key, config.window)
    }
    
    if (requests > config.limit) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        )
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // Fail open if Redis is down
    return { success: true }
  }
}

// Predefined rate limit configs
export const RATE_LIMITS = {
  VEHICLE_LOOKUP: {
    limit: 5,
    window: 60 // 5 requests per minute
  },
  DISTANCE_CALC: {
    limit: 10,
    window: 60 // 10 requests per minute
  }
} as const 