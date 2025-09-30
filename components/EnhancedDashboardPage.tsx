'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Target,
  Flag,
  CheckSquare,
  Calendar,
  Layers,
  Plus,
  Activity,
  CheckCircle
} from 'lucide-react';
import ProfessionalAgileBoard from './ProfessionalAgileBoard';
import ProfessionalDashboard from './ProfessionalDashboard';
import {
  EpicFormModal,
  FeatureFormModal,
  TaskFormModal,
  DeleteConfirmModal,
  SprintFormModal
} from './AgileCRUDModals';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

// Types based on your existing database schema
interface Epic {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress_percentage: number;
  epic_owner?: string;
  start_date?: string;
  target_completion?: string;
  created_at: string;
  updated_at: string;
}

interface Feature {
  id: string;
  epic_id: string;
  name: string;
  description?: string;
  status: 'backlog' | 'analysis' | 'design' | 'development' | 'testing' | 'done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress_percentage: number;
  feature_owner?: string;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: string;
  feature_id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'completed' | 'qa' | 'done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'development' | 'testing' | 'documentation' | 'research' | 'design' | 'devops';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

interface SubTask {
  id: string;
  task_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'blocked' | 'review' | 'testing' | 'done';
  type: 'development' | 'testing' | 'documentation' | 'research' | 'design' | 'devops';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

interface Sprint {
  id: string;
  program_id?: string;
  name: string;
  sprint_number?: number;
  start_date: string;
  end_date: string;
  sprint_goal: string;
  capacity_hours?: number;
  committed_story_points?: number;
  stretch_story_points?: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  actual_velocity?: number;
  burndown_data?: any;
  created_at: string;
  updated_at: string;
}

const EnhancedDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [boardView, setBoardView] = useState<'epics' | 'features' | 'tasks'>('epics');
  const { user } = useAuth();

  // Data states
  const [epics, setEpics] = useState<Epic[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [epicModal, setEpicModal] = useState<{isOpen: boolean; epic?: Epic | null}>({isOpen: false});
  const [featureModal, setFeatureModal] = useState<{isOpen: boolean; feature?: Feature | null}>({isOpen: false});
  const [taskModal, setTaskModal] = useState<{isOpen: boolean; task?: Task | null}>({isOpen: false});
  const [sprintModal, setSprintModal] = useState<{isOpen: boolean; sprint?: Sprint | null}>({isOpen: false});
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item?: {id: string; name?: string; title?: string};
    itemType?: 'epic' | 'feature' | 'task';
  }>({isOpen: false});

  // Fetch data from your existing database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch epics
        const { data: epicsData, error: epicsError } = await supabase
          .from('epics')
          .select('*')
          .order('created_at', { ascending: false });

        if (epicsError) throw epicsError;

        // Fetch features
        const { data: featuresData, error: featuresError } = await supabase
          .from('features')
          .select('*')
          .order('created_at', { ascending: false });

        if (featuresError) throw featuresError;

        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (tasksError) throw tasksError;

