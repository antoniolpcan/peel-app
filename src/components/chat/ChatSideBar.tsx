import { memo } from 'react';
import { MessageSquare, Search, Loader2 } from 'lucide-react';
import { ChatItem } from './ChatItem';
import type { ChatResponse, BasicUserResponse, UnreadSenderResponse } from '@/services/types';

interface ChatSidebarProps {
  chats: ChatResponse[];
  unreadSenders?: UnreadSenderResponse[];
  selectedChatId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading: boolean;
  getOtherUser: (chat: ChatResponse) => BasicUserResponse | undefined;
  onSelectChat: (chatId: string) => void;
}

export const ChatSidebar = memo(function ChatSidebar({
  chats,
  unreadSenders = [],
  selectedChatId,
  searchQuery,
  onSearchChange,
  loading,
  getOtherUser,
  onSelectChat,
}: ChatSidebarProps) {
  return (
    <aside
      className={`md:col-span-4 border-r border-app-border flex-col bg-app-bg/30 h-full min-h-0 ${
        selectedChatId ? 'hidden md:flex' : 'flex'
      }`}
    >
      <div className="p-3 border-b border-app-border space-y-2 shrink-0">
        <div className="font-semibold text-app-text text-xs flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-app-accent" />
          <span>Suas Conversas</span>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-app-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar conversa..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-app-bg text-app-text border border-app-border rounded-lg pl-8 pr-3 
              py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-app-accent transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-app-border/30">
        {loading && chats.length === 0 ? (
          <div className="flex items-center justify-center p-8 text-app-muted gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-app-accent" />
            Carregando...
          </div>
        ) : chats.length === 0 ? (
          <p className="p-6 text-xs text-app-muted text-center">
            Nenhuma conversa encontrada.
          </p>
        ) : (
          chats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const senderUnread = unreadSenders.find(
              (s) => s.user.id === otherUser?.id
            );

            const unreadCount =
              senderUnread?.unread_count ??
              Number(
                (chat as any).unread_count ??
                (chat as any).unread_messages_count ??
                (chat as any).unreadCount ??
                0
              );

            return (
              <ChatItem
                key={chat.id}
                chat={chat}
                otherUser={otherUser}
                isSelected={selectedChatId === chat.id}
                unreadCount={unreadCount}
                onSelect={onSelectChat}
              />
            );
          })
        )}
      </div>
    </aside>
  );
});