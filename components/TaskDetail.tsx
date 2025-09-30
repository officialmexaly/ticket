'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, Edit3, Save, X, Trash2, ChevronDown, ChevronRight, CheckSquare, User, Calendar, Target, Clock, AlertCircle } from 'lucide-react';

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
  sub_tasks: any[];
  feature: any;
  metrics: {
    totalSubTasks: number;
    completedSubTasks: number;
    subTaskCompletionRate: number;
    estimatedVsActual: number;
  };
}

interface TaskDetailProps {
  selectedTask: TaskData;
  editMode: boolean;
  loading: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: (taskId: string, data: Partial<TaskData>) => void;
  onDelete: (taskId: string) => void;
  onCancel: () => void;
  formatDate: (date: string) => string;
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  selectedTask,
  editMode,
  loading,
  onBack,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  formatDate
}) => {
  const [editForm, setEditForm] = useState(selectedTask || {});
  const [activeTab, setActiveTab] = useState('details');

  // Update editForm when selectedTask changes
  useEffect(() => {
    if (selectedTask) {
      setEditForm(selectedTask);
    }
  }, [selectedTask]);

  const handleSave = async () => {
    if (selectedTask && editForm) {
      try {
        await onSave(selectedTask.id, {
          title: editForm.title,
          description: editForm.description,
          technical_work_description: editForm.technical_work_description,
          type: editForm.type,
          status: editForm.status,
          priority: editForm.priority,
          assigned_to: editForm.assigned_to,
          estimated_hours: editForm.estimated_hours,
          due_date: editForm.due_date
        });
      } catch (error) {
        console.error('Error saving task:', error);
      }
    }
  };

  // Optimized edit form handlers
  const handleEditTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, title: value }));
  }, []);

  const handleEditDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, description: value }));
  }, []);

  const handleEditTechnicalWorkChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, technical_work_description: value }));
  }, []);

  const handleEditStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, status: value }));
  }, []);

  const handleEditPriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, priority: value }));
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderDetailsContent();
      case 'subtasks':
        return renderSubTasksContent();
      case 'metrics':
        return renderMetricsContent();
      case 'history':
        return renderHistoryContent();
      case 'settings':
        return renderSettingsContent();
      default:
        return renderDetailsContent();
    }
  };

  const renderDetailsContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Form Fields */}
      <div className="lg:col-span-2 space-y-8">
        {/* Primary Details Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Task Details
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Task Title <span className="text-red-500">*</span>
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={handleEditTitleChange}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedTask.title || 'No title'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Status <span className="text-red-500">*</span>
                </label>
                {editMode ? (
                  <select
                    value={editForm.status || ''}
                    onChange={handleEditStatusChange}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="testing">Testing</option>
                    <option value="done">Done</option>
                  </select>
                ) : (
                  <div className={`w-full px-4 py-3.5 rounded-xl text-slate-900 font-medium flex items-center gap-2 border ${
                    selectedTask.status === 'done' ? 'bg-green-50 border-green-200 text-green-800' :
                    selectedTask.status === 'in_progress' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                    selectedTask.status === 'testing' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    selectedTask.status === 'review' ? 'bg-purple-50 border-purple-200 text-purple-800' :
                    'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      selectedTask.status === 'done' ? 'bg-green-500' :
                      selectedTask.status === 'in_progress' ? 'bg-blue-500' :
                      selectedTask.status === 'testing' ? 'bg-yellow-500' :
                      selectedTask.status === 'review' ? 'bg-purple-500' :
                      'bg-slate-500'
                    }`}></span>
                    {selectedTask.status?.replace('_', ' ').charAt(0).toUpperCase() + selectedTask.status?.replace('_', ' ').slice(1) || 'Backlog'}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Priority <span className="text-red-500">*</span>
                </label>
                {editMode ? (
                  <select
                    value={editForm.priority || ''}
                    onChange={handleEditPriorityChange}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                ) : (
                  <div className={`w-full px-4 py-3.5 rounded-xl text-slate-900 font-medium flex items-center gap-2 border ${
                    selectedTask.priority === 'Critical' ? 'bg-red-50 border-red-200 text-red-800' :
                    selectedTask.priority === 'High' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                    selectedTask.priority === 'Medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-green-50 border-green-200 text-green-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      selectedTask.priority === 'Critical' ? 'bg-red-500' :
                      selectedTask.priority === 'High' ? 'bg-orange-500' :
                      selectedTask.priority === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></span>
                    {selectedTask.priority || 'Medium'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Assigned To
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.assigned_to || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, assigned_to: e.target.value }))}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 font-medium"
                    disabled={loading}
                    placeholder="Enter assignee name..."
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {selectedTask.assigned_to ? selectedTask.assigned_to.charAt(0).toUpperCase() : 'T'}
                    </div>
                    {selectedTask.assigned_to || 'Unassigned'}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Estimated Hours
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={editForm.estimated_hours || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, estimated_hours: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 font-medium"
                    disabled={loading}
                    placeholder="0"
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedTask.estimated_hours || 0} hours
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Due Date
                </label>
                {editMode ? (
                  <input
                    type="date"
                    value={editForm.due_date || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedTask.due_date ? formatDate(selectedTask.due_date) : 'No due date'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Work Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Technical Work
            </h3>
          </div>

          <div className="p-6">
            {editMode ? (
              <textarea
                value={editForm.technical_work_description || ''}
                onChange={handleEditTechnicalWorkChange}
                rows={8}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 font-medium resize-none"
                disabled={loading}
                placeholder="Describe the technical work required..."
              />
            ) : (
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200 rounded-xl p-4">
                  {selectedTask.technical_work_description || 'No technical work description provided'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Description
            </h3>
          </div>

          <div className="p-6">
            {editMode ? (
              <textarea
                value={editForm.description || ''}
                onChange={handleEditDescriptionChange}
                rows={6}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 font-medium resize-none"
                disabled={loading}
                placeholder="Enter detailed description..."
              />
            ) : (
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200 rounded-xl p-4">
                  {selectedTask.description || 'No description provided'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Enhanced Sidebar */}
      <div className="space-y-6">
        {/* Task Information Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Task Information
            </h3>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Created:</span>
              <span className="text-slate-900 font-medium">{formatDate(selectedTask.created_at)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Updated:</span>
              <span className="text-slate-900 font-medium">{formatDate(selectedTask.updated_at)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Task ID:</span>
              <span className="font-mono text-slate-900 font-medium">#{selectedTask.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Type:</span>
              <span className="text-slate-900 font-medium">{selectedTask.type?.charAt(0).toUpperCase() + selectedTask.type?.slice(1)}</span>
            </div>
            {selectedTask.actual_hours && (
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Actual Hours:</span>
                <span className="text-slate-900 font-medium">{selectedTask.actual_hours}h</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-900/5 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-orange-50/80 to-red-50/80 border-b border-slate-200/60">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Progress Overview
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 text-center">
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                <div className="font-bold text-slate-900 text-lg">{selectedTask.sub_tasks?.length || 0}</div>
                <div className="text-xs text-slate-500">Sub-tasks</div>
              </div>
            </div>

            {selectedTask.metrics && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-600">Sub-task Completion</span>
                    <span className="text-xs font-medium text-slate-900">{selectedTask.metrics?.subTaskCompletionRate || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${selectedTask.metrics?.subTaskCompletionRate || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubTasksContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Sub-tasks
          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
            {selectedTask.sub_tasks?.length || 0}
          </span>
        </h3>
      </div>
      <div className="p-8">
        {selectedTask.sub_tasks && selectedTask.sub_tasks.length > 0 ? (
          <div className="space-y-4">
            {selectedTask.sub_tasks.map((subTask, index) => (
              <div key={subTask.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{subTask.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Status: {subTask.status}</span>
                      <span>•</span>
                      <span>Assigned: {subTask.assigned_to || 'Unassigned'}</span>
                      <span>•</span>
                      <span>{subTask.estimated_hours || 0}h estimated</span>
                    </div>
                  </div>
                </div>
                {subTask.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">{subTask.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No sub-tasks found for this task.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMetricsContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Metrics & Analytics
        </h3>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
            <div className="text-2xl font-bold text-orange-900">{selectedTask.sub_tasks?.length || 0}</div>
            <div className="text-sm text-orange-600">Total Sub-tasks</div>
            <div className="text-xs text-orange-500 mt-1">{selectedTask.metrics?.completedSubTasks || 0} completed</div>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-900">{selectedTask.estimated_hours || 0}h</div>
            <div className="text-sm text-blue-600">Estimated Hours</div>
            <div className="text-xs text-blue-500 mt-1">{selectedTask.actual_hours || 0}h actual</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoryContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          Change History
        </h3>
      </div>
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <div className="text-2xl">📊</div>
        </div>
        <p className="text-slate-500">No change history available for this task.</p>
      </div>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Task Settings
        </h3>
      </div>
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <div className="text-2xl">⚙️</div>
        </div>
        <p className="text-slate-500">Task settings and preferences will be available here.</p>
      </div>
    </div>
  );

  if (!selectedTask) {
    return null;
  }

  return (
    <div className="h-full bg-slate-50 overflow-y-auto flex flex-col">
      {/* Modern Header with Navigation */}
      <div className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center text-sm text-slate-500 space-x-2">
                <span className="hover:text-slate-700 cursor-pointer">Projects</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="hover:text-slate-700 cursor-pointer">Tasks</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900 font-medium">#{selectedTask.id.substring(0, 8).toUpperCase()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2"
                disabled={loading}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              {!editMode ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 text-sm font-medium transition-all duration-200 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title Section */}
          <div className="py-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-orange-100">
                  <CheckSquare className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">#{selectedTask.id.substring(0, 8).toUpperCase()}</h1>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTask.status === 'done' ? 'bg-green-100 text-green-800' :
                      selectedTask.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      selectedTask.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                      selectedTask.status === 'review' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        selectedTask.status === 'done' ? 'bg-green-500' :
                        selectedTask.status === 'in_progress' ? 'bg-blue-500' :
                        selectedTask.status === 'testing' ? 'bg-yellow-500' :
                        selectedTask.status === 'review' ? 'bg-purple-500' :
                        'bg-slate-500'
                      }`}></div>
                      {selectedTask.status?.replace('_', ' ').charAt(0).toUpperCase() + selectedTask.status?.replace('_', ' ').slice(1)}
                    </div>
                  </div>
                  <p className="text-slate-600">{selectedTask.title}</p>
                </div>
              </div>

              <div className="text-right text-sm text-slate-500">
                <div className="mb-1">Created {formatDate(selectedTask.created_at)}</div>
                <div>Updated {formatDate(selectedTask.updated_at)}</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6">
              <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { key: 'details', label: 'Details' },
                  { key: 'subtasks', label: 'Sub-tasks' },
                  { key: 'metrics', label: 'Metrics' },
                  { key: 'history', label: 'History' },
                  { key: 'settings', label: 'Settings' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Tab-Based Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TaskDetail;