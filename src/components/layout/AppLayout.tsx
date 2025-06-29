"use client"

import { usePathname } from 'next/navigation'
import LandingSidebar from './LandingSidebar'
import Sidebar from './Sidebar'
import BackButton from './BackButton'
import { SidebarProvider, useSidebarContext } from './SidebarContext'
import { UserFeedbackForm } from '../feedback/UserFeedbackForm'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useState } from 'react'
import { BackgroundOrbs } from '@/components/ui/BackgroundOrbs'
import { Shield, Users, Calendar, Star, User, Home, LogOut, Menu } from 'lucide-react'
import { responsiveClasses } from '@/lib/constants/breakpoints'
import type { SidebarContent } from '@/lib/content/types'

const dashboardItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
  { href: '/dashboard/bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
  { href: '/dashboard/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { href: '/dashboard/rewards', label: 'Rewards', icon: <Star className="w-5 h-5" /> },
  { href: '/dashboard/admin', label: 'Admin', icon: <Shield className="w-5 h-5" /> },
  { href: '/dashboard/admin/customers', label: 'Customers', icon: <Users className="w-5 h-5" /> },
  { href: '#', label: 'Sign Out', icon: <LogOut className="w-5 h-5" /> }
]

function LayoutContent({ children, sidebarContent }: { children: React.ReactNode, sidebarContent: SidebarContent }) {
  const { isCollapsed, toggleCollapsed } = useSidebarContext()
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  
  return (
    <div className="relative min-h-screen w-full">
      {/* Skip Navigation Links - Improved accessibility */}
      <div className="sr-only focus-within:not-sr-only">
        <a href="#main-content" className="fixed top-2 left-2 z-50 bg-[#8A2B85] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8A2B85]">
          Skip to main content
        </a>
        {isDashboard || pathname !== '/' ? (
          <a href="#navigation" className="fixed top-2 left-40 z-50 bg-[#8A2B85] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8A2B85]">
            Skip to navigation
          </a>
        ) : null}
      </div>
      
      {/* Mobile Header - Always visible on mobile, hidden on desktop */}
      <header className={`${responsiveClasses.nav} ${isDashboard ? 'md:hidden' : 'lg:hidden'} flex items-center justify-between px-4`}>
        <button
          onClick={toggleCollapsed}
          className={responsiveClasses.touchTarget}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-4">
          {/* Add any header content here */}
        </div>
      </header>

      {/* Layout Container */}
      <div className="relative min-h-screen w-full">
        {/* Sidebar - Full screen on mobile when open, fixed on desktop */}
        <nav 
          id="navigation"
          className={`
            ${isCollapsed ? 'translate-x-[-100%]' : 'translate-x-0'}
            ${isDashboard ? responsiveClasses.sidebar : responsiveClasses.sidebar}
            transition-transform duration-200 ease-in-out
            ${isDashboard ? 'md:translate-x-0' : 'lg:translate-x-0'}
          `}
          aria-label="Main navigation"
        >
          {isDashboard ? (
            <Sidebar items={dashboardItems} />
          ) : (
            <LandingSidebar content={sidebarContent} />
          )}
        </nav>

        {/* Main Content Area */}
        <main 
          id="main-content"
          className={`
            min-h-screen w-full overflow-x-hidden pt-16
            ${isDashboard 
              ? 'md:pt-0 md:pl-[280px] lg:pl-[320px] xl:pl-[360px]' 
              : 'lg:pt-0 lg:pl-[280px] xl:pl-[320px]'
            }
            transition-all duration-200 ease-in-out
          `}
          role="main"
          aria-label="Main content"
        >
          {/* Back button - only for non-homepage */}
          {pathname !== '/' && <BackButton />}
          
          {/* Page content with responsive padding */}
          <div className={pathname === '/' ? 'w-full' : `${responsiveClasses.container}`}>
            {children}
          </div>
        </main>

        {/* Backdrop for mobile sidebar */}
        {!isCollapsed && (
          <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-200 
              ${isDashboard ? 'md:hidden' : 'lg:hidden'}`}
            onClick={toggleCollapsed}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Feedback Button - Responsive positioning */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className={`
          fixed bottom-4 right-4 z-50 
          ${responsiveClasses.touchTarget}
          bg-[#8A2B85] text-white rounded-full shadow-lg 
          hover:bg-[#8A2B85]/90 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8A2B85]
          transform hover:scale-105 active:scale-95 transition-all duration-200
        `}
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

      {/* Feedback Modal - Using responsive modal classes */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className={responsiveClasses.modal}>
          <div className="relative">
            <UserFeedbackForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AppLayout({ children, sidebarContent }: { children: React.ReactNode, sidebarContent: SidebarContent }) {
  return (
    <div className="relative min-h-[100svh] w-full">
      {/* Global Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-[#141414]" />
        <BackgroundOrbs intensity="high" className="absolute inset-0" />
      </div>
      
      {/* Main App Content */}
      <div className="relative z-[1] w-full">
        <SidebarProvider>
          <LayoutContent sidebarContent={sidebarContent}>
            {children}
          </LayoutContent>
        </SidebarProvider>
      </div>
    </div>
  )
} 