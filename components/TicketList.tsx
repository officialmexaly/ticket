'use client';

import React from 'react';
import { Eye, Edit, Trash2, Ticket } from 'lucide-react';
import Header from './Header';
import SearchFilters from './SearchFilters';
import StatusBadge, { defaultStatusConfigs, priorityStatusConfigs, typeStatusConfigs } from './StatusBadge';

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

interface TicketListProps {
  tickets: TicketData[];
  filteredTickets: TicketData[];
  selectedTickets: string[];
  viewMode: 'table' | 'grid';
  searchTerm: string;
  filterStatus: string;
  filterPriority: string;
  filterType: string;
  sortBy: string;
  loading: boolean;
  error: string | null;
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onRefresh: () => void;
  onCreate: () => void;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (status: string) => void;
  onPriorityFilterChange: (priority: string) => void;
  onTypeFilterChange: (type: string) => void;
  onSortChange: (sort: string) => void;
  onSelectTicket: (ticketId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onTicketClick: (ticket: TicketData) => void;
  onEditTicket: (ticket: TicketData) => void;
  onDeleteTicket: (ticketId: number) => void;
  bulkDelete: () => void;
  bulkUpdateStatus: (status: string) => void;
  bulkUpdatePriority: (priority: string) => void;
  formatDate: (date: string) => string;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  filteredTickets,
  selectedTickets,
  viewMode,
  searchTerm,
  filterStatus,
  filterPriority,
  filterType,
  sortBy,
  loading,
  error,
  onViewModeChange,
  onRefresh,
  onCreate,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onTypeFilterChange,
  onSortChange,
  onSelectTicket,
  onSelectAll,
  onTicketClick,
  onEditTicket,
  onDeleteTicket,
  bulkDelete,
  bulkUpdateStatus,
  bulkUpdatePriority,
  formatDate
}) => {
  const computedSubtitle = `${filteredTickets.length} of ${tickets.length} tickets`;

  const ErrorMessage = () => {
    if (!error) return null;

    return (
      <div className="mx-24 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
        <div>
          <p className="font-medium text-red-900">Error</p>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ErrorMessage />

      <Header
        title="Tickets"
        subtitle={computedSubtitle}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onRefresh={() => !loading && onRefresh()}
        onAction={() => {}}
        onCreate={onCreate}
        showCreateButton={true}
        createButtonText="Create Ticket"
      />

      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search by ticket ID, subject, or description..."
        filters={[
          {
            value: filterStatus,
            onChange: onStatusFilterChange,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'open', label: 'Open' },
              { value: 'replied', label: 'Replied' },
              { value: 'closed', label: 'Closed' }
            ]
          },
          {
            value: filterPriority,
            onChange: onPriorityFilterChange,
            options: [
              { value: 'all', label: 'All Priorities' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }
            ]
          },
          {
            value: filterType,
            onChange: onTypeFilterChange,
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
        onSortChange={onSortChange}
        sortOptions={[
          { value: 'id', label: 'Sort by ID' },
          { value: 'subject', label: 'Sort by Subject' },
          { value: 'priority', label: 'Sort by Priority' },
          { value: 'status', label: 'Sort by Status' },
          { value: 'type', label: 'Sort by Type' }
        ]}
      />

      {/* Bulk Actions */}
      {selectedTickets.length > 0 && (
        <div className="px-24 pb-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <span className="text-blue-800 font-medium">
              {selectedTickets.length} ticket{selectedTickets.length !== 1 ? 's' : ''} selected
            </span>
            <select
              onChange={(e) => {
                if (e.target.value === 'delete') {
                  bulkDelete();
                } else if (e.target.value.startsWith('status-')) {
                  bulkUpdateStatus(e.target.value.replace('status-', ''));
                } else if (e.target.value.startsWith('priority-')) {
                  bulkUpdatePriority(e.target.value.replace('priority-', ''));
                }
                e.target.value = '';
              }}
              className="px-4 py-2 border border-blue-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue=""
              disabled={loading}
            >
              <option value="" disabled>Bulk Actions</option>
              <optgroup label="Status">
                <option value="status-Open">Set Status: Open</option>
                <option value="status-Replied">Set Status: Replied</option>
                <option value="status-Closed">Set Status: Closed</option>
              </optgroup>
              <optgroup label="Priority">
                <option value="priority-High">Set Priority: High</option>
                <option value="priority-Medium">Set Priority: Medium</option>
                <option value="priority-Low">Set Priority: Low</option>
              </optgroup>
              <option value="delete" className="text-red-600">Delete Selected</option>
            </select>
            <button
              onClick={() => {
                onSelectAll(false);
              }}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-100 rounded-lg transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Content Views */}
      <div className="flex-1 overflow-auto bg-slate-50">
        {viewMode === 'table' ? (
          /* Table View */
          <div className="mx-24 bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 text-xs font-medium text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </div>
              <div className="col-span-1">TICKET ID</div>
              <div className="col-span-3">SUBJECT</div>
              <div className="col-span-1">STATUS</div>
              <div className="col-span-1">PRIORITY</div>
              <div className="col-span-1">TYPE</div>
              <div className="col-span-2">CREATED</div>
              <div className="col-span-2">ACTIONS</div>
            </div>

            {/* Table content */}
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No tickets found</h3>
                <p className="text-slate-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredTickets.map((ticket, index) => (
                <div
                  key={ticket.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 border-t border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer items-center ${
                    selectedTickets.includes(ticket.id.toString()) ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => onTicketClick(ticket)}
                >
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id.toString())}
                      onChange={(e) => {
                        e.stopPropagation();
                        onSelectTicket(ticket.id.toString(), e.target.checked);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                  </div>

                  <div className="col-span-1 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Ticket className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm font-mono text-slate-600">
                      #{ticket.id}
                    </div>
                  </div>

                  <div className="col-span-3 text-sm text-slate-900 font-medium truncate">
                    {ticket.subject}
                  </div>

                  <div className="col-span-1">
                    <StatusBadge
                      status={ticket.status}
                      statusConfigs={defaultStatusConfigs}
                    />
                  </div>

                  <div className="col-span-1">
                    <StatusBadge
                      status={ticket.priority}
                      statusConfigs={priorityStatusConfigs}
                    />
                  </div>

                  <div className="col-span-1">
                    <StatusBadge
                      status={ticket.type}
                      statusConfigs={typeStatusConfigs}
                    />
                  </div>

                  <div className="col-span-2 text-sm text-slate-500">
                    {formatDate(ticket.created_at)}
                  </div>

                  <div className="col-span-2 flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTicketClick(ticket);
                      }}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTicket(ticket);
                      }}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title="Edit Ticket"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this ticket?')) {
                          onDeleteTicket(ticket.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete Ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="mx-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md"
                onClick={() => onTicketClick(ticket)}
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
                          {ticket.subject}
                        </div>
                        <div className="text-xs text-slate-500">
                          #{ticket.id}
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id.toString())}
                      onChange={(e) => {
                        e.stopPropagation();
                        onSelectTicket(ticket.id.toString(), e.target.checked);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="text-sm text-slate-600 line-clamp-2">
                    {ticket.description}
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
                          onTicketClick(ticket);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTicket(ticket);
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
                            onDeleteTicket(ticket.id);
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

export default TicketList;