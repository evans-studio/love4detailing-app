"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth, signOut } from '@/lib/auth'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Home, Calendar, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: Calendar },
  { href: '/faq', label: 'FAQ', icon: Star },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Mobile menu animations
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40",
          "transition-colors duration-300",
          "min-h-[64px] flex items-center",
          isScrolled && "bg-[#141414]/90 backdrop-blur-sm border-b border-[#8A2B85]/20"
        )}
      >
        <Container className="h-full" maxWidth="2xl">
          <div className="flex items-center justify-between h-full py-2">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "bg-[#141414]/90 backdrop-blur-sm",
                      "border-[#8A2B85]/20 text-[#F8F4EB]",
                      "hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB]",
                      "shadow-lg touch-target",
                      "min-h-[44px] min-w-[44px]",
                      "rounded-full"
                    )}
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  className={cn(
                    "p-0 bg-[#141414] border-r border-[#8A2B85]/20",
                    "w-[85vw] max-w-[320px] sm:max-w-[360px]"
                  )}
                >
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                  >
                    <SheetHeader className="p-4 border-b border-[#8A2B85]/20">
                      <SheetTitle className="text-[#F8F4EB]">Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col p-4 space-y-1">
                      {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-3 rounded-lg",
                              "transition-all duration-200 touch-target min-h-[44px]",
                              isActive 
                                ? "bg-[#8A2B85]/10 text-[#8A2B85] border border-[#8A2B85]/20"
                                : "text-[#C7C7C7] hover:bg-[#8A2B85]/5 hover:text-[#F8F4EB]"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        )
                      })}
                    </nav>
                  </motion.div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive 
                        ? "text-[#8A2B85]"
                        : "text-[#C7C7C7] hover:text-[#F8F4EB]"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Auth Buttons */}
            {!isLoading && (
              <div className="flex items-center space-x-4">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "border-[#8A2B85]/20 text-[#F8F4EB]",
                          "hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB]",
                          "touch-target min-h-[44px]"
                        )}
                      >
                        Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end"
                      className="bg-[#141414] border-[#8A2B85]/20"
                    >
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/dashboard"
                          className="text-[#F8F4EB] hover:bg-[#8A2B85]/10"
                        >
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/dashboard/bookings"
                          className="text-[#F8F4EB] hover:bg-[#8A2B85]/10"
                        >
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/dashboard/rewards"
                          className="text-[#F8F4EB] hover:bg-[#8A2B85]/10"
                        >
                          Rewards
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="text-[#F8F4EB] hover:bg-[#8A2B85]/10"
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsAuthModalOpen(true)}
                      className={cn(
                        "text-[#C7C7C7] hover:text-[#F8F4EB] hover:bg-[#8A2B85]/10",
                        "touch-target min-h-[44px]",
                        "hidden sm:inline-flex"
                      )}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="default" 
                      asChild
                      className={cn(
                        "bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-white",
                        "touch-target min-h-[44px]"
                      )}
                    >
                      <Link href="/booking">Book Now</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="sign-in"
      />
    </>
  )
} 