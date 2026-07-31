export type SortOrder = "asc" | "desc";

export type PostSortField = "id" | "title" | "likes" | "created_at";

export interface MediaFileBase {
  id: number;
  url: string;
  filename: string;
}

export interface UploadResponse {
  message: string;
  data: MediaFileBase;
}

export interface ColorResponse {
  id: number;
  name: string;
  hex_code: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}