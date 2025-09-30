'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Trash2, Clock, AlertCircle, Info, CheckCircle, Settings as SettingsIcon } from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  created_at: string
  action_url?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'info',
      title: 'New ticket assigned',
      message: 'Ticket #1234 has been assigned to you for review.',
      read: false,
      created_at: '2024-01-25T10:30:00Z',
      action_url: '/tickets/1234'
    },
    {
      id: '2',
      type: 'success',
      title: 'Ticket resolved successfully',
      message: 'Your ticket #1230 has been resolved and closed.',
      read: false,
      created_at: '2024-01-25T09:15:00Z',
      action_url: '/tickets/1230'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Ticket escalation required',
      message: 'Ticket #1228 requires immediate attention due to high priority.',
      read: true,
      created_at: '2024-01-24T16:45:00Z',
      action_url: '/tickets/1228'
    },
    {
      id: '4',
      type: 'error',
      title: 'System maintenance scheduled',
      message: 'Planned maintenance will occur tomorrow from 2-4 AM PST.',
      read: true,
      created_at: '2024-01-24T14:20:00Z'
    },
    {
      id: '5',
      type: 'info',
      title: 'New user registered',
      message: 'A new user has registered and is waiting for approval.',
      read: false,
      created_at: '2024-01-24T11:30:00Z'
    }
  ]

  useEffect(() => {
    setNotifications(mockNotifications)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  // Unused function kept for future use
  // const getNotificationBgColor = (type: Notification['type'], read: boolean) => {
  //   const opacity = read ? '50' : '100'
  //   switch (type) {
  //     case 'success':
  //       return `bg-green-${opacity}`
  //     case 'warning':
  //       return `bg-yellow-${opacity}`
  //     case 'error':
  //       return `bg-red-${opacity}`
  //     default:
  //       return `bg-blue-${opacity}`
  //   }
  // }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your latest activities</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <SettingsIcon className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4 text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Read</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        <div className="flex items-center gap-2">
          {['all', 'unread', 'read'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as 'all' | 'unread' | 'read')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === filterOption
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              {filterOption === 'unread' && unreadCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              {filter === 'unread'
                ? "You're all caught up! No unread notifications."
                : filter === 'read'
                ? "No read notifications to display."
                : "You don't have any notifications yet."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 transition-colors ${
                  !notification.read ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-semibold ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                          )}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          !notification.read ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(notification.created_at)}
                          </div>
                          {notification.action_url && (
                            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                              View Details →
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}