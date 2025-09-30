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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Briefcase,
  Award,
  Activity,
  FileText,
  Download,
  Eye,
  User
} from 'lucide-react';

interface EmployeeDetailViewProps {
  employee: any;
  onBack: () => void;
  onEdit: (employee: any) => void;
}

const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({ employee, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full_time': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'part_time': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contract': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'intern': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'performance', name: 'Performance', icon: <Award className="w-4 h-4" /> },
    { id: 'timeoff', name: 'Time Off', icon: <Calendar className="w-4 h-4" /> },
    { id: 'documents', name: 'Documents', icon: <FileText className="w-4 h-4" /> },
    { id: 'activity', name: 'Activity', icon: <Activity className="w-4 h-4" /> }
  ];

  const mockPerformanceData = [
    { period: '2024 Q1', rating: 4.5, goals: 8, completed: 7 },
    { period: '2023 Q4', rating: 4.2, goals: 6, completed: 6 },
    { period: '2023 Q3', rating: 4.0, goals: 5, completed: 4 }
  ];

  const mockTimeOffData = [
    { type: 'Annual Leave', startDate: '2024-03-15', endDate: '2024-03-19', days: 5, status: 'approved' },
    { type: 'Sick Leave', startDate: '2024-02-10', endDate: '2024-02-10', days: 1, status: 'approved' },
    { type: 'Personal Leave', startDate: '2024-04-20', endDate: '2024-04-21', days: 2, status: 'pending' }
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
                <Avatar className="w-16 h-16">
                  <AvatarImage src={employee.avatar_url} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                    {getEmployeeInitials(employee)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {employee.display_name || `${employee.first_name} ${employee.last_name}`}
                  </h1>
                  <p className="text-gray-600">{employee.position} • {employee.employee_id}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(employee.employment_status)}>
                      {employee.employment_status}
                    </Badge>
                    <Badge className={getTypeColor(employee.employment_type)}>
                      {employee.employment_type?.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => onEdit(employee)}>
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
            {/* Basic Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900">{employee.first_name} {employee.last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Employee ID</label>
                      <p className="text-gray-900">{employee.employee_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Position</label>
                      <p className="text-gray-900">{employee.position || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Department</label>
                      <p className="text-gray-900">{employee.department || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Employment Type</label>
                      <p className="text-gray-900">{employee.employment_type?.replace('_', ' ') || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Start Date</label>
                      <p className="text-gray-900">
                        {employee.start_date ? new Date(employee.start_date).toLocaleDateString() : 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-700">Bio</label>
                    <p className="text-gray-900 mt-1">{employee.bio || 'No bio available'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              {employee.skills && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.split(',').map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-gray-900">{employee.email}</p>
                    </div>
                  </div>

                  {employee.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-gray-900">{employee.phone}</p>
                      </div>
                    </div>
                  )}

                  {employee.address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="text-gray-900">{employee.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Joined</p>
                      <p className="text-gray-900">
                        {employee.created_at ? new Date(employee.created_at).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Performance Rating</span>
                    <span className="font-medium text-gray-900">4.5/5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Time Off Used</span>
                    <span className="font-medium text-gray-900">8/25 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Projects</span>
                    <span className="font-medium text-gray-900">12 active</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPerformanceData.map((review, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{review.period} Review</h3>
                        <p className="text-sm text-gray-600">Goals: {review.completed}/{review.goals} completed</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{review.rating}/5.0</p>
                        <p className="text-sm text-gray-600">Rating</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Time Off Tab */}
        {activeTab === 'timeoff' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Off History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTimeOffData.map((request, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{request.type}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{request.days} days</p>
                        <Badge className={request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
              <p className="text-gray-600 mb-4">Employee documents will appear here when uploaded.</p>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Upload Document
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
              <p className="text-gray-600">Employee activity and updates will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailView;