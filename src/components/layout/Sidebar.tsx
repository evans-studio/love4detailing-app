"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth'
import { useSidebarContext } from './SidebarContext'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { breakpoints, responsiveClasses } from '@/lib/constants/breakpoints'
import { motion } from 'framer-motion'

interface SidebarProps {
  className?: string;
  items: {
    href: string;
    label: string;
    icon?: React.ReactNode;
  }[];
}

// Animation variants
const sidebarVariants = {
  open: { 
    x: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  closed: { 
    x: '-100%',
    opacity: 0,
    transition: {
      type: 'tween',
      duration: 0.2,
      ease: 'easeIn'
    }
  }
}

const contentVariants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 }
  },
  hidden: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
}

export default function Sidebar({ className, items }: SidebarProps) {
  const pathname = usePathname()
  const { isCollapsed, toggleCollapsed } = useSidebarContext()
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg}px)`)
  const { user, isLoading: authLoading } = useAuth()

  return (
    <motion.aside
      className={cn(
        responsiveClasses.sidebar,
        isCollapsed && responsiveClasses.sidebarCollapsed,
        className
      )}
      initial="closed"
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      role="complementary"
      aria-label="Main navigation"
    >
      {/* Close button for mobile */}
      {!isDesktop && (
        <button
          onClick={toggleCollapsed}
          className={cn(
            responsiveClasses.touchTarget,
            'absolute top-4 right-4 text-white/80 hover:text-white'
          )}
          aria-label="Close navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <nav
        className="h-full px-4 py-6 overflow-y-auto"
        role="navigation"
      >
        {/* User Profile Section */}
        {!authLoading && user && (
          <motion.div 
            className="mb-6 p-4 border-b border-[#8A2B85]/20"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={responsiveClasses.flexStart}>
              <Avatar className={responsiveClasses.avatar}>
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <p className="text-white font-medium truncate max-w-[180px]">
                    {user.email}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-white/60 hover:text-white"
                    onClick={() => {}}
                  >
                    View Profile
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Navigation Links */}
        <div className={responsiveClasses.list}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                isCollapsed ? responsiveClasses.touchTarget : responsiveClasses.navItem,
                pathname === item.href && responsiveClasses.navItemActive,
                'group'
              )}
            >
              {item.icon && (
                <span className="w-5 h-5 shrink-0">
                  {item.icon}
                </span>
              )}
              {!isCollapsed && (
                <motion.span 
                  className="ml-3 truncate"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </motion.aside>
  )
} 