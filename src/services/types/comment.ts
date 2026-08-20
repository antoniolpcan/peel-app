import type { BasicUserResponse } from "./user";

export interface CommentResponse {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  user: BasicUserResponse;
  created_at: string;
}