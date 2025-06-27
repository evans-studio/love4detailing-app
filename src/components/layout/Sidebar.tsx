"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Menu, Shield, Users, Calendar, Star, BarChart3, Settings, User, Home, FileText, Trophy, LogOut, Phone, MapPin, LogIn } from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth, signOut } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { useSidebarContext } from './SidebarContext'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { breakpoints } from '@/lib/constants/breakpoints'
import { motion, AnimatePresence } from 'framer-motion'
import { content } from '@/lib/content'

const iconMap = {
  Shield,
  Users,
  Calendar,
  User,
  Home,
  Star,
  Phone,
  MapPin,
  FileText,
  LogOut
}

// Animation variants
const sidebarVariants = {
  expanded: {
    width: "16rem",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  collapsed: {
    width: "4rem",
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
}

const contentVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
}

interface SidebarProps {
  className?: string;
  items: {
    href: string;
    label: string;
    icon?: React.ReactNode;
  }[];
}

export default function Sidebar({ className, items }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebarContext();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { user, isLoading: authLoading } = useAuth();

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-menu-button fixed top-4 left-4 z-50 p-2 bg-true-black rounded-md"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          aria-controls="sidebar-nav"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-canvas-white"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      )}

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.aside
            className={cn(
              'sidebar fixed top-0 left-0 z-40 h-screen w-64 bg-true-black border-r border-deep-purple/20',
              isMobile ? 'lg:relative' : 'relative',
              className
            )}
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: 'tween', duration: 0.3 }}
            role="complementary"
            aria-label="Main navigation"
          >
            <nav
              id="sidebar-nav"
              className="h-full px-3 py-4 overflow-y-auto"
              role="navigation"
            >
              {/* User Profile Section */}
              {!authLoading && user && (
                <div className="mb-6 p-4 border-b border-deep-purple/20">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-canvas-white font-medium">{user.email}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 text-secondary-text hover:text-canvas-white"
                        onClick={() => setIsOpen(false)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex flex-col space-y-2">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center px-4 py-3 rounded-md transition-colors min-h-[44px]',
                      pathname === item.href
                        ? 'bg-deep-purple text-canvas-white'
                        : 'text-secondary-text hover:bg-deep-purple/10 hover:text-canvas-white'
                    )}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    {item.icon && (
                      <span className="mr-3 h-5 w-5">{item.icon}</span>
                    )}
                    <span className="flex-1">{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <motion.div
          className="fixed inset-0 bg-true-black/50 backdrop-blur-sm z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
} 