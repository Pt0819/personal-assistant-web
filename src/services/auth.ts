import { api } from './client';
import type { QrcodeResponse, StatusResponse, RefreshResponse, User } from '@/types';

export async function fetchQrcode(): Promise<QrcodeResponse> {
  return api.get<QrcodeResponse>('/auth/wechat/web/qrcode');
}

export async function pollStatus(tempToken: string): Promise<StatusResponse> {
  return api.get<StatusResponse>(
    `/auth/wechat/web/status?temp_token=${encodeURIComponent(tempToken)}`,
  );
}

export async function refreshToken(refreshToken: string): Promise<RefreshResponse> {
  return api.post<RefreshResponse>('/auth/refresh', {
    refresh_token: refreshToken,
  });
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function fetchUserProfile(): Promise<User> {
  return api.get<User>('/user/profile');
}

export interface DevLoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export async function postDevLogin(): Promise<DevLoginResponse> {
  return api.post<DevLoginResponse>('/auth/dev/login');
}
