'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Users,
  Building2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star,
  Briefcase,
  Target,
  Eye,
  Edit2,
  MoreHorizontal,
  UserCheck,
  FileText,
  Award
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  department: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience_years: number;
  current_company?: string;
  current_position?: string;
  location?: string;
  source: string;
  stage: string;
  salary_expectation?: number;
  availability: string;
  rating?: number;
  notes?: string;
  applied_posting_id?: string;
  assigned_company?: Company;
  interview_status?: string;
  interview_date?: string;
  interview_stage?: string;
  created_at: string;
  updated_at: string;
}

interface InterviewPosting {
  id: string;
  company: Company;
  title: string;
  status: string;
}

const CandidateAssignmentView: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [postings, setPostings] = useState<InterviewPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [candidatesRes, postingsRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/interview-postings')
      ]);

      const candidatesData = await candidatesRes.json();
      const postingsData = await postingsRes.json();

      if (candidatesData.success) {
        setCandidates(candidatesData.data);
      }
      if (postingsData.success) {
        setPostings(postingsData.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToPosting = async (candidateId: string, postingId: string) => {
    try {
      const posting = postings.find(p => p.id === postingId);
      if (!posting) return;

      const updatedCandidate = {
        applied_posting_id: postingId,
        assigned_company: posting.company,
        interview_status: 'pending_schedule',
        interview_stage: 'initial_screening',
        stage: 'interview'
      };

      // In a real app, you'd call an API to update the candidate
      setCandidates(prev => prev.map(c =>
        c.id === candidateId
          ? { ...c, ...updatedCandidate }
          : c
      ));

      toast.success(`Candidate assigned to ${posting.company.name}`);
      setShowAssignModal(false);
    } catch (error) {
      toast.error('Failed to assign candidate');
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'sourced': return 'bg-gray-100 text-gray-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'interested': return 'bg-green-100 text-green-800';
      case 'interview': return 'bg-orange-100 text-orange-800';
      case 'offer': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInterviewStatusColor = (status: string) => {
    switch (status) {
      case 'pending_schedule': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.assigned_company?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = !selectedCompany || candidate.assigned_company?.id === selectedCompany;
    const matchesStage = !selectedStage || candidate.stage === selectedStage;
    return matchesSearch && matchesCompany && matchesStage;
  });

  const companies = Array.from(new Set(candidates.map(c => c.assigned_company?.id).filter(Boolean)))
    .map(id => candidates.find(c => c.assigned_company?.id === id)?.assigned_company)
    .filter(Boolean) as Company[];

  const stages = ['sourced', 'contacted', 'interested', 'interview', 'offer', 'hired', 'rejected'];

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
          <h2 className="text-2xl font-bold text-gray-900">Candidate Assignments</h2>
          <p className="text-gray-600">Track candidates assigned to companies through interview postings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search candidates..."
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
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Stages</option>
          {stages.map(stage => (
            <option key={stage} value={stage}>
              {stage.charAt(0).toUpperCase() + stage.slice(1)}
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
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-xl font-semibold">{candidates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Assigned to Companies</p>
                <p className="text-xl font-semibold">
                  {candidates.filter(c => c.assigned_company).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Interview Process</p>
                <p className="text-xl font-semibold">
                  {candidates.filter(c => c.stage === 'interview').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hired</p>
                <p className="text-xl font-semibold">
                  {candidates.filter(c => c.stage === 'hired').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Flow Visual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Assignment Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Candidate Applies</p>
                <p className="text-sm text-gray-600">To specific job posting</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Auto-Assignment</p>
                <p className="text-sm text-gray-600">Based on posting's company</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Company Pipeline</p>
                <p className="text-sm text-gray-600">Interview process begins</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <p className="text-sm text-gray-600">{candidate.current_position}</p>
                  </div>
                </div>
                <Badge className={getStageColor(candidate.stage)}>
                  {candidate.stage}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assignment Info */}
              {candidate.assigned_company ? (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Assigned to</span>
                  </div>
                  <p className="font-semibold text-blue-900">{candidate.assigned_company.name}</p>
                  <p className="text-sm text-blue-700">{candidate.assigned_company.department}</p>
                  {candidate.interview_status && (
                    <Badge className={`mt-2 ${getInterviewStatusColor(candidate.interview_status)}`}>
                      {candidate.interview_status.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Not assigned to company</span>
                    <Dialog open={showAssignModal && selectedCandidate?.id === candidate.id}
                           onOpenChange={(open) => {
                             setShowAssignModal(open);
                             if (open) setSelectedCandidate(candidate);
                           }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Assign
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign to Interview Posting</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>Select an interview posting to assign {candidate.name}:</p>
                          <div className="space-y-2">
                            {postings.filter(p => p.status === 'active').map(posting => (
                              <div key={posting.id}
                                   className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                   onClick={() => handleAssignToPosting(candidate.id, posting.id)}>
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback>
                                      {posting.company.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{posting.title}</p>
                                    <p className="text-sm text-gray-600">
                                      {posting.company.name} • {posting.company.department}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{candidate.phone}</span>
                  </div>
                )}
                {candidate.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{candidate.location}</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div>
                <p className="text-sm font-medium mb-2">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{candidate.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">{candidate.experience_years} years</span>
              </div>

              {/* Rating */}
              {candidate.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{candidate.rating}/5</span>
                </div>
              )}

              {/* Interview Date */}
              {candidate.interview_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Interview: {new Date(candidate.interview_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCompany || selectedStage
              ? "Try adjusting your filters to see more results."
              : "Candidates will appear here once they apply to interview postings."
            }
          </p>
        </Card>
      )}
    </div>
  );
};

export default CandidateAssignmentView;