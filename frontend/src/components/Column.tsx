'use client';

import { Task, TaskStatus } from '@/types';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

interface ColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  currentUserId: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const columnStyles: Record<TaskStatus, { bg: string; accent: string; badge: string }> = {
  'todo': {
    bg: 'bg-gray-50',
    accent: 'bg-gray-300',
    badge: 'bg-gray-200 text-gray-700',
  },
  'in-progress': {
    bg: 'bg-blue-50/50',
    accent: 'bg-blue-400',
    badge: 'bg-blue-100 text-blue-700',
  },
  'done': {
    bg: 'bg-green-50/50',
    accent: 'bg-green-400',
    badge: 'bg-green-100 text-green-700',
  },
};

export default function Column({ status, title, tasks, currentUserId, onEdit, onDelete }: ColumnProps) {
  const styles = columnStyles[status];

  return (
    <div className={`${styles.bg} rounded-xl p-4 min-h-[400px] flex flex-col`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2.5 h-2.5 rounded-full ${styles.accent}`} />
        <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.badge}`}>
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-lg transition-colors min-h-[100px] ${
              snapshot.isDraggingOver ? 'bg-blue-100/50 ring-2 ring-blue-200 ring-dashed' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                currentUserId={currentUserId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center text-gray-400 text-xs py-8">
                No tasks yet
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
