import { NextResponse } from 'next/server';

export async function GET() {
  const isLocalhost = process.env.NODE_ENV === 'development';
  const baseUrl = isLocalhost ? process.env.NEXT_PUBLIC_AUTH_API_URL : process.env.NEXT_PUBLIC_AUTH_API_URL;
  const apiUrl = `${baseUrl}/auth/login`;

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    authApiUrl: apiUrl,
    baseUrl,
  });
} 