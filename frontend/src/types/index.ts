export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  creator: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data?: Task | Task[];
}

export interface ApiError {
  success: false;
  message: string;
  data?: Array<{ msg: string; path: string }>;
}
