"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import toast from 'react-hot-toast';
import eventBus from './event-bus';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'ticket_created' | 'ticket_updated' | 'ticket_deleted' | 'system' | 'info';
  ticket_id?: string;
  created_at: string;
  read: boolean;
  user_identifier?: string;
}

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  requestPushPermission: () => Promise<boolean>;
  isPushEnabled: boolean;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPushEnabled, setIsPushEnabled] = useState(false);

  // Check push notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setIsPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching notifications from API...');

      const response = await fetch('/api/notifications?limit=50');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched notifications:', data);
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem('app_notifications');
      if (stored) {
        const parsedNotifications = JSON.parse(stored);
        setNotifications(parsedNotifications);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save notifications to localStorage
  const saveNotifications = useCallback((updatedNotifications: NotificationData[]) => {
    localStorage.setItem('app_notifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
  }, []);

  // Add new notification
  const addNotification = useCallback((notification: Omit<NotificationData, 'id' | 'created_at' | 'read'>) => {
    const newNotification: NotificationData = {
      ...notification,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50); // Keep only last 50 notifications
      saveNotifications(updated);
      return updated;
    });

    // Show push notification if permission granted
    if (isPushEnabled && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: notification.type,
          renotify: true,
          requireInteraction: false,
          actions: [
            {
              action: 'view',
              title: 'View Ticket'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ]
        });
      });
    }

    // Show toast notification
    toast.success(notification.title);

    return newNotification;
  }, [isPushEnabled, saveNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: [notificationId],
          action: 'mark_read'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // Update local state
      setNotifications(prev => {
        const updated = prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        saveNotifications(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  }, [saveNotifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      if (unreadIds.length === 0) return;

      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: unreadIds,
          action: 'mark_read'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      // Update local state
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, read: true }));
        saveNotifications(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  }, [notifications, saveNotifications]);

  // Clear single notification
  const clearNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?ids=${notificationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      // Update local state
      setNotifications(prev => {
        const updated = prev.filter(n => n.id !== notificationId);
        saveNotifications(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  }, [saveNotifications]);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications?clear_all=true', {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to clear all notifications');
      }

      // Update local state
      setNotifications([]);
      localStorage.removeItem('app_notifications');
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      toast.error('Failed to clear all notifications');
    }
  }, []);

  // Request push notification permission
  const requestPushPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    if (Notification.permission === 'granted') {
      setIsPushEnabled(true);
      return true;
    }

    if (Notification.permission === 'denied') {
      toast.error('Push notifications are blocked. Please enable them in your browser settings.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setIsPushEnabled(granted);

      if (granted) {
        toast.success('Push notifications enabled!');

        // Register service worker for push notifications
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.register('/sw.js');
        }
      } else {
        toast.error('Push notifications permission denied');
      }

      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
      return false;
    }
  }, []);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  // Expose refresh function globally for dashboard use
  useEffect(() => {
    window.refreshNotifications = refreshNotifications;
    return () => {
      delete window.refreshNotifications;
    };
  }, [refreshNotifications]);

  // Set up real-time listeners for new tickets
  useEffect(() => {
    // Listen for immediate ticket creation events via event bus
    const unsubscribeTicketCreated = eventBus.on('ticket_created', (ticketData) => {
      console.log('🔔 Event bus: Notification for ticket created:', ticketData);

      // Immediately add notification
      addNotification({
        title: 'New Ticket Created',
        message: `"${ticketData.subject}" - ${ticketData.type} (${ticketData.priority} priority)`,
        type: 'ticket_created',
        ticket_id: ticketData.id,
        user_identifier: ticketData.user_identifier
      });
    });

    const subscription = supabase
      .channel('notifications-channel')
      // Listen for immediate broadcast events from API
      .on('broadcast', { event: 'ticket_created' }, (payload) => {
        console.log('🔔 Notification broadcast received:', payload);
        const ticket = payload.payload.ticket;

        // Immediately add notification
        addNotification({
          title: 'New Ticket Created',
          message: `"${ticket.subject}" - ${ticket.type} (${ticket.priority} priority)`,
          type: 'ticket_created',
          ticket_id: ticket.id,
          user_identifier: ticket.user_identifier
        });
      })
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tickets' },
        (payload) => {
          const ticket = payload.new;
          addNotification({
            title: 'New Ticket Created',
            message: `"${ticket.subject}" - ${ticket.type} (${ticket.priority} priority)`,
            type: 'ticket_created',
            ticket_id: ticket.id,
            user_identifier: ticket.user_identifier
          });
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tickets' },
        (payload) => {
          const ticket = payload.new;
          const oldTicket = payload.old;

          // Only notify on status changes
          if (ticket.status !== oldTicket.status) {
            addNotification({
              title: 'Ticket Status Updated',
              message: `"${ticket.subject}" status changed to ${ticket.status}`,
              type: 'ticket_updated',
              ticket_id: ticket.id,
              user_identifier: ticket.user_identifier
            });
          }
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'tickets' },
        (payload) => {
          const ticket = payload.old;
          addNotification({
            title: 'Ticket Deleted',
            message: `Ticket "${ticket.subject}" has been deleted`,
            type: 'ticket_deleted',
            ticket_id: ticket.id,
            user_identifier: ticket.user_identifier
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      unsubscribeTicketCreated();
    };
  }, [addNotification]);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    requestPushPermission,
    isPushEnabled,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};