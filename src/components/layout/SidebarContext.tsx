"use client"

import React, { createContext, useContext, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { breakpoints } from '@/lib/constants/breakpoints'

interface SidebarContextType {
  isCollapsed: boolean
  toggleCollapsed: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg}px)`)
  const [isCollapsed, setIsCollapsed] = useState(!isDesktop)

  const toggleCollapsed = () => {
    setIsCollapsed(prev => !prev)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarProvider')
  }
  return context
}

// Alias for backward compatibility
export const useSidebar = useSidebarContext 