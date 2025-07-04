'use client'

import { useEffect, useRef } from 'react'
import { HeroSection } from '@/components/sections/HeroSection'
import { EssentialCleanPricingSection } from '@/components/sections/EssentialCleanPricingSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import ServiceAreaMap from '@/components/sections/ServiceAreaMap'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { FooterSection } from '@/components/sections/FooterSection'
import Link from 'next/link'
import { initGSAPBackground } from '@/lib/animations/backgroundAnimations'
import { initSectionTransitions } from '@/lib/animations/sectionTransitions'
import { buttonHover } from '@/lib/animations/responsive-animations'
import { ClientConfig } from '@/config/schema'

interface HomeClientProps {
  config: ClientConfig
}

export function HomeClient({ config }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize background animations
    if (containerRef.current) {
      const cleanup = initGSAPBackground(containerRef.current)
      
      // Initialize section transitions
      const cleanupTransitions = initSectionTransitions()
      
      // Initialize button hover effects
      const buttons = document.querySelectorAll('button, a')
      buttons.forEach(button => {
        if (button instanceof HTMLElement) {
          buttonHover(button)
        }
      })

      return () => {
        if (cleanup) cleanup()
        if (cleanupTransitions) cleanupTransitions()
      }
    }
  }, [])

  const essentialCleanService = config.pricing.services.find(s => s.id === 'essential-clean');

  return (
    <div ref={containerRef} className="relative min-h-screen w-full">
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
      
      {/* Main content sections with proper background handling */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-true-black/50 to-true-black pointer-events-none" />
        <HeroSection content={config.content.hero} />
        {essentialCleanService && (
          <EssentialCleanPricingSection 
            service={essentialCleanService}
            vehicleSizes={config.pricing.vehicleSizes}
          />
        )}
        <HowItWorksSection />
        <ServiceAreaMap />
        <FeaturesSection />
        <FAQSection 
          title="Frequently Asked Questions" 
          subtitle="Everything you need to know about our mobile car detailing service" 
          questions={config.content.faq} 
        />
        <FooterSection />
      </div>
    </div>
  )
} 