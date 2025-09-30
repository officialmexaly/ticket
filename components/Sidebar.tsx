'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Bell, Tag, Users, Calendar, Activity, MessageSquare, User, Mail, ChevronLeft, Ticket, Settings, Shield, BarChart3, FileText, HelpCircle, Phone, LogOut, FolderKanban, CheckSquare, Target, Layers, UserCheck, Handshake } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface SidebarProps {
  sidebarCollapsed?: boolean;
  setSidebarCollapsed?: (collapsed: boolean) => void;
  tickets?: any[];
  currentView?: string;
  setCurrentView?: (view: string) => void;
  isMobile?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  tickets = [],
  currentView = '',
  setCurrentView = () => {},
  isMobile = false,
  collapsed,
  onToggle
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isCollapsed = collapsed ?? sidebarCollapsed ?? false;
  const toggleSidebar = onToggle ?? setSidebarCollapsed ?? (() => {});
  const { user, signOut } = useAuth();


  const handleLogout = async () => {
    await signOut();
  };
  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      isMobile
        ? isCollapsed ? 'w-0 -translate-x-full overflow-hidden' : 'w-64 translate-x-0 fixed inset-y-0 left-0 z-50'
        : isCollapsed ? 'w-16' : 'w-72'
    } relative flex flex-col h-screen shadow-sm ${isMobile && !isCollapsed ? 'md:relative md:translate-x-0' : ''}`}>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => toggleSidebar(!isCollapsed)}
        />
      )}

      {/* Header Section - Hide completely on mobile when collapsed */}
      <div className={`${isMobile && isCollapsed ? 'hidden' : ''} ${isCollapsed ? 'p-2' : 'p-4 md:p-6'} border-b border-sidebar-border`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Ticket className="text-white w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">HelpDesk Pro</h1>
              <p className="text-sm text-sidebar-foreground/70">Ticket Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Section - Hide on mobile when collapsed */}
      <nav className={`${isMobile && isCollapsed ? 'hidden' : 'flex-1'} ${isCollapsed ? 'p-2' : 'p-2 md:p-4'} ${isCollapsed ? 'space-y-2' : 'space-y-1'} ${isCollapsed ? '' : 'overflow-y-auto'}`}>
        {/* Primary Navigation */}
        <div className={isCollapsed ? 'space-y-2' : 'space-y-1'}>
          {/* Dashboard */}
          <div
            onClick={() => setCurrentView('list')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'list'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Tag className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">Tickets</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  currentView === 'list'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>{tickets?.length || 0}</span>
              </div>
            )}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Tickets
              </div>
            )}
          </div>

          {/* Projects */}
          <div
            onClick={() => setCurrentView('projects')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'projects'
                ? 'text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <FolderKanban className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Projects</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Projects
              </div>
            )}
          </div>

          {/* Professional Agile */}
          <div
            onClick={() => setCurrentView('professional-agile')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'professional-agile'
                ? 'text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Target className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Professional Agile</span>
                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full font-semibold">NEW</span>
              </div>
            )}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Professional Agile
              </div>
            )}
          </div>

          {/* Tasks */}
          <div
            onClick={() => setCurrentView('tasks')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'tasks'
                ? 'text-white bg-gradient-to-r from-orange-600 to-red-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <CheckSquare className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Tasks</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Tasks
              </div>
            )}
          </div>

          {/* HR Management */}
          <div
            onClick={() => setCurrentView('hr')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'hr'
                ? 'text-white bg-gradient-to-r from-rose-600 to-pink-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <span className="font-medium">HR Management</span>
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold">NEW</span>
              </div>
            )}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                HR Management
              </div>
            )}
          </div>

          {/* Talent Hunt */}
          <div
            onClick={() => setCurrentView('hr-talent-hunt')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'hr-talent-hunt'
                ? 'text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Search className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Talent Hunt</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Talent Hunt
              </div>
            )}
          </div>

          {/* Acquisition */}
          <div
            onClick={() => setCurrentView('hr-acquisition')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'hr-acquisition'
                ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <UserCheck className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Acquisition</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Acquisition
              </div>
            )}
          </div>

          {/* Outsourcing */}
          <div
            onClick={() => setCurrentView('hr-outsourcing')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'hr-outsourcing'
                ? 'text-white bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Handshake className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Outsourcing</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Outsourcing
              </div>
            )}
          </div>

          {/* Interview Recruitment */}
          <Link href="/recruitment" className="block">
            <div
              className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
                pathname === '/recruitment'
                  ? 'text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Target className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Interview Recruitment</span>
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-2 py-1 rounded-full font-semibold">NEW</span>
                </div>
              )}
              {isCollapsed && (
                <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                  Interview Recruitment
                </div>
              )}
            </div>
          </Link>

          {/* Users */}
          <div
            onClick={() => setCurrentView('users')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'users'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Users</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Users
              </div>
            )}
          </div>

          {/* Analytics */}
          <div
            onClick={() => setCurrentView('analytics')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'analytics'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <BarChart3 className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Analytics</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Analytics
              </div>
            )}
          </div>

          {/* Knowledge Base */}
          <div
            onClick={() => setCurrentView('knowledge-base')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'knowledge-base'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Knowledge Base</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Knowledge Base
              </div>
            )}
          </div>

          {/* Notifications */}
          <div
            onClick={() => setCurrentView('notifications')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'notifications'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Bell className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">Notifications</span>
                <span className={`text-xs w-5 h-5 rounded-full flex items-center justify-center ${
                  currentView === 'notifications'
                    ? 'bg-white/20 text-white'
                    : 'bg-red-500 text-white'
                }`}>3</span>
              </div>
            )}
            {isCollapsed && (
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
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'reports'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Activity className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Reports</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Reports
              </div>
            )}
          </div>
        </div>

        {/* Admin Section - Now accessible to everyone */}
        {!isCollapsed && (
          <div className="pt-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Administration</h3>
          </div>
        )}
        <div className={isCollapsed ? 'space-y-2' : 'space-y-1'}>
          <div
            onClick={() => setCurrentView('admin')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'admin'
                ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Shield className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Admin Dashboard</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Admin Dashboard
              </div>
            )}
          </div>
        </div>

        {/* Support Section */}
        {!isCollapsed && (
          <div className="pt-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Support</h3>
          </div>
        )}

        <div className={isCollapsed ? 'space-y-2' : 'space-y-1'}>
          {/* Help Center */}
          <div
            onClick={() => setCurrentView('help')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'help'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Help Center</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Help Center
              </div>
            )}
          </div>

          {/* Contact */}
          <div
            onClick={() => setCurrentView('contact')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'contact'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Phone className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Contact</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Contact
              </div>
            )}
          </div>

          {/* Settings */}
          <div
            onClick={() => setCurrentView('settings')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 md:p-3'} rounded-xl cursor-pointer group relative transition-all duration-200 ${
              currentView === 'settings'
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
            {isCollapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                Settings
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Footer Section - Collapse Button */}
      {!(isMobile && isCollapsed) && (
        <button
          onClick={() => toggleSidebar(!isCollapsed)}
          className="w-full flex items-center justify-center p-3 hover:bg-slate-100 rounded-xl transition-all duration-200 group relative"
        >
          {isCollapsed ? (
            <ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          )}
          {isCollapsed && (
            <div className="absolute left-16 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
              Expand Menu
            </div>
          )}
          {!isCollapsed && (
            <span className="ml-2 text-sm text-slate-500">Collapse Menu</span>
          )}
        </button>
      )}
      <div className={`${isMobile && isCollapsed ? 'hidden' : ''} ${isCollapsed ? 'p-2' : 'p-2 md:p-4'} border-t border-slate-200`}>
        {/* User Info and Logout */}
        {!isCollapsed ? (
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