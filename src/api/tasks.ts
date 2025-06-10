import { Task, TasksResponse } from '@/types/task';
import { ApiResponse } from '@/types';

export async function getTasks(email: string): Promise<TasksResponse> {
  try {
    console.log('Fetching tasks for email:', email);
    const response = await fetch(`/api/tasks?email=${encodeURIComponent(email)}`);
    
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
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        progress: task.progress,
        deadline: task.deadline,
        is_done: task.is_done,
        email: task.email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create task');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const response = await fetch('/api/tasks/remove', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

export async function updateTask(task: Task): Promise<Task> {
  try {
    const response = await fetch('/api/tasks', {
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
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update task');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
} 