export interface Task {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  is_done: boolean;
  created: string;
  updated: string;
  completed_at: string | null;
  email: string;
  collectionId?: string;
  collectionName?: string;
}

export interface TasksResponse {
  statusCode: number;
  message: string;
  data: Task[];
}

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T] | null | undefined, item: T) => React.ReactNode;
} 