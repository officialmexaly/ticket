'use client';

import React, { useState } from 'react';
import { Ticket, List, RefreshCw, MoreHorizontal, Plus, Grid } from 'lucide-react';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  title: string;
  subtitle: string;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onRefresh?: () => void;
  onAction?: () => void;
  onCreate?: () => void;
  showCreateButton?: boolean;
  createButtonText?: string;
  onAdminClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  viewMode,
  onViewModeChange,
  onRefresh,
  onAction,
  onCreate,
  showCreateButton = true,
  createButtonText = "New ticket",
  onAdminClick
}) => {
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  return (
    <div className="px-8 py-6 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25 ring-1 ring-white/20">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
              <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <NotificationBell />
            </div>

            <button
              onClick={onRefresh}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-transparent hover:border-slate-200"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onAction}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-transparent hover:border-slate-200"
              title="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>


          {/* Create Button */}
          {showCreateButton && (
            <button
              onClick={onCreate}
              className="group relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 overflow-hidden z-10"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300 relative z-20" />
              <span className="relative z-20">{createButtonText}</span>

              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none z-10"></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;