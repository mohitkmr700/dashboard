import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('API_URL:', API_URL);

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return addCorsHeaders(NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      ));
    }

    console.log('Removing task at:', `${API_URL}/task/remove`);
    console.log('Task ID:', id);

    const response = await fetch(`${API_URL}/task/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return addCorsHeaders(NextResponse.json(data));
  } catch (error) {
    console.error('Error removing task:', error);
    return addCorsHeaders(NextResponse.json(
      { error: 'Failed to remove task. Please check your API configuration.' },
      { status: 500 }
    ));
  }
} 