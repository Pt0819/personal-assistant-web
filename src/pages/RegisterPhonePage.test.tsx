import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RegisterPhonePage } from './RegisterPhonePage';
import { useAuthStore } from '@/stores/authStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterPhonePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, jwt: null, refreshToken: null, isAuthenticated: false });
  });

  it('renders phone registration form', () => {
    render(<MemoryRouter><RegisterPhonePage /></MemoryRouter>);
    expect(screen.getByText('手机号注册')).toBeDefined();
    expect(screen.getByPlaceholderText('请输入手机号')).toBeDefined();
    expect(screen.getByRole('button', { name: '发送验证码' })).toBeDefined();
    expect(screen.getByPlaceholderText('请输入6位验证码')).toBeDefined();
    expect(screen.getByPlaceholderText('至少8位，含字母和数字')).toBeDefined();
    expect(screen.getByRole('button', { name: '注 册' })).toBeDefined();
  });

  it('shows error for invalid phone format', async () => {
    render(<MemoryRouter><RegisterPhonePage /></MemoryRouter>);
    await userEvent.type(screen.getByPlaceholderText('请输入手机号'), '12345');
    await userEvent.click(screen.getByRole('button', { name: '发送验证码' }));
    await waitFor(() => {
      expect(screen.getByText('手机号格式不正确')).toBeDefined();
    });
  });

  it('has link to login page', () => {
    render(<MemoryRouter><RegisterPhonePage /></MemoryRouter>);
    const link = screen.getByText('去登录');
    expect(link.getAttribute('href')).toBe('/login/credential');
  });
});
