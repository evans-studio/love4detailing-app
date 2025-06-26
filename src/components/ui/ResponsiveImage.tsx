import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useResponsive } from '@/hooks/useResponsive'
import { breakpoints } from '@/lib/constants/breakpoints'

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  quality?: number
  objectFit?: 'contain' | 'cover' | 'fill'
  sizes?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    xxl?: string
  }
}

export default function ResponsiveImage({
  src,
  alt,
  className = '',
  priority = false,
  quality = 75,
  objectFit = 'cover',
  sizes = {
    xs: '100vw',
    sm: '100vw',
    md: '100vw',
    lg: '100vw',
    xl: '100vw',
    xxl: '100vw',
  },
}: ResponsiveImageProps) {
  const { breakpoint } = useResponsive()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Build sizes string for Next.js Image component
  const sizesString = Object.entries(sizes)
    .map(([bp, size]) => {
      if (bp === 'xs') return size
      return `(min-width: ${breakpoints[bp as keyof typeof breakpoints]}px) ${size}`
    })
    .join(', ')

  // Handle load complete
  const handleLoadComplete = () => {
    setLoading(false)
  }

  // Handle error
  const handleError = () => {
    setError(true)
    setLoading(false)
  }

  // Reset states when src changes
  useEffect(() => {
    setLoading(true)
    setError(false)
  }, [src])

  return (
    <div 
      className={`
        relative overflow-hidden
        ${loading ? 'animate-pulse bg-[#8A2B85]/10' : ''}
        ${className}
      `}
    >
      {!error ? (
        <Image
          src={src}
          alt={alt}
          fill
          quality={quality}
          priority={priority}
          className={`
            transition-opacity duration-300
            ${loading ? 'opacity-0' : 'opacity-100'}
            ${objectFit === 'contain' ? 'object-contain' : ''}
            ${objectFit === 'cover' ? 'object-cover' : ''}
            ${objectFit === 'fill' ? 'object-fill' : ''}
          `}
          sizes={sizesString}
          onLoadingComplete={handleLoadComplete}
          onError={handleError}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#8A2B85]/10 text-[#8A2B85]">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  )
} 