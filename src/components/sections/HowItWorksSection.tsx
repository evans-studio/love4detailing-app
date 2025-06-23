"use client"

import { motion, Variants } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react'

const steps = [
  {
    icon: Calendar,
    title: 'Book Online',
    description: 'Choose your service and preferred time slot in just a few clicks',
    detail: 'Select vehicle size, add-ons, and schedule your appointment'
  },
  {
    icon: MapPin,
    title: 'We Come to You',
    description: 'Our professional team arrives at your location with all equipment',
    detail: 'Home, office, or anywhere convenient - we bring everything needed'
  },
  {
    icon: Sparkles,
    title: 'Enjoy the Results',
    description: 'Relax while we transform your car to showroom condition',
    detail: '45min-1hr later, your car looks brand new and you earn rewards'
  }
]

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
}

const stepVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
}

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-background/95">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16" variants={stepVariants}>
          <Badge variant="secondary" className="mb-4">
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting your car detailed has never been easier. Our streamlined process 
            means you can book and relax while we handle everything else.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="flex justify-between items-center px-12">
              <ArrowRight className="w-8 h-8 text-primary/30" />
              <ArrowRight className="w-8 h-8 text-primary/30" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  className="relative text-center group"
                  variants={stepVariants}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold z-10">
                    {index + 1}
                  </div>

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground font-medium">
                      {step.description}
                    </p>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          variants={stepVariants}
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              The whole process takes less than 2 minutes to book. Your car will thank you!
            </p>
            <a 
              href="/booking"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
            >
              Book Your Service
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
} 