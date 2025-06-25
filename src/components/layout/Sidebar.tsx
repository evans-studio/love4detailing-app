"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Menu, Shield, Users, Calendar, Star, BarChart3, Settings, ChevronLeft, ChevronRight, User, Home, FileText, Trophy, LogOut, Phone, MapPin } from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth, signOut } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { useSidebar } from './SidebarContext'
import { cn } from '@/lib/utils'

const getNavItems = (isAdmin: boolean) => {
  if (isAdmin) {
    return [
      { href: '/dashboard/admin', label: 'Admin Dashboard', icon: Shield },
      { href: '/dashboard/admin/customers', label: 'Customers', icon: Users },
      { href: '/dashboard/book-service', label: 'New Booking', icon: Calendar },
      { href: '/dashboard/profile', label: 'My Profile', icon: User },
    ]
  } else {
    return [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
      { href: '/dashboard/book-service', label: 'Book Service', icon: Calendar },
      { href: '/dashboard/rewards', label: 'Rewards', icon: Trophy },
      { href: '/dashboard/profile', label: 'My Profile', icon: User },
    ]
  }
}

const sidebarVariants = {
  expanded: { 
    width: 256,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  },
  collapsed: { 
    width: 80,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
}

const contentVariants = {
  expanded: { 
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 }
  },
  collapsed: { 
    opacity: 0,
    x: -10,
    transition: { duration: 0.1 }
  }
}



export default function Sidebar() {
  const { user } = useAuth()
  const { isCollapsed, setIsCollapsed } = useSidebar()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const { toast } = useToast()

  // Check if user is admin
  const isAdmin = user?.email === 'd.dimpauls@gmail.com'

  // Fetch user profile image
  useEffect(() => {
    if (user) {
      fetchProfileImage()
    }
  }, [user])

  async function fetchProfileImage() {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('profile_image_url')
        .eq('id', user?.id)
        .single()

      if (data?.profile_image_url) {
        setProfileImageUrl(data.profile_image_url)
      }
    } catch (error) {
      // Silently fail - profile image is not critical
      console.log('Could not fetch profile image:', error)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const AuthDialog = ({ type }: { type: 'login' | 'signup' }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={type === 'signup' ? 'default' : 'outline'} 
          className="w-full"
        >
          {type === 'signup' ? 'Sign Up' : 'Log In'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-true-black border border-deep-purple/20">
        <DialogHeader>
          <DialogTitle className="text-primary-text">
            {type === 'signup' ? 'Create an account' : 'Welcome back'}
          </DialogTitle>
          <DialogDescription className="text-secondary-text">
            {type === 'signup' 
              ? 'Create an account to track your bookings and earn rewards.'
              : 'Sign in to manage your bookings and rewards.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-secondary-text">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="hello@example.com"
              variant="default"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-secondary-text">Password</Label>
            <Input 
              id="password" 
              type="password"
              variant="default"
            />
          </div>
          <Button className="w-full" variant="default">
            {type === 'signup' ? 'Create Account' : 'Sign In'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="h-full flex flex-col border-r border-deep-purple/20 w-64" style={{ background: 'linear-gradient(135deg, #141414 0%, #1E1E1E 100%)' }}>
      {/* Logo - Full Width */}
      <div className="p-6 border-b border-deep-purple/20 flex-shrink-0">
        <img 
          src="/logo.png" 
          alt="Love4Detailing" 
          className="w-full h-auto object-contain"
          style={{ 
            maxHeight: '60px'
          }}
        />
      </div>

      {/* User Section */}
      {user ? (
        <div className="p-6 space-y-4 flex-shrink-0">
          {/* Account Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-deep-purple/30">
              <AvatarImage src={profileImageUrl || ''} />
              <AvatarFallback className="bg-deep-purple text-primary-text">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary-text truncate">
                {(user as any)?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-secondary-text truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Button>

          <Separator className="bg-deep-purple/20" />

          {/* Rating and Review Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-text">Our Rating</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-deep-purple text-deep-purple" />
                <span className="text-sm font-medium text-primary-text">4.9/5</span>
              </div>
            </div>
            <p className="text-xs text-secondary-text">From 200+ customers</p>
          </div>

          <Separator className="bg-deep-purple/20" />

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-deep-purple" />
              <span className="text-sm text-secondary-text">+44 7123 456789</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-deep-purple" />
              <span className="text-sm text-secondary-text">South West London</span>
            </div>
          </div>

          <Separator className="bg-deep-purple/20" />
        </div>
      ) : (
        <div className="p-6 space-y-4 flex-shrink-0">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-primary-text">Welcome</h3>
            <p className="text-sm text-secondary-text">Sign in to access your dashboard</p>
          </div>
          <div className="space-y-2">
            <AuthDialog type="login" />
            <AuthDialog type="signup" />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      {user && (
        <nav className="flex-1 px-4 pb-6 space-y-1 overflow-y-auto min-h-0">
          <div className="space-y-1">
            {getNavItems(isAdmin).map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={<item.icon className="h-5 w-5" />}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </nav>
      )}
    </div>
  )

  // Mobile Sidebar
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 sidebar-gradient border-r border-deep-purple/20">
        <SidebarContent isMobile={true} />
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <MobileSidebar />
      </div>

      {/* Desktop Sidebar - Simplified with absolute positioning */}
      <div 
        className="hidden md:block"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '16rem',
          zIndex: 999,
          backgroundColor: '#1E1E1E',
          borderRight: '1px solid rgba(138, 43, 133, 0.2)',
          overflow: 'hidden'
        }}
      >
        <SidebarContent />
      </div>
    </>
  )
}

function SidebarItem({ 
  href, 
  icon, 
  label, 
  isActive 
}: { 
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
          isActive 
            ? "bg-deep-purple text-primary-text shadow-lg" 
            : "text-secondary-text hover:bg-deep-purple/10 hover:text-primary-text"
        )}
      >
        <span className={cn(
          "transition-colors duration-200",
          isActive ? "text-primary-text" : "text-deep-purple"
        )}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
    </Link>
  )
} 