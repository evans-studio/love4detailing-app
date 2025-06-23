'use client'

import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function AuthErrorPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-bold">Authentication Error</h1>
        <p className="text-lg text-muted-foreground">
          There was a problem authenticating your account. This could be because:
        </p>
        <ul className="mt-4 space-y-2 text-left text-muted-foreground">
          <li>• The authentication link has expired</li>
          <li>• You've already used this authentication link</li>
          <li>• There was a technical problem during authentication</li>
        </ul>
        <div className="mt-8 space-y-4">
          <Button
            onClick={() => router.push('/')}
            className="w-full"
          >
            Return to Home
          </Button>
          <Button
            onClick={() => router.push('/auth/signin')}
            variant="outline"
            className="w-full"
          >
            Try Signing In Again
          </Button>
        </div>
      </div>
    </div>
  )
} 