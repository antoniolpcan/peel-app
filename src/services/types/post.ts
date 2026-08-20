import type { ColorResponse, PostSortField, SortOrder } from "./base";
import type { BasicUserResponse } from "./user";

export interface PostBase {
  title: string;
  body: string;
  color_id: string | null;
}

export interface PostResponse {
  id: string;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
  is_liked: boolean;
  user: BasicUserResponse;
  likes?: number;
  color_id: string | null;
  color?: ColorResponse | null;
}

export interface PostUpdate {
  title?: string | null;
  body?: string | null;
  color_id: string | null;
}

export interface GetPostsParams {
  skip?: number;
  limit?: number;
  title?: string;
  body?: string;
  user_id?: string;
  following_for_user_id?: string;
  order_by?: PostSortField;
  sort_order?: SortOrder;
}

export type SearchPostParams = GetPostsParams;