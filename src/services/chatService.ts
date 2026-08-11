import { apiFetch } from './apiClient';
import type { ChatResponse, MessageCreate, MessageResponse, UnreadSummaryResponse } from './types';

export const chatService = {
  startDirectChat: async (targetUserId: number): Promise<ChatResponse> => {
    return apiFetch<ChatResponse>(`/chat/direct/${targetUserId}`, {
      method: 'POST',
      auth: true,
    });
  },

  listMyChats: async (): Promise<ChatResponse[]> => {
    return apiFetch<ChatResponse[]>('/chat/', {
      auth: true,
    });
  },

  getUnreadSummary: async (): Promise<UnreadSummaryResponse> => {
    return apiFetch<UnreadSummaryResponse>('/chat/unread', {
      auth: true,
    });
  },

  sendMessage: async (chatId: number, data: MessageCreate): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/chat/${chatId}/messages`, {
      method: 'POST',
      auth: true,
      body: data,
    });
  },

  getMessages: async (chatId: number, skip = 0, limit = 50): Promise<MessageResponse[]> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    return apiFetch<MessageResponse[]>(`/chat/${chatId}/messages?${params.toString()}`, {
      auth: true,
    });
  },
};