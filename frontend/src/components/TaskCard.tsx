'use client';

import { Task } from '@/types';
import { Draggable } from '@hello-pangea/dnd';

interface TaskCardProps {
  task: Task;
  index: number;
  currentUserId: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
    'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function TaskCard({ task, index, currentUserId, onEdit, onDelete }: TaskCardProps) {
  const isCreator = task.creator._id === currentUserId;
  const creatorName = task.creator.name;

  return (
    <Draggable draggableId={task._id} index={index} isDragDisabled={!isCreator}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg border p-4 mb-3 transition-shadow ${
            snapshot.isDragging
              ? 'shadow-lg border-blue-300 ring-2 ring-blue-100'
              : 'shadow-sm border-gray-200 hover:shadow-md'
          } ${!isCreator ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900 text-sm leading-snug flex-1">
              {task.title}
            </h3>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${getAvatarColor(creatorName)}`}
              title={creatorName}
            >
              {getInitials(creatorName)}
            </div>
          </div>

          <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{task.description}</p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-[10px] text-gray-400">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>

            {isCreator && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                  className="text-xs text-gray-400 hover:text-blue-600 px-2 py-0.5 rounded hover:bg-blue-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(task); }}
                  className="text-xs text-gray-400 hover:text-red-600 px-2 py-0.5 rounded hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
