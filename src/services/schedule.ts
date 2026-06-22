import { api } from './client';
import type { Schedule, ScheduleInput } from '@/types';

export async function fetchSchedules(startDate: string, endDate: string): Promise<Schedule[]> {
  const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
  return api.get<Schedule[]>(`/schedules?${params}`);
}

export async function fetchSchedule(id: number): Promise<Schedule> {
  return api.get<Schedule>(`/schedules/${id}`);
}

export async function createSchedule(input: ScheduleInput): Promise<Schedule> {
  return api.post<Schedule>('/schedules', input);
}

export async function updateSchedule(id: number, input: Partial<ScheduleInput>): Promise<Schedule> {
  return api.put<Schedule>(`/schedules/${id}`, input);
}

export async function deleteSchedule(id: number): Promise<void> {
  await api.delete(`/schedules/${id}`);
}

export async function checkConflict(
  startTime: string,
  endTime: string,
  excludeId?: number,
): Promise<Schedule[]> {
  const params = new URLSearchParams({ start_time: startTime, end_time: endTime });
  if (excludeId) params.set('exclude_id', String(excludeId));
  return api.get<Schedule[]>(`/schedules/check-conflict?${params}`);
}
