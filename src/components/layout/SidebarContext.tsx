"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  toggleCollapsed: () => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleCollapsed = React.useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  const contextValue = React.useMemo(() => ({
    isCollapsed,
    setIsCollapsed,
    toggleCollapsed
  }), [isCollapsed, toggleCollapsed])

  // Don't render anything during SSR
  if (!isMounted) {
    return null
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
} 