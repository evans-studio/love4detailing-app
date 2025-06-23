"use client"

import { usePathname } from 'next/navigation'
import LandingSidebar from './LandingSidebar'
import Sidebar from './Sidebar'
import BackButton from './BackButton'
import { SidebarProvider, useSidebar } from './SidebarContext'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()
  
  // Use dashboard sidebar for dashboard pages, landing sidebar for others
  const isDashboard = pathname.startsWith('/dashboard')
  
  return (
    <div className="flex min-h-screen">
      {isDashboard ? <Sidebar /> : <LandingSidebar />}
      <main 
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
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
    <SidebarProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </SidebarProvider>
  )
} 