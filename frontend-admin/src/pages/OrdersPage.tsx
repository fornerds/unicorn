import { useCallback, useEffect, useState } from 'react';
import { adminApiFetch } from '@/lib/api';
import { Modal } from '@/components/Modal';

type OrderStatus = 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled' | string;

interface OrderRow {
  id: number;
  totalAmount?: number;
  status: OrderStatus;
  recipient?: string;
  createdAt: string;
}

interface OrderItemDto {
  productId: number;
  quantity: number;
  price: number;
}

interface ShippingDto {
  recipient: string;
  phone: string;
  address: string;
  zipCode?: string;
}

interface OrderDetail {
  id: number;
  userId?: number;
  items?: OrderItemDto[];
  totalAmount?: number;
  status: OrderStatus;
  shipping?: ShippingDto;
  createdAt: string;
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  shipping: '배송 중',
  delivered: '배송 완료',
  cancelled: '취소됨',
};

const getOrderStatusLabel = (status: OrderStatus): string => {
  if (!status) return '-';
  return ORDER_STATUS_LABELS[status] ?? status;
};

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function OrdersPage() {
  const [items, setItems] = useState<OrderRow[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusValue, setStatusValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchList = useCallback(async () => {
    try {
      const q = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await adminApiFetch<{ data: { items: OrderRow[]; pagination: Pagination } }>(
        `/admin/orders?${q}`
      );
      if (res?.data) {
        setItems(res.data.items ?? []);
        setPagination(res.data.pagination ?? null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '목록 조회 실패');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    setLoading(true);
    fetchList();
  }, [fetchList]);

  const openDetail = async (row: OrderRow) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setError(null);
    try {
      const res = await adminApiFetch<{ data: OrderDetail }>(`/admin/orders/${row.id}`);
      const d = res?.data;
      if (d) {
        setDetailOrder(d);
        setStatusValue(d.status ?? '');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '상세 조회 실패');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailOrder) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminApiFetch(`/admin/orders/${detailOrder.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: statusValue }),
      });
      setDetailOpen(false);
      await fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : '상태 변경 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</div>
      )}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">수령인</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">금액</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">주문일</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((row) => (
                  <tr key={row.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{row.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.recipient ?? '-'}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      {row.totalAmount != null ? row.totalAmount.toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {getOrderStatusLabel(row.status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button type="button" onClick={() => openDetail(row)} className="text-gray-600 hover:text-gray-900">상세</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                <p className="text-sm text-gray-500">전체 {pagination.total}건</p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                  >
                    이전
                  </button>
                  <span className="px-3 py-1 text-sm">{page} / {pagination.totalPages}</span>
                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="주문 상세">
        {detailLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          </div>
        ) : detailOrder ? (
          <form onSubmit={handleStatusUpdate} className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">주문 ID: {detailOrder.id}</p>
            {detailOrder.shipping && (
              <>
                <p className="text-sm">수령인: {detailOrder.shipping.recipient}</p>
                <p className="text-sm">연락처: {detailOrder.shipping.phone}</p>
                <p className="text-sm">주소: {detailOrder.shipping.address}</p>
              </>
            )}
            <p className="text-sm font-medium">총 금액: {detailOrder.totalAmount != null ? detailOrder.totalAmount.toLocaleString() : '-'}원</p>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">상태</label>
              <select
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="pending">{getOrderStatusLabel('pending')}</option>
                <option value="paid">{getOrderStatusLabel('paid')}</option>
                <option value="shipping">{getOrderStatusLabel('shipping')}</option>
                <option value="delivered">{getOrderStatusLabel('delivered')}</option>
                <option value="cancelled">{getOrderStatusLabel('cancelled')}</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setDetailOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">닫기</button>
              <button type="submit" disabled={submitting} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">{submitting ? '저장 중...' : '상태 저장'}</button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
