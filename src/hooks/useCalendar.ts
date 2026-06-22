import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSchedules } from '@/services/schedule';
import { getWeekStart, getWeekEnd, toISODateString } from '@/utils/date';
import type { Schedule } from '@/types';

export function useCalendar(currentDate: Date) {
  const queryClient = useQueryClient();

  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate]);
  const weekEnd = useMemo(() => getWeekEnd(currentDate), [currentDate]);
  const startDate = toISODateString(weekStart);
  const endDate = toISODateString(weekEnd);

  const { data: schedules = [], isLoading, error } = useQuery({
    queryKey: ['schedules', 'week', startDate],
    queryFn: () => fetchSchedules(startDate, endDate),
    staleTime: 30_000,
  });

  const schedulesByDate = useMemo(() => {
    const map = new Map<string, Schedule[]>();
    for (const s of schedules) {
      const dateKey = s.start_time.split('T')[0]!;
      const existing = map.get(dateKey) || [];
      existing.push(s);
      map.set(dateKey, existing);
    }
    return map;
  }, [schedules]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['schedules'] });
  };

  return { weekStart, weekEnd, schedules, schedulesByDate, isLoading, error, refresh };
}
