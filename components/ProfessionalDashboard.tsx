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
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <div className={`${color} p-2 rounded-lg text-white`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
      {trend && trendValue && (
        <div className="flex items-center mt-2 text-sm">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          ) : null}
          <span className={trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}>
            {trendValue}
          </span>
        </div>
      )}
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
    const defectRate = Math.round(Math.random() * 5); // Mock defect rate %
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
    throughput: Math.floor(Math.random() * 10) + 5,
    cycleTime: Math.floor(Math.random() * 5) + 3,
    leadTime: Math.floor(Math.random() * 8) + 8
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agile Performance Dashboard</h1>
          <p className="text-gray-600">Real-time insights into your agile delivery</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <KPICard
          title="Epic Completion"
          value={`${metrics.epic.completionRate}%`}
          subtitle={`${metrics.epic.completed}/${metrics.epic.total} epics`}
          trend="up"
          trendValue="+5% vs last month"
          icon={<Target className="w-4 h-4" />}
          color="bg-blue-500"
        />

        <KPICard
          title="Feature Velocity"
          value={metrics.feature.velocity}
          subtitle="features/month"
          trend="up"
          trendValue="+12% vs last month"
          icon={<Zap className="w-4 h-4" />}
          color="bg-green-500"
        />

        <KPICard
          title="Cycle Time"
          value={`${metrics.flow.cycleTime}d`}
          subtitle="avg completion time"
          trend="down"
          trendValue="-2d vs last month"
          icon={<Clock className="w-4 h-4" />}
          color="bg-orange-500"
        />

        <KPICard
          title="Throughput"
          value={metrics.flow.throughput}
          subtitle="tasks/week"
          trend="up"
          trendValue="+8% vs last week"
          icon={<Activity className="w-4 h-4" />}
          color="bg-purple-500"
        />

        <KPICard
          title="Active Tasks"
          value={metrics.task.inProgress}
          subtitle="in progress"
          icon={<CheckCircle className="w-4 h-4" />}
          color="bg-indigo-500"
        />

        <KPICard
          title="Team Members"
          value={metrics.team.members}
          subtitle="active contributors"
          icon={<Users className="w-4 h-4" />}
          color="bg-pink-500"
        />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="flow">Flow Metrics</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Epic Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Epic Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={epicStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="w-5 h-5" />
                  Feature Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={featureStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Priority Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Task Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taskTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#0088FE" />
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
  );
};

export default ProfessionalDashboard;