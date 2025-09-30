'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Plus,
  Clock,
  Target,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Building2,
  Briefcase,
  DollarSign,
  Eye,
  Edit2,
  MoreHorizontal,
  Filter,
  Search,
  Award,
  Activity
} from 'lucide-react';

interface JobRequisition {
  id: string;
  title: string;
  description: string;
  department_id: string;
  department_name: string;
  position_level: 'junior' | 'mid' | 'senior' | 'lead' | 'manager';
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  location: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_years_min: number;
  experience_years_max?: number;
  status: 'draft' | 'open' | 'on_hold' | 'filled' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  hiring_manager_id: string;
  hiring_manager_name: string;
  recruiter_id?: string;
  recruiter_name?: string;
  active_candidates: number;
  total_applications: number;
  interviews_scheduled: number;
  offers_extended: number;
  created_at: string;
  updated_at: string;
}

interface HiringMetric {
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface AcquisitionInterfaceProps {
  setCurrentView?: (view: string) => void;
}

const AcquisitionInterface: React.FC<AcquisitionInterfaceProps> = ({ setCurrentView }) => {
  const [requisitions, setRequisitions] = useState<JobRequisition[]>([]);
  const [metrics, setMetrics] = useState<HiringMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockRequisitions: JobRequisition[] = [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        description: 'We are looking for an experienced Frontend Developer to join our team.',
        department_id: 'tech',
        department_name: 'Engineering',
        position_level: 'senior',
        employment_type: 'full_time',
        location: 'San Francisco, CA',
        salary_min: 120000,
        salary_max: 160000,
        currency: 'USD',
        required_skills: ['React', 'TypeScript', 'Node.js'],
        preferred_skills: ['Next.js', 'GraphQL', 'AWS'],
        experience_years_min: 5,
        experience_years_max: 8,
        status: 'open',
        priority: 'high',
        deadline: '2024-03-01',
        hiring_manager_id: 'hm1',
        hiring_manager_name: 'John Smith',
        recruiter_id: 'rec1',
        recruiter_name: 'Sarah Johnson',
        active_candidates: 8,
        total_applications: 25,
        interviews_scheduled: 3,
        offers_extended: 1,
        created_at: '2024-01-15',
        updated_at: '2024-01-20'
      },
      {
        id: '2',
        title: 'DevOps Engineer',
        description: 'Seeking a DevOps Engineer to help scale our infrastructure.',
        department_id: 'tech',
        department_name: 'Engineering',
        position_level: 'mid',
        employment_type: 'full_time',
        location: 'Remote',
        salary_min: 100000,
        salary_max: 130000,
        currency: 'USD',
        required_skills: ['AWS', 'Docker', 'Kubernetes'],
        preferred_skills: ['Terraform', 'Jenkins', 'Python'],
        experience_years_min: 3,
        experience_years_max: 6,
        status: 'open',
        priority: 'medium',
        deadline: '2024-02-28',
        hiring_manager_id: 'hm2',
        hiring_manager_name: 'Mike Chen',
        active_candidates: 12,
        total_applications: 18,
        interviews_scheduled: 5,
        offers_extended: 0,
        created_at: '2024-01-10',
        updated_at: '2024-01-19'
      },
      {
        id: '3',
        title: 'Product Manager',
        description: 'Looking for a Product Manager to drive product strategy.',
        department_id: 'product',
        department_name: 'Product',
        position_level: 'senior',
        employment_type: 'full_time',
        location: 'New York, NY',
        salary_min: 140000,
        salary_max: 180000,
        currency: 'USD',
        required_skills: ['Product Strategy', 'Analytics', 'Roadmapping'],
        preferred_skills: ['Agile', 'SQL', 'Figma'],
        experience_years_min: 6,
        experience_years_max: 10,
        status: 'on_hold',
        priority: 'low',
        hiring_manager_id: 'hm3',
        hiring_manager_name: 'Emily Rodriguez',
        active_candidates: 5,
        total_applications: 32,
        interviews_scheduled: 1,
        offers_extended: 0,
        created_at: '2024-01-05',
        updated_at: '2024-01-18'
      }
    ];

    const mockMetrics: HiringMetric[] = [
      { metric: 'Time to Hire', value: 24, unit: 'days', trend: 'down', change: -3 },
      { metric: 'Active Candidates', value: 156, unit: 'candidates', trend: 'up', change: 12 },
      { metric: 'Interview Rate', value: 68, unit: '%', trend: 'up', change: 5 },
      { metric: 'Offer Acceptance', value: 85, unit: '%', trend: 'stable', change: 0 }
    ];

    setRequisitions(mockRequisitions);
    setMetrics(mockMetrics);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'open': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'filled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.required_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || req.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || req.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusStats = requisitions.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Talent Acquisition</h1>
              <p className="text-gray-600">Manage job requisitions and hiring workflows</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => toast.info('Analytics coming soon')}>
                <Award className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button onClick={() => toast.info('Create requisition coming soon')}>
                <Plus className="w-4 h-4 mr-2" />
                New Requisition
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{metric.metric}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {metric.value}
                        </span>
                        <span className="text-sm text-gray-600">{metric.unit}</span>
                      </div>
                      {metric.change !== 0 && (
                        <div className={`flex items-center gap-1 text-sm ${
                          metric.trend === 'up' ? 'text-green-600' :
                          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {getTrendIcon(metric.trend)}
                          <span>{Math.abs(metric.change)}{metric.unit}</span>
                        </div>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Requisition Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { status: 'draft', label: 'Draft', count: statusStats.draft || 0, color: 'text-gray-600' },
                  { status: 'open', label: 'Open', count: statusStats.open || 0, color: 'text-green-600' },
                  { status: 'on_hold', label: 'On Hold', count: statusStats.on_hold || 0, color: 'text-yellow-600' },
                  { status: 'filled', label: 'Filled', count: statusStats.filled || 0, color: 'text-blue-600' },
                  { status: 'cancelled', label: 'Cancelled', count: statusStats.cancelled || 0, color: 'text-red-600' }
                ].map((item) => (
                  <div key={item.status} className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search requisitions by title, department, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="open">Open</option>
                    <option value="on_hold">On Hold</option>
                    <option value="filled">Filled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requisitions List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Job Requisitions ({filteredRequisitions.length})</span>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequisitions.map((requisition) => (
                  <div key={requisition.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{requisition.title}</h3>
                          <Badge className={getStatusColor(requisition.status)}>
                            {requisition.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(requisition.priority)}>
                            {requisition.priority}
                          </Badge>
                          {requisition.deadline && new Date(requisition.deadline) < new Date() && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span>{requisition.department_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{requisition.position_level} • {requisition.employment_type.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              ${requisition.salary_min?.toLocaleString()} - ${requisition.salary_max?.toLocaleString()}
                            </span>
                          </div>
                          {requisition.deadline && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {new Date(requisition.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {requisition.active_candidates} active candidates
                          </span>
                          <span>{requisition.total_applications} applications</span>
                          <span>{requisition.interviews_scheduled} interviews</span>
                          <span>{requisition.offers_extended} offers</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-gray-600">HM: {requisition.hiring_manager_name}</span>
                          {requisition.recruiter_name && (
                            <span className="text-sm text-gray-600">• Recruiter: {requisition.recruiter_name}</span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {requisition.required_skills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {requisition.required_skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{requisition.required_skills.length - 5} more
                            </Badge>
                          )}
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
        </div>
      </div>
    </div>
  );
};

export default AcquisitionInterface;