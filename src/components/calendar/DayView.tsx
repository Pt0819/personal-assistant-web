import type { Schedule } from '@/types';

interface DayViewProps { currentDate: Date; schedulesByDate: Map<string, Schedule[]>; onEventClick: (schedule: Schedule) => void; }

export function DayView({ currentDate, schedulesByDate, onEventClick }: DayViewProps) {
  return <div className="flex-1 flex items-center justify-center text-text-tertiary text-sm">日视图即将上线（V1.5）</div>;
}
