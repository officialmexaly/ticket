'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Briefcase,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  logo?: string;
  department: string;
}

interface InterviewPosting {
  id: string;
  company: Company;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salary_range: { min: number; max: number };
  employment_type: string;
  interview_process: string[];
  status: 'active' | 'paused' | 'closed';
  posted_date: string;
  deadline: string;
  slots_available: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

const InterviewPostingManager: React.FC = () => {
  const [postings, setPostings] = useState<InterviewPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPosting, setEditingPosting] = useState<InterviewPosting | null>(null);

  const [newPosting, setNewPosting] = useState({
    company: { id: '', name: '', department: '' },
    title: '',
    description: '',
    requirements: [''],
    location: '',
    salary_range: { min: 0, max: 0 },
    employment_type: 'full-time',
    interview_process: [''],
    deadline: '',
    slots_available: 1
  });

  const companies = [
    { id: 'tech-corp', name: 'TechCorp Inc.', department: 'Engineering' },
    { id: 'design-studio', name: 'Creative Design Studio', department: 'Design' },
    { id: 'finance-group', name: 'Finance Group LLC', department: 'Finance' },
    { id: 'marketing-agency', name: 'Marketing Agency Pro', department: 'Marketing' }
  ];

  useEffect(() => {
    fetchPostings();
  }, []);

  const fetchPostings = async () => {
    try {
      const response = await fetch('/api/interview-postings');
      const data = await response.json();
      if (data.success) {
        setPostings(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch interview postings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePosting = async () => {
    try {
      const response = await fetch('/api/interview-postings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPosting)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Interview posting created successfully');
        setPostings([data.data, ...postings]);
        setShowCreateModal(false);
        resetForm();
      } else {
        toast.error(data.error || 'Failed to create posting');
      }
    } catch (error) {
      toast.error('Failed to create interview posting');
    }
  };

  const handleUpdatePosting = async (id: string, updates: Partial<InterviewPosting>) => {
    try {
      const response = await fetch(`/api/interview-postings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Posting updated successfully');
        setPostings(postings.map(p => p.id === id ? data.data : p));
      }
    } catch (error) {
      toast.error('Failed to update posting');
    }
  };

  const handleDeletePosting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this posting?')) return;

    try {
      const response = await fetch(`/api/interview-postings/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Posting deleted successfully');
        setPostings(postings.filter(p => p.id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete posting');
    }
  };

  const resetForm = () => {
    setNewPosting({
      company: { id: '', name: '', department: '' },
      title: '',
      description: '',
      requirements: [''],
      location: '',
      salary_range: { min: 0, max: 0 },
      employment_type: 'full-time',
      interview_process: [''],
      deadline: '',
      slots_available: 1
    });
  };

  const addRequirement = () => {
    setNewPosting(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setNewPosting(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const addInterviewStep = () => {
    setNewPosting(prev => ({
      ...prev,
      interview_process: [...prev.interview_process, '']
    }));
  };

  const updateInterviewStep = (index: number, value: string) => {
    setNewPosting(prev => ({
      ...prev,
      interview_process: prev.interview_process.map((step, i) => i === index ? value : step)
    }));
  };

  const filteredPostings = postings.filter(posting => {
    const matchesSearch = posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         posting.company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = !selectedCompany || posting.company.id === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interview Postings</h2>
          <p className="text-gray-600">Manage job postings and candidate assignments</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Interview Posting</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Company Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <select
                  value={newPosting.company.id}
                  onChange={(e) => {
                    const company = companies.find(c => c.id === e.target.value);
                    setNewPosting(prev => ({
                      ...prev,
                      company: company || { id: '', name: '', department: '' }
                    }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name} - {company.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title</label>
                  <Input
                    value={newPosting.title}
                    onChange={(e) => setNewPosting(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Senior Full Stack Developer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    value={newPosting.location}
                    onChange={(e) => setNewPosting(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., San Francisco, CA / Remote"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newPosting.description}
                  onChange={(e) => setNewPosting(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role and responsibilities..."
                  rows={4}
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium mb-2">Requirements</label>
                {newPosting.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder="Enter requirement..."
                    />
                    {newPosting.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setNewPosting(prev => ({
                          ...prev,
                          requirements: prev.requirements.filter((_, i) => i !== index)
                        }))}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
                  Add Requirement
                </Button>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Min Salary</label>
                  <Input
                    type="number"
                    value={newPosting.salary_range.min}
                    onChange={(e) => setNewPosting(prev => ({
                      ...prev,
                      salary_range: { ...prev.salary_range, min: Number(e.target.value) }
                    }))}
                    placeholder="80000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Salary</label>
                  <Input
                    type="number"
                    value={newPosting.salary_range.max}
                    onChange={(e) => setNewPosting(prev => ({
                      ...prev,
                      salary_range: { ...prev.salary_range, max: Number(e.target.value) }
                    }))}
                    placeholder="120000"
                  />
                </div>
              </div>

              {/* Interview Process */}
              <div>
                <label className="block text-sm font-medium mb-2">Interview Process</label>
                {newPosting.interview_process.map((step, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={step}
                      onChange={(e) => updateInterviewStep(index, e.target.value)}
                      placeholder="e.g., Technical Assessment (60 min)"
                    />
                    {newPosting.interview_process.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setNewPosting(prev => ({
                          ...prev,
                          interview_process: prev.interview_process.filter((_, i) => i !== index)
                        }))}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addInterviewStep}>
                  Add Interview Step
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Application Deadline</label>
                  <Input
                    type="date"
                    value={newPosting.deadline}
                    onChange={(e) => setNewPosting(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Available Slots</label>
                  <Input
                    type="number"
                    value={newPosting.slots_available}
                    onChange={(e) => setNewPosting(prev => ({ ...prev, slots_available: Number(e.target.value) }))}
                    min="1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePosting}>
                  Create Posting
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search postings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Companies</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Postings</p>
                <p className="text-xl font-semibold">{postings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-semibold">
                  {postings.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-xl font-semibold">
                  {postings.reduce((sum, p) => sum + p.applications_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Companies</p>
                <p className="text-xl font-semibold">
                  {new Set(postings.map(p => p.company.id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Postings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPostings.map((posting) => (
          <Card key={posting.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={posting.company.logo} />
                    <AvatarFallback>
                      {posting.company.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{posting.title}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {posting.company.name} • {posting.company.department}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(posting.status)}>
                  {posting.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm line-clamp-2">
                {posting.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{posting.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    ${posting.salary_range.min.toLocaleString()} - ${posting.salary_range.max.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {posting.applications_count} applications
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Deadline: {new Date(posting.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdatePosting(posting.id, {
                      status: posting.status === 'active' ? 'paused' : 'active'
                    })}
                  >
                    {posting.status === 'active' ? 'Pause' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePosting(posting.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPostings.length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No postings found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCompany
              ? "Try adjusting your filters to see more results."
              : "Create your first interview posting to get started."
            }
          </p>
          {!searchTerm && !selectedCompany && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Posting
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default InterviewPostingManager;