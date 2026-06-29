import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';
import { sendSMSCode, registerByPhone } from '@/services/auth';
import { ApiError } from '@/services/client';

function isValidPhone(phone: string): boolean {
  return /^\+?[1-9]\d{6,14}$/.test(phone);
}

export function RegisterPhonePage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    setError(null);
    if (!isValidPhone(phone.trim())) {
      setError('手机号格式不正确');
      return;
    }
    setSendingCode(true);
    try {
      await sendSMSCode(phone.trim());
      setSuccess('验证码已发送');
      setCountdown(60);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('发送失败，请稍后重试');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!phone.trim() || !code.trim() || !password.trim()) {
      setError('请填写所有字段');
      return;
    }
    if (!isValidPhone(phone.trim())) {
      setError('手机号格式不正确');
      return;
    }
    if (!/^\d{6}$/.test(code.trim())) {
      setError('验证码为6位数字');
      return;
    }
    if (password.length < 8) {
      setError('密码至少需要8个字符');
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError('密码需同时包含字母和数字');
      return;
    }

    setLoading(true);
    try {
      const result = await registerByPhone({ phone: phone.trim(), code: code.trim(), password });
      login(result.access_token, result.refresh_token, result.user);
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg">
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-sm w-full mx-4">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/register" className="text-brand text-lg">←</Link>
          <h1 className="text-lg font-semibold text-text-primary">手机号注册</h1>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-2.5 mb-4">
            <p className="text-danger text-sm" role="alert">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-success/10 border border-success/30 rounded-lg px-4 py-2.5 mb-4">
            <p className="text-success text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">手机号</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                disabled={loading}
                className="flex-1"
                autoComplete="tel"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleSendCode}
                disabled={sendingCode || countdown > 0 || loading}
                className="whitespace-nowrap"
              >
                {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}s 后重发` : '发送验证码'}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">验证码</label>
            <Input
              type="text"
              placeholder="请输入6位验证码"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={loading}
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">密码</label>
            <Input
              type="password"
              placeholder="至少8位，含字母和数字"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-text-tertiary">至少8位字符，需同时包含字母和数字</p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading || !phone || !code || !password}>
            {loading ? '注册中...' : '注 册'}
          </Button>
        </form>

        <div className="text-center text-sm text-text-tertiary mt-4">
          <span>已有账号?</span>{' '}
          <Link to="/login/credential" className="text-brand hover:underline">去登录</Link>
        </div>
      </div>
    </div>
  );
}
