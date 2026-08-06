import { BASE_URL, getHeaders, apiFetch } from './apiClient';
import type { ChatResponse, MessageCreate, MessageResponse } from './types';

export const chatService = {
  startDirectChat: async (targetUserId: number): Promise<ChatResponse> => {
    return apiFetch<ChatResponse>(`${BASE_URL}/chat/direct/${targetUserId}`, {
      method: 'POST',
      headers: getHeaders(true),
    });
  },

  listMyChats: async (): Promise<ChatResponse[]> => {
    return apiFetch<ChatResponse[]>(`${BASE_URL}/chat/`, {
      headers: getHeaders(true),
    });
  },

  sendMessage: async (chatId: number, data: MessageCreate): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`${BASE_URL}/chat/${chatId}/messages`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  getMessages: async (chatId: number, skip = 0, limit = 50): Promise<MessageResponse[]> => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    return apiFetch<MessageResponse[]>(`${BASE_URL}/chat/${chatId}/messages?${params.toString()}`, {
      headers: getHeaders(true),
    });
  },
};