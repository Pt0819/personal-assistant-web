import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg">
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-sm w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2">创建账号</h1>
          <p className="text-text-secondary text-sm">选择注册方式</p>
        </div>

        <div className="space-y-3 mb-6">
          <Link
            to="/register/email"
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-brand transition-colors"
          >
            <span className="text-2xl">📧</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-text-primary">邮箱注册</div>
              <div className="text-xs text-text-tertiary">使用邮箱验证码注册</div>
            </div>
            <span className="text-text-tertiary text-lg">→</span>
          </Link>

          <Link
            to="/register/phone"
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-brand transition-colors"
          >
            <span className="text-2xl">📱</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-text-primary">手机号注册</div>
              <div className="text-xs text-text-tertiary">使用短信验证码注册</div>
            </div>
            <span className="text-text-tertiary text-lg">→</span>
          </Link>
        </div>

        <div className="text-center text-sm text-text-tertiary">
          <span>已有账号?</span>{' '}
          <Link to="/login/credential" className="text-brand hover:underline">去登录</Link>
        </div>
      </div>
    </div>
  );
}
