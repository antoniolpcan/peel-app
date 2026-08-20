import { apiFetch } from './apiClient';
import type { NotificationCreate, NotificationResponse } from './types';

export const notificationService = {
  createNotification: async (data: NotificationCreate): Promise<NotificationResponse> => {
    return apiFetch<NotificationResponse>('/notifications/', {
      method: 'POST',
      body: data,
    });
  },

  listNotifications: async (skip = 0, limit = 20): Promise<NotificationResponse[]> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    return apiFetch<NotificationResponse[]>(`/notifications/me?${params.toString()}`, {
    });
  },

  markAsRead: async (notificationId: string): Promise<NotificationResponse> => {
    return apiFetch<NotificationResponse>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>('/notifications/read-all', {
      method: 'PATCH',
    });
  },
};