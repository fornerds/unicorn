'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Divider } from '@/components/ui/Divider';
import { ROUTES } from '@/utils/constants';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor: {
    id: string;
    name: string;
    value: string;
    borderColor: string;
  };
  imageUrl: string;
  category: string;
  subCategory: string;
  companyName: string;
}

interface CheckoutData {
  items: OrderItem[];
  totalProductPrice: number;
  shippingFee: number;
  discount: number;
  totalPrice: number;
  deliveryInfo?: {
    recipientName: string;
    contact: string;
    address: string;
    detailAddress: string;
  };
}

export default function CheckoutCompletePage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<CheckoutData | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    const checkoutDataStr = localStorage.getItem('checkoutData');
    if (checkoutDataStr) {
      try {
        const checkoutData: CheckoutData = JSON.parse(checkoutDataStr);
        setOrderData(checkoutData);
        const orderNum = `23-${Math.floor(Math.random() * 1000000)}`;
        setOrderNumber(orderNum);
      } catch (error) {
        console.error('Failed to parse checkout data:', error);
        router.push(ROUTES.HOME);
      }
    } else {
      router.push(ROUTES.HOME);
    }
  }, [router]);

  const handleGoHome = () => {
    localStorage.removeItem('checkoutData');
    router.push(ROUTES.HOME);
  };

  if (!orderData) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="font-suit font-medium text-[24px] text-[#959ba9]">로딩 중...</p>
      </div>
    );
  }

  const fullAddress = orderData.deliveryInfo
    ? `${orderData.deliveryInfo.address} ${orderData.deliveryInfo.detailAddress}`
    : '';

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[100px] items-start pb-[150px] pt-[242px] px-[20px] md:px-[40px] lg:px-[60px] w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col gap-[100px] items-start w-full max-w-[580px] mx-auto">
          <div className="flex h-[48px] items-center justify-center w-full">
            <h1 className="font-suit font-semibold text-[32px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
              결제가 완료되었습니다!
            </h1>
          </div>

          <div className="flex flex-col gap-[22px] items-start w-full">
            <div className="flex items-center justify-between w-full">
              <h2 className="font-suit font-semibold text-[24px] leading-[1.5] text-[#1f2937]">
                주문 상품({orderData.items.length})
              </h2>
              <p className="font-suit font-medium text-[16px] leading-[1.5] text-[#959ba9]">
                주문번호 {orderNumber}
              </p>
            </div>

            <div className="flex flex-col gap-[16px] items-start w-full">
              {orderData.items.map((item, index) => (
                <div key={item.id} className="w-full">
                  <div className="flex gap-[10px] items-center w-full">
                    <div className="bg-[#f9fafb] flex items-center rounded-[12px] shrink-0 w-[104px] h-[104px]">
                      <div className="relative w-full h-full">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover rounded-[12px]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col h-[104px] items-start justify-between min-w-0">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center w-full">
                          <h3 className="flex-1 font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937] truncate">
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex gap-[8px] items-center">
                          <p className="font-suit font-medium text-[14px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                            수량 {item.quantity}
                          </p>
                          <Divider orientation="vertical" />
                          <p className="font-suit font-medium text-[14px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                            {item.selectedColor.name.split('/')[0]}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-end w-full">
                        <p className="font-suit font-semibold text-[20px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
                          {new Intl.NumberFormat('ko-KR').format(item.price * item.quantity)}원
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < orderData.items.length - 1 && (
                    <div className="h-[1px] w-full bg-[#e5e7eb] mt-[16px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[20px] items-start w-full">
            <div className="flex items-center justify-between w-full">
              <h2 className="font-suit font-semibold text-[24px] leading-[1.5] text-[#1f2937]">
                배송지
              </h2>
              <button className="font-suit font-medium text-[16px] leading-[1.5] text-[#959ba9] underline hover:opacity-80 transition-opacity">
                배송지 변경
              </button>
            </div>
            <div className="flex flex-col gap-[10px] items-start w-full">
              {orderData.deliveryInfo ? (
                <>
                  <p className="font-suit font-semibold text-[20px] leading-[24px] text-[#4b5563] max-w-[400px] truncate">
                    {orderData.deliveryInfo.recipientName}
                  </p>
                  <p className="font-suit font-medium text-[16px] leading-[20px] text-[#959ba9] max-w-[400px] truncate">
                    {orderData.deliveryInfo.contact}
                  </p>
                  <p className="font-suit font-medium text-[16px] leading-[20px] text-[#4b5563]">
                    {fullAddress}
                  </p>
                </>
              ) : (
                <p className="font-suit font-medium text-[16px] leading-[20px] text-[#959ba9]">
                  배송지 정보가 없습니다.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[26px] items-start rounded-[16px] w-full">
            <h2 className="font-suit font-semibold text-[24px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
              결제 금액
            </h2>
            <div className="flex flex-col gap-[16px] items-start w-full">
              <div className="flex flex-col gap-[10px] items-end w-full">
                <div className="flex items-center justify-between w-full">
                  <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#6b7280]">
                    총 상품 가격
                  </p>
                  <p className="font-suit font-semibold text-[20px] leading-[1.5] text-[#1f2937]">
                    {new Intl.NumberFormat('ko-KR').format(orderData.totalProductPrice)}원
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#6b7280]">
                    배송비
                  </p>
                  <p className="font-suit font-semibold text-[20px] leading-[1.5] text-[#1f2937]">
                    {new Intl.NumberFormat('ko-KR').format(orderData.shippingFee)}원
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#6b7280]">
                    총 할인율
                  </p>
                  <p className="font-suit font-semibold text-[20px] leading-[1.5] text-[#1f2937]">
                    {new Intl.NumberFormat('ko-KR').format(orderData.discount)}원
                  </p>
                </div>
              </div>
              <div className="h-[1px] w-full bg-[#e5e7eb]" />
              <div className="flex items-center justify-between w-full">
                <p className="font-suit font-semibold text-[20px] leading-[1.5] text-[#374151]">
                  총 결제 금액
                </p>
                <p className="font-suit font-bold text-[32px] leading-[1.5] text-[#1f2937]">
                  {new Intl.NumberFormat('ko-KR').format(orderData.totalPrice)}원
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleGoHome}
            className="bg-[#1f2937] flex h-[65px] items-center justify-center px-[32px] py-[12px] rounded-[10px] w-full hover:opacity-90 transition-opacity"
          >
            <p className="font-suit font-bold text-[24px] leading-[1.5] text-white text-center whitespace-nowrap">
              홈으로
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
