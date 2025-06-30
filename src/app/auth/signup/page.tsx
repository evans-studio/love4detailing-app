'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Card } from '@/components/ui/Card'
import Container from '@/components/ui/Container'
import { SignUpForm } from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const [showSignIn, setShowSignIn] = useState(false)

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirect)
    }
  }, [user, isLoading, router, redirect])

  if (isLoading || user) {
    return null
  }

  if (showSignIn) {
    router.push('/auth/signin')
    return null
  }

  return (
    <Container className="py-12">
      <Card className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>
        <SignUpForm
          _redirectPath={redirect}
          switchToSignIn={() => setShowSignIn(true)}
          onSignUpSuccess={() => router.push(redirect)}
        />
      </Card>
    </Container>
  )
} 