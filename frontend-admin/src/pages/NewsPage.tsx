import { useEffect, useState } from 'react';
import { adminApiFetch } from '@/lib/api';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface NewsItem {
  id: number;
  title?: string;
  publishedAt?: string;
  createdAt?: string;
}

interface TagItem {
  id: number;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    published: false,
    tagIds: [] as number[],
  });

  const fetchList = async () => {
    try {
      const q = new URLSearchParams({ page: String(page), limit: '20' });
      if (keyword.trim()) q.set('keyword', keyword.trim());
      const res = await adminApiFetch<{ data: { items: NewsItem[]; pagination: Pagination } }>(
        `/admin/news?${q}`
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
    (async () => {
      try {
        const r = await adminApiFetch<{ data: TagItem[] }>('/admin/tags');
        if (!cancelled) setTags(Array.isArray(r?.data) ? r.data : []);
      } catch {
        if (!cancelled) setTags([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      await fetchList();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [page, keyword]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', content: '', imageUrl: '', published: false, tagIds: [] });
    setModalOpen(true);
  };

  const openEdit = async (row: NewsItem) => {
    setEditing(row);
    try {
      const res = await adminApiFetch<{
        data: { title?: string; content?: string; imageUrl?: string; published?: boolean; tagIds?: number[] };
      }>(`/admin/news/${row.id}`);
      const d = res?.data;
      if (d) {
        setForm({
          title: d.title ?? '',
          content: d.content ?? '',
          imageUrl: d.imageUrl ?? '',
          published: d.published ?? false,
          tagIds: Array.isArray(d.tagIds) ? d.tagIds : [],
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '상세 조회 실패');
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = {
        title: form.title.trim(),
        content: form.content.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
        published: form.published,
        tagIds: form.tagIds.length ? form.tagIds : undefined,
      };
      if (editing) {
        await adminApiFetch(`/admin/news/${editing.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await adminApiFetch('/admin/news', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      setModalOpen(false);
      await fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장 실패');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminApiFetch(`/admin/news/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : '삭제 실패');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTag = (id: number) => {
    setForm((f) => ({
      ...f,
      tagIds: f.tagIds.includes(id) ? f.tagIds.filter((x) => x !== id) : [...f.tagIds, id],
    }));
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <input
          type="search"
          placeholder="제목 검색"
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          뉴스 추가
        </button>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">제목</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">게시일</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((row) => (
                  <tr key={row.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{row.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.title ?? '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {row.publishedAt ? new Date(row.publishedAt).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button type="button" onClick={() => openEdit(row)} className="text-gray-600 hover:text-gray-900">수정</button>
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
                  <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50">이전</button>
                  <span className="px-3 py-1 text-sm">{page} / {pagination.totalPages}</span>
                  <button type="button" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50">다음</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? '뉴스 수정' : '뉴스 추가'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">제목 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">본문</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={5}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">이미지 URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="published" className="text-sm text-gray-700">공개</label>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">태그</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <label key={t.id} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={form.tagIds.includes(t.id)}
                    onChange={() => toggleTag(t.id)}
                    className="rounded border-gray-300"
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">취소</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">{submitting ? '저장 중...' : '저장'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="뉴스 삭제"
        message={`"${deleteTarget?.title}" 뉴스를 삭제하시겠습니까?`}
        confirmLabel="삭제"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
