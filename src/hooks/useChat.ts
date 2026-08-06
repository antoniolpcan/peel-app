import { chatService, type ChatResponse, type MessageCreate, type MessageResponse, type UnreadSummaryResponse } from '@/services';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const WS_BASE_URL = import.meta.env.VITE_WS_URL;

export const useChat = (autoFetch = false) => {
  const { loggedUserId } = useAuth();
  const [chats, setChats] = useState<ChatResponse[]>([]);
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
        const count =
          (chat as any).unread_count ??
          (chat as any).unread_messages_count ??
          (chat as any).unreadCount ??
          0;
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
      setChats(data);
      await fetchUnreadSummary();
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar conversas.');
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

  const fetchMessages = useCallback(async (chatId: number, skip = 0, limit = 50) => {
    setLoadingMessages(true);
    setError(null);
    try {
      const messages = await chatService.getMessages(chatId, skip, limit);
      setActiveMessages(messages);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, unread_count: 0, unread_messages_count: 0, unreadCount: 0 }
            : chat
        )
      );
      fetchUnreadSummary();
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar mensagens.');
    } finally {
      setLoadingMessages(false);
    }
  }, [fetchUnreadSummary]);

  const startDirectChat = useCallback(async (targetUserId: number) => {
    setLoadingChats(true);
    setError(null);
    try {
      const chat = await chatService.startDirectChat(targetUserId);
      setChats((prev) => {
        const exists = prev.some((c) => c.id === chat.id);
        if (exists) return prev;
        return [chat, ...prev];
      });
      return chat;
    } catch (err: any) {
      setError(err.message || 'Erro ao iniciar conversa.');
      throw err;
    } finally {
      setLoadingChats(false);
    }
  }, []);

  const sendMessage = useCallback(async (chatId: number, data: MessageCreate) => {
    try {
      const newMsg = await chatService.sendMessage(chatId, data);
      return newMsg;
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar mensagem.');
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
    (chatId: number) => {
      disconnectWebSocket();

      if (!chatId) return;

      const wsUrl = `${WS_BASE_URL}/chat/ws/${chatId}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (socketRef.current !== ws) {
          ws.close();
        }
      };

      ws.onmessage = (event) => {
        try {
          const newMessage: MessageResponse = JSON.parse(event.data);
          setActiveMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
          if (newMessage.sender_id !== loggedUserId) {
            markActiveAsRead();
          }

          fetchUnreadSummary();
        } catch {}
      };

      ws.onerror = () => {};
      ws.onclose = () => {};

      socketRef.current = ws;
    },
    [disconnectWebSocket, fetchUnreadSummary, loggedUserId, markActiveAsRead]
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