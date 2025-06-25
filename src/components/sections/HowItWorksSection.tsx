"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, MapPin, Car, Star } from 'lucide-react'


const steps = [
  {
    icon: Calendar,
    title: "Book Online",
    description: "Choose your service and preferred time slot through our easy booking system.",
    step: "01"
  },
  {
    icon: MapPin,
    title: "We Come to You",
    description: "Our professional team arrives at your location with all necessary equipment.",
    step: "02"
  },
  {
    icon: Car,
    title: "Expert Service",
    description: "Enjoy premium car detailing using professional-grade products and techniques.",
    step: "03"
  },
  {
    icon: Star,
    title: "Perfect Results",
    description: "Drive away with a spotless vehicle that looks and feels brand new.",
    step: "04"
  }
]

const HowItWorksSection = () => {
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
            How It
            <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Getting your car detailed has never been easier. Here's our simple 4-step process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative">
                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/25">
                  {step.step}
                </div>
                
                {/* Icon container */}
                <div className="w-20 h-20 mx-auto mb-6 bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl flex items-center justify-center group-hover:border-purple-400/50 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300">
                  <step.icon className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                {step.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {step.description}
              </p>
              
              {/* Connector line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 transform translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-300 mb-6">
              Book your service now and experience the convenience of professional mobile car detailing
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

export default HowItWorksSection 