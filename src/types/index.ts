// ==================== User ====================
export interface User {
  id: number;
  openid?: string;
  username: string;
  nickname: string;
  avatar_url: string;
  email?: string;
  phone?: string;
  auth_method: 'wechat' | 'email' | 'phone';
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

// ==================== Auth ====================
export interface QrcodeResponse {
  qrcode_url: string;
  temp_token: string;
  expires_in: number;
}

export interface StatusResponse {
  status: 'pending' | 'scanned' | 'confirmed';
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: User;
  nickname?: string;
  avatar_url?: string;
}

export interface RefreshResponse {
  access_token: string;
  expires_in: number;
}

// ==================== Schedule ====================
export interface Schedule {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  is_all_day: boolean;
  status: number;
  remind_before: number;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduleInput {
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  description?: string;
}

// ==================== Conversation ====================
export interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  parsed_intent?: string;
  parsed_json?: ScheduleInput | null;
  created_at: string;
}

export interface Conversation {
  id: number;
  title: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
}

export interface ChatRequest {
  content: string;
}

// ==================== API ====================
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// ==================== UI ====================
export type Theme = 'light' | 'dark';
export type CalendarView = 'day' | 'week';
