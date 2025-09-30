'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Ticket,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  ArrowRight,
  Activity,
  Star,
  Zap,
  FileText,
  Briefcase,
  Sparkles,
  Globe,
  Rocket,
  Shield,
  Coffee,
  Brain,
  Heart,
  Award,
  Flame,
  Eye,
  Layers,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Play,
  Pause
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface ModernHomeDashboardProps {
  setCurrentView: (view: string) => void;
}

const ModernHomeDashboard: React.FC<ModernHomeDashboardProps> = ({ setCurrentView }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));

      const hour = now.getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 17) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);

    // Animation trigger
    setAnimationKey(prev => prev + 1);

    return () => clearInterval(interval);
  }, []);

  const quickActions = useMemo(() => [
    {
      title: 'Create Ticket',
      description: 'Submit a new support request',
      icon: <Ticket className="w-6 h-6" />,
      color: 'from-blue-500 via-blue-600 to-indigo-600',
      hoverColor: 'group-hover:from-blue-600 group-hover:via-blue-700 group-hover:to-indigo-700',
      action: () => setCurrentView('create-ticket'),
      stats: '+5 today',
      trend: 'up'
    },
    {
      title: 'Add Employee',
      description: 'Onboard new team member',
      icon: <Users className="w-6 h-6" />,
      color: 'from-emerald-500 via-emerald-600 to-teal-600',
      hoverColor: 'group-hover:from-emerald-600 group-hover:via-emerald-700 group-hover:to-teal-700',
      action: () => setCurrentView('hr-employees'),
      stats: '45 active',
      trend: 'up'
    },
    {
      title: 'Launch Project',
      description: 'Initialize new initiative',
      icon: <Rocket className="w-6 h-6" />,
      color: 'from-purple-500 via-purple-600 to-pink-600',
      hoverColor: 'group-hover:from-purple-600 group-hover:via-purple-700 group-hover:to-pink-700',
      action: () => setCurrentView('projects'),
      stats: '8 ongoing',
      trend: 'stable'
    },
    {
      title: 'AI Analytics',
      description: 'View intelligent insights',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-amber-500 via-orange-500 to-red-500',
      hoverColor: 'group-hover:from-amber-600 group-hover:via-orange-600 group-hover:to-red-600',
      action: () => setCurrentView('analytics-dashboard'),
      stats: '92% accuracy',
      trend: 'up'
    }
  ], [setCurrentView]);

  const shortcuts = [
    { title: 'Tickets', icon: <Ticket className="w-5 h-5" />, view: 'list', count: '12 Open' },
    { title: 'Employees', icon: <Users className="w-5 h-5" />, view: 'hr-employees', count: '45 Active' },
    { title: 'Projects', icon: <Briefcase className="w-5 h-5" />, view: 'projects', count: '8 Active' },
    { title: 'Reports', icon: <BarChart3 className="w-5 h-5" />, view: 'reports', count: '5 Generated' }
  ];

  const recentActivity = [
    { type: 'ticket', title: 'New ticket: Login Issues', time: '5 min ago', status: 'urgent' },
    { type: 'hr', title: 'Employee onboarding completed', time: '1 hour ago', status: 'success' },
    { type: 'project', title: 'Project milestone reached', time: '2 hours ago', status: 'info' },
    { type: 'system', title: 'System backup completed', time: '3 hours ago', status: 'success' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-white animate-spin" />
          </div>
          <div className="text-lg font-semibold text-slate-600 dark:text-slate-400">Loading your workspace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Ultra-Modern Header Section */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl mb-8 shadow-2xl shadow-slate-900/10">
          {/* Ultra-Dynamic Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 animate-pulse"></div>
          <div
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px) translate(-50%, -50%)`
            }}
          ></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-400/30 to-pink-600/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(${-mousePosition.x * 0.008}px, ${-mousePosition.y * 0.008}px) translate(50%, 50%)`
            }}
          ></div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 8}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${2 + i * 0.5}s`
                }}
              ></div>
            ))}
          </div>

          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/25 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      {greeting}! ✨
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">{currentDate}</p>
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{currentTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/60">
                  <Rocket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Ready to boost productivity today</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setCurrentView('create-ticket')}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-600/50 hover:-translate-y-2 hover:scale-105"
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative flex items-center gap-3">
                    <div className="w-5 h-5 relative">
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                      <div className="absolute inset-0 w-5 h-5 bg-white/20 rounded-full scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500"></div>
                    </div>
                    <span className="tracking-wide">Create New</span>
                    <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Revolutionary Quick Actions */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Lightning Actions
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-200 to-transparent dark:from-violet-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:-translate-y-2"
                onClick={action.action}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                {/* Floating Particles Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl transform rotate-45 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>
                </div>

                <div className="relative z-10">
                  {/* Enhanced Icon with Glow Effect */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} ${action.hoverColor} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3`}>
                    {action.icon}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 dark:group-hover:from-white dark:group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
                        {action.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        {action.trend === 'up' && <ArrowUp className="w-3 h-3 text-emerald-500" />}
                        {action.trend === 'down' && <ArrowDown className="w-3 h-3 text-red-500" />}
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{action.stats}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                      {action.description}
                    </p>

                    {/* Interactive Progress Indicator */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${action.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 ml-3 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revolutionary Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Analytics Section */}
          <div className="lg:col-span-8 space-y-8">
            {/* AI-Powered Insights Card */}
            <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-8 shadow-xl shadow-slate-900/5">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/10 to-purple-600/10 rounded-full blur-2xl"></div>

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    AI Insights
                  </h3>
                  <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Live</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "Productivity Score", value: "94%", change: "+12%", icon: TrendingUp, color: "emerald", bgGlow: "from-emerald-500/20 to-emerald-600/20" },
                    { title: "Team Efficiency", value: "87%", change: "+5%", icon: Users, color: "blue", bgGlow: "from-blue-500/20 to-blue-600/20" },
                    { title: "Response Time", value: "1.2h", change: "-23%", icon: Clock, color: "purple", bgGlow: "from-purple-500/20 to-purple-600/20" }
                  ].map((metric, index) => (
                    <div key={index} className="group relative overflow-hidden p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1 transition-all duration-500">
                      {/* Animated background glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-10 h-10 bg-gradient-to-br from-${metric.color}-500 to-${metric.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                            <metric.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                            <ArrowUp className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{metric.change}</span>
                          </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 dark:group-hover:from-white dark:group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">{metric.value}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{metric.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Performance Dashboard */}
            <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-8 shadow-xl shadow-slate-900/5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5"></div>

              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Performance Metrics
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Ticket Resolution Rate", value: 94, color: "emerald", target: 90, icon: CheckCircle },
                    { label: "Customer Satisfaction", value: 87, color: "blue", target: 85, icon: Heart },
                    { label: "Team Productivity", value: 76, color: "purple", target: 80, icon: Users },
                    { label: "System Performance", value: 98, color: "orange", target: 95, icon: Zap }
                  ].map((metric, index) => (
                    <div key={index} className="group space-y-3 p-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-200/40 dark:border-slate-700/40 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-gradient-to-br from-${metric.color}-500 to-${metric.color}-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <metric.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">{metric.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-slate-900 dark:text-white">{metric.value}%</span>
                          <div className="flex items-center gap-1">
                            {metric.value >= metric.target ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-amber-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden shadow-inner">
                          <div
                            className={`h-full bg-gradient-to-r from-${metric.color}-400 via-${metric.color}-500 to-${metric.color}-600 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden`}
                            style={{ width: `${metric.value}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                        <div
                          className="absolute top-0 w-1 h-4 bg-slate-500 dark:bg-slate-400 rounded-full shadow-sm"
                          style={{ left: `${metric.target}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">
                          Target: {metric.target}%
                        </span>
                        <span className={`font-bold px-2 py-1 rounded-full ${
                          metric.value >= metric.target
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                          {metric.value >= metric.target ? '✓ On Track' : '⚡ Needs Focus'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Revolutionary Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Live Activity Feed */}
            <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-6 shadow-xl shadow-slate-900/5">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5"></div>

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Feed</h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Real-time</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentActivity.map((item, index) => (
                    <div key={index} className="group p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                          item.status === 'urgent' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                          item.status === 'success' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                          'bg-gradient-to-br from-blue-500 to-blue-600'
                        }`}>
                          {item.type === 'ticket' && <Ticket className="w-4 h-4 text-white" />}
                          {item.type === 'hr' && <Users className="w-4 h-4 text-white" />}
                          {item.type === 'project' && <Target className="w-4 h-4 text-white" />}
                          {item.type === 'system' && <Shield className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-6 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                  onClick={() => setCurrentView('notifications')}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  View All Activity
                </Button>
              </div>
            </div>

            {/* Smart System Status */}
            <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-6 shadow-xl shadow-slate-900/5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Health</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { service: 'Core API', status: 'operational', uptime: '99.9%', color: 'emerald' },
                    { service: 'Database', status: 'operational', uptime: '99.8%', color: 'emerald' },
                    { service: 'Storage', status: 'maintenance', uptime: '98.2%', color: 'amber' },
                    { service: 'Analytics', status: 'operational', uptime: '99.5%', color: 'emerald' }
                  ].map((system, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 bg-${system.color}-500 rounded-full ${system.status === 'operational' ? 'animate-pulse' : ''}`}></div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{system.service}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">{system.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{system.uptime}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Uptime</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-6 shadow-xl shadow-slate-900/5">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5"></div>

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Smart Insights</h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "Optimize Response Time",
                      description: "Deploy 2 more agents during peak hours",
                      impact: "High",
                      time: "2 min read"
                    },
                    {
                      title: "Team Productivity Boost",
                      description: "Schedule training for new collaboration tools",
                      impact: "Medium",
                      time: "5 min read"
                    },
                    {
                      title: "Cost Optimization",
                      description: "Reduce infrastructure costs by 15%",
                      impact: "High",
                      time: "3 min read"
                    }
                  ].map((insight, index) => (
                    <div key={index} className="group p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                              {insight.title}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              insight.impact === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            }`}>
                              {insight.impact}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{insight.description}</p>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">{insight.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHomeDashboard;