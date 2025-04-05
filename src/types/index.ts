
export type User = {
  id: string;
  email: string;
  name: string;
};

export type Priority = 'high' | 'medium' | 'low';

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: Priority;
  categoryId: string;
  userId: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type TasksState = {
  tasks: Task[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
};
