'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, Edit3, Save, X, Trash2, ChevronDown, ChevronRight, Lightbulb, Target, Users, Calendar, DollarSign } from 'lucide-react';

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

interface EpicDetailProps {
  selectedEpic: EpicData;
  editMode: boolean;
  loading: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: (epicId: string, data: Partial<EpicData>) => void;
  onDelete: (epicId: string) => void;
  onCancel: () => void;
  formatDate: (date: string) => string;
}

const EpicDetail: React.FC<EpicDetailProps> = ({
  selectedEpic,
  editMode,
  loading,
  onBack,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  formatDate
}) => {
  const [editForm, setEditForm] = useState(selectedEpic || {});
  const [activeTab, setActiveTab] = useState('details');

  // Update editForm when selectedEpic changes
  useEffect(() => {
    if (selectedEpic) {
      setEditForm(selectedEpic);
    }
  }, [selectedEpic]);

  const handleSave = async () => {
    if (selectedEpic && editForm) {
      try {
        await onSave(selectedEpic.id, {
          name: editForm.name,
          description: editForm.description,
          vision: editForm.vision,
          business_goal: editForm.business_goal,
          status: editForm.status,
          priority: editForm.priority,
          epic_owner: editForm.epic_owner,
          stakeholders: editForm.stakeholders,
          budget: editForm.budget,
          start_date: editForm.start_date,
          target_completion: editForm.target_completion
        });
      } catch (error) {
        console.error('Error saving epic:', error);
      }
    }
  };

  // Optimized edit form handlers
  const handleEditNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, name: value }));
  }, []);

  const handleEditDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, description: value }));
  }, []);

  const handleEditVisionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, vision: value }));
  }, []);

  const handleEditBusinessGoalChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, business_goal: value }));
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
      case 'features':
        return renderFeaturesContent();
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
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Epic Details
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Epic Name <span className="text-red-500">*</span>
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={handleEditNameChange}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedEpic.name || 'No name'}
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
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <div className={`w-full px-4 py-3.5 rounded-xl text-slate-900 font-medium flex items-center gap-2 border ${
                    selectedEpic.status === 'completed' ? 'bg-green-50 border-green-200 text-green-800' :
                    selectedEpic.status === 'active' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                    selectedEpic.status === 'on_hold' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      selectedEpic.status === 'completed' ? 'bg-green-500' :
                      selectedEpic.status === 'active' ? 'bg-blue-500' :
                      selectedEpic.status === 'on_hold' ? 'bg-yellow-500' :
                      'bg-slate-500'
                    }`}></span>
                    {selectedEpic.status?.charAt(0).toUpperCase() + selectedEpic.status?.slice(1) || 'Planning'}
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
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                ) : (
                  <div className={`w-full px-4 py-3.5 rounded-xl text-slate-900 font-medium flex items-center gap-2 border ${
                    selectedEpic.priority === 'Critical' ? 'bg-red-50 border-red-200 text-red-800' :
                    selectedEpic.priority === 'High' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                    selectedEpic.priority === 'Medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-green-50 border-green-200 text-green-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      selectedEpic.priority === 'Critical' ? 'bg-red-500' :
                      selectedEpic.priority === 'High' ? 'bg-orange-500' :
                      selectedEpic.priority === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></span>
                    {selectedEpic.priority || 'Medium'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Epic Owner
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.epic_owner || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, epic_owner: e.target.value }))}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium"
                    disabled={loading}
                    placeholder="Enter epic owner name..."
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {selectedEpic.epic_owner ? selectedEpic.epic_owner.charAt(0).toUpperCase() : 'E'}
                    </div>
                    {selectedEpic.epic_owner || 'Unassigned'}
                  </div>
                )}
              </div>
            </div>

            {/* Dates and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Start Date
                </label>
                {editMode ? (
                  <input
                    type="date"
                    value={editForm.start_date || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedEpic.start_date ? formatDate(selectedEpic.start_date) : 'No start date set'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Target Completion
                </label>
                {editMode ? (
                  <input
                    type="date"
                    value={editForm.target_completion || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, target_completion: e.target.value }))}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedEpic.target_completion ? formatDate(selectedEpic.target_completion) : 'No target date set'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Budget
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={editForm.budget || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium"
                    disabled={loading}
                    placeholder="0.00"
                    step="0.01"
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedEpic.budget ? `$${selectedEpic.budget.toLocaleString()}` : 'No budget set'}
                  </div>
                )}
              </div>
            </div>

            {/* Stakeholders */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Stakeholders
              </label>
              {editMode ? (
                <textarea
                  value={Array.isArray(editForm.stakeholders) ? editForm.stakeholders.join(', ') : (editForm.stakeholders || '')}
                  onChange={(e) => {
                    const stakeholders = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                    setEditForm(prev => ({ ...prev, stakeholders }));
                  }}
                  rows={2}
                  className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium resize-none"
                  disabled={loading}
                  placeholder="Enter stakeholders separated by commas..."
                />
              ) : (
                <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                  {Array.isArray(selectedEpic.stakeholders) && selectedEpic.stakeholders.length > 0
                    ? selectedEpic.stakeholders.join(', ')
                    : 'No stakeholders assigned'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Vision & Goals
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Vision Statement
              </label>
              {editMode ? (
                <textarea
                  value={editForm.vision || ''}
                  onChange={handleEditVisionChange}
                  rows={4}
                  className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium resize-none"
                  disabled={loading}
                  placeholder="Enter the epic vision..."
                />
              ) : (
                <div className="prose prose-slate max-w-none">
                  <div className="text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200 rounded-xl p-4">
                    {selectedEpic.vision || 'No vision statement provided'}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Business Goal
              </label>
              {editMode ? (
                <textarea
                  value={editForm.business_goal || ''}
                  onChange={handleEditBusinessGoalChange}
                  rows={4}
                  className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium resize-none"
                  disabled={loading}
                  placeholder="Enter the business goal..."
                />
              ) : (
                <div className="prose prose-slate max-w-none">
                  <div className="text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200 rounded-xl p-4">
                    {selectedEpic.business_goal || 'No business goal provided'}
                  </div>
                </div>
              )}
            </div>
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
                rows={8}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium resize-none"
                disabled={loading}
                placeholder="Enter detailed description..."
              />
            ) : (
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200 rounded-xl p-4">
                  {selectedEpic.description || 'No description provided'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Enhanced Sidebar */}
      <div className="space-y-6">
        {/* Epic Information Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Epic Information
            </h3>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Created:</span>
              <span className="text-slate-900 font-medium">{formatDate(selectedEpic.created_at)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Updated:</span>
              <span className="text-slate-900 font-medium">{formatDate(selectedEpic.updated_at)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Epic ID:</span>
              <span className="font-mono text-slate-900 font-medium">#{selectedEpic.id.substring(0, 8).toUpperCase()}</span>
            </div>
            {selectedEpic.budget && (
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Budget:</span>
                <span className="text-slate-900 font-medium">${selectedEpic.budget.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-900/5 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border-b border-slate-200/60">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Progress Overview
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50">
                <div className="font-bold text-slate-900">{selectedEpic.metrics?.totalFeatures || 0}</div>
                <div className="text-xs text-slate-500">Features</div>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50">
                <div className="font-bold text-slate-900">{selectedEpic.metrics?.totalTasks || 0}</div>
                <div className="text-xs text-slate-500">Tasks</div>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50">
                <div className="font-bold text-slate-900">{selectedEpic.metrics?.totalStories || 0}</div>
                <div className="text-xs text-slate-500">Stories</div>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50">
                <div className="font-bold text-slate-900">{selectedEpic.metrics?.totalSubTasks || 0}</div>
                <div className="text-xs text-slate-500">Sub-tasks</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600">Feature Completion</span>
                  <span className="text-xs font-medium text-slate-900">{selectedEpic.metrics?.featureCompletionRate || 0}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${selectedEpic.metrics?.featureCompletionRate || 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600">Story Completion</span>
                  <span className="text-xs font-medium text-slate-900">{selectedEpic.metrics?.storyCompletionRate || 0}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${selectedEpic.metrics?.storyCompletionRate || 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600">Task Completion</span>
                  <span className="text-xs font-medium text-slate-900">{selectedEpic.metrics?.taskCompletionRate || 0}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${selectedEpic.metrics?.taskCompletionRate || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturesContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          Features
          <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-semibold">
            {selectedEpic.features?.length || 0}
          </span>
        </h3>
      </div>
      <div className="p-8">
        {selectedEpic.features && selectedEpic.features.length > 0 ? (
          <div className="space-y-4">
            {selectedEpic.features.map((feature, index) => (
              <div key={feature.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{feature.name}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Status: {feature.status}</span>
                      <span>•</span>
                      <span>Priority: {feature.priority}</span>
                      <span>•</span>
                      <span>{feature.tasks?.length || 0} Tasks</span>
                    </div>
                  </div>
                </div>
                {feature.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">{feature.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No features found for this epic.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">{selectedEpic.metrics?.totalFeatures || 0}</div>
            <div className="text-sm text-purple-600">Total Features</div>
            <div className="text-xs text-purple-500 mt-1">{selectedEpic.metrics?.completedFeatures || 0} completed</div>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-900">{selectedEpic.metrics?.totalStories || 0}</div>
            <div className="text-sm text-blue-600">User Stories</div>
            <div className="text-xs text-blue-500 mt-1">{selectedEpic.metrics?.completedStories || 0} completed</div>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-900">{selectedEpic.metrics?.totalTasks || 0}</div>
            <div className="text-sm text-emerald-600">Tasks</div>
            <div className="text-xs text-emerald-500 mt-1">{selectedEpic.metrics?.completedTasks || 0} completed</div>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
            <div className="text-2xl font-bold text-orange-900">{selectedEpic.metrics?.totalSubTasks || 0}</div>
            <div className="text-sm text-orange-600">Sub-tasks</div>
            <div className="text-xs text-orange-500 mt-1">{selectedEpic.metrics?.completedSubTasks || 0} completed</div>
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
        <p className="text-slate-500">No change history available for this epic.</p>
      </div>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Epic Settings
        </h3>
      </div>
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <div className="text-2xl">⚙️</div>
        </div>
        <p className="text-slate-500">Epic settings and preferences will be available here.</p>
      </div>
    </div>
  );

  if (!selectedEpic) {
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
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center text-sm text-slate-500 space-x-2">
                <span className="hover:text-slate-700 cursor-pointer">Projects</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="hover:text-slate-700 cursor-pointer">Epics</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900 font-medium">#{selectedEpic.id.substring(0, 8).toUpperCase()}</span>
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
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: selectedEpic.color + '20' }}
                >
                  <Lightbulb className="w-5 h-5" style={{ color: selectedEpic.color }} />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">#{selectedEpic.id.substring(0, 8).toUpperCase()}</h1>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedEpic.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedEpic.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      selectedEpic.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        selectedEpic.status === 'completed' ? 'bg-green-500' :
                        selectedEpic.status === 'active' ? 'bg-blue-500' :
                        selectedEpic.status === 'on_hold' ? 'bg-yellow-500' :
                        'bg-slate-500'
                      }`}></div>
                      {selectedEpic.status?.charAt(0).toUpperCase() + selectedEpic.status?.slice(1)}
                    </div>
                  </div>
                  <p className="text-slate-600">{selectedEpic.name}</p>
                </div>
              </div>

              <div className="text-right text-sm text-slate-500">
                <div className="mb-1">Created {formatDate(selectedEpic.created_at)}</div>
                <div>Updated {formatDate(selectedEpic.updated_at)}</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6">
              <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { key: 'details', label: 'Details' },
                  { key: 'features', label: 'Features' },
                  { key: 'metrics', label: 'Metrics' },
                  { key: 'history', label: 'History' },
                  { key: 'settings', label: 'Settings' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-white text-purple-600 shadow-sm'
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

export default EpicDetail;