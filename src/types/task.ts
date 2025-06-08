export interface Task {
  collectionId?: string;
  collectionName?: string;
  completed_at?: string;
  created: string;
  deadline: string;
  description: string;
  email: string;
  id: string;
  is_done: boolean;
  progress: number;
  title: string;
  updated: string;
}

export interface TasksResponse {
  statusCode: number;
  message: string;
  data: Task[];
}

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, item: T) => React.ReactNode;
} 