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
        isCollapsed 
          ? 'left-4' // When collapsed, position in sidebar area
          : 'left-4 lg:left-auto lg:right-4' // When expanded, move to right on desktop
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
      {!isCollapsed && !pathname.startsWith('/dashboard') && (
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