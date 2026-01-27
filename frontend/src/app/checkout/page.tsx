'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AtIcon, ArrowDownIcon } from '@/components/ui/icons';
import { Divider } from '@/components/ui/Divider';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/utils/constants';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'paypal' | 'bank' | 'phone';
}

const paymentMethods: PaymentMethod[] = [
  { id: 'card', name: '신용/체크카드', type: 'card' },
  { id: 'bank', name: '계좌이체', type: 'bank' },
  { id: 'phone', name: '휴대폰 결제', type: 'phone' },
  { id: 'paypal', name: 'PayPal', type: 'paypal' },
];

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
}

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState({
    recipientName: '',
    contact: '',
    address: '',
    detailAddress: '',
    shippingRequest: '',
    email: '',
    emailDomain: '',
  });
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    password: '',
  });
  const [showExpiryDropdown, setShowExpiryDropdown] = useState(false);
  const [showCvvDropdown, setShowCvvDropdown] = useState(false);
  const [showEmailDomainDropdown, setShowEmailDomainDropdown] = useState(false);
  const emailDomainRef = useRef<HTMLDivElement>(null);
  const postcodeRef = useRef<HTMLDivElement>(null);

  const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'hanmail.net', '직접 입력'];

  useEffect(() => {
    const checkoutDataStr = localStorage.getItem('checkoutData');
    if (checkoutDataStr) {
      try {
        const checkoutData: CheckoutData = JSON.parse(checkoutDataStr);
        setOrderItems(checkoutData.items);
        setTotalProductPrice(checkoutData.totalProductPrice);
        setShippingFee(checkoutData.shippingFee);
        setDiscount(checkoutData.discount);
        setTotalPrice(checkoutData.totalPrice);
      } catch (error) {
        console.error('Failed to parse checkout data:', error);
      }
    }

    // 다음 Postcode API 스크립트 로드
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleAddressSearch = () => {
    if (typeof window === 'undefined' || !(window as any).daum) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new (window as any).daum.Postcode({
      oncomplete: (data: any) => {
        let addr = '';
        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        setDeliveryInfo((prev) => ({
          ...prev,
          address: addr,
        }));
      },
      width: '100%',
      height: '100%',
    }).open();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emailDomainRef.current && !emailDomainRef.current.contains(event.target as Node)) {
        setShowEmailDomainDropdown(false);
      }
    };

    if (showEmailDomainDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmailDomainDropdown]);

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[50px] items-start pb-[150px] pt-[100px] px-[20px] md:px-[40px] lg:px-[60px] w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[152px] items-start w-full">
          <div className="flex flex-col gap-[50px] items-start w-full lg:w-[885px]">
            <div className="flex flex-col gap-[38px] items-start w-full">
              <div className="flex items-center w-full">
                <div className="flex flex-col items-start justify-center w-[50px] shrink-0">
                  <p className="font-suit font-light text-[48px] leading-[1.5] text-[#1f2937]">1</p>
                </div>
                <div className="flex flex-1 flex-col items-start min-w-0">
                  <h2 className="font-suit font-medium text-[32px] leading-[1.5] text-[#1f2937] mb-[8px]">
                    배송정보
                  </h2>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-suit font-normal text-[16px] leading-[1.5] text-[#6b7280]">
                      배송정보를 확인하고 내용을 입력해 주세요.
                    </p>
                    <button className="font-suit font-normal text-[16px] leading-[1.5] text-[#1f2937] underline hover:opacity-80 transition-opacity">
                      배송정보 추가
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[20px] items-start w-full">
                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start px-[4px] w-full">
                    <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      받는 분
                    </p>
                  </label>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="text"
                      value={deliveryInfo.recipientName}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, recipientName: e.target.value })}
                      placeholder="이름을 입력해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start px-[4px] w-full">
                    <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      연락처
                    </p>
                  </label>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="tel"
                      value={deliveryInfo.contact}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, contact: e.target.value })}
                      placeholder="연락처를 입력해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start w-full">
                    <p className="font-suit font-bold text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      주소
                    </p>
                  </label>
                  <div className="flex gap-[10px] h-[48px] items-center w-full">
                    <div className="flex flex-1 flex-col gap-[6px] items-start min-w-0">
                      <input
                        type="text"
                        value={deliveryInfo.address}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                        placeholder="주소를 검색해 주세요"
                        className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                      />
                    </div>
                    <button
                      onClick={handleAddressSearch}
                      className="bg-white border border-[#3f7bfc] flex h-[48px] items-center justify-center px-[16px] py-[10px] rounded-[4px] shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <p className="font-suit font-bold text-[14px] leading-[1.35] text-[#3f7bfc] whitespace-nowrap">
                        주소 검색
                      </p>
                    </button>
                  </div>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="text"
                      value={deliveryInfo.detailAddress}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, detailAddress: e.target.value })}
                      placeholder="상세주소를 입력해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start px-[4px] w-full">
                    <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      배송 요청사항
                    </p>
                  </label>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="text"
                      value={deliveryInfo.shippingRequest}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, shippingRequest: e.target.value })}
                      placeholder="배송 시 요청사항을 입력해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[60px] w-full">
              <div className="h-[1px] w-full bg-[#e5e7eb]" />
            </div>

            <div className="flex flex-col gap-[38px] items-start w-full">
              <div className="flex items-center w-full">
                <div className="flex flex-col items-start justify-center w-[50px] shrink-0">
                  <p className="font-suit font-light text-[48px] leading-[1.5] text-[#1f2937]">2</p>
                </div>
                <div className="flex flex-1 flex-col items-start min-w-0">
                  <h2 className="font-suit font-medium text-[32px] leading-[1.5] text-[#1f2937] mb-[8px]">
                    결제방법
                  </h2>
                  <p className="font-suit font-normal text-[16px] leading-[1.5] text-[#6b7280]">
                    결제방법을 선택해 주세요.
                  </p>
                </div>
              </div>

              <div className="flex items-center w-full flex-wrap gap-[6px]">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentMethodChange(method.id)}
                    className={cn(
                      'flex h-[65px] items-center justify-center px-[32px] py-[12px] rounded-[10px] shrink-0 transition-colors',
                      method.type === 'paypal' ? 'w-[199px]' : 'w-[220px]',
                      selectedPaymentMethod === method.id
                        ? 'bg-[#1f2937]'
                        : 'bg-[#f9fafb] border-[0.5px] border-[#e5e7eb]'
                    )}
                  >
                    {method.type === 'paypal' ? (
                      <div className="h-[26px] w-[119px] relative">
                        <Image
                          src="/images/paypal.png"
                          alt="PayPal"
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <p
                        className={cn(
                          'font-suit text-[20px] leading-[1.3] text-center whitespace-nowrap',
                          selectedPaymentMethod === method.id
                            ? 'font-bold text-white'
                            : 'font-medium text-[#747d8d]'
                        )}
                      >
                        {method.name}
                      </p>
                    )}
                  </button>
                ))}
              </div>

              {selectedPaymentMethod === 'card' && (
                <div className="flex flex-col gap-[20px] items-start w-full">
                  <div className="flex flex-col gap-[8px] items-start w-full">
                    <label className="flex gap-[2px] items-start px-[4px] w-full">
                      <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                        카드번호
                      </p>
                    </label>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      <input
                        type="text"
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                        placeholder="16자리 입력"
                        className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-semibold text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-[14px] items-center w-full">
                    <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                      <label className="flex gap-[2px] items-start px-[4px] w-full">
                        <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                          유효기간
                        </p>
                      </label>
                      <div className="flex flex-col gap-[6px] items-start w-full">
                        <input
                          type="text"
                          value={cardInfo.expiryDate}
                          onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: e.target.value })}
                          placeholder="MM/YY"
                          className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-semibold text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                      <label className="flex gap-[2px] items-start px-[4px] w-full">
                        <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                          CVC
                        </p>
                      </label>
                      <div className="flex flex-col gap-[6px] items-start w-full">
                        <input
                          type="text"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                          placeholder="000"
                          className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-semibold text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                      <label className="flex gap-[2px] items-start px-[4px] w-full">
                        <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                          비밀번호
                        </p>
                      </label>
                      <div className="flex flex-col gap-[6px] items-start w-full">
                        <input
                          type="password"
                          value={cardInfo.password}
                          onChange={(e) => setCardInfo({ ...cardInfo, password: e.target.value })}
                          placeholder="앞 2자리"
                          className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-semibold text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'bank' && (
                <div className="flex flex-col gap-[20px] items-start w-full">
                  <div className="flex flex-col gap-[8px] items-start w-full">
                    <label className="flex gap-[2px] items-start px-[4px] w-full">
                      <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                        입금 은행
                      </p>
                    </label>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      <input
                        type="text"
                        placeholder="은행을 선택해주세요"
                        className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-semibold text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[8px] items-start w-full">
                    <label className="flex gap-[2px] items-start px-[4px] w-full">
                      <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                        입금 계좌번호
                      </p>
                    </label>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      <input
                        type="text"
                        placeholder="계좌번호를 입력해주세요"
                        className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-semibold text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'phone' && (
                <div className="flex flex-col gap-[20px] items-start w-full">
                  <div className="flex flex-col gap-[8px] items-start w-full">
                    <label className="flex gap-[2px] items-start px-[4px] w-full">
                      <p className="font-suit font-medium text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                        휴대폰 번호
                      </p>
                    </label>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      <input
                        type="tel"
                        placeholder="010-0000-0000"
                        className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-semibold text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="h-[60px] w-full">
                <div className="h-[1px] w-full bg-[#e5e7eb]" />
              </div>

              <div className="flex flex-col gap-[8px] items-start w-full">
                <label className="flex gap-[2px] items-start w-full">
                  <p className="font-suit font-bold text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                    결제정보를 받을 이메일
                  </p>
                </label>
                <div className="flex gap-[10px] items-center w-full">
                  <div className="flex flex-1 flex-col gap-[6px] items-start min-w-0 max-w-[389px]">
                    <input
                      type="text"
                      value={deliveryInfo.email}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, email: e.target.value })}
                      placeholder="이메일 주소"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-semibold text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-center p-[5.002px] shrink-0 size-[24px]">
                    <AtIcon width={20} height={20} fill="#4B5563" />
                  </div>
                  <div className="relative w-[393px] shrink-0" ref={emailDomainRef}>
                    <button
                      onClick={() => setShowEmailDomainDropdown(!showEmailDomainDropdown)}
                      className="bg-[#f9fafb] flex h-[48px] w-full items-center justify-between pl-[16px] pr-[12px] py-[16px] rounded-[6px] hover:opacity-80 transition-opacity"
                    >
                      <p className="font-suit font-semibold text-[16px] leading-[1.35] text-[#bac2d0]">
                        {deliveryInfo.emailDomain || '선택'}
                      </p>
                      <div className="flex items-center justify-center p-[1.667px] rounded-[6.667px] shrink-0 size-[20px]">
                        <ArrowDownIcon
                          width={8.333}
                          height={8.333}
                          stroke="#bac2d0"
                          strokeWidth={1.5}
                          className={cn('transition-transform', showEmailDomainDropdown && 'rotate-180')}
                        />
                      </div>
                    </button>
                    {showEmailDomainDropdown && (
                      <div className="absolute top-full left-0 mt-[8px] bg-white border border-[#e5e7eb] rounded-[6px] shadow-lg z-10 w-full">
                        {emailDomains.map((domain) => (
                          <button
                            key={domain}
                            onClick={() => {
                              setDeliveryInfo({ ...deliveryInfo, emailDomain: domain === '직접 입력' ? '' : domain });
                              setShowEmailDomainDropdown(false);
                            }}
                            className="w-full bg-[#f9fafb] border-b border-[#e5e7eb] last:border-b-0 flex items-center px-[16px] py-[10px] hover:bg-[#f3f4f6] transition-colors first:rounded-t-[6px] last:rounded-b-[6px]"
                          >
                            <p className="font-suit font-semibold text-[16px] leading-[1.35] text-[#bac2d0] whitespace-nowrap">
                              {domain}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[90px] items-start shrink-0 w-full lg:w-[457px]">
            <div className="flex flex-col gap-[26px] items-start rounded-[16px] shrink-0 w-full">
              <h2 className="font-suit font-semibold text-[24px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
                Order Summary
              </h2>
              <div className="h-[1px] w-full bg-[#e5e7eb]" />
              <div className="flex flex-col gap-[16px] items-end w-full">
                <div className="flex items-center justify-between w-full">
                  <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#6b7280]">
                    총 상품 가격
                  </p>
                  <p className="font-suit font-semibold text-[20px] leading-[1.5] text-[#1f2937]">
                    {new Intl.NumberFormat('ko-KR').format(totalProductPrice)}원
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#6b7280]">
                    배송비
                  </p>
                  <p className="font-suit font-semibold text-[20px] leading-[1.5] text-[#1f2937]">
                    {new Intl.NumberFormat('ko-KR').format(shippingFee)}원
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#6b7280]">
                    총 할인율
                  </p>
                  <p className="font-suit font-semibold text-[20px] leading-[1.5] text-[#1f2937]">
                    {new Intl.NumberFormat('ko-KR').format(discount)}원
                  </p>
                </div>
              </div>
              <div className="h-[1px] w-full bg-[#e5e7eb]" />
              <div className="flex items-center justify-between w-full">
                <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#6b7280]">
                  총 결제 예상 금액
                </p>
                <p className="font-suit font-bold text-[32px] leading-[1.5] text-[#1f2937]">
                  {new Intl.NumberFormat('ko-KR').format(totalPrice)}원
                </p>
              </div>
              <button
                onClick={() => {
                  const checkoutDataStr = localStorage.getItem('checkoutData');
                  if (checkoutDataStr) {
                    try {
                      const checkoutData = JSON.parse(checkoutDataStr);
                      const updatedCheckoutData = {
                        ...checkoutData,
                        deliveryInfo: {
                          recipientName: deliveryInfo.recipientName,
                          contact: deliveryInfo.contact,
                          address: deliveryInfo.address,
                          detailAddress: deliveryInfo.detailAddress,
                        },
                      };
                      localStorage.setItem('checkoutData', JSON.stringify(updatedCheckoutData));
                      router.push(ROUTES.CHECKOUT_COMPLETE);
                    } catch (error) {
                      console.error('Failed to update checkout data:', error);
                    }
                  }
                }}
                className="bg-[#1f2937] flex h-[65px] items-center justify-center px-[32px] py-[12px] rounded-[10px] w-full hover:opacity-90 transition-opacity"
              >
                <p className="font-suit font-bold text-[24px] leading-[1.5] text-white text-center whitespace-nowrap">
                  {new Intl.NumberFormat('ko-KR').format(totalPrice)}원 결제하기
                </p>
              </button>
            </div>

            <div className="flex flex-col gap-[22px] items-start w-full">
              <h3 className="font-suit font-semibold text-[20px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
                구매 진행중인 상품({orderItems.length})
              </h3>
              <div className="flex flex-col gap-[16px] items-start w-full">
                {orderItems.length > 0 ? (
                  orderItems.map((item, index) => (
                    <div key={item.id} className='w-full'>
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
                              <h4 className="flex-1 font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937] truncate">
                                {item.name}
                              </h4>
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
                      {index < orderItems.length - 1 && (
                        <div className="h-[1px] w-full bg-[#e5e7eb] mt-[16px]" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="font-suit font-normal text-[16px] text-[#959ba9]">
                    주문할 상품이 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
