import React, { useEffect, useState } from 'react';
import { adminApiFetch } from '@/lib/api';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  sortOrder?: number;
  parentId?: number;
  children?: CategoryItem[];
}

export default function CategoriesPage() {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', parentId: '' as string, sortOrder: 0 });

  const fetchList = async () => {
    try {
      const res = await adminApiFetch<{ data: CategoryItem[] }>('/admin/categories');
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchList();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '', parentId: '', sortOrder: items.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (row: CategoryItem) => {
    setEditing(row);
    setForm({
      name: row.name,
      slug: row.slug,
      parentId: row.parentId != null ? String(row.parentId) : '',
      sortOrder: row.sortOrder ?? 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        parentId: form.parentId ? Number(form.parentId) : null,
        sortOrder: form.sortOrder,
      };
      if (editing) {
        await adminApiFetch(`/admin/categories/${editing.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await adminApiFetch('/admin/categories', {
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
      await adminApiFetch(`/admin/categories/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : '삭제 실패');
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
    <div>
      <div className="mb-4 flex justify-between">
        <div />
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          카테고리 추가
        </button>
      </div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</div>
      )}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">구분</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">이름</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">슬러그</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">정렬</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-xs font-medium text-gray-500">상위</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{row.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.slug}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{row.sortOrder ?? '-'}</td>
                  <td className="px-4 py-3 text-right text-sm">
                    <button type="button" onClick={() => openEdit(row)} className="text-gray-600 hover:text-gray-900">수정</button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button type="button" onClick={() => setDeleteTarget(row)} className="text-red-600 hover:text-red-700">삭제</button>
                  </td>
                </tr>
                {(row.children ?? []).map((child) => (
                  <tr key={child.id}>
                    <td className="px-4 py-3 pl-8 text-xs text-gray-500">하위</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{child.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{child.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{child.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{child.sortOrder ?? '-'}</td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button type="button" onClick={() => openEdit(child)} className="text-gray-600 hover:text-gray-900">수정</button>
                      <span className="mx-2 text-gray-300">|</span>
                      <button type="button" onClick={() => setDeleteTarget(child)} className="text-red-600 hover:text-red-700">삭제</button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">카테고리가 없습니다.</div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? '카테고리 수정' : '카테고리 추가'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">이름 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">슬러그 *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">상위 카테고리</label>
            <select
              value={form.parentId}
              onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">없음 (최상위)</option>
              {items
                .filter((p) => !editing || p.id !== editing.id)
                .map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name} (ID: {p.id})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">정렬 *</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              min={0}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="카테고리 삭제"
        message={`"${deleteTarget?.name}" 카테고리를 삭제하시겠습니까?`}
        confirmLabel="삭제"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
