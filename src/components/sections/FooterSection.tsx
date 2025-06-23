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

export default function FooterSection() {
  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="Love4Detailing Logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <span className="text-xl font-bold text-foreground">Love4Detailing</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              London's premier mobile car detailing service. Professional quality, 
              unbeatable convenience, and exceptional customer service.
            </p>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.9/5 from 200+ reviews</span>
            </div>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="w-4 h-4 text-primary" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="w-4 h-4 text-primary" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter className="w-4 h-4 text-primary" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Service Area</p>
                  <p className="text-sm text-muted-foreground">
                    South West London & Surrounding Areas
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <a 
                    href="tel:07123456789" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    07123 456 789
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a 
                    href="mailto:hello@love4detailing.com" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    hello@love4detailing.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Hours</p>
                  <div className="text-sm text-muted-foreground">
                    <div>Mon-Sat: 10:00 - 17:00</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Areas & Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Service Areas</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {serviceAreas.map((area) => (
                <Badge key={area} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
            
            <h4 className="text-sm font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Ready to Book Your Service?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join hundreds of satisfied customers and experience the Love4Detailing difference today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/booking"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
              >
                Book Service Now
              </a>
              <a 
                href="tel:07123456789"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Love4Detailing. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 