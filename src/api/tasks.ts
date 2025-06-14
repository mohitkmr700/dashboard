import { Task, TasksResponse } from '@/types/task';
import { ApiResponse } from '@/types';

const getBaseUrl = (endpoint: string) => {
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const baseUrl = isLocalhost ? process.env.NEXT_PUBLIC_API_URL : '';
  const path = isLocalhost ? endpoint.replace('api/', '') : endpoint;
  return `${baseUrl}${path}`;
};

export async function getTasks(email: string): Promise<TasksResponse> {
  try {
    console.log('Fetching tasks for email:', email);
    const response = await fetch(getBaseUrl('/api/task/list') + `?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch tasks');
    }
    
    const data = await response.json();
    console.log('Tasks fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function createTask(task: Omit<Task, 'id' | 'created' | 'updated' | 'collectionId' | 'collectionName'>): Promise<Task> {
  try {
    console.log('Creating task with data:', task);
    const queryParams = new URLSearchParams({
      title: task.title,
      description: task.description,
      progress: task.progress.toString(),
      deadline: task.deadline,
      is_done: task.is_done.toString(),
      email: task.email,
      create: 'true'
    });

    const response = await fetch(`/api/task/create-api?${queryParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || 'Failed to create task');
    }

    const data = await response.json();
    console.log('Task created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    console.log('Deleting task with ID:', id);
    const response = await fetch('/api/task/remove', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || 'Failed to delete task');
    }

    console.log('Task deleted successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

export async function updateTask(task: Task): Promise<Task> {
  try {
    console.log('Updating task with data:', task);
    const response = await fetch('/api/task/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: task.id,
        title: task.title,
        description: task.description,
        progress: task.progress,
        deadline: task.deadline,
        is_done: task.is_done,
        completed_at: task.completed_at,
        email: task.email,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || 'Failed to update task');
    }

    const data = await response.json();
    console.log('Task updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
} 