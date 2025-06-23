"use client"

import { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/Card'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: "What areas do you cover in London?",
    answer: "We service South West London and surrounding areas including Clapham, Brixton, Battersea, Wandsworth, Putney, Balham, Tooting, and Streatham. Contact us to confirm availability in your specific area."
  },
  {
    question: "How long does a car detailing service take?",
    answer: "Our mobile car detailing service takes 45 minutes to 1 hour, depending on your vehicle size and condition. We're efficient while maintaining our high-quality standards."
  },
  {
    question: "Do I need to provide water or electricity?",
    answer: "No, we are completely mobile and self-sufficient. Our professional team arrives with all necessary equipment, water, and power supply. You just need to provide access to your vehicle."
  },
  {
    question: "What's included in the car detailing service?",
    answer: "Our comprehensive service includes exterior wash, interior vacuuming and cleaning, dashboard cleaning, window cleaning, tire shine, and final inspection. We use professional-grade products for showroom results."
  },
  {
    question: "How do I pay for the service?",
    answer: "We accept all major credit/debit cards, Apple Pay, Google Pay, and bank transfers. Payment is securely processed online when you book your appointment."
  },
  {
    question: "What if it rains on my appointment day?",
    answer: "We monitor weather conditions closely. If heavy rain is forecast, we'll contact you to reschedule at no extra cost. Light rain doesn't typically affect our service as we have protective equipment."
  },
  {
    question: "Do you offer any guarantees?",
    answer: "Yes! We offer a 100% satisfaction guarantee. If you're not completely happy with our service, we'll return to make it right or provide a full refund."
  },
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 24-48 hours in advance, though same-day appointments are often available. Our online booking system shows real-time availability."
  }
]

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background/95 to-background">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <Badge variant="secondary" className="mb-4">
            Got Questions?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our mobile car detailing service. 
            Can't find what you're looking for? Contact us directly.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-6 hover:bg-accent/50 transition-colors focus:outline-none focus:bg-accent/50"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {openIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-border pt-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-xl font-bold mb-3 text-foreground">
              Still Have Questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Our friendly team is here to help. Get in touch and we'll respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="mailto:hello@love4detailing.com"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
              >
                Email Us
              </a>
              <a 
                href="tel:07123456789"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
              >
                Call Us
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
} 