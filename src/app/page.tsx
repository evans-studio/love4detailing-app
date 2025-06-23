"use client"

import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'
import FooterSection from '@/components/sections/FooterSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </>
  )
}
