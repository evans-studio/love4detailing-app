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

  // Check if we're on a dashboard page to avoid conflicts with mobile menu
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
      className={`fixed top-4 z-50 flex gap-2 transition-all duration-300 ${
        isDashboard 
          ? 'right-4' // Dashboard: always on right to avoid mobile menu button
          : isCollapsed 
            ? 'left-4' // Landing: when collapsed, position in sidebar area
            : 'left-4 lg:left-auto lg:right-4' // Landing: when expanded, move to right on desktop
      }`}
    >
      {/* Back Button - Always circular */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleBack}
        className="w-10 h-10 rounded-full bg-background/95 backdrop-blur-sm border-border/50 hover:bg-accent shadow-lg flex-shrink-0"
        title="Go Back"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>

      {/* Home Button - only show when sidebar is expanded and not on dashboard pages */}
      {!isCollapsed && !isDashboard && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleHome}
          className="w-10 h-10 rounded-full bg-background/95 backdrop-blur-sm border-border/50 hover:bg-accent shadow-lg flex-shrink-0"
          title="Go Home"
        >
          <Home className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
} 