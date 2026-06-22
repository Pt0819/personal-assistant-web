import { useState, useRef, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui';
import { MAX_MESSAGE_LENGTH } from '@/config/constants';

interface ChatInputProps { onSend: (content: string) => void; disabled: boolean; }

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = '48px';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = '48px';
    ta.style.height = `${Math.min(ta.scrollHeight, 240)}px`;
  };

  return (
    <div className="border-t border-border bg-card px-4 py-3">
      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        <textarea ref={textareaRef} value={value} onChange={(e) => { if (e.target.value.length <= MAX_MESSAGE_LENGTH) setValue(e.target.value); }} onInput={handleInput} onKeyDown={handleKeyDown} placeholder="输入你的日程安排..." className="flex-1 resize-none rounded-xl bg-input-bg text-text-primary placeholder:text-text-tertiary px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand min-h-[48px] max-h-[240px]" rows={2} disabled={disabled} aria-label="输入消息" />
        <Button onClick={handleSend} disabled={disabled || value.trim().length === 0} size="md" aria-label="发送消息">发送</Button>
      </div>
    </div>
  );
}
