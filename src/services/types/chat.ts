import type { BasicUserResponse } from "./user";

export interface ChatMemberResponse {
  user_id: number;
  joined_at: string;
  user?: BasicUserResponse | null;
}

export interface ChatResponse {
  id: number;
  created_at: string;
  members?: ChatMemberResponse[];
}

export interface MessageCreate {
  content: string;
}

export interface MessageResponse {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: BasicUserResponse | null;
}