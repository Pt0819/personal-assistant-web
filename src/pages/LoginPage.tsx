import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { postDevLogin } from '@/services/auth';
import type { StatusResponse } from '@/types';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, pollStatus } = useAuth();
  const [qrcodeUrl, setQrcodeUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'pending' | 'scanned' | 'confirmed' | 'expired' | 'error'>('loading');
  const [scannedUser, setScannedUser] = useState<{ nickname?: string; avatar_url?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef(false);
  const attemptedRef = useRef(false);

  // Dev mode: try auto-login first
  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    postDevLogin()
      .then((result) => {
        useAuthStore.getState().login(result.access_token, result.refresh_token, result.user);
        const preLoginPath = sessionStorage.getItem('preLoginPath');
        sessionStorage.removeItem('preLoginPath');
        navigate(preLoginPath || '/', { replace: true });
      })
      .catch(() => {
        // Dev login failed — proceed with normal QR flow below
      });
  }, [navigate]);

  // Handle WeChat callback redirect (temp_token in URL)
  useEffect(() => {
    const tempToken = searchParams.get('temp_token');
    if (tempToken && !pollRef.current) {
      pollRef.current = true;
      pollStatus(tempToken, (result: StatusResponse) => {
        setStatus(result.status);
        if (result.status === 'scanned') {
          setScannedUser({ nickname: result.nickname, avatar_url: result.avatar_url });
        }
      }).catch((err: Error) => {
        setError(err.message);
        setStatus('error');
      });
    }
  }, [searchParams, pollStatus]);

  // Fetch QR code on mount (only if dev login didn't redirect us)
  useEffect(() => {
    if (searchParams.get('temp_token')) return;
    let cancelled = false;
    // Small delay to let dev login attempt complete first
    const timer = setTimeout(() => {
      if (cancelled) return;
      login()
        .then((result) => {
          if (!cancelled) {
            setQrcodeUrl(result.qrcode_url);
            setStatus('pending');
            pollStatus(result.temp_token, (s: StatusResponse) => {
              if (!cancelled) {
                setStatus(s.status);
                if (s.status === 'scanned') {
                  setScannedUser({ nickname: s.nickname, avatar_url: s.avatar_url });
                }
              }
            }).catch((err: Error) => {
              if (!cancelled) { setError(err.message); setStatus('error'); }
            });
          }
        })
        .catch((err: Error) => {
          if (!cancelled) { setError(err.message); setStatus('error'); }
        });
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [login, pollStatus, searchParams]);

  const handleRefresh = () => window.location.reload();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg">
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-sm w-full mx-4 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">个人AI小助手</h1>
        <p className="text-text-secondary text-sm mb-6">微信扫码登录，让AI帮你管理日程</p>

        {status === 'loading' && (
          <div className="w-48 h-48 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
            <span className="text-text-tertiary">加载中...</span>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <p className="text-danger mb-4">{error || '加载失败'}</p>
            <button onClick={handleRefresh} className="text-brand hover:underline font-medium">点击重试</button>
          </div>
        )}

        {status === 'expired' && (
          <div className="text-center py-8">
            <p className="text-warning mb-4">二维码已过期</p>
            <button onClick={handleRefresh} className="text-brand hover:underline font-medium">刷新重试</button>
          </div>
        )}

        {qrcodeUrl && (status === 'pending' || status === 'scanned') && (
          <div className="relative">
            <img src={qrcodeUrl} alt="微信扫码登录" className="w-48 h-48 mx-auto rounded-lg" width={192} height={192} />
            {status === 'scanned' && (
              <div className="absolute inset-0 bg-black/60 rounded-lg flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-white mb-2 text-xl">✓</div>
                <p className="text-white text-sm">{scannedUser.nickname || '已扫码'}</p>
                <p className="text-white/70 text-xs mt-1">请在手机上确认登录</p>
              </div>
            )}
          </div>
        )}

        <p className="text-text-tertiary text-xs mt-6">使用微信扫描二维码登录</p>

        <div className="mt-4 pt-4 border-t border-border text-center">
          <Link to="/login/credential" className="text-brand hover:underline text-sm">账号登录</Link>
        </div>
      </div>
    </div>
  );
}
