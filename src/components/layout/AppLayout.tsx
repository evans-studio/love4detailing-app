"use client"

import { usePathname } from 'next/navigation'
import LandingSidebar from './LandingSidebar'
import Sidebar from './Sidebar'
import BackButton from './BackButton'
import { SidebarProvider, useSidebar } from './SidebarContext'
import BackgroundCanvas from '@/components/ui/BackgroundCanvas'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  const pathname = usePathname()
  
  // Use dashboard sidebar for dashboard pages, landing sidebar for others
  const isDashboard = pathname.startsWith('/dashboard')
  
  return (
    <div className="min-h-screen overflow-x-hidden max-w-full">
      {/* Render sidebars - these are fixed positioned and don't affect layout flow */}
      {isDashboard ? <Sidebar /> : <LandingSidebar />}
      
      {/* Main content with proper margin for fixed sidebar */}
      <main 
        className={`min-h-screen transition-all duration-300 overflow-x-hidden max-w-full ${
          isDashboard ? 'ml-0 md:ml-64' : 'ml-0 lg:ml-64'
        }`}
      >
        <BackButton />
        {children}
      </main>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden max-w-full">
      {/* Global WebGL Background with Fluid Gradients */}
      <BackgroundCanvas intensity="medium" speed={0.8} opacity={0.8} />
      
      {/* Main App Content */}
      <div className="relative z-10 overflow-x-hidden max-w-full">
        <SidebarProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </SidebarProvider>
      </div>
    </div>
  )
} 