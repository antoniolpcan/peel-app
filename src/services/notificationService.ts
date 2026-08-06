import { BASE_URL, getHeaders, apiFetch } from './apiClient';
import type { NotificationCreate, NotificationResponse } from './types';

export const notificationService = {
  createNotification: async (data: NotificationCreate): Promise<NotificationResponse> => {
    return apiFetch<NotificationResponse>(`${BASE_URL}/notifications/`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  listNotifications: async (skip = 0, limit = 20): Promise<NotificationResponse[]> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    return apiFetch<NotificationResponse[]>(`${BASE_URL}/notifications/me?${params.toString()}`, {
      headers: getHeaders(true),
    });
  },

  markAsRead: async (notificationId: number): Promise<NotificationResponse> => {
    return apiFetch<NotificationResponse>(`${BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: getHeaders(true),
    });
  },
};