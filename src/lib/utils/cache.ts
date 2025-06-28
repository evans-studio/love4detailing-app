import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

interface CacheConfig {
  ttl: number // Time to live in seconds
}

const DEFAULT_CONFIG: CacheConfig = {
  ttl: 3600 // 1 hour
}

export async function getFromCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  config: CacheConfig = DEFAULT_CONFIG
): Promise<T> {
  try {
    // Try to get from cache first
    const cached = await redis.get<T>(key)
    if (cached) {
      return cached
    }

    // If not in cache, fetch fresh data
    const fresh = await fetcher()

    // Store in cache with TTL
    await redis.setex(key, config.ttl, fresh)

    return fresh
  } catch (error) {
    console.error('Cache error:', error)
    // Fallback to direct fetch if cache fails
    return fetcher()
  }
}

// Predefined cache configs
export const CACHE_CONFIGS = {
  VEHICLE_LOOKUP: {
    ttl: 3600 // 1 hour
  },
  DISTANCE_CALC: {
    ttl: 86400 // 24 hours
  },
  POSTCODE_LOOKUP: {
    ttl: 604800 // 1 week
  }
} as const

// Helper to generate consistent cache keys
export function generateCacheKey(prefix: string, ...parts: string[]): string {
  return `${prefix}:${parts.join(':')}`
} 