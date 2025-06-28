'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { content } from '@/lib/content'

export function FAQClient() {
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
          <h1 className={cn(
            "text-3xl font-bold mt-4 mb-2",
            "sm:text-4xl lg:text-5xl",
            "text-[#F8F4EB] text-center",
            "bg-gradient-to-r from-[#F8F4EB] to-[#9747FF]",
            "bg-clip-text text-transparent",
            "tracking-tight leading-tight"
          )}>
            {content.faq.title}
          </h1>
          <p className="text-[#C7C7C7] text-sm sm:text-base text-center mb-8 sm:mb-12">
            {content.faq.subtitle}
          </p>
          <div className="space-y-4">
            {content.faq.questions.map((faq, index) => (
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