import { useToast } from '@/components/ui/use-toast'
import { PostgrestError } from '@supabase/supabase-js'

export interface SupabaseErrorResponse {
  code: string
  message: string
  details?: string
  hint?: string
}

export function handleSupabaseError(error: PostgrestError | Error | unknown, context?: string): void {
  console.error(`Supabase error${context ? ` in ${context}` : ''}:`, error)

  let errorMessage = 'An unexpected error occurred'

  if (error instanceof Error) {
    errorMessage = error.message
  } else if ((error as PostgrestError)?.code) {
    const pgError = error as PostgrestError
    
    switch (pgError.code) {
      case '42501':
        errorMessage = 'You do not have permission to perform this action'
        break
      case '23505':
        errorMessage = 'This record already exists'
        break
      case '23503':
        errorMessage = 'This operation would violate referential integrity'
        break
      case '42P01':
        errorMessage = 'The requested resource does not exist'
        break
      case '400':
        errorMessage = 'Invalid request format'
        break
      case '401':
        errorMessage = 'Please sign in to continue'
        break
      case '403':
        errorMessage = 'You do not have permission to access this resource'
        break
      case '404':
        errorMessage = 'The requested resource was not found'
        break
      case '409':
        errorMessage = 'This operation conflicts with another request'
        break
      case '429':
        errorMessage = 'Too many requests, please try again later'
        break
      case '500':
        errorMessage = 'Internal server error, please try again later'
        break
      default:
        errorMessage = pgError.message || 'Database operation failed'
    }
  }

  // Show error toast
  const { toast } = useToast()
  toast({
    title: 'Error',
    description: errorMessage,
    variant: 'destructive',
  })
}

export function wrapSupabaseOperation<T>(
  operation: Promise<T>,
  context?: string
): Promise<T> {
  return operation.catch((error) => {
    handleSupabaseError(error, context)
    throw error
  })
} 