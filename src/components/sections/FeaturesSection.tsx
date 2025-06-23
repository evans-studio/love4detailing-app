"use client"

import { motion, Variants } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  MapPin, 
  Star, 
  Shield, 
  Award
} from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: 'Quick & Efficient',
    description: 'Professional service completed in 45min - 1hr',
    highlight: 'Fast Service'
  },
  {
    icon: MapPin,
    title: 'Mobile Service',
    description: 'We come to your location - home, office, or anywhere convenient',
    highlight: 'At Your Location'
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Professional-grade products and techniques for showroom results',
    highlight: 'Professional Grade'
  },
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Complete peace of mind with comprehensive insurance coverage',
    highlight: 'Insured & Safe'
  },
  {
    icon: Award,
    title: 'Satisfaction Guaranteed',
    description: 'Not happy? We\'ll make it right or your money back',
    highlight: '100% Guarantee'
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Why Choose Love4Detailing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Professional Car Care Made Simple
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the difference with our professional mobile car detailing service. 
            We bring the car wash to you with premium quality and unbeatable convenience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Top row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {features.slice(0, 3).map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={feature.title}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 group">
                    <CardContent className="p-6 text-center">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <Badge 
                          variant="outline" 
                          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs border-primary/20 bg-background"
                        >
                          {feature.highlight}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          {/* Bottom row - 2 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {features.slice(3, 5).map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={feature.title}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 group">
                    <CardContent className="p-6 text-center">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <Badge 
                          variant="outline" 
                          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs border-primary/20 bg-background"
                        >
                          {feature.highlight}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Ready to Experience the Difference?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join hundreds of satisfied customers who trust Love4Detailing for their car care needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/booking"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
              >
                Book Your Service
              </a>
              <a 
                href="/services"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
              >
                View All Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 