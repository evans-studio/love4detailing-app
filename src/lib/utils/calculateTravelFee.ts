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