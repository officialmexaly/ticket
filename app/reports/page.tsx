'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, Filter, TrendingUp, Clock, Users, AlertCircle } from 'lucide-react'

interface Report {
  id: string
  name: string
  description: string
  type: 'tickets' | 'users' | 'performance' | 'system'
  generated_at: string
  file_size: string
  status: 'ready' | 'generating' | 'failed'
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedType, setSelectedType] = useState<'all' | 'tickets' | 'users' | 'performance' | 'system'>('all')
  const [dateRange, setDateRange] = useState('30d')

  const mockReports: Report[] = [
    {
      id: '1',
      name: 'Monthly Ticket Report',
      description: 'Comprehensive analysis of ticket volume, resolution times, and customer satisfaction',
      type: 'tickets',
      generated_at: '2024-01-25T10:30:00Z',
      file_size: '2.4 MB',
      status: 'ready'
    },
    {
      id: '2',
      name: 'User Activity Report',
      description: 'User engagement metrics, login patterns, and feature usage statistics',
      type: 'users',
      generated_at: '2024-01-25T09:15:00Z',
      file_size: '1.8 MB',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Performance Analytics',
      description: 'System performance metrics, response times, and uptime statistics',
      type: 'performance',
      generated_at: '2024-01-24T16:45:00Z',
      file_size: '3.2 MB',
      status: 'ready'
    },
    {
      id: '4',
      name: 'System Health Report',
      description: 'Infrastructure monitoring, error rates, and resource utilization',
      type: 'system',
      generated_at: '2024-01-24T14:20:00Z',
      file_size: '4.1 MB',
      status: 'generating'
    },
    {
      id: '5',
      name: 'Weekly Ticket Trends',
      description: 'Week-over-week ticket trends and priority distribution analysis',
      type: 'tickets',
      generated_at: '2024-01-24T11:30:00Z',
      file_size: '1.2 MB',
      status: 'failed'
    }
  ]

  useEffect(() => {
    setReports(mockReports)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredReports = reports.filter(report => {
    return selectedType === 'all' || report.type === selectedType
  })

  const generateReport = (type: string) => {
    console.log(`Generating ${type} report for ${dateRange} period`)
  }

  const downloadReport = (reportId: string) => {
    console.log(`Downloading report ${reportId}`)
  }

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
            Ready
          </span>
        )
      case 'generating':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1 animate-pulse"></div>
            Generating
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1"></div>
            Failed
          </span>
        )
    }
  }

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'tickets':
        return <FileText className="w-5 h-5 text-blue-500" />
      case 'users':
        return <Users className="w-5 h-5 text-green-500" />
      case 'performance':
        return <TrendingUp className="w-5 h-5 text-purple-500" />
      case 'system':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and download system reports</p>
        </div>
      </div>

      {/* Quick Generate */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Generate New Report</h3>
            <p className="text-blue-100">Create custom reports with specific date ranges and filters</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={() => generateReport('custom')}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ready to Download</p>
              <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'ready').length}</p>
            </div>
            <Download className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Generating</p>
              <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'generating').length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'failed').length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filter by type:</span>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'tickets', 'users', 'performance', 'system'].map((type) => (
            <button
              key={type}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setSelectedType(type as any)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedType === type
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Available Reports</h2>
          <p className="text-sm text-gray-600">{filteredReports.length} reports</p>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(report.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                    <p className="text-gray-600 mt-1">{report.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.generated_at).toLocaleDateString()}
                      </div>
                      <span className="text-sm text-gray-500">{report.file_size}</span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                        {report.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(report.status)}
                  {report.status === 'ready' && (
                    <button
                      onClick={() => downloadReport(report.id)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  )}
                  {report.status === 'failed' && (
                    <button
                      onClick={() => generateReport(report.type)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredReports.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600">Try adjusting your filters or generate a new report</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}