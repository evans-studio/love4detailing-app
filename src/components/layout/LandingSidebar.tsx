"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/lib/auth'
import { useSidebarContext } from './SidebarContext'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { breakpoints, responsiveClasses } from '@/lib/constants/breakpoints'
import { SidebarContent, NavItem, ContactItem } from '@/lib/content'
import { 
  Home, 
  Calendar, 
  Phone,
  MapPin,
  FileText,
  Star,
  User,
  LogIn,
  X as CloseIcon
} from 'lucide-react'

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
  open: { 
    x: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  closed: { 
    x: '-100%',
    opacity: 0,
    transition: {
      type: 'tween',
      duration: 0.2,
      ease: 'easeIn'
    }
  }
}

const contentVariants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 }
  },
  hidden: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
}

export default function LandingSidebar({ content }: { content: SidebarContent }) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authTab, setAuthTab] = useState<'sign-in' | 'sign-up'>('sign-in')
  const { isCollapsed, toggleCollapsed } = useSidebarContext()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg}px)`)

  const handleAuthClick = (tab: 'sign-in' | 'sign-up') => {
    setAuthTab(tab)
    setShowAuthModal(true)
  }

  return (
    <>
      <motion.aside
        className={cn(
          responsiveClasses.sidebar,
          isCollapsed && responsiveClasses.sidebarCollapsed,
          'bg-gradient-to-br from-[#141414]/95 to-[#1E1E1E]/95 backdrop-blur-md'
        )}
        initial="closed"
        animate={isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
        role="complementary"
        aria-label="Main navigation"
      >
        {/* Close button for mobile */}
        {!isDesktop && (
          <button
            onClick={toggleCollapsed}
            className={cn(
              responsiveClasses.touchTarget,
              'absolute top-4 right-4 text-white/80 hover:text-white'
            )}
            aria-label="Close navigation"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        )}

        {/* Logo Section */}
        <div className="p-4 flex items-center justify-center">
          <Link href="/" className="block">
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
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className={responsiveClasses.list}>
            {content.mainNav.map((item: NavItem) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap]
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    isCollapsed ? responsiveClasses.touchTarget : responsiveClasses.navItem,
                    isActive && responsiveClasses.navItemActive
                  )}
                >
                  {Icon && (
                    <span className="w-5 h-5 shrink-0">
                      <Icon />
                    </span>
                  )}
                  {!isCollapsed && (
                    <motion.span 
                      className="ml-3 truncate"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Contact Info */}
        <div className="mt-auto p-4 border-t border-[#8A2B85]/20">
          <div className={responsiveClasses.list}>
            {content.contact.map((item: ContactItem, index: number) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap]
              const ContactItem = (
                <div
                  key={index}
                  className={cn(
                    isCollapsed ? responsiveClasses.touchTarget : responsiveClasses.navItem,
                    'text-white/60 hover:text-white'
                  )}
                >
                  {Icon && (
                    <span className="w-4 h-4 shrink-0">
                      <Icon />
                    </span>
                  )}
                  {!isCollapsed && (
                    <motion.span 
                      className="ml-3 truncate text-sm"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              )
              
              return item.href ? (
                <Link key={index} href={item.href}>
                  {ContactItem}
                </Link>
              ) : ContactItem
            })}
          </div>
        </div>

        {/* Auth Buttons */}
        {!isLoading && !user && !isCollapsed && (
          <div className="p-4 border-t border-[#8A2B85]/20">
            <div className={responsiveClasses.flexCenter}>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleAuthClick('sign-in')}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => handleAuthClick('sign-up')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
        redirectPath={pathname}
      />
    </>
  )
} 