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
  BarChart3,
  Settings,
  Users,
  Calendar,
  Layers,
  Plus
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
import { useTheme } from '@/lib/theme-context';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Professional Agile Workspace</h1>
              <p className="text-muted-foreground">Manage epics, features, and tasks with enterprise-grade workflows</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                {epics.length} Epics
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {features.length} Features
              </Badge>
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                {tasks.length} Tasks
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 max-w-2xl">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="epics" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Epics
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="sprints" className="flex items-center gap-2">
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
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Epic Portfolio Management
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEpicModal({isOpen: true})}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Epic
                    </Button>
                  </div>
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
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="w-5 h-5" />
                    Feature Development Pipeline
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFeatureModal({isOpen: true})}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Feature
                    </Button>
                  </div>
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
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    Task Execution Board
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTaskModal({isOpen: true})}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Task
                    </Button>
                  </div>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">Active Sprints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {sprints.filter(s => s.status === 'active').length}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Currently running
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">Planned Sprints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {sprints.filter(s => s.status === 'planned').length}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      In planning phase
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600">Completed Sprints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {sprints.filter(s => s.status === 'completed').length}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Successfully delivered
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sprint List */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Sprint Management
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSprintModal({isOpen: true, sprint: null})}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Sprint
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sprints.map((sprint) => (
                      <div
                        key={sprint.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">{sprint.name}</h3>
                            {sprint.description && (
                              <p className="text-sm text-gray-600 mt-1">{sprint.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{new Date(sprint.start_date).toLocaleDateString()}</span>
                              <span>→</span>
                              <span>{new Date(sprint.end_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                sprint.status === 'active' ? 'default' :
                                sprint.status === 'completed' ? 'secondary' :
                                sprint.status === 'planned' ? 'outline' : 'destructive'
                              }
                            >
                              {sprint.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}

                    {sprints.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No sprints found. Create your first sprint to get started.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
  );
};

export default EnhancedDashboardPage;