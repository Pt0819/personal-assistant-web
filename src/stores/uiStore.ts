import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';
import { DEFAULT_SPLIT_RATIO } from '@/config/constants';

interface UIState {
  splitRatio: number;
  theme: Theme;
  calendarCollapsed: boolean;
  setSplitRatio: (ratio: number) => void;
  setTheme: (theme: Theme) => void;
  toggleCalendar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      splitRatio: DEFAULT_SPLIT_RATIO,
      theme: typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
      calendarCollapsed: false,

      setSplitRatio: (ratio: number) => set({ splitRatio: ratio }),
      setTheme: (theme: Theme) => set({ theme }),
      toggleCalendar: () =>
        set((state) => ({ calendarCollapsed: !state.calendarCollapsed })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        splitRatio: state.splitRatio,
        theme: state.theme,
        calendarCollapsed: state.calendarCollapsed,
      }),
    },
  ),
);
