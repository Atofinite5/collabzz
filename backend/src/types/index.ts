import { Request } from 'express';
import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface ITask {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  creator: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
  };
}

export interface JWTPayload {
  _id: string;
  email: string;
  name: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
