import { PostgrestError } from '@supabase/supabase-js'

export interface SupabaseErrorResponse {
  code: string
  message: string
  details?: string
  hint?: string
}

export function getErrorMessage(error: PostgrestError | Error | unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if ((error as PostgrestError)?.code) {
    const pgError = error as PostgrestError
    
    switch (pgError.code) {
      case '42501':
        return 'You do not have permission to perform this action'
      case '23505':
        return 'This record already exists'
      case '23503':
        return 'This operation would violate referential integrity'
      case '42P01':
        return 'The requested resource does not exist'
      case '400':
        return 'Invalid request format'
      case '401':
        return 'Please sign in to continue'
      case '403':
        return 'You do not have permission to access this resource'
      case '404':
        return 'The requested resource was not found'
      case '409':
        return 'This operation conflicts with another request'
      case '429':
        return 'Too many requests, please try again later'
      case '500':
        return 'Internal server error, please try again later'
      default:
        return pgError.message || 'Database operation failed'
    }
  }

  return 'An unexpected error occurred'
}

export function handleSupabaseError(error: PostgrestError | Error | unknown, context?: string): string {
  console.error(`Supabase error${context ? ` in ${context}` : ''}:`, error)
  return getErrorMessage(error)
}

export function wrapSupabaseOperation<T>(
  operation: Promise<T>,
  context?: string
): Promise<T> {
  return operation.catch((error) => {
    const message = handleSupabaseError(error, context)
    throw new Error(message)
  })
} 
} 