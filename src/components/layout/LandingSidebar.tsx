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
  MapPin,
  User
} from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/lib/auth'
import { useSidebar } from './SidebarContext'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { breakpoints } from '@/lib/constants/breakpoints'

const mainNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: Car },
  { href: '/booking', label: 'Book Now', icon: Calendar },
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
]

const sidebarVariants = {
  expanded: { 
    width: "16rem",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  collapsed: { 
    width: "4rem",
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
}

const contentVariants = {
  expanded: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  collapsed: { 
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
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
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg}px)`)

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <motion.div 
      className={cn(
        "h-full",
        "bg-gradient-to-br from-[#141414] to-[#1E1E1E]",
        "border-r border-[#8A2B85]/20",
        !isMobile && !isCollapsed && "w-64",
        !isMobile && isCollapsed && "w-16",
        isMobile && "w-full"
      )}
      variants={!isMobile ? sidebarVariants : undefined}
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex-shrink-0 border-b border-[#8A2B85]/20",
        "p-4 transition-all duration-200"
      )}>
        <Link href="/" className="flex items-center justify-center">
          <div className={cn(
            "relative transition-all duration-200",
            isCollapsed ? "w-8 h-8" : "w-32 h-12 sm:w-40 sm:h-14"
          )}>
            <Image
              src="/logo.png"
              alt="Love4Detailing Logo"
              fill
              className="object-contain"
              priority
              sizes={isCollapsed ? "32px" : "(max-width: 640px) 128px, 160px"}
              onError={(e) => {
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

      {/* Business Info Section - Similar to user profile in dashboard */}
      <motion.div 
        className={cn(
          "flex-shrink-0 p-4 border-b border-[#8A2B85]/20",
          "transition-all duration-200"
        )}
        variants={contentVariants}
      >
        <div className="flex items-center space-x-3">
          <div className={cn(
            "flex items-center justify-center",
            "bg-[#8A2B85] rounded-full",
            "ring-2 ring-[#8A2B85]/20",
            isCollapsed ? "h-8 w-8" : "h-10 w-10"
          )}>
            <Star className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.div 
              className="flex-1 min-w-0"
              variants={contentVariants}
            >
              <p className="text-sm font-medium text-[#F8F4EB] truncate">
                Love4Detailing
              </p>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs bg-[#8A2B85]/20 text-[#8A2B85] border-[#8A2B85]/30">
                  Premium
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-[#C7C7C7]">4.9</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 px-4 py-4 space-y-1 overflow-y-auto",
        "scrollbar-thin scrollbar-thumb-[#8A2B85]/20 scrollbar-track-transparent"
      )}>
        {mainNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-lg",
                "transition-all duration-200 touch-target min-h-[44px]",
                isActive 
                  ? "bg-[#8A2B85]/10 text-[#8A2B85] border border-[#8A2B85]/20"
                  : "text-[#C7C7C7] hover:bg-[#8A2B85]/5 hover:text-[#F8F4EB]"
              )}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <Icon className={cn(
                "flex-shrink-0",
                isCollapsed ? "w-6 h-6" : "w-5 h-5"
              )} />
              {!isCollapsed && (
                <motion.span 
                  className="font-medium"
                  variants={contentVariants}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Contact Info */}
      {!isCollapsed && (
        <motion.div 
          className="flex-shrink-0 px-4 py-2"
          variants={contentVariants}
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-[#C7C7C7]">
              <Phone className="w-4 h-4 text-[#8A2B85]" />
              <span>07123 456 789</span>
            </div>
            <div className="flex items-center gap-2 text-[#C7C7C7]">
              <MapPin className="w-4 h-4 text-[#8A2B85]" />
              <span>South West London</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Auth Section */}
      <motion.div 
        className="flex-shrink-0 p-4 border-t border-[#8A2B85]/20"
        variants={contentVariants}
      >
        {user ? (
          <div className="space-y-2">
            <Link href="/dashboard">
              <Button 
                variant="default" 
                className={cn(
                  "w-full bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-white",
                  "touch-target min-h-[44px]",
                  "transition-all duration-200"
                )}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                <Home className={cn(
                  "flex-shrink-0",
                  isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-2"
                )} />
                {!isCollapsed && "Dashboard"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={() => setShowAuthModal(true)}
              variant="default"
              className={cn(
                "w-full bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-white",
                "touch-target min-h-[44px]",
                "transition-all duration-200"
              )}
            >
              {isCollapsed ? (
                <User className="w-5 h-5" />
              ) : (
                "Sign In"
              )}
            </Button>
            {!isCollapsed && (
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="outline"
                className={cn(
                  "w-full border-[#8A2B85]/20 text-[#C7C7C7]",
                  "hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB]",
                  "touch-target min-h-[44px]",
                  "transition-all duration-200"
                )}
              >
                Sign Up
              </Button>
            )}
          </div>
        )}

        {/* Collapse Toggle */}
        {!isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleCollapsed}
            className={cn(
              "w-full mt-2 border-[#8A2B85]/20 text-[#C7C7C7]",
              "hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB]",
              "touch-target min-h-[44px]",
              "transition-all duration-200"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        )}
      </motion.div>
    </motion.div>
  )

  // Mobile Menu Button
  const MobileMenuButton = () => (
    <div className="fixed top-4 left-4 z-50 lg:hidden">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "bg-[#141414]/90 backdrop-blur-sm",
              "border-[#8A2B85]/20 text-[#F8F4EB]",
              "hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB]",
              "shadow-lg touch-target",
              "min-h-[44px] min-w-[44px]",
              "rounded-full"
            )}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className={cn(
            "p-0 bg-[#141414] border-r border-[#8A2B85]/20",
            "w-[85vw] max-w-[320px] sm:max-w-[360px]"
          )}
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
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:block h-full",
        "transition-all duration-200"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      {!isDesktop && <MobileMenuButton />}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="sign-in"
      />
    </>
  )
} 