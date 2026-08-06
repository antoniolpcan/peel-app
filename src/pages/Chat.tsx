import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/layout/PageLayout';

import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessageList } from '@/components/chat/ChatMessageList';
import { ChatMessageInput } from '@/components/chat/ChatMessageInput';
import { ChatEmptyState } from '@/components/chat/ChatEmptyState';
import type { ChatResponse } from '@/services/types';
import { ChatSidebar } from '@/components/chat/ChatSideBar';

function formatDateDivider(dateString: string): string {
  if (!dateString) return '';
  const messageDate = new Date(dateString);
  if (isNaN(messageDate.getTime())) return '';

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  if (isSameDay(messageDate, today)) return 'Hoje';
  if (isSameDay(messageDate, yesterday)) return 'Ontem';

  return messageDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function ChatPage() {
  const location = useLocation();
  const { loggedUserId } = useAuth();
  const { 
    chats, 
    activeMessages, 
    loading, 
    error, 
    fetchMyChats, 
    fetchMessages, 
    sendMessage, 
    connectWebSocket, 
    disconnectWebSocket 
  } = useChat();
  
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.selectedChatId) {
      setSelectedChatId(location.state.selectedChatId);
    }
  }, [location.state]);

  useEffect(() => {
    fetchMyChats();
  }, [fetchMyChats]);

  useEffect(() => {
    if (!selectedChatId) return;
    fetchMessages(selectedChatId);
    connectWebSocket(selectedChatId);
    return () => disconnectWebSocket();
  }, [selectedChatId, fetchMessages, connectWebSocket, disconnectWebSocket]);

  useEffect(() => {
    if (activeMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages]);

  const getOtherUser = useCallback(
    (chat: ChatResponse) => {
      const otherMember = chat.members?.find((m) => m.user_id !== loggedUserId);
      return otherMember?.user ?? undefined;;
    },
    [loggedUserId]
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = messageText.trim();
    if (!selectedChatId || !content) return;

    setMessageText('');
    await sendMessage(selectedChatId, { content });
  };

  const activeChat = useMemo(
    () => chats.find((c) => c.id === selectedChatId),
    [chats, selectedChatId]
  );
  
  const activeOtherUser = useMemo(
    () => (activeChat ? getOtherUser(activeChat) : null),
    [activeChat, getOtherUser]
  );

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter((chat) => {
      const user = getOtherUser(chat);
      return (
        user?.name?.toLowerCase().includes(query) ||
        user?.username?.toLowerCase().includes(query)
      );
    });
  }, [chats, searchQuery, getOtherUser]);

  return (
    <PageLayout>
      <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full h-[calc(100vh-180px)] min-h-112.5">
        <div>
          <h1 className="text-xl font-bold text-app-text tracking-tight">Mensagens Directs</h1>
          <p className="text-xs text-app-muted">Converse em tempo real com outros usuários.</p>
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 border border-app-border rounded-2xl overflow-hidden bg-app-card shadow-sm flex-1 h-full min-h-0">
          <ChatSidebar
            chats={filteredChats}
            selectedChatId={selectedChatId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            loading={loading}
            getOtherUser={getOtherUser}
            onSelectChat={setSelectedChatId}
          />

          <main
            className={`md:col-span-8 flex-col h-full min-h-0 bg-app-bg/10 ${
              selectedChatId ? 'flex' : 'hidden md:flex'
            }`}
          >
            {selectedChatId ? (
              <>
                <ChatHeader
                  selectedChatId={selectedChatId}
                  activeOtherUser={activeOtherUser}
                  onBack={() => setSelectedChatId(null)}
                />

                <ChatMessageList
                  messages={activeMessages}
                  loggedUserId={loggedUserId}
                  loading={loading}
                  messagesEndRef={messagesEndRef}
                  formatDateDivider={formatDateDivider}
                />

                <ChatMessageInput
                  messageText={messageText}
                  onChangeText={setMessageText}
                  onSendMessage={handleSendMessage}
                />
              </>
            ) : (
              <ChatEmptyState />
            )}
          </main>
        </div>
      </div>
    </PageLayout>
  );
}