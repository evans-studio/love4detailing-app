import vehicleDataRaw from '../vehicle-search-db.json'

// Vehicle size type
export type VehicleSize = 's' | 'm' | 'l' | 'xl'

// Vehicle entry interface matching the new JSON structure
export interface VehicleEntry {
  make: string
  model: string
  trim: string
  size: 'S' | 'M' | 'L' | 'XL'
}

// Type the imported data properly
const vehicleData = vehicleDataRaw as VehicleEntry[]

// License plate lookup result interface
export interface LicensePlateResult {
  registrationNumber: string
  make: string
  model?: string
  yearOfManufacture?: number
  monthOfFirstRegistration?: string
  fuelType?: string
  engineCapacity?: number
  co2Emissions?: number
  colour?: string
  motStatus?: string
  taxStatus?: string
  size: VehicleSize
  displayName: string
  confidence: 'high' | 'medium' | 'low'
}

// DVLA API response interface
interface DVLAResponse {
  make: string;
  model?: string;
  yearOfManufacture?: number;
  monthOfFirstRegistration?: string;
  fuelType?: string;
  engineCapacity?: number;
  co2Emissions?: number;
  colour?: string;
  motStatus?: string;
  taxStatus?: string;
}

// Cache entry interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Simple in-memory cache for API results (in production, use Redis or database)
const vehicleCache = new Map<string, CacheEntry<LicensePlateResult>>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Convert database size to our internal format
const convertSize = (size: string): VehicleSize => {
  switch (size.toUpperCase()) {
    case 'S': return 's'
    case 'M': return 'm'
    case 'L': return 'l'
    case 'XL': return 'xl'
    default: return 'm' // fallback to medium
  }
}

// Detect if input is a UK license plate
export function isUKLicensePlate(input: string): boolean {
  const cleaned = input.replace(/\s+/g, '').toUpperCase()
  
  // UK license plate patterns
  const patterns = [
    /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/,     // AB12 CDE (current format)
    /^[A-Z][0-9]{1,3}[A-Z]{3}$/,      // A123 BCD (prefix format)
    /^[A-Z]{3}[0-9]{1,3}[A-Z]$/,      // ABC 123D (suffix format)
    /^[0-9]{1,4}[A-Z]{1,3}$/,         // 123 AB (dateless format)
    /^[A-Z]{1,3}[0-9]{1,4}$/,         // AB 1234 (reverse dateless)
  ]
  
  return patterns.some(pattern => pattern.test(cleaned))
}

// Enhanced lookup with cost optimization
export async function lookupByLicensePlate(registrationNumber: string): Promise<LicensePlateResult | null> {
  try {
    const cleaned = registrationNumber.replace(/\s+/g, '').toUpperCase()
    
    // Check cache first to avoid API calls
    const cacheKey = `reg_${cleaned}`
    const cached = vehicleCache.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('Using cached vehicle data for', cleaned)
      return cached.data
    }
    
    // Skip local guessing for now to always try API first
    // const localGuess = guessVehicleFromRegistration(cleaned)
    // if (localGuess) {
    //   console.log('Found vehicle in local database, skipping API call')
    //   return localGuess
    // }
    
    // Only call API if not found locally
    const mockDVLAResponse = await simulateDVLALookup(cleaned)
    
    if (mockDVLAResponse) {
      // Try to match with our database for size classification
      const searchQuery = `${mockDVLAResponse.make} ${mockDVLAResponse.model || ''}`.trim()
      const matchedVehicle = searchVehicles(searchQuery, 1)[0]
      
      // Use matched vehicle size or infer from DVLA data
      let size: VehicleSize = 'm' // default
      if (matchedVehicle) {
        size = matchedVehicle.size
      } else {
        size = inferSizeFromDVLAData(mockDVLAResponse)
      }
      
      const displayName = mockDVLAResponse.model 
        ? `${mockDVLAResponse.make} ${mockDVLAResponse.model}`
        : mockDVLAResponse.make
      
              const result: LicensePlateResult = {
          registrationNumber: cleaned,
          make: mockDVLAResponse.make,
          model: mockDVLAResponse.model,
          yearOfManufacture: mockDVLAResponse.yearOfManufacture,
          monthOfFirstRegistration: mockDVLAResponse.monthOfFirstRegistration,
          fuelType: mockDVLAResponse.fuelType,
          engineCapacity: mockDVLAResponse.engineCapacity,
          co2Emissions: mockDVLAResponse.co2Emissions,
          colour: mockDVLAResponse.colour,
          motStatus: mockDVLAResponse.motStatus,
          taxStatus: mockDVLAResponse.taxStatus,
          size,
          displayName,
          confidence: matchedVehicle ? 'high' : 'medium'
        }
      
      // Cache the result
      vehicleCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      })
      
      return result
    }
    
    return null
  } catch (error) {
    console.error('License plate lookup error:', error)
    return null
  }
}

