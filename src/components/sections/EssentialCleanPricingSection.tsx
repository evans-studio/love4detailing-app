"use client"

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// Reusable data structure for easy content management
const essentialFeatures = [
  "Exterior wash & dry",
  "Interior vacuum",
  "Window cleaning",
  "Tyre shine"
]

const vehicles = [
  {
    size: "Small",
    price: "£55",
    description: "Perfect for compact cars and small SUVs"
  },
  {
    size: "Medium",
    price: "£60",
    description: "Focus, Golf, Civic, Astra"
  },
  {
    size: "Large",
    price: "£65",
    description: "BMW 5 Series, SUVs, Estates"
  },
  {
    size: "Extra Large",
    price: "£70",
    description: "Vans, Range Rovers, 7-Seaters"
  }
]

export const EssentialCleanPricingSection = () => {
  return (
    <section className="relative w-full py-24">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <Badge 
            variant="outline" 
            className="mb-4 border-[#8A2B85] text-[#8A2B85]"
          >
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#F8F4EB] tracking-tight">
            Essential Clean
          </h2>
          
          {/* Features List */}
          <div className="max-w-2xl mx-auto">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {essentialFeatures.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center text-stone-300 bg-white/5 backdrop-blur-sm rounded-lg p-3"
                >
                  <span className="w-2 h-2 bg-[#8A2B85] rounded-full mr-3" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.size}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={cn(
                "relative h-full backdrop-blur-sm",
                "bg-white/5 hover:bg-white/10",
                "border border-white/10 hover:border-[#8A2B85]/50",
                "transition-all duration-300 ease-out",
                "group"
              )}>
                <div className="p-6">
                  {/* Glassmorphism effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-[#F8F4EB] mb-2">
                      {vehicle.size}
                    </h3>
                    <p className="text-3xl font-bold text-[#8A2B85] mb-4">
                      {vehicle.price}
                    </p>
                    <p className="text-sm text-stone-300 mb-6">
                      {vehicle.description}
                    </p>
                    <Button 
                      variant="outline"
                      className="w-full bg-transparent border-[#8A2B85] text-[#8A2B85] hover:bg-[#8A2B85] hover:text-white transition-colors duration-300"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 