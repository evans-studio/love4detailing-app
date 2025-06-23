'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

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

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{faq.answer}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 