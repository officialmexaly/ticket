'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Users,
  UserPlus,
  Building2,
  Award,
  Calendar,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Plus,
  ArrowRight,
  BarChart3,
  Target,
  ChevronRight,
  Briefcase,
  FileText,
  Star,
  Activity,
  Grid3X3,
  List,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Edit2,
  Trash2,
  MoreHorizontal,
  Download,
  Copy,
  CheckCircle,
  Search as SearchIcon,
  UserCheck,
  Handshake,
  ExternalLink,
  Globe,
  Network,
  Zap,
  DollarSign,
  FileText as FileContract,
  Users as Users2,
  User as PersonStanding
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { EmployeeModal, DepartmentModal } from './EmployeeModals';
import EmployeeDetailView from './EmployeeDetailView';
import DepartmentDetailView from './DepartmentDetailView';
import { useTheme } from '@/lib/theme-context';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Enhanced TypeScript interfaces from old HR system
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
  bio?: string;
  skills?: string;
  position?: string;
  address?: string;
  start_date?: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  location?: string;
  budget?: number;
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

// Talent Hunt Interfaces
interface TalentCandidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  resume_url?: string;
  current_position?: string;
  current_company?: string;
  experience_years?: number;
  skills: string[];
  location?: string;
  salary_expectation?: number;
  availability?: 'immediate' | 'notice_period' | 'unavailable';
  source: 'linkedin' | 'referral' | 'job_board' | 'direct_application' | 'headhunting';
  stage: 'sourced' | 'contacted' | 'interested' | 'interview_scheduled' | 'rejected' | 'hired';
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface TalentPool {
  id: string;
  name: string;
  description?: string;
  target_positions: string[];
  candidate_count: number;
  created_by: string;
  created_at: string;
}

// Acquisition Interfaces
interface JobRequisition {
  id: string;
  title: string;
  department_id: string;
  position_id?: string;
  description: string;
  requirements: string[];
  nice_to_have?: string[];
  salary_range_min?: number;
  salary_range_max?: number;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'temporary';
  location?: string;
  remote_allowed: boolean;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'open' | 'on_hold' | 'filled' | 'cancelled';
  hiring_manager_id: string;
  recruiter_id?: string;
  created_at: string;
  deadline?: string;
}

interface AcquisitionPipeline {
  id: string;
  requisition_id: string;
  candidate_id: string;
  stage: 'application' | 'screening' | 'phone_interview' | 'technical_interview' | 'final_interview' | 'reference_check' | 'offer_extended' | 'offer_accepted' | 'rejected';
  status: 'active' | 'on_hold' | 'rejected' | 'hired';
  interview_date?: string;
  interviewer_ids: string[];
  feedback?: string;
  score?: number;
  created_at: string;
  updated_at: string;
}

// Outsourcing Interfaces
interface Vendor {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  website?: string;
  services: string[];
  specializations: string[];
  location?: string;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  rating?: number;
  status: 'active' | 'inactive' | 'blacklisted';
  contract_type: 'hourly' | 'project_based' | 'retainer' | 'outcome_based';
  created_at: string;
}

interface OutsourcingProject {
  id: string;
  title: string;
  description: string;
  vendor_id?: string;
  department_id: string;
  project_manager_id: string;
  budget?: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  status: 'planning' | 'vendor_selection' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deliverables: string[];
  milestones?: { name: string; deadline: string; completed: boolean }[];
  created_at: string;
  updated_at: string;
}

interface Contractor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  hourly_rate?: number;
  currency?: string;
  availability: 'available' | 'busy' | 'unavailable';
  vendor_id?: string;
  current_projects: string[];
  rating?: number;
  total_hours_worked?: number;
  created_at: string;
}

interface ProfessionalHRInterfaceProps {
  setCurrentView?: (view: string) => void;
  defaultTab?: string;
}

