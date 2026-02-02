'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';
import { ArrowDownIcon, LikeIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';
import { withBasePath } from '@/utils/assets';

const mockLikedProducts = [
  {
    id: '1',
    name: 'G1',
    price: 890000,
    imageUrl: '/images/product01.png',
    category: 'HOME',
    isLiked: true,
  },
  {
    id: '2',
    name: 'H1',
    price: 1200000,
    imageUrl: '/images/product02.png',
    category: 'HOME',
    isLiked: true,
  },
  {
    id: '3',
    name: 'Spot',
    price: 74500,
    imageUrl: '/images/product03.png',
    category: 'HOME',
    isLiked: true,
  },
  {
    id: '4',
    name: 'Go1',
    price: 2700,
    imageUrl: '/images/product04.png',
    category: 'HOME',
    isLiked: true,
  },
  {
    id: '5',
    name: 'UR5e',
    price: 35000,
    imageUrl: '/images/product05.png',
    category: 'HOME',
    isLiked: true,
  },
  {
    id: '6',
    name: 'FireBot X1',
    price: 250000,
    imageUrl: '/images/product06.png',
    category: 'FIREFIGHTING',
    isLiked: true,
  },
  {
    id: '7',
    name: 'RescueBot Pro',
    price: 180000,
    imageUrl: '/images/product07.png',
    category: 'FIREFIGHTING',
    isLiked: true,
  },
  {
    id: '8',
    name: 'Industrial Arm 3000',
    price: 45000,
    imageUrl: '/images/product08.png',
    category: 'INDUSTRIAL',
    isLiked: true,
  },
  {
    id: '9',
    name: 'FactoryBot',
    price: 32000,
    imageUrl: '/images/product09.png',
    category: 'INDUSTRIAL',
    isLiked: true,
  },
  {
    id: '10',
    name: 'CareBot',
    price: 150000,
    imageUrl: '/images/product10.png',
    category: 'MEDICAL',
    isLiked: true,
  },
  {
    id: '11',
    name: 'LogiBot 5000',
    price: 95000,
    imageUrl: '/images/product11.png',
    category: 'LOGISTICS',
    isLiked: true,
  },
  {
    id: '12',
    name: 'G1',
    price: 890000,
    imageUrl: '/images/product01.png',
    category: 'HOME',
    isLiked: true,
  },
  {
    id: '13',
    name: 'H1',
    price: 1200000,
    imageUrl: '/images/product02.png',
    category: 'HOME',
    isLiked: true,
  },
  {
    id: '14',
    name: 'Spot',
    price: 74500,
    imageUrl: '/images/product03.png',
    category: 'HOME',
    isLiked: true,
  },
  {
    id: '15',
    name: 'Go1',
    price: 2700,
    imageUrl: '/images/product04.png',
    category: 'HOME',
    isLiked: true,
  },
  {
    id: '16',
    name: 'UR5e',
    price: 35000,
    imageUrl: '/images/product05.png',
    category: 'HOME',
    isLiked: true,
  },
  {
    id: '17',
    name: 'FireBot X1',
    price: 250000,
    imageUrl: '/images/product06.png',
    category: 'FIREFIGHTING',
    isLiked: true,
  },
  {
    id: '18',
    name: 'RescueBot Pro',
    price: 180000,
    imageUrl: '/images/product07.png',
    category: 'FIREFIGHTING',
    isLiked: true,
  },
  {
    id: '19',
    name: 'Industrial Arm 3000',
    price: 45000,
    imageUrl: '/images/product08.png',
    category: 'INDUSTRIAL',
    isLiked: true,
  },
  {
    id: '20',
    name: 'FactoryBot',
    price: 32000,
    imageUrl: '/images/product09.png',
    category: 'INDUSTRIAL',
    isLiked: true,
  },
  {
    id: '21',
    name: 'CareBot',
    price: 150000,
    imageUrl: '/images/product10.png',
    category: 'MEDICAL',
    isLiked: true,
  },
];

const ITEMS_PER_PAGE = 9;
const TOTAL_LIKED_PRODUCTS = 21;

const categoryOptions = [
  { label: '전체', value: 'all' },
  { label: '가정용', value: 'HOME' },
  { label: '소방용', value: 'FIREFIGHTING' },
  { label: '산업용', value: 'INDUSTRIAL' },
  { label: '의료용', value: 'MEDICAL' },
  { label: '물류용', value: 'LOGISTICS' },
];

export default function MyLikesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

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

  const filteredProducts = mockLikedProducts.filter((product) => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowCategoryMenu(false);
  };

  const selectedCategoryLabel = categoryOptions.find((opt) => opt.value === selectedCategory)?.label || '전체';

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      HOME: 'Home',
      FIREFIGHTING: 'FIREFIGHTING',
      INDUSTRIAL: 'INDUSTRIAL',
      MEDICAL: 'MEDICAL',
      LOGISTICS: 'LOGISTICS',
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="bg-white flex flex-col">
      <div className="flex items-center justify-center pb-[150px] pt-[100px] px-[365px] w-full">
        <div className="flex gap-[30px] items-start">
          <div className="flex flex-col gap-[17px] items-start text-[#2a313f] w-[275px]">
            <div className="flex flex-col font-suit font-extralight justify-center text-[60px] w-full">
              <p className="leading-[normal] whitespace-pre-wrap">Mypage</p>
            </div>
            <div className="flex flex-col font-suit font-light justify-center text-[30px] w-full">
              <p className="leading-[1.35] whitespace-pre-wrap">마이페이지</p>
            </div>
          </div>

          <div className="flex flex-col gap-[20px] items-end w-[885px]">
            <div className="flex h-[36px] items-center w-full">
              <div className="flex flex-col font-elice font-light justify-center text-[#111827] text-[26px] whitespace-nowrap">
                <p className="leading-[36px]">찜한 상품({TOTAL_LIKED_PRODUCTS})</p>
              </div>
            </div>

            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex gap-[10px] items-center overflow-clip pl-[20px] pr-[16px] py-[6px] rounded-[99px] hover:opacity-80 transition-opacity"
                aria-label="카테고리 선택"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col font-suit font-medium justify-center text-[20px] text-[#374151] whitespace-nowrap">
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
                      className={`w-full px-[16px] py-[8px] text-left font-suit font-medium text-[16px] leading-[1.5] text-[#374151] hover:bg-[#f9fafb] first:rounded-t-[8px] last:rounded-b-[8px] ${
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
              <div className="grid grid-cols-3 gap-[12px] w-full">
                {displayedProducts.map((product) => {
                  const formattedPrice = new Intl.NumberFormat('ko-KR').format(product.price);

                  return (
                    <Link
                      key={product.id}
                      href={ROUTES.PRODUCT_DETAIL(product.id)}
                      className="bg-[#f9fafb] border border-[#eeeff1] flex flex-col h-[362px] items-center overflow-clip pb-[14px] rounded-[9.863px] w-[284px] hover:opacity-95 transition-opacity"
                    >
                      <div className="flex gap-[10px] h-[48px] items-center justify-end px-[18px] py-[6px] w-full">
                        <div className="flex flex-1 items-center">
                          <div className="flex flex-col font-suit font-medium justify-center text-[16px] text-[#959ba9] whitespace-nowrap">
                            <p className="leading-[1.5]">{getCategoryDisplayName(product.category)}</p>
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
                        <div className="aspect-square flex-1 relative w-full">
                          <Image
                            src={withBasePath(product.imageUrl)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                      <div className="flex flex-col font-suit font-medium gap-[6px] items-start px-[20px] py-[10px] text-center w-full">
                        <div className="flex flex-col justify-center overflow-hidden text-[20px] text-black text-ellipsis w-full whitespace-nowrap">
                          <p className="leading-[1.5] overflow-hidden">{product.name}</p>
                        </div>
                        <div className="flex flex-col justify-center text-[16px] text-[#6b7280] w-full">
                          <p className="leading-[1.5] whitespace-pre-wrap">{formattedPrice}원</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="flex flex-col items-center justify-center px-[10px] py-[100px] w-full">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
