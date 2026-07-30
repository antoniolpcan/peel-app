export type SortOrder = 'asc' | 'desc';
export type PostSortField = 'id' | 'title' | 'likes' | 'created_at';

export interface GetPostsParams {
  skip?: number;
  limit?: number;
  title?: string;
  user_id?: number;
  order_by?: PostSortField;
  sort_order?: SortOrder;
}

export interface PostResponse {
  id: number;
  title: string;
  body: string;
  color_id: number | null;
  user_id: number;
  likes: number;
  created_at: string | null;
}

export interface PostBase {
  title: string;
  body: string;
  color_id?: number | null;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  created_at: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  username: string | null;
  bio: string | null;
  created_at: string;
}