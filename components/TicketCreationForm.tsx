"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Save, Send, Mic, MicOff, Paperclip, Image, Link, Code, Quote, Play, Pause, Trash2, Square, AlertCircle, Loader2, X, Bold, Italic } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface VoiceNote {
  id: number;
  blob: Blob;
  url: string;
  duration: number;
  createdAt: Date;
}

interface FormData {
  subject: string;
  description: string;
  priority: string;
  type: string;
  status: string;
  userIdentifier: string;
}

interface Draft {
  id: number;
  title: string;
  subject: string;
  description: string;
  priority: string;
  type: string;
  status: string;
  userIdentifier: string;
  voiceNotes: VoiceNote[];
  createdAt: Date;
  updatedAt: Date;
}

interface TicketCreationFormProps {
  onSubmit: (data: FormData & { voiceNotes: VoiceNote[] }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<FormData>;
  isEditMode?: boolean;
}

const TicketCreationForm: React.FC<TicketCreationFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData = {},
  isEditMode = false
}) => {
  const [formData, setFormData] = useState<FormData>(() => ({
    subject: initialData.subject || '',
    description: initialData.description || '',
    priority: initialData.priority || 'Medium',
    type: initialData.type || 'Question',
    status: initialData.status || 'Open',
    userIdentifier: initialData.userIdentifier || ''
  }));

  const [isRecording, setIsRecording] = useState(false);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [showDraftPanel, setShowDraftPanel] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Mount detection for hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Online/Offline detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set initial online state on client side only
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Optimized form handlers to prevent re-render focus loss
  const handleSubjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, subject: value }));
  }, []);

  const handlePriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, priority: value }));
  }, []);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, type: value }));
  }, []);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, status: value }));
  }, []);

  const handleUserIdentifierChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

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

  const playVoiceNote = (noteId: number) => {
    if (currentPlayingIndex === noteId) {
      setCurrentPlayingIndex(null);
    } else {
      setCurrentPlayingIndex(noteId);
    }
  };

  const deleteVoiceNote = (noteId: number) => {
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Draft management
  const saveDraft = useCallback((title: string) => {
    if (!title.trim()) return;

    const draft: Draft = {
      id: Date.now(),
      title: title.trim(),
      subject: formData.subject,
      description: formData.description,
      priority: formData.priority,
      type: formData.type,
      status: formData.status,
      userIdentifier: formData.userIdentifier,
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

  const loadDraft = useCallback((draft: Draft) => {
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

  const deleteDraft = useCallback((draftId: number) => {
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description || formData.description === '<p></p>') return;

    try {
      await onSubmit({ ...formData, voiceNotes });

      // Reset form on successful submission
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
      showError(err instanceof Error ? err.message : 'Failed to create ticket');
      console.error('Failed to create ticket:', err);
    }
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message: string) => {
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
      <div className="min-h-screen max-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/30 overflow-y-auto">
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

      {/* Enhanced Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <div className="w-4 h-3 bg-white rounded-sm transform -skew-x-12"></div>
              </div>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <button onClick={onCancel} className="hover:text-gray-700 cursor-pointer">Support</button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <button onClick={onCancel} className="hover:text-gray-700 cursor-pointer">Tickets</button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{isEditMode ? 'Edit Ticket' : 'Create New Ticket'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-2"
                disabled={isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {drafts.length > 0 && (
                <button
                  onClick={() => setShowDraftPanel(!showDraftPanel)}
                  className="flex items-center gap-2 px-3 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative text-sm font-medium"
                  disabled={isLoading}
                >
                  <span>Drafts</span>
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{drafts.length}</span>
                </button>
              )}
            </div>
          </div>

          {showDraftPanel && drafts.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-lg z-20">
              <div className="max-w-7xl mx-auto px-8 py-6">
                <h3 className="font-medium text-slate-900 mb-4">Saved Drafts</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {drafts.map(draft => (
                    <div key={draft.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-200/50 hover:bg-slate-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">{draft.title}</h4>
                        <p className="text-sm text-slate-500 truncate">{draft.subject}</p>
                        <p className="text-xs text-slate-400">{new Date(draft.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => loadDraft(draft)}
                          className="px-3 py-1.5 text-blue-600 hover:bg-blue-100 rounded-lg text-sm transition-colors font-medium"
                          disabled={isLoading}
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteDraft(draft.id)}
                          className="px-3 py-1.5 text-red-600 hover:bg-red-100 rounded-lg text-sm transition-colors font-medium"
                          disabled={isLoading}
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
      <div className="max-w-6xl mx-auto px-6 py-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Enhanced Form Fields */}
          <div className="lg:col-span-3 space-y-6">
            {/* Form Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                    T
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{isEditMode ? 'Edit Ticket' : 'Create New Ticket'}</h1>
                    <p className="text-sm text-gray-600">Provide details about your request or issue</p>
                  </div>
                </div>
              </div>


              <form onSubmit={handleSubmit} id="ticket-form" className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={handleSubjectChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Brief description of your issue or request..."
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={handleTypeChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      disabled={isLoading}
                    >
                      <option value="Question">Question</option>
                      <option value="Incident">Incident</option>
                      <option value="Problem">Problem</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Unspecified">Unspecified</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.priority}
                      onChange={handlePriorityChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      disabled={isLoading}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={handleStatusChange}
                      className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 font-medium"
                      disabled={isLoading}
                    >
                      <option value="Open">Open</option>
                      <option value="Replied">Replied</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    User Identifier
                  </label>
                  <div className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 font-medium flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {formData.userIdentifier ? formData.userIdentifier.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <input
                      type="text"
                      value={formData.userIdentifier}
                      onChange={handleUserIdentifierChange}
                      className="flex-1 bg-transparent border-none outline-none placeholder-slate-500"
                      placeholder="Enter email, username, or user ID..."
                      disabled={isLoading}
                    />
                  </div>
                </div>

              </form>
            </div>

            {/* Description Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/5 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 border-b border-slate-200/60">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Description
                </h3>
              </div>

              <div className="p-8">
                <div className="relative">
                  <div className="border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-purple-500 transition-all duration-200 bg-white shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="border-b border-slate-200 px-4 py-2 bg-slate-50 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`p-2 rounded-md transition-colors ${
                          editor?.isActive('bold') ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100'
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
                          editor?.isActive('italic') ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100'
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
                          editor?.isActive('link') ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100'
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
                          editor?.isActive('code') ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100'
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
                          editor?.isActive('blockquote') ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100'
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
                      <div className="min-h-[200px] p-4 flex items-center justify-center text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Loading editor...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border-b border-slate-200/60">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Actions
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 border border-slate-300"
                  disabled={isLoading || (!formData.subject && (!formData.description || formData.description === '<p></p>'))}
                >
                  <Save className="w-4 h-4" />
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
                      onCancel();
                    }
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-300"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                  Discard
                </button>

                <button
                  type="submit"
                  form="ticket-form"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-lg shadow-purple-500/25"
                  disabled={!formData.subject || !formData.description || formData.description === '<p></p>' || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {isEditMode ? 'Update Ticket' : 'Create Ticket'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Voice Notes Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-b border-slate-200/60">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Voice Notes
                  {voiceNotes.length > 0 && (
                    <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-semibold">
                      {voiceNotes.length}
                    </span>
                  )}
                </h3>
              </div>
              <div className="p-6">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 mb-4 ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Record
                    </>
                  )}
                </button>

                {isRecording && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-700 text-sm font-medium">Recording...</span>
                  </div>
                )}

                {voiceNotes.length > 0 && (
                  <div className="space-y-3">
                    {voiceNotes.map((note, index) => (
                      <div key={note.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">Voice Note {index + 1}</div>
                            <div className="text-xs text-slate-500">Duration: {Math.floor(note.duration / 60)}:{(note.duration % 60).toString().padStart(2, '0')}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteVoiceNote(note.id)}
                            className="ml-auto p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete voice note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <audio controls src={note.url} className="w-full h-10 rounded-lg"></audio>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Online Status Card */}
            {isMounted && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-900/5 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-amber-50/80 to-orange-50/80 border-b border-slate-200/60">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Status
                  </h3>
                </div>
                <div className="p-6">
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${isOnline ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-slate-700">
                      {isOnline ? 'Online' : 'Offline - Will save when online'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default TicketCreationForm;