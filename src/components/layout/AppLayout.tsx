"use client"

import { usePathname } from 'next/navigation'
import LandingSidebar from './LandingSidebar'
import Sidebar from './Sidebar'
import BackButton from './BackButton'
import { SidebarProvider, useSidebarContext } from './SidebarContext'
import { FluidBackground } from '@/components/ui/FluidBackground'
import { UserFeedbackForm } from '../feedback/UserFeedbackForm'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useState } from 'react'
import { BackgroundOrbs } from '@/components/ui/BackgroundOrbs'
import { Shield, Users, Calendar, Star, User, Home, FileText, LogOut } from 'lucide-react'

const dashboardItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <Home /> },
  { href: '/dashboard/bookings', label: 'Bookings', icon: <Calendar /> },
  { href: '/dashboard/profile', label: 'Profile', icon: <User /> },
  { href: '/dashboard/rewards', label: 'Rewards', icon: <Star /> },
  { href: '/dashboard/admin', label: 'Admin', icon: <Shield /> },
  { href: '/dashboard/admin/customers', label: 'Customers', icon: <Users /> },
  { href: '/dashboard/documents', label: 'Documents', icon: <FileText /> },
  { href: '#', label: 'Sign Out', icon: <LogOut /> }
]

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarContext()
  const pathname = usePathname()
  
  // Use dashboard sidebar for dashboard pages, landing sidebar for others
  const isDashboard = pathname.startsWith('/dashboard')
  
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  
  return (
    <div className="relative min-h-screen w-full">
      {/* Skip Navigation Links */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {isDashboard || pathname !== '/' ? (
        <a href="#navigation" className="skip-link">
          Skip to navigation
        </a>
      ) : null}
      
      {/* Mobile-first layout container */}
      <div className="relative min-h-screen w-full">
        {/* Single Sidebar Container - Fixed positioned for proper layout */}
        <div className={`${isDashboard ? 'hidden md:block' : 'hidden lg:block'} fixed left-0 top-0 h-full z-30`}>
          {isDashboard ? (
            <Sidebar items={dashboardItems} />
          ) : (
            <LandingSidebar />
          )}
        </div>

        {/* Main content area - properly positioned with responsive margin */}
        <main 
          id="main-content"
          className={`
            min-h-screen w-full overflow-x-hidden
            ${isDashboard 
              ? 'md:w-[calc(100%-16rem)] md:ml-64' // Adjust width to account for sidebar
              : 'lg:w-[calc(100%-16rem)] lg:ml-64'
            }
          `}
          role="main"
          aria-label="Main content"
        >
          {/* Mobile header spacing - only for non-homepage */}
          {pathname !== '/' && (
            <div className={`h-16 ${isDashboard ? 'md:hidden' : 'lg:hidden'}`} />
          )}
          
          {/* Back button - only for non-homepage */}
          {pathname !== '/' && <BackButton />}
          
          {/* Page content - conditional padding based on page type */}
          <div className={pathname === '/' ? 'w-full' : 'w-full px-4 pb-4 sm:px-6 md:px-8'}>
            {children}
          </div>
        </main>
      </div>

      {/* Feedback Button */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white rounded-full p-4 shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        aria-label="Open Feedback Form"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      </button>

      {/* Feedback Modal */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="sm:max-w-3xl">
          <div className="relative">
            <UserFeedbackForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#141414]/95">
      {/* Global Background with Fluid SVG Orbs */}
      <BackgroundOrbs intensity="high" className="z-0" />
      
      {/* Main App Content */}
      <div className="relative z-10 w-full">
        <SidebarProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </SidebarProvider>
      </div>
    </div>
  )
} 