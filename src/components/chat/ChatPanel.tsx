import { useChat } from '@/hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { WelcomeGuide } from './WelcomeGuide';

interface ChatPanelProps { onHighlightSchedule: (startTime: string) => void; }

export function ChatPanel({ onHighlightSchedule }: ChatPanelProps) {
  const { messages, messagesLoading, isStreaming, isSending, sendMessage } = useChat();

  if (messagesLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
              <div className="flex-1 h-8 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            </div>
          ))}
        </div>
        <ChatInput onSend={sendMessage} disabled />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col"><div className="flex-1"><WelcomeGuide onSuggestionClick={sendMessage} /></div></div>
      ) : (
        <MessageList messages={messages} isStreaming={isStreaming} onScrollTop={() => {}} />
      )}
      <ChatInput onSend={sendMessage} disabled={isSending || isStreaming} />
    </div>
  );
}
