import { useEffect, useState } from 'react';
import { adminApiFetch, adminApiUpload } from '@/lib/api';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface ProductItem {
  id: number;
  name: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  categoryName?: string;
}

interface CategoryItem {
  id: number;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const defaultForm = {
  name: '',
  description: '',
  price: 0,
  categoryId: 0,
  stock: 0,
  images: [] as string[],
};

export default function ProductsPage() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const fetchList = async () => {
    try {
      const q = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await adminApiFetch<{ data: { items: ProductItem[]; pagination: Pagination } }>(
        `/admin/products?${q}`
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

  const fetchCategories = async () => {
    try {
      const res = await adminApiFetch<{ data: CategoryItem[] }>('/admin/categories');
      setCategories(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      await fetchList();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [page]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = async (row: ProductItem) => {
    setEditing(row);
    try {
      const res = await adminApiFetch<{ data: ProductItem & { description?: string; images?: string[] } }>(
        `/admin/products/${row.id}`
      );
      const d = res?.data;
      if (d) {
        setForm({
          name: d.name ?? '',
          description: d.description ?? '',
          price: typeof d.price === 'number' ? d.price : 0,
          categoryId: d.categoryId ?? 0,
          stock: d.stock ?? 0,
          images: Array.isArray(d.images) ? d.images : [],
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
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: form.price,
        categoryId: form.categoryId || null,
        stock: form.stock,
        images: form.images.length ? form.images : undefined,
      };
      if (editing) {
        await adminApiFetch(`/admin/products/${editing.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        await adminApiFetch('/admin/products', {
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
      await adminApiFetch(`/admin/products/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : '삭제 실패');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const res = await adminApiUpload(file);
      if (res?.data?.url) {
        setForm((f) => ({ ...f, images: [...f.images, res.data.url] }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 실패');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          제품 추가
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">상품명</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">카테고리</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">가격</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">재고</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((row) => (
                  <tr key={row.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{row.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{row.categoryName ?? '-'}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      {row.price != null ? row.price.toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">{row.stock ?? '-'}</td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        수정
                      </button>
                      <span className="mx-2 text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(row)}
                        className="text-red-600 hover:text-red-700"
                      >
                        삭제
                      </button>
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? '제품 수정' : '제품 추가'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">상품명 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">설명</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">카테고리 *</label>
            <select
              value={form.categoryId || ''}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: Number(e.target.value) || 0 }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            >
              <option value="">선택</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">가격 *</label>
              <input
                type="number"
                value={form.price || ''}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                min={0}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">재고 *</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                min={0}
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="text-sm"
            />
            {uploading && <span className="ml-2 text-sm text-gray-500">업로드 중...</span>}
            {form.images.length > 0 && (
              <ul className="mt-2 space-y-1">
                {form.images.map((url, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="truncate text-blue-600">
                      {url}
                    </a>
                    <button type="button" onClick={() => removeImage(i)} className="text-red-600">
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
        title="제품 삭제"
        message={`"${deleteTarget?.name}" 제품을 삭제하시겠습니까?`}
        confirmLabel="삭제"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