const ProfessionalHRInterface: React.FC<ProfessionalHRInterfaceProps> = ({ setCurrentView, defaultTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // New module states
  const [talentCandidates, setTalentCandidates] = useState<TalentCandidate[]>([]);
  const [talentPools, setTalentPools] = useState<TalentPool[]>([]);
  const [jobRequisitions, setJobRequisitions] = useState<JobRequisition[]>([]);
  const [acquisitionPipelines, setAcquisitionPipelines] = useState<AcquisitionPipeline[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [outsourcingProjects, setOutsourcingProjects] = useState<OutsourcingProject[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);

  // Update active tab when defaultTab prop changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // View modes
  const [employeeViewMode, setEmployeeViewMode] = useState<'card' | 'list'>('card');
  const [departmentViewMode, setDepartmentViewMode] = useState<'card' | 'list'>('card');

  // Multi-selection states
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<Set<string>>(new Set());

  // Detail view states
  const [viewingEmployee, setViewingEmployee] = useState<any>(null);
  const [viewingDepartment, setViewingDepartment] = useState<any>(null);

  // Modal states
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

  useEffect(() => {
    fetchHRData();
  }, []);

  const fetchHRData = async () => {
    try {
      setLoading(true);
      const [employeesRes, departmentsRes, positionsRes, timeOffRes] = await Promise.all([
        supabase.from('employees').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('departments').select('*').order('name'),
        supabase.from('positions').select('*').order('title'),
        supabase.from('time_off_requests').select('*').order('created_at', { ascending: false })
      ]);

      if (employeesRes.data) setEmployees(employeesRes.data);
      if (departmentsRes.data) setDepartments(departmentsRes.data);
      if (positionsRes.data) setPositions(positionsRes.data);
      if (timeOffRes.data) setTimeOffRequests(timeOffRes.data);
    } catch (error) {
      console.error('Error fetching HR data:', error);
      toast.error('Failed to load HR data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = () => {
    fetchHRData();
    toast.success('Data refreshed successfully');
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowEmployeeModal(true);
  };

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setShowDepartmentModal(true);
  };

  const handleEditDepartment = (department: any) => {
    setSelectedDepartment(department);
    setShowDepartmentModal(true);
  };

  // Multi-selection handlers
  const handleEmployeeSelect = (employeeId: string, isSelected: boolean) => {
    const newSelection = new Set(selectedEmployeeIds);
    if (isSelected) {
      newSelection.add(employeeId);
    } else {
      newSelection.delete(employeeId);
    }
    setSelectedEmployeeIds(newSelection);
  };

  const handleSelectAllEmployees = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedEmployeeIds(new Set(filteredEmployees.map(emp => emp.id)));
    } else {
      setSelectedEmployeeIds(new Set());
    }
  };

  const handleDepartmentSelect = (departmentId: string, isSelected: boolean) => {
    const newSelection = new Set(selectedDepartmentIds);
    if (isSelected) {
      newSelection.add(departmentId);
    } else {
      newSelection.delete(departmentId);
    }
    setSelectedDepartmentIds(newSelection);
  };

  const handleSelectAllDepartments = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedDepartmentIds(new Set(departments.map(dept => dept.id)));
    } else {
      setSelectedDepartmentIds(new Set());
    }
  };

  // Detail view handlers
  const handleViewEmployee = (employee: any) => {
    setViewingEmployee(employee);
  };

  const handleViewDepartment = (department: any) => {
    setViewingDepartment(department);
  };

  const handleBackToList = () => {
    setViewingEmployee(null);
    setViewingDepartment(null);
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(employee =>
    employee.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const activeEmployees = employees.filter(emp => emp.employment_status === 'active').length;
  const pendingTimeOff = timeOffRequests.filter(req => req.status === 'pending').length;
  const departmentCount = departments.length;

  const getEmployeeInitials = (employee: any) => {
    return `${employee.first_name?.charAt(0) || ''}${employee.last_name?.charAt(0) || ''}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-muted text-muted-foreground border-border';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full_time': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'part_time': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contract': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'intern': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render detail views
  if (viewingEmployee) {
    return (
      <EmployeeDetailView
        employee={viewingEmployee}
        onBack={handleBackToList}
        onEdit={handleEditEmployee}
      />
    );
  }

  if (viewingDepartment) {
    return (
      <DepartmentDetailView
        department={viewingDepartment}
        employees={employees}
        onBack={handleBackToList}
        onEdit={handleEditDepartment}
        onViewEmployee={handleViewEmployee}
      />
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl mb-8 shadow-xl shadow-slate-900/5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
          <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Human Resources
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Enterprise Workforce Management</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                Streamline talent management, optimize performance, and build exceptional teams with our comprehensive HR platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleAddEmployee}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/25 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="px-8 mb-8">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-2 shadow-lg shadow-slate-900/5">
            <nav className="flex space-x-1 overflow-x-auto">
              {[
                { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'employees', name: 'Employees', icon: <Users className="w-4 h-4" /> },
                { id: 'departments', name: 'Departments', icon: <Building2 className="w-4 h-4" /> },
                { id: 'positions', name: 'Positions', icon: <Briefcase className="w-4 h-4" /> },
                { id: 'recruitment', name: 'Recruitment', icon: <UserPlus className="w-4 h-4" /> },
                { id: 'performance', name: 'Performance', icon: <Award className="w-4 h-4" /> },
                { id: 'time-off', name: 'Time Off', icon: <Calendar className="w-4 h-4" /> },
                { id: 'analytics', name: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
                { id: 'talent-hunt', name: 'Talent Hunt', icon: <SearchIcon className="w-4 h-4" /> },
                { id: 'acquisition', name: 'Acquisition', icon: <UserCheck className="w-4 h-4" /> },
                { id: 'outsourcing', name: 'Outsourcing', icon: <Handshake className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 scale-105'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-md'
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

        {/* Enhanced Content */}
        <div className="px-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-blue-600/10 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{activeEmployees}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Active Employees</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 dark:text-green-400 font-medium">+12%</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">from last month</span>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-emerald-600/10 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/25">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">{departmentCount}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Departments</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">+2</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">new this quarter</span>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-amber-600/10 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-600/25">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">{pendingTimeOff}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Pending Requests</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-amber-600 dark:text-amber-400 font-medium">3</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">require approval</span>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-purple-600/10 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/25">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">4.2</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Avg Performance</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">+0.3</span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">from last review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Getting Started Section */}
            <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl mb-8 shadow-lg shadow-slate-900/5">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
              <div className="relative p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Quick Setup Guide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">Get your HR system up and running in minutes</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      step: 1,
                      title: 'Add Your First Employee',
                      description: 'Build your team directory',
                      action: () => handleAddEmployee(),
                      icon: <UserPlus className="w-5 h-5" />,
                      completed: employees.length > 0,
                      gradient: 'from-blue-500 to-blue-600'
                    },
                    {
                      step: 2,
                      title: 'Create Departments',
                      description: 'Organize your workforce',
                      action: () => handleAddDepartment(),
                      icon: <Building2 className="w-5 h-5" />,
                      completed: departments.length > 0,
                      gradient: 'from-emerald-500 to-emerald-600'
                    },
                    {
                      step: 3,
                      title: 'Configure Performance',
                      description: 'Set up review cycles',
                      action: () => setActiveTab('performance'),
                      icon: <Award className="w-5 h-5" />,
                      completed: false,
                      gradient: 'from-purple-500 to-purple-600'
                    }
                  ].map((step) => (
                    <div
                      key={step.step}
                      className={`group relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                        step.completed
                          ? 'ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-600/10'
                          : 'hover:shadow-lg hover:shadow-slate-900/10'
                      }`}
                      onClick={step.action}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/5 to-slate-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                            {step.completed ? <CheckCircle className="w-6 h-6 text-white" /> : <span className="text-white font-bold">{step.step}</span>}
                          </div>
                          <div className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">
                            {step.icon}
                          </div>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors duration-300">
                          {step.description}
                        </p>
                        {step.completed && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg shadow-slate-900/5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quick Access</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Jump to any section instantly</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab('employees')}
                      className="group w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white">Employee Directory</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                            {employees.length}
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('departments')}
                      className="group w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 hover:shadow-lg hover:shadow-emerald-600/10 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Building2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white">Departments</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium">
                            {departments.length}
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('positions')}
                      className="group w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 hover:shadow-lg hover:shadow-purple-600/10 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Briefcase className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white">Positions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
                            {positions.length}
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('time-off')}
                      className="group w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 hover:shadow-lg hover:shadow-amber-600/10 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white">Time Off Requests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium">
                            {pendingTimeOff}
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg shadow-slate-900/5">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5"></div>
                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Team Members</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Latest additions to your workforce</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {employees.slice(0, 5).map((employee) => (
                      <div key={employee.id} className="group flex items-center gap-4 p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-300 hover:-translate-y-0.5">
                        <div className="relative">
                          <Avatar className="w-12 h-12 ring-2 ring-white/50 dark:ring-slate-700/50 group-hover:ring-emerald-500/30 transition-all duration-300">
                            <AvatarImage src={employee.avatar_url} />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold">
                              {getEmployeeInitials(employee)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 truncate">
                            {employee.display_name || `${employee.first_name} ${employee.last_name}`}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{employee.email}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-xl text-xs font-semibold ${getStatusColor(employee.employment_status)} group-hover:scale-105 transition-transform duration-300`}>
                          {employee.employment_status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Employee Directory</h2>
                <p className="text-sm text-muted-foreground">Manage your team members</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>

                {/* View Toggle */}
                <div className="flex border border-border rounded-lg">
                  <Button
                    variant={employeeViewMode === 'card' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setEmployeeViewMode('card')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={employeeViewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setEmployeeViewMode('list')}
                    className="rounded-l-none border-l-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Button onClick={handleAddEmployee}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </div>

            {/* Multi-selection toolbar */}
            {selectedEmployeeIds.size > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedEmployeeIds.size} employee{selectedEmployeeIds.size > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedEmployeeIds(new Set())}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      Clear selection
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Card View */}
            {employeeViewMode === 'card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewEmployee(employee)}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedEmployeeIds.has(employee.id)}
                            onCheckedChange={(checked) => handleEmployeeSelect(employee.id, checked as boolean)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={employee.avatar_url} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getEmployeeInitials(employee)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {employee.display_name || `${employee.first_name} ${employee.last_name}`}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">{employee.employee_id}</p>
                          <p className="text-sm text-muted-foreground truncate">{employee.email}</p>

                          <div className="flex items-center space-x-2 mt-3">
                            <Badge className={getStatusColor(employee.employment_status)}>
                              {employee.employment_status}
                            </Badge>
                            <Badge className={getTypeColor(employee.employment_type)}>
                              {employee.employment_type?.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* List View */}
            {employeeViewMode === 'list' && (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="text-left py-3 px-6 font-medium text-foreground">
                            <Checkbox
                              checked={selectedEmployeeIds.size === filteredEmployees.length && filteredEmployees.length > 0}
                              onCheckedChange={handleSelectAllEmployees}
                            />
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">Employee</th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">ID</th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">Contact</th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">Status</th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">Type</th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">Department</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredEmployees.map((employee) => {
                          const department = departments.find(dept => dept.id === employee.department_id);
                          return (
                            <tr
                              key={employee.id}
                              className="hover:bg-muted/50 cursor-pointer"
                              onClick={() => handleViewEmployee(employee)}
                            >
                              <td className="py-4 px-6">
                                <Checkbox
                                  checked={selectedEmployeeIds.has(employee.id)}
                                  onCheckedChange={(checked) => handleEmployeeSelect(employee.id, checked as boolean)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={employee.avatar_url} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                      {getEmployeeInitials(employee)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-foreground">
                                      {employee.display_name || `${employee.first_name} ${employee.last_name}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-sm text-foreground">{employee.employee_id}</td>
                              <td className="py-4 px-6">
                                <div className="space-y-1">
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
                              </td>
                              <td className="py-4 px-6">
                                <Badge className={getStatusColor(employee.employment_status)}>
                                  {employee.employment_status}
                                </Badge>
                              </td>
                              <td className="py-4 px-6">
                                <Badge className={getTypeColor(employee.employment_type)}>
                                  {employee.employment_type?.replace('_', ' ')}
                                </Badge>
                              </td>
                              <td className="py-4 px-6 text-sm text-foreground">
                                {department?.name || 'No Department'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {filteredEmployees.length === 0 && (
                    <div className="py-12 text-center">
                      <Users className="w-16 h-16 text-muted-foreground/60 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No employees found</h3>
                      <p className="text-muted-foreground">Try adjusting your search criteria or add new employees.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Departments</h2>
                <p className="text-sm text-muted-foreground">Manage organizational structure</p>
              </div>
              <div className="flex items-center space-x-2">
                {/* View Toggle */}
                <div className="flex border border-border rounded-lg">
                  <Button
                    variant={departmentViewMode === 'card' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDepartmentViewMode('card')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={departmentViewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDepartmentViewMode('list')}
                    className="rounded-l-none border-l-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Button onClick={handleAddDepartment}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>
              </div>
            </div>

            {/* Multi-selection toolbar */}
            {selectedDepartmentIds.size > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedDepartmentIds.size} department{selectedDepartmentIds.size > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDepartmentIds(new Set())}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      Clear selection
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Card View */}
            {departmentViewMode === 'card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => {
                  const deptEmployees = employees.filter(emp => emp.department_id === dept.id);
                  return (
                    <Card key={dept.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDepartment(dept)}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3 mb-4">
                          <Checkbox
                            checked={selectedDepartmentIds.has(dept.id)}
                            onCheckedChange={(checked) => handleDepartmentSelect(dept.id, checked as boolean)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-foreground">{dept.name}</h3>
                              <Badge variant="outline">{deptEmployees.length} employees</Badge>
                            </div>
                            {dept.description && (
                              <p className="text-sm text-muted-foreground mt-2 mb-4">{dept.description}</p>
                            )}
                            <div className="flex -space-x-2">
                              {deptEmployees.slice(0, 5).map((employee) => (
                                <Avatar key={employee.id} className="w-8 h-8 border-2 border-white">
                                  <AvatarImage src={employee.avatar_url} />
                                  <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                    {getEmployeeInitials(employee)}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {deptEmployees.length > 5 && (
                                <div className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">+{deptEmployees.length - 5}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {departmentViewMode === 'list' && (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="text-left py-3 px-6 font-medium text-foreground">
                            <Checkbox
                              checked={selectedDepartmentIds.size === departments.length && departments.length > 0}
                              onCheckedChange={handleSelectAllDepartments}
                            />
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">Department</th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">Description</th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">Employees</th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">Manager</th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">Location</th>
                          <th className="text-left py-3 px-6 font-medium text-foreground">Budget</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {departments.map((dept) => {
                          const deptEmployees = employees.filter(emp => emp.department_id === dept.id);
                          const manager = employees.find(emp => emp.id === dept.manager_id);
                          return (
                            <tr
                              key={dept.id}
                              className="hover:bg-muted/50 cursor-pointer"
                              onClick={() => handleViewDepartment(dept)}
                            >
                              <td className="py-4 px-6">
                                <Checkbox
                                  checked={selectedDepartmentIds.has(dept.id)}
                                  onCheckedChange={(checked) => handleDepartmentSelect(dept.id, checked as boolean)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">{dept.name}</p>
                                    <p className="text-sm text-muted-foreground">Department</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-sm text-foreground max-w-xs">
                                <p className="truncate">{dept.description || 'No description'}</p>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                                    {deptEmployees.length} members
                                  </Badge>
                                  <div className="flex -space-x-1">
                                    {deptEmployees.slice(0, 3).map((employee) => (
                                      <Avatar key={employee.id} className="w-6 h-6 border-2 border-white">
                                        <AvatarImage src={employee.avatar_url} />
                                        <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                          {getEmployeeInitials(employee)}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {deptEmployees.length > 3 && (
                                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-white flex items-center justify-center">
                                        <span className="text-xs text-muted-foreground">+{deptEmployees.length - 3}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                {manager ? (
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage src={manager.avatar_url} />
                                      <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                                        {getEmployeeInitials(manager)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">
                                        {manager.display_name || `${manager.first_name} ${manager.last_name}`}
                                      </p>
                                      <p className="text-xs text-muted-foreground">Manager</p>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">No manager assigned</span>
                                )}
                              </td>
                              <td className="py-4 px-6">
                                {dept.location ? (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {dept.location}
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">Not specified</span>
                                )}
                              </td>
                              <td className="py-4 px-6">
                                {dept.budget ? (
                                  <span className="text-sm text-foreground font-medium">
                                    ${dept.budget.toLocaleString()}
                                  </span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">Not set</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {departments.length === 0 && (
                    <div className="py-12 text-center">
                      <Building2 className="w-16 h-16 text-muted-foreground/60 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No departments found</h3>
                      <p className="text-muted-foreground">Create your first department to get started.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Positions Tab */}
        {activeTab === 'positions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Positions</h2>
                <p className="text-sm text-muted-foreground">Manage job positions and roles</p>
              </div>
              <Button onClick={() => toast.info('Position management coming soon')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Position
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions.map((position) => (
                <Card key={position.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{position.title}</h3>
                        <p className="text-sm text-muted-foreground">{position.level || 'No level specified'}</p>
                        {position.description && (
                          <p className="text-sm text-muted-foreground mt-2">{position.description}</p>
                        )}
                        <div className="mt-3">
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            {departments.find(d => d.id === position.department_id)?.name || 'No Department'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {positions.length === 0 && (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Briefcase className="w-16 h-16 text-muted-foreground/60 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No positions found</h3>
                      <p className="text-muted-foreground">Create your first position to get started.</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recruitment Tab */}
        {activeTab === 'recruitment' && (
          <Card>
            <CardContent className="p-12 text-center">
              <UserPlus className="w-16 h-16 text-muted-foreground/60 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Recruitment Pipeline</h3>
              <p className="text-muted-foreground mb-4">
                Manage job postings, candidates, interviews, and hiring process.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-6">
                <Button variant="outline" onClick={() => toast.info('Job postings coming soon')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Job Postings
                </Button>
                <Button variant="outline" onClick={() => toast.info('Candidates coming soon')}>
                  <Users className="w-4 h-4 mr-2" />
                  Candidates
                </Button>
                <Button variant="outline" onClick={() => toast.info('Interviews coming soon')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Interviews
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Talent Hunt Tab */}
        {activeTab === 'talent-hunt' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Talent Hunt</h2>
                <p className="text-sm text-muted-foreground">Source, track, and manage potential candidates</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => toast.info('Import from LinkedIn coming soon')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Import from LinkedIn
                </Button>
                <Button onClick={() => toast.info('Add candidate coming soon')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Candidate
                </Button>
              </div>
            </div>

            {/* Talent Pools */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-blue-600" />
                    Talent Pools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'Frontend Developers', count: 45, color: 'bg-blue-100 text-blue-800' },
                    { name: 'Backend Engineers', count: 32, color: 'bg-green-100 text-green-800' },
                    { name: 'Data Scientists', count: 18, color: 'bg-purple-100 text-purple-800' },
                    { name: 'Product Managers', count: 12, color: 'bg-orange-100 text-orange-800' },
                    { name: 'UX Designers', count: 24, color: 'bg-pink-100 text-pink-800' }
                  ].map((pool, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div>
                        <p className="font-medium text-foreground">{pool.name}</p>
                        <p className="text-sm text-muted-foreground">{pool.count} candidates</p>
                      </div>
                      <Badge className={pool.color}>{pool.count}</Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Pool
                  </Button>
                </CardContent>
              </Card>

              {/* Candidate Pipeline */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Candidate Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { stage: 'Sourced', count: 28, color: 'bg-muted' },
                      { stage: 'Contacted', count: 15, color: 'bg-blue-100' },
                      { stage: 'Interested', count: 8, color: 'bg-yellow-100' },
                      { stage: 'Interview Scheduled', count: 4, color: 'bg-orange-100' },
                      { stage: 'Hired', count: 2, color: 'bg-green-100' }
                    ].map((stage) => (
                      <div key={stage.stage} className={`p-4 rounded-lg ${stage.color}`}>
                        <h3 className="font-medium text-foreground mb-2">{stage.stage}</h3>
                        <p className="text-2xl font-bold text-foreground">{stage.count}</p>
                        <div className="mt-3 space-y-2">
                          {Array.from({ length: Math.min(stage.count, 3) }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <PersonStanding className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm text-foreground">Candidate {i + 1}</span>
                            </div>
                          ))}
                          {stage.count > 3 && (
                            <p className="text-xs text-muted-foreground">+{stage.count - 3} more</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Candidates */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Sarah Johnson',
                      position: 'Senior Frontend Developer',
                      company: 'Tech Corp',
                      experience: 5,
                      skills: ['React', 'TypeScript', 'Node.js'],
                      source: 'LinkedIn',
                      stage: 'contacted'
                    },
                    {
                      name: 'Michael Chen',
                      position: 'Data Scientist',
                      company: 'AI Innovations',
                      experience: 3,
                      skills: ['Python', 'Machine Learning', 'TensorFlow'],
                      source: 'Referral',
                      stage: 'interested'
                    },
                    {
                      name: 'Emily Rodriguez',
                      position: 'UX Designer',
                      company: 'Design Studio',
                      experience: 4,
                      skills: ['Figma', 'User Research', 'Prototyping'],
                      source: 'Job Board',
                      stage: 'interview_scheduled'
                    }
                  ].map((candidate, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-foreground">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.position} at {candidate.company}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {candidate.experience}y exp
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {candidate.source}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Badge className={
                          candidate.stage === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          candidate.stage === 'interested' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-orange-100 text-orange-800'
                        }>
                          {candidate.stage.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Acquisition Tab */}
        {activeTab === 'acquisition' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Talent Acquisition</h2>
                <p className="text-sm text-muted-foreground">Manage job requisitions and hiring workflows</p>
              </div>
              <Button onClick={() => toast.info('Create requisition coming soon')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Requisition
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Open Positions</p>
                      <p className="text-2xl font-bold text-foreground">12</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Candidates</p>
                      <p className="text-2xl font-bold text-foreground">45</p>
                    </div>
                    <Users2 className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Interviews This Week</p>
                      <p className="text-2xl font-bold text-foreground">8</p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Time to Hire</p>
                      <p className="text-2xl font-bold text-foreground">24d</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Requisitions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Job Requisitions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Senior React Developer',
                      department: 'Engineering',
                      urgency: 'high',
                      candidates: 12,
                      deadline: '2024-11-15',
                      status: 'open'
                    },
                    {
                      title: 'Product Manager',
                      department: 'Product',
                      urgency: 'medium',
                      candidates: 8,
                      deadline: '2024-12-01',
                      status: 'open'
                    },
                    {
                      title: 'UX Designer',
                      department: 'Design',
                      urgency: 'low',
                      candidates: 15,
                      deadline: '2024-12-15',
                      status: 'open'
                    }
                  ].map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{req.title}</h3>
                          <p className="text-sm text-muted-foreground">{departments.find(d => d.name === req.department)?.name || req.department}</p>
                          <p className="text-xs text-muted-foreground">Deadline: {new Date(req.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={
                            req.urgency === 'high' ? 'bg-red-100 text-red-800' :
                            req.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {req.urgency} priority
                          </Badge>
                          <Badge variant="outline">
                            {req.candidates} candidates
                          </Badge>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {req.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Outsourcing Tab */}
        {activeTab === 'outsourcing' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Outsourcing Management</h2>
                <p className="text-sm text-muted-foreground">Manage vendors, contractors, and outsourced projects</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => toast.info('Add vendor coming soon')}>
                  <Building2 className="w-4 h-4 mr-2" />
                  Add Vendor
                </Button>
                <Button onClick={() => toast.info('Create project coming soon')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>

            {/* Outsourcing Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Vendors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-blue-600" />
                    Active Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'TechSolutions Inc.', rating: 4.8, projects: 3, specialization: 'Web Development' },
                    { name: 'CloudExperts Ltd.', rating: 4.9, projects: 2, specialization: 'Cloud Infrastructure' },
                    { name: 'DataAnalytics Pro', rating: 4.6, projects: 1, specialization: 'Data Science' },
                    { name: 'UX Design Studio', rating: 4.7, projects: 2, specialization: 'UI/UX Design' }
                  ].map((vendor, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-foreground">{vendor.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-muted-foreground">{vendor.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{vendor.specialization}</p>
                      <Badge variant="outline" className="text-xs">
                        {vendor.projects} active projects
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Active Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileContract className="w-5 h-5 text-green-600" />
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'Mobile App Development', vendor: 'TechSolutions Inc.', budget: 50000, progress: 75 },
                    { name: 'Cloud Migration', vendor: 'CloudExperts Ltd.', budget: 30000, progress: 45 },
                    { name: 'Data Pipeline Setup', vendor: 'DataAnalytics Pro', budget: 25000, progress: 90 },
                    { name: 'Website Redesign', vendor: 'UX Design Studio', budget: 15000, progress: 60 }
                  ].map((project, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg">
                      <h3 className="font-medium text-foreground mb-1">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{project.vendor}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">${project.budget.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Budget & Spend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Budget & Spend
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Total Budget</span>
                      <span className="text-lg font-bold text-foreground">$250,000</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Spent</span>
                      <span className="text-lg font-bold text-purple-600">$120,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">48% of budget utilized</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Spend by Category</h4>
                    {[
                      { category: 'Development', amount: 65000, color: 'bg-blue-500' },
                      { category: 'Infrastructure', amount: 30000, color: 'bg-green-500' },
                      { category: 'Design', amount: 15000, color: 'bg-purple-500' },
                      { category: 'Analytics', amount: 10000, color: 'bg-orange-500' }
                    ].map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm text-foreground">{item.category}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contractor Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Contractors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Alex Thompson', skills: ['React', 'Node.js'], rate: 85, rating: 4.9, hours: 320 },
                    { name: 'Maria Garcia', skills: ['Python', 'AWS'], rate: 90, rating: 4.8, hours: 280 },
                    { name: 'David Kim', skills: ['Figma', 'UI/UX'], rate: 75, rating: 4.9, hours: 240 },
                    { name: 'Sophie Chen', skills: ['Data Science', 'ML'], rate: 95, rating: 4.7, hours: 200 },
                    { name: 'James Wilson', skills: ['DevOps', 'Docker'], rate: 80, rating: 4.8, hours: 300 },
                    { name: 'Emma Davis', skills: ['Mobile', 'Flutter'], rate: 70, rating: 4.6, hours: 180 }
                  ].map((contractor, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {contractor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-foreground">{contractor.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-sm text-muted-foreground">{contractor.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {contractor.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">${contractor.rate}/hr</span>
                          <span className="text-muted-foreground">{contractor.hours}h total</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HR Analytics & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Headcount Growth</p>
                        <p className="text-2xl font-bold text-foreground">+12%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Performance</p>
                        <p className="text-2xl font-bold text-foreground">4.2/5</p>
                      </div>
                      <Award className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Time Off Usage</p>
                        <p className="text-2xl font-bold text-foreground">68%</p>
                      </div>
                      <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Retention Rate</p>
                        <p className="text-2xl font-bold text-foreground">94%</p>
                      </div>
                      <Target className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
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
                    const percentage = employees.length > 0 ? (deptEmployees.length / employees.length) * 100 : 0;
                    return (
                      <div key={dept.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{dept.name}</p>
                          <p className="text-sm text-muted-foreground">{deptEmployees.length} employees</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Time Off Tab */}
        {activeTab === 'time-off' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Time Off Requests</h2>
                <p className="text-sm text-muted-foreground">Review and manage leave requests</p>
              </div>
            </div>

            <div className="space-y-4">
              {timeOffRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No time off requests</h3>
                    <p className="text-muted-foreground">When employees submit time off requests, they'll appear here.</p>
                  </CardContent>
                </Card>
              ) : (
                timeOffRequests.map((request) => {
                  const employee = employees.find(emp => emp.id === request.employee_id);
                  return (
                    <Card key={request.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={employee?.avatar_url} />
                              <AvatarFallback>
                                {employee ? getEmployeeInitials(employee) : 'N/A'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{employee?.display_name || 'Unknown Employee'}</h3>
                              <p className="text-sm text-muted-foreground">
                                {request.request_type} • {request.total_days} days
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }>
                            {request.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Performance Management</h3>
              <p className="text-muted-foreground mb-4">
                Track employee performance, set goals, and conduct reviews.
              </p>
              <Button>
                <Target className="w-4 h-4 mr-2" />
                Set Up Performance Reviews
              </Button>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>

    {/* Modals */}
    <EmployeeModal
        isOpen={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onSuccess={handleRefreshData}
      />

    <DepartmentModal
        isOpen={showDepartmentModal}
        onClose={() => {
          setShowDepartmentModal(false);
          setSelectedDepartment(null);
        }}
        department={selectedDepartment}
        onSuccess={handleRefreshData}
      />
    </>
  );
};

export default ProfessionalHRInterface;