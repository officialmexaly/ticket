'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Circle,
  BarChart3,
  Target,
  Calendar,
  Flag,
  Edit,
  Trash2,
  MoreVertical,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import EmployeeAssignment from './EmployeeAssignment';

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
  epic_id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

// Professional column definitions with proper color values
const EPIC_COLUMNS = [
  { id: 'planning', title: 'Portfolio Backlog', color: '#64748b' },
  { id: 'in_progress', title: 'Implementation', color: '#3b82f6' },
  { id: 'review', title: 'Validation', color: '#f59e0b' },
  { id: 'completed', title: 'Done', color: '#10b981' }
];

const FEATURE_COLUMNS = [
  { id: 'backlog', title: 'Feature Backlog', color: '#64748b' },
  { id: 'analysis', title: 'Analysis', color: '#8b5cf6' },
  { id: 'design', title: 'Design', color: '#ec4899' },
  { id: 'development', title: 'Development', color: '#3b82f6' },
  { id: 'testing', title: 'Testing', color: '#f59e0b' },
  { id: 'done', title: 'Released', color: '#10b981' }
];

const TASK_COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: '#64748b' },
  { id: 'todo', title: 'Ready', color: '#3b82f6' },
  { id: 'in_progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'qa', title: 'Review', color: '#8b5cf6' },
  { id: 'completed', title: 'Testing', color: '#f97316' },
  { id: 'done', title: 'Done', color: '#10b981' }
];

// Priority colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'bg-red-600 border-red-600';
    case 'High': return 'bg-orange-600 border-orange-600';
    case 'Medium': return 'bg-yellow-600 border-yellow-600';
    case 'Low': return 'bg-emerald-600 border-emerald-600';
    default: return 'bg-gray-600 border-gray-600';
  }
};

// Type colors
const getTypeColor = (type: string) => {
  switch (type) {
    case 'development': return 'bg-blue-600 border-blue-600';
    case 'testing': return 'bg-emerald-600 border-emerald-600';
    case 'documentation': return 'bg-purple-600 border-purple-600';
    case 'research': return 'bg-indigo-600 border-indigo-600';
    case 'design': return 'bg-pink-600 border-pink-600';
    case 'devops': return 'bg-orange-600 border-orange-600';
    default: return 'bg-gray-600 border-gray-600';
  }
};

