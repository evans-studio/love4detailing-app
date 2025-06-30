'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Card } from '@/components/ui/Card'
import Container from '@/components/ui/Container'
import { SignInForm } from '@/components/auth/SignInForm'

export default function SignInPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const [showSignUp, setShowSignUp] = useState(false)

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirect)
    }
  }, [user, isLoading, router, redirect])

  if (isLoading || user) {
    return null
  }

  if (showSignUp) {
    router.push('/auth/signup')
    return null
  }

  return (
    <Container className="py-12">
      <Card className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <SignInForm
          redirectPath={redirect}
          switchToSignUp={() => setShowSignUp(true)}
        />
      </Card>
    </Container>
  )
} 