'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EpicDetail from '@/components/EpicDetail';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface EpicData {
  id: string;
  name: string;
  description: string;
  vision: string;
  business_goal: string;
  status: string;
  priority: string;
  start_date: string;
  target_completion: string;
  epic_owner: string;
  stakeholders: string[];
  budget: number;
  color: string;
  tags: string[];
  dependencies: string[];
  created_at: string;
  updated_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features: any[];
  metrics: {
    totalFeatures: number;
    completedFeatures: number;
    totalStories: number;
    completedStories: number;
    totalTasks: number;
    completedTasks: number;
    totalSubTasks: number;
    completedSubTasks: number;
    featureCompletionRate: number;
    storyCompletionRate: number;
    taskCompletionRate: number;
  };
}

export default function EpicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [epic, setEpic] = useState<EpicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchEpic = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/epics/${params.id}`);

        if (!response.ok) {
          throw new Error('Epic not found');
        }

        const data = await response.json();
        setEpic(data);
      } catch (error) {
        console.error('Error fetching epic:', error);
        setError(error instanceof Error ? error.message : 'Failed to load epic');
        toast.error('Failed to load epic');
      } finally {
        setLoading(false);
      }
    };

    fetchEpic();
  }, [params.id]);

  const handleSave = async (epicId: string, data: Partial<EpicData>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/epics/${epicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update epic');
      }

      const updatedEpic = await response.json();
      setEpic(updatedEpic);
      setEditMode(false);
      toast.success('Epic updated successfully');
    } catch (error) {
      console.error('Error updating epic:', error);
      toast.error('Failed to update epic');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (epicId: string) => {
    if (!window.confirm('Are you sure you want to delete this epic? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/epics/${epicId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete epic');
      }

      toast.success('Epic deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting epic:', error);
      toast.error('Failed to delete epic');
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

  if (loading && !epic) {
    return (
      <div className="h-screen bg-slate-50 flex">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          tickets={[]}
          currentView="epics"
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
            <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-slate-600">Loading epic...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !epic) {
    return (
      <div className="h-screen bg-slate-50 flex">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          tickets={[]}
          currentView="epics"
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
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Epic Not Found</h1>
            <p className="text-slate-600 mb-4">{error || 'The epic you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
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
        <EpicDetail
          selectedEpic={epic}
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