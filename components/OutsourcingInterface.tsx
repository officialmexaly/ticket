'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Plus,
  Handshake,
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  Star,
  Clock,
  Target,
  Building2,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Eye,
  Edit2,
  MoreHorizontal,
  Filter,
  Search,
  Activity,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  specializations: string[];
  location?: string;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  rating?: number;
  status: 'active' | 'inactive' | 'blacklisted';
  contract_type: 'hourly' | 'project_based' | 'retainer' | 'outcome_based';
  active_projects: number;
  completed_projects: number;
  total_spent: number;
  last_project_date?: string;
  created_at: string;
}

interface OutsourcingProject {
  id: string;
  title: string;
  description: string;
  vendor_id?: string;
  vendor_name?: string;
  department_id: string;
  department_name: string;
  project_manager_id: string;
  project_manager_name: string;
  budget?: number;
  spent?: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  status: 'planning' | 'vendor_selection' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deliverables: string[];
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

interface Contractor {
  id: string;
  name: string;
  email: string;
  skills: string[];
  hourly_rate?: number;
  currency?: string;
  availability: 'available' | 'busy' | 'unavailable';
  vendor_id?: string;
  vendor_name?: string;
  current_projects: string[];
  rating?: number;
  total_hours_worked?: number;
  projects_completed?: number;
  created_at: string;
}

interface OutsourcingInterfaceProps {
  setCurrentView?: (view: string) => void;
}

const OutsourcingInterface: React.FC<OutsourcingInterfaceProps> = ({ setCurrentView }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [projects, setProjects] = useState<OutsourcingProject[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [activeTab, setActiveTab] = useState<'vendors' | 'projects' | 'contractors'>('vendors');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockVendors: Vendor[] = [
      {
        id: '1',
        name: 'TechSolutions Inc',
        company: 'TechSolutions Inc',
        email: 'contact@techsolutions.com',
        phone: '+1-555-0123',
        website: 'https://techsolutions.com',
        specializations: ['Web Development', 'Mobile Apps', 'Cloud Services'],
        location: 'San Francisco, CA',
        hourly_rate_min: 80,
        hourly_rate_max: 150,
        rating: 4.8,
        status: 'active',
        contract_type: 'hourly',
        active_projects: 3,
        completed_projects: 15,
        total_spent: 180000,
        last_project_date: '2024-01-15',
        created_at: '2023-06-01'
      },
      {
        id: '2',
        name: 'Design Masters',
        company: 'Design Masters LLC',
        email: 'hello@designmasters.com',
        specializations: ['UI/UX Design', 'Branding', 'Graphic Design'],
        location: 'Austin, TX',
        hourly_rate_min: 60,
        hourly_rate_max: 120,
        rating: 4.5,
        status: 'active',
        contract_type: 'project_based',
        active_projects: 2,
        completed_projects: 8,
        total_spent: 95000,
        last_project_date: '2024-01-10',
        created_at: '2023-08-15'
      },
      {
        id: '3',
        name: 'DataFlow Analytics',
        company: 'DataFlow Analytics Corp',
        email: 'info@dataflow.com',
        specializations: ['Data Science', 'Machine Learning', 'Business Intelligence'],
        location: 'Seattle, WA',
        hourly_rate_min: 100,
        hourly_rate_max: 200,
        rating: 4.9,
        status: 'active',
        contract_type: 'retainer',
        active_projects: 1,
        completed_projects: 12,
        total_spent: 250000,
        last_project_date: '2024-01-20',
        created_at: '2023-04-10'
      }
    ];

    const mockProjects: OutsourcingProject[] = [
      {
        id: '1',
        title: 'E-commerce Platform Redesign',
        description: 'Complete redesign of our e-commerce platform with modern UI/UX',
        vendor_id: '2',
        vendor_name: 'Design Masters',
        department_id: 'product',
        department_name: 'Product',
        project_manager_id: 'pm1',
        project_manager_name: 'Sarah Johnson',
        budget: 50000,
        spent: 35000,
        currency: 'USD',
        start_date: '2024-01-01',
        end_date: '2024-03-31',
        status: 'in_progress',
        priority: 'high',
        deliverables: ['Design System', 'UI Mockups', 'Prototype'],
        completion_percentage: 70,
        created_at: '2023-12-15',
        updated_at: '2024-01-20'
      },
      {
        id: '2',
        title: 'Mobile App Development',
        description: 'Native iOS and Android app development',
        vendor_id: '1',
        vendor_name: 'TechSolutions Inc',
        department_id: 'tech',
        department_name: 'Engineering',
        project_manager_id: 'pm2',
        project_manager_name: 'Mike Chen',
        budget: 80000,
        spent: 60000,
        currency: 'USD',
        start_date: '2023-11-01',
        end_date: '2024-02-29',
        status: 'in_progress',
        priority: 'critical',
        deliverables: ['iOS App', 'Android App', 'Backend API'],
        completion_percentage: 75,
        created_at: '2023-10-15',
        updated_at: '2024-01-19'
      },
      {
        id: '3',
        title: 'Data Analytics Dashboard',
        description: 'Business intelligence dashboard for sales analytics',
        vendor_id: '3',
        vendor_name: 'DataFlow Analytics',
        department_id: 'sales',
        department_name: 'Sales',
        project_manager_id: 'pm3',
        project_manager_name: 'Emily Rodriguez',
        budget: 30000,
        spent: 30000,
        currency: 'USD',
        start_date: '2023-10-01',
        end_date: '2023-12-31',
        status: 'completed',
        priority: 'medium',
        deliverables: ['Dashboard', 'Data Pipeline', 'Reports'],
        completion_percentage: 100,
        created_at: '2023-09-15',
        updated_at: '2024-01-05'
      }
    ];

    const mockContractors: Contractor[] = [
      {
        id: '1',
        name: 'Alex Thompson',
        email: 'alex@techsolutions.com',
        skills: ['React', 'Node.js', 'AWS'],
        hourly_rate: 120,
        currency: 'USD',
        availability: 'busy',
        vendor_id: '1',
        vendor_name: 'TechSolutions Inc',
        current_projects: ['1', '2'],
        rating: 4.7,
        total_hours_worked: 480,
        projects_completed: 8,
        created_at: '2023-06-15'
      },
      {
        id: '2',
        name: 'Maria Garcia',
        email: 'maria@designmasters.com',
        skills: ['UI Design', 'Figma', 'Prototyping'],
        hourly_rate: 90,
        currency: 'USD',
        availability: 'available',
        vendor_id: '2',
        vendor_name: 'Design Masters',
        current_projects: ['1'],
        rating: 4.9,
        total_hours_worked: 320,
        projects_completed: 5,
        created_at: '2023-08-20'
      }
    ];

    setVendors(mockVendors);
    setProjects(mockProjects);
    setContractors(mockContractors);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'available': case 'in_progress': case 'completed':
        return 'bg-green-100 text-green-800';
      case 'inactive': case 'busy': case 'on_hold': case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'blacklisted': case 'unavailable': case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'vendor_selection':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0);
  const totalSpent = projects.reduce((sum, project) => sum + (project.spent || 0), 0);
  const activeProjectsCount = projects.filter(p => p.status === 'in_progress').length;
  const averageVendorRating = vendors.reduce((sum, vendor) => sum + (vendor.rating || 0), 0) / vendors.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Outsourcing Management</h1>
              <p className="text-gray-600">Manage vendors, projects, and contractor relationships</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => toast.info('Reports coming soon')}>
                <Activity className="w-4 h-4 mr-2" />
                View Reports
              </Button>
              <Button onClick={() => toast.info('Add vendor coming soon')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Vendor
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'vendors', name: 'Vendors', icon: <Handshake className="w-4 h-4" /> },
                { id: 'projects', name: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
                { id: 'contractors', name: 'Contractors', icon: <Users className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalBudget.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalSpent.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of budget
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProjectsCount}</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Vendor Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {averageVendorRating.toFixed(1)}
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(averageVendorRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        {activeTab === 'vendors' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Vendors ({vendors.length})</span>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{vendor.company}</h3>
                          <Badge className={getStatusColor(vendor.status)}>
                            {vendor.status}
                          </Badge>
                          {vendor.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{vendor.rating}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{vendor.email}</span>
                          </div>
                          {vendor.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{vendor.phone}</span>
                            </div>
                          )}
                          {vendor.location && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              <span>{vendor.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              ${vendor.hourly_rate_min} - ${vendor.hourly_rate_max}/hr
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>{vendor.active_projects} active projects</span>
                          <span>{vendor.completed_projects} completed</span>
                          <span>${vendor.total_spent.toLocaleString()} total spent</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {vendor.specializations.map((spec, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'projects' && (
          <Card>
            <CardHeader>
              <CardTitle>Projects ({projects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{project.title}</h3>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Vendor:</span> {project.vendor_name || 'Not assigned'}
                          </div>
                          <div>
                            <span className="font-medium">PM:</span> {project.project_manager_name}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span> {project.department_name}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>Budget: ${project.budget?.toLocaleString()}</span>
                          <span>Spent: ${project.spent?.toLocaleString()}</span>
                          <span>Progress: {project.completion_percentage}%</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.completion_percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'contractors' && (
          <Card>
            <CardHeader>
              <CardTitle>Contractors ({contractors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contractors.map((contractor) => (
                  <div key={contractor.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{contractor.name}</h3>
                          <Badge className={getStatusColor(contractor.availability)}>
                            {contractor.availability}
                          </Badge>
                          {contractor.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{contractor.rating}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Email:</span> {contractor.email}
                          </div>
                          <div>
                            <span className="font-medium">Rate:</span> ${contractor.hourly_rate}/hr
                          </div>
                          <div>
                            <span className="font-medium">Vendor:</span> {contractor.vendor_name}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>{contractor.projects_completed} projects completed</span>
                          <span>{contractor.total_hours_worked} hours worked</span>
                          <span>{contractor.current_projects.length} active projects</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {contractor.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OutsourcingInterface;