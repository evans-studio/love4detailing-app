"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: "How does the mobile service work?",
    answer: "We bring all necessary equipment and supplies directly to your location. Simply choose your preferred time slot, and our professional team will arrive with everything needed to detail your vehicle at your home, office, or any convenient location."
  },
  {
    question: "What areas do you cover?",
    answer: "We proudly serve South West London including Richmond, Putney, Wimbledon, Kingston, Clapham, Battersea, and surrounding areas. Contact us to confirm coverage for your specific location."
  },
  {
    question: "How long does a typical service take?",
    answer: "Service time varies by package: Express Wash (30-45 mins), Interior/Exterior Details (45-60 mins), Full Service Detail (1.5-2 hours). We'll provide an estimated time when you book."
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "Your satisfaction is our priority. If you're not completely happy with our work, we'll return to make it right at no additional cost. We stand behind our 100% satisfaction guarantee."
  },
  {
    question: "Do I need to provide water or electricity?",
    answer: "No! We bring our own water supply and battery-powered equipment, making us completely self-sufficient. All you need to provide is access to your vehicle."
  },
  {
    question: "How do I pay for the service?",
    answer: "We accept all major credit/debit cards, contactless payments, and digital wallets. Payment is processed securely through our app or can be handled on-site with our mobile payment system."
  },
  {
    question: "Can you clean the interior if it's very dirty?",
    answer: "Absolutely! Our deep cleaning service is designed to handle heavily soiled interiors. We use professional-grade equipment and products to restore your interior to like-new condition."
  },
  {
    question: "What happens if it rains?",
    answer: "We monitor weather conditions closely. If rain is forecast, we'll contact you to reschedule. For light drizzle, we can often work under covered areas like garages or carports."
  }
]

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="h-[100vh] w-full flex items-center justify-center overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F8F4EB] mb-6">
              Frequently Asked
              <span className="block bg-gradient-to-r from-[#9747FF] to-[#8A2B85] bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-[#F8F4EB]/80 max-w-2xl mx-auto">
              Everything you need to know about our mobile car detailing service
            </p>
          </motion.div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#9747FF]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#9747FF]/40">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#141414]/25 to-[#1E1E1E]/25 backdrop-blur-md border border-[#9747FF]/20 rounded-[1.25rem] overflow-hidden hover:border-[#9747FF]/40 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-[#9747FF]/5 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold text-[#F8F4EB] pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-[#9747FF]" />
                    ) : (
                      <Plus className="w-5 h-5 text-[#9747FF]" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <p className="text-[#F8F4EB]/80 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="bg-gradient-to-br from-[#141414]/25 to-[#1E1E1E]/25 backdrop-blur-md border border-[#9747FF]/20 rounded-[1.25rem] p-12">
              <h3 className="text-2xl font-semibold text-[#F8F4EB] mb-4">
                Still Have Questions?
              </h3>
              <p className="text-[#F8F4EB]/80 mb-6">
                Can't find the answer you're looking for? Get in touch with our friendly team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-[#9747FF] hover:bg-[#9747FF]/90 text-[#F8F4EB] px-8 py-3 rounded-[0.5rem] font-semibold shadow-lg shadow-[#9747FF]/25 hover:shadow-[#9747FF]/40 transition-all duration-300">
                  Contact Support
                </button>
                <button className="bg-transparent border border-[#9747FF]/50 text-[#F8F4EB]/80 hover:bg-[#9747FF]/10 hover:border-[#9747FF]/40 px-8 py-3 rounded-[0.5rem] font-semibold backdrop-blur-sm transition-all duration-300">
                  Live Chat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 