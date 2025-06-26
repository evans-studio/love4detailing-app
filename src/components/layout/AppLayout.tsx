"use client"

import { usePathname } from 'next/navigation'
import LandingSidebar from './LandingSidebar'
import Sidebar from './Sidebar'
import BackButton from './BackButton'
import { SidebarProvider, useSidebar } from './SidebarContext'
import BackgroundCanvas from '@/components/ui/BackgroundCanvas'
import { UserFeedbackForm } from '../feedback/UserFeedbackForm'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useState } from 'react'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  const pathname = usePathname()
  
  // Use dashboard sidebar for dashboard pages, landing sidebar for others
  const isDashboard = pathname.startsWith('/dashboard')
  
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  
  return (
    <div className="relative min-h-screen w-full">
      {/* Mobile-first layout container */}
      <div className="flex min-h-screen w-full">
        {/* Single Sidebar Container - Only one will be shown */}
        <div className={`hidden ${isDashboard ? 'md:block' : 'lg:block'} flex-shrink-0`}>
          {isDashboard ? (
            <Sidebar />
          ) : pathname !== '/' ? (
            <LandingSidebar />
          ) : null}
        </div>

        {/* Main content area - full width on mobile, adjusted for sidebar on larger screens */}
        <main 
          className={`
            flex-1 min-h-screen w-full 
            ${isDashboard 
              ? 'md:max-w-[calc(100%-16rem)]' // 16rem = 256px sidebar width
              : pathname !== '/' ? 'lg:max-w-[calc(100%-16rem)]' : ''
            }
          `}
        >
          {/* Mobile header spacing */}
          <div className={`h-16 ${isDashboard ? 'md:hidden' : pathname !== '/' ? 'lg:hidden' : ''}`} />
          
          {/* Back button */}
          <BackButton />
          
          {/* Page content with proper padding */}
          <div className="w-full px-4 pb-4 sm:px-6 md:px-8">
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
    <div className="relative min-h-screen w-full bg-[#141414]">
      {/* Global Background with Fluid Gradients */}
      <BackgroundCanvas intensity="medium" speed={0.8} opacity={0.8} />
      
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