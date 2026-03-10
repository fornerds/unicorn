import { useEffect, useState } from 'react';
import { adminApiFetch, adminApiUpload } from '@/lib/api';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { RichTextEditor } from '@/components/RichTextEditor';

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

interface CategoryTreeNode extends CategoryItem {
  children?: CategoryTreeNode[];
}

function flattenCategories(nodes: CategoryTreeNode[], parentName = ''): CategoryItem[] {
  const result: CategoryItem[] = [];
  for (const node of nodes) {
    const displayName = parentName ? `${parentName} > ${node.name}` : node.name;
    result.push({ id: node.id, name: displayName });
    if (Array.isArray(node.children) && node.children.length > 0) {
      result.push(...flattenCategories(node.children, node.name));
    }
  }
  return result;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ColorStockItem {
  color: string;
  colorCode: string;
  stock: number;
}

const defaultForm = {
  name: '',
  shortDescription: '',
  content: '',
  price: 0,
  categoryId: 0,
  stock: 0,
  imageUrl: '' as string,
  images: [] as string[],
  colorStocks: [] as ColorStockItem[],
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
  const [detailSection, setDetailSection] = useState<'edit' | 'preview'>('edit');

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
      const res = await adminApiFetch<{ data: CategoryTreeNode[] }>('/admin/categories');
      const raw = Array.isArray(res?.data) ? res.data : [];
      setCategories(flattenCategories(raw));
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
    setDetailSection('edit');
    setModalOpen(true);
  };

  const openEdit = async (row: ProductItem) => {
    setEditing(row);
    try {
      const res = await adminApiFetch<{
        data: ProductItem & {
          shortDescription?: string;
          content?: string;
          imageUrl?: string;
          images?: string[];
          colorStocks?: ColorStockItem[];
        };
      }>(`/admin/products/${row.id}`);
      const d = res?.data;
      if (d) {
        setForm({
          name: d.name ?? '',
          shortDescription: d.shortDescription ?? '',
          content: d.content ?? '',
          price: typeof d.price === 'number' ? d.price : 0,
          categoryId: d.categoryId ?? 0,
          stock: d.stock ?? 0,
          imageUrl: d.imageUrl ?? '',
          images: Array.isArray(d.images) ? d.images : [],
          colorStocks: Array.isArray(d.colorStocks)
            ? d.colorStocks.map((c) => ({ color: c.color ?? '', colorCode: c.colorCode ?? '', stock: c.stock ?? 0 }))
            : [],
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '상세 조회 실패');
    }
    setDetailSection('edit');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = {
        name: form.name.trim(),
        shortDescription: form.shortDescription.trim() || undefined,
        content: form.content.trim() || undefined,
        price: form.price,
        categoryId: form.categoryId || null,
        stock: form.stock,
        imageUrl: form.imageUrl?.trim() ?? '',
        images: form.images.length ? form.images : undefined,
        colorStocks:
          form.colorStocks.filter((c) => c.color.trim()).length > 0
            ? form.colorStocks
                .filter((c) => c.color.trim())
                .map((c) => ({ color: c.color.trim(), colorCode: c.colorCode.trim() || undefined, stock: c.stock }))
            : undefined,
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

  const handleRepresentativeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const res = await adminApiUpload(file);
      if (res?.data?.url) setForm((f) => ({ ...f, imageUrl: res.data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 실패');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeRepresentativeImage = () => {
    setForm((f) => ({ ...f, imageUrl: '' }));
  };

  const handleDetailImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await adminApiUpload(files[i]);
        if (res?.data?.url) urls.push(res.data.url);
      }
      if (urls.length) setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 실패');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeDetailImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const moveDetailImage = (index: number, direction: 'prev' | 'next') => {
    setForm((f) => {
      const next = [...f.images];
      const to = direction === 'prev' ? index - 1 : index + 1;
      if (to < 0 || to >= next.length) return f;
      [next[index], next[to]] = [next[to], next[index]];
      return { ...f, images: next };
    });
  };

  const addColorStock = () => {
    setForm((f) => ({ ...f, colorStocks: [...f.colorStocks, { color: '', colorCode: '', stock: 0 }] }));
  };

  const updateColorStock = (index: number, field: keyof ColorStockItem, value: string | number) => {
    setForm((f) => ({
      ...f,
      colorStocks: f.colorStocks.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }));
  };

  const removeColorStock = (index: number) => {
    setForm((f) => ({ ...f, colorStocks: f.colorStocks.filter((_, i) => i !== index) }));
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
        size="xl"
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
            <label className="mb-1 block text-sm font-medium text-gray-700">짧은 설명</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="목록/요약용 한 줄 설명"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">상세 설명</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setDetailSection('edit')}
                  className={`rounded px-3 py-1.5 text-sm ${detailSection === 'edit' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  편집
                </button>
                <button
                  type="button"
                  onClick={() => setDetailSection('preview')}
                  className={`rounded px-3 py-1.5 text-sm ${detailSection === 'preview' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  미리보기
                </button>
              </div>
            </div>
            <div className="min-h-[420px]">
              {detailSection === 'edit' ? (
                <RichTextEditor
                  value={form.content}
                  onChange={(content) => setForm((f) => ({ ...f, content }))}
                  placeholder="굵게, 기울임, 목록, 링크, 이미지, 유튜브 영상을 사용할 수 있습니다."
                  minHeight="420px"
                  onImageUpload={async (file) => {
                    setError(null);
                    try {
                      const res = await adminApiUpload(file);
                      return res.data.url;
                    } catch (e) {
                      setError(e instanceof Error ? e.message : '이미지 업로드 실패');
                      throw e;
                    }
                  }}
                />
              ) : (
                <div
                  className="product-detail-preview min-h-[420px] w-full rounded-lg border border-gray-200 bg-white p-4 text-base text-gray-800 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_a]:break-all"
                  dangerouslySetInnerHTML={{
                    __html: form.content?.trim() || '<p class="text-gray-400">입력된 상세 설명이 없습니다.</p>',
                  }}
                />
              )}
            </div>
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
            <label className="mb-1 block text-sm font-medium text-gray-700">컬러별 재고</label>
            <p className="mb-2 text-xs text-gray-500">색상명·색상코드(#000000)·재고를 입력하면 컬러별 재고로 관리됩니다.</p>
            {form.colorStocks.length > 0 && (
              <div className="mb-2 overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">색상명</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">색상코드</th>
                      <th className="px-3 py-2 text-right font-medium text-gray-700">재고</th>
                      <th className="w-12 px-2 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {form.colorStocks.map((c, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={c.color}
                            onChange={(e) => updateColorStock(i, 'color', e.target.value)}
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            placeholder="예: 화이트/White"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={c.colorCode}
                            onChange={(e) => updateColorStock(i, 'colorCode', e.target.value)}
                            className="w-full rounded border border-gray-300 px-2 py-1 font-mono text-sm"
                            placeholder="#FFFFFF"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            value={c.stock}
                            onChange={(e) => updateColorStock(i, 'stock', Number(e.target.value) || 0)}
                            className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm"
                            min={0}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <button type="button" onClick={() => removeColorStock(i)} className="text-red-600 hover:text-red-700">
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button type="button" onClick={addColorStock} className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
              컬러 재고 행 추가
            </button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">대표 이미지</label>
            <p className="mb-2 text-xs text-gray-500">목록·썸네일용 1장.</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleRepresentativeImageUpload}
              disabled={uploading}
              className="text-sm"
            />
            {uploading && <span className="ml-2 text-sm text-gray-500">업로드 중...</span>}
            {form.imageUrl && (
              <div className="mt-2 flex items-start gap-2">
                <img src={form.imageUrl} alt="대표" className="h-24 w-24 rounded border border-gray-200 object-cover" />
                <div className="flex flex-col gap-1">
                  <a href={form.imageUrl} target="_blank" rel="noopener noreferrer" className="max-w-[200px] truncate text-xs text-blue-600">
                    보기
                  </a>
                  <button type="button" onClick={removeRepresentativeImage} className="text-left text-xs text-red-600 hover:text-red-700">
                    삭제
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">상세 이미지</label>
            <p className="mb-2 text-xs text-gray-500">제품 상세 페이지 갤러리용. 여러 장 선택 가능.</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleDetailImagesUpload}
              disabled={uploading}
              className="text-sm"
            />
            {form.images.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-3">
                {form.images.map((url, i) => (
                  <li key={`${url}-${i}`} className="flex flex-col items-start gap-1">
                    <img src={url} alt={`상세 ${i + 1}`} className="h-24 w-24 rounded border border-gray-200 object-cover" />
                    <div className="flex flex-wrap items-center gap-1">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="max-w-[100px] truncate text-xs text-blue-600">
                        보기
                      </a>
                      <button type="button" onClick={() => moveDetailImage(i, 'prev')} disabled={i === 0} className="text-xs text-gray-500 disabled:opacity-40">
                        ←
                      </button>
                      <button type="button" onClick={() => moveDetailImage(i, 'next')} disabled={i === form.images.length - 1} className="text-xs text-gray-500 disabled:opacity-40">
                        →
                      </button>
                      <button type="button" onClick={() => removeDetailImage(i)} className="text-xs text-red-600">
                        삭제
                      </button>
                    </div>
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
