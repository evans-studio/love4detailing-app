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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
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
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Drive a Car That Looks
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/80">
              Brand New Every Time
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
              variant="default"
              className="min-w-[200px] bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-opacity"
              asChild
            >
              <Link href="/booking">
                Let&apos;s Get Started
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="min-w-[200px] border-white/10 hover:bg-white/5"
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
                className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 mb-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary/80" />
                </div>
                <span className="text-sm font-medium text-white/80">{name}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
} 