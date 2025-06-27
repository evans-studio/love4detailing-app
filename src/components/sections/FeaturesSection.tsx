"use client"

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { MapPin, Clock, Shield, Star, Users, Leaf } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: "Mobile Service",
    description: "We come directly to your location - home, office, or anywhere convenient for you."
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Book appointments that fit your schedule, including evenings and weekends."
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "Complete peace of mind with comprehensive insurance coverage for all services."
  },
  {
    icon: Star,
    title: "Premium Products",
    description: "We use only the highest quality professional-grade cleaning products and equipment."
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Trained and experienced professionals who care about your vehicle as much as you do."
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Environmentally conscious cleaning solutions that are safe for you and the planet."
  }
]

export const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Why Choose
            <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Love4Detailing
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the difference with our professional mobile car detailing service
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-black/20 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-[0.75rem] flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
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
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-[1rem] p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Professional Service You Can Trust
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              With years of experience and hundreds of satisfied customers across South West London, 
              we're committed to delivering exceptional results every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-[0.5rem] font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                Get Started Today
              </button>
              <button className="bg-transparent border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 px-8 py-3 rounded-[0.5rem] font-semibold backdrop-blur-sm transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 