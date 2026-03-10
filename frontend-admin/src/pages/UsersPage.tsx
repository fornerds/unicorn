import { useEffect, useState } from 'react';
import { adminApiFetch } from '@/lib/api';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface UserItem {
  id: number;
  email: string;
  name: string;
  status: string;
  createdAt: string;
}

interface UserDetail {
  id: number;
  email: string;
  name: string;
  phone?: string;
  status: string;
  memo?: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UsersPage() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<UserDetail | null>(null);
  const [detailForm, setDetailForm] = useState({ email: '', name: '', phone: '', status: '', memo: '' });
  const [detailLoading, setDetailLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);

  const fetchList = async () => {
    try {
      const q = new URLSearchParams({ page: String(page), limit: '20' });
      if (keyword.trim()) q.set('keyword', keyword.trim());
      const res = await adminApiFetch<{ data: { items: UserItem[]; pagination: Pagination } }>(
        `/admin/users?${q}`
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
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      await fetchList();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [page, keyword]);

  const openDetail = async (row: UserItem) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setError(null);
    try {
      const res = await adminApiFetch<{ data: UserDetail }>(`/admin/users/${row.id}`);
      const d = res?.data;
      if (d) {
        setDetailUser(d);
        setDetailForm({
          email: d.email ?? '',
          name: d.name ?? '',
          phone: d.phone ?? '',
          status: d.status ?? '',
          memo: d.memo ?? '',
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '상세 조회 실패');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailUser) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminApiFetch(`/admin/users/${detailUser.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          email: detailForm.email.trim() || undefined,
          name: detailForm.name.trim() || undefined,
          phone: detailForm.phone.trim() || undefined,
          status: detailForm.status || undefined,
          memo: detailForm.memo.trim() || undefined,
        }),
      });
      setDetailOpen(false);
      await fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : '수정 실패');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUserDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminApiFetch(`/admin/users/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : '삭제 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="search"
          placeholder="이메일·이름 검색"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">이메일</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">이름</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">가입일</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((row) => (
                  <tr key={row.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{row.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button type="button" onClick={() => openDetail(row)} className="text-gray-600 hover:text-gray-900">상세</button>
                      <span className="mx-2 text-gray-300">|</span>
                      <button type="button" onClick={() => setDeleteTarget(row)} className="text-red-600 hover:text-red-700">삭제</button>
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
                  <span className="px-3 py-1 text-sm">
                    {page} / {pagination.totalPages}
                  </span>
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

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="회원 상세">
        {detailLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          </div>
        ) : detailUser ? (
          <form onSubmit={handleUserUpdate} className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">ID: {detailUser.id}</p>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">이메일</label>
              <input
                type="email"
                value={detailForm.email}
                onChange={(e) => setDetailForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">이름</label>
              <input
                type="text"
                value={detailForm.name}
                onChange={(e) => setDetailForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">전화번호</label>
              <input
                type="text"
                value={detailForm.phone}
                onChange={(e) => setDetailForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">상태</label>
              <select
                value={detailForm.status}
                onChange={(e) => setDetailForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="active">active (활성)</option>
                <option value="inactive">inactive (비활성)</option>
                <option value="suspended">suspended (정지)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">메모</label>
              <textarea
                value={detailForm.memo}
                onChange={(e) => setDetailForm((f) => ({ ...f, memo: e.target.value }))}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setDetailOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">닫기</button>
              <button type="submit" disabled={submitting} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">{submitting ? '저장 중...' : '저장'}</button>
            </div>
          </form>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="회원 삭제"
        message={`회원 "${deleteTarget?.name}"을(를) 삭제하시겠습니까?`}
        confirmLabel="삭제"
        danger
        onConfirm={handleUserDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
