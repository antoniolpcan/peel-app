import { apiFetch } from './apiClient';
import type { ChatResponse, MessageCreate, MessageResponse, UnreadSummaryResponse } from './types';

export const chatService = {
  startDirectChat: async (targetUserId: string): Promise<ChatResponse> => {
    return apiFetch<ChatResponse>(`/chat/direct/${targetUserId}`, {
      method: 'POST',
    });
  },

  listMyChats: async (): Promise<ChatResponse[]> => {
    return apiFetch<ChatResponse[]>('/chat/', {
    });
  },

  getUnreadSummary: async (): Promise<UnreadSummaryResponse> => {
    return apiFetch<UnreadSummaryResponse>('/chat/unread', {
    });
  },

  sendMessage: async (chatId: string, data: MessageCreate): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/chat/${chatId}/messages`, {
      method: 'POST',
      body: data,
    });
  },

  getMessages: async (chatId: string, skip = 0, limit = 50): Promise<MessageResponse[]> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    return apiFetch<MessageResponse[]>(`/chat/${chatId}/messages?${params.toString()}`, {
    });
  },
};