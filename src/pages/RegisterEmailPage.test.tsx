import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RegisterEmailPage } from './RegisterEmailPage';
import { useAuthStore } from '@/stores/authStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterEmailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, jwt: null, refreshToken: null, isAuthenticated: false });
  });

  it('renders email registration form', () => {
    render(<MemoryRouter><RegisterEmailPage /></MemoryRouter>);
    expect(screen.getByText('邮箱注册')).toBeDefined();
    expect(screen.getByPlaceholderText('请输入邮箱')).toBeDefined();
    expect(screen.getByRole('button', { name: '发送验证码' })).toBeDefined();
    expect(screen.getByPlaceholderText('请输入6位验证码')).toBeDefined();
    expect(screen.getByPlaceholderText('至少8位，含字母和数字')).toBeDefined();
    expect(screen.getByRole('button', { name: '注 册' })).toBeDefined();
  });

  it('shows error for invalid email format', async () => {
    render(<MemoryRouter><RegisterEmailPage /></MemoryRouter>);
    await userEvent.type(screen.getByPlaceholderText('请输入邮箱'), 'notanemail');
    await userEvent.click(screen.getByRole('button', { name: '发送验证码' }));
    await waitFor(() => {
      expect(screen.getByText('邮箱格式不正确')).toBeDefined();
    });
  });

  it('shows password hints', () => {
    render(<MemoryRouter><RegisterEmailPage /></MemoryRouter>);
    expect(screen.getByText('至少8位字符，需同时包含字母和数字')).toBeDefined();
  });

  it('has link to login page', () => {
    render(<MemoryRouter><RegisterEmailPage /></MemoryRouter>);
    const link = screen.getByText('去登录');
    expect(link.getAttribute('href')).toBe('/login/credential');
  });
});
