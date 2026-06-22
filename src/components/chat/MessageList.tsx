import { useEffect, useRef } from 'react';
import type { Message } from '@/types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
  onScrollTop: () => void;
}

export function MessageList({ messages, isStreaming, onScrollTop }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) onScrollTop(); }, { threshold: 0.1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onScrollTop]);

  return (
    <div className="flex-1 overflow-y-auto py-4" role="log" aria-live="polite" aria-label="对话消息">
      <div ref={sentinelRef} className="h-1" />
      {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
      {isStreaming && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
