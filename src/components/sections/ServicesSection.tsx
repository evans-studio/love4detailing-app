"use client"

import { motion } from 'framer-motion'
import { content } from "@/lib/content"

export const ServicesSection = () => {
  return (
    <section className="h-[100vh] w-full flex items-center justify-center overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#F8F4EB]">
              {content.services.heading}
            </h2>
            <p className="text-lg sm:text-xl text-[#F8F4EB]/80 max-w-3xl mx-auto">
              {content.services.subheading}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.services.cards.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gradient-to-br from-[#141414]/25 to-[#1E1E1E]/25 backdrop-blur-md rounded-[1.25rem] p-6 border border-[#8A2B85]/20 hover:border-[#8A2B85]/40 transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-2 text-[#F8F4EB]">
                  {service.title}
                </h3>
                <p className="text-[#F8F4EB]/70 mb-2 text-sm">
                  {service.description}
                </p>
                <p className="text-[#8A2B85] font-bold text-xl mb-4">
                  {service.price}
                </p>
                <ul className="space-y-2">
                  {service.features?.map((feature, i) => (
                    <li key={i} className="flex items-center text-[#F8F4EB]/60 text-sm">
                      <span className="w-1.5 h-1.5 bg-[#8A2B85] rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 