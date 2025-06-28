import { toast } from '@/hooks/use-toast'

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown) {
  console.error('Error:', error)

  if (error instanceof AppError) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    })
    return
  }

  if (error instanceof Error) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    })
    return
  }

  toast({
    title: 'Error',
    description: 'An unexpected error occurred. Please try again.',
    variant: 'destructive',
  })
}

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function createError(
  message: string,
  code: keyof typeof ERROR_CODES = 'INTERNAL_ERROR',
  statusCode = 500
) {
  return new AppError(message, ERROR_CODES[code], statusCode)
} 