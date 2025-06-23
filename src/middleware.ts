import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and images
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/static/') ||
    request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|gif|svg)$/)
  ) {
    return NextResponse.next()
  }

  // Initialize response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Only handle auth for API routes and dashboard
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/dashboard/')
  ) {
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            request.cookies.delete(name)
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.delete(name)
          },
        },
      }
    )

    // Refresh session for protected routes
    await supabase.auth.getSession()
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/((?!.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 