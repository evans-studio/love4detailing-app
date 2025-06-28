"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { breakpoints } from '@/lib/constants/breakpoints'

interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isCollapsed: boolean
  setIsCollapsed: (isCollapsed: boolean) => void
  toggleCollapsed: () => void
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  setIsOpen: () => {},
  isCollapsed: false,
  setIsCollapsed: () => {},
  toggleCollapsed: () => {}
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg}px)`)
  const [isCollapsed, setIsCollapsed] = useState(!isDesktop)

  useEffect(() => {
    setIsCollapsed(!isDesktop)
  }, [isDesktop])

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  return (
    <SidebarContext.Provider value={{ 
      isOpen, 
      setIsOpen, 
      isCollapsed, 
      setIsCollapsed,
      toggleCollapsed 
    }}>
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