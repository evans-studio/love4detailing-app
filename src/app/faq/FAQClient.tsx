'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { content } from '@/lib/content'

interface FAQItem {
  question: string
  answer: string
}

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
          <h1 className="text-3xl mt-4 mb-2 font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          
          <div className="mt-8 space-y-4">
            {content.faq.questions.map((item: FAQItem, index: number) => (
              <Card key={index} className="bg-black/20 border-none">
                <CardHeader 
                  className="p-4 cursor-pointer"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-white">
                      {item.question}
                    </CardTitle>
                    <ChevronDown 
                      className={cn(
                        "h-5 w-5 text-white/70 transition-transform",
                        openIndex === index && "rotate-180"
                      )}
                    />
                  </div>
                </CardHeader>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="p-4 pt-0">
                        <CardDescription className="text-white/70">
                          {item.answer}
                        </CardDescription>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 