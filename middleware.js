import { NextResponse } from 'next/server';

export function middleware(request) {
  // List of protected routes
  const protectedRoutes = [
    '/dashboard',
    '/goal',
    '/permitplanning',
    '/siteplotplans',
    '/basicprinciple',
    '/element'
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check if user is authenticated (this is a server-side check)
    // Since we're using localStorage for client-side auth, we can't check it here
    // But we can add additional security headers or perform other checks
    
    // For now, we'll let the client-side withAuth HOC handle the authentication
    // This middleware can be extended later for additional security measures
    
    const response = NextResponse.next();
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
