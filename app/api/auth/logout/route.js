import { NextResponse } from 'next/server';
import { cookieOptions } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.set(cookieOptions.name, '', {
    ...cookieOptions,
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
