"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { signIn, signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'sign-in' | 'sign-up'
  redirectPath?: string
  onSuccess?: () => void
  bookingEmail?: string
}

export function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'sign-in',
  redirectPath = '/dashboard',
  onSuccess,
  bookingEmail,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'sign-in' | 'sign-up'>(defaultTab)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Get booking data from localStorage to pre-fill form
  const getBookingData = () => {
    if (typeof window !== 'undefined' && bookingEmail) {
      const lastBooking = JSON.parse(localStorage.getItem('lastBooking') || '{}')
      // Only use the booking data if it matches the current booking email
      if (lastBooking.email === bookingEmail) {
        return lastBooking
      }
      // Clear old booking data if it doesn't match
      localStorage.removeItem('lastBooking')
    }
    return null
  }

  const bookingData = getBookingData()

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      const { error } = await signIn(email, password)

      if (error) {
        toast({
          title: "Error signing in",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success!",
        description: "You have been signed in.",
      })

      onSuccess?.()
      router.push(redirectPath)
      onClose()
    } catch (error) {
      console.error('Sign in error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const fullName = formData.get('fullName') as string

      const { error } = await signUp(email, password, fullName)

      if (error) {
        toast({
          title: "Error signing up",
          description: error.message || "Please check your information and try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success!",
        description: bookingEmail 
          ? "Your account has been created and your recent booking has been linked to your account. Please check your email to confirm your registration."
          : "Your account has been created. Please check your email to confirm your registration.",
      })

      // If there's a booking email, redirect to dashboard, otherwise switch to sign-in tab
      if (bookingEmail) {
        onSuccess?.()
        router.push(redirectPath)
        onClose()
      } else {
        // Switch to sign-in tab after successful registration
        setActiveTab('sign-in')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] sm:w-full bg-[#141414] border border-[#8A2B85]/20">
        <DialogHeader>
          <DialogTitle className="text-[#F8F4EB] text-lg sm:text-xl">Welcome to Love4Detailing</DialogTitle>
          <DialogDescription className="text-[#C7C7C7]">
            {activeTab === 'sign-up' 
              ? 'Create an account to start booking and earning rewards.'
              : 'Sign in to manage your bookings and rewards.'}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'sign-in' | 'sign-up')}>
          <TabsList className="grid w-full grid-cols-2 bg-[#1E1E1E] border border-[#8A2B85]/20">
            <TabsTrigger 
              value="sign-in"
              className="data-[state=active]:bg-[#8A2B85] data-[state=active]:text-white text-[#C7C7C7]"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="sign-up"
              className="data-[state=active]:bg-[#8A2B85] data-[state=active]:text-white text-[#C7C7C7]"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <form onSubmit={handleSignIn} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#C7C7C7]">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  defaultValue={bookingEmail}
                  className="bg-[#1E1E1E] border-[#8A2B85]/20 text-[#F8F4EB] placeholder:text-[#C7C7C7]/60"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#C7C7C7]">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="bg-[#1E1E1E] border-[#8A2B85]/20 text-[#F8F4EB] placeholder:text-[#C7C7C7]/60"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-white touch-target min-h-[48px]" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="sign-up">
            <form onSubmit={handleSignUp} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[#C7C7C7]">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                  autoComplete="name"
                  defaultValue={bookingData?.customer}
                  className="bg-[#1E1E1E] border-[#8A2B85]/20 text-[#F8F4EB] placeholder:text-[#C7C7C7]/60"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupEmail" className="text-[#C7C7C7]">Email</Label>
                <Input
                  id="signupEmail"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  defaultValue={bookingEmail || bookingData?.email}
                  className="bg-[#1E1E1E] border-[#8A2B85]/20 text-[#F8F4EB] placeholder:text-[#C7C7C7]/60"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupPassword" className="text-[#C7C7C7]">Password</Label>
                <Input
                  id="signupPassword"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="bg-[#1E1E1E] border-[#8A2B85]/20 text-[#F8F4EB] placeholder:text-[#C7C7C7]/60"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#8A2B85] hover:bg-[#8A2B85]/90 text-white touch-target min-h-[48px]" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 