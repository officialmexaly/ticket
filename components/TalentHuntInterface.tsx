'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  ExternalLink,
  Network,
  Globe,
  Zap,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Filter,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react';

interface TalentCandidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience_years: number;
  current_company?: string;
  current_position?: string;
  location?: string;
  source: 'linkedin' | 'referral' | 'job_board' | 'headhunting' | 'direct';
  stage: 'sourced' | 'contacted' | 'interested' | 'interview' | 'offer' | 'hired' | 'rejected';
  salary_expectation?: number;
  availability: 'immediate' | '2_weeks' | '1_month' | '3_months' | 'not_available';
  rating?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface TalentPool {
  id: string;
  name: string;
  description: string;
  role_type: string;
  candidate_count: number;
  color: string;
  created_at: string;
}

interface TalentHuntInterfaceProps {
  setCurrentView?: (view: string) => void;
}

const TalentHuntInterface: React.FC<TalentHuntInterfaceProps> = ({ setCurrentView }) => {
  const [candidates, setCandidates] = useState<TalentCandidate[]>([]);
  const [talentPools, setTalentPools] = useState<TalentPool[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockCandidates: TalentCandidate[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0123',
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        experience_years: 5,
        current_company: 'Tech Corp',
        current_position: 'Senior Frontend Developer',
        location: 'San Francisco, CA',
        source: 'linkedin',
        stage: 'interview',
        salary_expectation: 120000,
        availability: '2_weeks',
        rating: 4.5,
        notes: 'Strong technical skills, great communication',
        created_at: '2024-01-15',
        updated_at: '2024-01-20'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        experience_years: 7,
        current_company: 'Data Solutions Inc',
        current_position: 'Backend Developer',
        location: 'Seattle, WA',
        source: 'referral',
        stage: 'contacted',
        salary_expectation: 130000,
        availability: '1_month',
        rating: 4.8,
        created_at: '2024-01-10',
        updated_at: '2024-01-18'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        skills: ['UI/UX Design', 'Figma', 'React', 'Design Systems'],
        experience_years: 4,
        current_company: 'Design Studio',
        current_position: 'Senior UX Designer',
        location: 'Austin, TX',
        source: 'job_board',
        stage: 'interested',
        salary_expectation: 95000,
        availability: 'immediate',
        rating: 4.3,
        created_at: '2024-01-12',
        updated_at: '2024-01-19'
      }
    ];

    const mockTalentPools: TalentPool[] = [
      { id: '1', name: 'Frontend Developers', description: 'React, Vue, Angular specialists', role_type: 'frontend', candidate_count: 45, color: 'bg-blue-100 text-blue-800', created_at: '2024-01-01' },
      { id: '2', name: 'Backend Engineers', description: 'Node.js, Python, Java experts', role_type: 'backend', candidate_count: 38, color: 'bg-green-100 text-green-800', created_at: '2024-01-01' },
      { id: '3', name: 'Data Scientists', description: 'ML, AI, Analytics professionals', role_type: 'data', candidate_count: 22, color: 'bg-purple-100 text-purple-800', created_at: '2024-01-01' },
      { id: '4', name: 'DevOps Engineers', description: 'AWS, Docker, Kubernetes specialists', role_type: 'devops', candidate_count: 19, color: 'bg-orange-100 text-orange-800', created_at: '2024-01-01' }
    ];

    setCandidates(mockCandidates);
    setTalentPools(mockTalentPools);
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'sourced': return 'bg-gray-100 text-gray-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'interested': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-orange-100 text-orange-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'linkedin': return <ExternalLink className="w-4 h-4" />;
      case 'referral': return <Users className="w-4 h-4" />;
      case 'job_board': return <Globe className="w-4 h-4" />;
      case 'headhunting': return <Search className="w-4 h-4" />;
      default: return <Plus className="w-4 h-4" />;
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStage = selectedStage === 'all' || candidate.stage === selectedStage;
    const matchesSource = selectedSource === 'all' || candidate.source === selectedSource;

    return matchesSearch && matchesStage && matchesSource;
  });

  const stageStats = candidates.reduce((acc, candidate) => {
    acc[candidate.stage] = (acc[candidate.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Talent Hunt</h1>
              <p className="text-gray-600">Source, track, and manage potential candidates</p>
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
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Talent Pools */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-600" />
                Talent Pools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {talentPools.map((pool) => (
                <div key={pool.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{pool.name}</p>
                      <p className="text-xs text-gray-500">{pool.description}</p>
                    </div>
                    <Badge className={pool.color}>{pool.candidate_count}</Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-3" onClick={() => toast.info('Create new pool coming soon')}>
                <Plus className="w-4 h-4 mr-2" />
                New Pool
              </Button>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pipeline Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Pipeline Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {[
                    { stage: 'sourced', label: 'Sourced', count: stageStats.sourced || 0 },
                    { stage: 'contacted', label: 'Contacted', count: stageStats.contacted || 0 },
                    { stage: 'interested', label: 'Interested', count: stageStats.interested || 0 },
                    { stage: 'interview', label: 'Interview', count: stageStats.interview || 0 },
                    { stage: 'offer', label: 'Offer', count: stageStats.offer || 0 },
                    { stage: 'hired', label: 'Hired', count: stageStats.hired || 0 },
                    { stage: 'rejected', label: 'Rejected', count: stageStats.rejected || 0 }
                  ].map((item) => (
                    <div key={item.stage} className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="text-2xl font-bold text-gray-900">{item.count}</div>
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
                      placeholder="Search candidates by name, email, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Stages</option>
                      <option value="sourced">Sourced</option>
                      <option value="contacted">Contacted</option>
                      <option value="interested">Interested</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <select
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Sources</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="referral">Referral</option>
                      <option value="job_board">Job Board</option>
                      <option value="headhunting">Headhunting</option>
                      <option value="direct">Direct</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Candidates List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Candidates ({filteredCandidates.length})</span>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Filters
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCandidates.map((candidate) => (
                    <div key={candidate.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                            {candidate.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                              {candidate.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-gray-600">{candidate.rating}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {candidate.email}
                              </span>
                              {candidate.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {candidate.phone}
                                </span>
                              )}
                              {candidate.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {candidate.location}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-gray-600">
                                {candidate.experience_years} years exp
                              </span>
                              {candidate.current_position && (
                                <span className="text-sm text-gray-600">
                                  • {candidate.current_position}
                                </span>
                              )}
                              {candidate.salary_expectation && (
                                <span className="text-sm text-gray-600">
                                  • ${candidate.salary_expectation.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.skills.slice(0, 4).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {candidate.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{candidate.skills.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {getSourceIcon(candidate.source)}
                            <span className="text-xs text-gray-500 capitalize">{candidate.source}</span>
                          </div>
                          <Badge className={getStageColor(candidate.stage)}>
                            {candidate.stage}
                          </Badge>
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
      </div>
    </div>
  );
};

export default TalentHuntInterface;