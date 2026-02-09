'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, LikeIcon, ArrowRightWhiteIcon } from '@/components/ui/icons';
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
];

const mockLikedProducts = [
  { id: 1, name: 'G1', price: '890,000', category: 'Home', image: '/images/product01.png' },
  { id: 2, name: 'G1', price: '890,000', category: 'Home', image: '/images/product01.png' },
  { id: 3, name: 'G1', price: '890,000', category: 'Home', image: '/images/product01.png' },
  { id: 4, name: 'G1', price: '890,000', category: 'Home', image: '/images/product01.png' },
  { id: 5, name: 'G1', price: '890,000', category: 'Home', image: '/images/product01.png' },
  { id: 6, name: 'G1', price: '890,000', category: 'Home', image: '/images/product01.png' },
];

export default function MyPage() {
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

          <div className="flex flex-col gap-[100px] items-start w-[885px]">
            <div className="bg-[#f9fafb] flex items-center justify-between px-[30px] py-[34px] rounded-[20px] w-full">
              <div className="flex flex-1 flex-col gap-[2px] items-start">
                <div className="flex flex-col font-suit font-semibold justify-center text-[#2a313f] text-[30px] w-full">
                  <p className="leading-[1.35] whitespace-pre-wrap">김철수</p>
                </div>
                <div className="flex flex-col font-suit font-medium justify-center text-[#6b7280] text-[18px] w-full">
                  <p className="leading-[20px] whitespace-pre-wrap">kimcs@example.com</p>
                </div>
              </div>
              <Link href={ROUTES.MY_PROFILE} className="h-[45px] w-[40px] flex items-center justify-center">
                <ArrowRightIcon width={20} height={20} stroke="#1f2937" />
              </Link>
            </div>

            <div className="flex flex-col gap-[30px] items-start px-[4px] w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col font-elice font-light justify-center text-[24px] text-[#1f2937] whitespace-nowrap">
                  <p className="leading-[1.35]">주문 내역</p>
                </div>
                <Link
                  href={ROUTES.MY_ORDERS}
                  className="flex gap-[10px] items-center justify-center py-[10px]"
                >
                  <div className="flex flex-col font-suit font-medium justify-center text-[18px] text-[#6b7280] text-center whitespace-nowrap">
                    <p className="leading-[20px]">더보기</p>
                  </div>
                  <div className="flex items-center justify-center shrink-0 w-[16px] h-[16px]">
                    <ArrowRightIcon width={14} height={14} stroke="#6b7280" />
                  </div>
                </Link>
              </div>
              <div className="flex flex-col gap-[20px] items-start w-full">
                {mockOrders.map((order) => (
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
                      <div className="h-0 w-full border-t border-[#E5E7EB]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[30px] items-center px-[4px] w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col font-elice font-light justify-center text-[24px] text-[#1f2937] whitespace-nowrap">
                  <p className="leading-[1.35]">찜한제품(7)</p>
                </div>
                <Link
                  href={ROUTES.MY_LIKES}
                  className="flex gap-[10px] items-center justify-center py-[10px]"
                >
                  <div className="flex flex-col font-suit font-medium justify-center text-[18px] text-[#6b7280] text-center whitespace-nowrap">
                    <p className="leading-[20px]">더보기</p>
                  </div>
                  <div className="flex items-center justify-center shrink-0 w-[16px] h-[16px]">
                    <ArrowRightIcon width={14} height={14} stroke="#6b7280" />
                  </div>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-[12px] w-full">
                {mockLikedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#f9fafb] border border-[#eeeff1] flex flex-col h-[362px] items-center overflow-clip pb-[14px] rounded-[9.863px] w-[284px]"
                  >
                    <div className="flex gap-[10px] h-[48px] items-center justify-end px-[18px] py-[6px] w-full">
                      <div className="flex flex-1 items-center">
                        <div className="flex flex-col font-suit font-medium justify-center text-[16px] text-[#959ba9] whitespace-nowrap">
                          <p className="leading-[1.5]">{product.category}</p>
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
                          src={getImagePath(product.image)}
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
                        <p className="leading-[1.5] whitespace-pre-wrap">{product.price}원</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f6faff] h-[177px] overflow-clip relative rounded-[20px] w-full">
              <div className="absolute h-[177px] left-0 top-0 w-full">
                <Image
                  src={getImagePath('/images/mypageBanner.png')}
                  alt="Life Changing Robots"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute flex items-end justify-between left-[43px] top-[50px] w-[800px]">
                <div className="flex flex-col gap-[10px] items-start text-white w-[395px]">
                  <div className="flex flex-col font-suit font-light justify-center text-[36px] w-full">
                    <p className="leading-[normal] whitespace-pre-wrap">Life Changing Robots</p>
                  </div>
                  <div className="flex flex-col font-suit font-extralight justify-center text-[18px] tracking-[-0.54px] w-full">
                    <p className="leading-[normal] whitespace-pre-wrap">
                      사람과 로봇이 조화로운 일상, 그 새로운 시작을 함께합니다
                    </p>
                  </div>
                </div>
                <Link
                  href={ROUTES.PRODUCTS}
                  className="flex items-center justify-between py-[18px] w-[112px]"
                >
                  <div className="flex flex-col font-suit font-light justify-center text-[14px] text-center text-white whitespace-nowrap">
                    <p className="leading-[24px]">제품 둘러보기</p>
                  </div>
                  <div className="relative shrink-0 w-[28px] h-[28px]">
                    <ArrowRightWhiteIcon width={28} height={28} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
