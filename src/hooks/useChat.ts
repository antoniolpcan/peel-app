import { chatService, type ChatResponse, type MessageCreate, type MessageResponse } from '@/services';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

export const WS_BASE_URL = import.meta.env.VITE_WS_URL;

export const useChat = () => {
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [activeMessages, setActiveMessages] = useState<MessageResponse[]>([]);
  
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  const unreadCount = useMemo(() => {
    return chats.reduce((acc, chat) => {
      const count = (chat as any).unread_count ?? (chat as any).unread_messages_count ?? 0;
      return acc + count;
    }, 0);
  }, [chats]);

  const fetchMyChats = useCallback(async () => {
    setLoadingChats(true);
    setError(null);
    try {
      const data = await chatService.listMyChats();
      setChats(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar conversas.');
    } finally {
      setLoadingChats(false);
    }
  }, []);

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

  const fetchMessages = useCallback(async (chatId: number, skip = 0, limit = 50) => {
    setLoadingMessages(true);
    setError(null);
    try {
      const messages = await chatService.getMessages(chatId, skip, limit);
      setActiveMessages(messages);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, unread_count: 0, unread_messages_count: 0 }
            : chat
        )
      );
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar mensagens.');
    } finally {
      setLoadingMessages(false);
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

      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      
      socketRef.current = null;
    }
  }, []);

  const connectWebSocket = useCallback((chatId: number) => {
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
      } catch {
      }
    };

    ws.onerror = () => {};
    ws.onclose = () => {};

    socketRef.current = ws;
  }, [disconnectWebSocket]);

  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

  return {
    chats,
    activeMessages,
    unreadCount,
    loading: loadingChats || loadingMessages,
    loadingChats,
    loadingMessages,
    error,
    fetchMyChats,
    startDirectChat,
    fetchMessages,
    sendMessage,
    connectWebSocket,
    disconnectWebSocket,
  };
};