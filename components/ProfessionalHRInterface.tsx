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
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  User,
  Badge,
  Settings,
  Award,
  BarChart3,
  Target,
  UserCheck,
  Zap,
  Globe
} from 'lucide-react';

interface ProfessionalHRInterfaceProps {
  setCurrentView?: (view: string) => void;
  defaultTab?: string;
}

const ProfessionalHRInterface: React.FC<ProfessionalHRInterfaceProps> = ({
  setCurrentView,
  defaultTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update active tab when defaultTab prop changes
  React.useEffect(() => {
    console.log('ProfessionalHRInterface - Component mounted/unmounted with defaultTab:', defaultTab);
    console.log('ProfessionalHRInterface - defaultTab changed to:', defaultTab);
    setActiveTab(defaultTab);
  }, [defaultTab]);

  React.useEffect(() => {
    console.log('ProfessionalHRInterface - activeTab is now:', activeTab);
  }, [activeTab]);

  React.useEffect(() => {
    console.log('ProfessionalHRInterface - Component mounted');
    return () => {
      console.log('ProfessionalHRInterface - Component unmounted');
    };
  }, []);

  const employees = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Developer',
      department: 'Engineering',
      status: 'Active',
      joinDate: '2022-03-15',
      salary: '$85,000'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 234-5678',
      position: 'Product Manager',
      department: 'Product',
      status: 'Active',
      joinDate: '2021-08-22',
      salary: '$95,000'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@company.com',
      phone: '+1 (555) 345-6789',
      position: 'UX Designer',
      department: 'Design',
      status: 'Active',
      joinDate: '2022-11-10',
      salary: '$75,000'
    },
    {
      id: 4,
      name: 'Emily Brown',
      email: 'emily.brown@company.com',
      phone: '+1 (555) 456-7890',
      position: 'HR Manager',
      department: 'Human Resources',
      status: 'Active',
      joinDate: '2020-05-18',
      salary: '$78,000'
    }
  ];

  const departments = [
    {
      id: 1,
      name: 'Engineering',
      description: 'Software development and technical operations',
      manager: 'John Smith',
      employees: 12,
      budget: '$1,200,000',
      location: 'Floor 3'
    },
    {
      id: 2,
      name: 'Product',
      description: 'Product strategy and management',
      manager: 'Sarah Johnson',
      employees: 8,
      budget: '$800,000',
      location: 'Floor 2'
    },
    {
      id: 3,
      name: 'Design',
      description: 'User experience and visual design',
      manager: 'Mike Davis',
      employees: 6,
      budget: '$600,000',
      location: 'Floor 2'
    },
    {
      id: 4,
      name: 'Human Resources',
      description: 'Employee relations and talent management',
      manager: 'Emily Brown',
      employees: 4,
      budget: '$400,000',
      location: 'Floor 1'
    }
  ];

  const positions = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      type: 'Full-time',
      level: 'Senior',
      salary: '$80,000 - $100,000',
      openings: 2,
      status: 'Open'
    },
    {
      id: 2,
      title: 'Product Marketing Manager',
      department: 'Product',
      type: 'Full-time',
      level: 'Mid-level',
      salary: '$70,000 - $90,000',
      openings: 1,
      status: 'Open'
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      department: 'Design',
      type: 'Full-time',
      level: 'Junior',
      salary: '$60,000 - $75,000',
      openings: 1,
      status: 'Open'
    },
    {
      id: 4,
      title: 'HR Coordinator',
      department: 'Human Resources',
      type: 'Part-time',
      level: 'Entry',
      salary: '$35,000 - $45,000',
      openings: 1,
      status: 'Closed'
    }
  ];

  const tabGroups = [
    {
      name: "Core Management",
      tabs: [
        { id: 'overview', label: 'Overview', icon: <Users className="w-4 h-4" /> },
        { id: 'employees', label: 'Employees', icon: <User className="w-4 h-4" /> },
        { id: 'departments', label: 'Departments', icon: <Building2 className="w-4 h-4" /> },
        { id: 'positions', label: 'Positions', icon: <Briefcase className="w-4 h-4" /> }
      ]
    },
    {
      name: "Employee Operations",
      tabs: [
        { id: 'time-off', label: 'Time Off', icon: <Clock className="w-4 h-4" /> },
        { id: 'performance', label: 'Performance', icon: <Award className="w-4 h-4" /> }
      ]
    },
    {
      name: "Talent Acquisition",
      tabs: [
        { id: 'talent-hunt', label: 'Talent Hunt', icon: <Target className="w-4 h-4" /> },
        { id: 'recruitment', label: 'Recruitment', icon: <UserCheck className="w-4 h-4" /> },
        { id: 'acquisition', label: 'Acquisition', icon: <Zap className="w-4 h-4" /> },
        { id: 'outsourcing', label: 'Outsourcing', icon: <Globe className="w-4 h-4" /> }
      ]
    },
    {
      name: "Analytics & Reports",
      tabs: [
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    }
  ];

  // Flatten tabs for backward compatibility
  const tabs = tabGroups.flatMap(group => group.tabs);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Employees</p>
                <p className="text-2xl font-bold text-slate-900">45</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Departments</p>
                <p className="text-2xl font-bold text-slate-900">8</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Open Positions</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg. Salary</p>
                <p className="text-2xl font-bold text-slate-900">$82K</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent HR Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">New employee onboarded</p>
                <p className="text-sm text-slate-600">John Smith joined Engineering team</p>
              </div>
              <span className="text-sm text-slate-500">2 hours ago</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">New position posted</p>
                <p className="text-sm text-slate-600">Senior Frontend Developer position opened</p>
              </div>
              <span className="text-sm text-slate-500">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Employees</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-900">Employee</th>
                  <th className="text-left p-4 font-medium text-slate-900">Position</th>
                  <th className="text-left p-4 font-medium text-slate-900">Department</th>
                  <th className="text-left p-4 font-medium text-slate-900">Status</th>
                  <th className="text-left p-4 font-medium text-slate-900">Join Date</th>
                  <th className="text-left p-4 font-medium text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{employee.name}</p>
                          <p className="text-sm text-slate-600">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-900">{employee.position}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-900">{employee.department}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        {employee.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-900">{employee.joinDate}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDepartments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Departments</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((department) => (
          <Card key={department.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {department.name}
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">{department.description}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Manager</span>
                  <span className="font-medium">{department.manager}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Employees</span>
                  <span className="font-medium">{department.employees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Budget</span>
                  <span className="font-medium">{department.budget}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Location</span>
                  <span className="font-medium">{department.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPositions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Positions</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Position
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {positions.map((position) => (
          <Card key={position.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{position.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      position.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {position.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Department:</span>
                      <p className="font-medium">{position.department}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Type:</span>
                      <p className="font-medium">{position.type}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Level:</span>
                      <p className="font-medium">{position.level}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Salary:</span>
                      <p className="font-medium">{position.salary}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{position.openings}</p>
                    <p className="text-xs text-slate-600">openings</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTimeOff = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Time Off Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Requests</p>
                <p className="text-2xl font-bold text-slate-900">8</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Approved This Month</p>
                <p className="text-2xl font-bold text-slate-900">24</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Average Days Off</p>
                <p className="text-2xl font-bold text-slate-900">12.5</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Time Off Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'John Smith', type: 'Vacation', days: '5 days', date: 'Dec 20-24, 2024', status: 'pending' },
              { name: 'Sarah Johnson', type: 'Sick Leave', days: '2 days', date: 'Dec 15-16, 2024', status: 'approved' },
              { name: 'Mike Davis', type: 'Personal', days: '1 day', date: 'Dec 18, 2024', status: 'approved' },
              { name: 'Emily Brown', type: 'Vacation', days: '7 days', date: 'Jan 2-8, 2025', status: 'pending' }
            ].map((request, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                    {request.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{request.name}</p>
                    <p className="text-sm text-slate-600">{request.type} • {request.days}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{request.date}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    request.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Performance Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-slate-900">4.2</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed Reviews</p>
                <p className="text-2xl font-bold text-slate-900">28</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-slate-900">6</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Goals Met</p>
                <p className="text-2xl font-bold text-slate-900">85%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { department: 'Engineering', avgRating: 4.5, completedReviews: 12, goals: 92 },
              { department: 'Product', avgRating: 4.2, completedReviews: 8, goals: 88 },
              { department: 'Design', avgRating: 4.3, completedReviews: 6, goals: 85 },
              { department: 'Marketing', avgRating: 4.0, completedReviews: 7, goals: 79 }
            ].map((dept, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900">{dept.department}</h4>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{dept.avgRating}/5</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Reviews:</span>
                    <p className="font-semibold">{dept.completedReviews}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Goals Met:</span>
                    <p className="font-semibold">{dept.goals}%</p>
                  </div>
                  <div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                        style={{ width: `${dept.goals}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">HR Analytics</h2>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Turnover Rate</p>
                <p className="text-2xl font-bold text-slate-900">3.2%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Employee Satisfaction</p>
                <p className="text-2xl font-bold text-slate-900">91%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Time to Hire</p>
                <p className="text-2xl font-bold text-slate-900">18 days</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Engineering', performance: 94, color: 'emerald' },
                { name: 'Product', performance: 89, color: 'blue' },
                { name: 'Design', performance: 92, color: 'purple' },
                { name: 'Marketing', performance: 86, color: 'orange' }
              ].map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{dept.name}</span>
                    <span className="font-bold">{dept.performance}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-${dept.color}-500 to-${dept.color}-600 h-2 rounded-full`}
                      style={{ width: `${dept.performance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hiring Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: 'Applications', count: 156, color: 'blue' },
                { stage: 'Screening', count: 42, color: 'yellow' },
                { stage: 'Interviews', count: 18, color: 'purple' },
                { stage: 'Offers', count: 8, color: 'emerald' },
                { stage: 'Hired', count: 5, color: 'green' }
              ].map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 bg-${stage.color}-500 rounded-full`}></div>
                    <span className="font-medium">{stage.stage}</span>
                  </div>
                  <span className="font-bold text-slate-900">{stage.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTalentHunt = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Talent Hunt</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Hunt Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-slate-900">8</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Talent Sourced</p>
                <p className="text-2xl font-bold text-slate-900">156</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Success Rate</p>
                <p className="text-2xl font-bold text-slate-900">68%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Talent Hunt Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Senior Developer Hunt', status: 'Active', candidates: 23, target: 50 },
              { name: 'Design Lead Search', status: 'Active', candidates: 12, target: 30 },
              { name: 'Product Manager Quest', status: 'Completed', candidates: 45, target: 40 },
              { name: 'DevOps Expert Hunt', status: 'Planning', candidates: 0, target: 25 }
            ].map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                  <p className="text-sm text-slate-600">{campaign.candidates}/{campaign.target} candidates</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  campaign.status === 'Active' ? 'bg-green-100 text-green-700' :
                  campaign.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {campaign.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRecruitment = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Recruitment Pipeline</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Applied</p>
                <p className="text-2xl font-bold text-slate-900">247</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Screening</p>
                <p className="text-2xl font-bold text-slate-900">89</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Interview</p>
                <p className="text-2xl font-bold text-slate-900">34</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Hired</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Sarah Connor', position: 'Frontend Developer', stage: 'Interview', date: '2024-01-15' },
              { name: 'John Smith', position: 'Backend Developer', stage: 'Screening', date: '2024-01-14' },
              { name: 'Emily Davis', position: 'UX Designer', stage: 'Applied', date: '2024-01-13' },
              { name: 'Michael Brown', position: 'DevOps Engineer', stage: 'Hired', date: '2024-01-12' }
            ].map((candidate, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
                  <p className="text-sm text-slate-600">{candidate.position}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    candidate.stage === 'Hired' ? 'bg-green-100 text-green-700' :
                    candidate.stage === 'Interview' ? 'bg-blue-100 text-blue-700' :
                    candidate.stage === 'Screening' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {candidate.stage}
                  </span>
                  <p className="text-sm text-slate-500 mt-1">{candidate.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAcquisition = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Talent Acquisition</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Acquisition Strategy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Strategies</p>
                <p className="text-2xl font-bold text-slate-900">6</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Acquired Talent</p>
                <p className="text-2xl font-bold text-slate-900">89</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Success Rate</p>
                <p className="text-2xl font-bold text-slate-900">76%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acquisition Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'University Partnerships', type: 'Campus Recruitment', status: 'Active', acquired: 23 },
              { name: 'Tech Conferences', type: 'Event Networking', status: 'Active', acquired: 18 },
              { name: 'Social Media Campaigns', type: 'Digital Outreach', status: 'Planning', acquired: 0 },
              { name: 'Referral Program', type: 'Employee Referrals', status: 'Active', acquired: 34 }
            ].map((strategy, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-slate-900">{strategy.name}</h3>
                  <p className="text-sm text-slate-600">{strategy.type} • {strategy.acquired} acquired</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  strategy.status === 'Active' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {strategy.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOutsourcing = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Outsourcing Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Vendors</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Outsourced Staff</p>
                <p className="text-2xl font-bold text-slate-900">67</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Monthly Cost</p>
                <p className="text-2xl font-bold text-slate-900">$89K</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outsourcing Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'TechGlobal Solutions', location: 'India', staff: 23, specialization: 'Software Development' },
              { name: 'DesignCraft Studios', location: 'Philippines', staff: 12, specialization: 'UI/UX Design' },
              { name: 'CloudOps Partners', location: 'Eastern Europe', staff: 18, specialization: 'DevOps & Infrastructure' },
              { name: 'DataAnalytics Pro', location: 'Latin America', staff: 14, specialization: 'Data Science' }
            ].map((vendor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-slate-900">{vendor.name}</h3>
                  <p className="text-sm text-slate-600">{vendor.location} • {vendor.staff} staff • {vendor.specialization}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'employees':
        return renderEmployees();
      case 'departments':
        return renderDepartments();
      case 'positions':
        return renderPositions();
      case 'time-off':
        return renderTimeOff();
      case 'performance':
        return renderPerformance();
      case 'analytics':
        return renderAnalytics();
      case 'talent-hunt':
        return renderTalentHunt();
      case 'recruitment':
        return renderRecruitment();
      case 'acquisition':
        return renderAcquisition();
      case 'outsourcing':
        return renderOutsourcing();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Premium Header */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl mb-8 shadow-2xl border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/20 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full translate-y-48 -translate-x-48"></div>

          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Human Resources
                    </h1>
                    <p className="text-slate-600 text-base font-medium mt-1">Enterprise Workforce Management</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-700">All Systems Operational</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">Q4 2024</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-700">Live Dashboard</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" className="gap-2 h-11 px-6 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
                <Button variant="outline" className="gap-2 h-11 px-6 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-2 h-11 px-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="w-4 h-4" />
                  Add Employee
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden backdrop-blur-sm">
            <div className="divide-y divide-slate-100">
              {tabGroups.map((group, groupIndex) => (
                <div key={group.name} className="group">
                  {/* Group Header */}
                  <div className="relative px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-50/80 border-b border-slate-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                      <h3 className="text-sm font-bold text-slate-700 tracking-wide">
                        {group.name}
                      </h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent ml-4"></div>
                    </div>
                  </div>

                  {/* Group Tabs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
                    {group.tabs.map((tab, tabIndex) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group/tab relative flex items-center gap-3 px-6 py-4 font-medium transition-all duration-300 ease-out ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-50 to-blue-50/70 text-blue-700 shadow-inner'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-50/50'
                        } ${tabIndex % 4 !== 3 ? 'border-r border-slate-100' : ''} ${Math.floor(tabIndex / 4) !== Math.floor((group.tabs.length - 1) / 4) ? 'border-b border-slate-100' : ''}`}
                      >
                        {/* Active indicator */}
                        {activeTab === tab.id && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>
                        )}

                        {/* Icon */}
                        <div className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-600 shadow-sm'
                            : 'bg-slate-100 text-slate-500 group-hover/tab:bg-slate-200 group-hover/tab:text-slate-600'
                        }`}>
                          {tab.icon}
                        </div>

                        {/* Label */}
                        <div className="flex-1 text-left">
                          <span className={`block text-sm font-semibold transition-colors duration-300 ${
                            activeTab === tab.id ? 'text-blue-700' : 'text-slate-700 group-hover/tab:text-slate-900'
                          }`}>
                            {tab.label}
                          </span>
                          <span className={`block text-xs mt-0.5 transition-colors duration-300 ${
                            activeTab === tab.id ? 'text-blue-600/70' : 'text-slate-500 group-hover/tab:text-slate-600'
                          }`}>
                            {tab.id === 'overview' && 'Dashboard & Stats'}
                            {tab.id === 'employees' && 'Staff Management'}
                            {tab.id === 'departments' && 'Organization'}
                            {tab.id === 'positions' && 'Job Roles'}
                            {tab.id === 'time-off' && 'Leave Management'}
                            {tab.id === 'performance' && 'Reviews & Goals'}
                            {tab.id === 'talent-hunt' && 'Active Sourcing'}
                            {tab.id === 'recruitment' && 'Pipeline Management'}
                            {tab.id === 'acquisition' && 'Strategic Hiring'}
                            {tab.id === 'outsourcing' && 'Vendor Management'}
                            {tab.id === 'analytics' && 'Reports & Insights'}
                          </span>
                        </div>

                        {/* Hover indicator */}
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-blue-500 scale-100'
                            : 'bg-slate-300 scale-0 group-hover/tab:scale-100 group-hover/tab:bg-slate-400'
                        }`}></div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Content Area */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalHRInterface;