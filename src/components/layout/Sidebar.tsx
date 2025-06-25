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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
    <div className="h-full flex flex-col border-r border-[#8A2B85]/20 w-64" style={{ background: 'linear-gradient(135deg, #141414 0%, #1E1E1E 100%)' }}>
      {/* Logo - Fixed proportions */}
      <div className="sidebar-logo-container border-b border-[#8A2B85]/20 flex-shrink-0">
        <Link href="/" className="flex items-center justify-center p-6">
          <div className="relative w-full max-w-[160px] h-16">
            <Image
              src="/logo.png"
              alt="Love4Detailing Logo"
              fill
              className="sidebar-logo object-contain"
              priority
              sizes="160px"
              style={{
                objectFit: 'contain',
                objectPosition: 'center'
              }}
              onError={(e) => {
                console.error('Logo failed to load:', e)
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = '<div class="text-[#8A2B85] font-bold text-lg">L4D</div>'
                }
              }}
            />
          </div>
        </Link>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-[#8A2B85]/20 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border-2 border-[#8A2B85]/20">
            <AvatarImage src={profileImageUrl || undefined} alt={user?.email || 'User'} />
            <AvatarFallback className="bg-[#8A2B85]/10 text-[#8A2B85] font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#F8F4EB] truncate">
              {(user as any)?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-[#C7C7C7] truncate">{user?.email}</p>
            {isAdmin && (
              <Badge variant="secondary" className="mt-1 text-xs bg-[#8A2B85]/10 text-[#8A2B85] border-[#8A2B85]/20">
                Admin
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-h-0">
        <div className="space-y-1">
          {getNavItems(isAdmin).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 touch-target ${
                  isActive 
                    ? 'bg-[#8A2B85]/10 text-[#8A2B85] border border-[#8A2B85]/20' 
                    : 'text-[#C7C7C7] hover:bg-[#8A2B85]/5 hover:text-[#F8F4EB]'
                }`}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-[#8A2B85]/20 flex-shrink-0">
        <div className="space-y-2">
          <Link href="/dashboard/book-service">
            <Button 
              className="w-full bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-white touch-target"
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Quick Book
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full border-[#8A2B85]/20 text-[#C7C7C7] hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB] touch-target"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </div>
    </div>
  )

  // Mobile Menu Button - Improved positioning and touch targets
  const MobileMenuButton = () => (
    <div className="md:hidden fixed top-4 left-4 z-50">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-[#141414]/90 backdrop-blur-sm border-[#8A2B85]/20 text-[#F8F4EB] hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB] shadow-lg touch-target"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="p-0 bg-[#141414] border-r border-[#8A2B85]/20 w-80 max-w-[85vw]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Dashboard Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent isMobile={true} />
        </SheetContent>
      </Sheet>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <MobileMenuButton />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="sign-in"
      />
    </>
  )
} 