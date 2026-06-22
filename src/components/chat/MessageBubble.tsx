import type { Message } from '@/types';
import type { ScheduleInput } from '@/types';
import { ScheduleCard } from './ScheduleCard';

interface MessageBubbleProps { message: Message; }

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const scheduleData = message.parsed_json as ScheduleInput | null;

  return (
    <div className={`flex px-4 py-1.5 ${isUser ? 'justify-end' : 'justify-start'}`} role="listitem">
      {!isUser && <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs shrink-0 mr-3 mt-2">AI</div>}
      <div className={`max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? 'bg-user-bubble text-white rounded-br-md' : 'bg-ai-bubble text-text-primary border border-ai-border rounded-bl-md'}`}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {scheduleData && <div className="mt-3"><ScheduleCard schedule={scheduleData} confirmed /></div>}
      </div>
      {isUser && <div className="w-8 h-8 rounded-full bg-text-tertiary text-white flex items-center justify-center text-xs shrink-0 ml-3 mt-2">我</div>}
    </div>
  );
}
