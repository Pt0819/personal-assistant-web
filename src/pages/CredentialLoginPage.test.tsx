import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CredentialLoginPage } from './CredentialLoginPage';
import { useAuthStore } from '@/stores/authStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('CredentialLoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, jwt: null, refreshToken: null, isAuthenticated: false });
  });

  it('renders login form', () => {
    render(<MemoryRouter><CredentialLoginPage /></MemoryRouter>);
    expect(screen.getByText('个人AI小助手')).toBeDefined();
    expect(screen.getByPlaceholderText('邮箱或手机号')).toBeDefined();
    expect(screen.getByPlaceholderText('密码')).toBeDefined();
    expect(screen.getByRole('button', { name: '登 录' })).toBeDefined();
    expect(screen.getByText('还没有账号?')).toBeDefined();
    expect(screen.getByText('← 微信扫码登录')).toBeDefined();
  });

  it('shows error when submitting empty form', async () => {
    render(<MemoryRouter><CredentialLoginPage /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button', { name: '登 录' }));
    await waitFor(() => {
      expect(screen.getByText(/请填写账号和密码/)).toBeDefined();
    });
  });

  it('navigates to register page', () => {
    render(<MemoryRouter><CredentialLoginPage /></MemoryRouter>);
    const link = screen.getByText('去注册');
    expect(link.getAttribute('href')).toBe('/register');
  });

  it('navigates to WeChat login page', () => {
    render(<MemoryRouter><CredentialLoginPage /></MemoryRouter>);
    const link = screen.getByText('← 微信扫码登录');
    expect(link.getAttribute('href')).toBe('/login');
  });
});
