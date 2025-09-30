'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TaskDetail from '@/components/TaskDetail';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface TaskData {
  id: string;
  feature_id: string;
  user_story_ref: string;
  title: string;
  description: string;
  technical_work_description: string;
  type: string;
  status: string;
  priority: string;
  assigned_to: string;
  estimated_hours: number;
  actual_hours: number;
  due_date: string;
  color: string;
  tags: string[];
  dependencies: string[];
  created_at: string;
  updated_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sub_tasks: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  feature: any;
  metrics: {
    totalSubTasks: number;
    completedSubTasks: number;
    subTaskCompletionRate: number;
    estimatedVsActual: number;
  };
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSetCurrentView = useCallback((view: string) => {
    if (view === 'dashboard') router.push('/dashboard');
    else if (view === 'projects') router.push('/dashboard');
    else if (view === 'tasks') router.push('/dashboard');
    else if (view === 'tickets') router.push('/dashboard');
    else router.push('/dashboard');
  }, [router]);

  useEffect(() => {
    const fetchTask = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/tasks/${params.id}`);

        if (!response.ok) {
          throw new Error('Task not found');
        }

        const data = await response.json();
        setTask(data);
      } catch (error) {
        console.error('Error fetching task:', error);
        setError(error instanceof Error ? error.message : 'Failed to load task');
        toast.error('Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [params.id]);

  const handleSave = async (taskId: string, data: Partial<TaskData>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTask(updatedTask);
      setEditMode(false);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      toast.success('Task deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !task) {
    return (
      <div className="h-screen bg-slate-50 flex">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          tickets={[]}
          currentView="tasks"
          setCurrentView={handleSetCurrentView}
          isMobile={false}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-slate-600">Loading task...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="h-screen bg-slate-50 flex">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          tickets={[]}
          currentView="tasks"
          setCurrentView={handleSetCurrentView}
          isMobile={false}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Task Not Found</h1>
            <p className="text-slate-600 mb-4">{error || 'The task you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        tickets={[]}
        currentView="tasks"
        setCurrentView={handleSetCurrentView}
        isMobile={false}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TaskDetail
          selectedTask={task}
          editMode={editMode}
          loading={loading}
          onBack={() => router.push('/dashboard')}
          onEdit={() => setEditMode(true)}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={() => setEditMode(false)}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}