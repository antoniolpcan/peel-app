import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { chatService } from '@/services/chatService';
import type { ChatResponse, MessageCreate, MessageResponse, UnreadSummaryResponse } from '@/services/types';
import { useAuth } from '@/contexts/AuthContext';
import { WS_BASE_URL } from '@/services/apiClient';

export type ExtendedChatResponse = ChatResponse & {
  unread_count?: number;
  unread_messages_count?: number;
  unreadCount?: number;
};

export const useChat = (autoFetch = false) => {
  const { loggedUserId } = useAuth();
  const [chats, setChats] = useState<ExtendedChatResponse[]>([]);
  const [activeMessages, setActiveMessages] = useState<MessageResponse[]>([]);
  const [unreadSummary, setUnreadSummary] = useState<UnreadSummaryResponse | null>(null);

  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  const fetchUnreadSummary = useCallback(async () => {
    try {
      const summary = await chatService.getUnreadSummary();
      setUnreadSummary(summary);
    } catch {
    }
  }, []);

  const unreadCount = useMemo(() => {
    if (chats.length > 0) {
      return chats.reduce((acc, chat) => {
        const count = chat.unread_count ?? chat.unread_messages_count ?? chat.unreadCount ?? 0;
        return acc + Number(count);
      }, 0);
    }
    return Number(unreadSummary?.total_unread ?? 0);
  }, [chats, unreadSummary]);

  const activeUnreadCount = useMemo(() => {
    return activeMessages.filter(
      (m) => !m.is_read && m.sender_id !== loggedUserId
    ).length;
  }, [activeMessages, loggedUserId]);

  const firstUnreadMessageId = useMemo(() => {
    const firstUnread = activeMessages.find(
      (m) => !m.is_read && m.sender_id !== loggedUserId
    );
    return firstUnread ? firstUnread.id : null;
  }, [activeMessages, loggedUserId]);

  const fetchMyChats = useCallback(async () => {
    setLoadingChats(true);
    setError(null);
    try {
      const data = await chatService.listMyChats();
      setChats(data as ExtendedChatResponse[]);
      await fetchUnreadSummary();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar conversas.';
      setError(msg);
    } finally {
      setLoadingChats(false);
    }
  }, [fetchUnreadSummary]);

  useEffect(() => {
    if (autoFetch && loggedUserId) {
      fetchUnreadSummary();
    }
  }, [autoFetch, loggedUserId, fetchUnreadSummary]);

  const markActiveAsRead = useCallback(() => {
    setActiveMessages((prev) =>
      prev.map((m) =>
        m.sender_id !== loggedUserId && !m.is_read ? { ...m, is_read: true } : m
      )
    );
  }, [loggedUserId]);

  const fetchMessages = useCallback(async (chatId: string, skip = 0, limit = 50) => {
    setLoadingMessages(true);
    setError(null);
    try {
      const messages = await chatService.getMessages(chatId, skip, limit);
      
      setActiveMessages((prev) => (skip === 0 ? messages : [...messages, ...prev]));
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, unread_count: 0, unread_messages_count: 0, unreadCount: 0 }
            : chat
        )
      );
      fetchUnreadSummary();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar mensagens.';
      setError(msg);
    } finally {
      setLoadingMessages(false);
    }
  }, [fetchUnreadSummary]);

  const startDirectChat = useCallback(async (targetUserId: string) => {
    setLoadingChats(true);
    setError(null);
    try {
      const chat = await chatService.startDirectChat(targetUserId);
      setChats((prev) => {
        const exists = prev.some((c) => c.id === chat.id);
        if (exists) return prev;
        return [chat as ExtendedChatResponse, ...prev];
      });
      return chat;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao iniciar conversa.';
      setError(msg);
      throw err;
    } finally {
      setLoadingChats(false);
    }
  }, []);

  const sendMessage = useCallback(async (chatId: string, data: MessageCreate) => {
    try {
      const newMsg = await chatService.sendMessage(chatId, data);
      
      setActiveMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      return newMsg;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao enviar mensagem.';
      setError(msg);
      throw err;
    }
  }, []);

  const disconnectWebSocket = useCallback(() => {
    if (socketRef.current) {
      const socket = socketRef.current;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }

      socketRef.current = null;
    }
  }, []);

  const connectWebSocket = useCallback(
    (chatId: string) => {
      disconnectWebSocket();

      if (!chatId) return;

      const token = localStorage.getItem('@peel:token');
      const wsUrl = `${WS_BASE_URL}/chat/ws/${chatId}${token ? `?token=${token}` : ''}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (socketRef.current !== ws) {
          ws.close();
        }
      };

      ws.onmessage = (event) => {
        try {
          const newMessage: MessageResponse = JSON.parse(event.data);
          
          const isFromOtherUser = newMessage.sender_id !== loggedUserId;
          const formattedMessage = isFromOtherUser 
            ? { ...newMessage, is_read: true } 
            : newMessage;

          setActiveMessages((prev) => {
            if (prev.some((m) => m.id === formattedMessage.id)) return prev;
            return [...prev, formattedMessage];
          });

          fetchUnreadSummary();
        } catch {
        }
      };

      ws.onerror = () => {};
      ws.onclose = () => {};

      socketRef.current = ws;
    },
    [disconnectWebSocket, fetchUnreadSummary, loggedUserId]
  );

  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

  return {
    chats,
    activeMessages,
    unreadCount,
    unreadSenders: unreadSummary?.senders || [],
    activeUnreadCount,
    firstUnreadMessageId,
    loading: loadingChats || loadingMessages,
    loadingChats,
    loadingMessages,
    error,
    fetchMyChats,
    fetchUnreadSummary,
    startDirectChat,
    fetchMessages,
    sendMessage,
    markActiveAsRead,
    connectWebSocket,
    disconnectWebSocket,
  };
};