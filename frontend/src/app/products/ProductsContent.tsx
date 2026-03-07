'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CategorySidebar } from '@/components/features/products/CategorySidebar';
import { ProductCard } from '@/components/features/products/ProductCard';
import { SearchIcon } from '@/components/ui/icons';
import { ArrowDownIcon } from '@/components/ui/icons';
import { apiFetch } from '@/lib/api';
import { getCategoryDisplayName } from '@/utils/categoryMapping';

interface ApiCategory {
  id: number;
  name: string;
}

interface ApiProduct {
  id: number;
  name: string;
  price: number;
  isLiked: boolean;
  imageUrl?: string;
  parentCategory: ApiCategory;
  category: ApiCategory;
}

interface ProductsListResponse {
  data: {
    items: ApiProduct[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface ProductView {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: string;
  companyName: string;
  isLiked: boolean;
  parentCategoryId: number;
}

const sortOptions = [
  { label: '최신 순', value: 'latest', sort: 'createdAt', order: 'desc' },
  { label: '가격 낮은 순', value: 'price-asc', sort: 'price', order: 'asc' },
  { label: '가격 높은 순', value: 'price-desc', sort: 'price', order: 'desc' },
  { label: '이름 순', value: 'name-asc', sort: 'name', order: 'asc' },
];

export const ProductsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<ProductView[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const category = searchParams.get('category') || '';

  // 초기 로드: 전체 제품 가져와서 카테고리 이름→ID 맵 구축
  useEffect(() => {
    const initCategoryMap = async () => {
      try {
        const res = await apiFetch<ProductsListResponse>('/products?limit=100');
        const map: Record<string, number> = {};
        res.data.items.forEach((item) => {
          if (item.parentCategory) {
            map[item.parentCategory.name.toUpperCase()] = item.parentCategory.id;
          }
        });
        setCategoryMap(map);
      } catch {
        // 맵 구축 실패해도 검색/정렬은 동작
      }
    };
    initCategoryMap();

    if (!searchParams.get('category')) {
      router.replace('/products?category=HOME');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 제품 목록 조회
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '20');
      params.set('page', '1');

      // 카테고리 필터
      if (category && categoryMap[category]) {
        params.set('categoryId', String(categoryMap[category]));
      }

      // 검색어
      if (searchQuery.trim()) {
        params.set('keyword', searchQuery.trim());
      }

      // 정렬
      const sortOpt = sortOptions.find((opt) => opt.value === sortBy);
      if (sortOpt) {
        params.set('sort', sortOpt.sort);
        params.set('order', sortOpt.order);
      }

      const res = await apiFetch<ProductsListResponse>(
        `/products?${params.toString()}`,
      );

      const mapped: ProductView[] = res.data.items.map((item) => ({
        id: String(item.id),
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        category: `${getCategoryDisplayName(item.parentCategory?.name || '')} > ${item.category?.name || ''}`,
        companyName: 'Boston Dynamics',
        isLiked: item.isLiked,
        parentCategoryId: item.parentCategory?.id || 0,
      }));

      setProducts(mapped);
      setTotalCount(res.data.pagination.total);
    } catch {
      setProducts([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [category, categoryMap, searchQuery, sortBy]);

  useEffect(() => {
    // categoryMap이 빌드된 후에만 fetch
    if (Object.keys(categoryMap).length > 0 || !category) {
      fetchProducts();
    }
  }, [fetchProducts, categoryMap, category]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };

    if (showSortMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortMenu]);

  const handleLikeToggle = (id: string, liked: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isLiked: liked } : p)),
    );
  };

  const selectedSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || '최신 순';

  return (
    <div className="bg-white min-h-screen">
      <div className="flex gap-[60px] items-start pb-[150px] pt-[100px] px-[45px] w-full max-w-[1440px] mx-auto">
        <CategorySidebar />

        <div className="flex flex-1 flex-col gap-[20px] items-start min-h-0 min-w-0 max-w-[1119px]">
          <div className="flex flex-col gap-[15px] items-start w-full w-[1119px]">
            <div className="flex h-[38.25px] items-center justify-between px-[7.5px] py-[4.5px] w-full max-w-[1119px]">
              <div className="border-b-[0.75px] border-[#4b5563] flex items-center justify-between py-[4.5px] w-[248.25px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="원하는 로봇을 검색해 보세요."
                  className="flex-1 font-suit font-light text-[15px] leading-[1.5] text-[#959ba9] bg-transparent border-none outline-none placeholder:text-[#959ba9]"
                />
                <button className="flex items-center justify-center p-[1.5px] rounded-[8px] w-[18px] h-[18px] shrink-0">
                  <SearchIcon width={12} height={12} stroke="#959ba9" strokeWidth={1.5} />
                </button>
              </div>
              <div className="relative" ref={sortMenuRef}>
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex gap-[7.5px] items-center overflow-clip pl-[15px] pr-[12px] py-[4.5px] rounded-[74.25px] shrink-0 hover:opacity-80 transition-opacity"
                >
                  <p className="font-suit font-normal text-[15px] leading-[1.35] text-[#374151] whitespace-nowrap">
                    {selectedSortLabel}
                  </p>
                  <div className={`flex items-center justify-center p-[1.333px] rounded-[5.333px] w-[12px] h-[12px] shrink-0 transition-transform ${showSortMenu ? 'rotate-180' : ''}`}>
                    <ArrowDownIcon width={8} height={4} fill="#374151" />
                  </div>
                </button>
                {showSortMenu && (
                  <div className="absolute top-full right-0 mt-[8px] bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg z-10 min-w-[150px]">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortMenu(false);
                        }}
                        className={`w-full px-[16px] py-[8px] text-left font-suit font-normal text-[16px] leading-[1.5] text-[#374151] hover:bg-[#f9fafb] first:rounded-t-[8px] last:rounded-b-[8px] ${
                          sortBy === option.value ? 'bg-[#f3f4f6]' : ''
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-wrap gap-y-[12px] gap-x-[9px] items-center w-full max-w-[1119px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#f9fafb] flex flex-col items-center overflow-hidden pb-[36px] pt-[16px] px-[24px] rounded-[8px] shrink-0 w-[367px] h-[500px] animate-pulse"
                  >
                    <div className="w-full h-[20px] bg-[#e5e7eb] rounded mb-[20px]" />
                    <div className="flex-1 w-[200px] bg-[#e5e7eb] rounded" />
                    <div className="w-[150px] h-[42px] bg-[#e5e7eb] rounded mt-[20px]" />
                    <div className="w-[100px] h-[33px] bg-[#e5e7eb] rounded mt-[10px]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-y-[12px] gap-x-[9px] items-center w-full max-w-[1119px]">
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      imageUrl={product.imageUrl}
                      category={product.category}
                      companyName={product.companyName}
                      isLiked={product.isLiked}
                      onLikeToggle={handleLikeToggle}
                    />
                  ))
                ) : (
                  <div className="w-full text-center py-[60px]">
                    <p className="font-suit font-normal text-[18px] text-[#959ba9]">
                      {searchQuery ? '검색 결과가 없습니다.' : '등록된 제품이 없습니다.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {totalCount > 0 && !isLoading && (
              <div className="flex items-center justify-center w-full pt-[20px]">
                <p className="font-suit font-medium text-[14px] text-[#959ba9]">
                  총 {totalCount}개의 제품
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
