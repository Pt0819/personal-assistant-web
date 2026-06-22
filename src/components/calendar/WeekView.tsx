import { getWeekDays, getWeekStart, isToday } from '@/utils/date';
import { TimeGrid } from './TimeGrid';
import { AllDayStrip } from './AllDayStrip';
import { EventCard } from './EventCard';
import { CALENDAR_START_HOUR, HOUR_ROW_HEIGHT } from '@/config/constants';
import type { Schedule } from '@/types';

interface WeekViewProps { currentDate: Date; schedulesByDate: Map<string, Schedule[]>; onEventClick: (schedule: Schedule) => void; }

export function WeekView({ currentDate, schedulesByDate, onEventClick }: WeekViewProps) {
  const weekStart = getWeekStart(currentDate);
  const dayColumns = getWeekDays(weekStart);
  const dayLabels = ['一', '二', '三', '四', '五', '六', '日'];

  const allDaySchedules: Schedule[] = [];
  for (const schedules of schedulesByDate.values()) {
    for (const s of schedules) { if (s.is_all_day) allDaySchedules.push(s); }
  }

  const positionedEvents: Array<{ schedule: Schedule; style: React.CSSProperties }> = [];
  for (const schedules of schedulesByDate.values()) {
    for (const s of schedules) {
      if (s.is_all_day) continue;
      const startDate = new Date(s.start_time);
      const dayOfWeek = startDate.getDay();
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const startHour = startDate.getHours() + startDate.getMinutes() / 60;
      const endDate = new Date(s.end_time);
      const endHour = endDate.getHours() + endDate.getMinutes() / 60;
      const top = (startHour - CALENDAR_START_HOUR) * HOUR_ROW_HEIGHT;
      const height = Math.max((endHour - startHour) * HOUR_ROW_HEIGHT, 24);
      positionedEvents.push({ schedule: s, style: { top: `${top}px`, height: `${height}px` } });
    }
  }

  return (
    <div className="flex flex-col flex-1" role="grid" aria-label="周视图">
      <div className="flex border-b border-border bg-card shrink-0">
        <div className="w-12 shrink-0" />
        {dayColumns.map((day, i) => {
          const today = isToday(day);
          return (
            <div key={i} className={`flex-1 text-center py-2 text-sm ${today ? 'bg-today-bg border-l-2 border-brand text-brand font-semibold' : 'text-text-secondary'}`}>
              <div>{dayLabels[i]}</div>
              <div className="text-xs">{day.getDate()}</div>
            </div>
          );
        })}
      </div>
      {allDaySchedules.length > 0 && <AllDayStrip schedules={allDaySchedules} onEventClick={onEventClick} />}
      <TimeGrid>
        {positionedEvents.map(({ schedule, style }) => (
          <EventCard key={schedule.id} schedule={schedule} onClick={onEventClick} style={style} />
        ))}
      </TimeGrid>
    </div>
  );
}
