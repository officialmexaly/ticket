"use client"

import React, { useState, useEffect, useCallback } from 'react';
import AdminDashboard from '../../components/AdminDashboard';
import AuthGuard from '../../components/AuthGuard';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import eventBus from '@/lib/event-bus';
import { Search, Bell, Plus, Filter, MoreVertical, RefreshCw, ArrowUpDown, Columns3, ChevronDown, Reply, MessageSquare, Activity, Mail, User, Calendar, Tag, Users, ChevronLeft, Menu, X, Trash2, Edit3, Save, Loader2, Send, Mic, MicOff, Paperclip, Image, Link, Code, Quote, Play, Pause, Square, AlertCircle, Eye, Edit, Ticket, CheckCircle, Phone, FileText, HelpCircle, Settings, Shield } from 'lucide-react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import SearchFilters from '../../components/SearchFilters';
import StatusBadge, { defaultStatusConfigs, priorityStatusConfigs, typeStatusConfigs } from '../../components/StatusBadge';
import TicketCreationForm from '../../components/TicketCreationForm';
import TicketDetail from '../../components/TicketDetail';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

interface VoiceNoteData {
  id: string;
  file_url: string;
  duration: number;
  created_at: string;
}

interface TicketData {
  id: string;
  subject: string;
  description: string;
  priority: string;
  type: string;
  status: string;
  user_identifier: string;
  created_at: string;
  updated_at: string;
  voice_notes: VoiceNoteData[];
}

interface DraftData {
  id: string;
  title: string;
  subject: string | null;
  description: string | null;
  priority: string;
  type: string;
  status: string;
  user_identifier: string;
  created_at: string;
  updated_at: string;
  draft_voice_notes: VoiceNoteData[];
}

const API_BASE_URL = '/api';

