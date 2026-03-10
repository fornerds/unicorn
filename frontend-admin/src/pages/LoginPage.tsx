import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/authStore';
import { paths } from '@/routes/paths';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

interface AdminLoginResponse {
  data: {
    accessToken: string;
    admin: { id: number; email: string; name: string; role: string };
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAdminAuth = useAdminAuthStore((s) => s.setAdminAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? paths.dashboard;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('이메일을 입력해 주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해 주세요.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const body = (await res.json()) as AdminLoginResponse & { message?: string };
      if (!res.ok) {
        setError(body?.message ?? `로그인 실패 (${res.status})`);
        return;
      }
      const data = body.data;
      if (!data?.accessToken || !data?.admin) {
        setError('응답 형식이 올바르지 않습니다.');
        return;
      }
      setAdminAuth(data.accessToken, {
        id: data.admin.id,
        email: data.admin.email,
        name: data.admin.name,
        role: data.admin.role,
      });
      navigate(from, { replace: true });
    } catch {
      setError('로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-[400px] rounded-lg bg-white p-8 shadow">
        <h1 className="text-center text-2xl font-bold text-gray-900">Unicorn Admin</h1>
        <p className="mt-1 text-center text-sm text-gray-500">관리자 로그인</p>
        {error && (
          <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="비밀번호"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
