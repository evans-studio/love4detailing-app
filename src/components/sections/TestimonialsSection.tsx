"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Richmond",
    rating: 5,
    comment: "Absolutely amazing service! They came to my office and my car looked brand new when I finished work. Will definitely be using them again."
  },
  {
    name: "Michael Thompson",
    location: "Putney",
    rating: 5,
    comment: "Professional, punctual, and the results were outstanding. The convenience of mobile service is exactly what I needed."
  },
  {
    name: "Emma Williams",
    location: "Wimbledon",
    rating: 5,
    comment: "I've tried several car cleaning services but Love4Detailing is by far the best. Attention to detail is incredible."
  },
  {
    name: "David Brown",
    location: "Kingston",
    rating: 5,
    comment: "Exceptional service from start to finish. Easy booking, friendly staff, and my car has never looked better."
  },
  {
    name: "Lisa Chen",
    location: "Clapham",
    rating: 5,
    comment: "The team went above and beyond. They even cleaned areas I didn't expect. Highly recommend to anyone in London."
  },
  {
    name: "James Wilson",
    location: "Battersea",
    rating: 5,
    comment: "Fantastic value for money. The mobile service saved me so much time and the quality is top-notch."
  }
]

const TestimonialsSection = () => {
  return (
    <section className="py-40 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            What Our
            <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers across South West London
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-black/20 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="p-6">
                  {/* Star Rating */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  {/* Comment */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                  
                  {/* Customer Info */}
                  <div className="border-t border-purple-500/20 pt-4">
                    <h4 className="font-semibold text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-purple-400 text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-2xl font-bold text-white">4.9</span>
              </div>
              <div className="h-8 w-px bg-purple-500/30"></div>
              <div className="text-gray-300">
                <div className="font-semibold">200+ Reviews</div>
                <div className="text-sm">Google & Trustpilot</div>
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold text-white mb-4">
              Join Our Happy Customers
            </h3>
            <p className="text-gray-300 mb-6">
              Experience the same exceptional service that keeps our customers coming back
            </p>
            <Link href="/booking">
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                Book Your Service
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection 