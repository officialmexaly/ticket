'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, Edit3, Save, X, Trash2, ChevronDown, ChevronRight, Zap, User, Calendar, Clock, AlertCircle, Play, Pause, Square } from 'lucide-react';

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

interface SubTaskDetailProps {
  selectedSubTask: SubTaskData;
  editMode: boolean;
  loading: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: (subTaskId: string, data: Partial<SubTaskData>) => void;
  onDelete: (subTaskId: string) => void;
  onCancel: () => void;
  formatDate: (date: string) => string;
}

const SubTaskDetail: React.FC<SubTaskDetailProps> = ({
  selectedSubTask,
  editMode,
  loading,
  onBack,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  formatDate
}) => {
  const [editForm, setEditForm] = useState(selectedSubTask || {});
  const [activeTab, setActiveTab] = useState('details');

  // Update editForm when selectedSubTask changes
  useEffect(() => {
    if (selectedSubTask) {
      setEditForm(selectedSubTask);
    }
  }, [selectedSubTask]);

  const handleSave = async () => {
    if (selectedSubTask && editForm) {
      try {
        await onSave(selectedSubTask.id, {
          title: editForm.title,
          description: editForm.description,
          atomic_work_description: editForm.atomic_work_description,
          type: editForm.type,
          status: editForm.status,
          assigned_to: editForm.assigned_to,
          estimated_hours: editForm.estimated_hours,
          due_date: editForm.due_date
        });
      } catch (error) {
        console.error('Error saving sub-task:', error);
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

  const handleEditAtomicWorkChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, atomic_work_description: value }));
  }, []);

  const handleEditStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, status: value }));
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderDetailsContent();
      case 'time-tracking':
        return renderTimeTrackingContent();
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
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Sub-task Details
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Sub-task Title <span className="text-red-500">*</span>
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={handleEditTitleChange}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedSubTask.title || 'No title'}
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
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="review">Review</option>
                    <option value="testing">Testing</option>
                    <option value="done">Done</option>
                  </select>
                ) : (
                  <div className={`w-full px-4 py-3.5 rounded-xl text-slate-900 font-medium flex items-center gap-2 border ${
                    selectedSubTask.status === 'done' ? 'bg-green-50 border-green-200 text-green-800' :
                    selectedSubTask.status === 'in_progress' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                    selectedSubTask.status === 'blocked' ? 'bg-red-50 border-red-200 text-red-800' :
                    selectedSubTask.status === 'testing' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    selectedSubTask.status === 'review' ? 'bg-purple-50 border-purple-200 text-purple-800' :
                    'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      selectedSubTask.status === 'done' ? 'bg-green-500' :
                      selectedSubTask.status === 'in_progress' ? 'bg-blue-500' :
                      selectedSubTask.status === 'blocked' ? 'bg-red-500' :
                      selectedSubTask.status === 'testing' ? 'bg-yellow-500' :
                      selectedSubTask.status === 'review' ? 'bg-purple-500' :
                      'bg-slate-500'
                    }`}></span>
                    {selectedSubTask.status?.replace('_', ' ').charAt(0).toUpperCase() + selectedSubTask.status?.replace('_', ' ').slice(1) || 'To Do'}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Assigned To
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.assigned_to || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, assigned_to: e.target.value }))}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 font-medium"
                    disabled={loading}
                    placeholder="Enter assignee name..."
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {selectedSubTask.assigned_to ? selectedSubTask.assigned_to.charAt(0).toUpperCase() : 'S'}
                    </div>
                    {selectedSubTask.assigned_to || 'Unassigned'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Type
                </label>
                {editMode ? (
                  <select
                    value={editForm.type || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <option value="development">Development</option>
                    <option value="testing">Testing</option>
                    <option value="bug_fix">Bug Fix</option>
                    <option value="documentation">Documentation</option>
                    <option value="research">Research</option>
                    <option value="design">Design</option>
                  </select>
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedSubTask.type?.replace('_', ' ').charAt(0).toUpperCase() + selectedSubTask.type?.replace('_', ' ').slice(1) || 'Development'}
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
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 font-medium"
                    disabled={loading}
                    placeholder="0"
                    step="0.5"
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedSubTask.estimated_hours || 0} hours
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
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedSubTask.due_date ? formatDate(selectedSubTask.due_date) : 'No due date'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Atomic Work Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Atomic Work Description
            </h3>
          </div>

          <div className="p-6">
            {editMode ? (
              <textarea
                value={editForm.atomic_work_description || ''}
                onChange={handleEditAtomicWorkChange}
                rows={6}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 font-medium resize-none"
                disabled={loading}
                placeholder="Describe the specific atomic work unit..."
              />
            ) : (
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200 rounded-xl p-4">
                  {selectedSubTask.atomic_work_description || 'No atomic work description provided'}
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
                rows={4}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 font-medium resize-none"
                disabled={loading}
                placeholder="Enter detailed description..."
              />
            ) : (
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200 rounded-xl p-4">
                  {selectedSubTask.description || 'No description provided'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Enhanced Sidebar */}
      <div className="space-y-6">
        {/* Sub-task Information Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Sub-task Information
            </h3>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Created:</span>
              <span className="text-slate-900 font-medium">{formatDate(selectedSubTask.created_at)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Updated:</span>
              <span className="text-slate-900 font-medium">{formatDate(selectedSubTask.updated_at)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Sub-task ID:</span>
              <span className="font-mono text-slate-900 font-medium">#{selectedSubTask.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Parent Task:</span>
              <span className="text-slate-900 font-medium">{selectedSubTask.task?.title || 'Unknown'}</span>
            </div>
            {selectedSubTask.actual_hours && (
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Actual Hours:</span>
                <span className="text-slate-900 font-medium">{selectedSubTask.actual_hours}h</span>
              </div>
            )}
          </div>
        </div>

        {/* Time Tracking Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-900/5 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-b border-slate-200/60">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Time Tracking
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50">
                <div className="font-bold text-slate-900">{selectedSubTask.estimated_hours || 0}h</div>
                <div className="text-xs text-slate-500">Estimated</div>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50">
                <div className="font-bold text-slate-900">{selectedSubTask.actual_hours || 0}h</div>
                <div className="text-xs text-slate-500">Actual</div>
              </div>
            </div>

            {/* Quick Time Tracking Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Quick Actions</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors">
                    <Pause className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                    <Square className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Progress
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600">Completion</span>
                  <span className="text-xs font-medium text-slate-900">
                    {selectedSubTask.status === 'done' ? '100' :
                     selectedSubTask.status === 'testing' || selectedSubTask.status === 'review' ? '80' :
                     selectedSubTask.status === 'in_progress' ? '50' : '0'}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${selectedSubTask.status === 'done' ? '100' :
                                selectedSubTask.status === 'testing' || selectedSubTask.status === 'review' ? '80' :
                                selectedSubTask.status === 'in_progress' ? '50' : '0'}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimeTrackingContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Time Tracking
        </h3>
      </div>
      <div className="p-8">
        {selectedSubTask.time_logs && selectedSubTask.time_logs.length > 0 ? (
          <div className="space-y-4">
            {selectedSubTask.time_logs.map((log, index) => (
              <div key={index} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{log.description || 'Work Session'}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Duration: {log.duration}h</span>
                      <span>•</span>
                      <span>Date: {formatDate(log.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No time logs recorded for this sub-task.</p>
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
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-900">{selectedSubTask.estimated_hours || 0}h</div>
            <div className="text-sm text-blue-600">Estimated Hours</div>
            <div className="text-xs text-blue-500 mt-1">{selectedSubTask.actual_hours || 0}h actual</div>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-900">
              {selectedSubTask.metrics?.efficiency || 0}%
            </div>
            <div className="text-sm text-emerald-600">Efficiency</div>
            <div className="text-xs text-emerald-500 mt-1">Est. vs actual time</div>
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
        <p className="text-slate-500">No change history available for this sub-task.</p>
      </div>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Sub-task Settings
        </h3>
      </div>
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <div className="text-2xl">⚙️</div>
        </div>
        <p className="text-slate-500">Sub-task settings and preferences will be available here.</p>
      </div>
    </div>
  );

  if (!selectedSubTask) {
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center text-sm text-slate-500 space-x-2">
                <span className="hover:text-slate-700 cursor-pointer">Projects</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="hover:text-slate-700 cursor-pointer">Sub-tasks</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900 font-medium">#{selectedSubTask.id.substring(0, 8).toUpperCase()}</span>
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
                <div className="p-2 rounded-lg bg-blue-100">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">#{selectedSubTask.id.substring(0, 8).toUpperCase()}</h1>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedSubTask.status === 'done' ? 'bg-green-100 text-green-800' :
                      selectedSubTask.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      selectedSubTask.status === 'blocked' ? 'bg-red-100 text-red-800' :
                      selectedSubTask.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                      selectedSubTask.status === 'review' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        selectedSubTask.status === 'done' ? 'bg-green-500' :
                        selectedSubTask.status === 'in_progress' ? 'bg-blue-500' :
                        selectedSubTask.status === 'blocked' ? 'bg-red-500' :
                        selectedSubTask.status === 'testing' ? 'bg-yellow-500' :
                        selectedSubTask.status === 'review' ? 'bg-purple-500' :
                        'bg-slate-500'
                      }`}></div>
                      {selectedSubTask.status?.replace('_', ' ').charAt(0).toUpperCase() + selectedSubTask.status?.replace('_', ' ').slice(1)}
                    </div>
                  </div>
                  <p className="text-slate-600">{selectedSubTask.title}</p>
                </div>
              </div>

              <div className="text-right text-sm text-slate-500">
                <div className="mb-1">Created {formatDate(selectedSubTask.created_at)}</div>
                <div>Updated {formatDate(selectedSubTask.updated_at)}</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6">
              <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { key: 'details', label: 'Details' },
                  { key: 'time-tracking', label: 'Time Tracking' },
                  { key: 'metrics', label: 'Metrics' },
                  { key: 'history', label: 'History' },
                  { key: 'settings', label: 'Settings' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-white text-blue-600 shadow-sm'
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

export default SubTaskDetail;