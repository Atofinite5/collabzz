import mongoose, { Schema, Document } from 'mongoose';
import { ITask, TaskStatus } from '../types';

export interface ITaskDocument extends Omit<ITask, '_id'>, Document {}

const VALID_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];

const taskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: VALID_STATUSES,
        message: 'Status must be one of: todo, in-progress, done',
      },
      default: 'todo',
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must have a creator'],
    },
  },
  { timestamps: true }
);

taskSchema.index({ status: 1 });
taskSchema.index({ creator: 1 });

export default mongoose.model<ITaskDocument>('Task', taskSchema);