        // Fetch sub_tasks
        const { data: subtasksData, error: subtasksError } = await supabase
          .from('sub_tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (subtasksError) throw subtasksError;

        // Fetch sprints
        const { data: sprintsData, error: sprintsError } = await supabase
          .from('sprints')
          .select('*')
          .order('created_at', { ascending: false });

        if (sprintsError) throw sprintsError;

        setEpics(epicsData || []);
        setFeatures(featuresData || []);
        setTasks(tasksData || []);
        setSubtasks(subtasksData || []);
        setSprints(sprintsData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refresh data after CRUD operations
  const refreshData = async () => {
    try {
      setLoading(true);

      const [epicsRes, featuresRes, tasksRes, subtasksRes, sprintsRes] = await Promise.all([
        supabase.from('epics').select('*').order('created_at', { ascending: false }),
        supabase.from('features').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('sub_tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('sprints').select('*').order('created_at', { ascending: false })
      ]);

      setEpics(epicsRes.data || []);
      setFeatures(featuresRes.data || []);
      setTasks(tasksRes.data || []);
      setSubtasks(subtasksRes.data || []);
      setSprints(sprintsRes.data || []);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete functions
  const handleDelete = async () => {
    if (!deleteModal.item || !deleteModal.itemType) return;

    try {
      const tableName = deleteModal.itemType === 'epic' ? 'epics' :
                       deleteModal.itemType === 'feature' ? 'features' : 'tasks';

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', deleteModal.item.id);

      if (error) throw error;

      await refreshData();
      setDeleteModal({isOpen: false});
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  // Handle status changes
  const handleStatusChange = async (
    itemId: string,
    newStatus: string,
    itemType: 'epic' | 'feature' | 'task' | 'subtask'
  ): Promise<void> => {
    try {
      const tableName = itemType === 'epic' ? 'epics' :
                       itemType === 'feature' ? 'features' :
                       itemType === 'task' ? 'tasks' : 'sub_tasks';

      const { error } = await supabase
        .from(tableName)
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;

      // Update local state
      if (itemType === 'epic') {
        setEpics(prev => prev.map(epic =>
          epic.id === itemId ? { ...epic, status: newStatus as Epic['status'] } : epic
        ));
      } else if (itemType === 'feature') {
        setFeatures(prev => prev.map(feature =>
          feature.id === itemId ? { ...feature, status: newStatus as Feature['status'] } : feature
        ));
      } else if (itemType === 'task') {
        setTasks(prev => prev.map(task =>
          task.id === itemId ? { ...task, status: newStatus as Task['status'] } : task
        ));
      } else if (itemType === 'subtask') {
        setSubtasks(prev => prev.map(subtask =>
          subtask.id === itemId ? { ...subtask, status: newStatus as SubTask['status'] } : subtask
        ));
      }

    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading professional dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-[1800px] mx-auto px-24 py-8">
        {/* Professional Header */}
        <div className="relative overflow-hidden bg-white rounded-2xl mb-8 shadow-lg border border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <Layers className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">Professional Agile Workspace</h1>
                    <p className="text-slate-600 text-base font-medium">Manage epics, features, and tasks with enterprise-grade workflows</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">{epics.length} Epics</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                  <Flag className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">{features.length} Features</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl border border-purple-200">
                  <CheckSquare className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">{tasks.length} Tasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex h-14 items-center justify-center rounded-xl bg-white p-1.5 text-slate-500 shadow-sm border border-slate-200">
            <TabsTrigger value="dashboard" className="rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="epics" className="rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Epics
            </TabsTrigger>
            <TabsTrigger value="features" className="rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="tasks" className="rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="sprints" className="rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sprints
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab - Professional Metrics */}
          <TabsContent value="dashboard">
            <ProfessionalDashboard
              epics={epics}
              features={features}
              tasks={tasks}
              sprints={sprints}
            />
          </TabsContent>


          {/* Epics Tab */}
          <TabsContent value="epics">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    Epic Portfolio Management
                  </CardTitle>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="sm"
                    onClick={() => setEpicModal({isOpen: true})}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Epic
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[800px]">
                  <ProfessionalAgileBoard
                    view="epics"
                    epics={epics}
                    features={features}
                    tasks={tasks}
                    subtasks={subtasks}
                    onStatusChange={handleStatusChange}
                    onEdit={(item, itemType) => {
                      if (itemType === 'epic') {
                        setEpicModal({isOpen: true, epic: item as Epic});
                      } else if (itemType === 'feature') {
                        setFeatureModal({isOpen: true, feature: item as Feature});
                      } else if (itemType === 'task') {
                        setTaskModal({isOpen: true, task: item as Task});
                      }
                    }}
                    onDelete={(item, itemType) => {
                      setDeleteModal({
                        isOpen: true,
                        item: {id: item.id, name: (item as any).name || (item as any).title},
                        itemType
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Flag className="w-5 h-5 text-white" />
                    </div>
                    Feature Development Pipeline
                  </CardTitle>
                  <Button
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    size="sm"
                    onClick={() => setFeatureModal({isOpen: true})}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Feature
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[800px]">
                  <ProfessionalAgileBoard
                    view="features"
                    epics={epics}
                    features={features}
                    tasks={tasks}
                    subtasks={subtasks}
                    onStatusChange={handleStatusChange}
                    onEdit={(item, itemType) => {
                      if (itemType === 'epic') {
                        setEpicModal({isOpen: true, epic: item as Epic});
                      } else if (itemType === 'feature') {
                        setFeatureModal({isOpen: true, feature: item as Feature});
                      } else if (itemType === 'task') {
                        setTaskModal({isOpen: true, task: item as Task});
                      }
                    }}
                    onDelete={(item, itemType) => {
                      setDeleteModal({
                        isOpen: true,
                        item: {id: item.id, name: (item as any).name || (item as any).title},
                        itemType
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-white" />
                    </div>
                    Task Execution Board
                  </CardTitle>
                  <Button
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    size="sm"
                    onClick={() => setTaskModal({isOpen: true})}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[800px]">
                  <ProfessionalAgileBoard
                    view="tasks"
                    epics={epics}
                    features={features}
                    tasks={tasks}
                    subtasks={subtasks}
                    onStatusChange={handleStatusChange}
                    onEdit={(item, itemType) => {
                      if (itemType === 'epic') {
                        setEpicModal({isOpen: true, epic: item as Epic});
                      } else if (itemType === 'feature') {
                        setFeatureModal({isOpen: true, feature: item as Feature});
                      } else if (itemType === 'task') {
                        setTaskModal({isOpen: true, task: item as Task});
                      }
                    }}
                    onDelete={(item, itemType) => {
                      setDeleteModal({
                        isOpen: true,
                        item: {id: item.id, name: (item as any).name || (item as any).title},
                        itemType
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sprints Tab */}
          <TabsContent value="sprints">
            <div className="space-y-6">
              {/* Sprint Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-3xl text-slate-900">
                        {sprints.filter(s => s.status === 'active').length}
                      </h3>
                      <p className="text-sm font-medium text-slate-900">Active Sprints</p>
                      <p className="text-xs text-slate-600">Currently running</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-3xl text-slate-900">
                        {sprints.filter(s => s.status === 'planned').length}
                      </h3>
                      <p className="text-sm font-medium text-slate-900">Planned Sprints</p>
                      <p className="text-xs text-slate-600">In planning phase</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-3xl text-slate-900">
                        {sprints.filter(s => s.status === 'completed').length}
                      </h3>
                      <p className="text-sm font-medium text-slate-900">Completed Sprints</p>
                      <p className="text-xs text-slate-600">Successfully delivered</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sprint List */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-white">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      Sprint Management
                    </CardTitle>
                    <Button
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      size="sm"
                      onClick={() => setSprintModal({isOpen: true, sprint: null})}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Sprint
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {sprints.map((sprint) => (
                      <div
                        key={sprint.id}
                        className="border border-slate-200 rounded-xl p-5 hover:bg-slate-50 hover:shadow-sm transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-slate-900">{sprint.name}</h3>
                            {sprint.sprint_goal && (
                              <p className="text-sm text-slate-600 mt-2">{sprint.sprint_goal}</p>
                            )}
                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(sprint.start_date).toLocaleDateString()}</span>
                              </div>
                              <span>→</span>
                              <span>{new Date(sprint.end_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Badge
                            className={`${
                              sprint.status === 'active' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              sprint.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                              sprint.status === 'planned' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                              'bg-red-100 text-red-700 border-red-200'
                            }`}
                          >
                            {sprint.status}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {sprints.length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-base font-medium">No sprints found</p>
                        <p className="text-sm mt-1">Create your first sprint to get started.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CRUD Modals */}
      <EpicFormModal
        isOpen={epicModal.isOpen}
        onClose={() => setEpicModal({isOpen: false})}
        epic={epicModal.epic}
        onSuccess={refreshData}
      />

      <FeatureFormModal
        isOpen={featureModal.isOpen}
        onClose={() => setFeatureModal({isOpen: false})}
        feature={featureModal.feature}
        epics={epics}
        onSuccess={refreshData}
      />

      <TaskFormModal
        isOpen={taskModal.isOpen}
        onClose={() => setTaskModal({isOpen: false})}
        task={taskModal.task}
        features={features}
        onSuccess={refreshData}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({isOpen: false})}
        item={deleteModal.item || {id: '', name: ''}}
        itemType={deleteModal.itemType || 'epic'}
        onConfirm={handleDelete}
      />

      <SprintFormModal
        isOpen={sprintModal.isOpen}
        onClose={() => setSprintModal({isOpen: false})}
        sprint={sprintModal.sprint}
        onSuccess={refreshData}
      />
      </div>
    </div>
  );
};

export default EnhancedDashboardPage;