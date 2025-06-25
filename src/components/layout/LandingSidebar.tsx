"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Menu, 
  Home, 
  Car, 
  Calendar, 
  HelpCircle, 
  Phone, 
  Mail,
  ChevronLeft, 
  ChevronRight,
  Star,
  MapPin
} from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/lib/auth'
import { useSidebar } from './SidebarContext'

const mainNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: Car },
  { href: '/booking', label: 'Book Now', icon: Calendar },
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
]

const sidebarVariants = {
  expanded: { 
    width: 256,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  },
  collapsed: { 
    width: 80,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
}

const contentVariants = {
  expanded: { 
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 }
  },
  collapsed: { 
    opacity: 0,
    x: -10,
    transition: { duration: 0.1 }
  }
}

const linkVariants = {
  normal: { scale: 1 },
  hover: { scale: 1.02 }
}

export default function LandingSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isCollapsed, toggleCollapsed } = useSidebar()
  const pathname = usePathname()
  const { user } = useAuth()

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="h-full flex flex-col">
      {/* Logo Section - Updated proportions */}
      <div className={`sidebar-logo-container flex-shrink-0 ${isCollapsed && !isMobile ? 'px-4 py-6' : ''}`}>
        <Link href="/" className="flex items-center justify-center">
          <div className={`relative ${isCollapsed && !isMobile ? 'w-12 h-12' : 'w-full max-w-[160px] h-16'}`}>
            <Image
              src="/logo.png"
              alt="Love4Detailing Logo"
              fill
              className="sidebar-logo object-contain"
              priority
              sizes={isCollapsed && !isMobile ? "48px" : "160px"}
              style={{
                objectFit: 'contain',
                objectPosition: 'center'
              }}
              onError={(e) => {
                console.error('Logo failed to load:', e)
                // Fallback to text if image fails
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = '<div class="text-primary font-bold text-lg">L4D</div>'
                }
              }}
            />
          </div>
        </Link>
      </div>

      {/* Collapse Toggle Button - Desktop Only */}
      {!isMobile && (
        <div className="px-4 mb-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className="w-full flex items-center justify-center"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <AnimatePresence>
                  <motion.span
                    variants={contentVariants}
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    className="text-sm"
                  >
                    Collapse
                  </motion.span>
                </AnimatePresence>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Quick Info Section */}
      <div className={`px-4 flex-shrink-0 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.div
              variants={contentVariants}
              animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
              className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-platinum-silver fill-platinum-silver" />
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                200+ Happy Customers
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-primary" />
                  <span>07123 456 789</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span>South West London</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="my-4 flex-shrink-0" />

      {/* Main Navigation */}
      <nav className={`flex-1 px-4 space-y-2 overflow-y-auto min-h-0 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.h3
              variants={contentVariants}
              animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
              className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3"
            >
              Navigation
            </motion.h3>
          )}
        </AnimatePresence>
        
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                title={isCollapsed && !isMobile ? item.label : undefined}
                onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {(!isCollapsed || isMobile) && (
                  <span className={`transition-opacity duration-200 ${isCollapsed && !isMobile ? 'opacity-0' : 'opacity-100'}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Auth Section */}
      <div className={`px-4 space-y-2 flex-shrink-0 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
        <Separator className="my-4" />
        
        {user ? (
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.div
                variants={contentVariants}
                animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
                className="space-y-2"
              >
                <Button variant="default" className="w-full" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.div
                variants={contentVariants}
                animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
                className="space-y-2"
              >
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowAuthModal(true)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowAuthModal(true)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Create Account
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Actions */}
      <div className={`p-4 space-y-2 flex-shrink-0 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.div
              variants={contentVariants}
              animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
              className="space-y-2"
            >
              <Button 
                variant="default" 
                className="w-full btn-brand-accent" 
                asChild
              >
                <Link href="/booking">Book Service Now</Link>
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <Link href="tel:07123456789">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <Link href="mailto:hello@love4detailing.com">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCollapsed && !isMobile && (
          <div className="flex flex-col space-y-2">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full p-2 btn-brand-accent" 
              asChild 
              title="Book Service"
            >
              <Link href="/booking">
                <Calendar className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="flex-1 p-2" asChild title="Call Us">
                <Link href="tel:07123456789">
                  <Phone className="h-3 w-3" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 p-2" asChild title="Email Us">
                <Link href="mailto:hello@love4detailing.com">
                  <Mail className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className="fixed left-0 top-0 z-50 h-screen bg-sidebar flex-shrink-0 hidden lg:flex flex-col"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-4 left-4 z-50 bg-background/95 backdrop-blur-sm border border-border/50 hover:bg-accent shadow-lg"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar border-r border-border/20">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
} 