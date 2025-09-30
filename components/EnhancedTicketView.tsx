'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Trash2
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface EnhancedTicketViewProps {
  setCurrentView: (view: string) => void;
}

const EnhancedTicketView: React.FC<EnhancedTicketViewProps> = ({ setCurrentView }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tickets = [
    {
      id: 'TKT-001',
      title: 'Login Issues with Mobile App',
      description: 'Users are experiencing login failures on iOS devices',
      status: 'open',
      priority: 'high',
      assignee: 'John Doe',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      category: 'Technical',
      comments: 3,
      attachments: 1
    },
    {
      id: 'TKT-002',
      title: 'Feature Request: Dark Mode',
      description: 'Request to add dark mode theme to the application',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Jane Smith',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-16',
      category: 'Feature Request',
      comments: 7,
      attachments: 0
    },
    {
      id: 'TKT-003',
      title: 'Database Performance Issues',
      description: 'Slow query performance affecting user experience',
      status: 'urgent',
      priority: 'critical',
      assignee: 'Mike Johnson',
      createdAt: '2024-01-16',
      updatedAt: '2024-01-16',
      category: 'Performance',
      comments: 2,
      attachments: 3
    },
    {
      id: 'TKT-004',
      title: 'Email Notification Bug',
      description: 'Users not receiving email notifications for updates',
      status: 'resolved',
      priority: 'medium',
      assignee: 'Sarah Wilson',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      category: 'Bug',
      comments: 5,
      attachments: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filters = [
    { id: 'all', label: 'All Tickets', count: tickets.length },
    { id: 'open', label: 'Open', count: tickets.filter(t => t.status === 'open').length },
    { id: 'in-progress', label: 'In Progress', count: tickets.filter(t => t.status === 'in-progress').length },
    { id: 'urgent', label: 'Urgent', count: tickets.filter(t => t.status === 'urgent').length },
    { id: 'resolved', label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length }
  ];

  const filteredTickets = selectedFilter === 'all'
    ? tickets
    : tickets.filter(ticket => ticket.status === selectedFilter);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ticket Management</h1>
            <p className="text-muted-foreground mt-1">Manage and track all support tickets</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setCurrentView('create-ticket')}
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
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter.id)}
              className="whitespace-nowrap"
            >
              {filter.label}
              <Badge variant="secondary" className="ml-2">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="flex gap-2 sm:ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground transition-colors duration-200"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 hover:scale-[1.02] dark:border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground mb-1">
                    {ticket.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">{ticket.id}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.replace('-', ' ')}
                </Badge>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {ticket.description}
              </p>

              {/* Assignee and Date */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{ticket.assignee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{ticket.comments}</span>
                  </div>
                  {ticket.attachments > 0 && (
                    <div className="flex items-center gap-1">
                      <Paperclip className="w-4 h-4" />
                      <span>{ticket.attachments}</span>
                    </div>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {ticket.category}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No tickets found</h3>
          <p className="text-muted-foreground mb-4">
            {selectedFilter === 'all'
              ? "Get started by creating your first ticket"
              : `No tickets with status "${selectedFilter}"`}
          </p>
          <Button
            onClick={() => setCurrentView('create-ticket')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Ticket
          </Button>
        </div>
      )}
      </div>
    </div>
  );
};

export default EnhancedTicketView;