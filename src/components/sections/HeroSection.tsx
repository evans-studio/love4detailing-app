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
    <div className="relative min-h-screen overflow-hidden approved-gradient">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(138,43,133,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(138,43,133,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-purple/20 via-transparent to-rich-crimson/10" />
      
      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial={isMounted ? "hidden" : "visible"}
        animate="visible"
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 md:px-6"
        style={{ opacity: isMounted ? undefined : 1 }}
      >
        <motion.div 
          variants={itemVariants} 
          className="space-y-8 max-w-4xl"
          style={{ opacity: isMounted ? undefined : 1 }}
        >
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
            <span className="text-gradient-purple">
              Drive a Car That Looks
            </span>
            <br />
            <span className="text-gradient-brand">
              Brand New Every Time
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-secondary-text max-w-2xl mx-auto leading-relaxed">
            Effortlessly book car detailing, washes, and maintenance services anytime, 
            anywhere. Explore top-rated services and enjoy a clean, polished, and 
            well-maintained ride!
          </p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
            style={{ opacity: isMounted ? undefined : 1 }}
          >
            <Button 
              size="lg" 
              variant="premium"
              className="min-w-[200px]"
              asChild
            >
              <Link href="/booking">
                Let&apos;s Get Started
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="min-w-[200px]"
              asChild
            >
              <Link href="/services">
                View Services
              </Link>
            </Button>
          </motion.div>

          {/* Service Icons */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12"
            style={{ opacity: isMounted ? undefined : 1 }}
          >
            {services.map(({ name, Icon }) => (
              <div 
                key={name}
                className="flex flex-col items-center p-4 rounded-xl bg-true-black/50 backdrop-blur-sm border border-deep-purple/20 hover:border-deep-purple/50 hover:bg-deep-purple/5 glow-purple transition-all duration-300 group hover-lift"
              >
                <div className="w-12 h-12 mb-3 rounded-lg bg-deep-purple flex items-center justify-center group-hover:shadow-lg group-hover:shadow-deep-purple/30 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary-text transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-secondary-text group-hover:text-primary-text transition-colors duration-300">{name}</span>
              </div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 pt-8 border-t border-deep-purple/20"
            style={{ opacity: isMounted ? undefined : 1 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-deep-purple rounded-full animate-purple-glow"></div>
              <span className="text-sm text-secondary-text">200+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-deep-purple rounded-full animate-purple-glow"></div>
              <span className="text-sm text-secondary-text">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-deep-purple rounded-full animate-purple-glow"></div>
              <span className="text-sm text-secondary-text">South West London</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
} 