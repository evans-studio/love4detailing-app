"use client"

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Home } from 'lucide-react'
import { useSidebar } from './SidebarContext'

export default function BackButton() {
  const router = useRouter()
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()

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

  return (
    <div 
      className={`fixed top-4 z-30 flex gap-2 transition-all duration-300 ${
        // Position based on screen size and sidebar presence
        isDashboard 
          ? 'right-4' // Dashboard: always on right to avoid mobile menu button
          : 'left-4 lg:right-4' // Landing: left on mobile, right on desktop when sidebar is present
      }`}
    >
      {/* Back Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleBack}
        className="w-10 h-10 rounded-full bg-background/95 backdrop-blur-sm border-border/50 hover:bg-accent shadow-lg flex-shrink-0 touch-target"
        title="Go Back"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>

      {/* Home Button - only show when not on dashboard pages and not collapsed */}
      {!isDashboard && !isCollapsed && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleHome}
          className="w-10 h-10 rounded-full bg-background/95 backdrop-blur-sm border-border/50 hover:bg-accent shadow-lg flex-shrink-0 touch-target hidden lg:flex"
          title="Go Home"
        >
          <Home className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
} 