// Try to guess vehicle from registration patterns (UK specific)
function guessVehicleFromRegistration(reg: string): LicensePlateResult | null {
  // UK registration patterns can give clues about age/region
  // This is a simplified example - you could expand this significantly
  
  const currentFormat = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/ // AB12 CDE
  if (currentFormat.test(reg)) {
    const ageIdentifier = parseInt(reg.substring(2, 4))
    let year = 2000
    
    if (ageIdentifier >= 51) {
      year = 2000 + ageIdentifier - 50
    } else if (ageIdentifier >= 1) {
      year = 2000 + ageIdentifier
    }
    
    // For demo purposes, return a basic result for common patterns
    if (year >= 2015) {
      return {
        registrationNumber: reg,
        make: 'UNKNOWN',
        model: 'VEHICLE',
        yearOfManufacture: year,
        size: 'm' as VehicleSize,
        displayName: `${year} Vehicle`,
        confidence: 'low' as const
      }
    }
  }
  
  return null
}

// Simulate DVLA API response (replace with actual API call in production)
async function simulateDVLALookup(registrationNumber: string): Promise<DVLAResponse | null> {
  // Real DVLA API integration
  try {
    const response = await fetch('/api/vehicle-lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registrationNumber }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        // Vehicle not found
        return null
      }
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data as DVLAResponse
  } catch (error) {
    console.error('DVLA API error:', error)
    
    // Fallback to mock data for demo/development
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockResponses: Record<string, DVLAResponse> = {
      'AB12CDE': {
        make: 'AUDI',
        model: 'A3',
        yearOfManufacture: 2020,
        monthOfFirstRegistration: '2020-03',
        fuelType: 'PETROL',
        engineCapacity: 1395,
        co2Emissions: 128,
        colour: 'BLUE',
        motStatus: 'Valid',
        taxStatus: 'Taxed'
      },
      'XY34ZAB': {
        make: 'BMW',
        model: 'X5',
        yearOfManufacture: 2019,
        monthOfFirstRegistration: '2019-09',
        fuelType: 'DIESEL',
        engineCapacity: 2993,
        co2Emissions: 156,
        colour: 'BLACK',
        motStatus: 'Valid',
        taxStatus: 'Taxed'
      }
    }
    
    return mockResponses[registrationNumber] || null
  }
}

// Infer vehicle size from DVLA data when not found in our database
function inferSizeFromDVLAData(dvlaData: any): VehicleSize {
  const make = dvlaData.make?.toLowerCase() || ''
  const model = dvlaData.model?.toLowerCase() || ''
  const engineCapacity = dvlaData.engineCapacity || 0
  const co2Emissions = dvlaData.co2Emissions || 0
  
  // Make/model based size detection
  if (make.includes('bmw') && (model.includes('x5') || model.includes('x6') || model.includes('x7'))) return 'xl'
  if (make.includes('audi') && (model.includes('q7') || model.includes('q8'))) return 'xl'
  if (make.includes('range rover') || (make.includes('land rover') && model.includes('range rover'))) return 'xl'
  if (make.includes('mercedes') && (model.includes('gle') || model.includes('gls') || model.includes('g-class'))) return 'xl'
  
  if (make.includes('bmw') && (model.includes('5 series') || model.includes('x3') || model.includes('x4'))) return 'l'
  if (make.includes('audi') && (model.includes('a6') || model.includes('q5'))) return 'l'
  if (make.includes('mercedes') && (model.includes('c-class') || model.includes('e-class') || model.includes('glc'))) return 'l'
  
  // Engine capacity based inference
  if (engineCapacity > 3000 || co2Emissions > 200) return 'xl'
  if (engineCapacity > 2000 || co2Emissions > 150) return 'l'
  if (engineCapacity > 1400 || co2Emissions > 120) return 'm'
  
  return 's'
}

// Search result interface
export interface VehicleSearchResult {
  make: string
  model: string
  trim: string
  size: VehicleSize
  displayName: string
  searchScore: number
}

// Get all unique makes
export function getAvailableMakes(): string[] {
  const makes = new Set<string>()
  vehicleData.forEach(vehicle => makes.add(vehicle.make))
  return Array.from(makes).sort()
}

// Get models for a specific make
export function getModelsForMake(make: string): string[] {
  const models = new Set<string>()
  vehicleData
    .filter(vehicle => vehicle.make.toLowerCase() === make.toLowerCase())
    .forEach(vehicle => models.add(vehicle.model))
  return Array.from(models).sort()
}

// Get trims for a specific make and model
export function getTrimsForModel(make: string, model: string): string[] {
  const trims = new Set<string>()
  vehicleData
    .filter(vehicle => 
      vehicle.make.toLowerCase() === make.toLowerCase() && 
      vehicle.model.toLowerCase() === model.toLowerCase()
    )
    .forEach(vehicle => trims.add(vehicle.trim))
  return Array.from(trims).sort()
}

