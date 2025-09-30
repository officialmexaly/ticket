'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SubTaskDetail from '@/components/SubTaskDetail';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface SubTaskData {
  id: string;
  task_id: string;
  title: string;
  description: string;
  atomic_work_description: string;
  type: string;
  status: string;
  assigned_to: string;
  estimated_hours: number;
  actual_hours: number;
  due_date: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  task: any;
  time_logs: any[];
  metrics: {
    timeSpent: number;
    estimatedVsActual: number;
    efficiency: number;
  };
}

export default function SubTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [subTask, setSubTask] = useState<SubTaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchSubTask = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/sub-tasks/${params.id}`);

        if (!response.ok) {
          throw new Error('Sub-task not found');
        }

        const data = await response.json();
        setSubTask(data);
      } catch (error) {
        console.error('Error fetching sub-task:', error);
        setError(error instanceof Error ? error.message : 'Failed to load sub-task');
        toast.error('Failed to load sub-task');
      } finally {
        setLoading(false);
      }
    };

    fetchSubTask();
  }, [params.id]);

  const handleSave = async (subTaskId: string, data: Partial<SubTaskData>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sub-tasks/${subTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update sub-task');
      }

      const updatedSubTask = await response.json();
      setSubTask(updatedSubTask);
      setEditMode(false);
      toast.success('Sub-task updated successfully');
    } catch (error) {
      console.error('Error updating sub-task:', error);
      toast.error('Failed to update sub-task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subTaskId: string) => {
    if (!window.confirm('Are you sure you want to delete this sub-task? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/sub-tasks/${subTaskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete sub-task');
      }

      toast.success('Sub-task deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting sub-task:', error);
      toast.error('Failed to delete sub-task');
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

  if (loading && !subTask) {
    return (
      <div className="h-screen bg-slate-50 flex">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          tickets={[]}
          currentView="subtasks"
          setCurrentView={(view) => {
            if (view === 'dashboard') router.push('/dashboard');
            else if (view === 'projects') router.push('/dashboard');
            else if (view === 'tasks') router.push('/dashboard');
            else if (view === 'tickets') router.push('/dashboard');
            else router.push('/dashboard');
          }}
          isMobile={false}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-slate-600">Loading sub-task...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subTask) {
    return (
      <div className="h-screen bg-slate-50 flex">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          tickets={[]}
          currentView="subtasks"
          setCurrentView={(view) => {
            if (view === 'dashboard') router.push('/dashboard');
            else if (view === 'projects') router.push('/dashboard');
            else if (view === 'tasks') router.push('/dashboard');
            else if (view === 'tickets') router.push('/dashboard');
            else router.push('/dashboard');
          }}
          isMobile={false}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Sub-task Not Found</h1>
            <p className="text-slate-600 mb-4">{error || 'The sub-task you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
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
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SubTaskDetail
          selectedSubTask={subTask}
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