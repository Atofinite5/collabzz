'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useAuth } from '@/lib/AuthContext';
import { tasksApi } from '@/lib/api';
import { Task, TaskStatus } from '@/types';
import Column from '@/components/Column';
import TaskModal from '@/components/TaskModal';
import DeleteConfirm from '@/components/DeleteConfirm';

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
];

export default function BoardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState('');

  // Search & filter
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Redirect if not authed
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoadingTasks(true);
      const params: Record<string, string> = {};
      if (search.trim()) params.search = search.trim();
      if (filterStatus) params.status = filterStatus;
      const res = await tasksApi.getAll(params);
      setTasks(res.data.data || []);
      setError('');
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Create task
  const handleCreate = async (data: { title: string; description: string; status: TaskStatus }) => {
    const res = await tasksApi.create(data);
    setTasks((prev) => [res.data.data, ...prev]);
  };

  // Edit task
  const handleEdit = async (data: { title: string; description: string; status: TaskStatus }) => {
    if (!editingTask) return;
    const res = await tasksApi.update(editingTask._id, data);
    setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? res.data.data : t)));
    setEditingTask(null);
  };

  // Delete task
  const handleDelete = async (taskId: string) => {
    await tasksApi.delete(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  // Drag and drop
  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId as TaskStatus;
    const task = tasks.find((t) => t._id === draggableId);
    if (!task || task.creator._id !== user?._id) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t))
    );

    try {
      await tasksApi.updateStatus(draggableId, newStatus);
    } catch {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) =>
          t._id === draggableId ? { ...t, status: source.droppableId as TaskStatus } : t
        )
      );
      setError('Failed to update task status');
    }
  };

  // Group tasks by status
  const grouped = COLUMNS.reduce(
    (acc, col) => {
      acc[col.status] = tasks.filter((t) => t.status === col.status);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>
  );

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Collabzz Board</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              Hi, {user.name}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-red-600 transition font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tasks..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm w-full sm:w-64 text-gray-900"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm bg-white text-gray-700"
            >
              <option value="">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <button
            onClick={() => { setEditingTask(null); setModalOpen(true); }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition whitespace-nowrap shadow-sm"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200 mb-4 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">&times;</button>
          </div>
        </div>
      )}

      {/* Board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        {loadingTasks ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {COLUMNS.map((col) => (
                <Column
                  key={col.status}
                  status={col.status}
                  title={col.title}
                  tasks={grouped[col.status]}
                  currentUserId={user._id}
                  onEdit={(task) => { setEditingTask(task); setModalOpen(true); }}
                  onDelete={(task) => { setDeleteTask(task); setDeleteOpen(true); }}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Create/Edit Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleEdit : handleCreate}
        task={editingTask}
      />

      {/* Delete Confirmation */}
      <DeleteConfirm
        task={deleteTask}
        isOpen={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeleteTask(null); }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
