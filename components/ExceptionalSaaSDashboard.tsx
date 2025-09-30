'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart3,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Target,
  Zap,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Bell,
  Settings,
  ChevronDown,
  Activity,
  Calendar,
  Globe,
  Shield,
  Sparkles,
  Layers,
  Award,
  Briefcase,
  MessageSquare,
  FileText,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Share,
  RefreshCw
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

interface ProjectProps {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  progress: number;
  team: Array<{ name: string; avatar: string; initials: string }>;
  deadline: string;
  budget: string;
  priority: 'high' | 'medium' | 'low';
}

interface ActivityProps {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  avatar: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

const ExceptionalSaaSDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Simulated real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const metrics: MetricCardProps[] = [
    {
      title: 'Total Revenue',
      value: '$2,847,293',
      change: 12.5,
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Active Users',
      value: '14,832',
      change: 8.3,
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: -2.1,
      trend: 'down',
      icon: <Target className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Avg. Response Time',
      value: '1.2s',
      change: 15.7,
      trend: 'up',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const projects: ProjectProps[] = [
    {
      id: '1',
      name: 'Project Alpha - Mobile Redesign',
      status: 'active',
      progress: 78,
      team: [
        { name: 'Sarah Chen', avatar: '', initials: 'SC' },
        { name: 'Mike Johnson', avatar: '', initials: 'MJ' },
        { name: 'Emma Davis', avatar: '', initials: 'ED' }
      ],
      deadline: '2024-02-15',
      budget: '$125,000',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Beta Analytics Platform',
      status: 'active',
      progress: 45,
      team: [
        { name: 'Alex Rodriguez', avatar: '', initials: 'AR' },
        { name: 'Lisa Wang', avatar: '', initials: 'LW' }
      ],
      deadline: '2024-03-01',
      budget: '$85,000',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Infrastructure Upgrade',
      status: 'planning',
      progress: 12,
      team: [
        { name: 'David Kim', avatar: '', initials: 'DK' },
        { name: 'Rachel Green', avatar: '', initials: 'RG' }
      ],
      deadline: '2024-04-10',
      budget: '$200,000',
      priority: 'high'
    }
  ];

  const activities: ActivityProps[] = [
    {
      id: '1',
      user: 'Sarah Chen',
      action: 'completed task',
      target: 'UI Design Review',
      time: '2 minutes ago',
      avatar: '',
      type: 'success'
    },
    {
      id: '2',
      user: 'Mike Johnson',
      action: 'commented on',
      target: 'Project Alpha',
      time: '15 minutes ago',
      avatar: '',
      type: 'info'
    },
    {
      id: '3',
      user: 'Emma Davis',
      action: 'uploaded files to',
      target: 'Design Assets',
      time: '1 hour ago',
      avatar: '',
      type: 'info'
    }
  ];

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon, color }) => (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {value}
              </p>
              <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                {trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{Math.abs(change)}%</span>
              </div>
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProjectCard: React.FC<{ project: ProjectProps }> = ({ project }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
        case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
        case 'on-hold': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
        case 'planning': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10';
        case 'medium': return 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10';
        case 'low': return 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10';
        default: return 'border-l-gray-500 bg-gray-50/50 dark:bg-gray-900/10';
      }
    };

    return (
      <Card className={`group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 ${getPriorityColor(project.priority)} backdrop-blur-sm`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg leading-none tracking-tight">{project.name}</h3>
              <div className="flex items-center space-x-2">
                <Badge className={`${getStatusColor(project.status)} border-0`}>
                  {project.status.replace('-', ' ')}
                </Badge>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{project.budget}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="w-4 h-4 mr-2" />
                  Share Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.team.map((member, index) => (
                  <Avatar key={index} className="w-8 h-8 border-2 border-background ring-2 ring-white dark:ring-gray-800">
                    <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project.team.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-background flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">+{project.team.length - 3}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    NexusFlow
                  </h1>
                  <p className="text-xs text-muted-foreground">Enterprise SaaS</p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-6">
                {['Overview', 'Projects', 'Analytics', 'Team', 'Settings'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item.toLowerCase())}
                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      activeTab === item.toLowerCase()
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    {item}
                    {activeTab === item.toLowerCase() && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100/50 dark:bg-gray-800/50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
                />
              </div>

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">3</span>
                </div>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Welcome back, John 👋
              </h2>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your business today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Last 7 days</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedTimeRange('24h')}>Last 24 hours</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTimeRange('7d')}>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTimeRange('30d')}>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTimeRange('90d')}>Last 90 days</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <span>Active Projects</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </CardContent>
            </Card>

            {/* Analytics Chart Placeholder */}
            <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  <span>Performance Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">Interactive charts would go here</p>
                    <p className="text-sm text-muted-foreground">Real-time data visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-muted-foreground"> {activity.action} </span>
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Team Performance */}
            <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  <span>Team Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Sarah Chen', role: 'Lead Designer', score: 98, avatar: 'SC' },
                  { name: 'Mike Johnson', role: 'Developer', score: 94, avatar: 'MJ' },
                  { name: 'Emma Davis', role: 'Product Manager', score: 92, avatar: 'ED' }
                ].map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{member.score}%</p>
                      <div className="w-16 h-1 bg-gray-200 rounded-full">
                        <div
                          className="h-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                          style={{ width: `${member.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-6 h-6" />
                  <h3 className="font-semibold">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Task
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Team Chat
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExceptionalSaaSDashboard;