import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';
import { loginByCredential } from '@/services/auth';
import { ApiError } from '@/services/client';

export function CredentialLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!account.trim() || !password.trim()) {
      setError('请填写账号和密码');
      return;
    }

    setLoading(true);
    try {
      const result = await loginByCredential({ account: account.trim(), password });
      login(result.access_token, result.refresh_token, result.user);
      const preLoginPath = sessionStorage.getItem('preLoginPath');
      sessionStorage.removeItem('preLoginPath');
      navigate(preLoginPath || '/', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('登录失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg">
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-sm w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2">个人AI小助手</h1>
          <p className="text-text-secondary text-sm">使用账号密码登录</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-2.5 mb-4">
            <p className="text-danger text-sm" role="alert">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">账号</label>
            <Input
              type="text"
              placeholder="邮箱或手机号"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">密码</label>
            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? '登录中...' : '登 录'}
          </Button>
        </form>

        <div className="text-center text-sm text-text-tertiary mt-4">
          <span>还没有账号?</span>{' '}
          <Link to="/register" className="text-brand hover:underline">去注册</Link>
        </div>

        <div className="text-center text-sm text-text-tertiary mt-4 pt-4 border-t border-border">
          <Link to="/login" className="text-brand hover:underline">&larr; 微信扫码登录</Link>
        </div>
      </div>
    </div>
  );
}