// Smart search function for predictive text
export function searchVehicles(query: string, limit: number = 10): VehicleSearchResult[] {
  if (!query || query.length < 2) return []
  
  const searchTerm = query.toLowerCase().trim()
  const results: VehicleSearchResult[] = []
  
  vehicleData.forEach(vehicle => {
    const make = vehicle.make.toLowerCase()
    const model = vehicle.model.toLowerCase()
    const trim = vehicle.trim.toLowerCase()
    const fullName = `${vehicle.make} ${vehicle.model} ${vehicle.trim}`.toLowerCase()
    const makeModel = `${vehicle.make} ${vehicle.model}`.toLowerCase()
    
    let score = 0
    
    // Exact matches get highest score
    if (fullName === searchTerm) score = 100
    else if (makeModel === searchTerm) score = 90
    else if (make === searchTerm) score = 80
    else if (model === searchTerm) score = 70
    
    // Starts with matches
    else if (fullName.startsWith(searchTerm)) score = 60
    else if (makeModel.startsWith(searchTerm)) score = 50
    else if (make.startsWith(searchTerm)) score = 40
    else if (model.startsWith(searchTerm)) score = 35
    
    // Contains matches
    else if (fullName.includes(searchTerm)) score = 30
    else if (makeModel.includes(searchTerm)) score = 25
    else if (make.includes(searchTerm)) score = 20
    else if (model.includes(searchTerm)) score = 15
    else if (trim.includes(searchTerm)) score = 10
    
    // Word boundary matches (e.g., "bmw 3" matches "BMW 3 Series")
    else {
      const words = searchTerm.split(' ')
      let wordMatches = 0
      words.forEach(word => {
        if (make.includes(word) || model.includes(word) || trim.includes(word)) {
          wordMatches++
        }
      })
      if (wordMatches > 0) score = wordMatches * 5
    }
    
    if (score > 0) {
      results.push({
        make: vehicle.make,
        model: vehicle.model,
        trim: vehicle.trim,
        size: convertSize(vehicle.size),
        displayName: `${vehicle.make} ${vehicle.model} ${vehicle.trim}`,
        searchScore: score
      })
    }
  })
  
  // Sort by score (highest first) and return limited results
  return results
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, limit)
}

// Find exact vehicle match
export function findExactVehicle(make: string, model: string, trim?: string): VehicleSearchResult | null {
  const vehicle = vehicleData.find(v => 
    v.make.toLowerCase() === make.toLowerCase() && 
    v.model.toLowerCase() === model.toLowerCase() &&
    (!trim || v.trim.toLowerCase() === trim.toLowerCase())
  )
  
  if (vehicle) {
    return {
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim,
      size: convertSize(vehicle.size),
      displayName: `${vehicle.make} ${vehicle.model} ${vehicle.trim}`,
      searchScore: 100
    }
  }
  
  return null
}

// Legacy function for backward compatibility
export function detectVehicle(make: string, model: string): { make: string; model: string; size: VehicleSize; confidence: 'exact' | 'partial' | 'fallback' } | null {
  const searchQuery = `${make} ${model}`.trim()
  const results = searchVehicles(searchQuery, 1)
  
  if (results.length > 0) {
    const result = results[0]
    return {
      make: result.make,
      model: result.model,
      size: result.size,
      confidence: result.searchScore >= 80 ? 'exact' : result.searchScore >= 30 ? 'partial' : 'fallback'
    }
  }
  
  return null
}

// Fallback size detection for unknown vehicles
export function getFallbackSize(make: string, model: string): VehicleSize {
  const searchTerm = `${make} ${model}`.toLowerCase()
  
  // Check for size indicators in the search term
  if (searchTerm.includes('van') || searchTerm.includes('transit') || 
      searchTerm.includes('sprinter') || searchTerm.includes('crafter')) {
    return 'xl'
  }
  
  if (searchTerm.includes('suv') || searchTerm.includes('4x4') || 
      searchTerm.includes('range rover') || searchTerm.includes('land cruiser') ||
      searchTerm.includes('x5') || searchTerm.includes('x6') || searchTerm.includes('x7') ||
      searchTerm.includes('q7') || searchTerm.includes('q8') ||
      searchTerm.includes('gle') || searchTerm.includes('gls')) {
    return 'xl'
  }
  
  if (searchTerm.includes('estate') || searchTerm.includes('avant') || 
      searchTerm.includes('touring') || searchTerm.includes('wagon') ||
      searchTerm.includes('5 series') || searchTerm.includes('e class') ||
      searchTerm.includes('a6') || searchTerm.includes('passat')) {
    return 'l'
  }
  
  if (searchTerm.includes('mini') || searchTerm.includes('smart') || 
      searchTerm.includes('aygo') || searchTerm.includes('up') ||
      searchTerm.includes('fiesta') || searchTerm.includes('polo') ||
      searchTerm.includes('corsa') || searchTerm.includes('micra')) {
    return 's'
  }
  
  // Default to medium for unknown vehicles
  return 'm'
} 