import { notificationService, type NotificationCreate, type NotificationResponse } from '@/services';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const WS_BASE_URL = import.meta.env.VITE_WS_URL;

export const useNotifications = (autoFetch = true) => {
  const { loggedUserId } = useAuth();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const fetchNotifications = useCallback(async (skip = 0, limit = 20) => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.listNotifications(skip, limit);
      if (isMounted) {
        setNotifications(data);
      }
    } catch (err: any) {
      if (isMounted) {
        setError(err.message || 'Erro ao carregar notificações.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: number) => {
    let previousNotifications: NotificationResponse[] = [];

    setNotifications((prev) => {
      previousNotifications = prev;
      return prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n));
    });

    try {
      const updated = await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? updated : n))
      );
      return updated;
    } catch (err: any) {
      setNotifications(previousNotifications);
      setError(err.message || 'Erro ao marcar notificação como lida.');
      throw err;
    }
  }, []);

  const createNotification = useCallback(async (data: NotificationCreate) => {
    try {
      return await notificationService.createNotification(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar notificação.');
      throw err;
    }
  }, []);

  useEffect(() => {
    if (!loggedUserId) return;

    let isComponentMounted = true;
    const wsUrl = `${WS_BASE_URL}/notifications/ws/${loggedUserId}`;
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

    ws.onerror = () => {
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
    createNotification,
  };
};