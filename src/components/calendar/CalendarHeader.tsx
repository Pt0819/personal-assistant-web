import { Button } from '@/components/ui';

interface CalendarHeaderProps { label: string; onPrev: () => void; onNext: () => void; onToday: () => void; }

export function CalendarHeader({ label, onPrev, onNext, onToday }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border shrink-0">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onPrev} aria-label="上一周">←</Button>
        <Button variant="ghost" size="sm" onClick={onNext} aria-label="下一周">→</Button>
        <h2 className="text-sm font-semibold text-text-primary ml-2">{label}</h2>
      </div>
      <Button variant="ghost" size="sm" onClick={onToday}>今天</Button>
    </div>
  );
}
