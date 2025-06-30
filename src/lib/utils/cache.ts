import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache configurations
export const CACHE_CONFIGS = {
  VEHICLE: { ttl: 86400 }, // 24 hours
  VEHICLE_LOOKUP: { ttl: 86400 }, // 24 hours
  SERVICES: { ttl: 3600 }, // 1 hour
  AVAILABILITY: { ttl: 300 }, // 5 minutes
  DISTANCE_CALC: { ttl: 3600 }, // 1 hour
}

interface CacheConfig {
  ttl: number // Time to live in seconds
}

/**
 * Generate a cache key for a given prefix and identifier
 */
export function generateCacheKey(prefix: string, identifier: string): string {
  return `cache:${prefix}:${identifier}`
}

/**
 * Get data from cache
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key)
    return data
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

/**
 * Set data in cache with TTL
 */
export async function setInCache<T>(
  key: string,
  data: T,
  ttl: number
): Promise<boolean> {
  try {
    await redis.set(key, data, { ex: ttl })
    return true
  } catch (error) {
    console.error('Cache set error:', error)
    return false
  }
}

/**
 * Delete data from cache
 */
export async function deleteFromCache(key: string): Promise<boolean> {
  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.error('Cache delete error:', error)
    return false
  }
}

/**
 * Get or set cache with callback
 */
export async function getOrSetCache<T>(
  key: string,
  callback: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    // Try to get from cache first
    const cached = await getFromCache<T>(key)
    if (cached) {
      return cached
    }

    // If not in cache, call the callback
    const data = await callback()

    // Store in cache
    await setInCache(key, data, ttl)

    return data
  } catch (error) {
    console.error('Cache get/set error:', error)
    // If cache fails, just return the callback result
    return callback()
  }
}

/**
 * Clear cache by prefix
 */
export async function clearCacheByPrefix(prefix: string): Promise<boolean> {
  try {
    const pattern = `cache:${prefix}:*`
    const keys = await redis.keys(pattern)
    
    if (keys.length > 0) {
      await redis.del(...keys)
    }
    
    return true
  } catch (error) {
    console.error('Cache clear error:', error)
    return false
  }
} 