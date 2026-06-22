import { formatTime } from '@/utils/date';
import type { Schedule } from '@/types';

interface EventCardProps { schedule: Schedule; onClick: (schedule: Schedule) => void; style: React.CSSProperties; }

export function EventCard({ schedule, onClick, style }: EventCardProps) {
  return (
    <div className="absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 text-xs cursor-pointer overflow-hidden hover:opacity-90 transition-opacity" style={{ ...style, backgroundColor: '#1677FF20', borderLeft: '3px solid #1677FF', minHeight: '24px' }} onClick={() => onClick(schedule)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(schedule); } }} role="button" tabIndex={0} aria-label={`${schedule.title}：${formatTime(new Date(schedule.start_time))}-${formatTime(new Date(schedule.end_time))}`}>
      <p className="font-medium truncate">{schedule.title}</p>
      <p className="text-text-tertiary truncate">{formatTime(new Date(schedule.start_time))}</p>
    </div>
  );
}
