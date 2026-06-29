import { api } from './client';
import type { QrcodeResponse, StatusResponse, RefreshResponse, User, LoginResponse } from '@/types';

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

export async function postDevLogin(): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/dev/login');
}

// ==================== 邮箱验证码 ====================

export async function sendEmailCode(email: string): Promise<void> {
  await api.post('/auth/register/send-email-code', { email });
}

export async function sendSMSCode(phone: string): Promise<void> {
  await api.post('/auth/register/send-sms-code', { phone });
}

// ==================== 注册 ====================

export async function registerByEmail(params: {
  email: string;
  code: string;
  password: string;
}): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/register/email', params);
}

export async function registerByPhone(params: {
  phone: string;
  code: string;
  password: string;
}): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/register/phone', params);
}

// ==================== 凭证登录 ====================

export async function loginByCredential(params: {
  account: string;
  password: string;
}): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/login/credential', params);
}
