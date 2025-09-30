'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Building2,
  Briefcase,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  DollarSign,
  User,
  Award,
  UserCheck,
  UserPlus,
  Target,
  BarChart3,
  Activity,
  Bell,
  Settings,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react';

interface HRDashboardProps {
  setCurrentView?: (view: string) => void;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ setCurrentView }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const hrMetrics = [
    {
      title: 'Total Employees',
      value: '245',
      change: '+12',
      changeType: 'increase',
      icon: Users,
      color: 'blue',
      description: 'Active employees'
    },
    {
      title: 'Departments',
      value: '8',
      change: '+1',
      changeType: 'increase',
      icon: Building2,
      color: 'emerald',
      description: 'Active departments'
    },
    {
      title: 'Open Positions',
      value: '23',
      change: '+5',
      changeType: 'increase',
      icon: Briefcase,
      color: 'purple',
      description: 'Available roles'
    },
    {
      title: 'Avg. Salary',
      value: '$82K',
      change: '+3.2%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'orange',
      description: 'Annual average'
    }
  ];

  const quickActions = [
    {
      title: 'Add Employee',
      description: 'Onboard new team member',
      icon: UserPlus,
      color: 'from-blue-500 to-blue-600',
      action: () => setCurrentView?.('hr-employees')
    },
    {
      title: 'Manage Departments',
      description: 'View and organize departments',
      icon: Building2,
      color: 'from-emerald-500 to-emerald-600',
      action: () => setCurrentView?.('hr-departments')
    },
    {
      title: 'Job Positions',
      description: 'Create and manage positions',
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      action: () => setCurrentView?.('hr-positions')
    },
    {
      title: 'Time Off Requests',
      description: 'Review leave applications',
      icon: Calendar,
      color: 'from-amber-500 to-amber-600',
      action: () => setCurrentView?.('hr-timeoff')
    },
    {
      title: 'Performance Reviews',
      description: 'Track employee performance',
      icon: Award,
      color: 'from-indigo-500 to-indigo-600',
      action: () => setCurrentView?.('hr-performance')
    },
    {
      title: 'Recruitment',
      description: 'Manage hiring process',
      icon: UserCheck,
      color: 'from-rose-500 to-rose-600',
      action: () => setCurrentView?.('hr-recruitment')
    }
  ];

  const recentActivity = [
    {
      type: 'employee',
      title: 'New employee onboarded',
      description: 'Sarah Johnson joined Product team',
      time: '2 hours ago',
      icon: UserPlus,
      status: 'success'
    },
    {
      type: 'leave',
      title: 'Leave request approved',
      description: 'Mike Davis - 3 days vacation',
      time: '4 hours ago',
      icon: Calendar,
      status: 'info'
    },
    {
      type: 'position',
      title: 'New position posted',
      description: 'Senior Frontend Developer',
      time: '1 day ago',
      icon: Briefcase,
      status: 'success'
    },
    {
      type: 'review',
      title: 'Performance review completed',
      description: 'Q4 reviews for Engineering team',
      time: '2 days ago',
      icon: Award,
      status: 'info'
    }
  ];

  const departmentOverview = [
    {
      name: 'Engineering',
      employees: 45,
      openPositions: 8,
      budget: '$2.1M',
      satisfaction: 92,
      manager: 'John Smith'
    },
    {
      name: 'Product',
      employees: 32,
      openPositions: 5,
      budget: '$1.8M',
      satisfaction: 89,
      manager: 'Sarah Johnson'
    },
    {
      name: 'Design',
      employees: 18,
      openPositions: 3,
      budget: '$980K',
      satisfaction: 94,
      manager: 'Mike Davis'
    },
    {
      name: 'Marketing',
      employees: 28,
      openPositions: 4,
      budget: '$1.2M',
      satisfaction: 87,
      manager: 'Emily Brown'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-white rounded-2xl mb-8 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">HR Management</h1>
                    <p className="text-slate-600 text-sm font-medium">Enterprise Workforce Management Dashboard</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-emerald-700">All Systems Operational</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Q4 2024</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Reports
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                  onClick={() => setCurrentView?.('hr-employees')}
                >
                  <Plus className="w-4 h-4" />
                  Add Employee
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {hrMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                    <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.changeType === 'increase' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-semibold ${
                      metric.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-2xl text-slate-900">{metric.value}</h3>
                  <p className="font-medium text-slate-900">{metric.title}</p>
                  <p className="text-sm text-slate-600">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Customize
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200"
                onClick={action.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        {action.title}
                      </h3>
                      <p className="text-sm text-slate-600">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Department Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Department Overview
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentView?.('hr-departments')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentOverview.map((dept, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900">{dept.name}</h4>
                          <p className="text-sm text-slate-600">Manager: {dept.manager}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            dept.satisfaction >= 90 ? 'bg-emerald-100 text-emerald-700' :
                            dept.satisfaction >= 85 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {dept.satisfaction}% satisfaction
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Employees:</span>
                          <p className="font-semibold">{dept.employees}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Open Positions:</span>
                          <p className="font-semibold">{dept.openPositions}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Budget:</span>
                          <p className="font-semibold">{dept.budget}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.status === 'success' ? 'bg-emerald-100' :
                        activity.status === 'info' ? 'bg-blue-100' :
                        'bg-slate-100'
                      }`}>
                        <activity.icon className={`w-4 h-4 ${
                          activity.status === 'success' ? 'text-emerald-600' :
                          activity.status === 'info' ? 'text-blue-600' :
                          'text-slate-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm">{activity.title}</p>
                        <p className="text-xs text-slate-600 mb-1">{activity.description}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Employee Satisfaction</span>
                      <span className="text-sm font-bold">91%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Retention Rate</span>
                      <span className="text-sm font-bold">94%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Time to Hire</span>
                      <span className="text-sm font-bold">18 days</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
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

export default HRDashboard;