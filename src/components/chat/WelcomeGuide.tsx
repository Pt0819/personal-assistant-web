interface WelcomeGuideProps { onSuggestionClick: (text: string) => void; }

const SUGGESTIONS = ['帮我安排明天的会议', '查看本周日程', '提醒我下午2点喝水'];

export function WelcomeGuide({ onSuggestionClick }: WelcomeGuideProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mb-4"><span className="text-3xl">🤖</span></div>
      <h2 className="text-lg font-semibold text-text-primary mb-1">你好！我是你的AI小助手</h2>
      <p className="text-text-secondary text-sm mb-6 text-center">你可以像跟助理说话一样告诉我日程安排</p>
      <div className="flex flex-wrap gap-2 justify-center max-w-xs">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => onSuggestionClick(s)} className="px-4 py-2 rounded-full bg-card border border-border text-sm text-text-secondary hover:text-text-primary hover:border-brand transition-colors" type="button">{s}</button>
        ))}
      </div>
    </div>
  );
}
