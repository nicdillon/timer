import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on every request
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();
  
  // Get the current user's session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Define protected routes that require authentication
  // Note: Analytics page can be accessed by anonymous users to see demo data
  const protectedRoutes = ['/profile'];
  
  // Check if the current route is protected and user is not authenticated
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !session) {
    // Redirect to login page if trying to access protected route without authentication
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If user is authenticated and trying to access auth pages, redirect to profile
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth/');
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }
  
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Apply to all routes except static files and _next
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
