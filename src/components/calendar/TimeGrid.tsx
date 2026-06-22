import { CALENDAR_START_HOUR, CALENDAR_END_HOUR, HOUR_ROW_HEIGHT } from '@/config/constants';

interface TimeGridProps { children?: React.ReactNode; }

export function TimeGrid({ children }: TimeGridProps) {
  const hours = Array.from({ length: CALENDAR_END_HOUR - CALENDAR_START_HOUR }, (_, i) => CALENDAR_START_HOUR + i);
  return (
    <div className="relative flex-1 overflow-y-auto">
      <div className="relative" style={{ minHeight: `${hours.length * HOUR_ROW_HEIGHT}px` }}>
        {hours.map((hour) => (
          <div key={hour} className="absolute left-0 right-0 flex" style={{ top: `${(hour - CALENDAR_START_HOUR) * HOUR_ROW_HEIGHT}px`, height: `${HOUR_ROW_HEIGHT}px` }}>
            <div className="w-12 text-right pr-2 pt-0 text-xs text-text-tertiary shrink-0">{`${String(hour).padStart(2, '0')}:00`}</div>
            <div className="flex-1 border-t border-border" />
          </div>
        ))}
        {children}
      </div>
    </div>
  );
}
