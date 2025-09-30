'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  FileText,
  Settings,
  ArrowRight,
  Plus,
  BarChart3,
  Target,
  Zap,
  ChevronDown,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProfessionalHRDashboardProps {
  setCurrentView?: (view: string) => void;
}

const ProfessionalHRDashboard: React.FC<ProfessionalHRDashboardProps> = ({ setCurrentView }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHRData();
  }, []);

  const fetchHRData = async () => {
    try {
      setLoading(true);
      const [employeesRes, departmentsRes] = await Promise.all([
        supabase.from('employees').select('*').eq('is_active', true),
        supabase.from('departments').select('*')
      ]);

      if (employeesRes.data) setEmployees(employeesRes.data);
      if (departmentsRes.data) setDepartments(departmentsRes.data);
    } catch (error) {
      console.error('Error fetching HR data:', error);
      toast.error('Failed to load HR data');
    } finally {
      setLoading(false);
    }
  };

  // Navigation steps like PurpleDove
  const hrSteps = [
    {
      step: 1,
      title: 'Create an Employee',
      description: 'Add new team member',
      action: 'employee'
    },
    {
      step: 2,
      title: 'Create a Department',
      description: 'Organize your teams',
      action: 'department'
    },
    {
      step: 3,
      title: 'Setup Performance Review',
      description: 'Configure review process',
      action: 'performance'
    }
  ];

  // Your Shortcuts section
  const shortcuts = [
    {
      title: 'Employee',
      icon: <Users className="w-5 h-5" />,
      count: employees.length,
      action: () => setCurrentView?.('hr-employees')
    },
    {
      title: 'Department',
      icon: <Building2 className="w-5 h-5" />,
      count: departments.length,
      action: () => setCurrentView?.('hr-departments')
    },
    {
      title: 'Recruitment',
      icon: <UserPlus className="w-5 h-5" />,
      count: 12,
      action: () => setCurrentView?.('hr-recruitment')
    },
    {
      title: 'Performance',
      icon: <Award className="w-5 h-5" />,
      count: 8,
      action: () => setCurrentView?.('hr-performance')
    }
  ];

  // Reports & Masters sections
  const reportSections = [
    {
      title: 'Employee Management',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      items: [
        { name: 'Employee Directory', action: 'employee-directory' },
        { name: 'Employee Profile', action: 'employee-profile' },
        { name: 'Department Hierarchy', action: 'department-hierarchy' },
        { name: 'Position Management', action: 'position-management' }
      ]
    },
    {
      title: 'Performance & Development',
      icon: <Award className="w-5 h-5 text-green-600" />,
      items: [
        { name: 'Performance Reviews', action: 'performance-reviews' },
        { name: 'Goal Tracking', action: 'goal-tracking' },
        { name: 'Skills Assessment', action: 'skills-assessment' },
        { name: 'Training Records', action: 'training-records' }
      ]
    },
    {
      title: 'Time & Attendance',
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      items: [
        { name: 'Time Tracking', action: 'time-tracking' },
        { name: 'Leave Management', action: 'leave-management' },
        { name: 'Attendance Report', action: 'attendance-report' },
        { name: 'Holiday Calendar', action: 'holiday-calendar' }
      ]
    }
  ];

  const dataImportSettings = [
    { name: 'Import Employees', action: 'import-employees' },
    { name: 'Bulk Department Creation', action: 'bulk-departments' },
    { name: 'Performance Data Import', action: 'import-performance' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Let's begin your journey with HR Management</h1>
              <p className="text-muted-foreground mt-1">Employee, Department, Performance and Organization</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create a new Employee
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Setup Steps */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Setup Your HR System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hrSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 hover:bg-background rounded-lg cursor-pointer transition-colors">
                    <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-600">
                      <span className="text-xs">Setup</span>
                    </Button>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    Show Employee List
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Your Shortcuts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Your Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      onClick={shortcut.action}
                      className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-purple-600 transition-colors">
                        {shortcut.icon}
                      </div>
                      <div className="text-center">
                        <h4 className="font-medium text-foreground text-sm">{shortcut.title}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">{shortcut.count}</span>
                          <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reports & Masters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Reports & Masters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {reportSections.map((section, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        {section.icon}
                        <h3 className="font-semibold text-foreground text-sm">{section.title}</h3>
                      </div>
                      <div className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-600 cursor-pointer transition-colors"
                          >
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Import and Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  Data Import and Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataImportSettings.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 hover:bg-background rounded-lg cursor-pointer transition-colors group"
                    >
                      <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Employees</p>
                  <p className="text-2xl font-bold">{employees.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Departments</p>
                  <p className="text-2xl font-bold">{departments.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Active Positions</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <Briefcase className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Pending Reviews</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Award className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalHRDashboard;