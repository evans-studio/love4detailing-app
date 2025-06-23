"use client"

import { motion, Variants } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Clapham, London',
    service: 'Medium Vehicle Detail',
    rating: 5,
    text: 'Absolutely brilliant service! They came to my office and my car looked brand new when I finished work. The convenience is unmatched and the quality is outstanding.',
    vehicle: 'BMW 3 Series'
  },
  {
    name: 'Marcus Thompson',
    location: 'Brixton, London',
    service: 'Large Vehicle Detail',
    rating: 5,
    text: 'Professional, punctual, and perfect results. My SUV has never looked better. The team was friendly and efficient - highly recommend!',
    vehicle: 'Range Rover Sport'
  },
  {
    name: 'Emma Williams',
    location: 'Wandsworth, London',
    service: 'Small Vehicle Detail',
    rating: 5,
    text: 'Great value for money and so convenient. Booked online in minutes and they did an amazing job on my Mini. Will definitely be using again!',
    vehicle: 'Mini Cooper'
  },
  {
    name: 'David Chen',
    location: 'Battersea, London',
    service: 'Extra Large Vehicle Detail',
    rating: 5,
    text: 'Fantastic service for my work van. They managed to get it spotless inside and out. Professional team and fair pricing. 5 stars!',
    vehicle: 'Ford Transit'
  }
]

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const cardVariants: Variants = {
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

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background/95 to-background">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16" variants={cardVariants}>
          <Badge variant="secondary" className="mb-4">
            Customer Reviews
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers across London
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.name} variants={cardVariants}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={testimonial.rating} />
                    <Quote className="w-5 h-5 text-primary/60" />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {testimonial.service}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    <p className="text-xs text-primary font-medium">{testimonial.vehicle}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-16"
          variants={cardVariants}
        >
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <StarRating rating={5} />
              <span className="text-sm font-medium text-muted-foreground">
                4.9/5 from 200+ reviews
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Join Our Happy Customers
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Experience the Love4Detailing difference and see why we're London's trusted mobile car detailing service.
            </p>
            <a 
              href="/booking"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
            >
              Book Your Service Today
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
} 