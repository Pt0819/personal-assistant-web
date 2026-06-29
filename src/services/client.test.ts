import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureClient, api, ApiError } from './client';
import { sendEmailCode, loginByCredential } from './auth';

describe('API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('adds Authorization header when token is available', async () => {
    configureClient({ getToken: () => 'test-jwt', onUnauthorized: vi.fn() });
    global.fetch = vi.fn().mockResolvedValue({ status: 200, json: () => Promise.resolve({ code: 0, msg: 'ok', data: { test: true } }) });
    await api.get('/test');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer test-jwt' }) }));
  });

  it('calls onUnauthorized on 401', async () => {
    const onUnauthorized = vi.fn();
    configureClient({ getToken: () => 'expired-jwt', onUnauthorized });
    global.fetch = vi.fn().mockResolvedValue({ status: 401, json: () => Promise.resolve({ code: 7, msg: '未登录', data: null }) });
    await expect(api.get('/test')).rejects.toThrow(ApiError);
    expect(onUnauthorized).toHaveBeenCalled();
  });

  it('throws ApiError for non-zero code', async () => {
    configureClient({ getToken: () => null, onUnauthorized: vi.fn() });
    global.fetch = vi.fn().mockResolvedValue({ status: 400, json: () => Promise.resolve({ code: 7, msg: '参数错误', data: null }) });
    await expect(api.post('/test', {})).rejects.toThrow(ApiError);
  });

  describe('credential auth APIs', () => {
    it('sendEmailCode posts to correct endpoint', async () => {
      configureClient({ getToken: () => null, onUnauthorized: vi.fn() });
      global.fetch = vi.fn().mockResolvedValue({ status: 200, json: () => Promise.resolve({ code: 0, msg: '验证码已发送', data: null }) });
      await sendEmailCode('test@example.com');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register/send-email-code'),
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'test@example.com' }) }),
      );
    });

    it('loginByCredential returns LoginResponse on success', async () => {
      const mockUser = { id: 1, username: '小助手_a3x7k2', nickname: '小助手_a3x7k2', avatar_url: '', auth_method: 'email' as const };
      configureClient({ getToken: () => null, onUnauthorized: vi.fn() });
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        json: () => Promise.resolve({ code: 0, msg: '成功', data: { access_token: 'jwt', refresh_token: 'rt', expires_in: 7200, user: mockUser } }),
      });
      const result = await loginByCredential({ account: 'test@example.com', password: 'abcd1234' });
      expect(result.access_token).toBe('jwt');
      expect(result.user.username).toBe('小助手_a3x7k2');
    });
  });
});
