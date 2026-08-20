import type { BasicUserResponse } from "./user";

export interface ChatMemberResponse {
  user_id: string;
  joined_at: string;
  user?: BasicUserResponse | null;
}

export interface ChatResponse {
  id: string;
  created_at: string;
  members?: ChatMemberResponse[];
}

export interface MessageCreate {
  content: string;
}

export interface MessageResponse {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: BasicUserResponse | null;
}

export interface UnreadSenderResponse {
  user: BasicUserResponse;
  unread_count: number;
}

export interface UnreadSummaryResponse {
  total_unread: number;
  senders: UnreadSenderResponse[];
}