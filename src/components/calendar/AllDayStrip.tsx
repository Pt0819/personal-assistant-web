import type { Schedule } from '@/types';

interface AllDayStripProps { schedules: Schedule[]; onEventClick: (schedule: Schedule) => void; }

export function AllDayStrip({ schedules, onEventClick }: AllDayStripProps) {
  if (schedules.length === 0) return null;
  return (
    <div className="border-b border-border px-2 py-1 bg-card">
      <div className="flex flex-wrap gap-1">
        {schedules.map((s) => (
          <button key={s.id} onClick={() => onEventClick(s)} className="px-2 py-0.5 rounded text-xs bg-brand/10 text-brand hover:bg-brand/20 transition-colors" type="button">{s.title}</button>
        ))}
      </div>
    </div>
  );
}
