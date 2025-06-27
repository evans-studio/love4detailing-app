// Server Component wrapper for proper metadata and static optimization
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Love4Detailing',
  description: 'Frequently asked questions about our car valeting services.',
}

export default function FAQPage() {
  return <FAQClient />
}

// Client Component for interactive FAQ features
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "What areas do you cover?",
    answer: "We currently service the Greater Manchester area, including surrounding towns and suburbs within a 20-mile radius of Manchester city center."
  },
  {
    question: "How long does a typical service take?",
    answer: "Service duration varies depending on the package chosen and your vehicle's size/condition. Basic services take 1-2 hours, while premium detailing can take 4-6 hours."
  },
  {
    question: "Do I need to provide water or electricity?",
    answer: "No, we are fully mobile and self-sufficient. Our van is equipped with its own water tank and power supply."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, Apple Pay, Google Pay, and bank transfers. Payment is required at the time of booking."
  },
  {
    question: "What if it rains on my appointment day?",
    answer: "We monitor weather conditions and will contact you if rescheduling is necessary. You can also opt to use our pop-up shelter for protection."
  },
  {
    question: "Do you offer gift vouchers?",
    answer: "Yes, we offer digital gift vouchers for all our services. These can be purchased online and are valid for 12 months."
  }
]

function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F8F4EB] text-center mb-4 sm:mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-[#C7C7C7] text-sm sm:text-base text-center mb-8 sm:mb-12">
            Find answers to common questions about our services
          </p>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    "bg-[#1E1E1E]/80 border-[#8A2B85]/20",
                    "backdrop-blur-sm",
                    "touch-target min-h-[88px]",
                    "cursor-pointer hover:bg-[#1E1E1E]/70",
                    "transition-all duration-200"
                  )}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base sm:text-lg text-[#F8F4EB]">
                      {faq.question}
                    </CardTitle>
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 text-[#C7C7C7] transition-transform duration-200",
                        openIndex === index && "transform rotate-180"
                      )} 
                    />
                  </CardHeader>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardContent>
                          <CardDescription className="text-[#C7C7C7]">
                            {faq.answer}
                          </CardDescription>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 