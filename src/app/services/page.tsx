'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Car, Clock, CheckCircle, ArrowLeft } from 'lucide-react'

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

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            Our Services
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">Professional Car Detailing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect service for your vehicle. All services include professional mobile detailing at your location.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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

                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Vehicle Examples</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.vehicleTypes.map((type, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">What's Included</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Perfect For</h4>
                    <p className="text-sm text-muted-foreground">
                      {service.bestFor.join(', ')}
                    </p>
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
                    <Link href="/booking">
                      Book {service.title}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-muted/50 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Book Your Service?
            </h3>
            <p className="text-muted-foreground mb-6">
              Professional mobile car detailing that comes to you. No queues, no waiting, just results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/booking">
                  Book Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
} 