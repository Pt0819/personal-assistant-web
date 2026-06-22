import { describe, it, expect } from 'vitest';
import { act } from '@testing-library/react';
import { useAuthStore } from '@/stores/authStore';

describe('useAuthStore', () => {
  it('starts unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.jwt).toBeNull();
  });

  it('login sets authenticated state', () => {
    act(() => {
      useAuthStore.getState().login('jwt-token', 'refresh-token', { id: 1, openid: 'test', nickname: 'Test', avatar_url: '' });
    });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.jwt).toBe('jwt-token');
    expect(state.refreshToken).toBe('refresh-token');
    expect(state.user?.nickname).toBe('Test');
  });

  it('logout clears state', () => {
    act(() => { useAuthStore.getState().login('jwt', 'rt', { id: 1, openid: 'o', nickname: 'N', avatar_url: '' }); });
    act(() => { useAuthStore.getState().logout(); });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.jwt).toBeNull();
    expect(state.user).toBeNull();
  });
});
