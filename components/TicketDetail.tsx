'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, Edit3, Save, X, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface VoiceNoteData {
  id: number;
  uuid: string;
  filename: string;
  original_name: string;
  url: string;
  duration: number;
  size: number;
  timestamp: string;
}

interface TicketData {
  id: number;
  uuid: string;
  subject: string;
  description: string;
  priority: string;
  type: string;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  voice_notes: VoiceNoteData[];
}

interface TicketDetailProps {
  selectedTicket: TicketData;
  editMode: boolean;
  loading: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: (ticketId: number, data: Partial<TicketData>) => void;
  onDelete: (ticketId: number) => void;
  onCancel: () => void;
  formatDate: (date: string) => string;
}

const TicketDetail: React.FC<TicketDetailProps> = ({
  selectedTicket,
  editMode,
  loading,
  onBack,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  formatDate
}) => {
  const [editForm, setEditForm] = useState(selectedTicket || {});
  const [activeTab, setActiveTab] = useState('details');

  // Update editForm when selectedTicket changes
  useEffect(() => {
    if (selectedTicket) {
      setEditForm(selectedTicket);
    }
  }, [selectedTicket]);

  const handleSave = async () => {
    if (selectedTicket && editForm) {
      try {
        await onSave(selectedTicket.id, {
          subject: editForm.subject,
          description: editForm.description,
          priority: editForm.priority,
          type: editForm.type,
          status: editForm.status,
          user_identifier: editForm.user_identifier
        });
      } catch (error) {
        console.error('Error saving ticket:', error);
      }
    }
  };

  // Optimized edit form handlers
  const handleEditSubjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, subject: value }));
  }, []);

  const handleEditDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, description: value }));
  }, []);

  const handleEditPriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, priority: value }));
  }, []);

  const handleEditTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, type: value }));
  }, []);

  const handleEditStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditForm(prev => ({ ...prev, status: value }));
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderDetailsContent();
      case 'activity':
        return renderActivityContent();
      case 'attachments':
        return renderAttachmentsContent();
      case 'voice-notes':
        return renderVoiceNotesContent();
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
      {/* Left Column - Enhanced Form Fields */}
      <div className="lg:col-span-2 space-y-8">
        {/* Primary Details Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Ticket Details
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Subject <span className="text-red-500">*</span>
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.subject || ''}
                    onChange={handleEditSubjectChange}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  />
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium">
                    {selectedTicket.subject || 'No subject'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Type <span className="text-red-500">*</span>
                </label>
                {editMode ? (
                  <select
                    value={editForm.type || ''}
                    onChange={handleEditTypeChange}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <option value="Question">Question</option>
                    <option value="Incident">Incident</option>
                    <option value="Problem">Problem</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Unspecified">Unspecified</option>
                  </select>
                ) : (
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      selectedTicket.type === 'incident' ? 'bg-red-500' :
                      selectedTicket.type === 'problem' ? 'bg-orange-500' :
                      selectedTicket.type === 'feature request' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}></span>
                    {selectedTicket.type?.charAt(0).toUpperCase() + selectedTicket.type?.slice(1) || 'Unspecified'}
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
                  </select>
                ) : (
                  <div className={`w-full px-4 py-3.5 rounded-xl text-slate-900 font-medium flex items-center gap-2 border ${
                    selectedTicket.priority === 'high' ? 'bg-red-50 border-red-200 text-red-800' :
                    selectedTicket.priority === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-green-50 border-green-200 text-green-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      selectedTicket.priority === 'high' ? 'bg-red-500' :
                      selectedTicket.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></span>
                    {selectedTicket.priority?.charAt(0).toUpperCase() + selectedTicket.priority?.slice(1) || 'Medium'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Status
                </label>
                {editMode ? (
                  <select
                    value={editForm.status || ''}
                    onChange={handleEditStatusChange}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <option value="Open">Open</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                ) : (
                  <div className={`w-full px-4 py-3.5 rounded-xl font-medium flex items-center gap-2 border ${
                    selectedTicket.status === 'open' ? 'bg-red-50 border-red-200 text-red-800' :
                    selectedTicket.status === 'replied' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                    'bg-gray-50 border-gray-200 text-gray-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      selectedTicket.status === 'open' ? 'bg-red-500' :
                      selectedTicket.status === 'replied' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}></div>
                    {selectedTicket.status?.charAt(0).toUpperCase() + selectedTicket.status?.slice(1) || 'Open'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                User Identifier
              </label>
              {editMode ? (
                <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {editForm.user_identifier ? editForm.user_identifier.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <input
                    type="text"
                    value={editForm.user_identifier || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, user_identifier: e.target.value }))}
                    className="flex-1 bg-transparent border-none outline-none placeholder-slate-500"
                    placeholder="Enter email, username, or user ID..."
                    disabled={loading}
                  />
                </div>
              ) : (
                <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {selectedTicket.user_identifier ? selectedTicket.user_identifier.charAt(0).toUpperCase() : 'A'}
                  </div>
                  {selectedTicket.user_identifier || 'Anonymous User'}
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
                <div
                  className="text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: selectedTicket.description || '<p class="text-slate-500 italic">No description provided</p>'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Enhanced Sidebar */}
      <div className="space-y-6">
        {/* Ticket Information Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Ticket Information
            </h3>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Created:</span>
              <span className="text-slate-900 font-medium">{formatDate(selectedTicket.created_at)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Updated:</span>
              <span className="text-slate-900 font-medium">{formatDate(selectedTicket.updated_at)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Ticket ID:</span>
              <span className="font-mono text-slate-900 font-medium">#{String(selectedTicket.id).substring(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Voice Notes Section */}
        {selectedTicket.voice_notes && selectedTicket.voice_notes.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-b border-slate-200/60">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Voice Notes
                <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-semibold">
                  {selectedTicket.voice_notes.length}
                </span>
              </h3>
            </div>
            <div className="p-6 space-y-3">
              {selectedTicket.voice_notes.map((note, index) => (
                <div key={note.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">Voice Note {index + 1}</div>
                      <div className="text-xs text-slate-500">Duration: {Math.floor(note.duration / 60)}:{(note.duration % 60).toString().padStart(2, '0')}</div>
                    </div>
                  </div>
                  <audio controls src={note.url} className="w-full h-10 rounded-lg"></audio>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Status Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-900/5 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-amber-50/80 to-orange-50/80 border-b border-slate-200/60">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Quick Status
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className={`flex items-center gap-3 p-3 rounded-xl ${selectedTicket.status === 'closed' ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200'}`}>
              <div className={`w-4 h-4 rounded-full ${selectedTicket.status === 'closed' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
              <span className="text-sm font-medium text-slate-700">Ticket Closed</span>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-xl ${selectedTicket.priority === 'high' ? 'bg-red-50 border border-red-200' : 'bg-slate-50 border border-slate-200'}`}>
              <div className={`w-4 h-4 rounded-full ${selectedTicket.priority === 'high' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
              <span className="text-sm font-medium text-slate-700">High Priority</span>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-xl ${selectedTicket.voice_notes && selectedTicket.voice_notes.length > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-200'}`}>
              <div className={`w-4 h-4 rounded-full ${selectedTicket.voice_notes && selectedTicket.voice_notes.length > 0 ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
              <span className="text-sm font-medium text-slate-700">Has Voice Notes</span>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-xl ${!!selectedTicket.user_identifier ? 'bg-purple-50 border border-purple-200' : 'bg-slate-50 border border-slate-200'}`}>
              <div className={`w-4 h-4 rounded-full ${!!selectedTicket.user_identifier ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
              <span className="text-sm font-medium text-slate-700">User Identified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Activity Timeline
        </h3>
      </div>
      <div className="p-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 text-green-600">✓</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900">Ticket created</div>
              <div className="text-sm text-slate-500 mt-1">{formatDate(selectedTicket.created_at)}</div>
            </div>
          </div>

          {selectedTicket.updated_at !== selectedTicket.created_at && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Edit3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900">Ticket updated</div>
                <div className="text-sm text-slate-500 mt-1">{formatDate(selectedTicket.updated_at)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAttachmentsContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          Attachments
        </h3>
      </div>
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <div className="text-2xl">📎</div>
        </div>
        <p className="text-slate-500">No attachments found for this ticket.</p>
      </div>
    </div>
  );

  const renderVoiceNotesContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          Voice Notes
        </h3>
      </div>
      <div className="p-8">
        {selectedTicket.voice_notes && selectedTicket.voice_notes.length > 0 ? (
          <div className="space-y-4">
            {selectedTicket.voice_notes.map((note, index) => (
              <div key={note.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Voice Note {index + 1}</div>
                    <div className="text-sm text-slate-500">Duration: {Math.floor(note.duration / 60)}:{(note.duration % 60).toString().padStart(2, '0')}</div>
                  </div>
                </div>
                <audio controls src={note.url} className="w-full h-12 rounded-xl"></audio>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl">🎙️</div>
            </div>
            <p className="text-slate-500">No voice notes found for this ticket.</p>
          </div>
        )}
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
        <p className="text-slate-500">No change history available for this ticket.</p>
      </div>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Ticket Settings
        </h3>
      </div>
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <div className="text-2xl">⚙️</div>
        </div>
        <p className="text-slate-500">Ticket settings and preferences will be available here.</p>
      </div>
    </div>
  );

  if (!selectedTicket) {
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
                <div className="w-4 h-3 bg-white rounded-sm"></div>
              </div>
              <div className="flex items-center text-sm text-slate-500 space-x-2">
                <span className="hover:text-slate-700 cursor-pointer">Support</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="hover:text-slate-700 cursor-pointer">Tickets</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900 font-medium">#{String(selectedTicket.id).substring(0, 8).toUpperCase()}</span>
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
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 text-sm font-medium transition-all duration-200">
                    Actions
                  </button>
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
                <div className="p-2 bg-slate-100 rounded-lg">
                  <div className="w-5 h-5 text-slate-600">📋</div>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">#{String(selectedTicket.id).substring(0, 8).toUpperCase()}</h1>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTicket.status === 'open' ? 'bg-red-100 text-red-800' :
                      selectedTicket.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        selectedTicket.status === 'open' ? 'bg-red-500' :
                        selectedTicket.status === 'replied' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`}></div>
                      {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                    </div>
                  </div>
                  <p className="text-slate-600">{selectedTicket.subject}</p>
                </div>
              </div>

              <div className="text-right text-sm text-slate-500">
                <div className="mb-1">Created {formatDate(selectedTicket.created_at)}</div>
                <div>Updated {formatDate(selectedTicket.updated_at)}</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6">
              <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'details'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'activity'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  Activity
                </button>
                <button
                  onClick={() => setActiveTab('attachments')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'attachments'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  Attachments
                </button>
                <button
                  onClick={() => setActiveTab('voice-notes')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'voice-notes'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  Voice Notes
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'history'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  History
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'settings'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Tab-Based Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
        {renderTabContent()}

        {/* Enhanced Response Section - Only show on Details tab */}
        {activeTab === 'details' && (
          <div className="mt-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-b border-slate-200/60">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Add Response
                </h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50/30">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <div className="text-white text-xl">📄</div>
                  </div>
                  <p className="text-slate-600 font-medium mb-2">Drop files here or click to upload</p>
                  <p className="text-slate-500 text-sm">Ctrl+Enter to add response quickly</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Response Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium resize-none"
                    placeholder="Type your response to the ticket here..."
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>🔖 Use templates</span>
                    <span>⚡ Quick replies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-all duration-200">
                      Save Draft
                    </button>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200">
                      Send Response
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;