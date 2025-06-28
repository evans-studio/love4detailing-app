"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import { HeroSection as HeroContent } from '@/config/schema';

interface HeroSectionProps {
  content: HeroContent
}

export const HeroSection = ({ content }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pb-16">
      {/* Content container */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main heading */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6 text-[#F8F4EB]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8F4EB] to-[#9747FF]">
              {content.title}
            </span>
          </motion.h1>
          
          {/* Subheading */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#F8F4EB]/90 max-w-4xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {content.subtitle}
          </motion.p>

          {/* CTA buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/booking" className="w-full sm:w-auto">
              <Button 
                variant="default"
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-4 bg-[#9747FF] hover:bg-[#9747FF]/90 text-white font-semibold rounded-[0.5rem] transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                {content.ctaButtonText}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center">
        <motion.div
          className="flex flex-col items-center gap-2 text-[#F8F4EB]/60 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span>Scroll to explore</span>
          <motion.div
            className="w-0.5 h-8 bg-[#9747FF]/40"
            animate={{
              scaleY: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}; 