import { describe, it, expect } from 'vitest';
import { act } from '@testing-library/react';
import { useAuthStore } from '@/stores/authStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.removeItem('auth-storage');
    useAuthStore.getState().logout();
  });

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.jwt).toBeNull();
  });

  it('login sets authenticated state', () => {
    act(() => {
      useAuthStore.getState().login('jwt-token', 'refresh-token', { id: 1, username: 'test', openid: 'test', nickname: 'Test', avatar_url: '', auth_method: 'wechat' as const });
    });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.jwt).toBe('jwt-token');
    expect(state.refreshToken).toBe('refresh-token');
    expect(state.user?.nickname).toBe('Test');
  });

  it('logout clears state', () => {
    act(() => { useAuthStore.getState().login('jwt', 'rt', { id: 1, username: 'test', openid: 'o', nickname: 'N', avatar_url: '', auth_method: 'wechat' as const }); });
    act(() => { useAuthStore.getState().logout(); });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.jwt).toBeNull();
    expect(state.user).toBeNull();
  });

  it('persist version migration clears stale data', async () => {
    // Simulate old version (version 0) localStorage data
    const oldState = {
      state: { user: { id: 1, username: 'old_user', openid: 'old-openid', nickname: 'Old', avatar_url: '', auth_method: 'wechat' as const }, jwt: 'old-jwt', refreshToken: 'old-rt', isAuthenticated: true },
      version: 0,
    };
    localStorage.setItem('auth-storage', JSON.stringify(oldState));

    // Force re-read from storage, which re-runs migrate
    await useAuthStore.persist.rehydrate();

    const state = useAuthStore.getState();
    // Old version data should be cleared
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.jwt).toBeNull();
    localStorage.removeItem('auth-storage');
  });
});
