interface TravelFeeConfig {
  basePostcode: string;
  maxRadius: number;
  costPerMile: number;
}

interface TravelFeeResult {
  fee: number;
  distance: number;
  isWithinRange: boolean;
}

type DistanceResponse = {
  rows: Array<{
    elements: Array<{
      distance: {
        value: number; // meters
      };
      status: string;
    }>;
  }>;
  status: string;
}

export async function calculateTravelFee(postcode: string): Promise<number> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error('Google Maps API key not found')
      return 0
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=SW9&destinations=${encodeURIComponent(
        postcode
      )}&key=${apiKey}`
    )

    const data: DistanceResponse = await response.json()

    if (
      data.status === 'OK' &&
      data.rows[0]?.elements[0]?.status === 'OK'
    ) {
      const distanceInMiles = data.rows[0].elements[0].distance.value / 1609.34 // Convert meters to miles

      if (distanceInMiles <= 10) {
        return 0
      } else if (distanceInMiles <= 15) {
        return 10
      } else if (distanceInMiles <= 20) {
        return 15
      } else {
        return 20
      }
    }

    return 0
  } catch (error) {
    console.error('Error calculating travel fee:', error)
    return 0
  }
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
} 