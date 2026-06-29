import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterPage } from './RegisterPage';

describe('RegisterPage', () => {
  it('renders two registration options', () => {
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    expect(screen.getByText('创建账号')).toBeDefined();
    expect(screen.getByText('邮箱注册')).toBeDefined();
    expect(screen.getByText('手机号注册')).toBeDefined();
    expect(screen.getByText('已有账号?')).toBeDefined();
  });

  it('email card links to /register/email', () => {
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    const link = screen.getByText('邮箱注册').closest('a');
    expect(link?.getAttribute('href')).toBe('/register/email');
  });

  it('phone card links to /register/phone', () => {
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    const link = screen.getByText('手机号注册').closest('a');
    expect(link?.getAttribute('href')).toBe('/register/phone');
  });

  it('has login link', () => {
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    const link = screen.getByText('去登录');
    expect(link.getAttribute('href')).toBe('/login/credential');
  });
});
