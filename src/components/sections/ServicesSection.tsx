"use client"

import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Car, Clock, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

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
      'Window cleaning',
      'Basic wax application'
    ],
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
      'Window cleaning',
      'Basic wax application'
    ],
    popular: true
  },
  {
    title: 'Large Vehicle',
    description: 'Great for SUVs & estates',
    price: '£65',
    duration: '45min - 1hr',
    vehicleTypes: ['BMW 5 Series', 'SUVs', 'Estates'],
    features: [
      'Exterior wash & dry',
      'Interior vacuum & clean',
      'Dashboard cleaning',
      'Wheel clean & shine',
      'Window cleaning',
      'Basic wax application'
    ],
    popular: false
  },
  {
    title: 'Extra Large Vehicle',
    description: 'Premium for big vehicles',
    price: '£70',
    duration: '45min - 1hr',
    vehicleTypes: ['Vans', 'Range Rover', '7-Seaters'],
    features: [
      'Exterior wash & dry',
      'Interior vacuum & clean',
      'Dashboard cleaning',
      'Wheel clean & shine',
      'Window cleaning',
      'Basic wax application'
    ],
    popular: false
  },
]

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

export default function ServicesSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="py-24 px-4 bg-background">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={isMounted ? "initial" : "animate"}
        animate="animate"
        variants={containerVariants}
        style={{ opacity: isMounted ? undefined : 1 }}
      >
        <motion.div 
          className="text-center mb-16" 
          variants={cardVariants}
          style={{ opacity: isMounted ? undefined : 1 }}
        >
          <Badge variant="secondary" className="mb-4">
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Choose Your Service
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional car detailing services tailored to your vehicle size
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.div 
              key={service.title} 
              variants={cardVariants}
              style={{ opacity: isMounted ? undefined : 1 }}
            >
              <Card className={`relative h-full hover:shadow-xl transition-all duration-300 group ${
                service.popular 
                  ? 'border-primary shadow-lg ring-1 ring-primary/20' 
                  : 'hover:border-primary/50'
              }`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{service.price}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Vehicle Examples</h4>
                    <div className="flex flex-wrap gap-1">
                      {service.vehicleTypes.slice(0, 3).map((type, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {service.vehicleTypes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{service.vehicleTypes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">What's Included</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {service.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                      {service.features.length > 4 && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            +{service.features.length - 4} more services
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    className={`w-full ${
                      service.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : ''
                    }`}
                    variant={service.popular ? "default" : "outline"}
                    asChild
                  >
                    <a href="/booking">
                      Book {service.title}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-16"
          variants={cardVariants}
          style={{ opacity: isMounted ? undefined : 1 }}
        >
          <div className="bg-muted/50 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-4">
              Not sure which service fits your vehicle?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <a href="/services">View Full Details</a>
              </Button>
              <Button asChild>
                <a href="/booking">Get Started</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
} 