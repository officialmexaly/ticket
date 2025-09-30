'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Ticket,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  ArrowRight,
  Activity,
  Star,
  Zap,
  FileText,
  Briefcase
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface ModernHomeDashboardProps {
  setCurrentView: (view: string) => void;
}

const ModernHomeDashboard: React.FC<ModernHomeDashboardProps> = ({ setCurrentView }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  const quickActions = [
    {
      title: 'Create Ticket',
      description: 'Submit a new support request',
      icon: <Ticket className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      action: () => setCurrentView('create-ticket')
    },
    {
      title: 'New Employee',
      description: 'Add employee to system',
      icon: <Users className="w-6 h-6" />,
      color: 'from-emerald-500 to-emerald-600',
      action: () => setCurrentView('hr-employees')
    },
    {
      title: 'Create Project',
      description: 'Start a new project',
      icon: <Target className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      action: () => setCurrentView('projects')
    },
    {
      title: 'Schedule Meeting',
      description: 'Book team meeting',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      action: () => setCurrentView('calendar')
    }
  ];

  const shortcuts = [
    { title: 'Tickets', icon: <Ticket className="w-5 h-5" />, view: 'list', count: '12 Open' },
    { title: 'Employees', icon: <Users className="w-5 h-5" />, view: 'hr-employees', count: '45 Active' },
    { title: 'Projects', icon: <Briefcase className="w-5 h-5" />, view: 'projects', count: '8 Active' },
    { title: 'Reports', icon: <BarChart3 className="w-5 h-5" />, view: 'reports', count: '5 Generated' }
  ];

  const recentActivity = [
    { type: 'ticket', title: 'New ticket: Login Issues', time: '5 min ago', status: 'urgent' },
    { type: 'hr', title: 'Employee onboarding completed', time: '1 hour ago', status: 'success' },
    { type: 'project', title: 'Project milestone reached', time: '2 hours ago', status: 'info' },
    { type: 'system', title: 'System backup completed', time: '3 hours ago', status: 'success' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-border px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Good morning! 👋</h1>
              <p className="text-lg text-muted-foreground mt-1">{currentDate}</p>
              <p className="text-sm text-muted-foreground mt-2">Let's begin your journey with HelpDesk Pro</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setCurrentView('create-ticket')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Item
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={action.action}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Stats */}
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
                <div className="grid grid-cols-2 gap-4">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentView(shortcut.view)}
                      className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground border">
                        {shortcut.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{shortcut.title}</h4>
                        <p className="text-sm text-muted-foreground">{shortcut.count}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold">124</div>
                    <div className="text-sm text-muted-foreground">Total Tickets</div>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-sm text-muted-foreground">Employees</div>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-muted-foreground">Active Projects</div>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold">92%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Ticket Resolution Rate</span>
                    <span className="text-sm text-muted-foreground">87%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Project Completion</span>
                    <span className="text-sm text-muted-foreground">73%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '73%' }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Employee Satisfaction</span>
                    <span className="text-sm text-muted-foreground">92%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Alerts */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        item.status === 'urgent' ? 'bg-red-500' :
                        item.status === 'success' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setCurrentView('notifications')}
                >
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Services</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">File Storage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600">Maintenance</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Service</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Today's Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">New Tickets</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">Opened today</p>
                    </div>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">7</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">Resolved</p>
                      <p className="text-xs text-green-700 dark:text-green-300">Tickets closed</p>
                    </div>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">12</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                    <div>
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Tasks Done</p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">Completed today</p>
                    </div>
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">23</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHomeDashboard;