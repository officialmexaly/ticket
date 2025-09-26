'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { BarChart3, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Users, Ticket } from 'lucide-react'

interface AnalyticsData {
  totalTickets: number
  openTickets: number
  closedTickets: number
  avgResolutionTime: number
  ticketsByPriority: {
    high: number
    medium: number
    low: number
  }
  ticketsByStatus: {
    open: number
    'in-progress': number
    closed: number
  }
  recentActivity: {
    date: string
    tickets: number
  }[]
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Fetch tickets data
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('status, priority, created_at, updated_at')

      if (ticketsError) throw ticketsError

      // Calculate analytics
      const totalTickets = tickets?.length || 0
      const openTickets = tickets?.filter(t => t.status === 'Open').length || 0
      const closedTickets = tickets?.filter(t => t.status === 'Closed').length || 0

      const ticketsByPriority = {
        high: tickets?.filter(t => t.priority === 'High').length || 0,
        medium: tickets?.filter(t => t.priority === 'Medium').length || 0,
        low: tickets?.filter(t => t.priority === 'Low').length || 0,
      }

      const ticketsByStatus = {
        open: tickets?.filter(t => t.status === 'Open').length || 0,
        'in-progress': tickets?.filter(t => t.status === 'In Progress').length || 0,
        closed: tickets?.filter(t => t.status === 'Closed').length || 0,
      }

      // Calculate average resolution time (mock data for now)
      const avgResolutionTime = 2.5

      // Generate recent activity data
      const recentActivity = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return {
          date: date.toISOString().split('T')[0],
          tickets: Math.floor(Math.random() * 10) + 1
        }
      }).reverse()

      setAnalytics({
        totalTickets,
        openTickets,
        closedTickets,
        avgResolutionTime,
        ticketsByPriority,
        ticketsByStatus,
        recentActivity
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const resolutionTrend = analytics?.avgResolutionTime ? (analytics.avgResolutionTime < 3 ? 'up' : 'down') : 'up'

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Monitor performance and track key metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalTickets || 0}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">+12% from last month</span>
              </div>
            </div>
            <Ticket className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.openTickets || 0}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-600">-5% from last month</span>
              </div>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.closedTickets || 0}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">+8% from last month</span>
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Resolution Time</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.avgResolutionTime || 0}h</p>
              <div className="flex items-center gap-1 mt-1">
                {resolutionTrend === 'up' ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">15% faster</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-600">10% slower</span>
                  </>
                )}
              </div>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets by Priority */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Priority</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">High Priority</span>
              </div>
              <span className="font-semibold">{analytics?.ticketsByPriority.high || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{
                  width: `${analytics?.totalTickets ? (analytics.ticketsByPriority.high / analytics.totalTickets) * 100 : 0}%`
                }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Medium Priority</span>
              </div>
              <span className="font-semibold">{analytics?.ticketsByPriority.medium || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{
                  width: `${analytics?.totalTickets ? (analytics.ticketsByPriority.medium / analytics.totalTickets) * 100 : 0}%`
                }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Low Priority</span>
              </div>
              <span className="font-semibold">{analytics?.ticketsByPriority.low || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${analytics?.totalTickets ? (analytics.ticketsByPriority.low / analytics.totalTickets) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tickets by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Open</span>
              </div>
              <span className="font-semibold">{analytics?.ticketsByStatus.open || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${analytics?.totalTickets ? (analytics.ticketsByStatus.open / analytics.totalTickets) * 100 : 0}%`
                }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">In Progress</span>
              </div>
              <span className="font-semibold">{analytics?.ticketsByStatus['in-progress'] || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{
                  width: `${analytics?.totalTickets ? (analytics.ticketsByStatus['in-progress'] / analytics.totalTickets) * 100 : 0}%`
                }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Closed</span>
              </div>
              <span className="font-semibold">{analytics?.ticketsByStatus.closed || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${analytics?.totalTickets ? (analytics.ticketsByStatus.closed / analytics.totalTickets) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {analytics?.recentActivity.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">
                {new Date(day.date).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(day.tickets / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold w-8 text-right">{day.tickets}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}