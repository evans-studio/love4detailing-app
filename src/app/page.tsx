// Server Component wrapper for proper metadata and static optimization
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Love4Detailing - Professional Mobile Car Valeting Services',
  description: 'Premium mobile car valeting and detailing services that come to you. Book your appointment today.',
}

export default function HomePage() {
  return <HomeClient />
}

// Client Component for interactive animations and effects
"use client"

import { useEffect, useRef } from 'react'
import { HeroSection } from '@/components/sections/HeroSection'
import { EssentialCleanPricingSection } from '@/components/sections/EssentialCleanPricingSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { ServiceAreaMap } from '@/components/sections/ServiceAreaMap'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { FooterSection } from '@/components/sections/FooterSection'
import Link from 'next/link'
import { initGSAPBackground } from '@/lib/animations/backgroundAnimations'
import { initSectionTransitions } from '@/lib/animations/sectionTransitions'
import { buttonHover } from '@/lib/animations/responsive-animations'

function HomeClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize background animations
    if (containerRef.current) {
      const cleanup = initGSAPBackground(containerRef.current)
      
      // Initialize section transitions
      initSectionTransitions()
      
      // Initialize button hover effects
      const buttons = document.querySelectorAll('button, a')
      buttons.forEach(button => buttonHover(button))

      return () => {
        cleanup()
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Hidden navigation for accessibility - screen reader accessible */}
      <nav 
        id="navigation"
        className="sr-only" 
        role="navigation" 
        aria-label="Main navigation"
      >
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/booking">Book Now</Link></li>
          <li><Link href="/faq">FAQ</Link></li>
        </ul>
      </nav>
      
      <HeroSection />
      <EssentialCleanPricingSection />
      <HowItWorksSection />
      <ServiceAreaMap />
      <FeaturesSection />
      <FAQSection />
      <FooterSection />
    </div>
  )
}
