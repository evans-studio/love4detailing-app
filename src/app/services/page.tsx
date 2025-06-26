'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Car, Clock, CheckCircle, ArrowLeft } from 'lucide-react'
import Container, { Section } from '@/components/ui/Container'
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

export default function ServicesPage() {
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg}px)`)
  const isMedium = useMediaQuery(`(min-width: ${breakpoints.md}px)`)

  return (
    <div className="min-h-screen bg-[#141414]">
      <Container as="main" className="py-6 sm:py-8 lg:py-12">
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
              "mb-4 bg-[#8A2B85]/10 text-[#8A2B85]",
              "border-[#8A2B85]/30"
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
            "max-w-6xl mx-auto"
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
                "bg-[#1E1E1E]/80 border-[#8A2B85]/20",
                "hover:shadow-xl transition-all duration-300",
                "touch-target",
                service.popular && "border-[#8A2B85] shadow-lg ring-1 ring-[#8A2B85]/20"
              )}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#8A2B85] text-[#F8F4EB] px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-12 h-12 rounded-xl",
                        "bg-gradient-to-br from-[#8A2B85]/20 to-[#8A2B85]/10",
                        "flex items-center justify-center",
                        "transition-colors"
                      )}>
                        <Car className="h-6 w-6 text-[#8A2B85]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#F8F4EB]">{service.title}</h3>
                        <p className="text-sm text-[#C7C7C7]">{service.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#8A2B85]">{service.price}</p>
                      <div className="flex items-center text-xs text-[#C7C7C7]">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.duration}
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
                            "text-xs border-[#8A2B85]/20",
                            "text-[#C7C7C7] bg-[#8A2B85]/5"
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
                    <h4 className="text-sm font-semibold text-[#F8F4EB] mb-2">Perfect For</h4>
                    <p className="text-sm text-[#C7C7C7]">
                      {service.bestFor.join(', ')}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="pt-6">
                  <Button 
                    className={cn(
                      "w-full touch-target min-h-[44px]",
                      service.popular 
                        ? "bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-[#F8F4EB]" 
                        : "border-[#8A2B85]/20 hover:bg-[#8A2B85]/10"
                    )}
                    variant={service.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/booking">
                      Book {service.title}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className={cn(
            "bg-[#1E1E1E]/50 rounded-xl",
            "p-6 sm:p-8",
            "max-w-2xl mx-auto"
          )}>
            <h3 className="text-xl sm:text-2xl font-bold text-[#F8F4EB] mb-4">
              Ready to Book Your Service?
            </h3>
            <p className="text-[#C7C7C7] mb-6">
              Professional mobile car detailing that comes to you. No queues, no waiting, just results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className={cn(
                  "bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-[#F8F4EB]",
                  "touch-target min-h-[44px]"
                )}
                asChild
              >
                <Link href="/booking">
                  Book Now
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className={cn(
                  "border-[#8A2B85]/20 text-[#C7C7C7]",
                  "hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB]",
                  "touch-target min-h-[44px]"
                )}
                asChild
              >
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  )
} 