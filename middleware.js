import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.AUTH_SECRET || 'expense-manager-capstone-default-super-secret-key-32bytes';
const secretKey = new TextEncoder().encode(JWT_SECRET);

const PROTECTED_PREFIXES = ['/dashboard', '/expenses', '/profile', '/settings'];
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  const tokenCookie = request.cookies.get('auth_token');
  const token = tokenCookie ? tokenCookie.value : null;

  let isValidSession = false;
  if (token) {
    try {
      await jwtVerify(token, secretKey);
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  // 1. Unauthenticated users trying to access protected pages -> redirect to login
  if (isProtected && !isValidSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users trying to access login/register -> redirect to dashboard
  if (isAuthRoute && isValidSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/expenses/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
};
