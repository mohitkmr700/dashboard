import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected API routes
const PROTECTED_ROUTES = ['/api/auth/login'];

// API key for both local and production
const API_KEY = 'your-anon-key';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  // Handle root path redirection
  if (request.nextUrl.pathname === '/') {
    const accessToken = request.cookies.get('accessToken');
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add API key to protected routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('apikey', API_KEY);
  }

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/', '/api/:path*'],
}; 