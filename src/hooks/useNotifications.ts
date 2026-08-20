import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { notificationService } from '@/services/notificationService';
import type { NotificationCreate, NotificationResponse } from '@/services/types';
import { useAuth } from '@/contexts/AuthContext';
import { WS_BASE_URL } from '@/services/apiClient';

export const useNotifications = (autoFetch = true) => {
  const { loggedUserId } = useAuth();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const fetchNotifications = useCallback(async (skip = 0, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.listNotifications(skip, limit);
      setNotifications((prev) => (skip === 0 ? data : [...prev, ...data]));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar notificações.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );

    try {
      const updated = await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? updated : n))
      );
      return updated;
    } catch (err: unknown) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: false } : n))
      );
      const msg = err instanceof Error ? err.message : 'Erro ao marcar notificação como lida.';
      setError(msg);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      await notificationService.markAllAsRead();
    } catch (err: unknown) {
      fetchNotifications();
      const msg = err instanceof Error ? err.message : 'Erro ao marcar todas como lidas.';
      setError(msg);
    }
  }, [fetchNotifications]);

  const createNotification = useCallback(async (data: NotificationCreate) => {
    try {
      return await notificationService.createNotification(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar notificação.';
      setError(msg);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (!loggedUserId) return;

    let isComponentMounted = true;
    const token = localStorage.getItem('@peel:token');
    
    const wsUrl = `${WS_BASE_URL}/notifications/ws/${loggedUserId}${token ? `?token=${token}` : ''}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (!isComponentMounted) {
        ws.close();
      }
    };

    ws.onmessage = (event) => {
      if (!isComponentMounted) return;
      try {
        const newNotification: NotificationResponse = JSON.parse(event.data);

        setNotifications((prev) => {
          if (prev.some((n) => n.id === newNotification.id)) return prev;
          return [newNotification, ...prev];
        });
      } catch {
      }
    };

    socketRef.current = ws;

    return () => {
      isComponentMounted = false;
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      socketRef.current = null;
    };
  }, [loggedUserId]);

  useEffect(() => {
    if (autoFetch && loggedUserId) {
      fetchNotifications();
    }
  }, [autoFetch, loggedUserId, fetchNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
  };
};