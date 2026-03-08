import { useEffect, useState } from 'react';
import { adminApiFetch } from '@/lib/api';

interface DashboardStats {
  orderCount?: number;
  userCount?: number;
  revenue?: number;
  recentOrders?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminApiFetch<{ data: DashboardStats }>('/admin/dashboard');
        if (!cancelled && res?.data) setStats(res.data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '조회 실패');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }
  if (error) {
    return <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>;
  }

  const cards = [
    { label: '회원 수', value: stats?.userCount ?? '-' },
    { label: '주문 수', value: stats?.orderCount ?? '-' },
    {
      label: '매출 (원)',
      value: stats?.revenue != null ? stats.revenue.toLocaleString() : '-',
    },
    { label: '최근 주문 (10건)', value: stats?.recentOrders ?? '-' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
