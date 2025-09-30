'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Ticket,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MessageSquare,
  Paperclip,
  Star,
  Eye,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import toast from 'react-hot-toast';

interface TicketData {
  id?: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  type: 'bug' | 'feature' | 'question' | 'incident';
  user_identifier: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
}

interface TicketCRUDProps {
  setCurrentView: (view: string) => void;
}

const TicketCRUD: React.FC<TicketCRUDProps> = ({ setCurrentView }) => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Form data
  const [formData, setFormData] = useState<TicketData>({
    subject: '',
    description: '',
    priority: 'medium',
    status: 'open',
    type: 'question',
    user_identifier: ''
  });

  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

  // Priority and status configurations
  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
  ];

  const statusOptions = [
    { value: 'open', label: 'Open', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' }
  ];

  const typeOptions = [
    { value: 'bug', label: 'Bug', icon: AlertTriangle },
    { value: 'feature', label: 'Feature', icon: Star },
    { value: 'question', label: 'Question', icon: MessageSquare },
    { value: 'incident', label: 'Incident', icon: Clock }
  ];

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tickets');
      if (!response.ok) throw new Error('Failed to fetch tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  // Create ticket
  const createTicket = async () => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create ticket');

      const newTicket = await response.json();
      setTickets(prev => [newTicket, ...prev]);
      setShowCreateModal(false);
      resetForm();
      toast.success('Ticket created successfully!');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket');
    }
  };

  // Update ticket
  const updateTicket = async () => {
    if (!selectedTicket?.id) return;

    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update ticket');

      const updatedTicket = await response.json();
      setTickets(prev => prev.map(ticket =>
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      setShowEditModal(false);
      resetForm();
      toast.success('Ticket updated successfully!');
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  // Delete ticket
  const deleteTicket = async () => {
    if (!selectedTicket?.id) return;

    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete ticket');

      setTickets(prev => prev.filter(ticket => ticket.id !== selectedTicket.id));
      setShowDeleteModal(false);
      setSelectedTicket(null);
      toast.success('Ticket deleted successfully!');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket');
    }
  };

  // Helper functions
  const resetForm = () => {
    setFormData({
      subject: '',
      description: '',
      priority: 'medium',
      status: 'open',
      type: 'question',
      user_identifier: ''
    });
    setSelectedTicket(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setFormData({
      subject: ticket.subject,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      type: ticket.type,
      user_identifier: ticket.user_identifier,
      assigned_to: ticket.assigned_to || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setShowViewModal(true);
  };

  const openDeleteModal = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setShowDeleteModal(true);
  };

  const getPriorityColor = (priority: string) => {
    return priorityOptions.find(p => p.value === priority)?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const typeOption = typeOptions.find(t => t.value === type);
    return typeOption ? typeOption.icon : MessageSquare;
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || ticket.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ticket Management</h1>
            <p className="text-muted-foreground mt-1">Create, manage, and track support tickets</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="whitespace-nowrap"
              >
                {filter === 'all' ? 'All' : filter.replace('_', ' ').replace(/^./, str => str.toUpperCase())}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Tickets Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => {
              const TypeIcon = getTypeIcon(ticket.type);
              return (
                <Card key={ticket.id} className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 hover:scale-[1.02] dark:border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
                          {ticket.subject}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">#{ticket.id}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <TypeIcon className="w-3 h-3" />
                            {ticket.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {ticket.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{ticket.user_identifier}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(ticket.created_at || '').toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewModal(ticket)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(ticket)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteModal(ticket)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No tickets found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedFilter === 'all'
                ? "Get started by creating your first ticket"
                : `No tickets with status "${selectedFilter}"`}
            </p>
            <Button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Ticket
            </Button>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Dialog open={showCreateModal || showEditModal} onOpenChange={(open) => {
          if (!open) {
            setShowCreateModal(false);
            setShowEditModal(false);
            resetForm();
          }
        }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {showCreateModal ? 'Create New Ticket' : 'Edit Ticket'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Subject *
                  </label>
                  <Input
                    placeholder="Enter ticket subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Priority *
                  </label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Type *
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {showEditModal && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Status *
                    </label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    User Identifier *
                  </label>
                  <Input
                    placeholder="Enter user email or ID"
                    value={formData.user_identifier}
                    onChange={(e) => setFormData(prev => ({ ...prev, user_identifier: e.target.value }))}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description *
                  </label>
                  <Textarea
                    placeholder="Describe the issue or request in detail"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={showCreateModal ? createTicket : updateTicket}
                disabled={!formData.subject || !formData.description || !formData.user_identifier}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {showCreateModal ? 'Create Ticket' : 'Update Ticket'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ticket Details</DialogTitle>
            </DialogHeader>

            {selectedTicket && (
              <div className="space-y-4 py-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {selectedTicket.subject}
                  </h3>
                  <p className="text-sm text-muted-foreground">#{selectedTicket.id}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {selectedTicket.type}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {selectedTicket.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Created By
                    </label>
                    <p className="text-sm text-muted-foreground">{selectedTicket.user_identifier}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Created Date
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedTicket.created_at || '').toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              {selectedTicket && (
                <Button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedTicket);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Ticket
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Ticket</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-foreground">
                Are you sure you want to delete this ticket?
              </p>
              {selectedTicket && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="font-medium text-foreground">{selectedTicket.subject}</p>
                  <p className="text-sm text-muted-foreground">#{selectedTicket.id}</p>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-3">
                This action cannot be undone.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={deleteTicket}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TicketCRUD;