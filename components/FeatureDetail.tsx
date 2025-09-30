'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, Edit3, Save, X, Trash2, ChevronRight, Target, CheckSquare, Users, Star } from 'lucide-react';

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
  acceptance_criteria: string;
  feature_owner: string;
  estimated_story_points: number;
  color: string;
  tags: string[];
  dependencies: string[];
  user_stories: any[];
  created_at: string;
  updated_at: string;
  epics: {
    name: string;
    color: string;
  };
  tasks: any[];
  tickets: any[];
  metrics: {
    totalStories: number;
    completedStories: number;
    totalTasks: number;
    completedTasks: number;
    totalSubTasks: number;
    completedSubTasks: number;
    totalStoryPoints: number;
    completedStoryPoints: number;
    storyCompletionRate: number;
    taskCompletionRate: number;
    velocity: number;
  };
}

interface FeatureDetailProps {
  selectedFeature: FeatureData;
  editMode: boolean;
  loading: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: (featureId: string, data: Partial<FeatureData>) => void;
  onDelete: (featureId: string) => void;
  onCancel: () => void;
  formatDate: (date: string) => string;
}

const FeatureDetail: React.FC<FeatureDetailProps> = ({
  selectedFeature,
  editMode,
  loading,
  onBack,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  formatDate
}) => {
  const [editForm, setEditForm] = useState(selectedFeature || {});
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (selectedFeature) {
      setEditForm(selectedFeature);
    }
  }, [selectedFeature]);

  const handleSave = async () => {
    if (selectedFeature && editForm) {
      try {
        await onSave(selectedFeature.id, {
          name: editForm.name,
          description: editForm.description,
          capability_description: editForm.capability_description,
          business_value: editForm.business_value,
          status: editForm.status,
          priority: editForm.priority,
          feature_owner: editForm.feature_owner,
          estimated_story_points: editForm.estimated_story_points,
          acceptance_criteria: editForm.acceptance_criteria,
          start_date: editForm.start_date,
          target_completion: editForm.target_completion
        });
      } catch (error) {
        console.error('Error saving feature:', error);
      }
    }
  };

  const handleEditNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleEditDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditForm(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleEditCapabilityChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditForm(prev => ({ ...prev, capability_description: e.target.value }));
  }, []);

  const handleEditBusinessValueChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditForm(prev => ({ ...prev, business_value: e.target.value }));
  }, []);

  const handleEditStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditForm(prev => ({ ...prev, status: e.target.value }));
  }, []);

  const handleEditPriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditForm(prev => ({ ...prev, priority: e.target.value }));
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderDetailsContent();
      case 'stories':
        return renderStoriesContent();
      case 'tasks':
        return renderTasksContent();
      case 'tickets':
        return renderTicketsContent();
      case 'metrics':
        return renderMetricsContent();
      case 'history':
        return renderHistoryContent();
      default:
        return renderDetailsContent();
    }
  };

  const renderDetailsContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-8">
        {/* Primary Details Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Feature Details
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Feature Name <span className="text-red-500">*</span>
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={handleEditNameChange}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedFeature.name || 'No name'}
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
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="planning">Planning</option>
                    <option value="development">Development</option>
                    <option value="testing">Testing</option>
                    <option value="done">Done</option>
                  </select>
                ) : (
                  <div className={`w-full px-4 py-3.5 rounded-xl text-slate-900 font-medium flex items-center gap-2 border ${
                    selectedFeature.status === 'done' ? 'bg-green-50 border-green-200 text-green-800' :
                    selectedFeature.status === 'development' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                    selectedFeature.status === 'testing' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      selectedFeature.status === 'done' ? 'bg-green-500' :
                      selectedFeature.status === 'development' ? 'bg-blue-500' :
                      selectedFeature.status === 'testing' ? 'bg-yellow-500' :
                      'bg-slate-500'
                    }`}></span>
                    {selectedFeature.status?.charAt(0).toUpperCase() + selectedFeature.status?.slice(1) || 'Backlog'}
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
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                ) : (
                  <div className={`w-full px-4 py-3.5 rounded-xl text-slate-900 font-medium flex items-center gap-2 border ${
                    selectedFeature.priority === 'Critical' ? 'bg-red-50 border-red-200 text-red-800' :
                    selectedFeature.priority === 'High' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                    selectedFeature.priority === 'Medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-green-50 border-green-200 text-green-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      selectedFeature.priority === 'Critical' ? 'bg-red-500' :
                      selectedFeature.priority === 'High' ? 'bg-orange-500' :
                      selectedFeature.priority === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></span>
                    {selectedFeature.priority || 'Medium'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Feature Owner
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.feature_owner || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, feature_owner: e.target.value }))}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 font-medium"
                    disabled={loading}
                    placeholder="Enter feature owner name..."
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {selectedFeature.feature_owner ? selectedFeature.feature_owner.charAt(0).toUpperCase() : 'F'}
                    </div>
                    {selectedFeature.feature_owner || 'Unassigned'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Story Points
              </label>
              {editMode ? (
                <input
                  type="number"
                  value={editForm.estimated_story_points || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, estimated_story_points: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 font-medium"
                  disabled={loading}
                  placeholder="Estimated story points..."
                />
              ) : (
                <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {selectedFeature.estimated_story_points || 0} Story Points
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Capability & Business Value Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Capability & Business Value
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Capability Description
              </label>
              {editMode ? (
                <textarea
                  value={editForm.capability_description || ''}
                  onChange={handleEditCapabilityChange}
                  rows={4}
                  className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 font-medium resize-none"
                  disabled={loading}
                  placeholder="Describe the capability this feature provides..."
                />
              ) : (
                <div className="prose prose-slate max-w-none">
                  <div className="text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200 rounded-xl p-4">
                    {selectedFeature.capability_description || 'No capability description provided'}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Business Value
              </label>
              {editMode ? (
                <textarea
                  value={editForm.business_value || ''}
                  onChange={handleEditBusinessValueChange}
                  rows={4}
                  className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 font-medium resize-none"
                  disabled={loading}
                  placeholder="Describe the business value this feature provides..."
                />
              ) : (
                <div className="prose prose-slate max-w-none">
                  <div className="text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200 rounded-xl p-4">
                    {selectedFeature.business_value || 'No business value provided'}
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
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              Description
            </h3>
          </div>

          <div className="p-6">
            {editMode ? (
              <textarea
                value={editForm.description || ''}
                onChange={handleEditDescriptionChange}
                rows={8}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 font-medium resize-none"
                disabled={loading}
                placeholder="Enter detailed description..."
              />
            ) : (
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed bg-slate-50/80 border border-slate-200 rounded-xl p-4">
                  {selectedFeature.description || 'No description provided'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Feature Information Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Feature Information
            </h3>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Epic:</span>
              <span className="text-slate-900 font-medium">{selectedFeature.epics?.name || 'No Epic'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Created:</span>
              <span className="text-slate-900 font-medium">{formatDate(selectedFeature.created_at)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Updated:</span>
              <span className="text-slate-900 font-medium">{formatDate(selectedFeature.updated_at)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Feature ID:</span>
              <span className="font-mono text-slate-900 font-medium">#{selectedFeature.id.substring(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-900/5 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-b border-slate-200/60">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Progress Overview
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50">
                <div className="font-bold text-slate-900">{selectedFeature.metrics?.totalStories || 0}</div>
                <div className="text-xs text-slate-500">User Stories</div>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50">
                <div className="font-bold text-slate-900">{selectedFeature.metrics?.totalTasks || 0}</div>
                <div className="text-xs text-slate-500">Tasks</div>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50">
                <div className="font-bold text-slate-900">{selectedFeature.metrics?.velocity || 0}</div>
                <div className="text-xs text-slate-500">Velocity</div>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50">
                <div className="font-bold text-slate-900">{selectedFeature.metrics?.totalStoryPoints || 0}</div>
                <div className="text-xs text-slate-500">Story Points</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600">Story Completion</span>
                  <span className="text-xs font-medium text-slate-900">{selectedFeature.metrics?.storyCompletionRate || 0}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${selectedFeature.metrics?.storyCompletionRate || 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600">Task Completion</span>
                  <span className="text-xs font-medium text-slate-900">{selectedFeature.metrics?.taskCompletionRate || 0}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${selectedFeature.metrics?.taskCompletionRate || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStoriesContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          User Stories
          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
            {selectedFeature.user_stories?.length || 0}
          </span>
        </h3>
      </div>
      <div className="p-8">
        {selectedFeature.user_stories && selectedFeature.user_stories.length > 0 ? (
          <div className="space-y-4">
            {selectedFeature.user_stories.map((story, index) => (
              <div key={story.id || index} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{story.title || `Story ${index + 1}`}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Status: {story.status || 'todo'}</span>
                      <span>•</span>
                      <span>Points: {story.story_points || 0}</span>
                    </div>
                  </div>
                </div>
                {story.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">{story.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No user stories found for this feature.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTasksContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          Tasks
          <span className="ml-auto bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold">
            {selectedFeature.tasks?.length || 0}
          </span>
        </h3>
      </div>
      <div className="p-8">
        {selectedFeature.tasks && selectedFeature.tasks.length > 0 ? (
          <div className="space-y-4">
            {selectedFeature.tasks.map((task, index) => (
              <div key={task.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{task.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Status: {task.status}</span>
                      <span>•</span>
                      <span>Priority: {task.priority}</span>
                      <span>•</span>
                      <span>{task.sub_tasks?.length || 0} Sub-tasks</span>
                    </div>
                  </div>
                </div>
                {task.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">{task.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No tasks found for this feature.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTicketsContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Linked Tickets
          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
            {selectedFeature.tickets?.length || 0}
          </span>
        </h3>
      </div>
      <div className="p-8">
        {selectedFeature.tickets && selectedFeature.tickets.length > 0 ? (
          <div className="space-y-4">
            {selectedFeature.tickets.map((ticket, index) => (
              <div key={ticket.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                    #{ticket.id.substring(0, 6).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{ticket.subject}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Status: {ticket.status}</span>
                      <span>•</span>
                      <span>Priority: {ticket.priority}</span>
                      <span>•</span>
                      <span>Type: {ticket.type}</span>
                      {ticket.user_story_ref && (
                        <>
                          <span>•</span>
                          <span>Story: {ticket.user_story_ref}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {ticket.description && (
                  <div className="prose prose-slate max-w-none">
                    <div className="text-slate-700 text-sm leading-relaxed bg-slate-100/50 border border-slate-200 rounded-xl p-3">
                      {ticket.description.length > 150 ? `${ticket.description.substring(0, 150)}...` : ticket.description}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No tickets linked to this feature yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMetricsContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Metrics & Analytics
        </h3>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-900">{selectedFeature.metrics?.totalStories || 0}</div>
            <div className="text-sm text-blue-600">User Stories</div>
            <div className="text-xs text-blue-500 mt-1">{selectedFeature.metrics?.completedStories || 0} completed</div>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
            <div className="text-2xl font-bold text-orange-900">{selectedFeature.metrics?.totalTasks || 0}</div>
            <div className="text-sm text-orange-600">Tasks</div>
            <div className="text-xs text-orange-500 mt-1">{selectedFeature.metrics?.completedTasks || 0} completed</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">{selectedFeature.metrics?.totalStoryPoints || 0}</div>
            <div className="text-sm text-purple-600">Story Points</div>
            <div className="text-xs text-purple-500 mt-1">{selectedFeature.metrics?.completedStoryPoints || 0} completed</div>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-900">{selectedFeature.metrics?.velocity || 0}</div>
            <div className="text-sm text-emerald-600">Velocity</div>
            <div className="text-xs text-emerald-500 mt-1">completed points</div>
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
        <p className="text-slate-500">No change history available for this feature.</p>
      </div>
    </div>
  );

  if (!selectedFeature) {
    return null;
  }

  return (
    <div className="h-full bg-slate-50 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center text-sm text-slate-500 space-x-2">
                <span className="hover:text-slate-700 cursor-pointer">Projects</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="hover:text-slate-700 cursor-pointer">Features</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900 font-medium">#{selectedFeature.id.substring(0, 8).toUpperCase()}</span>
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
                  style={{ backgroundColor: selectedFeature.color + '20' }}
                >
                  <Target className="w-5 h-5" style={{ color: selectedFeature.color }} />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">#{selectedFeature.id.substring(0, 8).toUpperCase()}</h1>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedFeature.status === 'done' ? 'bg-green-100 text-green-800' :
                      selectedFeature.status === 'development' ? 'bg-blue-100 text-blue-800' :
                      selectedFeature.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        selectedFeature.status === 'done' ? 'bg-green-500' :
                        selectedFeature.status === 'development' ? 'bg-blue-500' :
                        selectedFeature.status === 'testing' ? 'bg-yellow-500' :
                        'bg-slate-500'
                      }`}></div>
                      {selectedFeature.status?.charAt(0).toUpperCase() + selectedFeature.status?.slice(1)}
                    </div>
                  </div>
                  <p className="text-slate-600">{selectedFeature.name}</p>
                </div>
              </div>

              <div className="text-right text-sm text-slate-500">
                <div className="mb-1">Created {formatDate(selectedFeature.created_at)}</div>
                <div>Updated {formatDate(selectedFeature.updated_at)}</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6">
              <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { key: 'details', label: 'Details' },
                  { key: 'stories', label: 'User Stories' },
                  { key: 'tasks', label: 'Tasks' },
                  { key: 'tickets', label: 'Tickets' },
                  { key: 'metrics', label: 'Metrics' },
                  { key: 'history', label: 'History' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-white text-emerald-600 shadow-sm'
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FeatureDetail;