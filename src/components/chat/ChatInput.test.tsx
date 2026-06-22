import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  it('renders input and send button', () => {
    render(<ChatInput onSend={vi.fn()} disabled={false} />);
    expect(screen.getByPlaceholderText('输入你的日程安排...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '发送消息' })).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<ChatInput onSend={vi.fn()} disabled={false} />);
    expect(screen.getByRole('button', { name: '发送消息' })).toBeDisabled();
  });

  it('send button is disabled when disabled prop is true', () => {
    render(<ChatInput onSend={vi.fn()} disabled />);
    const input = screen.getByPlaceholderText('输入你的日程安排...');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(screen.getByRole('button', { name: '发送消息' })).toBeDisabled();
  });

  it('calls onSend with input value on Enter', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<ChatInput onSend={onSend} disabled={false} />);
    const input = screen.getByPlaceholderText('输入你的日程安排...');
    await user.type(input, '明天开会');
    await user.keyboard('{Enter}');
    expect(onSend).toHaveBeenCalledWith('明天开会');
  });

  it('clears input after send', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<ChatInput onSend={onSend} disabled={false} />);
    const input = screen.getByPlaceholderText<HTMLTextAreaElement>('输入你的日程安排...');
    await user.type(input, 'test');
    await user.keyboard('{Enter}');
    expect(input.value).toBe('');
  });
});
