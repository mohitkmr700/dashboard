import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch('https://algoarena.co.in/api/auth/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

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
    const res = NextResponse.json(data, { status: 200 });

    // If there's a Set-Cookie header, set it in our response
    if (setCookieHeader) {
      // Parse the Set-Cookie header
      const cookieValue = setCookieHeader.split(';')[0].split('=')[1];
      console.log('Setting cookie with value:', cookieValue);

      // Set the cookie in our response
      res.cookies.set({
        name: 'access_token',
        value: cookieValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600, // 1 hour
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