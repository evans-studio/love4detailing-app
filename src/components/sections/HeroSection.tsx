"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { ServiceIcons } from '@/components/ui/icons'

import { useEffect, useState } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
}

const services = [
  { name: 'Exterior Cleaning', Icon: ServiceIcons.ExteriorCleaning },
  { name: 'Interior Detailing', Icon: ServiceIcons.InteriorDetailing },
  { name: 'Paint Protection', Icon: ServiceIcons.PaintProtection },
  { name: 'Engine Care', Icon: ServiceIcons.EngineCare },
]

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
            Premium Car Detailing
            <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              That Comes to You
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professional mobile car valeting services delivered to your doorstep. 
            Experience the luxury of pristine vehicle care without leaving home.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Link href="/booking">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 min-w-[200px] h-14 text-lg font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
              >
                Book Now
              </Button>
            </Link>
            <Link href="/services">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 min-w-[200px] h-14 text-lg font-semibold backdrop-blur-sm bg-black/20"
              >
                View Services
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 