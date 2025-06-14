import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://algoarena.co.in';
console.log('API_URL:', API_URL);

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const taskData = {
      title: searchParams.get('title'),
      description: searchParams.get('description'),
      progress: parseInt(searchParams.get('progress') || '0'),
      deadline: searchParams.get('deadline'),
      is_done: searchParams.get('is_done') === 'true',
      email: searchParams.get('email'),
      create: searchParams.get('create') === 'true'
    };

    console.log('Creating task at:', `${API_URL}/task/create-api`);
    console.log('Request params:', taskData);

    const response = await fetch(`${API_URL}/task/create-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(taskData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Task created successfully:', data);
    return addCorsHeaders(NextResponse.json(data));
  } catch (error) {
    console.error('Error creating task:', error);
    return addCorsHeaders(NextResponse.json(
      { error: 'Failed to create task. Please check your API configuration.' },
      { status: 500 }
    ));
  }
} 