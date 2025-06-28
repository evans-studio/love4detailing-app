"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'
import { SignUpSuccess } from './SignUpSuccess'
import { useRouter } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'sign-in' | 'sign-up'
  redirectPath?: string
  bookingEmail?: string
}

export function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'sign-in',
  redirectPath = '/',
  bookingEmail,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    onClose()
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {showSuccess
              ? "Success!"
              : activeTab === 'sign-in'
              ? "Sign In"
              : "Sign Up"}
          </DialogTitle>
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
            onSuccess={handleSignUpSuccess}
            onSignUpSuccess={handleSignUpSuccess}
            bookingEmail={bookingEmail}
            switchToSignIn={handleSwitchToSignIn}
          />
        )}
      </DialogContent>
    </Dialog>
  )
} 