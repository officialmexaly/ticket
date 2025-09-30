'use client';

import React, { useState } from 'react';
import {
  Home,
  Ticket,
  Building2,
  Users,
  CheckSquare,
  Target,
  Calendar,
  BarChart3,
  FileText,
  Bell,
  Settings,
  Shield,
  HelpCircle,
  Phone,
  ChevronDown,
  ChevronRight,
  User,
  Briefcase,
  Clock,
  Award,
  UserPlus,
  Layers,
  Zap,
  Globe,
  CreditCard,
  Search,
  UserCheck,
  Handshake
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface ModernSidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  isMobile?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  view: string;
  badge?: string;
  children?: MenuItem[];
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  currentView,
  setCurrentView,
  isMobile = false
}) => {
  const { user, signOut } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(['main', 'hr', 'talent-hunt', 'acquisition', 'project-management']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      view: 'home'
    },
    {
      id: 'tickets',
      label: 'Ticket System',
      icon: <Ticket className="w-5 h-5" />,
      view: 'tickets',
      children: [
        { id: 'all-tickets', label: 'All Tickets', icon: <FileText className="w-4 h-4" />, view: 'list' },
        { id: 'my-tickets', label: 'My Tickets', icon: <User className="w-4 h-4" />, view: 'my-tickets' },
        { id: 'create-ticket', label: 'Create Ticket', icon: <Zap className="w-4 h-4" />, view: 'create-ticket' }
      ]
    },
    {
      id: 'project-management',
      label: 'Project Management',
      icon: <Target className="w-5 h-5" />,
      view: 'projects',
      children: [
        { id: 'professional-agile', label: 'Agile Workspace', icon: <Layers className="w-4 h-4" />, view: 'professional-agile' },
        { id: 'projects', label: 'Projects', icon: <Building2 className="w-4 h-4" />, view: 'projects' },
        { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" />, view: 'tasks' },
        { id: 'sprints', label: 'Sprints', icon: <Calendar className="w-4 h-4" />, view: 'sprints' }
      ]
    },
    {
      id: 'hr',
      label: 'HR Management',
      icon: <Users className="w-5 h-5" />,
      view: 'hr',
      children: [
        { id: 'employees', label: 'Employees', icon: <User className="w-4 h-4" />, view: 'hr-employees' },
        { id: 'departments', label: 'Departments', icon: <Building2 className="w-4 h-4" />, view: 'hr-departments' },
        { id: 'positions', label: 'Positions', icon: <Briefcase className="w-4 h-4" />, view: 'hr-positions' },
        { id: 'time-off', label: 'Time Off', icon: <Clock className="w-4 h-4" />, view: 'hr-timeoff' }
      ]
    },
    {
      id: 'talent-hunt',
      label: 'Talent Hunt',
      icon: <Search className="w-5 h-5" />,
      view: 'hr-talent-hunt',
      children: [
        { id: 'recruitment', label: 'Recruitment', icon: <UserPlus className="w-4 h-4" />, view: 'hr-recruitment' }
      ]
    },
    {
      id: 'acquisition',
      label: 'Acquisition',
      icon: <UserCheck className="w-5 h-5" />,
      view: 'hr-acquisition',
      children: [
        { id: 'performance', label: 'Performance', icon: <Award className="w-4 h-4" />, view: 'hr-performance' }
      ]
    },
    {
      id: 'outsourcing',
      label: 'Outsourcing',
      icon: <Handshake className="w-5 h-5" />,
      view: 'hr-outsourcing'
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: <BarChart3 className="w-5 h-5" />,
      view: 'analytics',
      children: [
        { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" />, view: 'analytics-dashboard' },
        { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" />, view: 'reports' },
        { id: 'insights', label: 'Insights', icon: <Zap className="w-4 h-4" />, view: 'insights' }
      ]
    },
    {
      id: 'administration',
      label: 'Administration',
      icon: <Shield className="w-5 h-5" />,
      view: 'admin',
      children: [
        { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" />, view: 'users' },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, view: 'settings' },
        { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" />, view: 'security' }
      ]
    }
  ];

  const supportItems: MenuItem[] = [
    {
      id: 'help',
      label: 'Help Center',
      icon: <HelpCircle className="w-5 h-5" />,
      view: 'help'
    },
    {
      id: 'contact',
      label: 'Contact Support',
      icon: <Phone className="w-5 h-5" />,
      view: 'contact'
    }
  ];

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const isActive = currentView === item.view;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.id);

    return (
      <div key={item.id}>
        <div
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              setCurrentView(item.view);
            }
          }}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
            ${isChild ? 'ml-6 text-sm' : 'text-sm font-medium'}
            ${isActive
              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }
          `}
        >
          <div className="flex-shrink-0">
            {item.icon}
          </div>

          {!sidebarCollapsed && (
            <>
              <span className="flex-1">{item.label}</span>

              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}

              {hasChildren && (
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Render children */}
        {hasChildren && isExpanded && !sidebarCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className={`
      bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col
      ${isMobile
        ? sidebarCollapsed ? 'w-0 -translate-x-full overflow-hidden' : 'w-64 translate-x-0 fixed inset-y-0 left-0 z-50'
        : sidebarCollapsed ? 'w-16' : 'w-64'
      }
      ${isMobile && !sidebarCollapsed ? 'md:relative md:translate-x-0' : ''}
    `}>

      {/* Header */}
      <div className={`${sidebarCollapsed ? 'p-3' : 'p-6'} border-b border-gray-200`}>
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Ticket className="text-white w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">HelpDesk Pro</h1>
              <p className="text-xs text-sidebar-foreground/70">Enterprise Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${sidebarCollapsed ? 'p-2' : 'p-4'} space-y-2 overflow-y-auto`}>
        <div className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </div>

        {/* Support Section */}
        {!sidebarCollapsed && (
          <div className="pt-6">
            <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3 px-3">
              Support
            </h3>
            <div className="space-y-1">
              {supportItems.map(item => renderMenuItem(item))}
            </div>
          </div>
        )}
      </nav>

      {/* User Profile & Settings */}
      <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} border-t border-sidebar-border`}>
        {!sidebarCollapsed ? (
          <div className="space-y-3">
            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-sidebar-foreground/70 truncate">
                  {user?.email}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('notifications')}
                className="flex-1 flex items-center justify-center gap-2 p-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="text-xs">Notifications</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-xs">Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => setCurrentView('notifications')}
              className="w-full flex items-center justify-center p-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernSidebar;