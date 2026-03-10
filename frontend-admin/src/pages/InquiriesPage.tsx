import { useCallback, useEffect, useState } from 'react';
import { adminApiFetch } from '@/lib/api';
import { Modal } from '@/components/Modal';

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  general: '일반 문의',
  product: '제품 문의',
  technical: '기술 문의',
  partnership: '파트너십 문의',
  cancel: '취소/환불',
};

const INQUIRY_STATUS_LABELS: Record<string, string> = {
  pending: '미답변',
  answered: '답변 완료',
};

const getInquiryTypeLabel = (type: string | undefined): string => {
  if (!type) return '-';
  return INQUIRY_TYPE_LABELS[type] ?? type;
};

const getInquiryStatusLabel = (status: string | undefined): string => {
  if (!status) return '-';
  return INQUIRY_STATUS_LABELS[status] ?? status;
};

interface InquiryItem {
  id: number;
  name?: string;
  email?: string;
  inquiryType?: string;
  status?: string;
  createdAt?: string;
}

interface InquiryDetail {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  productId?: number;
  productName?: string;
  inquiryType?: string;
  content?: string;
  status?: string;
  repliedAt?: string;
  createdAt?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function InquiriesPage() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailInquiry, setDetailInquiry] = useState<InquiryDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusValue, setStatusValue] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchList = useCallback(async () => {
    try {
      const q = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await adminApiFetch<{ data: { items: InquiryItem[]; pagination: Pagination } }>(
        `/admin/inquiries?${q}`
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

  const openDetail = async (row: InquiryItem) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setError(null);
    setReplyMessage('');
    try {
      const res = await adminApiFetch<{ data: InquiryDetail }>(`/admin/inquiries/${row.id}`);
      const d = res?.data;
      if (d) {
        setDetailInquiry(d);
        setStatusValue(d.status ?? 'pending');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '상세 조회 실패');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailInquiry) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminApiFetch(`/admin/inquiries/${detailInquiry.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: statusValue }),
      });
      const res = await adminApiFetch<{ data: InquiryDetail }>(`/admin/inquiries/${detailInquiry.id}`);
      if (res?.data) setDetailInquiry(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '상태 변경 실패');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailInquiry || !replyMessage.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminApiFetch(`/admin/inquiries/${detailInquiry.id}/send-reply`, {
        method: 'POST',
        body: JSON.stringify({ message: replyMessage.trim() }),
      });
      setReplyMessage('');
      const res = await adminApiFetch<{ data: InquiryDetail }>(`/admin/inquiries/${detailInquiry.id}`);
      if (res?.data) setDetailInquiry(res.data);
      await fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : '답변 발송 실패');
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">이름</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">이메일</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">유형</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">등록일</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((row) => (
                  <tr key={row.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{row.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.name ?? '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.email ?? '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{getInquiryTypeLabel(row.inquiryType)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{getInquiryStatusLabel(row.status)}</td>
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

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="문의 상세">
        {detailLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          </div>
        ) : detailInquiry ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">ID: {detailInquiry.id}</p>
            <p className="text-sm">이름: {detailInquiry.name ?? '-'}</p>
            <p className="text-sm">이메일: {detailInquiry.email ?? '-'}</p>
            <p className="text-sm">문의 유형: {getInquiryTypeLabel(detailInquiry.inquiryType)}</p>
            <p className="text-sm">내용: {detailInquiry.content ?? '-'}</p>
            <form onSubmit={handleStatusUpdate} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">상태</label>
              <select
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="pending">{getInquiryStatusLabel('pending')}</option>
                <option value="answered">{getInquiryStatusLabel('answered')}</option>
              </select>
              <button type="submit" disabled={submitting} className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600 disabled:opacity-50">상태 저장</button>
            </form>
            {detailInquiry.status !== 'answered' && (
              <>
                <hr className="border-gray-200" />
                <form onSubmit={handleSendReply} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">답변 메일 발송</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="답변 내용을 입력하세요. 문의자 이메일로 발송됩니다."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    rows={4}
                  />
                  <button type="submit" disabled={submitting || !replyMessage.trim()} className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50">답변 발송</button>
                </form>
              </>
            )}
            <button type="button" onClick={() => setDetailOpen(false)} className="mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">닫기</button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
