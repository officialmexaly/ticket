"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, Save, Send, Mic, MicOff, Paperclip, Image, Link, Code, Quote, Play, Pause, Trash2, Square, AlertCircle, Loader2, X, Bold, Italic } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useRouter } from "next/navigation";  // ✅ use this in app directory

const TicketCreationScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(() => ({
    subject: '',
    description: '',
    priority: 'Medium',
    type: 'Question',
    status: 'Open',
    userIdentifier: ''
  }));

  const [isRecording, setIsRecording] = useState(false);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [playingNote, setPlayingNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [showDraftPanel, setShowDraftPanel] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRefs = useRef({});
  const streamRef = useRef(null);

  // Use Next.js API routes instead of external API
  const API_BASE_URL = '/api';

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Optimized form handlers to prevent re-render focus loss
  const handleSubjectChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, subject: value }));
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, description: value }));
  }, []);

  const handlePriorityChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, priority: value }));
  }, []);

  const handleTypeChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, type: value }));
  }, []);

  const handleStatusChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, status: value }));
  }, []);

  const handleUserIdentifierChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, userIdentifier: value }));
  }, []);

  // TipTap Editor Setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Please provide detailed information about your issue or request. Include relevant context, steps to reproduce (if applicable), and any error messages you\'ve encountered...',
      }),
    ],
    content: formData.description,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData(prev => ({ ...prev, description: html }));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  // Update editor content when formData.description changes externally
  useEffect(() => {
    if (editor && formData.description !== editor.getHTML()) {
      editor.commands.setContent(formData.description);
    }
  }, [formData.description, editor]);

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = Math.floor(Math.random() * 60) + 10;

        setVoiceNotes(prev => [...prev, {
          id: Date.now(),
          blob: audioBlob,
          url: audioUrl,
          duration: duration,
          createdAt: new Date()
        }]);

        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = recorder;
      streamRef.current = stream;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      showError('Could not access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playVoiceNote = (noteId) => {
    if (currentPlayingIndex === noteId) {
      setCurrentPlayingIndex(null);
    } else {
      setCurrentPlayingIndex(noteId);
    }
  };

  const deleteVoiceNote = (noteId) => {
    setVoiceNotes(prev => {
      const note = prev.find(n => n.id === noteId);
      if (note && note.url) {
        URL.revokeObjectURL(note.url);
      }
      return prev.filter(n => n.id !== noteId);
    });

    if (currentPlayingIndex === noteId) {
      setCurrentPlayingIndex(null);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Draft management
  const saveDraft = useCallback((title) => {
    if (!title.trim()) return;

    const draft = {
      id: Date.now(),
      title: title.trim(),
      subject: formData.subject,
      description: formData.description,
      priority: formData.priority,
      type: formData.type,
      status: formData.status,
      voiceNotes: voiceNotes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setDrafts(prev => [...prev, draft]);

    try {
      const existingDrafts = JSON.parse(localStorage.getItem('ticketDrafts') || '[]');
      const updatedDrafts = [...existingDrafts, draft];
      localStorage.setItem('ticketDrafts', JSON.stringify(updatedDrafts));
      showSuccess('Draft saved successfully');
    } catch (e) {
      console.error('Failed to save draft to localStorage:', e);
      showError('Failed to save draft');
    }
  }, [formData, voiceNotes]);

  const loadDraft = useCallback((draft) => {
    setFormData({
      subject: draft.subject || '',
      description: draft.description || '',
      priority: draft.priority || 'Medium',
      type: draft.type || 'Question',
      status: draft.status || 'Open',
      userIdentifier: draft.userIdentifier || ''
    });
    setVoiceNotes(draft.voiceNotes || []);
    setShowDraftPanel(false);
    showSuccess('Draft loaded');
  }, []);

  const deleteDraft = useCallback((draftId) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));

    try {
      const existingDrafts = JSON.parse(localStorage.getItem('ticketDrafts') || '[]');
      const updatedDrafts = existingDrafts.filter(d => d.id !== draftId);
      localStorage.setItem('ticketDrafts', JSON.stringify(updatedDrafts));
      showSuccess('Draft deleted');
    } catch (e) {
      console.error('Failed to delete draft from localStorage:', e);
    }
  }, []);

  // Load drafts on mount
  useEffect(() => {
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('ticketDrafts') || '[]');
      setDrafts(savedDrafts);
    } catch (e) {
      console.error('Failed to load drafts from localStorage:', e);
    }
  }, []);

  const handleSaveDraft = () => {
    // Auto-generate draft title based on subject or timestamp
    const title = formData.subject ?
      `Draft: ${formData.subject.substring(0, 30)}${formData.subject.length > 30 ? '...' : ''}` :
      `Draft - ${new Date().toLocaleString()}`;

    saveDraft(title);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description || formData.description === '<p></p>') return;

    try {
      setIsLoading(true);
      const ticketData = { ...formData };

      if (voiceNotes.length > 0) {
        const formDataToSend = new FormData();

        Object.keys(ticketData).forEach(key => {
          formDataToSend.append(key, ticketData[key]);
        });

        voiceNotes.forEach((note, index) => {
          formDataToSend.append(`voice_note_${index}`, note.blob, `voice_note_${Date.now()}_${index}.wav`);
        });

        const response = await fetch(`${API_BASE_URL}/tickets/`, {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        showSuccess('Ticket created successfully!');
      } else {
        const response = await fetch(`${API_BASE_URL}/tickets/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticketData),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        showSuccess('Ticket created successfully!');
      }

      // Reset form
      setFormData({
        subject: '',
        description: '',
        priority: 'Medium',
        type: 'Question',
        status: 'Open',
        userIdentifier: ''
      });

      voiceNotes.forEach(note => {
        if (note.url) URL.revokeObjectURL(note.url);
      });
      setVoiceNotes([]);

    } catch (err) {
      showError(err.message || 'Failed to create ticket');
      console.error('Failed to create ticket:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <>
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          padding: 16px;
          min-height: 200px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #6b7280;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror strong {
          font-weight: bold;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.875rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
          color: #4b5563;
        }
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
        .ProseMirror a:hover {
          color: #1d4ed8;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
    <button
      onClick={() => router.push("/")}
      className="text-gray-600 hover:text-gray-800 transition-colors"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
              <nav className="flex items-center text-sm text-gray-600">
                <span>Tickets</span>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">Create New Ticket</span>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {isOnline ? 'Online' : 'Offline'}
              </div>

              {drafts.length > 0 && (
                <button
                  onClick={() => setShowDraftPanel(!showDraftPanel)}
                  className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <span className="text-sm">Drafts</span>
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{drafts.length}</span>
                </button>
              )}
            </div>
          </div>

          {showDraftPanel && drafts.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
              <div className="max-w-4xl mx-auto px-6 py-4">
                <h3 className="font-medium text-gray-900 mb-3">Saved Drafts</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {drafts.map(draft => (
                    <div key={draft.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{draft.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{draft.subject}</p>
                        <p className="text-xs text-gray-400">{new Date(draft.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => loadDraft(draft)}
                          className="px-3 py-1 text-blue-600 hover:bg-blue-100 rounded text-sm transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteDraft(draft.id)}
                          className="px-3 py-1 text-red-600 hover:bg-red-100 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                T
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
                <p className="text-gray-600">Provide details about your request or issue</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Action Buttons - Moved to Top */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 bg-gray-50 -m-6 mb-4 p-6 rounded-t-xl">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                  disabled={isLoading || (!formData.subject && (!formData.description || formData.description === '<p></p>'))}
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to discard this ticket? All unsaved changes will be lost.')) {
                      setFormData({ subject: '', description: '', priority: 'Medium', type: 'Question', status: 'Open', userIdentifier: '' });
                      voiceNotes.forEach(note => {
                        if (note.url) URL.revokeObjectURL(note.url);
                      });
                      setVoiceNotes([]);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-300"
                  disabled={isLoading}
                >
                  <X className="w-3.5 h-3.5" />
                  Discard
                </button>
              </div>

              <div className="flex items-center gap-3">
                {!isOnline && (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Will save when online</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-md"
                  disabled={!formData.subject || !formData.description || formData.description === '<p></p>' || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Create Ticket
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.subject || ''}
                onChange={handleSubjectChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                placeholder="Brief description of your issue or request..."
                required
                disabled={isLoading}
                key="subject-input"
              />
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={handlePriorityChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={handleTypeChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="Question">❓ Question</option>
                  <option value="Incident">🚨 Incident</option>
                  <option value="Problem">🔧 Problem</option>
                  <option value="Feature Request">💡 Feature Request</option>
                  <option value="Unspecified">📝 Unspecified</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={handleStatusChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="Open">🔓 Open</option>
                  <option value="Replied">💬 Replied</option>
                  <option value="Closed">🔒 Closed</option>
                </select>
              </div>
            </div>

            {/* Voice Notes Section - Moved Before Description */}
            <div className="space-y-2 border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  🎙️ Voice Notes
                  {voiceNotes.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {voiceNotes.length}
                    </span>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-3 h-3" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3" />
                      Record
                    </>
                  )}
                </button>
              </div>

              {isRecording && (
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-700 text-sm font-medium">Recording...</span>
                </div>
              )}

              {voiceNotes.length > 0 && (
                <div className="space-y-2">
                  {voiceNotes.map((note, index) => (
                    <div key={note.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <button
                        type="button"
                        onClick={() => playVoiceNote(note.id)}
                        className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        {currentPlayingIndex === note.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">Voice Note {index + 1}</span>
                          <span className="text-xs text-gray-500">• {formatDuration(note.duration)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteVoiceNote(note.id)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                        title="Delete voice note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <audio
                        src={note.url}
                        className="hidden"
                        onEnded={() => setCurrentPlayingIndex(null)}
                        ref={(audio) => {
                          if (currentPlayingIndex === note.id && audio) {
                            audio.play();
                          } else if (audio) {
                            audio.pause();
                            audio.currentTime = 0;
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>

              {/* User Identifier Field */}
              <div className="space-y-2 mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  User (Email, Username, or ID)
                </label>
                <input
                  type="text"
                  value={formData.userIdentifier || ''}
                  onChange={handleUserIdentifierChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter email, username, nickname, or user ID..."
                  disabled={isLoading}
                  key="user-identifier-input"
                />
              </div>

              {/* TipTap Rich Text Editor */}
              <div className="relative">
                <div className="border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 bg-white shadow-sm overflow-hidden">
                  {/* Toolbar */}
                  <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`p-2 rounded-md transition-colors ${
                        editor?.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      title="Bold"
                      disabled={!editor || isLoading}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`p-2 rounded-md transition-colors ${
                        editor?.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      title="Italic"
                      disabled={!editor || isLoading}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Enter URL:');
                        if (url) {
                          editor?.chain().focus().setLink({ href: url }).run();
                        }
                      }}
                      className={`p-2 rounded-md transition-colors ${
                        editor?.isActive('link') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      title="Link"
                      disabled={!editor || isLoading}
                    >
                      <Link className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleCode().run()}
                      className={`p-2 rounded-md transition-colors ${
                        editor?.isActive('code') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      title="Inline Code"
                      disabled={!editor || isLoading}
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                      className={`p-2 rounded-md transition-colors ${
                        editor?.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      title="Quote"
                      disabled={!editor || isLoading}
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Editor Content */}
                  {editor ? (
                    <EditorContent
                      editor={editor}
                      className="min-h-[200px] prose prose-sm max-w-none"
                    />
                  ) : (
                    <div className="min-h-[200px] p-4 flex items-center justify-center text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Loading editor...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
};

export default TicketCreationScreen;