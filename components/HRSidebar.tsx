'use client';

import React, { useState } from 'react';
import {
  Home,
  Users,
  Building2,
  UserPlus,
  Award,
  Clock,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Target,
  TrendingUp,
  DollarSign,
  BookOpen,
  Shield
} from 'lucide-react';

interface HRSidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  collapsed?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  view: string;
  children?: MenuItem[];
  badge?: string;
}

const HRSidebar: React.FC<HRSidebarProps> = ({
  currentView,
  setCurrentView,
  collapsed = false
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['hr-main', 'hr-employee']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'hr-home',
      label: 'HR Dashboard',
      icon: <Home className="w-5 h-5" />,
      view: 'hr-dashboard'
    },
    {
      id: 'hr-employee',
      label: 'Employee Management',
      icon: <Users className="w-5 h-5" />,
      view: 'hr-employee',
      children: [
        { id: 'employee-directory', label: 'Employee Directory', icon: <Users className="w-4 h-4" />, view: 'hr-employees' },
        { id: 'employee-profile', label: 'Employee Profiles', icon: <FileText className="w-4 h-4" />, view: 'hr-profiles' },
        { id: 'employee-onboarding', label: 'Onboarding', icon: <UserPlus className="w-4 h-4" />, view: 'hr-onboarding' },
        { id: 'employee-offboarding', label: 'Offboarding', icon: <Users className="w-4 h-4" />, view: 'hr-offboarding' }
      ]
    },
    {
      id: 'hr-organization',
      label: 'Organization',
      icon: <Building2 className="w-5 h-5" />,
      view: 'hr-organization',
      children: [
        { id: 'departments', label: 'Departments', icon: <Building2 className="w-4 h-4" />, view: 'hr-departments' },
        { id: 'positions', label: 'Positions', icon: <Briefcase className="w-4 h-4" />, view: 'hr-positions' },
        { id: 'org-chart', label: 'Organization Chart', icon: <Target className="w-4 h-4" />, view: 'hr-org-chart' },
        { id: 'hierarchy', label: 'Reporting Structure', icon: <TrendingUp className="w-4 h-4" />, view: 'hr-hierarchy' }
      ]
    },
    {
      id: 'hr-performance',
      label: 'Performance & Development',
      icon: <Award className="w-5 h-5" />,
      view: 'hr-performance',
      children: [
        { id: 'performance-reviews', label: 'Performance Reviews', icon: <Award className="w-4 h-4" />, view: 'hr-reviews' },
        { id: 'goal-setting', label: 'Goals & OKRs', icon: <Target className="w-4 h-4" />, view: 'hr-goals' },
        { id: 'skills-assessment', label: 'Skills Assessment', icon: <BookOpen className="w-4 h-4" />, view: 'hr-skills' },
        { id: 'training', label: 'Training & Development', icon: <BookOpen className="w-4 h-4" />, view: 'hr-training' }
      ]
    },
    {
      id: 'hr-recruitment',
      label: 'Recruitment',
      icon: <UserPlus className="w-5 h-5" />,
      view: 'hr-recruitment',
      children: [
        { id: 'job-postings', label: 'Job Postings', icon: <FileText className="w-4 h-4" />, view: 'hr-jobs' },
        { id: 'candidates', label: 'Candidates', icon: <Users className="w-4 h-4" />, view: 'hr-candidates' },
        { id: 'interviews', label: 'Interview Scheduling', icon: <Calendar className="w-4 h-4" />, view: 'hr-interviews' },
        { id: 'hiring-pipeline', label: 'Hiring Pipeline', icon: <TrendingUp className="w-4 h-4" />, view: 'hr-pipeline' }
      ]
    },
    {
      id: 'hr-time',
      label: 'Time & Attendance',
      icon: <Clock className="w-5 h-5" />,
      view: 'hr-time',
      children: [
        { id: 'time-tracking', label: 'Time Tracking', icon: <Clock className="w-4 h-4" />, view: 'hr-timetracking' },
        { id: 'leave-management', label: 'Leave Management', icon: <Calendar className="w-4 h-4" />, view: 'hr-leave' },
        { id: 'attendance', label: 'Attendance Reports', icon: <BarChart3 className="w-4 h-4" />, view: 'hr-attendance' },
        { id: 'holidays', label: 'Holiday Calendar', icon: <Calendar className="w-4 h-4" />, view: 'hr-holidays' }
      ]
    },
    {
      id: 'hr-payroll',
      label: 'Payroll & Benefits',
      icon: <DollarSign className="w-5 h-5" />,
      view: 'hr-payroll',
      children: [
        { id: 'payroll-processing', label: 'Payroll Processing', icon: <DollarSign className="w-4 h-4" />, view: 'hr-payroll-process' },
        { id: 'compensation', label: 'Compensation Management', icon: <DollarSign className="w-4 h-4" />, view: 'hr-compensation' },
        { id: 'benefits', label: 'Benefits Administration', icon: <Shield className="w-4 h-4" />, view: 'hr-benefits' },
        { id: 'tax-management', label: 'Tax Management', icon: <FileText className="w-4 h-4" />, view: 'hr-tax' }
      ]
    },
    {
      id: 'hr-analytics',
      label: 'HR Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      view: 'hr-analytics',
      children: [
        { id: 'hr-dashboard-analytics', label: 'HR Dashboard', icon: <BarChart3 className="w-4 h-4" />, view: 'hr-analytics-dashboard' },
        { id: 'workforce-analytics', label: 'Workforce Analytics', icon: <TrendingUp className="w-4 h-4" />, view: 'hr-workforce' },
        { id: 'turnover-analysis', label: 'Turnover Analysis', icon: <Users className="w-4 h-4" />, view: 'hr-turnover' },
        { id: 'performance-metrics', label: 'Performance Metrics', icon: <Award className="w-4 h-4" />, view: 'hr-metrics' }
      ]
    },
    {
      id: 'hr-settings',
      label: 'HR Settings',
      icon: <Settings className="w-5 h-5" />,
      view: 'hr-settings',
      children: [
        { id: 'hr-configuration', label: 'HR Configuration', icon: <Settings className="w-4 h-4" />, view: 'hr-config' },
        { id: 'workflow-settings', label: 'Workflow Settings', icon: <Target className="w-4 h-4" />, view: 'hr-workflow' },
        { id: 'notification-settings', label: 'Notifications', icon: <FileText className="w-4 h-4" />, view: 'hr-notifications' },
        { id: 'data-import', label: 'Data Import/Export', icon: <FileText className="w-4 h-4" />, view: 'hr-import' }
      ]
    }
  ];

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const isActive = currentView === item.view ||
                    (item.children && item.children.some(child => child.view === currentView));
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
            flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 mx-2
            ${isChild ? 'ml-8 text-sm' : 'text-sm font-medium'}
            ${isActive && !hasChildren
              ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
            ${hasChildren && isActive ? 'bg-gray-50 text-gray-900' : ''}
          `}
        >
          <div className="flex-shrink-0">
            {item.icon}
          </div>

          {!collapsed && (
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
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-72'
    } h-full`}>

      {/* Header */}
      <div className={`${collapsed ? 'p-3' : 'p-6'} border-b border-gray-200`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Users className="text-white w-5 h-5" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">HR Management</h1>
              <p className="text-xs text-gray-500">Human Resources Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? 'p-2' : 'p-4'} space-y-2 overflow-y-auto`}>
        <div className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-3 h-3 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-900">Quick Tip</span>
            </div>
            <p className="text-xs text-purple-700">
              Use employee search to quickly find team members and their information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRSidebar;