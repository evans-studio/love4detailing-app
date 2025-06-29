"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'
import { SignUpSuccess } from './SignUpSuccess'
import { useRouter } from 'next/navigation'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: 'sign-in' | 'sign-up'
  redirectPath?: string
  bookingEmail?: string
}

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = 'sign-in',
  redirectPath = '/',
  bookingEmail,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    onOpenChange(false)
    router.replace(redirectPath)
    router.refresh()
  }

  const handleSignUpSuccess = () => {
    setShowSuccess(true)
  }

  const handleSwitchToSignIn = () => {
    setActiveTab('sign-in')
  }

  const handleSwitchToSignUp = () => {
    setActiveTab('sign-up')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {showSuccess
              ? "Success!"
              : activeTab === 'sign-in'
              ? "Sign In"
              : "Sign Up"}
          </DialogTitle>
          <DialogDescription>
            {activeTab === 'sign-in'
              ? 'Enter your credentials to access your account.'
              : 'Create an account to manage your bookings.'}
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <SignUpSuccess onSignIn={handleSwitchToSignIn} />
        ) : activeTab === 'sign-in' ? (
          <SignInForm
            onSuccess={handleSuccess}
            redirectPath={redirectPath}
            bookingEmail={bookingEmail}
            switchToSignUp={handleSwitchToSignUp}
          />
        ) : (
          <SignUpForm
            onSignUpSuccess={handleSignUpSuccess}
            bookingEmail={bookingEmail}
            switchToSignIn={handleSwitchToSignIn}
          />
        )}
      </DialogContent>
    </Dialog>
  )
} 