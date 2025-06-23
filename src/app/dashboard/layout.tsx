"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/layout/Sidebar'
import { SidebarProvider, useSidebar } from '@/components/layout/SidebarContext'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1 flex">
        <Sidebar />
        <motion.main 
          className="flex-1 flex-col lg:ml-0"
          animate={{
            marginLeft: isDesktop ? (isCollapsed ? 80 : 256) : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          style={{
            marginLeft: isDesktop ? (isCollapsed ? 80 : 256) : 0,
          }}
        >
          <div className="flex-1 p-8 pt-6">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 p-8 pt-6">
      {children}
    </div>
  )
} 