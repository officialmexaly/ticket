'use client';

import React, { useState } from 'react';
import HRSidebar from './HRSidebar';
import ProfessionalHRDashboard from './ProfessionalHRDashboard';
import HRDashboard from './HRDashboard'; // Original HR Dashboard for specific views
import { Button } from '@/components/ui/button';
import { Menu, X, Bell, Search, User, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface HRLayoutProps {
  defaultView?: string;
}

const HRLayout: React.FC<HRLayoutProps> = ({ defaultView = 'hr-dashboard' }) => {
  const [currentView, setCurrentView] = useState(defaultView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBreadcrumb = () => {
    const breadcrumbs: { [key: string]: string } = {
      'hr-dashboard': 'HR Management > Dashboard',
      'hr-employees': 'HR Management > Employee Directory',
      'hr-departments': 'HR Management > Departments',
      'hr-recruitment': 'HR Management > Recruitment',
      'hr-performance': 'HR Management > Performance',
      'hr-reviews': 'HR Management > Performance Reviews',
      'hr-goals': 'HR Management > Goals & OKRs',
      'hr-skills': 'HR Management > Skills Assessment',
      'hr-training': 'HR Management > Training',
      'hr-jobs': 'HR Management > Job Postings',
      'hr-candidates': 'HR Management > Candidates',
      'hr-interviews': 'HR Management > Interviews',
      'hr-pipeline': 'HR Management > Hiring Pipeline',
      'hr-timetracking': 'HR Management > Time Tracking',
      'hr-leave': 'HR Management > Leave Management',
      'hr-attendance': 'HR Management > Attendance',
      'hr-holidays': 'HR Management > Holiday Calendar',
      'hr-payroll-process': 'HR Management > Payroll Processing',
      'hr-compensation': 'HR Management > Compensation',
      'hr-benefits': 'HR Management > Benefits',
      'hr-analytics-dashboard': 'HR Management > Analytics Dashboard',
      'hr-workforce': 'HR Management > Workforce Analytics',
      'hr-settings': 'HR Management > Settings'
    };

    return breadcrumbs[currentView] || 'HR Management';
  };

  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      'hr-dashboard': 'HR Dashboard',
      'hr-employees': 'Employee Directory',
      'hr-departments': 'Department Management',
      'hr-recruitment': 'Recruitment Portal',
      'hr-performance': 'Performance Management',
      'hr-reviews': 'Performance Reviews',
      'hr-goals': 'Goals & OKRs',
      'hr-skills': 'Skills Assessment',
      'hr-training': 'Training & Development',
      'hr-jobs': 'Job Postings',
      'hr-candidates': 'Candidate Management',
      'hr-interviews': 'Interview Scheduling',
      'hr-pipeline': 'Hiring Pipeline',
      'hr-timetracking': 'Time Tracking',
      'hr-leave': 'Leave Management',
      'hr-attendance': 'Attendance Management',
      'hr-holidays': 'Holiday Calendar',
      'hr-payroll-process': 'Payroll Processing',
      'hr-compensation': 'Compensation Management',
      'hr-benefits': 'Benefits Administration',
      'hr-analytics-dashboard': 'HR Analytics',
      'hr-workforce': 'Workforce Analytics',
      'hr-settings': 'HR Settings'
    };

    return titles[currentView] || 'HR Management';
  };

  const renderContent = () => {
    switch (currentView) {
      case 'hr-dashboard':
        return <ProfessionalHRDashboard setCurrentView={setCurrentView} />;

      // Main HR sections that use the original comprehensive HR Dashboard
      case 'hr-employees':
      case 'hr-departments':
      case 'hr-recruitment':
      case 'hr-performance':
      case 'hr-leave':
        return <HRDashboard />;

      // Placeholder components for specific views
      default:
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{getPageTitle()}</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                  <p className="text-gray-600 mb-4">
                    This {getPageTitle()} feature is under development and will be available soon.
                  </p>
                  <Button
                    onClick={() => setCurrentView('hr-dashboard')}
                    variant="outline"
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to HR Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* HR Sidebar */}
      <div className={`
        ${isMobile
          ? sidebarCollapsed ? 'w-0 -translate-x-full overflow-hidden' : 'w-72 translate-x-0 fixed inset-y-0 left-0 z-50'
          : sidebarCollapsed ? 'w-16' : 'w-72'
        }
        transition-all duration-300
      `}>
        <HRSidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          collapsed={sidebarCollapsed && !isMobile}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header - Only show for non-dashboard views */}
        {currentView !== 'hr-dashboard' && (
          <header className="bg-white border-b border-gray-200 px-6 py-4 relative z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  >
                    {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  </Button>
                )}

                {/* Sidebar Toggle for Desktop */}
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                )}

                {/* Breadcrumb */}
                <div>
                  <nav className="text-sm text-gray-500">
                    {getBreadcrumb()}
                  </nav>
                  <h1 className="text-xl font-semibold text-gray-900 mt-1">
                    {getPageTitle()}
                  </h1>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <Button variant="ghost" size="sm">
                  <Search className="w-5 h-5" />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* User Menu */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'HR User'}
                  </span>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HRLayout;