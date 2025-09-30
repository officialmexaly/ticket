'use client';

import React, { useState, useEffect } from 'react';
import DraggableSidebar from './DraggableSidebar';
import ModernHomeDashboard from './ModernHomeDashboard';
import EnhancedDashboardPage from './EnhancedDashboardPage';
import ProfessionalHRInterface from './ProfessionalHRInterface';
import TicketCRUD from './TicketCRUD';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, X, Bell, Search, User, Edit3, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

// Import existing components
import AdminDashboard from './AdminDashboard';
import HRDashboard from './HRDashboard';

interface ModernLayoutProps {
  children?: React.ReactNode;
}

const ModernLayout: React.FC<ModernLayoutProps> = () => {
  const [currentView, setCurrentView] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications] = useState(3);
  const [sidebarEditMode, setSidebarEditMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
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
      'home': 'Home',
      'list': 'Tickets > All Tickets',
      'my-tickets': 'Tickets > My Tickets',
      'create-ticket': 'Tickets > Create Ticket',
      'professional-agile': 'Project Management > Agile Workspace',
      'projects': 'Project Management > Projects',
      'tasks': 'Project Management > Tasks',
      'sprints': 'Project Management > Sprints',
      'hr': 'HR Management > Overview',
      'hr-employees': 'HR Management > Employees',
      'hr-departments': 'HR Management > Departments',
      'hr-positions': 'HR Management > Positions',
      'hr-recruitment': 'HR Management > Recruitment',
      'hr-talent-hunt': 'HR Management > Talent Hunt',
      'hr-acquisition': 'HR Management > Acquisition',
      'hr-outsourcing': 'HR Management > Outsourcing',
      'hr-performance': 'HR Management > Performance',
      'hr-timeoff': 'HR Management > Time Off',
      'hr-analytics': 'HR Management > Analytics',
      'analytics-dashboard': 'Analytics > Dashboard',
      'reports': 'Analytics > Reports',
      'insights': 'Analytics > Insights',
      'users': 'Administration > Users',
      'settings': 'Administration > Settings',
      'security': 'Administration > Security',
      'help': 'Support > Help Center',
      'contact': 'Support > Contact'
    };

    return breadcrumbs[currentView] || 'Home';
  };

  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      'home': 'Dashboard Overview',
      'list': 'All Tickets',
      'my-tickets': 'My Tickets',
      'create-ticket': 'Create New Ticket',
      'professional-agile': 'Agile Workspace',
      'projects': 'Projects',
      'tasks': 'Tasks',
      'sprints': 'Sprints',
      'hr': 'HR Management',
      'hr-employees': 'Employee Management',
      'hr-departments': 'Department Management',
      'hr-positions': 'Position Management',
      'hr-recruitment': 'Recruitment Pipeline',
      'hr-talent-hunt': 'Talent Hunt',
      'hr-acquisition': 'Talent Acquisition',
      'hr-outsourcing': 'Outsourcing Management',
      'hr-performance': 'Performance Management',
      'hr-timeoff': 'Time Off Management',
      'hr-analytics': 'HR Analytics',
      'analytics-dashboard': 'Analytics Dashboard',
      'reports': 'Reports & Analytics',
      'insights': 'Business Insights',
      'users': 'User Management',
      'settings': 'System Settings',
      'security': 'Security Settings',
      'help': 'Help Center',
      'contact': 'Contact Support'
    };

    return titles[currentView] || 'Dashboard';
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <ModernHomeDashboard setCurrentView={setCurrentView} />;

      case 'professional-agile':
        return <EnhancedDashboardPage />;

      case 'hr':
        return <HRDashboard setCurrentView={setCurrentView} />;
      case 'hr-employees':
        return <ProfessionalHRInterface key="employees" setCurrentView={setCurrentView} defaultTab="employees" />;
      case 'hr-departments':
        return <ProfessionalHRInterface key="departments" setCurrentView={setCurrentView} defaultTab="departments" />;
      case 'hr-positions':
        return <ProfessionalHRInterface key="positions" setCurrentView={setCurrentView} defaultTab="positions" />;
      case 'hr-talent-hunt':
        return <ProfessionalHRInterface key="talent-hunt" setCurrentView={setCurrentView} defaultTab="talent-hunt" />;
      case 'hr-recruitment':
        return <ProfessionalHRInterface key="recruitment" setCurrentView={setCurrentView} defaultTab="recruitment" />;
      case 'hr-acquisition':
        return <ProfessionalHRInterface key="acquisition" setCurrentView={setCurrentView} defaultTab="acquisition" />;
      case 'hr-outsourcing':
        return <ProfessionalHRInterface key="outsourcing" setCurrentView={setCurrentView} defaultTab="outsourcing" />;
      case 'hr-performance':
        return <ProfessionalHRInterface key="performance" setCurrentView={setCurrentView} defaultTab="performance" />;
      case 'hr-timeoff':
        return <ProfessionalHRInterface key="time-off" setCurrentView={setCurrentView} defaultTab="time-off" />;
      case 'hr-analytics':
        return <ProfessionalHRInterface key="analytics" setCurrentView={setCurrentView} defaultTab="analytics" />;

      case 'admin':
      case 'users':
      case 'settings':
      case 'security':
        return <AdminDashboard />;

      // Ticket views
      case 'list':
      case 'my-tickets':
      case 'create-ticket':
        return <TicketCRUD setCurrentView={setCurrentView} />;

      case 'projects':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Projects</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Projects component will be implemented here</p>
              </div>
            </div>
          </div>
        );

      case 'tickets':
        return <TicketCRUD setCurrentView={setCurrentView} />;

      case 'tasks':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Tasks management component will be implemented here</p>
              </div>
            </div>
          </div>
        );

      case 'sprints':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Sprints</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Sprint management component will be implemented here</p>
              </div>
            </div>
          </div>
        );

      case 'analytics':
      case 'analytics-dashboard':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Analytics dashboard will be implemented here</p>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Reports component will be implemented here</p>
              </div>
            </div>
          </div>
        );

      case 'insights':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Business Insights</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Business insights component will be implemented here</p>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Help Center</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Help center will be implemented here</p>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Contact support will be implemented here</p>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">Notifications center will be implemented here</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{getPageTitle()}</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">This feature is coming soon...</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <DraggableSidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobile={isMobile}
        editMode={sidebarEditMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        {currentView !== 'home' && (
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="text-foreground hover:bg-muted"
                  >
                    {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  </Button>
                )}

                {/* Breadcrumb */}
                <div>
                  <nav className="text-sm text-muted-foreground">
                    {getBreadcrumb()}
                  </nav>
                  <h1 className="text-xl font-semibold text-foreground mt-1">
                    {getPageTitle()}
                  </h1>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Sidebar Edit Mode Toggle */}
                <Button
                  variant={sidebarEditMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSidebarEditMode(!sidebarEditMode)}
                  className={`h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 ${
                    sidebarEditMode ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                  }`}
                  title={sidebarEditMode ? "Exit sidebar edit mode" : "Edit sidebar layout"}
                >
                  {sidebarEditMode ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </Button>

                {/* Search */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Search className="w-4 h-4" />
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setCurrentView('notifications')}
                >
                  <Bell className="w-4 h-4" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                      {notifications}
                    </span>
                  )}
                </Button>

                {/* User Menu */}
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                  <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground hidden sm:block">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
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

export default ModernLayout;