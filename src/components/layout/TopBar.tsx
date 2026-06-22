import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui';

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card shrink-0">
      <div className="flex items-center gap-3">
        {user?.avatar_url && <img src={user.avatar_url} alt={user.nickname} className="w-8 h-8 rounded-full object-cover" width={32} height={32} />}
        <span className="font-medium text-text-primary text-sm">{user?.nickname || '个人AI小助手'}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-text-secondary text-sm">{dateStr}</span>
        <Button variant="ghost" size="sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="切换主题">
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>
      </div>
    </header>
  );
}
