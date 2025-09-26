'use client';

import React, { useState } from 'react';
import { Search, Bell, Tag, Users, Calendar, Activity, MessageSquare, User, Mail, ChevronLeft, Ticket, Settings, Shield, BarChart3, FileText, HelpCircle, Phone, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  tickets: any[];
  currentView: string;
  setCurrentView: (view: string) => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarCollapsed, setSidebarCollapsed, tickets, currentView, setCurrentView, isMobile = false }) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };
  return (
    <div className={`bg-white border-r border-slate-200 transition-all duration-300 ${
      isMobile
        ? sidebarCollapsed ? 'w-0 -translate-x-full overflow-hidden' : 'w-64 translate-x-0 fixed inset-y-0 left-0 z-50'
        : sidebarCollapsed ? 'w-16' : 'w-72'
    } relative flex flex-col h-screen shadow-sm ${isMobile && !sidebarCollapsed ? 'md:relative md:translate-x-0' : ''}`}>
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Header Section - Hide completely on mobile when collapsed */}
      <div className={`${isMobile && sidebarCollapsed ? 'hidden' : ''} ${sidebarCollapsed ? 'p-2' : 'p-4 md:p-6'} border-b border-slate-200`}>
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Ticket className="text-white w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-900">HelpDesk Pro</h1>
              <p className="text-sm text-slate-500">Ticket Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Section - Hide on mobile when collapsed */}
      <nav className={`${isMobile && sidebarCollapsed ? 'hidden' : 'flex-1'} ${sidebarCollapsed ? 'p-2' : 'p-2 md:p-4'} ${sidebarCollapsed ? 'space-y-2' : 'space-y-1'} ${sidebarCollapsed ? '' : 'overflow-y-auto'}`}>
        {/* Primary Navigation */}
        <div className={sidebarCollapsed ? 'space-y-2' : 'space-y-1'}>
          {/* Dashboard */}
          <div
            onClick={() => setCurrentView('list')}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'list'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">Tickets</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  currentView === 'list'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>{tickets.length}</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Tickets
              </div>
            )}
          </div>

          {/* Users */}
          <div
            onClick={() => setCurrentView('users')}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'users'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Users</span>}
            {sidebarCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Users
              </div>
            )}
          </div>

          {/* Analytics */}
          <div
            onClick={() => setCurrentView('analytics')}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'analytics'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Analytics</span>}
            {sidebarCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Analytics
              </div>
            )}
          </div>

          {/* Knowledge Base */}
          <div
            onClick={() => setCurrentView('knowledge-base')}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'knowledge-base'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Knowledge Base</span>}
            {sidebarCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Knowledge Base
              </div>
            )}
          </div>

          {/* Notifications */}
          <div
            onClick={() => setCurrentView('notifications')}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'notifications'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">Notifications</span>
                <span className={`text-xs w-5 h-5 rounded-full flex items-center justify-center ${
                  currentView === 'notifications'
                    ? 'bg-white/20 text-white'
                    : 'bg-red-500 text-white'
                }`}>3</span>
              </div>
            )}
            {sidebarCollapsed && (
              <>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
                <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                  Notifications
                </div>
              </>
            )}
          </div>

          {/* Reports */}
          <div
            onClick={() => setCurrentView('reports')}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'reports'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Reports</span>}
            {sidebarCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Reports
              </div>
            )}
          </div>
        </div>

        {/* Admin Section - Now accessible to everyone */}
        {!sidebarCollapsed && (
          <div className="pt-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Administration</h3>
          </div>
        )}
        <div className={sidebarCollapsed ? 'space-y-2' : 'space-y-1'}>
          <div
            onClick={() => setCurrentView('admin')}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'admin'
                ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Admin Dashboard</span>}
            {sidebarCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Admin Dashboard
              </div>
            )}
          </div>
        </div>

        {/* Support Section */}
        {!sidebarCollapsed && (
          <div className="pt-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Support</h3>
          </div>
        )}

        <div className={sidebarCollapsed ? 'space-y-2' : 'space-y-1'}>
          {/* Help Center */}
          <div
            onClick={() => setCurrentView('help')}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'help'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Help Center</span>}
            {sidebarCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Help Center
              </div>
            )}
          </div>

          {/* Contact */}
          <div
            onClick={() => setCurrentView('contact')}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'contact'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Phone className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Contact</span>}
            {sidebarCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Contact
              </div>
            )}
          </div>

          {/* Settings */}
          <div
            onClick={() => setCurrentView('settings')}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'settings'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Settings</span>}
            {sidebarCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Settings
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Footer Section - Collapse Button */}
      {!(isMobile && sidebarCollapsed) && (
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center justify-center p-3 hover:bg-slate-100 rounded-xl transition-all duration-200 group relative"
        >
          {sidebarCollapsed ? (
            <ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          )}
          {sidebarCollapsed && (
            <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
              Expand Menu
            </div>
          )}
          {!sidebarCollapsed && (
            <span className="ml-2 text-sm text-slate-500">Collapse Menu</span>
          )}
        </button>
      )}
      <div className={`${isMobile && sidebarCollapsed ? 'hidden' : ''} ${sidebarCollapsed ? 'p-2' : 'p-2 md:p-4'} border-t border-slate-200`}>
        {/* User Info and Logout */}
        {!sidebarCollapsed ? (
          <div className="space-y-3">
            {/* User Profile */}
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {user?.email}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        ) : (
          /* Collapsed state - just logout icon */
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
            <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
              Sign Out
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;