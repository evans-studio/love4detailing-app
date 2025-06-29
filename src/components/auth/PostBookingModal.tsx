"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'
import { AuthModal } from './AuthModal'

interface PostBookingModalProps {
  isOpen: boolean
  onClose: () => void
  bookingEmail: string
}

export function PostBookingModal({
  isOpen,
  onClose,
  bookingEmail,
}: PostBookingModalProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <Dialog open={isOpen && !showAuthModal} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Booking Confirmed!</DialogTitle>
            <DialogDescription>
              Create an account to track your booking, earn rewards, and get exclusive offers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Track your booking status</p>
              <p>✓ Earn rewards points</p>
              <p>✓ View your vehicle images</p>
              <p>✓ Get exclusive member discounts</p>
            </div>
            <Button
              className="w-full"
              onClick={() => setShowAuthModal(true)}
            >
              Create Account & Start Earning
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
            >
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal
        open={showAuthModal}
        onOpenChange={(open) => {
          setShowAuthModal(open)
          if (!open) onClose()
        }}
        defaultTab="sign-up"
        redirectPath="/dashboard"
        bookingEmail={bookingEmail}
      />
    </>
  )
} 