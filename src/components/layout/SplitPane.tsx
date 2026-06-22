import { type ReactNode, useCallback, useRef, useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/utils/cn';

interface SplitPaneProps { left: ReactNode; right: ReactNode; }

export function SplitPane({ left, right }: SplitPaneProps) {
  const splitRatio = useUIStore((s) => s.splitRatio);
  const calendarCollapsed = useUIStore((s) => s.calendarCollapsed);
  const setSplitRatio = useUIStore((s) => s.setSplitRatio);
  const toggleCalendar = useUIStore((s) => s.toggleCalendar);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    setDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = (x / rect.width) * 100;
    const minLeft = (480 / rect.width) * 100;
    const maxLeft = 100 - (420 / rect.width) * 100;
    setSplitRatio(Math.max(minLeft, Math.min(ratio, maxLeft)));
  }, [dragging, setSplitRatio]);

  if (dragging) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  if (calendarCollapsed) {
    return (
      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        <div className="flex-1 min-w-0">{left}</div>
        <button onClick={toggleCalendar} className="w-8 bg-card border-l border-border flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors shrink-0" aria-label="展开日历">◀</button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden">
      <div style={{ width: `${splitRatio}%` }} className="min-w-0">{left}</div>
      <div className={cn('w-1 bg-border hover:bg-brand cursor-col-resize shrink-0 transition-colors', dragging && 'bg-brand')} onMouseDown={handleMouseDown} role="separator" aria-orientation="vertical" aria-label="拖拽调节面板宽度" />
      <div style={{ width: `${100 - splitRatio}%` }} className="min-w-0">
        {right}
      </div>
    </div>
  );
}