const HelpdeskSystem = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [filteredTickets, setFilteredTickets] = useState<TicketData[]>([]);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'Medium',
    type: 'Question',
    status: 'Open',
    userIdentifier: ''
  });
  const [editForm, setEditForm] = useState<TicketData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640); // Changed from 768 to 640 (sm breakpoint)
      if (window.innerWidth < 640) {
        setSidebarCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Consistent theme wrapper for all views
  const ViewWrapper: React.FC<{ children: React.ReactNode; title: string; subtitle?: string }> = ({ children, title, subtitle }) => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <div className="w-9 h-9"></div> {/* Spacer */}
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header
          title={title}
          subtitle={subtitle || ''}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={() => !loading && fetchTickets()}
          onAction={() => {}}
          onCreate={() => setCurrentView('new')}
          showCreateButton={false}
        />
      </div>

      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );

  // Fetch tickets using Supabase
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          voice_notes (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched tickets:', data?.length || 0);
      setTickets(data || []);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: Partial<TicketData>) => {
    setLoading(true);
    try {
      const payload = {
        subject: ticketData.subject,
        description: ticketData.description,
        priority: ticketData.priority,
        type: ticketData.type,
        status: ticketData.status,
        userIdentifier: ticketData.user_identifier
      };

      const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData}`);
      }

      const newTicket = await response.json();

      // Force refresh from database to ensure sync
      await fetchTickets();

      setNewTicketForm({
        subject: '',
        description: '',
        priority: 'Medium',
        type: 'Question',
        status: 'Open',
        userIdentifier: ''
      });
      setCurrentView('list');
      toast.success('Ticket created successfully!');
    } catch (err) {
      console.error('Failed to create ticket:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (ticketId: string, updatedData: Partial<TicketData>) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData}`);
      }

      const updatedTicket = await response.json();

      // Force refresh from database to ensure sync
      await fetchTickets();

      // Update selected ticket if it matches
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(updatedTicket);
      }

      setEditMode(false);
      toast.success('Ticket updated successfully!');
    } catch (err) {
      console.error('Failed to update ticket:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (ticketId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData}`);
      }

      // Force refresh from database to ensure sync
      await fetchTickets();

      // Clear selection if the deleted ticket was selected
      setSelectedTickets(selectedTickets.filter(id => id !== ticketId));

      if (selectedTicket && selectedTicket.id === ticketId) {
        setCurrentView('list');
        setSelectedTicket(null);
      }
      toast.success('Ticket deleted successfully!');
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete ticket');
    } finally {
      setLoading(false);
    }
  };

  const bulkDeleteTickets = async () => {
    if (selectedTickets.length === 0) return;

    setLoading(true);
    try {
      // Delete tickets in parallel for better performance
      const deletePromises = selectedTickets.map(ticketId =>
        fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      const responses = await Promise.all(deletePromises);

      // Check if any deletions failed
      const failedDeletions = responses.filter(response => !response.ok);

      if (failedDeletions.length > 0) {
        throw new Error(`Failed to delete ${failedDeletions.length} ticket(s)`);
      }

      // Force refresh from database to ensure sync
      await fetchTickets();

      // Clear all selections
      setSelectedTickets([]);
      setSelectAll(false);

      // If currently viewing a deleted ticket, go back to list
      if (selectedTicket && selectedTickets.includes(selectedTicket.id)) {
        setCurrentView('list');
        setSelectedTicket(null);
      }

      toast.success(`Successfully deleted ${selectedTickets.length} ticket${selectedTickets.length > 1 ? 's' : ''}!`);
    } catch (err) {
      console.error('Failed to bulk delete tickets:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to bulk delete tickets');
    } finally {
      setLoading(false);
    }
  };

  // Mount detection for hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load tickets on component mount and set up real-time subscription
  useEffect(() => {
    fetchTickets();

    // Listen for immediate ticket creation events via event bus
    const unsubscribeTicketCreated = eventBus.on('ticket_created', (ticketData: any) => {
      console.log('🎯 Event bus: Ticket created event received:', ticketData);

      // Immediately add to state for instant UI update
      setTickets(prevTickets => {
        // Check if ticket already exists to avoid duplicates
        const exists = prevTickets.some(t => t.id === ticketData.id);
        if (exists) return prevTickets;
        return [ticketData, ...prevTickets];
      });

      // Show immediate notification
      toast.success(`New ticket created: "${ticketData.subject}"`);
    });

    // Subscribe to real-time changes with better error handling
    const subscription = supabase
      .channel('dashboard-updates', {
        config: {
          broadcast: { self: true },
          presence: { key: 'dashboard' }
        }
      })
      // Listen for immediate broadcast events
      .on('broadcast', { event: 'ticket_created' }, (payload) => {
        console.log('🚀 Immediate ticket creation broadcast received:', payload);
        const newTicket = payload.payload.ticket;

        // Immediately add to state for instant UI update
        setTickets(prevTickets => {
          // Check if ticket already exists to avoid duplicates
          const exists = prevTickets.some(t => t.id === newTicket.id);
          if (exists) return prevTickets;
          return [newTicket, ...prevTickets];
        });

        // Show immediate notification
        toast.success(`New ticket created: "${newTicket.subject}"`);

        // Refresh notifications
        setTimeout(() => {
          // Trigger notification refresh if notification context is available
          if ((window as any).refreshNotifications) {
            (window as any).refreshNotifications();
          }
        }, 100);
      })
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tickets' },
        (payload) => {
          console.log('🎫 New ticket created:', payload.new);
          // Immediately add the new ticket to the state for instant UI update
          const newTicket = payload.new as any;
          setTickets(prevTickets => [newTicket, ...prevTickets]);
          // Also refresh to ensure we have the complete data with relationships
          setTimeout(() => {
            fetchTickets();
          }, 500);
          // Show notification
          toast.success(`New ticket created: "${newTicket.subject}"`);
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tickets' },
        (payload) => {
          console.log('📝 Ticket updated:', payload.new);
          // Update the specific ticket in state
          const updatedTicket = payload.new;
          setTickets(prevTickets =>
            prevTickets.map(ticket =>
              ticket.id === updatedTicket.id ? updatedTicket : ticket
            )
          );
          // Refresh to get complete data
          setTimeout(() => {
            fetchTickets();
          }, 200);
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'tickets' },
        (payload) => {
          console.log('🗑️ Ticket deleted:', payload.old);
          // Remove the ticket from state immediately
          const deletedTicket = payload.old;
          setTickets(prevTickets =>
            prevTickets.filter(ticket => ticket.id !== deletedTicket.id)
          );
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'voice_notes' },
        (payload) => {
          console.log('🎤 Voice notes update:', payload);
          // Refresh tickets to get updated voice notes
          setTimeout(() => {
            fetchTickets();
          }, 200);
        }
      )
      .subscribe((status, err) => {
        console.log('📡 Subscription status:', status, err);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time updates');
          setIsRealTimeConnected(true);
          toast.success('Real-time updates connected');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to real-time updates:', err);
          setIsRealTimeConnected(false);
          toast.error('Real-time updates failed to connect');
        }
        if (status === 'CLOSED') {
          console.log('🔌 Real-time connection closed');
          setIsRealTimeConnected(false);
        }
      });

    return () => {
      console.log('🔚 Unsubscribing from real-time updates');
      subscription.unsubscribe();
      unsubscribeTicketCreated();
    };
  }, []);

  // Filter and search logic
  useEffect(() => {
    const filtered = tickets.filter(ticket => {
      const matchesSearch =
        (ticket.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id?.toString().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || (ticket.status || '').toLowerCase() === filterStatus.toLowerCase();
      const matchesPriority = filterPriority === 'all' || (ticket.priority || '').toLowerCase() === filterPriority.toLowerCase();
      const matchesType = filterType === 'all' || (ticket.type || '').toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });

    // Sort tickets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'subject':
          return (a.subject || '').localeCompare(b.subject || '');
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, filterStatus, filterPriority, filterType, sortBy]);

  // Optimized form handlers to prevent re-render focus loss
  const handleSubjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTicketForm(prev => ({ ...prev, subject: value }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewTicketForm(prev => ({ ...prev, description: value }));
  }, []);

  const handlePriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNewTicketForm(prev => ({ ...prev, priority: value }));
  }, []);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNewTicketForm(prev => ({ ...prev, type: value }));
  }, []);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNewTicketForm(prev => ({ ...prev, status: value }));
  }, []);

  const handleUserIdentifierChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTicketForm(prev => ({ ...prev, userIdentifier: value }));
  }, []);

  // Multi-select Operations
  const handleSelectTicket = (ticketId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setSelectedTickets(selectedTickets.filter(id => id !== ticketId));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedTickets(filteredTickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Test real-time connection
  const testRealTimeConnection = async () => {
    console.log('🧪 Testing real-time connection...');
    console.log('📊 Current tickets count:', tickets.length);
    console.log('🔗 Real-time connected:', isRealTimeConnected);

    // Log current Supabase connection status
    const channels = supabase.getChannels();
    console.log('📡 Active channels:', channels.length);
    channels.forEach((channel, index) => {
      console.log(`Channel ${index + 1}:`, {
        topic: channel.topic,
        state: channel.state,
        joinedAt: channel.joinedAt
      });
    });

    toast.info('Check console for real-time connection details');
  };


  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center p-12 bg-white m-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-blue-100 rounded-full"></div>
      </div>
      <h3 className="mt-4 text-lg font-medium text-slate-900">Loading Tickets</h3>
      <p className="mt-2 text-sm text-slate-500">Please wait while we fetch your tickets...</p>
    </div>
  );


  const TicketList = () => {
    const computedSubtitle = `${filteredTickets.length} of ${tickets.length} tickets`;

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Tickets"
          subtitle={`${computedSubtitle}${isRealTimeConnected ? ' • Live' : ' • Offline'}`}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={() => !loading && fetchTickets()}
          onAction={testRealTimeConnection}
          onCreate={() => setCurrentView('new')}
          onAdminClick={() => setCurrentView('admin')}
          showCreateButton={true}
          createButtonText="Create Ticket"
        />

        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by ticket ID, subject, or description..."
          filters={[
            {
              value: filterStatus,
              onChange: setFilterStatus,
              options: [
                { value: 'all', label: 'All Status' },
                { value: 'open', label: 'Open' },
                { value: 'replied', label: 'Replied' },
                { value: 'closed', label: 'Closed' }
              ]
            },
            {
              value: filterPriority,
              onChange: setFilterPriority,
              options: [
                { value: 'all', label: 'All Priorities' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' }
              ]
            },
            {
              value: filterType,
              onChange: setFilterType,
              options: [
                { value: 'all', label: 'All Types' },
                { value: 'question', label: 'Question' },
                { value: 'incident', label: 'Incident' },
                { value: 'problem', label: 'Problem' },
                { value: 'feature request', label: 'Feature Request' },
                { value: 'unspecified', label: 'Unspecified' }
              ]
            }
          ]}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOptions={[
            { value: 'created_at', label: 'Sort by Date' },
            { value: 'subject', label: 'Sort by Subject' },
            { value: 'priority', label: 'Sort by Priority' },
            { value: 'status', label: 'Sort by Status' },
            { value: 'type', label: 'Sort by Type' }
          ]}
        />

        {/* Bulk Actions Toolbar */}
        {selectedTickets.length > 0 && (
          <div className="px-8 py-4 bg-white border-t border-slate-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">
                  {selectedTickets.length} ticket{selectedTickets.length > 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => {
                    setSelectedTickets([]);
                    setSelectAll(false);
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700 underline"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${selectedTickets.length} ticket${selectedTickets.length > 1 ? 's' : ''}?`)) {
                      bulkDeleteTickets();
                    }
                  }}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Views */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
        {viewMode === 'table' ? (
          /* Table View */
          <div className="mx-8 bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/50 shadow-2xl shadow-slate-900/5 ring-1 ring-black/5">
            {/* Table header */}
            <div className="grid grid-cols-[auto_120px_1fr_120px_120px_120px_140px_120px] gap-4 px-8 py-6 bg-gradient-to-r from-slate-50/80 to-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200/60 items-center">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500/50 border-slate-300 rounded-lg shadow-sm transition-all duration-200 hover:border-blue-400"
                  />
                  {selectAll && <div className="absolute inset-0 bg-blue-600/10 rounded-lg -z-10"></div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                ID
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                SUBJECT
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                STATUS
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                PRIORITY
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                TYPE
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                CREATED
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                ACTIONS
              </div>
            </div>

            {/* Table content */}
            {loading && <LoadingSpinner />}

            {!loading && filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No tickets found</h3>
                <p className="text-slate-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              !loading && filteredTickets.map((ticket, index) => (
                <div
                  key={ticket.id}
                  className={`group grid grid-cols-[auto_120px_1fr_120px_120px_120px_140px_120px] gap-4 px-8 py-6 border-t border-slate-100/60 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/20 transition-all duration-300 cursor-pointer items-center relative overflow-hidden ${
                    selectedTickets.includes(ticket.id) ? 'bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-l-4 border-l-blue-500 shadow-lg shadow-blue-500/10' : ''
                  } hover:shadow-xl hover:shadow-slate-900/5 hover:scale-[1.01] hover:-translate-y-0.5`}
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setCurrentView('detail');
                  }}
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <div className="flex items-center justify-center relative z-10">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedTickets.includes(ticket.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectTicket(ticket.id, e.target.checked);
                        }}
                        className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500/50 border-slate-300 rounded-lg shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md"
                      />
                      {selectedTickets.includes(ticket.id) && <div className="absolute inset-0 bg-blue-600/10 rounded-lg -z-10"></div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 relative z-10">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25 ring-2 ring-white/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/30 group-hover:scale-110">
                        <Ticket className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="text-sm font-mono text-slate-600 font-semibold tracking-wide">
                      #{ticket.id.substring(0, 6).toUpperCase()}
                    </div>
                  </div>

                  <div className="relative z-10 min-w-0">
                    <div className="text-sm text-slate-900 font-semibold truncate mb-1 group-hover:text-slate-700 transition-colors">
                      {ticket.subject || 'Untitled'}
                    </div>
                    <div className="flex items-center gap-2 overflow-hidden">
                      {ticket.voice_notes && ticket.voice_notes.length > 0 && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-md flex-shrink-0">
                          <MessageSquare className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-blue-600 font-medium">{ticket.voice_notes.length}</span>
                        </div>
                      )}
                      <div className="text-xs text-slate-400 truncate">
                        {ticket.description?.replace(/<[^>]*>/g, '').substring(0, 50)}...
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <StatusBadge
                      status={ticket.status}
                      statusConfigs={defaultStatusConfigs}
                    />
                  </div>

                  <div className="relative z-10">
                    <StatusBadge
                      status={ticket.priority}
                      statusConfigs={priorityStatusConfigs}
                    />
                  </div>

                  <div className="relative z-10">
                    <StatusBadge
                      status={ticket.type}
                      statusConfigs={typeStatusConfigs}
                    />
                  </div>

                  <div className="text-sm text-slate-500 relative z-10">
                    {formatDate(ticket.created_at)}
                  </div>

                  <div className="flex items-center justify-center space-x-1 relative z-10">
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(ticket);
                          setCurrentView('detail');
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110 border border-transparent hover:border-blue-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(ticket);
                          setCurrentView('detail');
                          setEditMode(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110 border border-transparent hover:border-emerald-200"
                        title="Edit Ticket"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this ticket?')) {
                            deleteTicket(ticket.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110 border border-transparent hover:border-red-200"
                        title="Delete Ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Always visible more options button */}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      title="More Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="mx-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading && <LoadingSpinner />}
            {!loading && filteredTickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md"
                onClick={() => {
                  setSelectedTicket(ticket);
                  setCurrentView('detail');
                }}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Ticket className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">
                          {ticket.subject || 'Untitled'}
                        </div>
                        <div className="text-xs text-slate-500">
                          #{ticket.id.substring(0, 8)}
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectTicket(ticket.id, e.target.checked);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="text-sm text-slate-600 line-clamp-2">
                    {ticket.description?.replace(/<[^>]*>/g, '').substring(0, 100) || 'No description provided'}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Status</div>
                      <StatusBadge
                        status={ticket.status}
                        statusConfigs={defaultStatusConfigs}
                      />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Priority</div>
                      <StatusBadge
                        status={ticket.priority}
                        statusConfigs={priorityStatusConfigs}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 mb-1">Type</div>
                    <StatusBadge
                      status={ticket.type}
                      statusConfigs={typeStatusConfigs}
                    />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-slate-50 rounded-b-lg border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      {formatDate(ticket.created_at)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(ticket);
                          setCurrentView('detail');
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(ticket);
                          setCurrentView('detail');
                          setEditMode(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                        title="Edit Ticket"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this ticket?')) {
                            deleteTicket(ticket.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete Ticket"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="px-24 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {filteredTickets.length} of {tickets.length} tickets
              {selectedTickets.length > 0 && (
                <span className="text-blue-600 ml-2">
                  ({selectedTickets.length} selected)
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Rows per page:</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors">20</button>
                <button className="px-3 py-1 text-sm bg-slate-200 text-slate-900 rounded-md">50</button>
                <button className="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors">100</button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  };

  const NewTicket = () => {
    const handleCreateTicket = async (data: {
      subject: string;
      description: string;
      priority: string;
      type: string;
      status: string;
      userIdentifier: string;
      voiceNotes?: Array<{ blob: Blob; [key: string]: any }>;
    }) => {
      setLoading(true);
      try {
        const ticketData = {
          subject: data.subject,
          description: data.description,
          priority: data.priority,
          type: data.type,
          status: data.status,
          userIdentifier: data.userIdentifier
        };

        if (data.voiceNotes && data.voiceNotes.length > 0) {
          const formDataToSend = new FormData();

          Object.keys(ticketData).forEach(key => {
            formDataToSend.append(key, ticketData[key]);
          });

          data.voiceNotes.forEach((note: { blob: Blob }, index: number) => {
            formDataToSend.append(`voice_note_${index}`, note.blob, `voice_note_${Date.now()}_${index}.wav`);
          });

          const response = await fetch(`${API_BASE_URL}/tickets`, {
            method: 'POST',
            body: formDataToSend,
          });

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData}`);
          }

          const newTicket = await response.json();
        } else {
          const response = await fetch(`${API_BASE_URL}/tickets`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData),
          });

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData}`);
          }

          const newTicket = await response.json();
        }

        // Force refresh from database to ensure sync
        await fetchTickets();

        setCurrentView('list');
        toast.success('Ticket created successfully!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create ticket';
        toast.error(errorMessage);
        console.error('Failed to create ticket:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      setCurrentView('list');
    };

    return (
      <TicketCreationForm
        onSubmit={handleCreateTicket}
        onCancel={handleCancel}
        isLoading={loading}
        initialData={newTicketForm}
      />
    );
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  const TicketDetailView = () => {
    if (!selectedTicket) return null;

    // Convert the selectedTicket to match the TicketDetail component's interface
    const adaptedTicket = {
      id: parseInt(selectedTicket.id.substring(0, 8), 16), // Convert UUID to number for display
      uuid: selectedTicket.id,
      subject: selectedTicket.subject,
      description: selectedTicket.description,
      priority: selectedTicket.priority,
      type: selectedTicket.type,
      status: selectedTicket.status,
      user_identifier: selectedTicket.user_identifier || '',
      created_by: 1, // Default value
      created_at: selectedTicket.created_at,
      updated_at: selectedTicket.updated_at,
      voice_notes: selectedTicket.voice_notes?.map(note => ({
        id: parseInt(note.id.substring(0, 8), 16),
        uuid: note.id,
        filename: `voice_${note.id}.wav`,
        original_name: `voice_${note.id}.wav`,
        url: note.file_url,
        duration: note.duration || 60,
        size: 1024, // Default size
        timestamp: note.created_at
      })) || []
    };

    return (
      <TicketDetail
        selectedTicket={adaptedTicket}
        editMode={editMode} // Now properly uses the editMode state
        loading={loading}
        onBack={() => {
          setCurrentView('list');
          setEditMode(false);
          setSelectedTicket(null);
        }}
        onEdit={() => setEditMode(true)}
        onSave={(ticketId, data) => updateTicket(selectedTicket.id, data)}
        onDelete={(ticketId) => deleteTicket(selectedTicket.id)}
        onCancel={() => {
          setEditMode(false);
          if (selectedTicket) {
            setEditForm(selectedTicket);
          }
        }}
        formatDate={formatDate}
      />
    );
  };

  // No authentication required - application works freely

  // View Components with consistent theming
  const AdminView = () => (
    <ViewWrapper title="Admin Dashboard" subtitle="Manage users and system overview">
      <AdminDashboard />
    </ViewWrapper>
  );

  const UsersView = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          setUsers(data || []);
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <ViewWrapper title="Users" subtitle="Manage and view all system users">
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Users</p>
                  <p className="text-2xl font-bold text-slate-900">{users.filter(u => !u.is_admin && !u.is_super_admin).length}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Administrators</p>
                  <p className="text-2xl font-bold text-slate-900">{users.filter(u => u.is_admin || u.is_super_admin).length}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Users Table - Mobile Cards, Desktop Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 hover:bg-slate-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {user.full_name || 'No name'}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_admin || user.is_super_admin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.is_super_admin ? 'Super Admin' : user.is_admin ? 'Admin' : 'User'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">{user.email}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.email[0].toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{user.full_name || 'No name'}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_admin || user.is_super_admin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.is_super_admin ? 'Super Admin' : user.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ViewWrapper>
    );
  };

  const AnalyticsView = () => {
    const stats = {
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => t.status === 'Open').length,
      closedTickets: tickets.filter(t => t.status === 'Closed').length,
      highPriority: tickets.filter(t => t.priority === 'High').length,
    };

    return (
      <ViewWrapper title="Analytics" subtitle="Monitor performance and track key metrics">
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalTickets}</p>
                </div>
                <Ticket className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Open Tickets</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.openTickets}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Closed Tickets</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.closedTickets}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">High Priority</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.highPriority}</p>
                </div>
                <Activity className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Tickets by Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Open</span>
                  <span className="font-semibold">{stats.openTickets}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${stats.totalTickets ? (stats.openTickets / stats.totalTickets) * 100 : 0}%`}}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Closed</span>
                  <span className="font-semibold">{stats.closedTickets}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${stats.totalTickets ? (stats.closedTickets / stats.totalTickets) * 100 : 0}%`}}></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Priority Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">High Priority</span>
                  <span className="font-semibold">{stats.highPriority}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: `${stats.totalTickets ? (stats.highPriority / stats.totalTickets) * 100 : 0}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ViewWrapper>
    );
  };

  const KnowledgeBaseView = () => (
    <ViewWrapper title="Knowledge Base" subtitle="Find answers and learn about our system">
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Knowledge Base</h3>
        <p className="text-slate-600">Documentation and help articles coming soon</p>
      </div>
    </ViewWrapper>
  );

  const NotificationsView = () => (
    <ViewWrapper title="Notifications" subtitle="Stay updated with your latest activities">
      <div className="text-center py-12">
        <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Notifications</h3>
        <p className="text-slate-600">You&apos;re all caught up!</p>
      </div>
    </ViewWrapper>
  );

  const ReportsView = () => (
    <ViewWrapper title="Reports" subtitle="Generate and download system reports">
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Reports</h3>
        <p className="text-slate-600">Report generation features coming soon</p>
      </div>
    </ViewWrapper>
  );

  const HelpView = () => (
    <ViewWrapper title="Help Center" subtitle="Find answers, learn features, and get support">
      <div className="text-center py-12">
        <HelpCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Help Center</h3>
        <p className="text-slate-600">Help documentation coming soon</p>
      </div>
    </ViewWrapper>
  );

  const ContactView = () => (
    <ViewWrapper title="Contact Us" subtitle="Get in touch with our support team">
      <div className="text-center py-12">
        <Phone className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Contact Support</h3>
        <p className="text-slate-600">Contact form coming soon</p>
      </div>
    </ViewWrapper>
  );

  const SettingsView = () => (
    <ViewWrapper title="Settings" subtitle="Manage your account preferences and security">
      <div className="text-center py-12">
        <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Settings</h3>
        <p className="text-slate-600">Settings panel coming soon</p>
      </div>
    </ViewWrapper>
  );

  return (
    <AuthGuard>
      <div className="h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100/50 relative overflow-hidden" suppressHydrationWarning>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-500/3 to-pink-500/3 rounded-full blur-3xl"></div>
      </div>

      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        tickets={tickets}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobile={isMobile}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {currentView === 'list' && <TicketList />}
        {currentView === 'detail' && <TicketDetailView />}
        {currentView === 'new' && <NewTicket />}
        {currentView === 'admin' && <AdminView />}
        {currentView === 'users' && <UsersView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'knowledge-base' && <KnowledgeBaseView />}
        {currentView === 'notifications' && <NotificationsView />}
        {currentView === 'reports' && <ReportsView />}
        {currentView === 'help' && <HelpView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'settings' && <SettingsView />}
      </div>
      </div>
    </AuthGuard>
  );
};

export default HelpdeskSystem;