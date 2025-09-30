'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Trash2, Edit, Plus, X, Check, Circle } from 'lucide-react';

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

// Epic Form Modal
interface EpicFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  epic?: Epic | null;
  onSuccess: () => void;
}

export const EpicFormModal: React.FC<EpicFormModalProps> = ({
  isOpen,
  onClose,
  epic,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    priority: 'Medium' as const,
    progress_percentage: 0,
    epic_owner: '',
    start_date: '',
    target_completion: ''
  });
  const [loading, setLoading] = useState(false);

  // Update form data when epic prop changes
  useEffect(() => {
    if (epic) {
      setFormData({
        name: epic.name || '',
        description: epic.description || '',
        status: epic.status || 'planning',
        priority: epic.priority || 'Medium',
        progress_percentage: epic.progress_percentage || 0,
        epic_owner: epic.epic_owner || '',
        start_date: epic.start_date || '',
        target_completion: epic.target_completion || ''
      });
    } else {
      // Reset form for new epic
      setFormData({
        name: '',
        description: '',
        status: 'planning',
        priority: 'Medium',
        progress_percentage: 0,
        epic_owner: '',
        start_date: '',
        target_completion: ''
      });
    }
  }, [epic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (epic) {
        // Update existing epic
        const { error } = await supabase
          .from('epics')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', epic.id);

        if (error) throw error;
      } else {
        // Create new epic
        const { error } = await supabase
          .from('epics')
          .insert([{
            ...formData,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving epic:', error);
      alert('Error saving epic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{epic ? 'Edit Epic' : 'Create New Epic'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Epic Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Epic name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Epic Owner</label>
              <Input
                value={formData.epic_owner}
                onChange={(e) => setFormData({...formData, epic_owner: e.target.value})}
                placeholder="Who owns this epic?"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Epic description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Target Completion</label>
              <Input
                type="date"
                value={formData.target_completion}
                onChange={(e) => setFormData({...formData, target_completion: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value as Epic['status']})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({...formData, priority: value as Epic['priority']})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Progress (%)</label>
              <Input
                type="number"
                value={formData.progress_percentage}
                onChange={(e) => setFormData({...formData, progress_percentage: parseInt(e.target.value) || 0})}
                min="0"
                max="100"
                placeholder="0-100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : epic ? 'Update Epic' : 'Create Epic'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Feature Form Modal
interface FeatureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: Feature | null;
  epics: Epic[];
  onSuccess: () => void;
}

export const FeatureFormModal: React.FC<FeatureFormModalProps> = ({
  isOpen,
  onClose,
  feature,
  epics,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    epic_id: '',
    name: '',
    description: '',
    status: 'backlog' as const,
    priority: 'Medium' as const,
    progress_percentage: 0,
    feature_owner: ''
  });
  const [loading, setLoading] = useState(false);

  // Update form data when feature prop changes
  useEffect(() => {
    if (feature) {
      setFormData({
        epic_id: feature.epic_id || '',
        name: feature.name || '',
        description: feature.description || '',
        status: feature.status || 'backlog',
        priority: feature.priority || 'Medium',
        progress_percentage: feature.progress_percentage || 0,
        feature_owner: feature.feature_owner || ''
      });
    } else {
      // Reset form for new feature
      setFormData({
        epic_id: '',
        name: '',
        description: '',
        status: 'backlog',
        priority: 'Medium',
        progress_percentage: 0,
        feature_owner: ''
      });
    }
  }, [feature]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (feature) {
        // Update existing feature
        const { error } = await supabase
          .from('features')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', feature.id);

        if (error) throw error;
      } else {
        // Create new feature
        const { error } = await supabase
          .from('features')
          .insert([{
            ...formData,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving feature:', error);
      alert('Error saving feature. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{feature ? 'Edit Feature' : 'Create New Feature'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Feature Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Feature name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Epic *</label>
              <Select
                value={formData.epic_id}
                onValueChange={(value) => setFormData({...formData, epic_id: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an epic" />
                </SelectTrigger>
                <SelectContent>
                  {epics.map((epic) => (
                    <SelectItem key={epic.id} value={epic.id}>
                      {epic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Feature Owner</label>
            <Input
              value={formData.feature_owner}
              onChange={(e) => setFormData({...formData, feature_owner: e.target.value})}
              placeholder="Who owns this feature?"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Feature description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value as Feature['status']})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({...formData, priority: value as Feature['priority']})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Progress (%)</label>
              <Input
                type="number"
                value={formData.progress_percentage}
                onChange={(e) => setFormData({...formData, progress_percentage: parseInt(e.target.value) || 0})}
                min="0"
                max="100"
                placeholder="0-100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : feature ? 'Update Feature' : 'Create Feature'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Task Form Modal
interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  features: Feature[];
  onSuccess: () => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  task,
  features,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    feature_id: '',
    title: '',
    description: '',
    status: 'backlog' as const,
    priority: 'Medium' as const,
    type: 'development' as const,
    assigned_to: ''
  });
  const [loading, setLoading] = useState(false);

  // Update form data when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        feature_id: task.feature_id || '',
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'backlog',
        priority: task.priority || 'Medium',
        type: task.type || 'development',
        assigned_to: task.assigned_to || ''
      });
    } else {
      // Reset form for new task
      setFormData({
        feature_id: '',
        title: '',
        description: '',
        status: 'backlog',
        priority: 'Medium',
        type: 'development',
        assigned_to: ''
      });
    }
  }, [task]);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');

  // Load existing subtasks when editing a task
  useEffect(() => {
    if (task && isOpen) {
      loadSubtasks();
    } else {
      setSubtasks([]);
    }
  }, [task, isOpen]);

  const loadSubtasks = async () => {
    if (!task?.id) return;

    setLoadingSubtasks(true);
    try {
      const { data, error } = await supabase
        .from('sub_tasks')
        .select('*')
        .eq('task_id', task.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSubtasks(data || []);
    } catch (error) {
      console.error('Error loading subtasks:', error);
    } finally {
      setLoadingSubtasks(false);
    }
  };

  const addSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;

    try {
      const newSubtask: Partial<SubTask> = {
        id: crypto.randomUUID(),
        task_id: task?.id || 'temp', // Will be updated after task creation
        title: newSubtaskTitle.trim(),
        status: 'todo',
        type: 'development',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (task?.id) {
        // If editing existing task, save to database immediately
        const { error } = await supabase
          .from('sub_tasks')
          .insert([newSubtask]);

        if (error) throw error;
        await loadSubtasks(); // Reload to get the actual data
      } else {
        // If creating new task, add to local state for now
        setSubtasks(prev => [...prev, newSubtask as SubTask]);
      }

      setNewSubtaskTitle('');
    } catch (error) {
      console.error('Error adding subtask:', error);
      alert('Error adding subtask. Please try again.');
    }
  };

  const toggleSubtaskStatus = async (subtaskId: string) => {
    try {
      const subtask = subtasks.find(st => st.id === subtaskId);
      if (!subtask) return;

      const newStatus = subtask.status === 'done' ? 'todo' : 'done';

      if (task?.id) {
        // Update in database
        const { error } = await supabase
          .from('sub_tasks')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', subtaskId);

        if (error) throw error;
      }

      // Update local state
      setSubtasks(prev => prev.map(st =>
        st.id === subtaskId ? { ...st, status: newStatus } : st
      ));
    } catch (error) {
      console.error('Error updating subtask:', error);
      alert('Error updating subtask. Please try again.');
    }
  };

  const deleteSubtask = async (subtaskId: string) => {
    try {
      if (task?.id) {
        // Delete from database
        const { error } = await supabase
          .from('sub_tasks')
          .delete()
          .eq('id', subtaskId);

        if (error) throw error;
      }

      // Remove from local state
      setSubtasks(prev => prev.filter(st => st.id !== subtaskId));
    } catch (error) {
      console.error('Error deleting subtask:', error);
      alert('Error deleting subtask. Please try again.');
    }
  };

  const startEditingSubtask = (subtask: SubTask) => {
    setEditingSubtaskId(subtask.id);
    setEditingSubtaskTitle(subtask.title);
  };

  const cancelEditingSubtask = () => {
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  const saveSubtaskEdit = async (subtaskId: string) => {
    if (!editingSubtaskTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('sub_tasks')
        .update({ title: editingSubtaskTitle.trim() })
        .eq('id', subtaskId);

      if (error) throw error;

      setSubtasks(prev => prev.map(st =>
        st.id === subtaskId
          ? { ...st, title: editingSubtaskTitle.trim() }
          : st
      ));

      setEditingSubtaskId(null);
      setEditingSubtaskTitle('');
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (task) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', task.id);

        if (error) throw error;
      } else {
        // Create new task
        const newTaskId = crypto.randomUUID();
        const { error: taskError } = await supabase
          .from('tasks')
          .insert([{
            ...formData,
            id: newTaskId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (taskError) throw taskError;

        // Create subtasks if any were added
        if (subtasks.length > 0) {
          const subtasksToInsert = subtasks.map(subtask => ({
            ...subtask,
            id: crypto.randomUUID(),
            task_id: newTaskId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));

          const { error: subtaskError } = await supabase
            .from('sub_tasks')
            .insert(subtasksToInsert);

          if (subtaskError) throw subtaskError;
        }
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Task Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Task title"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Feature *</label>
              <Select
                value={formData.feature_id}
                onValueChange={(value) => setFormData({...formData, feature_id: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a feature" />
                </SelectTrigger>
                <SelectContent>
                  {features.map((feature) => (
                    <SelectItem key={feature.id} value={feature.id}>
                      {feature.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Assigned To</label>
            <Input
              value={formData.assigned_to}
              onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
              placeholder="Who is assigned to this task?"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Task description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({...formData, type: value as Task['type']})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({...formData, priority: value as Task['priority']})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value as Task['status']})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium">Subtasks (Optional)</h4>
              <span className="text-xs text-gray-500">
                {subtasks.filter(st => st.status === 'done').length}/{subtasks.length} completed
              </span>
            </div>

            {/* Add New Subtask */}
            <div className="flex gap-2 mb-3">
              <Input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add a subtask..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubtask();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubtask}
                disabled={!newSubtaskTitle.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Subtasks List */}
            {loadingSubtasks ? (
              <div className="text-center py-4 text-sm text-gray-500">Loading subtasks...</div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => toggleSubtaskStatus(subtask.id)}
                    >
                      {subtask.status === 'done' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                    {editingSubtaskId === subtask.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={editingSubtaskTitle}
                          onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                          className="h-6 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveSubtaskEdit(subtask.id);
                            } else if (e.key === 'Escape') {
                              cancelEditingSubtask();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                          onClick={() => saveSubtaskEdit(subtask.id)}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                          onClick={cancelEditingSubtask}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span
                          className={`flex-1 text-sm cursor-pointer ${
                            subtask.status === 'done'
                              ? 'line-through text-gray-500'
                              : 'text-gray-900'
                          }`}
                          onClick={() => startEditingSubtask(subtask)}
                          title="Click to edit"
                        >
                          {subtask.title}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                          onClick={() => startEditingSubtask(subtask)}
                          title="Edit subtask"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => deleteSubtask(subtask.id)}
                          title="Delete subtask"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
                {subtasks.length === 0 && (
                  <div className="text-center py-3 text-sm text-gray-500">
                    No subtasks yet. Add one above to break down this task.
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Modal
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: { id: string; name?: string; title?: string };
  itemType: 'epic' | 'feature' | 'task';
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  item,
  itemType,
  onConfirm
}) => {
  const itemName = item.name || item.title || 'item';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete {itemType}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete "{itemName}"? This action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Sprint Form Modal
interface SprintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprint?: Sprint | null;
  onSuccess: () => void;
}

export const SprintFormModal: React.FC<SprintFormModalProps> = ({
  isOpen,
  onClose,
  sprint,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sprint_number: 1,
    start_date: '',
    end_date: '',
    sprint_goal: '',
    status: 'planned' as const,
    capacity_hours: 0,
    committed_story_points: 0,
    stretch_story_points: 0
  });
  const [loading, setLoading] = useState(false);

  // Update form data when sprint prop changes
  useEffect(() => {
    if (sprint) {
      setFormData({
        name: sprint.name || '',
        sprint_number: sprint.sprint_number || 1,
        start_date: sprint.start_date || '',
        end_date: sprint.end_date || '',
        sprint_goal: sprint.sprint_goal || '',
        status: sprint.status || 'planned',
        capacity_hours: sprint.capacity_hours || 0,
        committed_story_points: sprint.committed_story_points || 0,
        stretch_story_points: sprint.stretch_story_points || 0
      });
    } else {
      // Reset form for new sprint
      setFormData({
        name: '',
        sprint_number: 1,
        start_date: '',
        end_date: '',
        sprint_goal: '',
        status: 'planned',
        capacity_hours: 0,
        committed_story_points: 0,
        stretch_story_points: 0
      });
    }
  }, [sprint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (sprint) {
        // Update existing sprint
        const { error } = await supabase
          .from('sprints')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', sprint.id);

        if (error) throw error;
      } else {
        // Create new sprint
        const { error } = await supabase
          .from('sprints')
          .insert([{
            ...formData,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving sprint:', error);
      alert('Error saving sprint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{sprint ? 'Edit Sprint' : 'Create New Sprint'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Sprint Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Sprint 1, Release 2.1, etc."
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Sprint Number</label>
              <Input
                type="number"
                value={formData.sprint_number}
                onChange={(e) => setFormData({...formData, sprint_number: parseInt(e.target.value) || 1})}
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Sprint Goal *</label>
            <Textarea
              value={formData.sprint_goal}
              onChange={(e) => setFormData({...formData, sprint_goal: e.target.value})}
              placeholder="What should this sprint achieve?"
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date *</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Date *</label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Capacity (Hours)</label>
              <Input
                type="number"
                value={formData.capacity_hours}
                onChange={(e) => setFormData({...formData, capacity_hours: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Committed Story Points</label>
              <Input
                type="number"
                value={formData.committed_story_points}
                onChange={(e) => setFormData({...formData, committed_story_points: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Stretch Story Points</label>
              <Input
                type="number"
                value={formData.stretch_story_points}
                onChange={(e) => setFormData({...formData, stretch_story_points: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({...formData, status: value as Sprint['status']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : sprint ? 'Update Sprint' : 'Create Sprint'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};