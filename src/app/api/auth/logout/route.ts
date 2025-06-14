import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get the cookie from the incoming request
    const cookie = request.headers.get('cookie');

    const response = await fetch('https://algoarena.co.in/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': cookie || '', // Forward the cookie
      },
      credentials: 'include',
    });

    const data = await response.json();

    // Create response with cookie deletion
    const res = NextResponse.json(data, {
      status: response.status,
      headers: {
        'Set-Cookie': response.headers.get('Set-Cookie') || '',
      },
    });
    
    // Delete the cookie by setting it to expire
    res.cookies.set({
      name: 'access_token',
      value: '',
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return res;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
} 