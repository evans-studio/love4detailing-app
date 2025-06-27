"use client"

import React, { createContext, useContext, useState } from 'react'

interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isCollapsed: boolean
  setIsCollapsed: (isCollapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  setIsOpen: () => {},
  isCollapsed: false,
  setIsCollapsed: () => {}
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isCollapsed, setIsCollapsed }}>
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