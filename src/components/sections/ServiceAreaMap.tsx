"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useLoadScript, GoogleMap, Circle, Marker, Libraries } from '@react-google-maps/api'
import { mapsConfig } from '@/lib/utils/clientInit'

// Service areas from the footer
const serviceAreas = [
  'Clapham', 'Brixton', 'Battersea', 'Wandsworth', 
  'Putney', 'Balham', 'Tooting', 'Streatham'
]

// Center point of service area (South West London)
const SERVICE_CENTER = {
  lat: 51.4571,
  lng: -0.1826
}

const RADIUS_IN_MILES = 10
const METERS_PER_MILE = 1609.34

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1.25rem'
}

const libraries: Libraries = ['geometry', 'places']

const MapComponent = ({ postcode, searchResult, onSearchResult }: {
  postcode: string;
  searchResult: { isInRadius: boolean; location?: { lat: number; lng: number } } | null;
  onSearchResult: (result: { isInRadius: boolean; location?: { lat: number; lng: number } } | null) => void;
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    if (!map) return
    const bounds = new google.maps.LatLngBounds(SERVICE_CENTER)
    bounds.extend({ lat: SERVICE_CENTER.lat + 0.1, lng: SERVICE_CENTER.lng + 0.1 })
    map.fitBounds(bounds)
    setMap(map)
    mapRef.current = map
    geocoderRef.current = new google.maps.Geocoder()
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
    mapRef.current = null
    geocoderRef.current = null
  }, [])

  useEffect(() => {
    if (!geocoderRef.current || !postcode || !mapRef.current) return

    const checkPostcode = async () => {
      setIsLoading(true)
      try {
        const results = await geocoderRef.current?.geocode({
          address: postcode + ', London, UK'
        })

        if (results?.results?.[0]?.geometry?.location) {
          const location = {
            lat: results.results[0].geometry.location.lat(),
            lng: results.results[0].geometry.location.lng()
          }

          // Calculate distance using the geometry library
          const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(location),
            new google.maps.LatLng(SERVICE_CENTER)
          ) / METERS_PER_MILE // Convert to miles

          onSearchResult({
            isInRadius: distance <= RADIUS_IN_MILES,
            location
          })

          // Center the map on the searched location
          if (mapRef.current) {
            mapRef.current.panTo(location)
            mapRef.current.setZoom(12)
          }
        } else {
          onSearchResult(null)
        }
      } catch (error) {
        console.error('Error checking postcode:', error)
        onSearchResult(null)
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(checkPostcode, 500)
    return () => clearTimeout(timeoutId)
  }, [postcode, onSearchResult])

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={SERVICE_CENTER}
        zoom={11}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'all',
              elementType: 'all',
              stylers: [
                { saturation: -100 },
                { lightness: -10 }
              ]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [
                { color: '#141414' }
              ]
            }
          ]
        }}
      >
        {/* Service Area Circle */}
        {map && (
          <Circle
            center={SERVICE_CENTER}
            radius={RADIUS_IN_MILES * METERS_PER_MILE}
            options={{
              fillColor: '#9747FF',
              fillOpacity: 0.1,
              strokeColor: '#9747FF',
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        )}

        {/* Search Result Marker */}
        {map && searchResult?.location && (
          <Marker
            position={searchResult.location}
            icon={{
              url: searchResult.isInRadius ? '/assets/marker-in-range.svg' : '/assets/marker-out-range.svg',
              scaledSize: new google.maps.Size(40, 40)
            }}
          />
        )}
      </GoogleMap>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[1.25rem]">
          <Loader2 className="w-8 h-8 text-[#9747FF] animate-spin" />
        </div>
      )}
    </div>
  )
}

export const ServiceAreaMap = () => {
  const [postcode, setPostcode] = useState('')
  const [searchResult, setSearchResult] = useState<{
    isInRadius: boolean;
    location?: { lat: number; lng: number };
  } | null>(null)
  const [apiKeyError, setApiKeyError] = useState(false)

  const { isLoaded, loadError } = useLoadScript({
    ...mapsConfig,
    id: 'google-maps-script'
  })

  useEffect(() => {
    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setApiKeyError(true)
      console.error('Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.')
    }
  }, [])

  const handlePostcodeCheck = () => {
    // The actual check is handled in the MapComponent
    // This is just to trigger the useEffect
  }

  if (apiKeyError) {
    return (
      <section className="min-h-[50vh] w-full flex items-center justify-center overflow-hidden py-16">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-gradient-to-br from-[#141414]/25 to-[#1E1E1E]/25 backdrop-blur-md rounded-[1.25rem] p-12 border border-[#9747FF]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#F8F4EB]">
                Service Areas
              </h2>
              <p className="text-lg text-[#F8F4EB]/80 max-w-2xl mx-auto mb-8">
                We currently service South West London and surrounding areas within a 10-mile radius.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {serviceAreas.map((area) => (
                  <Badge
                    key={area}
                    variant="outline"
                    className="bg-[#141414]/40 text-[#F8F4EB] border-[#9747FF]/20"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-[100svh] w-full flex items-center justify-center overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-gradient-to-br from-[#141414]/25 to-[#1E1E1E]/25 backdrop-blur-md rounded-[1.25rem] p-12 border border-[#9747FF]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#F8F4EB]">
                Check Your Service Area
              </h2>
              <p className="text-lg text-[#F8F4EB]/80 max-w-2xl mx-auto">
                We currently service South West London and surrounding areas within a 10-mile radius. 
                Enter your postcode to check if we cover your location.
              </p>
            </div>

            {/* Postcode Checker */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9747FF]" />
                    <input
                      type="text"
                      placeholder="Enter your postcode"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-4 py-3 bg-[#141414]/40 border border-[#9747FF]/20 rounded-[0.5rem] text-[#F8F4EB] placeholder:text-[#F8F4EB]/40 focus:outline-none focus:border-[#9747FF]/40"
                    />
                  </div>
                </div>
                <button
                  onClick={handlePostcodeCheck}
                  className="bg-[#9747FF] hover:bg-[#9747FF]/90 text-[#F8F4EB] px-6 py-3 rounded-[0.5rem] flex items-center gap-2 transition-colors"
                >
                  <Search className="w-5 h-5" />
                  Check
                </button>
              </div>

              {/* Result Message */}
              {searchResult !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-[0.5rem] flex items-center gap-3 ${
                    searchResult.isInRadius 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {searchResult.isInRadius ? (
                    <>
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span>Great news! We service your area. Book your service now!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 flex-shrink-0" />
                      <span>Sorry, this location is outside our current service area.</span>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Google Map */}
            <div className="mb-8 rounded-[1.25rem] overflow-hidden border border-[#9747FF]/20">
              {!isLoaded ? (
                <div className="w-full h-[400px] rounded-[1.25rem] bg-[#141414]/40 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#9747FF] animate-spin" />
                </div>
              ) : loadError ? (
                <div className="w-full h-[400px] rounded-[1.25rem] bg-[#141414]/40 flex items-center justify-center">
                  <div className="text-center text-[#F8F4EB]/80">
                    <p>Error loading map.</p>
                    <p className="text-sm">Please check your internet connection and try again.</p>
                  </div>
                </div>
              ) : (
                <MapComponent
                  postcode={postcode}
                  searchResult={searchResult}
                  onSearchResult={setSearchResult}
                />
              )}
            </div>

            {/* Service Areas */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-[#F8F4EB]">Our Service Areas</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {serviceAreas.map((area) => (
                  <Badge
                    key={area}
                    variant="outline"
                    className="bg-[#141414]/40 text-[#F8F4EB] border-[#9747FF]/20"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 