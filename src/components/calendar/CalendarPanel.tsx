import { useState } from 'react';
import type { Schedule, CalendarView } from '@/types';
import { useCalendar } from '@/hooks/useCalendar';
import { useUIStore } from '@/stores/uiStore';
import { getWeekLabel, getWeekStart } from '@/utils/date';
import { CalendarHeader } from './CalendarHeader';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { Modal } from '@/components/ui';

interface CalendarPanelProps { highlightDate: string | null; }

export function CalendarPanel({ highlightDate }: CalendarPanelProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view] = useState<'week' | 'day'>('week');
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
  const { schedulesByDate, isLoading, error } = useCalendar(currentDate);
  const toggleCalendar = useUIStore((s) => s.toggleCalendar);

  const handlePrev = () => setCurrentDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; });
  const handleNext = () => setCurrentDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; });
  const handleToday = () => setCurrentDate(new Date());
  const weekStart = getWeekStart(currentDate);
  const weekLabel = getWeekLabel(weekStart);

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <CalendarHeader label={weekLabel} onPrev={handlePrev} onNext={handleNext} onToday={handleToday} onToggleCalendar={toggleCalendar} view={view} onViewChange={() => {}} />
        <div className="flex-1 flex items-center justify-center"><div className="text-center"><p className="text-text-secondary mb-2">加载失败</p><button onClick={() => window.location.reload()} className="text-brand hover:underline text-sm">点击重试</button></div></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <CalendarHeader label={weekLabel} onPrev={handlePrev} onNext={handleNext} onToday={handleToday} onToggleCalendar={toggleCalendar} view={view} onViewChange={() => {}} />
      {isLoading ? (
        <div className="flex-1 p-2"><div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" /></div>
      ) : (
        view === 'day' ? (
          <DayView currentDate={currentDate} schedulesByDate={schedulesByDate} onEventClick={setSelectedEvent} />
        ) : (
          <WeekView currentDate={currentDate} schedulesByDate={schedulesByDate} onEventClick={setSelectedEvent} />
        )
      )}
      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={selectedEvent?.title}>
        {selectedEvent && (
          <div>
            <p className="text-text-secondary text-sm mt-1">{new Date(selectedEvent.start_time).toLocaleString('zh-CN')} - {new Date(selectedEvent.end_time).toLocaleString('zh-CN')}</p>
            {selectedEvent.location && <p className="text-text-secondary text-sm">📍 {selectedEvent.location}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
