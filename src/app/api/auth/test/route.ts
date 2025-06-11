import { NextResponse } from 'next/server';

const getAuthApiUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_AUTH_API_URL is not defined');
  }
  return `${baseUrl}/auth/login`;
};

export async function GET() {
  const apiUrl = getAuthApiUrl();
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    authApiUrl: apiUrl,
    baseUrl,
  });
} 