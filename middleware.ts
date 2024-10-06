import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/auth/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * Also excludes the root path (/)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
    '/((?!^$).*)', // This line excludes the root path
  ],
}