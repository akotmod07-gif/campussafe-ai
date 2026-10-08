import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationAPI, localStore } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const data = await notificationAPI.getAll(user.email, user.role);
      setNotifications(data || []);
      setUnreadCount(data?.filter((n) => !n.read).length || 0);
    } catch {
      const local = localStore.getNotifications();
      const filtered = local.filter((n) => {
        if (user.role === 'admin') return true;
        return n.user?.toLowerCase() === user.email?.toLowerCase();
      });
      setNotifications(filtered);
      setUnreadCount(filtered.filter((n) => !n.read).length);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    const handleUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener('csa_notifications_updated', handleUpdate);
    return () => window.removeEventListener('csa_notifications_updated', handleUpdate);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    await notificationAPI.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await notificationAPI.markAllAsRead(user.email, user.role);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: 'notif_' + Date.now(),
      createdAt: new Date().toISOString(),
      read: false,
      ...notif,
    };
    const current = localStore.getNotifications();
    localStore.saveNotifications([newNotif, ...current]);
  };

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
