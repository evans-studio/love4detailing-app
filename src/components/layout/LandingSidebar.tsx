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
      {/* Logo Section - Responsive sizing */}
      <div className={`flex-shrink-0 border-b border-[#8A2B85]/20 ${
        isCollapsed && !isMobile ? 'p-4' : 'p-6'
      }`}>
        <Link href="/" className="flex items-center justify-center">
          <div className={`relative ${
            isCollapsed && !isMobile 
              ? 'w-12 h-12' 
              : 'w-full max-w-[160px] h-16'
          }`}>
            <Image
              src="/logo.png"
              alt="Love4Detailing Logo"
              fill
              className="object-contain"
              priority
              sizes={isCollapsed && !isMobile ? "48px" : "160px"}
              onError={(e) => {
                console.error('Logo failed to load:', e)
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = '<div class="text-[#8A2B85] font-bold text-lg">L4D</div>'
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
            className="w-full flex items-center justify-center touch-target"
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
              className="bg-gradient-to-r from-[#8A2B85]/10 to-[#8A2B85]/5 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-[#F8F4EB] fill-[#F8F4EB]" />
                <span className="text-sm font-medium text-[#F8F4EB]">4.9/5 Rating</span>
              </div>
              <p className="text-xs text-[#C7C7C7] mb-3">
                200+ Happy Customers
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-[#8A2B85]" />
                  <span className="text-[#C7C7C7]">07123 456 789</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-[#8A2B85]" />
                  <span className="text-[#C7C7C7]">South West London</span>
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
              className="px-3 text-xs font-semibold text-[#C7C7C7] uppercase tracking-wider mb-3"
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
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 touch-target ${
                  isActive 
                    ? 'bg-[#8A2B85]/10 text-[#8A2B85] border border-[#8A2B85]/20' 
                    : 'text-[#C7C7C7] hover:bg-[#8A2B85]/5 hover:text-[#F8F4EB]'
                } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {(!isCollapsed || isMobile) && (
                    <motion.span
                      variants={contentVariants}
                      animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </div>
      </nav>

      <Separator className="my-4 flex-shrink-0" />

      {/* Auth Section */}
      <div className={`px-4 pb-6 flex-shrink-0 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
        {user ? (
          <div className="space-y-3">
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.div
                  variants={contentVariants}
                  animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
                  className="text-center"
                >
                  <p className="text-sm text-[#C7C7C7] mb-2">Welcome back!</p>
                  <p className="text-sm font-medium text-[#F8F4EB] truncate">{user.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <Link href="/dashboard">
              <Button 
                variant="default" 
                className={`w-full bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-white touch-target ${
                  isCollapsed && !isMobile ? 'px-2' : ''
                }`}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                {isCollapsed && !isMobile ? (
                  <Home className="w-4 h-4" />
                ) : (
                  'Dashboard'
                )}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={() => setShowAuthModal(true)}
              variant="default"
              className={`w-full bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-white touch-target ${
                isCollapsed && !isMobile ? 'px-2' : ''
              }`}
            >
              {isCollapsed && !isMobile ? (
                <Mail className="w-4 h-4" />
              ) : (
                'Sign In'
              )}
            </Button>
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.div
                  variants={contentVariants}
                  animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
                >
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    variant="outline"
                    className="w-full border-[#8A2B85]/20 text-[#C7C7C7] hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB] touch-target"
                  >
                    Sign Up
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )

  // Mobile Menu Button - Improved positioning
  const MobileMenuButton = () => (
    <div className="sidebar-mobile-button lg:hidden">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-[#141414]/90 backdrop-blur-sm border-[#8A2B85]/20 text-[#F8F4EB] hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB] shadow-lg touch-target"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="p-0 bg-[#141414] border-r border-[#8A2B85]/20 w-80 max-w-[85vw]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent isMobile={true} />
        </SheetContent>
      </Sheet>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar - Simplified positioning */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className="sidebar-desktop hidden lg:flex bg-[#141414] border-r border-[#8A2B85]/20"
        style={{
          background: 'linear-gradient(135deg, #141414 0%, #1E1E1E 100%)',
        }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Menu Button */}
      <MobileMenuButton />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="sign-in"
      />
    </>
  )
} 