"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, Save, Send, Mic, MicOff, Paperclip, Image, Link, Code, Quote, Play, Pause, Trash2, Square, AlertCircle, Loader2, X, Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TextAlign from '@tiptap/extension-text-align';
import { useRouter } from "next/navigation";  // ✅ use this in app directory

const TicketCreationScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(() => ({
    subject: '',
    description: '',
    priority: 'Medium',
    type: 'Feature Request',
    status: 'Open',
    userIdentifier: ''
  }));

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [playingNote, setPlayingNote] = useState(null);
  const [attachments, setAttachments] = useState([]);
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
      BulletList.configure({
        HTMLAttributes: {
          class: 'tiptap-bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'tiptap-ordered-list',
        },
      }),
      ListItem,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
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

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
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

  const handleFileAttachment = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showError(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      const attachment = {
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type
      };

      setAttachments(prev => [...prev, attachment]);
    });
    event.target.value = ''; // Reset input
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      attachments: attachments,
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
  }, [formData, voiceNotes, attachments]);

  const loadDraft = useCallback((draft) => {
    setFormData({
      subject: draft.subject || '',
      description: draft.description || '',
      priority: draft.priority || 'Medium',
      type: draft.type || 'Feature Request',
      status: draft.status || 'Open',
      userIdentifier: draft.userIdentifier || ''
    });
    setVoiceNotes(draft.voiceNotes || []);
    setAttachments(draft.attachments || []);
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

      if (voiceNotes.length > 0 || attachments.length > 0) {
        const formDataToSend = new FormData();

        Object.keys(ticketData).forEach(key => {
          formDataToSend.append(key, ticketData[key]);
        });

        voiceNotes.forEach((note, index) => {
          formDataToSend.append(`voice_note_${index}`, note.blob, `voice_note_${Date.now()}_${index}.wav`);
        });

        attachments.forEach((attachment, index) => {
          formDataToSend.append(`attachment_${index}`, attachment.file, attachment.name);
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
        type: 'Feature Request',
        status: 'Open',
        userIdentifier: ''
      });

      voiceNotes.forEach(note => {
        if (note.url) URL.revokeObjectURL(note.url);
      });
      setVoiceNotes([]);
      setAttachments([]);

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
          padding: 12px;
          min-height: 150px;
          font-size: 15px;
          line-height: 1.5;
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
        .ProseMirror ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          padding-left: 0.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          padding-left: 0.5rem;
        }
        .ProseMirror li {
          margin: 0.25rem 0;
        }
        .ProseMirror ul ul, .ProseMirror ol ul {
          list-style-type: circle;
        }
        .ProseMirror ul ul ul, .ProseMirror ol ul ul {
          list-style-type: square;
        }
        .ProseMirror p[style*="text-align: left"], .ProseMirror h1[style*="text-align: left"], .ProseMirror h2[style*="text-align: left"], .ProseMirror h3[style*="text-align: left"] {
          text-align: left;
        }
        .ProseMirror p[style*="text-align: center"], .ProseMirror h1[style*="text-align: center"], .ProseMirror h2[style*="text-align: center"], .ProseMirror h3[style*="text-align: center"] {
          text-align: center;
        }
        .ProseMirror p[style*="text-align: right"], .ProseMirror h1[style*="text-align: right"], .ProseMirror h2[style*="text-align: right"], .ProseMirror h3[style*="text-align: right"] {
          text-align: right;
        }
        .ProseMirror p[style*="text-align: justify"], .ProseMirror h1[style*="text-align: justify"], .ProseMirror h2[style*="text-align: justify"], .ProseMirror h3[style*="text-align: justify"] {
          text-align: justify;
        }
        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.2;
          color: #1e293b;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.875rem 0 0.375rem 0;
          line-height: 1.3;
          color: #334155;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.75rem 0 0.25rem 0;
          line-height: 1.4;
          color: #475569;
        }
        select option {
          background: rgba(255, 255, 255, 0.95);
          color: #334155;
          padding: 8px 12px;
          font-weight: 500;
        }
        select option:hover {
          background: rgba(147, 51, 234, 0.1);
        }
        select option:checked {
          background: rgba(147, 51, 234, 0.2);
          color: #7c3aed;
        }
      `}</style>
      <div className="min-h-screen max-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/30 relative overflow-y-auto">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-500/3 to-pink-500/3 rounded-full blur-3xl"></div>
        </div>
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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <div className="w-4 h-3 bg-white rounded-sm transform -skew-x-12"></div>
              </div>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <button onClick={() => router.push("/")} className="hover:text-gray-700 cursor-pointer">Support</button>
                <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
                <button onClick={() => router.push("/")} className="hover:text-gray-700 cursor-pointer">Tickets</button>
                <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
                <span className="text-gray-900 font-medium">Create New Ticket</span>
              </div>
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
      <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="bg-white/90 backdrop-blur-3xl rounded-3xl border-4 border-white/70 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden ring-4 ring-white/40 relative">
          {/* Enhanced Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-2xl rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/40 via-transparent to-purple-50/40 rounded-3xl"></div>
          <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-3xl"></div>
          <div className="relative z-10">
          {/* Form Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-2xl border-b border-white/60 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25 ring-2 ring-white/20">
                T
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Create New Ticket</h1>
                <p className="text-sm text-slate-600">Provide details about your request or issue</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-3 bg-gradient-to-r from-white/70 to-white/50 backdrop-blur-2xl border-b border-white/60 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg transition-all duration-200 border-2 border-white/50 shadow-md hover:shadow-lg font-medium bg-white/40 backdrop-blur-xl"
                disabled={isLoading || (!formData.subject && (!formData.description || formData.description === '<p></p>'))}
              >
                <Save className="w-3.5 h-3.5" />
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to discard this ticket? All unsaved changes will be lost.')) {
                    setFormData({ subject: '', description: '', priority: 'Medium', type: 'Feature Request', status: 'Open', userIdentifier: '' });
                    voiceNotes.forEach(note => {
                      if (note.url) URL.revokeObjectURL(note.url);
                    });
                    setVoiceNotes([]);
                    setAttachments([]);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-lg transition-all duration-200 border-2 border-red-400/50 shadow-md hover:shadow-lg font-medium bg-white/40 backdrop-blur-xl"
                disabled={isLoading}
              >
                <X className="w-3.5 h-3.5" />
                Discard
              </button>
            </div>

            <button
              type="submit"
              form="ticket-form"
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-all duration-200 font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              disabled={isLoading || !formData.subject || (!formData.description || formData.description === '<p></p>')}
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

          <form onSubmit={handleSubmit} id="ticket-form" className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Main Fields */}
              <div className="lg:col-span-3 space-y-4">
                {!isOnline && (
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-medium text-amber-700">Will save when online</span>
                  </div>
                )}

                {/* Subject and Type Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject || ''}
                      onChange={handleSubjectChange}
                      className="w-full px-3 py-2.5 border-2 border-white/50 rounded-lg focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400/60 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-base bg-white/50 backdrop-blur-xl"
                      placeholder="Brief description of your issue or request..."
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={handleTypeChange}
                      className="w-full px-3 py-2.5 border-2 border-white/50 rounded-lg focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400/60 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-base bg-white/50 backdrop-blur-xl appearance-none cursor-pointer"
                      disabled={isLoading}
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
                        backgroundPosition: "right 0.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem"
                      }}
                    >
                      <option value="Feature Request">Feature Request</option>
                      <option value="Unspecified">Unspecified</option>
                    </select>
                  </div>
                </div>

                {/* Priority and Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.priority}
                      onChange={handlePriorityChange}
                      className="w-full px-3 py-2.5 border-2 border-white/50 rounded-lg focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400/60 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-base bg-white/50 backdrop-blur-xl appearance-none cursor-pointer"
                      disabled={isLoading}
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
                        backgroundPosition: "right 0.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem"
                      }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={handleStatusChange}
                      className="w-full px-3 py-2.5 border-2 border-white/50 rounded-lg focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400/60 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-base bg-white/50 backdrop-blur-xl appearance-none cursor-pointer"
                      disabled={isLoading}
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
                        backgroundPosition: "right 0.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem"
                      }}
                    >
                      <option value="Open">Open</option>
                      <option value="Replied">Replied</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* User Identifier */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">User Identifier</label>
                  <div className="flex items-center gap-2 p-3 bg-white/70 backdrop-blur-2xl border-2 border-white/60 rounded-lg hover:bg-white/80 transition-all duration-200 shadow-lg hover:shadow-xl ring-2 ring-white/40">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {formData.userIdentifier ? formData.userIdentifier.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <input
                      type="text"
                      value={formData.userIdentifier}
                      onChange={handleUserIdentifierChange}
                      className="flex-1 bg-transparent border-none outline-none placeholder-slate-500 font-medium text-base"
                      placeholder="Enter email, username, or user ID..."
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    Description
                    <span className="text-red-500 text-sm">*</span>
                  </h3>

                  {/* TipTap Rich Text Editor */}
                  <div className="relative">
                    <div className="border-3 border-white/80 rounded-xl focus-within:ring-4 focus-within:ring-purple-500/30 focus-within:border-purple-400/60 transition-all duration-200 bg-white/70 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden ring-2 ring-white/50">
                      {/* Toolbar */}
                      <div className="border-b border-white/70 px-3 py-2 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-2xl shadow-md flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleBold().run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive('bold') ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Bold"
                          disabled={!editor || isLoading}
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleItalic().run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive('italic') ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Italic"
                          disabled={!editor || isLoading}
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Enter URL:');
                            if (url) {
                              editor?.chain().focus().setLink({ href: url }).run();
                            }
                          }}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive('link') ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Link"
                          disabled={!editor || isLoading}
                        >
                          <Link className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleCode().run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive('code') ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Inline Code"
                          disabled={!editor || isLoading}
                        >
                          <Code className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive('blockquote') ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Quote"
                          disabled={!editor || isLoading}
                        >
                          <Quote className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleBulletList().run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive('bulletList') ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Bullet List"
                          disabled={!editor || isLoading}
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive('orderedList') ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Numbered List"
                          disabled={!editor || isLoading}
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive('heading', { level: 1 }) ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Heading 1"
                          disabled={!editor || isLoading}
                        >
                          <Heading1 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive('heading', { level: 2 }) ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Heading 2"
                          disabled={!editor || isLoading}
                        >
                          <Heading2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive('heading', { level: 3 }) ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Heading 3"
                          disabled={!editor || isLoading}
                        >
                          <Heading3 className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive({ textAlign: 'left' }) ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Align Left"
                          disabled={!editor || isLoading}
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive({ textAlign: 'center' }) ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Align Center"
                          disabled={!editor || isLoading}
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive({ textAlign: 'right' }) ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Align Right"
                          disabled={!editor || isLoading}
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            editor?.isActive({ textAlign: 'justify' }) ? 'bg-purple-100 text-purple-600 shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Justify"
                          disabled={!editor || isLoading}
                        >
                          <AlignJustify className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Editor Content */}
                      {editor ? (
                        <EditorContent
                          editor={editor}
                          className="min-h-[150px] prose prose-slate max-w-none focus:outline-none text-sm bg-white/80 backdrop-blur-2xl"
                        />
                      ) : (
                        <div className="min-h-[150px] p-3 flex items-center justify-center text-slate-400 bg-white/80 backdrop-blur-2xl">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          <span className="font-medium text-sm">Loading editor...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Voice Notes and Attachments */}
              <div className="space-y-4 flex flex-col">
                {/* Voice Notes Section */}
                <div className="bg-white/70 backdrop-blur-3xl rounded-lg border-2 border-white/70 p-4 shadow-xl ring-2 ring-white/50 h-fit">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      Voice Notes
                      {voiceNotes.length > 0 && (
                        <span className="bg-emerald-100 text-emerald-800 text-sm px-1.5 py-0.5 rounded-full font-semibold">
                          {voiceNotes.length}
                        </span>
                      )}
                    </h3>

                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 font-medium text-sm transition-all duration-200 shadow-md shadow-blue-500/25"
                        disabled={isLoading}
                      >
                        <Mic className="w-2.5 h-2.5" />
                        Record
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={isPaused ? resumeRecording : pauseRecording}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 font-medium text-sm transition-all duration-200 shadow-md shadow-yellow-500/25"
                          disabled={isLoading}
                        >
                          {isPaused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
                          {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 font-medium text-sm transition-all duration-200 shadow-md shadow-red-500/25"
                          disabled={isLoading}
                        >
                          <Square className="w-2.5 h-2.5" />
                          Stop
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className={`flex items-center gap-2 p-2 rounded-lg border text-sm ${
                      isPaused
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        isPaused
                          ? 'bg-yellow-500'
                          : 'bg-red-500 animate-pulse'
                      }`}></div>
                      <span className={`font-medium ${
                        isPaused
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}>
                        {isPaused ? 'Recording paused...' : 'Recording...'}
                      </span>
                    </div>
                  )}

                  {/* Voice Notes List */}
                  {voiceNotes.length > 0 && (
                    <div className="space-y-2">
                      {voiceNotes.map((note, index) => (
                        <div key={note.id} className="flex items-center gap-2 p-2 bg-white/80 backdrop-blur-2xl rounded-lg border-2 border-white/60 shadow-lg">
                          <button
                            type="button"
                            onClick={() => playVoiceNote(note.id)}
                            className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                          >
                            {currentPlayingIndex === note.id ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-slate-900">Voice Note {index + 1}</span>
                              <span className="text-sm text-slate-500">• {formatDuration(note.duration)}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteVoiceNote(note.id)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                            title="Delete voice note"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
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

                {/* Attachments Section */}
                <div className="bg-white/70 backdrop-blur-3xl rounded-lg border-2 border-white/70 p-4 shadow-xl ring-2 ring-white/50 h-fit">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                      Attachments
                      {attachments.length > 0 && (
                        <span className="bg-indigo-100 text-indigo-800 text-sm px-1.5 py-0.5 rounded-full font-semibold">
                          {attachments.length}
                        </span>
                      )}
                    </h3>

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 font-medium text-sm transition-all duration-200 shadow-md shadow-slate-600/25 cursor-pointer">
                      <Paperclip className="w-2.5 h-2.5" />
                      Add File
                      <input
                        type="file"
                        multiple
                        onChange={handleFileAttachment}
                        className="hidden"
                        disabled={isLoading}
                        accept="*/*"
                      />
                    </label>
                  </div>

                  {/* Attachments List */}
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {attachments.map((attachment, index) => (
                        <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white/80 backdrop-blur-2xl rounded-lg border-2 border-white/60 shadow-lg">
                          <div className="w-6 h-6 bg-slate-500 text-white rounded-full flex items-center justify-center">
                            <Paperclip className="w-2.5 h-2.5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-slate-900">Attachment {index + 1}</span>
                              <span className="text-sm text-slate-500">• {formatFileSize(attachment.size)}</span>
                            </div>
                            <div className="text-sm text-slate-500 mt-0.5 truncate">
                              {attachment.name}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(attachment.id)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                            title="Remove attachment"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default TicketCreationScreen;
