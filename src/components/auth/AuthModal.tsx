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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Love4Detailing</DialogTitle>
          <DialogDescription>
            {activeTab === 'sign-up' 
              ? 'Create an account to start booking and earning rewards.'
              : 'Sign in to manage your bookings and rewards.'}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'sign-in' | 'sign-up')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <form onSubmit={handleSignIn} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  defaultValue={bookingEmail}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="sign-up">
            <form onSubmit={handleSignUp} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                  autoComplete="name"
                  defaultValue={bookingData?.customer}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  defaultValue={bookingEmail}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Choose a password"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 