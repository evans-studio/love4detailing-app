"use client"

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Section, FlexContainer } from '@/components/ui/Container'
import ResponsiveImage from '@/components/ui/ResponsiveImage'
import { animations } from '@/lib/animations/responsive-animations'
import { responsiveClasses } from '@/lib/constants/breakpoints'

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    // Animate heading text
    if (headingRef.current) {
      animations.revealText(headingRef.current, {
        y: 30,
        duration: animations.timings.slow,
        stagger: 0.02,
        ease: animations.easings.smooth,
        scrollTrigger: false
      })
    }

    // Fade in description text
    if (textRef.current) {
      animations.fadeIn(textRef.current, {
        y: 20,
        delay: 0.5,
        duration: animations.timings.medium,
        ease: animations.easings.smooth,
        scrollTrigger: false
      })
    }

    // Scale up CTA buttons
    if (ctaRef.current) {
      animations.scaleIn(ctaRef.current, {
        scale: 0.9,
        duration: animations.timings.medium,
        ease: animations.easings.bounce,
        scrollTrigger: false
      })
    }

    // Slide in image
    if (imageRef.current) {
      animations.slideIn(imageRef.current, {
        x: 50,
        duration: animations.timings.slow,
        ease: animations.easings.smooth,
        scrollTrigger: false
      })
    }
  }, [])

  return (
    <div 
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#141414] via-[#141414] to-[#8A2B85]/20" />

      {/* Content container */}
      <FlexContainer
        direction="col"
        items="center"
        justify="center"
        className="relative z-10 py-16 lg:py-24"
      >
        <div className="w-full max-w-7xl">
          <FlexContainer
            direction="col"
            items="center"
            justify="center"
            gap="lg"
            className="lg:flex-row lg:items-center lg:justify-between"
          >
            {/* Text content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 
                ref={headingRef}
                className={`
                  ${responsiveClasses.heading1}
                  font-bold text-[#F8F4EB]
                  mb-6
                `}
              >
                Premium Car Detailing in South West London
              </h1>
              
              <p 
                ref={textRef}
                className={`
                  text-lg sm:text-xl lg:text-2xl
                  text-[#F8F4EB]/80
                  mb-8 lg:mb-10
                  max-w-xl
                `}
              >
                Professional mobile car detailing service at your doorstep. 
                Experience the finest care for your vehicle.
              </p>

              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking">
                  <Button 
                    variant="theme"
                    size="lg"
                    className="w-full sm:w-auto text-lg"
                  >
                    Book Now
                  </Button>
                </Link>
                <Link href="/services">
                  <Button 
                    variant="themeSecondary"
                    size="lg"
                    className="w-full sm:w-auto text-lg"
                  >
                    View Services
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div ref={imageRef} className="w-full lg:w-1/2 mt-12 lg:mt-0">
              <ResponsiveImage
                src="/assets/hero-car.webp"
                alt="Premium car detailing service"
                sizes={{
                  xs: '100vw',
                  sm: '80vw',
                  md: '70vw',
                  lg: '45vw',
                  xl: '40vw',
                }}
                className="rounded-2xl shadow-2xl shadow-[#8A2B85]/20"
              />
            </div>
          </FlexContainer>
        </div>
      </FlexContainer>

      {/* Scroll indicator */}
      <motion.div
        className="
          absolute bottom-8 left-1/2 -translate-x-1/2
          hidden sm:flex flex-col items-center gap-2
          text-[#C7C7C7] text-sm
        "
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <span>Scroll to explore</span>
        <motion.div
          className="w-0.5 h-8 bg-[#8A2B85]/20"
          animate={{
            scaleY: [1, 1.5, 1],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </div>
  )
} 