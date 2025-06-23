import { NextRequest, NextResponse } from 'next/server'

// DVLA Vehicle Enquiry Service API
const DVLA_API_URL = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles'

export async function POST(request: NextRequest) {
  try {
    const { registrationNumber } = await request.json()

    if (!registrationNumber) {
      return NextResponse.json(
        { error: 'Registration number is required' },
        { status: 400 }
      )
    }

    // Clean the registration number
    const cleanedReg = registrationNumber.replace(/\s+/g, '').toUpperCase()

    // Validate UK registration format
    const ukRegPattern = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$|^[A-Z][0-9]{1,3}[A-Z]{3}$|^[A-Z]{3}[0-9]{1,3}[A-Z]$|^[0-9]{1,4}[A-Z]{1,3}$|^[A-Z]{1,3}[0-9]{1,4}$/
    
    if (!ukRegPattern.test(cleanedReg)) {
      return NextResponse.json(
        { error: 'Invalid UK registration format' },
        { status: 400 }
      )
    }

    // Get DVLA API key from environment variables
    const apiKey = process.env.DVLA_API_KEY

    if (!apiKey) {
      console.warn('DVLA_API_KEY not found in environment variables. Using mock data.')
      
      // Return mock data when API key is not available
      const mockData = getMockVehicleData(cleanedReg)
      if (mockData) {
        return NextResponse.json(mockData)
      } else {
        return NextResponse.json(
          { error: 'Vehicle not found' },
          { status: 404 }
        )
      }
    }

    // Call DVLA API
    const response = await fetch(DVLA_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registrationNumber: cleanedReg
      }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Vehicle not found' },
          { status: 404 }
        )
      }
      
      const errorText = await response.text()
      console.error('DVLA API error:', response.status, errorText)
      
      return NextResponse.json(
        { error: 'Failed to fetch vehicle data' },
        { status: response.status }
      )
    }

    const vehicleData = await response.json()
    
    // Transform DVLA response to our format
    const transformedData = {
      make: vehicleData.make,
      model: vehicleData.model || '',
      yearOfManufacture: vehicleData.yearOfManufacture,
      monthOfFirstRegistration: vehicleData.monthOfFirstRegistration,
      fuelType: vehicleData.fuelType,
      engineCapacity: vehicleData.engineCapacity,
      co2Emissions: vehicleData.co2Emissions,
      colour: vehicleData.colour,
      motStatus: vehicleData.motStatus,
      taxStatus: vehicleData.taxStatus,
      registrationNumber: vehicleData.registrationNumber || cleanedReg
    }

    return NextResponse.json(transformedData)

  } catch (error) {
    console.error('Vehicle lookup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock data for development/demo when DVLA API key is not available
function getMockVehicleData(registrationNumber: string) {
  const mockResponses: { [key: string]: any } = {
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
      taxStatus: 'Taxed',
      registrationNumber: 'AB12CDE'
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
      taxStatus: 'Taxed',
      registrationNumber: 'XY34ZAB'
    },
    'CD56EFG': {
      make: 'FORD',
      model: 'FOCUS',
      yearOfManufacture: 2018,
      monthOfFirstRegistration: '2018-07',
      fuelType: 'PETROL',
      engineCapacity: 1499,
      co2Emissions: 115,
      colour: 'WHITE',
      motStatus: 'Valid',
      taxStatus: 'Taxed',
      registrationNumber: 'CD56EFG'
    },
    'HI78JKL': {
      make: 'VOLKSWAGEN',
      model: 'GOLF',
      yearOfManufacture: 2021,
      monthOfFirstRegistration: '2021-01',
      fuelType: 'PETROL',
      engineCapacity: 1395,
      co2Emissions: 122,
      colour: 'SILVER',
      motStatus: 'Valid',
      taxStatus: 'Taxed',
      registrationNumber: 'HI78JKL'
    }
  }

  return mockResponses[registrationNumber] || null
} 