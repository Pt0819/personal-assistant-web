import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TopBar } from '@/components/layout/TopBar';
import { SplitPane } from '@/components/layout/SplitPane';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { CalendarPanel } from '@/components/calendar/CalendarPanel';

export function HomePage() {
  const [highlightDate, setHighlightDate] = useState<string | null>(null);

  const handleHighlightSchedule = (startTime: string) => {
    const dateKey = startTime.split('T')[0];
    setHighlightDate(dateKey || null);
    setTimeout(() => setHighlightDate(null), 3000);
  };

  return (
    <AppLayout>
      <TopBar />
      <SplitPane
        left={<ChatPanel onHighlightSchedule={handleHighlightSchedule} />}
        right={<CalendarPanel highlightDate={highlightDate} />}
      />
    </AppLayout>
  );
}