// Professional Epic Card Component
const EpicCard: React.FC<{
  epic: Epic;
  features: Feature[];
  tasks: Task[];
  onEdit?: (epic: Epic) => void;
  onDelete?: (epic: Epic) => void;
}> = ({
  epic,
  features,
  tasks,
  onEdit,
  onDelete
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 hover:bg-card hover:shadow-lg transition-all duration-300 cursor-move group hover:scale-[1.02] hover:border-primary/20">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-card-foreground leading-tight line-clamp-2 mb-2">{epic.name}</h4>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-emerald-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="font-medium">{features.length} features</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="font-medium">{totalTasks} tasks</span>
                </div>
              </div>
            </div>
            {(onEdit || onDelete) && (
              <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                {onEdit && (
                  <button
                    className="h-7 w-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(epic);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                )}
                {onDelete && (
                  <button
                    className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(epic);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              epic.priority === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
              epic.priority === 'High' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
              epic.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
              'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {epic.priority}
            </span>
            <EmployeeAssignment
              assignedEmployeeId={epic.epic_owner}
              taskId={epic.id}
              taskType="epic"
              size="sm"
              showName={false}
            />
          </div>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-1.5">
              <div className="w-full bg-gray-200 rounded-full h-1.5 w-8">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-blue-600 min-w-[28px]">{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Feature Card Component
const FeatureCard: React.FC<{
  feature: Feature;
  tasks: Task[];
  subtasks: SubTask[];
  onEdit?: (feature: Feature) => void;
  onDelete?: (feature: Feature) => void;
}> = ({
  feature,
  tasks,
  subtasks,
  onEdit,
  onDelete
}) => {
  const totalWork = tasks.length + subtasks.length;
  const completedWork = tasks.filter(t => t.status === 'done').length +
                       subtasks.filter(st => st.status === 'done').length;
  const progress = totalWork > 0 ? Math.round((completedWork / totalWork) * 100) : 0;

  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 hover:bg-card hover:shadow-lg transition-all duration-300 cursor-move group hover:scale-[1.02] hover:border-primary/20">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Flag className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-card-foreground leading-tight line-clamp-2 mb-2">{feature.name}</h4>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-blue-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="font-medium">{tasks.length} tasks</span>
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span className="font-medium">{subtasks.length} subtasks</span>
                </div>
              </div>
            </div>
            {(onEdit || onDelete) && (
              <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                {onEdit && (
                  <button
                    className="h-7 w-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(feature);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                )}
                {onDelete && (
                  <button
                    className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(feature);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              feature.priority === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
              feature.priority === 'High' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
              feature.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
              'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {feature.priority}
            </span>
            <EmployeeAssignment
              assignedEmployeeId={feature.feature_owner}
              taskId={feature.id}
              taskType="feature"
              size="sm"
              showName={false}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-full bg-gray-200 rounded-full h-1.5 w-8">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 min-w-[28px]">{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Task Card Component
const TaskCard: React.FC<{
  task: Task;
  subtasks: SubTask[];
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onSubtaskStatusChange?: (subtaskId: string, newStatus: string) => void;
}> = ({ task, subtasks, onEdit, onDelete, onSubtaskStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const completedSubtasks = subtasks.filter(st => st.status === 'done').length;
  const hasSubtasks = subtasks.length > 0;

  const handleSubtaskToggle = async (subtaskId: string, currentStatus: string) => {
    if (!onSubtaskStatusChange) return;

    // Toggle between 'todo' and 'done' for quick status changes
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';

    try {
      await onSubtaskStatusChange(subtaskId, newStatus);
      toast.success('Subtask updated successfully', {
        icon: <CheckCircle2 className="w-4 h-4 text-green-600" />
      });
    } catch (error) {
      toast.error('Failed to update subtask', {
        icon: <AlertTriangle className="w-4 h-4 text-red-600" />
      });
    }
  };

  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 hover:bg-card hover:shadow-lg transition-all duration-300 cursor-move group hover:scale-[1.02] hover:border-primary/20">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          {task.assigned_to ? (
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-semibold">
              {task.assigned_to.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-card-foreground leading-tight line-clamp-2 mb-2">{task.title}</h4>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <EmployeeAssignment
                    assignedEmployeeId={task.assigned_to}
                    taskId={task.id}
                    taskType="task"
                    size="sm"
                    showName={false}
                  />
                  <span className="text-xs text-gray-600 font-medium">Task</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                  <span className="font-medium capitalize">{task.type}</span>
                </div>
              </div>
            </div>
            {(onEdit || onDelete) && (
              <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                {onEdit && (
                  <button
                    className="h-7 w-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5 text-indigo-600" />
                  </button>
                )}
                {onDelete && (
                  <button
                    className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              task.priority === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
              task.priority === 'High' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
              'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {task.priority}
            </span>

            {hasSubtasks && (
              <button
                className="flex items-center gap-1.5 hover:bg-indigo-50 rounded-lg px-2 py-1 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                <div className="w-full bg-gray-200 rounded-full h-1.5 w-8">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-indigo-600 min-w-[32px]">
                  {completedSubtasks}/{subtasks.length}
                </span>
                <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                  <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Subtasks Section */}
      {hasSubtasks && isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200/60">
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-700 mb-2">Subtasks</h5>
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2 p-2 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors"
              >
                <button
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    subtask.status === 'done'
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-indigo-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubtaskToggle(subtask.id, subtask.status);
                  }}
                >
                  {subtask.status === 'done' && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span
                  className={`text-xs flex-1 ${
                    subtask.status === 'done'
                      ? 'text-gray-500 line-through'
                      : 'text-gray-700'
                  }`}
                >
                  {subtask.title}
                </span>
                <div className="flex items-center gap-2">
                  <EmployeeAssignment
                    assignedEmployeeId={subtask.assigned_to}
                    taskId={subtask.id}
                    taskType="subtask"
                    size="sm"
                    showName={false}
                  />
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    subtask.status === 'done' ? 'bg-green-100 text-green-700' :
                    subtask.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    subtask.status === 'blocked' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {subtask.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Professional Agile Board Component
interface ProfessionalAgileBoardProps {
  view: 'epics' | 'features' | 'tasks';
  epics: Epic[];
  features: Feature[];
  tasks: Task[];
  subtasks: SubTask[];
  onStatusChange: (
    itemId: string,
    newStatus: string,
    itemType: 'epic' | 'feature' | 'task' | 'subtask'
  ) => Promise<void>;
  onEdit?: (item: Epic | Feature | Task, itemType: 'epic' | 'feature' | 'task') => void;
  onDelete?: (item: Epic | Feature | Task, itemType: 'epic' | 'feature' | 'task') => void;
}

const ProfessionalAgileBoard: React.FC<ProfessionalAgileBoardProps> = ({
  view,
  epics,
  features,
  tasks,
  subtasks,
  onStatusChange,
  onEdit,
  onDelete
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    switch (view) {
      case 'epics':
        setItems(epics);
        setColumns(EPIC_COLUMNS);
        break;
      case 'features':
        setItems(features);
        setColumns(FEATURE_COLUMNS);
        break;
      case 'tasks':
        setItems(tasks);
        setColumns(TASK_COLUMNS);
        break;
    }
  }, [view, epics, features, tasks]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    // Get the item being moved
    const movedItem = items.find(item => item.id === draggableId);
    if (!movedItem) return;

    // Get column names for user-friendly notification
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    // Show loading toast
    const loadingToast = toast.loading(
      `Moving "${movedItem.name || movedItem.title}" to ${destColumn?.title}...`,
      {
        icon: <ArrowRight className="w-4 h-4 animate-pulse" />
      }
    );

    try {
      // Update database
      await onStatusChange(draggableId, destination.droppableId, view.slice(0, -1) as any);

      // Update local state optimistically
      setItems(prev =>
        prev.map(item =>
          item.id === draggableId
            ? { ...item, status: destination.droppableId }
            : item
        )
      );

      // Show success notification
      toast.success(
        `Successfully moved "${movedItem.name || movedItem.title}" to ${destColumn?.title}`,
        {
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
          duration: 3000,
          id: loadingToast
        }
      );

    } catch (error) {
      console.error('Failed to update status:', error);

      // Show error notification
      toast.error(
        `Failed to move "${movedItem.name || movedItem.title}". Please try again.`,
        {
          icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
          duration: 5000,
          id: loadingToast,
          action: {
            label: 'Retry',
            onClick: () => handleDragEnd(result)
          }
        }
      );
    }
  };

  const getItemsByStatus = (status: string) => {
    return items.filter(item => item.status === status);
  };

  const renderItem = (item: any, index: number) => {
    switch (view) {
      case 'epics':
        const epicFeatures = features.filter(f => f.epic_id === item.id);
        const epicTasks = tasks.filter(t =>
          epicFeatures.some(f => f.id === t.feature_id)
        );
        return (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <EpicCard
                  epic={item}
                  features={epicFeatures}
                  tasks={epicTasks}
                  onEdit={onEdit ? (epic) => onEdit(epic, 'epic') : undefined}
                  onDelete={onDelete ? (epic) => onDelete(epic, 'epic') : undefined}
                />
              </div>
            )}
          </Draggable>
        );

      case 'features':
        const featureTasks = tasks.filter(t => t.feature_id === item.id);
        const featureSubtasks = subtasks.filter(st =>
          featureTasks.some(t => t.id === st.task_id)
        );
        return (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <FeatureCard
                  feature={item}
                  tasks={featureTasks}
                  subtasks={featureSubtasks}
                  onEdit={(feature) => onEdit?.(feature, 'feature')}
                  onDelete={(feature) => onDelete?.(feature, 'feature')}
                />
              </div>
            )}
          </Draggable>
        );

      case 'tasks':
        const taskSubtasks = subtasks.filter(st => st.task_id === item.id);
        return (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <TaskCard
                  task={item}
                  subtasks={taskSubtasks}
                  onEdit={(task) => onEdit?.(task, 'task')}
                  onDelete={(task) => onDelete?.(task, 'task')}
                  onSubtaskStatusChange={(subtaskId, newStatus) =>
                    onStatusChange(subtaskId, newStatus, 'subtask')
                  }
                />
              </div>
            )}
          </Draggable>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-2 h-full p-4 w-full overflow-x-auto">
          {columns.map((column) => {
            const columnItems = getItemsByStatus(column.id);

            return (
              <div
                key={column.id}
                className="flex flex-col flex-1 min-w-0 h-full bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-lg transition-all duration-300 hover:bg-white shadow-sm"
                style={{
                  borderTopColor: column.color,
                  borderTopWidth: '3px'
                }}
              >
                {/* Modern Column Header */}
                <div className="px-3 py-2 bg-white/95 backdrop-blur-sm border-b border-gray-200/60 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: column.color }}
                      ></div>
                      <h3 className="font-semibold text-xs text-gray-800 uppercase tracking-wide">
                        {column.title}
                      </h3>
                    </div>
                    <div
                      className="min-w-[20px] h-5 flex items-center justify-center text-xs font-semibold rounded-full bg-white shadow-sm border"
                      style={{
                        borderColor: `${column.color}60`,
                        color: column.color,
                        backgroundColor: `${column.color}10`
                      }}
                    >
                      {columnItems.length}
                    </div>
                  </div>
                </div>

                {/* Sleek Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 space-y-2 min-h-[400px] max-h-[calc(100vh-200px)] overflow-y-auto transition-all duration-300 rounded-b-lg ${
                        snapshot.isDraggingOver
                          ? 'bg-white/80 backdrop-blur-sm'
                          : 'bg-gray-50/30'
                      }`}
                      style={{
                        borderLeft: snapshot.isDraggingOver
                          ? `3px solid ${column.color}`
                          : '3px solid transparent'
                      }}
                    >
                      {columnItems.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                          <div className="text-center">
                            <Circle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p>No items</p>
                          </div>
                        </div>
                      )}
                      {columnItems.map((item, index) => renderItem(item, index))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProfessionalAgileBoard;