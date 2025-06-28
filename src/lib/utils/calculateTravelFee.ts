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
    const response = await fetch('/api/calculate-distance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postcode }),
    })

    if (!response.ok) {
      throw new Error('Failed to calculate distance')
    }

    const data = await response.json()
    return data.fee
  } catch (error) {
    console.error('Error calculating travel fee:', error)
    return 0
  }
}

// Helper functions for direct distance calculations if needed
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