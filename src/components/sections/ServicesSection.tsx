"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { ServiceIcons } from '@/components/ui/icons'

import { ArrowRight, Star, Clock, Shield } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
}

const services = [
  {
    id: 'small',
    title: 'Small Vehicle',
    description: 'Fiesta, Polo, Mini, Corsa',
    price: '£55',
    duration: '45-60 mins',
    rating: 4.9,
    features: ['Exterior wash & dry', 'Interior vacuum', 'Window cleaning', 'Tyre shine'],
    icon: ServiceIcons.ExteriorCleaning,
    popular: false
  },
  {
    id: 'medium',
    title: 'Medium Vehicle',
    description: 'Focus, Golf, Civic, Astra',
    price: '£60',
    duration: '45-60 mins',
    rating: 4.9,
    features: ['Exterior wash & dry', 'Interior vacuum', 'Window cleaning', 'Tyre shine'],
    icon: ServiceIcons.InteriorDetailing,
    popular: true
  },
  {
    id: 'large',
    title: 'Large Vehicle',
    description: 'BMW 5 Series, SUVs, Estates',
    price: '£65',
    duration: '45-60 mins',
    rating: 4.9,
    features: ['Exterior wash & dry', 'Interior vacuum', 'Window cleaning', 'Tyre shine'],
    icon: ServiceIcons.PaintProtection,
    popular: false
  },
  {
    id: 'extraLarge',
    title: 'Extra Large Vehicle',
    description: 'Vans, Range Rovers, 7-Seaters',
    price: '£70',
    duration: '45-60 mins',
    rating: 4.9,
    features: ['Exterior wash & dry', 'Interior vacuum', 'Window cleaning', 'Tyre shine'],
    icon: ServiceIcons.EngineCare,
    popular: false
  }
]

export default function ServicesSection() {
  return (
    <section className="py-40 px-4 relative">
      {/* Content */}
      <div className="relative z-20">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Section Header - Responsive */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4 lg:space-y-6">
              <Badge className="mx-auto mb-3 sm:mb-4 bg-deep-purple/20 text-deep-purple border-deep-purple/30">
                Vehicle Packages
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-text">
                Pricing by Vehicle Size
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-secondary-text max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                Professional mobile valeting service with pricing based on your vehicle size. 
                All packages include the same premium service level.
              </p>
            </motion.div>
          </motion.div>

          {/* Services Grid - Fully Responsive */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16"
          >
            {services.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <Card variant="theme" className="h-full group transition-all duration-300">
                  <CardHeader className="p-4 sm:p-5 lg:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-deep-purple rounded-lg sm:rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-deep-purple/30 transition-all duration-300">
                          <service.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-text" />
                        </div>
                        {service.popular && (
                          <Badge className="bg-rich-crimson/20 text-rich-crimson border-rich-crimson/30 text-xs px-2 py-1">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-platinum-silver fill-platinum-silver" />
                        <span className="text-xs sm:text-sm font-medium text-primary-text">{service.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-primary-text mb-2 group-hover:text-deep-purple transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary-text leading-relaxed mb-3 sm:mb-4">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-deep-purple">
                        {service.price}
                      </span>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-secondary-text">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {service.duration}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-deep-purple flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-secondary-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="themeSecondary"
                      className="w-full group/btn text-xs sm:text-sm" 
                      asChild
                    >
                      <Link href="/booking">
                        Book Now
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section - Responsive */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-center bg-gradient-to-r from-deep-purple/10 to-rich-crimson/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 border border-deep-purple/20"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary-text mb-3 sm:mb-4">
              Need a Custom Service?
            </h3>
            <p className="text-sm sm:text-base text-secondary-text mb-4 sm:mb-6 max-w-xs sm:max-w-md lg:max-w-2xl mx-auto">
              Can't find exactly what you're looking for? We offer custom packages 
              tailored to your specific needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center max-w-xs sm:max-w-none mx-auto">
              <Button 
                variant="theme" 
                className="w-full sm:w-auto text-sm sm:text-base"
                asChild
              >
                <Link href="/booking">
                  Get Custom Quote
                </Link>
              </Button>
              <Button 
                variant="themeGhost" 
                className="w-full sm:w-auto text-sm sm:text-base"
                asChild
              >
                <Link href="tel:07123456789">
                  Call Us: 07123 456 789
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 