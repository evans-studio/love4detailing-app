import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { rateLimit, RATE_LIMITS } from '@/lib/utils/rateLimit'

export async function middleware(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() })

    // Refresh session if expired
    const { data: { session } } = await supabase.auth.getSession()

    // Get user profile if authenticated
    let userProfile: { role: string } | null = null
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      userProfile = profile
    }

    // Get the pathname
    const path = request.nextUrl.pathname

    // Public routes that don't need authentication or rate limiting
    const publicRoutes = [
      '/',
      '/auth/signin',
      '/auth/signup',
      '/auth/forgot-password',
      '/book',
      '/book/success'
    ]

    // API routes that need rate limiting
    const apiRoutes: Record<string, keyof typeof RATE_LIMITS> = {
      '/api/vehicle-lookup': 'VEHICLE_LOOKUP',
      '/api/bookings': 'BOOKING_CREATE',
      '/api/available-slots': 'GENERAL_API'
    }

    // Protected routes that need authentication
    const protectedRoutes = [
      '/dashboard',
      '/dashboard/bookings',
      '/dashboard/profile',
      '/dashboard/vehicles',
      '/dashboard/rewards'
    ]

    // Admin routes that need admin role
    const adminRoutes = [
      '/dashboard/admin',
      '/dashboard/admin/bookings',
      '/dashboard/admin/customers',
      '/dashboard/admin/services',
      '/dashboard/admin/settings'
    ]

    // Check if it's a public route
    if (publicRoutes.some(route => path.startsWith(route))) {
      return NextResponse.next()
    }

    // Apply rate limiting for API routes
    if (path.startsWith('/api')) {
      const routeConfig = Object.entries(apiRoutes).find(([route]) => path.startsWith(route))
      
      if (routeConfig) {
        const [_, limitType] = routeConfig
        const ip = request.ip || 'unknown'
        const identifier = session?.user?.id || ip
        
        const rateLimitResult = await rateLimit(identifier, limitType)
        
        if (!rateLimitResult.success) {
          return rateLimitResult.response
        }
      }
    }

    // Check authentication for protected routes
    if (protectedRoutes.some(route => path.startsWith(route))) {
      if (!session) {
        const redirectUrl = new URL('/auth/signin', request.url)
        redirectUrl.searchParams.set('redirectTo', path)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Check admin role for admin routes
    if (adminRoutes.some(route => path.startsWith(route))) {
      if (!session || userProfile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Update response headers
    const response = NextResponse.next()

    // Add user context to headers if authenticated
    if (session) {
      response.headers.set('X-User-Id', session.user.id)
      response.headers.set('X-User-Role', userProfile?.role || 'user')
    }

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    
    // Return error response for API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
    
    // Redirect to error page for other routes
    return NextResponse.redirect(new URL('/500', request.url))
  }
}

// Configure paths that need middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 