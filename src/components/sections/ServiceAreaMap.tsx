"use client"

import { useEffect, useState } from 'react'
import { Map, AdvancedMarker, Pin, APIProvider, Circle } from '@vis.gl/react-google-maps'

// Center point of service area (South West London)
const SERVICE_CENTER = {
  lat: 51.5074,
  lng: -0.1278
}

export default function ServiceAreaMap() {
  const [apiKeyError, setApiKeyError] = useState(false)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setApiKeyError(true)
      console.error('Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.')
    }
  }, [])

  if (apiKeyError) {
    return (
      <div className="w-full h-[400px] rounded-lg bg-background/50 flex items-center justify-center">
        <p className="text-muted-foreground">Map unavailable</p>
      </div>
    )
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        <Map
          mapId="service-area-map"
          defaultCenter={SERVICE_CENTER}
          defaultZoom={10}
          gestureHandling="greedy"
          disableDefaultUI={true}
          zoomControl={true}
          styles={[
            {
              featureType: 'all',
              elementType: 'all',
              stylers: [{ saturation: -100 }]
            }
          ]}
        >
          <AdvancedMarker position={SERVICE_CENTER}>
            <Pin
              background="#8A2B85"
              borderColor="#6A1B65"
              glyphColor="#FFFFFF"
            />
          </AdvancedMarker>
          <Circle
            center={SERVICE_CENTER}
            options={{
              strokeColor: '#8A2B85',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#8A2B85',
              fillOpacity: 0.1,
              clickable: false,
              draggable: false,
              editable: false,
              visible: true,
              radius: 20000,
              zIndex: 1
            }}
          />
        </Map>
      </div>
    </APIProvider>
  )
} 