'use client'

import { useState } from 'react'
import { HelpCircle, Search, Book, Video, MessageCircle, Mail, Phone, Clock, ChevronRight, Star } from 'lucide-react'

interface HelpArticle {
  id: string
  title: string
  content: string
  category: string
  helpful: number
  views: number
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'faq' | 'tutorials' | 'contact'>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using our ticketing system',
      icon: <Book className="w-6 h-6 text-blue-500" />,
      articles: 12
    },
    {
      id: 'tickets',
      title: 'Managing Tickets',
      description: 'Create, update, and track your support tickets',
      icon: <HelpCircle className="w-6 h-6 text-green-500" />,
      articles: 8
    },
    {
      id: 'account',
      title: 'Account & Settings',
      description: 'Manage your profile and preferences',
      icon: <MessageCircle className="w-6 h-6 text-purple-500" />,
      articles: 6
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Resolve common issues and errors',
      icon: <HelpCircle className="w-6 h-6 text-red-500" />,
      articles: 15
    }
  ]

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I create a new support ticket?',
      answer: 'To create a new ticket, click the "New Ticket" button in the top right corner of your dashboard. Fill in the required information including title, description, and priority level.',
      category: 'tickets'
    },
    {
      id: '2',
      question: 'What are the different priority levels?',
      answer: 'We have three priority levels: High (urgent issues affecting business operations), Medium (important but not critical), and Low (general questions or minor issues).',
      category: 'tickets'
    },
    {
      id: '3',
      question: 'How long does it take to get a response?',
      answer: 'Response times vary by priority: High priority tickets receive a response within 2 hours, Medium within 4 hours, and Low priority within 24 hours.',
      category: 'general'
    },
    {
      id: '4',
      question: 'Can I attach files to my tickets?',
      answer: 'Yes, you can attach files up to 10MB in size. Supported formats include images, PDFs, text files, and common document formats.',
      category: 'tickets'
    },
    {
      id: '5',
      question: 'How do I update my profile information?',
      answer: 'Go to Settings in the sidebar menu, then select "Profile" to update your personal information, contact details, and preferences.',
      category: 'account'
    }
  ]

  const tutorials = [
    {
      id: '1',
      title: 'Getting Started with HelpDesk Pro',
      description: 'A comprehensive introduction to all features',
      duration: '5 min',
      type: 'video'
    },
    {
      id: '2',
      title: 'Creating Your First Ticket',
      description: 'Step-by-step guide to ticket creation',
      duration: '3 min',
      type: 'article'
    },
    {
      id: '3',
      title: 'Managing Notifications',
      description: 'Configure your notification preferences',
      duration: '2 min',
      type: 'article'
    },
    {
      id: '4',
      title: 'Advanced Search and Filtering',
      description: 'Find tickets quickly using filters',
      duration: '4 min',
      type: 'video'
    }
  ]

  const contactOptions = [
    {
      type: 'email',
      title: 'Email Support',
      description: 'Get help via email',
      value: 'support@helpdesk.com',
      response: 'Within 24 hours',
      icon: <Mail className="w-5 h-5 text-blue-500" />
    },
    {
      type: 'phone',
      title: 'Phone Support',
      description: 'Call us directly',
      value: '+1 (555) 123-4567',
      response: 'Mon-Fri 9AM-5PM PST',
      icon: <Phone className="w-5 h-5 text-green-500" />
    },
    {
      type: 'chat',
      title: 'Live Chat',
      description: 'Chat with our team',
      value: 'Start chat',
      response: 'Available 24/7',
      icon: <MessageCircle className="w-5 h-5 text-purple-500" />
    }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for help articles, tutorials, or FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                {category.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600 font-medium">{category.articles} articles</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Need immediate help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>Start Live Chat</span>
          </button>
          <button className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <Phone className="w-5 h-5" />
            <span>Call Support</span>
          </button>
          <button className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <Mail className="w-5 h-5" />
            <span>Send Email</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderFAQ = () => (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <div key={faq.id} className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            {faq.question}
          </h3>
          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {faq.category}
            </span>
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                👍 Helpful
              </button>
              <button className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                👎 Not helpful
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderTutorials = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tutorials.map((tutorial) => (
        <div key={tutorial.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              {tutorial.type === 'video' ? (
                <Video className="w-6 h-6 text-blue-500" />
              ) : (
                <Book className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
              <p className="text-gray-600 mb-3">{tutorial.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{tutorial.duration}</span>
                </div>
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                  {tutorial.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderContact = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
        <p className="text-gray-600">Can&apos;t find what you&apos;re looking for? Our support team is here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactOptions.map((option) => (
          <div key={option.type} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                {option.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
            <p className="text-gray-600 mb-4">{option.description}</p>
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">{option.value}</p>
              <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                <Clock className="w-3 h-3" />
                {option.response}
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Contact Now
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900">Support Hours</h4>
            <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM PST</p>
            <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 3:00 PM PST</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Emergency Support</h4>
            <p className="text-gray-600">Available 24/7 for critical issues</p>
            <p className="text-gray-600">Use live chat or call our emergency line</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-xl text-gray-600">Find answers, learn features, and get support</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-1 p-1 bg-gray-100 rounded-xl w-fit mx-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'faq', label: 'FAQ' },
          { id: 'tutorials', label: 'Tutorials' },
          { id: 'contact', label: 'Contact' }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'faq' && renderFAQ()}
        {activeSection === 'tutorials' && renderTutorials()}
        {activeSection === 'contact' && renderContact()}
      </div>
    </div>
  )
}