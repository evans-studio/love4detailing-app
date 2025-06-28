"use client"

import { useEffect, useState } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import { mapsConfig } from '@/lib/utils/clientInit'
import dynamic from 'next/dynamic'

const Map = dynamic(
  () => import('@react-google-maps/api').then(mod => mod.GoogleMap),
  { ssr: false }
)

const Marker = dynamic(
  () => import('@react-google-maps/api').then(mod => mod.Marker),
  { ssr: false }
)

const Circle = dynamic(
  () => import('@react-google-maps/api').then(mod => mod.Circle),
  { ssr: false }
)

// Center point of service area (South West London)
const SERVICE_CENTER = {
  lat: 51.5074,
  lng: -0.1278
}

export default function ServiceAreaMap() {
  const [apiKeyError, setApiKeyError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const { loadError } = useLoadScript({
    ...mapsConfig,
    id: 'google-maps-script'
  })

  useEffect(() => {
    if (loadError) {
      console.error('Error loading Google Maps:', loadError)
      setApiKeyError(true)
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setApiKeyError(true)
      console.error('Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.')
    }

    setIsLoaded(true)
  }, [loadError])

  if (apiKeyError) {
    return (
      <div className="w-full h-[400px] rounded-lg bg-background/50 flex items-center justify-center">
        <p className="text-muted-foreground">Map unavailable</p>
      </div>
    )
  }

  if (!isLoaded) return null

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <Map
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={SERVICE_CENTER}
        zoom={10}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'all',
              elementType: 'all',
              stylers: [{ saturation: -100 }]
            }
          ]
        }}
      >
        <Marker position={SERVICE_CENTER} />
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
  )
} 