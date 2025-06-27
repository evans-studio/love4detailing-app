"use client"

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Home } from 'lucide-react'
import { useSidebarContext } from './SidebarContext'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { breakpoints } from '@/lib/constants/breakpoints'
import { motion, AnimatePresence } from 'framer-motion'

const buttonVariants = {
  initial: { 
    opacity: 0,
    scale: 0.9
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
}

export default function BackButton() {
  const router = useRouter()
  const pathname = usePathname()
  const { isCollapsed } = useSidebarContext()
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg}px)`)

  // Don't show back button on home page
  if (pathname === '/') return null

  const isDashboard = pathname.startsWith('/dashboard')

  const handleBack = () => {
    // Check if there's browser history
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to home page
      router.push('/')
    }
  }

  const handleHome = () => {
    router.push('/')
  }

  const commonButtonClasses = cn(
    "rounded-full",
    "bg-[#141414]/90 backdrop-blur-sm",
    "border-[#8A2B85]/20 text-[#F8F4EB]",
    "hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB]",
    "shadow-lg touch-target",
    "min-h-[44px] min-w-[44px]",
    "transition-all duration-200"
  )

  return (
    <motion.div 
      className={cn(
        "fixed z-30 flex gap-2",
        "transition-all duration-300",
        isDashboard 
          ? "top-4 right-4" // Dashboard: always on right to avoid mobile menu button
          : isDesktop
            ? "top-4 left-4" // Desktop landing: standard position
            : "top-4 left-16" // Mobile landing: account for mobile menu button
      )}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Back Button */}
      <motion.div variants={buttonVariants}>
        <Button
          variant="outline"
          size="icon"
          onClick={handleBack}
          className={commonButtonClasses}
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="sr-only">Go Back</span>
        </Button>
      </motion.div>

      {/* Home Button - only show on larger screens when not on dashboard */}
      <AnimatePresence>
        {!isDashboard && !isCollapsed && isDesktop && (
          <motion.div
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={handleHome}
              className={commonButtonClasses}
              title="Go Home"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Go Home</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 