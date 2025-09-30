'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit2,
  MoreHorizontal,
  Building2,
  Users,
  DollarSign,
  Activity,
  FileText,
  BarChart3
} from 'lucide-react';

interface DepartmentDetailViewProps {
  department: any;
  employees: any[];
  onBack: () => void;
  onEdit: (department: any) => void;
  onViewEmployee: (employee: any) => void;
}

const DepartmentDetailView: React.FC<DepartmentDetailViewProps> = ({
  department,
  employees,
  onBack,
  onEdit,
  onViewEmployee
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const departmentEmployees = employees.filter(emp => emp.department_id === department.id);
  const manager = employees.find(emp => emp.id === department.manager_id);

  const getEmployeeInitials = (employee: any) => {
    return `${employee.first_name?.charAt(0) || ''}${employee.last_name?.charAt(0) || ''}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Building2 className="w-4 h-4" /> },
    { id: 'team', name: 'Team Members', icon: <Users className="w-4 h-4" /> },
    { id: 'performance', name: 'Performance', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'budget', name: 'Budget', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'activity', name: 'Activity', icon: <Activity className="w-4 h-4" /> }
  ];

  const mockPerformanceData = [
    { metric: 'Team Productivity', value: '94%', trend: '+5%', color: 'text-green-600' },
    { metric: 'Project Completion', value: '87%', trend: '+2%', color: 'text-green-600' },
    { metric: 'Employee Satisfaction', value: '4.3/5', trend: '-0.1', color: 'text-red-600' },
    { metric: 'Budget Utilization', value: '78%', trend: '+3%', color: 'text-green-600' }
  ];

  const mockProjectData = [
    { name: 'Customer Portal Redesign', status: 'in-progress', completion: 75, dueDate: '2024-04-15' },
    { name: 'Mobile App Updates', status: 'completed', completion: 100, dueDate: '2024-03-20' },
    { name: 'API Integration', status: 'planning', completion: 15, dueDate: '2024-05-01' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
                  <p className="text-gray-600">{departmentEmployees.length} employees</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      Department
                    </Badge>
                    {department.status && (
                      <Badge className={getStatusColor(department.status)}>
                        {department.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => onEdit(department)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Department Info */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Department Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900 mt-1">{department.description || 'No description available'}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Department Head</label>
                      {manager ? (
                        <div className="flex items-center space-x-2 mt-1">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={manager.avatar_url} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {getEmployeeInitials(manager)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-gray-900 font-medium">
                              {manager.display_name || `${manager.first_name} ${manager.last_name}`}
                            </p>
                            <p className="text-xs text-gray-500">{manager.position}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 mt-1">No manager assigned</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Team Size</label>
                      <p className="text-gray-900 mt-1">{departmentEmployees.length} employees</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900 mt-1">{department.location || 'Not specified'}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Established</label>
                      <p className="text-gray-900 mt-1">
                        {department.created_at ? new Date(department.created_at).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProjectData.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="text-gray-900">{project.completion}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${project.completion}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <Badge className={
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats and Quick Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Employees</span>
                    <span className="font-medium text-gray-900">
                      {departmentEmployees.filter(emp => emp.employment_status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Budget Allocated</span>
                    <span className="font-medium text-gray-900">
                      {department.budget ? `$${department.budget.toLocaleString()}` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Projects</span>
                    <span className="font-medium text-gray-900">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Performance</span>
                    <span className="font-medium text-gray-900">4.2/5.0</span>
                  </div>
                </CardContent>
              </Card>

              {/* Team Preview */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departmentEmployees.slice(0, 5).map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                        onClick={() => onViewEmployee(employee)}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={employee.avatar_url} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {getEmployeeInitials(employee)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {employee.display_name || `${employee.first_name} ${employee.last_name}`}
                          </p>
                          <p className="text-xs text-gray-500">{employee.position}</p>
                        </div>
                        <Badge className={getStatusColor(employee.employment_status)} variant="outline">
                          {employee.employment_status}
                        </Badge>
                      </div>
                    ))}
                    {departmentEmployees.length > 5 && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setActiveTab('team')}
                      >
                        View all {departmentEmployees.length} members
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members ({departmentEmployees.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departmentEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onViewEmployee(employee)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={employee.avatar_url} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getEmployeeInitials(employee)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {employee.display_name || `${employee.first_name} ${employee.last_name}`}
                          </h3>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                          <Badge className={getStatusColor(employee.employment_status)} variant="outline">
                            {employee.employment_status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockPerformanceData.map((metric, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{metric.metric}</h3>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                        </div>
                        <div className={`text-right ${metric.color}`}>
                          <p className="text-sm font-medium">{metric.trend}</p>
                          <p className="text-xs">vs last month</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <Card>
            <CardContent className="p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Budget Management</h3>
              <p className="text-gray-600 mb-4">
                Budget tracking and financial reports for this department.
              </p>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                View Budget Report
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600">Department activity and updates will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DepartmentDetailView;