export interface UserSettingResponse {
  id: string;
  user_id: string;
  theme?: string;
  sound?: boolean;
  is_private?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
}

export interface UserSettingUpdate {
  theme?: string | null;
  sound?: boolean | null;
  is_private?: boolean | null;
  email_notifications?: boolean | null;
  push_notifications?: boolean | null;
}