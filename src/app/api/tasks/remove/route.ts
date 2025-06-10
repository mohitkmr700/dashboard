import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const response = await fetch(`${API_URL}/tasks/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to delete task' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in delete task proxy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 