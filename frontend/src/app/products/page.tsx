'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect, useRef } from 'react';
import { CategorySidebar } from '@/components/features/products/CategorySidebar';
import { ProductCard } from '@/components/features/products/ProductCard';
import { SearchIcon } from '@/components/ui/icons';
import { ArrowDownIcon } from '@/components/ui/icons';

const mockProducts = [
  {
    id: '1',
    name: 'G1',
    price: 890000,
    imageUrl: '/images/product01.png',
    category: 'HOME',
    subCategory: 'Human',
    companyName: 'Unitree',
    isLiked: true,
  },
  {
    id: '2',
    name: 'H1',
    price: 1200000,
    imageUrl: '/images/product02.png',
    category: 'HOME',
    subCategory: 'Human',
    companyName: 'Boston Dynamics',
    isLiked: false,
  },
  {
    id: '3',
    name: 'Spot',
    price: 74500,
    imageUrl: '/images/product03.png',
    category: 'HOME',
    subCategory: 'Quadruped',
    companyName: 'Boston Dynamics',
    isLiked: false,
  },
  {
    id: '4',
    name: 'Go1',
    price: 2700,
    imageUrl: '/images/product04.png',
    category: 'HOME',
    subCategory: 'Quadruped',
    companyName: 'Unitree',
    isLiked: false,
  },
  {
    id: '5',
    name: 'UR5e',
    price: 35000,
    imageUrl: '/images/product05.png',
    category: 'HOME',
    subCategory: 'Manipulator',
    companyName: 'Universal Robots',
    isLiked: false,
  },
  {
    id: '6',
    name: 'FireBot X1',
    price: 250000,
    imageUrl: '/images/product06.png',
    category: 'FIREFIGHTING',
    subCategory: 'Wheeled',
    companyName: 'FireTech',
    isLiked: false,
  },
  {
    id: '7',
    name: 'RescueBot Pro',
    price: 180000,
    imageUrl: '/images/product07.png',
    category: 'FIREFIGHTING',
    subCategory: 'Quadruped',
    companyName: 'RescueSystems',
    isLiked: false,
  },
  {
    id: '8',
    name: 'Industrial Arm 3000',
    price: 45000,
    imageUrl: '/images/product08.png',
    category: 'INDUSTRIAL',
    subCategory: 'Manipulator',
    companyName: 'IndustrialRobotics',
    isLiked: false,
  },
  {
    id: '9',
    name: 'FactoryBot',
    price: 32000,
    imageUrl: '/images/product09.png',
    category: 'INDUSTRIAL',
    subCategory: 'Wheeled',
    companyName: 'FactoryTech',
    isLiked: false,
  },
  {
    id: '10',
    name: 'CareBot',
    price: 150000,
    imageUrl: '/images/product10.png',
    category: 'MEDICAL',
    subCategory: 'Human',
    companyName: 'MediCare Robotics',
    isLiked: false,
  },
  {
    id: '11',
    name: 'LogiBot 5000',
    price: 95000,
    imageUrl: '/images/product11.png',
    category: 'LOGISTICS',
    subCategory: 'Wheeled',
    companyName: 'LogiTech',
    isLiked: false,
  },
];

const sortOptions = [
  { label: '최신 순', value: 'latest' },
  { label: '가격 낮은 순', value: 'price-asc' },
  { label: '가격 높은 순', value: 'price-desc' },
  { label: '인기 순', value: 'popular' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    
    if (!category && !subCategory) {
      router.replace('/products?category=HOME&subCategory=Human');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const category = searchParams.get('category') || '';
  const subCategory = searchParams.get('subCategory') || '';

  const filteredProducts = useMemo(() => {
    let filtered = [...mockProducts];

    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (subCategory) {
      filtered = filtered.filter((product) => product.subCategory === subCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.isLiked ? 1 : 0) - (a.isLiked ? 1 : 0));
        break;
      case 'latest':
      default:
        break;
    }

    return filtered;
  }, [category, subCategory, searchQuery, sortBy]);

  const selectedSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || '최신 순';

  return (
    <div className="bg-white min-h-screen">
      <div className="flex gap-[119px] items-start pb-[150px] pt-[100px] px-[60px]">
        <CategorySidebar />

        <div className="flex flex-1 flex-col gap-[20px] items-start min-h-0 min-w-0">
          <div className="flex h-[51px] items-center justify-between px-[10px] py-[6px] w-full">
            <div className="border-b border-[#4b5563] flex items-center justify-between py-[6px] w-[331px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="원하는 로봇을 검색해 보세요."
                className="flex-1 font-suit font-normal text-[18px] leading-[1.5] text-[#959ba9] bg-transparent border-none outline-none placeholder:text-[#959ba9]"
              />
              <button className="flex items-center justify-center p-[2px] rounded-[8px] w-[24px] h-[24px] shrink-0">
                <SearchIcon width={16} height={16} stroke="#959ba9" strokeWidth={1.75} />
              </button>
            </div>
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex gap-[10px] items-center overflow-clip pl-[20px] pr-[16px] py-[6px] rounded-[99px] shrink-0 hover:opacity-80 transition-opacity"
              >
                <p className="font-suit font-medium text-[20px] leading-[1.35] text-[#374151] whitespace-nowrap">
                  {selectedSortLabel}
                </p>
                <div className={`flex items-center justify-center p-[1.333px] rounded-[5.333px] w-[16px] h-[16px] shrink-0 transition-transform ${showSortMenu ? 'rotate-180' : ''}`}>
                  <ArrowDownIcon width={10.667} height={5.333} stroke="#374151" strokeWidth={1.5} />
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
                      className={`w-full px-[16px] py-[8px] text-left font-suit font-medium text-[16px] leading-[1.5] text-[#374151] hover:bg-[#f9fafb] first:rounded-t-[8px] last:rounded-b-[8px] ${
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

          <div className="flex flex-wrap gap-[12px] items-center w-full">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <div className="w-full text-center py-[60px]">
                <p className="font-suit font-medium text-[18px] text-[#959ba9]">
                  검색 결과가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
