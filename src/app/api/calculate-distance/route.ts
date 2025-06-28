import { NextResponse } from 'next/server'

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

interface ApiResponse {
  distance: {
    meters: number;
    miles: number;
    text: string;
  };
  isWithinRange: boolean;
  error?: string;
  requiresManualApproval?: boolean;
}

export async function POST(request: Request) {
  try {
    const { postcode } = await request.json()
    
    if (!postcode) {
      return NextResponse.json({ 
        error: 'Postcode is required',
        requiresManualApproval: true 
      }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'Service temporarily unavailable',
        requiresManualApproval: true 
      }, { status: 500 })
    }

    const apiResponse = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${HQ_POSTCODE}&destinations=${encodeURIComponent(
        postcode
      )}&key=${apiKey}`
    )

    const data: DistanceResponse = await apiResponse.json()

    // Check for valid response
    if (data.status !== 'OK' || !data.rows?.[0]?.elements?.[0]) {
      return NextResponse.json({ 
        error: 'Could not calculate distance',
        requiresManualApproval: true 
      }, { status: 400 })
    }

    const element = data.rows[0].elements[0]
    
    if (element.status !== 'OK') {
      return NextResponse.json({ 
        error: 'Invalid address or postcode',
        requiresManualApproval: true 
      }, { status: 400 })
    }

    const distanceInMeters = element.distance.value
    const distanceInMiles = distanceInMeters / 1609.34

    const result: ApiResponse = {
      distance: {
        meters: distanceInMeters,
        miles: distanceInMiles,
        text: element.distance.text
      },
      isWithinRange: distanceInMeters <= MAX_DISTANCE_METERS,
      requiresManualApproval: distanceInMeters > MAX_DISTANCE_METERS
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error calculating distance:', error)
    return NextResponse.json({ 
      error: 'Failed to process request',
      requiresManualApproval: true 
    }, { status: 500 })
  }
} 