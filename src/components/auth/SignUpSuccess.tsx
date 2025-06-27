"use client"

import { Button } from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'
import { Text } from '@mantine/core'
import { content } from '@/lib/content'

interface SignUpSuccessProps {
  onSignIn: () => void
}

const theme = {
  colors: {
    primary: '#8A2B85',
    black: '#141414',
    offWhite: '#F8F4EB',
    gray: '#C7C7C7',
  },
  opacity: {
    high: '0.9',
  },
}

export const SignUpSuccess = ({ onSignIn }: SignUpSuccessProps) => {
  return (
    <div className="space-y-6 py-4 text-center">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-[#F8F4EB]">
          {content.auth.signUp.success.title}
        </h3>
        <p className="text-[#F8F4EB]/70">
          {content.auth.signUp.success.message}
        </p>
      </div>
      <Button
        type="button"
        variant="default"
        className="w-full"
        onClick={onSignIn}
      >
        {content.auth.signIn.button}
      </Button>
    </div>
  )
} 