'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, ArrowLeft } from 'lucide-react'
import Container from '@/components/ui/Container'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { breakpoints } from '@/lib/constants/breakpoints'

const services = [
  {
    title: 'Small Vehicle',
    description: 'Perfect for compact cars',
    price: '£55',
    duration: '45min - 1hr',
    vehicleTypes: ['Fiesta', 'Polo', 'Mini', 'Corsa'],
    features: [
      'Exterior wash & dry',
      'Interior vacuum & clean',
      'Dashboard cleaning',
      'Wheel clean & shine',
      'Window cleaning (inside & out)',
      'Basic wax application'
    ],
    bestFor: ['Compact cars', 'City cars', 'Hatchbacks'],
    popular: false
  },
  {
    title: 'Medium Vehicle',
    description: 'Ideal for family cars',
    price: '£60',
    duration: '45min - 1hr',
    vehicleTypes: ['Focus', 'Golf', 'Civic', 'Astra'],
    features: [
      'Exterior wash & dry',
      'Interior vacuum & clean',
      'Dashboard cleaning',
      'Wheel clean & shine',
      'Window cleaning (inside & out)',
      'Basic wax application'
    ],
    bestFor: ['Family cars', 'Saloons', 'Standard hatchbacks'],
    popular: true
  },
  {
    title: 'Large Vehicle',
    description: 'Great for SUVs & estates',
    price: '£65',
    duration: '45min - 1hr',
    vehicleTypes: ['BMW 5 Series', 'SUVs', 'Estates', 'MPVs'],
    features: [
      'Exterior wash & dry',
      'Interior vacuum & clean',
      'Dashboard cleaning',
      'Wheel clean & shine',
      'Window cleaning (inside & out)',
      'Basic wax application'
    ],
    bestFor: ['SUVs', 'Estate cars', 'Executive saloons'],
    popular: false
  },
  {
    title: 'Extra Large Vehicle',
    description: 'Premium for big vehicles',
    price: '£70',
    duration: '45min - 1hr',
    vehicleTypes: ['Vans', 'Range Rover', '7-Seaters', 'Large SUVs'],
    features: [
      'Exterior wash & dry',
      'Interior vacuum & clean',
      'Dashboard cleaning',
      'Wheel clean & shine',
      'Window cleaning (inside & out)',
      'Basic wax application'
    ],
    bestFor: ['Commercial vans', 'Large SUVs', '7-seater vehicles'],
    popular: false
  }
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export function ServicesClient() {
  const isMedium = useMediaQuery(`(min-width: ${breakpoints.md}px)`)

  return (
    <div className="min-h-screen bg-[#141414]">
      <Container className="py-6 sm:py-8 lg:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link 
            href="/" 
            className={cn(
              "inline-flex items-center",
              "text-[#C7C7C7] hover:text-[#F8F4EB]",
              "transition-colors touch-target"
            )}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <Badge 
            variant="secondary" 
            className={cn(
              "mb-4 bg-[#9747FF]/10 text-[#9747FF]",
              "border-[#9747FF]/30"
            )}
          >
            Our Services
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F8F4EB] mb-4">
            Professional Car Detailing
          </h1>
          <p className="text-base sm:text-lg text-[#C7C7C7] max-w-2xl mx-auto px-4 sm:px-0">
            Choose the perfect service for your vehicle. All services include professional mobile detailing at your location.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={cn(
            "grid gap-6 sm:gap-8",
            "grid-cols-1",
            isMedium ? "grid-cols-2" : "",
            "max-w-5xl mx-auto"
          )}
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="h-full"
            >
              <Card className={cn(
                "relative h-full",
                "bg-[#1E1E1E]/80 border-[#9747FF]/20",
                "hover:shadow-xl transition-all duration-300",
                "touch-target",
                service.popular && "border-[#9747FF] shadow-lg ring-1 ring-[#9747FF]/20"
              )}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#9747FF] text-[#F8F4EB] px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[#F8F4EB]">
                        {service.title}
                      </h2>
                      <p className="text-[#C7C7C7] mt-1">
                        {service.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#9747FF]">
                        {service.price}
                      </p>
                      <div className="flex items-center justify-end mt-1 text-[#C7C7C7]">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-[#F8F4EB] mb-3">Vehicle Examples</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.vehicleTypes.map((type) => (
                        <Badge 
                          key={type} 
                          variant="outline" 
                          className={cn(
                            "text-xs border-[#9747FF]/20",
                            "text-[#C7C7C7] bg-[#9747FF]/5"
                          )}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-[#F8F4EB] mb-3">What's Included</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-[#C7C7C7]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[#F8F4EB] mb-3">Best For</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.bestFor.map((type) => (
                        <Badge 
                          key={type} 
                          variant="outline" 
                          className={cn(
                            "text-xs border-[#9747FF]/20",
                            "text-[#C7C7C7] bg-[#9747FF]/5"
                          )}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link 
                    href="/dashboard/book-service"
                    className={cn(
                      "w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10",
                      service.popular 
                        ? "bg-[#9747FF] hover:bg-[#9747FF]/90 text-[#F8F4EB]"
                        : "border border-[#9747FF]/20 hover:bg-[#9747FF]/10 text-[#F8F4EB]"
                    )}
                  >
                    Book This Service
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </div>
  )
} 