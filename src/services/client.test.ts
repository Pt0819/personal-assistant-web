import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureClient, api, ApiError } from './client';

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
});
