import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/login`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Login request body:', body);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('API response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Login failed' },
        { status: response.status }
      );
    }

    // Get the Set-Cookie header from the API response
    const setCookieHeader = response.headers.get('set-cookie');
    console.log('Set-Cookie header from API:', setCookieHeader);

    // Create the response
    const res = NextResponse.json(data, { status: 201 });

    // If there's a Set-Cookie header, set it in our response
    if (setCookieHeader) {
      // Parse the Set-Cookie header
      const cookieValue = setCookieHeader.split(';')[0].split('=')[1];
      console.log('Setting cookie with value:', cookieValue);

      // Set the cookie in our response with modified settings
      res.cookies.set({
        name: 'access_token',
        value: cookieValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600,
      });

      // Log the cookie settings
      console.log('Cookie settings:', {
        name: 'access_token',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600
      });
    }

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 