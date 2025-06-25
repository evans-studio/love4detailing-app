"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react'

const CTASection = () => {
  return (
    <section className="py-40 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
            {/* Purple accent gradients */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -translate-y-32"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-700/20 rounded-full blur-3xl translate-y-32"></div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Ready to Transform
                  <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    Your Vehicle?
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Join hundreds of satisfied customers across South West London. 
                  Book your premium mobile car detailing service today and experience the difference.
                </p>
              </motion.div>

              {/* Features row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <div className="flex items-center justify-center gap-3 text-gray-300">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span>Same Day Service</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span>Mobile Service</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link href="/booking">
                  <Button 
                    variant="theme"
                    size="lg"
                    className="min-w-[200px] h-14 text-lg font-semibold group"
                  >
                    Book Your Service
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button 
                    variant="themeSecondary" 
                    size="lg"
                    className="min-w-[200px] h-14 text-lg font-semibold"
                  >
                    View Pricing
                  </Button>
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="mt-8 pt-8 border-t border-purple-500/20"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="text-gray-300">
                    <div className="text-2xl font-bold text-white mb-1">200+</div>
                    <div className="text-sm">Happy Customers</div>
                  </div>
                  <div className="text-gray-300">
                    <div className="text-2xl font-bold text-white mb-1">100%</div>
                    <div className="text-sm">Satisfaction Guarantee</div>
                  </div>
                  <div className="text-gray-300">
                    <div className="text-2xl font-bold text-white mb-1">24/7</div>
                    <div className="text-sm">Customer Support</div>
                  </div>
                  <div className="text-gray-300">
                    <div className="text-2xl font-bold text-white mb-1">Insured</div>
                    <div className="text-sm">Fully Covered</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection 