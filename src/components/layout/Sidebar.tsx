"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Menu, Shield, Users, Calendar, Star, BarChart3, Settings, ChevronLeft, ChevronRight, User } from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth, signOut } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { useSidebar } from './SidebarContext'

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
      { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
      { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
      { href: '/dashboard/book-service', label: 'Book Service', icon: Calendar },
      { href: '/dashboard/rewards', label: 'Rewards', icon: Star },
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

const linkVariants = {
  normal: { scale: 1 },
  hover: { scale: 1.02 }
}

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isCollapsed, toggleCollapsed } = useSidebar()
  const pathname = usePathname()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const { user } = useAuth()
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
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'signup' ? 'Create an account' : 'Welcome back'}
          </DialogTitle>
          <DialogDescription>
            {type === 'signup' 
              ? 'Create an account to track your bookings and earn rewards.'
              : 'Sign in to manage your bookings and rewards.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="hello@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full">
            {type === 'signup' ? 'Create Account' : 'Sign In'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="h-full flex flex-col">
      {/* Logo Section */}
      <div className={`p-6 ${isCollapsed && !isMobile ? 'px-4' : ''}`}>
        <Link href="/" className="flex items-center justify-center">
          <div className={`relative ${isCollapsed && !isMobile ? 'w-12 h-12' : 'w-full h-16'}`}>
            <Image
              src="/logo.png"
              alt="Love4Detailing Logo"
              fill
              className="object-contain"
              priority
              sizes={isCollapsed && !isMobile ? "48px" : "100vw"}
            />
          </div>
        </Link>
      </div>

      {/* Collapse Toggle Button - Desktop Only */}
      {!isMobile && (
        <div className="px-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className="w-full flex items-center justify-center"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <AnimatePresence>
                  <motion.span
                    variants={contentVariants}
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    className="text-sm"
                  >
                    Collapse
                  </motion.span>
                </AnimatePresence>
              </>
            )}
          </Button>
        </div>
      )}

      {/* User Section */}
      <div className={`px-4 space-y-2 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
        {user ? (
          <>
            <div className="border-t border-border my-4" />
            <div className={`px-4 py-2 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
              <div className={`flex items-center gap-4 mb-4 ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
                <Avatar className={isCollapsed && !isMobile ? 'w-8 h-8' : 'w-10 h-10'}>
                  <AvatarImage src={profileImageUrl || undefined} alt="Profile" />
                  <AvatarFallback className="text-xs">
                    {user.full_name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <AnimatePresence>
                  {(!isCollapsed || isMobile) && (
                    <motion.div
                      variants={contentVariants}
                      animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{user.full_name}</p>
                        {isAdmin && (
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.div
                    variants={contentVariants}
                    animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
                  >
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <>
            <div className="border-t border-border my-4" />
            <div className={`px-4 space-y-2 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.div
                    variants={contentVariants}
                    animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
                    className="space-y-2"
                  >
                    <Button
                      className="w-full"
                      onClick={() => {
                        setShowAuthModal(true)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowAuthModal(true)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Create Account
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      <Separator className="my-6" />

      {user && (
        <nav className={`flex-1 px-4 space-y-6 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
          {/* Navigation */}
          <div>
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.h3
                  variants={contentVariants}
                  animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
                  className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
                >
                  {isAdmin ? 'Administration' : 'Dashboard'}
                </motion.h3>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {getNavItems(isAdmin).map((item) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.href}
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        pathname === item.href 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                      title={isCollapsed && !isMobile ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <AnimatePresence>
                        {(!isCollapsed || isMobile) && (
                          <motion.span
                            variants={contentVariants}
                            animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Bottom Actions */}
      <div className={`p-4 space-y-2 ${isCollapsed && !isMobile ? 'px-2' : ''}`}>
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.div
              variants={contentVariants}
              animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
              className="space-y-2"
            >
              <Button variant="outline" className="w-full" asChild>
                <Link href={user ? "/dashboard/book-service" : "/booking"}>Book a Service</Link>
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/services">View Services</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        {isCollapsed && !isMobile && (
          <div className="flex flex-col space-y-2">
            <Button variant="outline" size="sm" className="w-full p-2" asChild title="Book a Service">
              <Link href={user ? "/dashboard/book-service" : "/booking"}>
                <Calendar className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="w-full p-2" asChild title="View Services">
              <Link href="/services">
                <Star className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:bg-background lg:border-r lg:border-border"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
} 