import type { CalendarView } from '@/types';

interface ViewToggleProps { view: CalendarView; onChange: (view: CalendarView) => void; }

const VIEW_OPTIONS: Array<{ key: CalendarView; label: string }> = [
  { key: 'day', label: '日' },
  { key: 'week', label: '周' },
];

export function ViewToggle({ view }: ViewToggleProps) {
  return (
    <div className="flex rounded-lg border border-border overflow-hidden">
      {VIEW_OPTIONS.map(({ key, label }) => (
        <button key={key} disabled={key === 'day'} className={`px-3 py-1 text-xs ${view === key ? 'bg-brand text-white' : key === 'day' ? 'text-text-tertiary cursor-not-allowed' : 'text-text-secondary hover:text-text-primary'}`} type="button">{label}</button>
      ))}
    </div>
  );
}
