'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';
import { ArrowDownIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';
import { apiFetch } from '@/lib/api';

interface OrderItem {
  productId: number;
  product: { id: number; name: string; price: number; imageUrl: string };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  data: {
    items: Order[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  };
}

const ITEMS_PER_PAGE = 10;

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch<OrdersResponse>(`/users/me/orders?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
        setOrders(res.data.items);
        setTotalOrders(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      } catch {
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = () => {
    setSortOrder((prev) => (prev === 'latest' ? 'oldest' : 'latest'));
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getOrderDisplayName = (order: Order) => {
    if (order.items.length === 0) return '-';
    const firstName = order.items[0].product.name;
    if (order.items.length === 1) return firstName;
    return `${firstName} 외 ${order.items.length - 1}건`;
  };

  const getOrderTotalQuantity = (order: Order) => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="bg-white flex flex-col">
      <div className="flex items-center justify-center pb-[150px] pt-[100px] px-[365px] w-full">
        <div className="flex gap-[81px] items-start">
          <div className="flex flex-col gap-[17px] items-start text-[#2a313f] w-[224px]">
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
                <p className="leading-[36px]">주문 내역({totalOrders})</p>
              </div>
            </div>

            <button
              onClick={handleSortChange}
              className="flex gap-[10px] items-center overflow-clip pl-[20px] pr-[16px] py-[6px] rounded-[99px] hover:opacity-80 transition-opacity"
              aria-label="정렬 변경"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col font-suit font-normal justify-center text-[20px] text-[#374151] whitespace-nowrap">
                  <p className="leading-[1.35]">{sortOrder === 'latest' ? '최신순' : '오래된순'}</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-[1.333px] rounded-[5.333px] w-[16px] h-[16px]">
                <ArrowDownIcon width={16} height={16} fill="#4B5563" />
              </div>
            </button>

            <div className="flex flex-col items-start w-full">
              <div className="flex flex-col gap-[23px] items-start px-[4px] w-full">
                {isLoading ? (
                  <div className="flex items-center justify-center w-full py-[60px]">
                    <p className="font-suit font-normal text-[16px] text-[#959ba9]">불러오는 중...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex items-center justify-center w-full py-[60px]">
                    <p className="font-suit font-normal text-[16px] text-[#959ba9]">아직 구매한 제품이 없습니다.</p>
                  </div>
                ) : (
                  orders.map((order, index) => (
                    <Link
                      key={order.id}
                      href={ROUTES.MY_ORDER_DETAIL(order.id)}
                      className="flex flex-col gap-[4px] items-start w-full hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex gap-[10px] items-center text-[14px]">
                          <div className="flex gap-[4px] items-center justify-center leading-[20px] text-[#8e8e93]">
                            <p className="font-suit font-medium">주문번호</p>
                            <p className="font-suit font-normal">{order.id}</p>
                          </div>
                          <div className="flex flex-col font-suit font-medium justify-center text-[#959ba9] whitespace-nowrap">
                            <p className="leading-[1.5]">|</p>
                          </div>
                          <div className="flex flex-col font-suit font-medium justify-center text-[#959ba9] whitespace-nowrap">
                            <p className="leading-[1.5]">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center pl-[20px] py-[10px] shrink-0" />
                      </div>
                      <div className="flex flex-col gap-[16px] items-start w-full">
                        <div className="flex gap-[10px] items-center w-full">
                          <div className="bg-[#f9fafb] flex items-center relative rounded-[12px] shrink-0">
                            <div className="relative shrink-0 w-[104px] h-[104px]">
                              {order.items[0]?.product.imageUrl ? (
                                <Image
                                  src={order.items[0].product.imageUrl}
                                  alt={getOrderDisplayName(order)}
                                  fill
                                  className="object-cover rounded-[12px]"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full bg-[#f3f4f6] rounded-[12px]" />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col h-[104px] items-start justify-between">
                            <div className="flex flex-col items-start w-full">
                              <div className="flex items-center w-full">
                                <div className="flex flex-1 flex-col font-suit font-normal justify-center overflow-hidden text-[20px] text-[#1f2937] text-ellipsis whitespace-nowrap">
                                  <p className="leading-[1.5] overflow-hidden">{getOrderDisplayName(order)}</p>
                                </div>
                              </div>
                              <div className="flex gap-[8px] items-center">
                                <div className="flex flex-col font-suit font-normal justify-center text-[14px] text-[#959ba9] whitespace-nowrap">
                                  <p className="leading-[1.5]">수량 {getOrderTotalQuantity(order)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-end justify-end w-full">
                              <div className="flex gap-[8px] items-end">
                                <div className="flex flex-col items-center justify-center py-[4px]">
                                  <div className="capitalize flex flex-col font-suit font-normal justify-center text-[14px] text-[#1f2937] whitespace-nowrap">
                                    <p className="leading-[1.5]">Total</p>
                                  </div>
                                </div>
                                <div className="flex gap-[3px] items-end justify-center">
                                  <div className="flex flex-col font-suit font-semibold justify-center text-[22px] text-[#1f2937] whitespace-nowrap">
                                    <p className="leading-[1.5]">{formatPrice(order.totalAmount)}</p>
                                  </div>
                                  <div className="flex flex-col items-center justify-center py-[3px] w-[14px]">
                                    <div className="flex flex-col font-suit font-medium justify-center text-[18px] text-[#1f2937] w-full">
                                      <p className="leading-[1.5] whitespace-pre-wrap">원</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < orders.length - 1 && (
                          <div className="h-0 w-full border-t border-[#E5E7EB]" />
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {!isLoading && orders.length > 0 && (
                <div className="flex flex-col items-center justify-center px-[10px] py-[100px] w-full">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
