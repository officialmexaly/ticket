"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSupabaseAuth } from '../lib/clear-auth';
import Link from 'next/link';
import {
  ArrowRight,
  MessageSquare,
  Users,
  BarChart3,
  Clock,
  Shield,
  Zap,
  Star,
  Headphones,
  Globe,
  Award,
  Sparkles,
  TrendingUp,
  Lock,
  Smartphone,
  BookOpen,
  Code
} from 'lucide-react';

const LandingPage = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    setIsVisible(true);
    // Clear any leftover auth data on page load
    clearSupabaseAuth();

    // Intersection Observer for 3D scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            setVisibleSections(prev => {
              const newSet = new Set(prev);
              if (entry.isIntersecting) {
                newSet.add(sectionId);
              } else {
                newSet.delete(sectionId);
              }
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const getSectionClasses = (sectionId: string) => {
    const isInView = visibleSections.has(sectionId);
    return isInView
      ? 'transform translate-y-0 scale-100 rotate-0 opacity-100 transition-all duration-1000 ease-out'
      : 'transform translate-y-16 scale-95 -rotate-1 opacity-0 transition-all duration-1000 ease-out';
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-80 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-80 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>
      {/* Header */}
      <header className="relative bg-white/95 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-xl">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  TicketFlow
                </h1>
                <p className="text-sm text-gray-600 font-medium">Enterprise Support Platform</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/ticket"
                className="relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                Create Ticket
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2">
              <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-800"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-4 sm:px-6 lg:px-8" data-section="hero">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center max-w-5xl mx-auto ${getSectionClasses('hero')}`}>
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-blue-200">
                <Sparkles className="w-4 h-4" />
                Enterprise-Grade Support Platform
                <TrendingUp className="w-4 h-4" />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Transform
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Customer Support
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
                Enterprise-grade ticket management with AI-powered insights, voice notes,
                and real-time collaboration. Built for teams that demand excellence.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  href="/ticket"
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-base shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Create Ticket
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>

                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold text-base shadow-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  View Live Demo
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="flex items-center gap-2 text-gray-500">
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">Global CDN</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Smartphone className="w-5 h-5" />
                  <span className="font-medium">Mobile First</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce delay-1000"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden" data-section="features">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #f1f5f9 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-20 ${getSectionClasses('features')}`}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-6 py-3 rounded-full text-sm font-bold mb-8 border border-blue-200 shadow-lg">
              <Star className="w-4 h-4" />
              Enterprise Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Everything Your Team
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Could Ever Need
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Built from the ground up for enterprise teams who demand performance,
              security, and scalability without compromise.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${getSectionClasses('features')}`}>
            {/* Feature 1 - Enhanced */}
            <div className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 hover:border-blue-200">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rich Text Editor</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  Professional WYSIWYG editor powered by TipTap. Create beautifully formatted
                  ticket descriptions with real-time collaboration.
                </p>
                <div className="flex items-center text-blue-600 font-semibold text-sm">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature 2 - Enhanced */}
            <div className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 hover:border-green-200">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Voice Notes</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  Record high-quality voice notes with one click. Perfect for complex
                  explanations and faster communication.
                </p>
                <div className="flex items-center text-green-600 font-semibold text-sm">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature 3 - Enhanced */}
            <div className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 hover:border-purple-200">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart User System</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  Flexible user identification with email, username, or custom IDs.
                  Seamless integration with existing systems.
                </p>
                <div className="flex items-center text-purple-600 font-semibold text-sm">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature 4 - Enhanced */}
            <div className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 hover:border-orange-200">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Dashboard</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  Comprehensive analytics with real-time insights, filtering,
                  and bulk operations for maximum efficiency.
                </p>
                <div className="flex items-center text-orange-600 font-semibold text-sm">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature 5 - Enhanced */}
            <div className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 hover:border-teal-200">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Auto-Draft System</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  Never lose your work again. Intelligent auto-saving with
                  version history and seamless recovery.
                </p>
                <div className="flex items-center text-teal-600 font-semibold text-sm">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature 6 - Enhanced */}
            <div className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 hover:border-pink-200">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Performance</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  Built on Next.js 15 and React 19. Blazing fast performance
                  with enterprise-grade reliability.
                </p>
                <div className="flex items-center text-pink-600 font-semibold text-sm">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 bg-gray-50 overflow-hidden" data-section="howItWorks">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50/30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${getSectionClasses('howItWorks')}`}>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200">
              <ArrowRight className="w-4 h-4" />
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Simple <span className="text-blue-600">Three-Step</span> Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create, manage, and resolve tickets with ease using our streamlined workflow
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${getSectionClasses('howItWorks')}`}>
            <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="absolute -top-4 left-6 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="mt-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Create Ticket</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Use our rich text editor to describe your issue. Add voice notes for complex problems and attach files if needed.
                </p>
              </div>
            </div>

            <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="absolute -top-4 left-6 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div className="mt-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Monitor ticket status in real-time through our dashboard. Get updates on priority, assignments, and progress.
                </p>
              </div>
            </div>

            <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="absolute -top-4 left-6 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div className="mt-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Get Resolution</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Collaborate with support team, receive updates, and get your issues resolved efficiently with full transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="relative py-20 bg-white overflow-hidden" data-section="dashboard">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${getSectionClasses('dashboard')}`}>
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-purple-200">
              <BarChart3 className="w-4 h-4" />
              Dashboard Preview
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Powerful <span className="text-purple-600">Dashboard</span> Overview
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get complete visibility into your support operations with our comprehensive dashboard
            </p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${getSectionClasses('dashboard')}`}>
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Real-time Analytics</h3>
                    <p className="text-gray-600 text-sm">Track ticket volume, resolution times, and team performance with live data updates.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Team Collaboration</h3>
                    <p className="text-gray-600 text-sm">Assign tickets, track workload distribution, and manage team productivity efficiently.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Smart Filtering</h3>
                    <p className="text-gray-600 text-sm">Filter tickets by status, priority, type, or assignee to focus on what matters most.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Explore Dashboard
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-2xl">
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-white font-semibold text-sm">Live Dashboard</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-white">24</p>
                      <p className="text-xs text-blue-300">Open Tickets</p>
                    </div>
                    <div className="bg-green-500/20 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-white">156</p>
                      <p className="text-xs text-green-300">Resolved</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <MessageSquare className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-white text-xs font-medium">Tickets</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-white text-xs font-medium">Team</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-white text-xs font-medium">Reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Notes Feature Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden" data-section="voiceNotes">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${getSectionClasses('voiceNotes')}`}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <Headphones className="w-4 h-4" />
              Voice Notes
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Explain Complex Issues with <span className="text-cyan-400">Voice</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Sometimes text isn&apos;t enough. Record voice notes to provide detailed explanations and context for faster resolution.
            </p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${getSectionClasses('voiceNotes')}`}>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">One-Click Recording</h3>
                  <p className="text-gray-300 text-sm">Record high-quality voice notes instantly. No complex setup or external tools required.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Auto-Save & Playback</h3>
                  <p className="text-gray-300 text-sm">Recordings are automatically saved and can be played back anytime by support team members.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Context-Rich Support</h3>
                  <p className="text-gray-300 text-sm">Provide detailed context that text can&apos;t capture. Perfect for technical issues and complex workflows.</p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/ticket"
                  className="inline-flex items-center gap-2 bg-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan-400 transition-colors"
                >
                  <Headphones className="w-4 h-4" />
                  Try Voice Notes
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">Recording...</p>
                      <div className="bg-white/20 h-2 rounded-full mt-2">
                        <div className="bg-red-400 h-2 rounded-full w-2/3 animate-pulse"></div>
                      </div>
                    </div>
                    <span className="text-white font-mono text-sm">00:23</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Bug Report - Dashboard.mp3</p>
                      <p className="text-gray-400 text-xs">2:14 • 45 KB</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Feature Request.mp3</p>
                      <p className="text-gray-400 text-xs">1:33 • 32 KB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Draft System Section */}
      <section className="relative py-20 bg-white overflow-hidden" data-section="drafts">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${getSectionClasses('drafts')}`}>
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-3xl shadow-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-white font-semibold text-sm">Auto-Saving Draft</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-white text-xs">
                      <span>Last Saved</span>
                      <span className="font-mono">2 seconds ago</span>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <p className="text-white text-sm">Subject: Login Issues with Chrome Browser</p>
                      <p className="text-green-200 text-xs mt-1">Draft saved automatically</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Clock className="w-8 h-8 text-white mx-auto mb-2" />
                    <p className="text-white text-xs font-medium">Auto-Save</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <MessageSquare className="w-8 h-8 text-white mx-auto mb-2" />
                    <p className="text-white text-xs font-medium">Rich Content</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Headphones className="w-8 h-8 text-white mx-auto mb-2" />
                    <p className="text-white text-xs font-medium">Voice Notes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-green-200">
                <Clock className="w-4 h-4" />
                Smart Drafts
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Never Lose Your <span className="text-green-600">Work Again</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our intelligent draft system automatically saves your progress as you type. Resume where you left off anytime, anywhere.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Automatic Saving</p>
                    <p className="text-gray-600 text-xs">Saves every few seconds as you type</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Rich Content Support</p>
                    <p className="text-gray-600 text-xs">Preserves formatting and attachments</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Easy Recovery</p>
                    <p className="text-gray-600 text-xs">Access drafts from any device, anytime</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/ticket"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Create Your First Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden" data-section="cta">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className={`relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 ${getSectionClasses('cta')}`}>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-bold mb-8 border border-white/20">
              <Award className="w-4 h-4" />
              Trusted by Enterprise Teams
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Your Support?
            </span>
          </h2>

          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
            Join thousands of teams who&apos;ve revolutionized their support workflow.
            Start your free trial today and experience the difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/ticket"
              className="group relative inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 bg-transparent text-white px-6 py-3 rounded-xl font-semibold text-base border-2 border-white/30 hover:border-white hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
            >
              <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              View Live Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-200 font-medium">Tickets Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-200 font-medium">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-200 font-medium">Teams Trust Us</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-4 mb-6 group">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">TicketFlow</h4>
                  <p className="text-blue-300 font-medium">Enterprise Support Platform</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg mb-8 max-w-lg">
                Transform your support operations with our professional ticket management system.
                <span className="text-blue-300 font-medium"> Trusted by modern teams</span> worldwide for exceptional customer service delivery.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700/50">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-gray-300">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700/50">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">99.9% Uptime</span>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Product Links */}
              <div>
                <h5 className="text-white font-bold text-lg mb-6 relative">
                  Product
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </h5>
                <ul className="space-y-3">
                  <li>
                    <Link href="/ticket" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200">
                      <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                      <span>Create Ticket</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200">
                      <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/analytics" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200">
                      <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                      <span>Analytics</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/integrations" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200">
                      <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                      <span>Integrations</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h5 className="text-white font-bold text-lg mb-6 relative">
                  Resources
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </h5>
                <ul className="space-y-3">
                  <li>
                    <Link href="/docs" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200">
                      <BookOpen className="w-4 h-4 transform transition-transform group-hover:scale-110" />
                      <span>Documentation</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/api" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200">
                      <Code className="w-4 h-4 transform transition-transform group-hover:scale-110" />
                      <span>API Reference</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/guides" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200">
                      <Users className="w-4 h-4 transform transition-transform group-hover:scale-110" />
                      <span>Best Practices</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200">
                      <Headphones className="w-4 h-4 transform transition-transform group-hover:scale-110" />
                      <span>Support Center</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Key Features */}
              <div>
                <h5 className="text-white font-bold text-lg mb-6 relative">
                  Features
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </h5>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">Rich Text Editor</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span className="text-gray-300">Voice Notes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                    <span className="text-gray-300">Auto-Save Drafts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
                    <span className="text-gray-300">Smart Analytics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <p className="text-gray-400 text-sm">
                  © 2024 TicketFlow. Enterprise-grade support platform.
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                  <Link href="/security" className="hover:text-white transition-colors">Security</Link>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Powered by</span>
                  <div className="flex items-center gap-3">
                    <div className="group flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-200">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-sm"></div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Next.js 15</span>
                    </div>
                    <div className="group flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-200">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">React 19</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;