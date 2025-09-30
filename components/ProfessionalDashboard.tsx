'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Users,
  Calendar,
  BarChart3,
  Activity,
  Flag,
  Zap
} from 'lucide-react';

// Types based on your existing schema
interface Epic {
  id: string;
  name: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

interface Feature {
  id: string;
  epic_id: string;
  name: string;
  status: 'backlog' | 'analysis' | 'design' | 'development' | 'testing' | 'done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: string;
  feature_id: string;
  title: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'completed' | 'qa' | 'done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'development' | 'testing' | 'documentation' | 'research' | 'design' | 'devops';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

interface Sprint {
  id: string;
  epic_id: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

interface DashboardProps {
  epics: Epic[];
  features: Feature[];
  tasks: Task[];
  sprints: Sprint[];
}

// Color scheme for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const PRIORITY_COLORS = {
  'Critical': '#DC2626',
  'High': '#EA580C',
  'Medium': '#D97706',
  'Low': '#16A34A'
};

const STATUS_COLORS = {
  'planning': '#6B7280',
  'backlog': '#6B7280',
  'todo': '#3B82F6',
  'analysis': '#8B5CF6',
  'design': '#EC4899',
  'development': '#0EA5E9',
  'in_progress': '#F59E0B',
  'testing': '#EF4444',
  'qa': '#8B5CF6',
  'review': '#F59E0B',
  'completed': '#10B981',
  'done': '#059669'
};

// Professional KPI Card Component
const KPICard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, subtitle, trend, trendValue, icon, color }) => (
  <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 border-slate-200">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            trend === 'up' ? 'bg-green-100 text-green-700' :
            trend === 'down' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend === 'down' ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-3xl text-slate-900">{value}</h3>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        {subtitle && <p className="text-xs text-slate-600">{subtitle}</p>}
      </div>
    </CardContent>
  </Card>
);

// Professional Dashboard Component
const ProfessionalDashboard: React.FC<DashboardProps> = ({
  epics,
  features,
  tasks,
  sprints
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  // Calculate professional agile metrics
  const metrics = useMemo(() => {
    // Epic metrics
    const totalEpics = epics.length;
    const completedEpics = epics.filter(e => e.status === 'completed').length;
    const epicCompletionRate = totalEpics > 0 ? Math.round((completedEpics / totalEpics) * 100) : 0;

    // Feature metrics
    const totalFeatures = features.length;
    const completedFeatures = features.filter(f => f.status === 'done').length;
    const featureVelocity = completedFeatures; // Weekly feature completion

    // Task metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const tasksInProgress = tasks.filter(t => t.status === 'in_progress').length;
    const blockedTasks = tasks.filter(t => t.status === 'qa').length; // Using QA as blocked state

    // Sprint metrics
    const activeSprints = sprints.filter(s => s.status === 'active').length;
    const completedSprints = sprints.filter(s => s.status === 'completed').length;

    // Flow metrics (simplified)
    const cycleTime = 7; // Average days (mock calculation)
    const leadTime = 14; // Average days (mock calculation)
    const throughput = Math.round(completedTasks / 4); // Weekly throughput

    // Quality metrics
    const defectRate = 3; // Mock defect rate %
    const testCoverage = 85; // Mock test coverage %

    // Team metrics
    const uniqueAssignees = new Set(tasks.filter(t => t.assigned_to).map(t => t.assigned_to)).size;
    const averageTasksPerPerson = uniqueAssignees > 0 ? Math.round(totalTasks / uniqueAssignees) : 0;

    return {
      epic: {
        total: totalEpics,
        completed: completedEpics,
        completionRate: epicCompletionRate
      },
      feature: {
        total: totalFeatures,
        completed: completedFeatures,
        velocity: featureVelocity
      },
      task: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: tasksInProgress,
        blocked: blockedTasks
      },
      sprint: {
        active: activeSprints,
        completed: completedSprints
      },
      flow: {
        cycleTime,
        leadTime,
        throughput
      },
      quality: {
        defectRate,
        testCoverage
      },
      team: {
        members: uniqueAssignees,
        averageLoad: averageTasksPerPerson
      }
    };
  }, [epics, features, tasks, sprints]);

  // Prepare chart data
  const epicStatusData = Object.entries(
    epics.reduce((acc, epic) => {
      acc[epic.status] = (acc[epic.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({ status, count, fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }));

  const featureStatusData = Object.entries(
    features.reduce((acc, feature) => {
      acc[feature.status] = (acc[feature.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({ status, count, fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }));

  const taskTypeData = Object.entries(
    tasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({ type, count }));

  const priorityData = Object.entries(
    [...epics, ...features, ...tasks].reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([priority, count]) => ({
    priority,
    count,
    fill: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS]
  }));

  // Flow metrics over time (mock data for demonstration)
  const flowTrendData = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    throughput: 5 + (i % 5),
    cycleTime: 3 + (i % 3),
    leadTime: 8 + (i % 4)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-[1600px] mx-auto px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Agile Performance Dashboard</h1>
            <p className="text-slate-600 text-base">Real-time insights into your agile delivery</p>
          </div>
          <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
            {(['week', 'month', 'quarter'] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className={selectedTimeframe === timeframe ? "bg-slate-900 hover:bg-slate-800" : ""}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <KPICard
            title="Epic Completion"
            value={`${metrics.epic.completionRate}%`}
            subtitle={`${metrics.epic.completed}/${metrics.epic.total} epics`}
            trend="up"
            trendValue="+5%"
            icon={<Target className="w-5 h-5" />}
            color="bg-blue-500"
          />

          <KPICard
            title="Feature Velocity"
            value={metrics.feature.velocity}
            subtitle="features/month"
            trend="up"
            trendValue="+12%"
            icon={<Zap className="w-5 h-5" />}
            color="bg-green-500"
          />

          <KPICard
            title="Cycle Time"
            value={`${metrics.flow.cycleTime}d`}
            subtitle="avg completion time"
            trend="down"
            trendValue="-2d"
            icon={<Clock className="w-5 h-5" />}
            color="bg-orange-500"
          />

          <KPICard
            title="Throughput"
            value={metrics.flow.throughput}
            subtitle="tasks/week"
            trend="up"
            trendValue="+8%"
            icon={<Activity className="w-5 h-5" />}
            color="bg-purple-500"
          />

          <KPICard
            title="Active Tasks"
            value={metrics.task.inProgress}
            subtitle="in progress"
            icon={<CheckCircle className="w-5 h-5" />}
            color="bg-indigo-500"
          />

          <KPICard
            title="Team Members"
            value={metrics.team.members}
            subtitle="active contributors"
            icon={<Users className="w-5 h-5" />}
            color="bg-pink-500"
          />
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-white p-1 text-slate-500 shadow-sm border border-slate-200">
            <TabsTrigger value="overview" className="rounded-lg px-6 py-2 text-sm font-medium">Overview</TabsTrigger>
            <TabsTrigger value="flow" className="rounded-lg px-6 py-2 text-sm font-medium">Flow Metrics</TabsTrigger>
            <TabsTrigger value="quality" className="rounded-lg px-6 py-2 text-sm font-medium">Quality</TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg px-6 py-2 text-sm font-medium">Team Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Epic Status Distribution */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    Epic Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={epicStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="count"
                        label={({ status, count }) => `${status}: ${count}`}
                      >
                        {epicStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Feature Status Distribution */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Flag className="w-4 h-4 text-green-600" />
                    </div>
                    Feature Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={featureStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Priority Distribution */}
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                    </div>
                    Priority Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="count"
                        label={({ priority, count }) => `${priority}: ${count}`}
                      >
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Work Type Distribution */}
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  Task Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={taskTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#0088FE" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

        {/* Flow Metrics Tab */}
        <TabsContent value="flow" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Flow Metrics Trend */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Flow Metrics Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={flowTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="throughput"
                      stroke="#8884d8"
                      name="Throughput (tasks/week)"
                    />
                    <Line
                      type="monotone"
                      dataKey="cycleTime"
                      stroke="#82ca9d"
                      name="Cycle Time (days)"
                    />
                    <Line
                      type="monotone"
                      dataKey="leadTime"
                      stroke="#ffc658"
                      name="Lead Time (days)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Flow Health Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Flow Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Work in Progress</span>
                    <span className="text-sm font-medium">{metrics.task.inProgress}</span>
                  </div>
                  <Progress value={(metrics.task.inProgress / metrics.task.total) * 100} />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Completion Rate</span>
                    <span className="text-sm font-medium">
                      {Math.round((metrics.task.completed / metrics.task.total) * 100)}%
                    </span>
                  </div>
                  <Progress value={(metrics.task.completed / metrics.task.total) * 100} />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Blocked Items</span>
                    <span className="text-sm font-medium">{metrics.task.blocked}</span>
                  </div>
                  <Progress
                    value={(metrics.task.blocked / metrics.task.total) * 100}
                    className="[&>div]:bg-red-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Test Coverage</span>
                    <span className="text-sm font-medium">{metrics.quality.testCoverage}%</span>
                  </div>
                  <Progress value={metrics.quality.testCoverage} />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Defect Rate</span>
                    <span className="text-sm font-medium">{metrics.quality.defectRate}%</span>
                  </div>
                  <Progress
                    value={metrics.quality.defectRate}
                    className="[&>div]:bg-red-500"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Definition of Done Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">92%</div>
                  <p className="text-sm text-gray-600 mt-2">
                    Tasks meeting Definition of Done criteria
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Performance Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Capacity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.team.members}</div>
                  <p className="text-sm text-gray-600">Active team members</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Average Load</span>
                    <span className="text-sm font-medium">{metrics.team.averageLoad} tasks</span>
                  </div>
                  <Progress value={Math.min((metrics.team.averageLoad / 10) * 100, 100)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sprint Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Sprints</span>
                  <Badge variant="default">{metrics.sprint.active}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed Sprints</span>
                  <Badge variant="secondary">{metrics.sprint.completed}</Badge>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Sprint Success Rate</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;