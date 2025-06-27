"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Star
} from 'lucide-react'


const quickLinks = [
  { name: 'Book Service', href: '/booking' },
  { name: 'View Services', href: '/services' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
]

const serviceAreas = [
  'Clapham', 'Brixton', 'Battersea', 'Wandsworth', 
  'Putney', 'Balham', 'Tooting', 'Streatham'
]

export const FooterSection = () => {
  return (
    <footer className="relative py-16 px-4">
      <div className="relative z-20">
        {/* Transform CTA Section */}
        <div className="max-w-5xl mx-auto mb-8">
          <motion.div
            className="text-center bg-gradient-to-br from-[#141414]/25 to-[#1E1E1E]/25 backdrop-blur-md rounded-[1.25rem] p-12 border border-[#8A2B85]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[#F8F4EB]">
              Ready to Transform Your Vehicle?
            </h2>
            <p className="text-lg sm:text-xl text-[#F8F4EB]/80 max-w-3xl mx-auto mb-8">
              Book your service now and experience the convenience of professional mobile car detailing
            </p>
            <Link href="/booking">
              <button className="bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-[#F8F4EB] px-8 py-4 rounded-[0.5rem] font-semibold shadow-lg shadow-[#8A2B85]/25 hover:shadow-[#8A2B85]/40 transition-all duration-300">
                Book Your Service
              </button>
            </Link>
            <p className="mt-4 text-sm text-[#F8F4EB]/60">
              No commitment required • Professional service guaranteed
            </p>
          </motion.div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="flex items-center mb-8">
                <Image
                  src="/logo.png"
                  alt="Love4Detailing"
                  width={48}
                  height={48}
                  className="mr-3"
                />
                <h2 className="text-2xl font-bold text-[#F8F4EB]">
                  Love4Detailing
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#8A2B85] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#F8F4EB]">Location</p>
                    <p className="text-sm text-[#F8F4EB]/60">South West London</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#8A2B85] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#F8F4EB]">Phone</p>
                    <a 
                      href="tel:07908625581" 
                      className="text-sm text-[#F8F4EB]/60 hover:text-[#8A2B85] transition-colors"
                    >
                      07908 625 581
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#8A2B85] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#F8F4EB]">Email</p>
                    <a 
                      href="mailto:zell@love4detailing.com" 
                      className="text-sm text-[#F8F4EB]/60 hover:text-[#8A2B85] transition-colors"
                    >
                      zell@love4detailing.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#8A2B85] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#F8F4EB]">Hours</p>
                    <div className="text-sm text-[#F8F4EB]/60">
                      <div>Mon-Sat: 10:00 - 17:00</div>
                      <div>Sunday: Closed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Areas & Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-[#F8F4EB] mb-4">Service Areas</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {serviceAreas.map((area) => (
                  <Badge key={area} variant="outline" className="text-xs border-[#8A2B85]/40 text-[#F8F4EB]/80">
                    {area}
                  </Badge>
                ))}
              </div>
              
              <h4 className="text-sm font-semibold text-[#F8F4EB] mb-3">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-sm text-[#F8F4EB]/60 hover:text-[#8A2B85] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-[#8A2B85]/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#F8F4EB]/60">
              © {new Date().getFullYear()} Love4Detailing. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://instagram.com/love4detailing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F8F4EB]/60 hover:text-[#8A2B85] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com/love4detailing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F8F4EB]/60 hover:text-[#8A2B85] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/love4detailing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F8F4EB]/60 hover:text-[#8A2B85] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 