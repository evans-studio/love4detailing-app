"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { content } from '@/lib/content'
import { useToast } from '@/hooks/use-toast'
import { signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignUpFormData = z.infer<typeof signUpSchema>

interface SignUpFormProps {
  onSuccess?: () => void
  redirectPath?: string
  bookingEmail?: string
  switchToSignIn: () => void
  onSignUpSuccess: () => void
}

export const SignUpForm = ({
  onSuccess,
  redirectPath = '/',
  bookingEmail,
  switchToSignIn,
  onSignUpSuccess,
}: SignUpFormProps) => {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: bookingEmail || '',
    },
  })

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await signUp(data.email, data.password, data.name)

      setIsLoading(false)

      if (error) {
        toast({
          title: 'Sign-up failed',
          description: error.message,
          variant: 'destructive',
        })
        setError(error.message)
      } else {
        toast({
          title: 'Success!',
          description: 'Your account has been created.',
        })
        onSignUpSuccess()
        router.push('/dashboard')
      }
    } catch (err) {
      setError(content.common.errors.general)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <div className="space-y-1">
          <Input
            type="text"
            placeholder="Full Name"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
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
        <div className="space-y-1">
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
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
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          content.auth.signUp.button
        )}
      </Button>

      <p className="text-center text-sm text-[#F8F4EB]/70">
        <button
          type="button"
          onClick={switchToSignIn}
          className="text-[#9747FF] hover:underline"
        >
          {content.auth.signUp.switchMode}
        </button>
      </p>
    </form>
  )
} 