import React from 'react'
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/index"
import { formatCurrency } from "@/lib/utils/formatters"
import { SERVICES } from "@/lib/constants"
import type { VehicleSize } from "@/lib/types/vehicle"
import type { ServicePackage } from "@/lib/types/index"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

const serviceCardVariants = cva(
  "relative overflow-hidden transition-all duration-300 hover:scale-[1.02]",
  {
    variants: {
      variant: {
        default: "hover:shadow-lg",
        popular: "ring-2 ring-[var(--color-primary)] shadow-[var(--shadow-purple-glow)]",
        selected: "ring-2 ring-[var(--color-success)] bg-[var(--color-success)]/5",
      },
      size: {
        default: "max-w-sm",
        compact: "max-w-xs",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ServiceCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>,
    VariantProps<typeof serviceCardVariants> {
  servicePackage: ServicePackage
  vehicleSize?: VehicleSize
  showPricing?: boolean
  showFeatures?: boolean
  isPopular?: boolean
  isSelected?: boolean
  onSelect?: (servicePackage: ServicePackage) => void
  ctaText?: string
  disabled?: boolean
  loading?: boolean
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({
    className,
    variant,
    size,
    servicePackage,
    vehicleSize = 'medium', // Default to medium for display
    showPricing = true,
    showFeatures = true,
    isPopular = false,
    isSelected = false,
    onSelect,
    ctaText,
    disabled = false,
    loading = false,
    ...props
  }, ref) => {
    const service = SERVICES.packages[servicePackage]
    const vehicleSizeData = SERVICES.vehicleSizes[vehicleSize as keyof typeof SERVICES.vehicleSizes]
    
    if (!service) {
      console.error(`Service package "${servicePackage}" not found`)
      return null
    }
    
    // Determine variant based on state
    let cardVariant = variant
    if (isSelected) cardVariant = "selected"
    else if (isPopular) cardVariant = "popular"
    
    // Calculate pricing
    const price = showPricing && vehicleSizeData 
      ? vehicleSizeData.pricing[servicePackage] 
      : null
    
    const handleSelect = () => {
      if (!disabled && !loading && onSelect) {
        onSelect(servicePackage)
      }
    }
    
    return (
      <Card
        ref={ref}
        className={cn(serviceCardVariants({ variant: cardVariant, size }), className)}
        {...props}
      >
        {/* Popular badge */}
        {isPopular && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)] text-white">
              Popular
            </span>
          </div>
        )}
        
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>{service.name}</span>
            {price && (
              <span className="text-2xl font-bold text-[var(--color-primary)]">
                {formatCurrency(price)}
              </span>
            )}
          </CardTitle>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {service.description}
            </p>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="inline-flex items-center">
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                Duration: {service.duration}
              </span>
            </div>
          </div>
        </CardHeader>
        
        {showFeatures && service.features && service.features.length > 0 && (
          <CardContent className="pt-0">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--color-text)]">
                What's included:
              </h4>
              <ul className="space-y-1">
                {service.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-[var(--color-primary)]">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        )}
        
        {onSelect && (
          <CardFooter className="pt-4">
            <Button
              fullWidth
              variant={isSelected ? "success" : "default"}
              onClick={handleSelect}
              disabled={disabled}
              loading={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 
               isSelected ? 'Selected' :
               ctaText || 'Select Service'}
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  }
)

ServiceCard.displayName = "ServiceCard"

export { ServiceCard, serviceCardVariants } 