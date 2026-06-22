import type { ScheduleInput } from '@/types';
import { formatScheduleTime } from '@/utils/date';

interface ScheduleCardProps {
  schedule: ScheduleInput;
  confirmed?: boolean;
}

export function ScheduleCard({ schedule, confirmed }: ScheduleCardProps) {
  return (
    <div className="bg-bg rounded-lg p-3 border border-border text-sm" role="article" aria-label={`日程：${schedule.title}`}>
      <div className="flex items-start gap-2">
        <div className="w-1 self-stretch rounded-full shrink-0 bg-brand" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-primary truncate">{schedule.title}</p>
          <p className="text-text-secondary text-xs mt-1">🕐 {formatScheduleTime(schedule.start_time, schedule.end_time)}</p>
          {schedule.location && <p className="text-text-secondary text-xs mt-0.5">📍 {schedule.location}</p>}
        </div>
        {confirmed && <span className="text-success text-xs shrink-0">✓ 已创建</span>}
      </div>
    </div>
  );
}
