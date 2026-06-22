import { describe, it, expect } from 'vitest';
import { getWeekStart, getWeekEnd, formatTime, formatScheduleTime, isToday, getWeekDays, formatDate, toISODateString } from './date';

describe('date utils', () => {
  it('getWeekStart returns Monday', () => {
    const wednesday = new Date('2026-06-24T12:00:00'); // Wednesday
    const monday = getWeekStart(wednesday);
    expect(monday.getDay()).toBe(1); // Monday
    expect(monday.getDate()).toBe(22);
  });

  it('getWeekEnd returns Sunday', () => {
    const wednesday = new Date('2026-06-24T12:00:00');
    const sunday = getWeekEnd(wednesday);
    expect(sunday.getDay()).toBe(0);
    expect(sunday.getDate()).toBe(28);
  });

  it('formatTime formats correctly', () => {
    const date = new Date('2026-06-24T09:05:00');
    expect(formatTime(date)).toBe('09:05');
  });

  it('formatScheduleTime returns time range', () => {
    const result = formatScheduleTime('2026-06-24T09:00:00', '2026-06-24T10:30:00');
    expect(result).toBe('09:00 - 10:30');
  });

  it('isToday returns true for today', () => {
    expect(isToday(new Date())).toBe(true);
  });

  it('getWeekDays returns 7 days', () => {
    const monday = new Date('2026-06-22T00:00:00');
    const days = getWeekDays(monday);
    expect(days).toHaveLength(7);
    expect(days[0]?.getDate()).toBe(22);
    expect(days[6]?.getDate()).toBe(28);
  });

  it('formatDate returns ISO date string', () => {
    const date = new Date('2026-06-24T12:00:00');
    expect(formatDate(date)).toBe('2026-06-24');
  });

  it('toISODateString is alias for formatDate', () => {
    const date = new Date('2026-06-24T12:00:00');
    expect(toISODateString(date)).toBe('2026-06-24');
  });
});
