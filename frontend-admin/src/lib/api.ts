const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class AdminApiError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = 'AdminApiError';
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAdminToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) return false;
    const body = await res.json();
    if (body?.data?.accessToken) {
      useAdminAuthStore.getState().setAccessToken(body.data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

import { useAdminAuthStore } from '@/stores/authStore';

export async function adminApiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  _isRetry = false
): Promise<T> {
  const accessToken = useAdminAuthStore.getState().accessToken;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (res.status === 401 && !_isRetry) {
    if (!refreshPromise) {
      refreshPromise = refreshAdminToken().finally(() => {
        refreshPromise = null;
      });
    }
    const refreshed = await refreshPromise;
    if (refreshed) {
      return adminApiFetch<T>(endpoint, options, true);
    }
    useAdminAuthStore.getState().logout();
    window.location.href = '/login';
    throw new AdminApiError(401, '인증이 만료되었습니다.');
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = body?.message ?? `요청 실패 (${res.status})`;
    const code = body?.code ?? res.status;
    throw new AdminApiError(code, msg);
  }

  return body as T;
}

/** multipart/form-data 파일 업로드 (이미지). 응답 data.url 사용 */
export async function adminApiUpload(file: File): Promise<{ data: { url: string } }> {
  const accessToken = useAdminAuthStore.getState().accessToken;
  const formData = new FormData();
  formData.append('file', file);

  const headers: HeadersInit = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: formData,
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = body?.message ?? `업로드 실패 (${res.status})`;
    throw new AdminApiError(body?.code ?? res.status, msg);
  }
  return body as { data: { url: string } };
}
