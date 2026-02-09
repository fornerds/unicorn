'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';
import { ArrowDownIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';

const mockOrders = [
  {
    id: 1,
    orderNumber: '230988739',
    date: '2026.01.03',
    productName: 'AURA_AI 가사 휴머노이드 외 1건',
    quantity: 1,
    color: '아이보리/Ivory',
    total: '4,350,000',
    image: '/images/product01.png',
  },
  {
    id: 2,
    orderNumber: '230988740',
    date: '2026.01.02',
    productName: 'AURA_AI 가사 휴머노이드 외 1건',
    quantity: 1,
    color: '아이보리/Ivory',
    total: '4,350,000',
    image: '/images/product01.png',
  },
  {
    id: 3,
    orderNumber: '230988741',
    date: '2026.01.01',
    productName: 'AURA_AI 가사 휴머노이드 외 1건',
    quantity: 1,
    color: '아이보리/Ivory',
    total: '4,350,000',
    image: '/images/product01.png',
  },
  {
    id: 4,
    orderNumber: '230988742',
    date: '2025.12.31',
    productName: 'AURA_AI 가사 휴머노이드 외 1건',
    quantity: 1,
    color: '아이보리/Ivory',
    total: '4,350,000',
    image: '/images/product01.png',
  },
  {
    id: 5,
    orderNumber: '230988743',
    date: '2025.12.30',
    productName: 'AURA_AI 가사 휴머노이드 외 1건',
    quantity: 1,
    color: '아이보리/Ivory',
    total: '4,350,000',
    image: '/images/product01.png',
  },
  {
    id: 6,
    orderNumber: '230988744',
    date: '2025.12.29',
    productName: 'AURA_AI 가사 휴머노이드 외 1건',
    quantity: 1,
    color: '아이보리/Ivory',
    total: '4,350,000',
    image: '/images/product01.png',
  },
  {
    id: 7,
    orderNumber: '230988745',
    date: '2025.12.28',
    productName: 'AURA_AI 가사 휴머노이드 외 1건',
    quantity: 1,
    color: '아이보리/Ivory',
    total: '4,350,000',
    image: '/images/product01.png',
  },
  {
    id: 8,
    orderNumber: '230988746',
    date: '2025.12.27',
    productName: 'AURA_AI 가사 휴머노이드 외 1건',
    quantity: 1,
    color: '아이보리/Ivory',
    total: '4,350,000',
    image: '/images/product01.png',
  },
  {
    id: 9,
    orderNumber: '230988747',
    date: '2025.12.26',
    productName: 'AURA_AI 가사 휴머노이드 외 1건',
    quantity: 1,
    color: '아이보리/Ivory',
    total: '4,350,000',
    image: '/images/product01.png',
  },
  {
    id: 10,
    orderNumber: '230988748',
    date: '2025.12.25',
    productName: 'AURA_AI 가사 휴머노이드 외 1건',
    quantity: 1,
    color: '아이보리/Ivory',
    total: '4,350,000',
    image: '/images/product01.png',
  },
];

const ITEMS_PER_PAGE = 10;
const TOTAL_ORDERS = 13;

export default function MyOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [basePath, setBasePath] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/unicorn')) {
        return '/unicorn';
      }
    }
    return process.env.NEXT_PUBLIC_BASE_PATH || '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/unicorn')) {
        setBasePath('/unicorn');
      }
    }
  }, []);

  const getImagePath = (path: string) => {
    if (basePath && path.startsWith('/')) {
      return `${basePath}${path}`;
    }
    return path;
  };

  const totalPages = Math.ceil(TOTAL_ORDERS / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedOrders = mockOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = () => {
    setSortOrder((prev) => (prev === 'latest' ? 'oldest' : 'latest'));
  };

  return (
    <div className="bg-white flex flex-col">
      <div className="flex items-center justify-center pb-[150px] pt-[100px] px-[365px] w-full">
        <div className="flex gap-[81px] items-start">
          <div className="flex flex-col gap-[17px] items-start text-[#2a313f] w-[224px]">
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
                <p className="leading-[36px]">주문 내역({TOTAL_ORDERS})</p>
              </div>
            </div>

            <button
              onClick={handleSortChange}
              className="flex gap-[10px] items-center overflow-clip pl-[20px] pr-[16px] py-[6px] rounded-[99px] hover:opacity-80 transition-opacity"
              aria-label="정렬 변경"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col font-suit font-medium justify-center text-[20px] text-[#374151] whitespace-nowrap">
                  <p className="leading-[1.35]">{sortOrder === 'latest' ? '최신순' : '오래된순'}</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-[1.333px] rounded-[5.333px] w-[16px] h-[16px]">
                <ArrowDownIcon width={16} height={16} fill="#4B5563" />
              </div>
            </button>

            <div className="flex flex-col items-start w-full">
              <div className="flex flex-col gap-[23px] items-start px-[4px] w-full">
                {displayedOrders.map((order, index) => (
                  <Link
                    key={order.id}
                    href={ROUTES.MY_ORDER_DETAIL(order.id)}
                    className="flex flex-col gap-[4px] items-start w-full hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex gap-[10px] items-center text-[14px]">
                        <div className="flex gap-[4px] items-center justify-center leading-[20px] text-[#8e8e93]">
                          <p className="font-suit font-semibold">주문번호</p>
                          <p className="font-suit font-medium">{order.orderNumber}</p>
                        </div>
                        <div className="flex flex-col font-suit font-semibold justify-center text-[#959ba9] whitespace-nowrap">
                          <p className="leading-[1.5]">|</p>
                        </div>
                        <div className="flex flex-col font-suit font-semibold justify-center text-[#959ba9] whitespace-nowrap">
                          <p className="leading-[1.5]">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center pl-[20px] py-[10px] shrink-0" />
                    </div>
                    <div className="flex flex-col gap-[16px] items-start w-full">
                      <div className="flex gap-[10px] items-center w-full">
                        <div className="bg-[#f9fafb] flex items-center relative rounded-[12px] shrink-0">
                          <div className="relative shrink-0 w-[104px] h-[104px]">
                            <Image
                              src={getImagePath(order.image)}
                              alt={order.productName}
                              fill
                              className="object-cover rounded-[12px]"
                              unoptimized
                            />
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col h-[104px] items-start justify-between">
                          <div className="flex flex-col items-start w-full">
                            <div className="flex items-center w-full">
                              <div className="flex flex-1 flex-col font-suit font-medium justify-center overflow-hidden text-[20px] text-[#1f2937] text-ellipsis whitespace-nowrap">
                                <p className="leading-[1.5] overflow-hidden">{order.productName}</p>
                              </div>
                            </div>
                            <div className="flex gap-[8px] items-center">
                              <div className="flex flex-col font-suit font-medium justify-center text-[14px] text-[#959ba9] whitespace-nowrap">
                                <p className="leading-[1.5]">수량 {order.quantity}</p>
                              </div>
                              <div className="flex h-[13px] items-center justify-center w-0">
                                <div className="flex-none rotate-90">
                                  <div className="h-0 w-[13px] border-t border-[#959ba9]" />
                                </div>
                              </div>
                              <div className="flex flex-col font-suit font-medium justify-center text-[14px] text-[#959ba9] whitespace-nowrap">
                                <p className="leading-[1.5]">{order.color}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-end justify-end w-full">
                            <div className="flex gap-[8px] items-end">
                              <div className="flex flex-col items-center justify-center py-[4px]">
                                <div className="capitalize flex flex-col font-suit font-medium justify-center text-[14px] text-[#1f2937] whitespace-nowrap">
                                  <p className="leading-[1.5]">Total</p>
                                </div>
                              </div>
                              <div className="flex gap-[3px] items-end justify-center">
                                <div className="flex flex-col font-suit font-bold justify-center text-[22px] text-[#1f2937] whitespace-nowrap">
                                  <p className="leading-[1.5]">{order.total}</p>
                                </div>
                                <div className="flex flex-col items-center justify-center py-[3px] w-[14px]">
                                  <div className="flex flex-col font-suit font-semibold justify-center text-[18px] text-[#1f2937] w-full">
                                    <p className="leading-[1.5] whitespace-pre-wrap">원</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < displayedOrders.length - 1 && (
                        <div className="h-0 w-full border-t border-[#E5E7EB]" />
                      )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
