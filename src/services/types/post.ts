import type { ColorResponse, PostSortField, SortOrder } from "./base";
import type { BasicUserResponse } from "./user";

export interface PostBase {
  title: string;
  body: string;
  color_id?: number | null;
}

export interface PostResponse {
  id: number;
  title: string;
  body: string;
  user_id: number;
  created_at: string;
  is_liked: boolean;
  user: BasicUserResponse;
  likes?: number;
  color_id?: number | null;
  color?: ColorResponse | null;
}

export interface PostUpdate {
  title?: string | null;
  body?: string | null;
  color_id?: number | null;
}

export interface GetPostsParams {
  skip?: number;
  limit?: number;
  title?: string;
  body?: string;
  user_id?: number;
  following_for_user_id?: number;
  order_by?: PostSortField;
  sort_order?: SortOrder;
}

export interface SearchPostParams {
  skip?: number; 
  limit?: number; 
  title?: string; 
  body?: string; 
  user_id?: number; 
  following_for_user_id?: number; 
  order_by?: string; 
  sort_order?: string;
}