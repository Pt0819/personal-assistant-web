import { API_BASE_URL } from '@/config/api';

let getToken: (() => string | null) | null = null;
let onUnauthorized: (() => void) | null = null;

export function configureClient(config: {
  getToken: () => string | null;
  onUnauthorized: () => void;
}) {
  getToken = config.getToken;
  onUnauthorized = config.onUnauthorized;
}

export class ApiError extends Error {
  status: number;
  code: number;

  constructor(status: number, code: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getToken?.();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });

  if (response.status === 401) {
    onUnauthorized?.();
    throw new ApiError(401, 7, '未登录或登录已过期');
  }

  const json = await response.json();

  if (json.code !== 0) {
    throw new ApiError(response.status, json.code, json.msg || '请求失败');
  }

  return json.data as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
