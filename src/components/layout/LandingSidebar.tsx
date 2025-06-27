"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { 
  Menu, 
  Home, 
  Calendar, 
  HelpCircle, 
  Phone,
  MapPin,
  FileText,
  Star,
  User,
  LogIn
} from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/lib/auth'
import { useSidebarContext } from './SidebarContext'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { breakpoints } from '@/lib/constants/breakpoints'
import { content } from '@/lib/content'

const iconMap = {
  Home,
  Calendar,
  Star,
  Phone,
  MapPin,
  FileText,
  User,
  LogIn
}

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

export default function LandingSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authTab, setAuthTab] = useState<'sign-in' | 'sign-up'>('sign-in')
  const { isCollapsed, setIsCollapsed } = useSidebarContext()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg}px)`)

  console.log('LandingSidebar auth state:', { user, isLoading })

  const handleAuthClick = (tab: 'sign-in' | 'sign-up') => {
    setAuthTab(tab)
    setShowAuthModal(true)
  }

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    console.log('SidebarContent rendering with:', { user, isLoading })
    
    return (
    <motion.div 
      className={cn(
        "h-full flex flex-col justify-between",
        "bg-gradient-to-br from-[#141414]/25 to-[#1E1E1E]/25",
        "backdrop-blur-md",
        !isMobile && !isCollapsed && "w-64",
        !isMobile && isCollapsed && "w-16",
        isMobile && "w-full"
      )}
      variants={!isMobile ? sidebarVariants : undefined}
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
    >
      <div className="flex flex-col flex-grow">
        {/* Logo Section */}
        <div className={cn(
          "flex-shrink-0",
          "p-4 transition-all duration-200"
        )}>
          <Link href="/" className="flex items-center justify-center">
            <div className={cn(
              "relative transition-all duration-200",
              isCollapsed ? "w-8 h-8" : "w-32 h-12"
            )}>
              <Image
                src="/logo.png"
                alt="Love4Detailing Logo"
                fill
                className="object-contain"
                priority
                sizes={isCollapsed ? "32px" : "128px"}
              />
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {content.sidebar.mainNav.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap]
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg",
                    "transition-all duration-200",
                    isActive 
                      ? "bg-[#9747FF]/10 text-[#9747FF]"
                      : "text-[#F8F4EB] hover:bg-[#9747FF]/5 hover:text-[#9747FF]"
                  )}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span 
                      variants={contentVariants}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      <div className="mt-auto">
        {/* Contact Info */}
        <div className="p-4">
          <div className="space-y-3">
            {content.sidebar.contact.map((item, index) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap]
              const content = (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3",
                    "text-[#F8F4EB]/80 hover:text-[#F8F4EB]",
                    "transition-colors duration-200"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span 
                      variants={contentVariants}
                      className="text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              )
              
              return item.href ? (
                <Link key={index} href={item.href}>
                  {content}
                </Link>
              ) : (
                content
              )
            })}
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="p-4 space-y-2">
          <Button
            variant="default"
            size="lg"
            className="w-full justify-center bg-[#9747FF] hover:bg-[#9747FF]/90 text-[#F8F4EB] gap-2"
            onClick={() => handleAuthClick('sign-up')}
          >
            <User className="h-4 w-4" />
            {!isCollapsed && "Create Account"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-center border-[#9747FF]/20 text-[#F8F4EB] hover:bg-[#9747FF]/5 gap-2"
            onClick={() => handleAuthClick('sign-in')}
          >
            <LogIn className="h-4 w-4" />
            {!isCollapsed && "Sign In"}
          </Button>
        </div>
      </div>
    </motion.div>
  )}

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
      
      {/* Mobile Menu Button */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "lg:hidden fixed top-4 left-4 z-50",
              "bg-[#141414]/90 backdrop-blur-sm",
              "border-[#9747FF]/20 text-[#F8F4EB]",
              "hover:bg-[#9747FF]/10 hover:text-[#F8F4EB]",
              "shadow-lg touch-target",
              "min-h-[44px] min-w-[44px]",
              "rounded-full"
            )}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-transparent border-none">
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      {isDesktop && <SidebarContent />}
    </>
  )
} 