import { useEffect, useState } from 'react';
import { adminApiFetch } from '@/lib/api';

interface AdminSettings {
  siteName?: string;
  paymentProvider?: string;
  domesticPgEnabled?: boolean;
}

export default function SettingsPage() {
  const [siteName, setSiteName] = useState('');
  const [paymentProvider, setPaymentProvider] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminApiFetch<{ data: AdminSettings }>('/admin/settings');
        if (!cancelled && res?.data) {
          setSiteName(res.data.siteName ?? '');
          setPaymentProvider(res.data.paymentProvider ?? '');
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '설정 조회 실패');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adminApiFetch('/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify({ siteName, paymentProvider }),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : '설정 저장 실패');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-medium text-gray-900">앱 설정</h2>
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="mt-4 flex max-w-md flex-col gap-4">
        <div>
          <label htmlFor="siteName" className="mb-1 block text-sm font-medium text-gray-700">사이트명</label>
          <input
            id="siteName"
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="paymentProvider" className="mb-1 block text-sm font-medium text-gray-700">결제 제공자</label>
          <input
            id="paymentProvider"
            type="text"
            value={paymentProvider}
            onChange={(e) => setPaymentProvider(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? '저장 중...' : '설정 저장'}
        </button>
      </form>
    </div>
  );
}
