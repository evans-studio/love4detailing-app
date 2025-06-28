"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CalendarCheck, 
  Car, 
  Sparkles, 
  CreditCard 
} from 'lucide-react'

const steps = [
  {
    step: 1,
    title: "Book Online",
    description: "Choose your vehicle size and preferred service date",
    icon: CalendarCheck
  },
  {
    step: 2,
    title: "Vehicle Details",
    description: "Tell us about your car and any specific requirements",
    icon: Car
  },
  {
    step: 3,
    title: "We Clean",
    description: "Our experts detail your car at your location",
    icon: Sparkles
  },
  {
    step: 4,
    title: "Easy Payment",
    description: "Pay securely after the service is completed",
    icon: CreditCard
  }
]

export const HowItWorksSection = () => {
  return (
    <section className="min-h-[100svh] w-full flex items-center justify-center overflow-hidden py-16">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F8F4EB] mb-6">
              How It
              <span className="block bg-gradient-to-r from-[#9747FF] to-[#9747FF] bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-[#F8F4EB]/80 max-w-3xl mx-auto">
              Getting your car detailed has never been easier. Here's our simple 4-step process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#9747FF] rounded-full flex items-center justify-center text-[#F8F4EB] font-bold text-lg shadow-lg shadow-[#9747FF]/25">
                    {step.step}
                  </div>
                  
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#141414]/25 to-[#1E1E1E]/25 backdrop-blur-md border border-[#9747FF]/30 rounded-[1.25rem] flex items-center justify-center group-hover:border-[#9747FF]/50 group-hover:shadow-lg group-hover:shadow-[#9747FF]/20 transition-all duration-300">
                    <step.icon className="w-10 h-10 text-[#9747FF] group-hover:text-[#9747FF] transition-colors duration-300" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-[#F8F4EB] mb-3 group-hover:text-[#9747FF] transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-[#F8F4EB]/80 leading-relaxed">
                  {step.description}
                </p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 transform translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-[#9747FF]/50 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="bg-gradient-to-br from-[#141414]/25 to-[#1E1E1E]/25 backdrop-blur-md border border-[#9747FF]/20 rounded-[1.25rem] p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-[#F8F4EB] mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-[#F8F4EB]/80 mb-6">
                Book your service now and experience the convenience of professional mobile car detailing
              </p>
              <Link href="/booking">
                <button className="bg-[#9747FF] hover:bg-[#9747FF]/90 text-[#F8F4EB] px-8 py-3 rounded-[0.5rem] font-semibold shadow-lg shadow-[#9747FF]/25 hover:shadow-[#9747FF]/40 transition-all duration-300">
                  Book Your Service
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 