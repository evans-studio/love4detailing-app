import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

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

  // Create Supabase client for auth checks
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
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
        remove(name: string, options: CookieOptions) {
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

  // Check for protected routes
  if (
    request.nextUrl.pathname.startsWith('/dashboard/') ||
    request.nextUrl.pathname.startsWith('/api/')
  ) {
    // Get session
    const { data: { session } } = await supabase.auth.getSession()

    // If no session, redirect to home for dashboard routes
    if (!session && request.nextUrl.pathname.startsWith('/dashboard/')) {
      const redirectUrl = new URL('/', request.url)
      redirectUrl.searchParams.set('auth', 'required')
      return NextResponse.redirect(redirectUrl)
    }

    // Check for admin routes
    if (request.nextUrl.pathname.startsWith('/dashboard/admin/')) {
      if (!session) {
        const redirectUrl = new URL('/', request.url)
        redirectUrl.searchParams.set('auth', 'required')
        return NextResponse.redirect(redirectUrl)
      }

      // Check if user has admin privileges (by email)
      const adminEmails = ['evanspaul87@gmail.com', 'admin@love4detailing.com', 'd.dimpauls@gmail.com']
      const userEmail = session.user?.email

      if (!userEmail || !adminEmails.includes(userEmail)) {
        // Redirect non-admin users to regular dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Refresh session for all protected routes
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