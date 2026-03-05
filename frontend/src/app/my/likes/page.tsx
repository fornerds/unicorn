'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';
import { ArrowDownIcon, LikeIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';
import { apiFetch } from '@/lib/api';

interface LikedProduct {
  id: number;
  name: string;
  category: { id: number; name: string };
  parentCategory: { id: number; name: string };
  stock: number;
  price: number;
  colors: string[];
}

interface LikesResponse {
  data: {
    items: LikedProduct[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  };
}

const ITEMS_PER_PAGE = 9;

const categoryOptions = [
  { label: '전체', value: 'all' },
  { label: '가정용', value: 'HOME' },
  { label: '소방용', value: 'FIREFIGHTING' },
  { label: '산업용', value: 'INDUSTRIAL' },
  { label: '의료용', value: 'MEDICAL' },
  { label: '물류용', value: 'LOGISTICS' },
];

export default function MyLikesPage() {
  const [likes, setLikes] = useState<LikedProduct[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch<LikesResponse>(`/users/me/likes?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
        setLikes(res.data.items);
        setTotalLikes(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      } catch {
        setLikes([]);
        setTotalLikes(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikes();
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setShowCategoryMenu(false);
      }
    };

    if (showCategoryMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryMenu]);

  const filteredProducts = likes.filter((product) => {
    if (selectedCategory === 'all') return true;
    return product.parentCategory?.name === selectedCategory || product.category?.name === selectedCategory;
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowCategoryMenu(false);
  };

  const selectedCategoryLabel = categoryOptions.find((opt) => opt.value === selectedCategory)?.label || '전체';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="bg-white flex flex-col">
      <div className="flex items-center justify-center pb-[150px] pt-[100px] px-[365px] w-full">
        <div className="flex gap-[30px] items-start">
          <div className="flex flex-col gap-[17px] items-start text-[#2a313f] w-[275px]">
            <div className="flex flex-col font-suit font-thin justify-center text-[60px] w-full">
              <p className="leading-[normal] whitespace-pre-wrap">Mypage</p>
            </div>
            <div className="flex flex-col font-suit font-extralight justify-center text-[30px] w-full">
              <p className="leading-[1.35] whitespace-pre-wrap">마이페이지</p>
            </div>
          </div>

          <div className="flex flex-col gap-[20px] items-end w-[885px]">
            <div className="flex h-[36px] items-center w-full">
              <div className="flex flex-col font-elice font-extralight justify-center text-[#111827] text-[26px] whitespace-nowrap">
                <p className="leading-[36px]">찜한 상품({totalLikes})</p>
              </div>
            </div>

            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex gap-[10px] items-center overflow-clip pl-[20px] pr-[16px] py-[6px] rounded-[99px] hover:opacity-80 transition-opacity"
                aria-label="카테고리 선택"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col font-suit font-normal justify-center text-[20px] text-[#374151] whitespace-nowrap">
                    <p className="leading-[1.35]">{selectedCategoryLabel}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center p-[1.333px] rounded-[5.333px] w-[16px] h-[16px]">
                  <ArrowDownIcon width={16} height={16} fill="#4B5563" />
                </div>
              </button>
              {showCategoryMenu && (
                <div className="absolute top-full right-0 mt-[8px] bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg z-10 min-w-[150px]">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleCategoryChange(option.value)}
                      className={`w-full px-[16px] py-[8px] text-left font-suit font-normal text-[16px] leading-[1.5] text-[#374151] hover:bg-[#f9fafb] first:rounded-t-[8px] last:rounded-b-[8px] ${
                        selectedCategory === option.value ? 'bg-[#f3f4f6]' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col items-start px-[4px] w-full">
              {isLoading ? (
                <div className="flex items-center justify-center w-full py-[60px]">
                  <p className="font-suit font-normal text-[16px] text-[#959ba9]">불러오는 중...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex items-center justify-center w-full py-[60px]">
                  <p className="font-suit font-normal text-[16px] text-[#959ba9]">아직 찜한 상품이 없습니다.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-[12px] w-full">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={ROUTES.PRODUCT_DETAIL(product.id)}
                        className="bg-[#f9fafb] border border-[#eeeff1] flex flex-col h-[362px] items-center overflow-clip pb-[14px] rounded-[9.863px] w-[284px] hover:opacity-95 transition-opacity"
                      >
                        <div className="flex gap-[10px] h-[48px] items-center justify-end px-[18px] py-[6px] w-full">
                          <div className="flex flex-1 items-center">
                            <div className="flex flex-col font-suit font-normal justify-center text-[16px] text-[#959ba9] whitespace-nowrap">
                              <p className="leading-[1.5]">{product.parentCategory?.name || product.category?.name || ''}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center shrink-0 w-[22px] h-[22px]">
                            <LikeIcon
                              width={20}
                              height={18}
                              fill="#1F2937"
                              stroke="#1F2937"
                              strokeWidth={0.6875}
                              isLiked={true}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col h-[227px] items-center justify-end w-full">
                          <div className="aspect-square flex-1 relative w-full bg-[#f3f4f6]" />
                        </div>
                        <div className="flex flex-col font-suit font-normal gap-[6px] items-start px-[20px] py-[10px] text-center w-full">
                          <div className="flex flex-col justify-center overflow-hidden text-[20px] text-black text-ellipsis w-full whitespace-nowrap">
                            <p className="leading-[1.5] overflow-hidden">{product.name}</p>
                          </div>
                          <div className="flex flex-col justify-center text-[16px] text-[#6b7280] w-full">
                            <p className="leading-[1.5] whitespace-pre-wrap">{formatPrice(product.price)}원</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="flex flex-col items-center justify-center px-[10px] py-[100px] w-full">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
