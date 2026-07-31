import type { BasicUserResponse } from "./user";

export interface CommentResponse {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  user: BasicUserResponse;
  created_at: string;
}