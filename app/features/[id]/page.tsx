'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FeatureDetail from '@/components/FeatureDetail';
import Sidebar from '@/components/Sidebar';
import { ChevronLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface FeatureData {
  id: string;
  epic_id: string;
  name: string;
  description: string;
  capability_description: string;
  business_value: string;
  status: string;
  priority: string;
  start_date: string;
  target_completion: string;
  feature_owner: string;
  estimated_story_points: number;
  color: string;
  tags: string[];
  dependencies: string[];
  created_at: string;
  updated_at: string;
  user_stories: any[];
  tasks: any[];
  epic: any;
  acceptance_criteria?: string;
  epics?: any;
  tickets?: any[];
  metrics: {
    totalTasks: number;
    completedTasks: number;
    totalStories: number;
    completedStories: number;
    taskCompletionRate: number;
    storyCompletionRate: number;
  };
}

export default function FeatureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [feature, setFeature] = useState<FeatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchFeature = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/features/${params.id}`);

        if (!response.ok) {
          throw new Error('Feature not found');
        }

        const data = await response.json();
        setFeature(data);
      } catch (error) {
        console.error('Error fetching feature:', error);
        setError(error instanceof Error ? error.message : 'Failed to load feature');
        toast.error('Failed to load feature');
      } finally {
        setLoading(false);
      }
    };

    fetchFeature();
  }, [params.id]);

  const handleSave = async (featureId: string, data: Partial<FeatureData>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/features/${featureId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update feature');
      }

      const updatedFeature = await response.json();
      setFeature(updatedFeature);
      setEditMode(false);
      toast.success('Feature updated successfully');
    } catch (error) {
      console.error('Error updating feature:', error);
      toast.error('Failed to update feature');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (featureId: string) => {
    if (!window.confirm('Are you sure you want to delete this feature? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/features/${featureId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete feature');
      }

      toast.success('Feature deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error('Failed to delete feature');
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

  if (loading && !feature) {
    return (
      <div className="h-screen bg-slate-50 flex">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          tickets={[]}
          currentView="features"
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
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
            <p className="text-slate-600">Loading feature...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !feature) {
    return (
      <div className="h-screen bg-slate-50 flex">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          tickets={[]}
          currentView="features"
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
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Feature Not Found</h1>
            <p className="text-slate-600 mb-4">{error || 'The feature you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 mx-auto"
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
        <FeatureDetail
          selectedFeature={feature}
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