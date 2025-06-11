import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('API_URL:', API_URL);

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return addCorsHeaders(NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      ));
    }
    console.log('Fetching tasks from:', `${API_URL}/tasks?email=${email}`);

    const response = await fetch(`${API_URL}/tasks/list?email=${email}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return addCorsHeaders(NextResponse.json(data));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return addCorsHeaders(NextResponse.json(
      { error: 'Failed to fetch tasks. Please check your API configuration.' },
      { status: 500 }
    ));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating task at:', `${API_URL}/tasks/create`);

    const response = await fetch(`${API_URL}/tasks/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return addCorsHeaders(NextResponse.json(data));
  } catch (error) {
    console.error('Error creating task:', error);
    return addCorsHeaders(NextResponse.json(
      { error: 'Failed to create task. Please check your API configuration.' },
      { status: 500 }
    ));
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Updating task at:', `${API_URL}/tasks/update`);

    const response = await fetch(`${API_URL}/tasks/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return addCorsHeaders(NextResponse.json(data));
  } catch (error) {
    console.error('Error updating task:', error);
    return addCorsHeaders(NextResponse.json(
      { error: 'Failed to update task. Please check your API configuration.' },
      { status: 500 }
    ));
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const taskId = searchParams.get('id');

    if (!taskId) {
      return addCorsHeaders(NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      ));
    }

    console.log('Deleting task at:', `${API_URL}/tasks/delete?id=${taskId}`);

    const response = await fetch(`${API_URL}/tasks/delete?id=${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return addCorsHeaders(NextResponse.json(data));
  } catch (error) {
    console.error('Error deleting task:', error);
    return addCorsHeaders(NextResponse.json(
      { error: 'Failed to delete task. Please check your API configuration.' },
      { status: 500 }
    ));
  }
} 