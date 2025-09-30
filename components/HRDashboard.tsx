'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Target,
  CheckCircle2,
  AlertCircle,
  User
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { EmployeeModal, DepartmentModal } from './EmployeeModals';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types
interface Employee {
  id: string;
  employee_id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  phone?: string;
  department_id?: string;
  position_id?: string;
  manager_id?: string;
  hire_date: string;
  employment_status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  salary?: number;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
  head_id?: string;
  created_at: string;
}

interface Position {
  id: string;
  title: string;
  department_id?: string;
  level?: string;
  description?: string;
  created_at: string;
}

interface TimeOffRequest {
  id: string;
  employee_id: string;
  request_type: 'vacation' | 'sick' | 'personal' | 'bereavement' | 'maternity' | 'paternity';
  start_date: string;
  end_date: string;
  total_days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
}

const HRDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);

  // Fetch HR data
  useEffect(() => {
    const fetchHRData = async () => {
      try {
        setLoading(true);

        const [employeesRes, departmentsRes, positionsRes, timeOffRes] = await Promise.all([
          supabase.from('employees').select('*').order('created_at', { ascending: false }),
          supabase.from('departments').select('*').order('name'),
          supabase.from('positions').select('*').order('title'),
          supabase.from('time_off_requests').select('*').order('created_at', { ascending: false })
        ]);

        if (employeesRes.error) throw employeesRes.error;
        if (departmentsRes.error) throw departmentsRes.error;
        if (positionsRes.error) throw positionsRes.error;
        if (timeOffRes.error) throw timeOffRes.error;

        setEmployees(employeesRes.data || []);
        setDepartments(departmentsRes.data || []);
        setPositions(positionsRes.data || []);
        setTimeOffRequests(timeOffRes.data || []);
      } catch (error) {
        console.error('Error fetching HR data:', error);
        toast.error('Failed to load HR data');
      } finally {
        setLoading(false);
      }
    };

    fetchHRData();
  }, []);

  const handleRefreshData = () => {
    const fetchHRData = async () => {
      try {
        setLoading(true);

        const [employeesRes, departmentsRes, positionsRes, timeOffRes] = await Promise.all([
          supabase.from('employees').select('*').order('created_at', { ascending: false }),
          supabase.from('departments').select('*').order('name'),
          supabase.from('positions').select('*').order('title'),
          supabase.from('time_off_requests').select('*').order('created_at', { ascending: false })
        ]);

        if (employeesRes.error) throw employeesRes.error;
        if (departmentsRes.error) throw departmentsRes.error;
        if (positionsRes.error) throw positionsRes.error;
        if (timeOffRes.error) throw timeOffRes.error;

        setEmployees(employeesRes.data || []);
        setDepartments(departmentsRes.data || []);
        setPositions(positionsRes.data || []);
        setTimeOffRequests(timeOffRes.data || []);
      } catch (error) {
        console.error('Error fetching HR data:', error);
        toast.error('Failed to load HR data');
      } finally {
        setLoading(false);
      }
    };

    fetchHRData();
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowEmployeeModal(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowDepartmentModal(true);
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setShowDepartmentModal(true);
  };

  const handleEmployeeModalClose = () => {
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
  };

  const handleDepartmentModalClose = () => {
    setShowDepartmentModal(false);
    setSelectedDepartment(null);
  };

  const handleModalSuccess = () => {
    handleRefreshData();
    toast.success('Data updated successfully');
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(employee =>
    employee.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const activeEmployees = employees.filter(emp => emp.employment_status === 'active').length;
  const pendingTimeOff = timeOffRequests.filter(req => req.status === 'pending').length;
  const departmentCount = departments.length;

  const getEmployeeAvatar = (employee: Employee) => {
    if (employee.avatar_url) return employee.avatar_url;
    return null;
  };

  const getEmployeeInitials = (employee: Employee) => {
    return `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full_time': return 'bg-blue-100 text-blue-800';
      case 'part_time': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      case 'intern': return 'bg-pink-100 text-pink-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Human Resources</h1>
            <p className="text-muted-foreground">Manage employees, performance, and organizational structure</p>
          </div>
          <Button onClick={handleAddEmployee} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
                  <p className="text-2xl font-bold text-foreground">{activeEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Departments</p>
                  <p className="text-2xl font-bold text-foreground">{departmentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending Time Off</p>
                  <p className="text-2xl font-bold text-foreground">{pendingTimeOff}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                  <p className="text-2xl font-bold text-foreground">4.2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="time-off">Time Off</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Hires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employees.slice(0, 5).map((employee) => (
                      <div key={employee.id} className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={getEmployeeAvatar(employee)} />
                          <AvatarFallback>{getEmployeeInitials(employee)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{employee.display_name}</p>
                          <p className="text-xs text-gray-500">{employee.email}</p>
                        </div>
                        <Badge className={getStatusColor(employee.employment_status)}>
                          {employee.employment_status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => {
                      const deptEmployees = employees.filter(emp => emp.department_id === dept.id);
                      return (
                        <div key={dept.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{dept.name}</span>
                          <Badge variant="outline">{deptEmployees.length} employees</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Employee Directory</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={getEmployeeAvatar(employee)} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getEmployeeInitials(employee)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">{employee.display_name}</h3>
                            <p className="text-sm text-gray-500">{employee.employee_id}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="w-4 h-4 mr-2" />
                          {employee.email}
                        </div>
                        {employee.phone && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 mr-2" />
                            {employee.phone}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(employee.employment_status)}>
                            {employee.employment_status}
                          </Badge>
                          <Badge className={getTypeColor(employee.employment_type)}>
                            {employee.employment_type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Departments & Teams</CardTitle>
                  <Button onClick={handleAddDepartment} variant="outline" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Department
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((dept) => {
                    const deptEmployees = employees.filter(emp => emp.department_id === dept.id);
                    return (
                      <div key={dept.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleEditDepartment(dept)}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-foreground">{dept.name}</h3>
                          <Badge variant="outline">{deptEmployees.length}</Badge>
                        </div>
                        {dept.description && (
                          <p className="text-sm text-muted-foreground mb-4">{dept.description}</p>
                        )}
                        <div className="flex -space-x-2">
                          {deptEmployees.slice(0, 5).map((employee) => (
                            <Avatar key={employee.id} className="w-8 h-8 border-2 border-white">
                              <AvatarImage src={getEmployeeAvatar(employee)} />
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                {getEmployeeInitials(employee)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {deptEmployees.length > 5 && (
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">+{deptEmployees.length - 5}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time-off" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Off Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeOffRequests.map((request) => {
                    const employee = employees.find(emp => emp.id === request.employee_id);
                    return (
                      <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={employee ? getEmployeeAvatar(employee) : undefined} />
                              <AvatarFallback>
                                {employee ? getEmployeeInitials(employee) : 'N/A'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{employee?.display_name || 'Unknown Employee'}</h3>
                              <p className="text-sm text-muted-foreground">
                                {request.request_type} • {request.total_days} days
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {request.status}
                            </Badge>
                            {request.status === 'pending' && (
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                                  <AlertCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Performance Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Track employee performance, set goals, and conduct reviews.
                  </p>
                  <Button>
                    <Target className="w-4 h-4 mr-2" />
                    Set Up Performance Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <EmployeeModal
        isOpen={showEmployeeModal}
        onClose={handleEmployeeModalClose}
        employee={selectedEmployee}
        onSuccess={handleModalSuccess}
      />

      <DepartmentModal
        isOpen={showDepartmentModal}
        onClose={handleDepartmentModalClose}
        department={selectedDepartment}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default HRDashboard;