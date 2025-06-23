"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  Star,
  CheckCircle
} from 'lucide-react'

const benefits = [
  'Professional mobile service',
  'Fully insured & guaranteed',
  'Transparent pricing',
  'Same-day availability',
  'Eco-friendly products'
]

export default function CTASection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <motion.div
        className="max-w-6xl mx-auto relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                Ready to Book?
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Get Your Car Looking
                <span className="block text-primary">
                  Brand New Today
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join hundreds of satisfied customers across London. Professional mobile 
                car detailing that comes to you - no queues, no waiting, just results.
              </p>
            </div>

            {/* Benefits List */}
            <div className="grid grid-cols-1 gap-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-primary">4.9</span>
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">45min</div>
                <div className="text-sm text-muted-foreground">Service Time</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground group"
                asChild
              >
                <Link href="/booking">
                  Book Your Service Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary/20 hover:bg-primary/5"
                asChild
              >
                <Link href="/services">
                  View Pricing
                </Link>
              </Button>
            </div>

            {/* Quick Info */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Available Mon-Sat 10:00-17:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>South West London & Areas</span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <motion.div
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Mock Phone Interface */}
              <div className="bg-background rounded-xl p-6 shadow-xl border border-border">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12">
                      <Image
                        src="/logo.png"
                        alt="Love4Detailing Logo"
                        fill
                        className="object-contain"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Love4Detailing</h3>
                      <p className="text-sm text-muted-foreground">Mobile Car Detailing</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <div className="text-sm font-medium text-foreground mb-1">Medium Vehicle Detail</div>
                      <div className="text-lg font-bold text-primary">£60</div>
                      <div className="text-xs text-muted-foreground">45min - 1hr service</div>
                    </div>
                    
                    <div className="bg-green-500/10 rounded-lg p-3">
                      <div className="text-sm font-medium text-green-700 dark:text-green-400">
                        ✓ Available Today
                      </div>
                      <div className="text-xs text-muted-foreground">Next slot: 2:30 PM</div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Book This Service
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Star className="w-6 h-6" />
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-background border border-border rounded-full p-3 shadow-lg"
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <CheckCircle className="w-6 h-6 text-primary" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
} 