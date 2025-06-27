"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { content } from '@/lib/content'
import { useToast } from '@/hooks/use-toast'
import { signIn } from '@/lib/auth'
import { useRouter } from 'next/navigation'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SignInFormData = z.infer<typeof signInSchema>

interface SignInFormProps {
  onSuccess?: () => void
  redirectPath?: string
  bookingEmail?: string
  switchToSignUp: () => void
}

export const SignInForm = ({
  onSuccess,
  redirectPath = '/',
  bookingEmail,
  switchToSignUp,
}: SignInFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: bookingEmail || '',
    },
  })

  const onSubmit = async (data: SignInFormData) => {
    console.log('Sign in attempt started')
    setIsLoading(true)
    setError('')
    try {
      const { error } = await signIn(data.email, data.password)

      if (error) {
        console.error('Sign in error occurred')
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      console.log('Sign in successful, redirecting...')
      
      await router.refresh()
      
      if (onSuccess) {
        onSuccess()
      }
      
      if (redirectPath === '/') {
        router.replace('/dashboard')
      } else {
        router.replace(redirectPath)
      }
    } catch (err) {
      console.error('Authentication error occurred')
      setError(content.common.errors.general)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <div className="space-y-1">
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={isLoading}
      >
        {content.auth.signIn.button}
      </Button>

      <p className="text-center text-sm text-[#F8F4EB]/70">
        <button
          type="button"
          onClick={switchToSignUp}
          className="text-[#9747FF] hover:underline"
        >
          {content.auth.signIn.switchMode}
        </button>
      </p>
    </form>
  )
} 