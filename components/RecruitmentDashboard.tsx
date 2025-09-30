'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InterviewPostingManager from './InterviewPostingManager';
import CandidateAssignmentView from './CandidateAssignmentView';
import {
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  Calendar,
  Target,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';

const RecruitmentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruitment Management</h1>
          <p className="text-gray-600">
            Manage interview postings and track candidate assignments to companies
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="postings">Interview Postings</TabsTrigger>
            <TabsTrigger value="candidates">Candidate Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Postings</p>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-xs text-green-600">+3 this week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Candidates</p>
                      <p className="text-2xl font-bold">48</p>
                      <p className="text-xs text-green-600">+12 this week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Companies</p>
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-xs text-blue-600">4 departments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hire Rate</p>
                      <p className="text-2xl font-bold">73%</p>
                      <p className="text-xs text-green-600">+5% this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Process Flow */}
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Process Flow</CardTitle>
                <p className="text-gray-600">How interview postings automatically assign candidates to companies</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">1. Create Posting</h3>
                    <p className="text-sm text-gray-600">
                      HR creates interview posting linked to specific company
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">2. Candidate Applies</h3>
                    <p className="text-sm text-gray-600">
                      Candidate applies to specific posting
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ArrowRight className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">3. Auto-Assignment</h3>
                    <p className="text-sm text-gray-600">
                      System automatically assigns candidate to posting's company
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserCheck className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">4. Interview Process</h3>
                    <p className="text-sm text-gray-600">
                      Company-specific interview process begins
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Key Benefits</h4>
                      <ul className="text-sm text-blue-800 mt-2 space-y-1">
                        <li>• Automatic candidate routing eliminates manual assignment errors</li>
                        <li>• Each company maintains its own candidate pipeline</li>
                        <li>• Clear audit trail from posting to hire</li>
                        <li>• Streamlined workflow reduces time-to-hire</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Postings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Senior Full Stack Developer</p>
                      <p className="text-sm text-gray-600">TechCorp Inc. • Engineering</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">12 applications</p>
                      <p className="text-xs text-green-600">Active</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">UX/UI Designer</p>
                      <p className="text-sm text-gray-600">Creative Design Studio • Design</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">8 applications</p>
                      <p className="text-xs text-green-600">Active</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Marketing Specialist</p>
                      <p className="text-sm text-gray-600">Marketing Agency Pro • Marketing</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">6 applications</p>
                      <p className="text-xs text-yellow-600">Paused</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recent Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">JS</span>
                      </div>
                      <div>
                        <p className="font-medium">John Smith</p>
                        <p className="text-sm text-gray-600">→ TechCorp Inc.</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-orange-600">Interview Scheduled</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-green-600">SJ</span>
                      </div>
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-gray-600">→ Creative Design Studio</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-600">Pending Schedule</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-600">MB</span>
                      </div>
                      <div>
                        <p className="font-medium">Mike Brown</p>
                        <p className="text-sm text-gray-600">→ Finance Group LLC</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-600">Offer Extended</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    className="h-24 flex-col gap-2"
                    onClick={() => setActiveTab('postings')}
                  >
                    <Briefcase className="w-6 h-6" />
                    Create New Posting
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2"
                    onClick={() => setActiveTab('candidates')}
                  >
                    <Users className="w-6 h-6" />
                    View All Candidates
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2"
                  >
                    <Target className="w-6 h-6" />
                    Analytics Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="postings">
            <InterviewPostingManager />
          </TabsContent>

          <TabsContent value="candidates">
            <CandidateAssignmentView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;