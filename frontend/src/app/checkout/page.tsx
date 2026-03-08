'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AtIcon, ArrowDownIcon } from '@/components/ui/icons';
import { Divider } from '@/components/ui/Divider';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/utils/constants';
import { withBasePath } from '@/utils/assets';
import { apiFetch } from '@/lib/api';

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
  color: string;
  imageUrl: string;
}

interface CheckoutData {
  cartItemIds?: number[];
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
    zipCode: '',
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
  const [showEmailDomainDropdown, setShowEmailDomainDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressKeyword, setAddressKeyword] = useState('');
  const [addressResults, setAddressResults] = useState<{ zipCode: string; roadAddress: string; jibunAddress: string }[]>([]);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [isAddressSearching, setIsAddressSearching] = useState(false);
  const [tossClientKey, setTossClientKey] = useState('');
  const [showPaypalSection, setShowPaypalSection] = useState(false);
  const emailDomainRef = useRef<HTMLDivElement>(null);
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonsRenderedRef = useRef(false);
  const paypalAmountUsdRef = useRef(0);

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

    if (!document.querySelector('script[src*="tosspayments"]')) {
      const tossScript = document.createElement('script');
      tossScript.src = 'https://js.tosspayments.com/v2/standard';
      tossScript.async = true;
      document.head.appendChild(tossScript);
    }
  }, []);

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleAddressSearch = async () => {
    if (!addressKeyword.trim()) {
      alert('검색할 주소를 입력해 주세요.');
      return;
    }
    setIsAddressSearching(true);
    try {
      const res = await apiFetch<{
        data: { zipCode: string; roadAddress: string; jibunAddress: string }[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>(`/addresses/search?keyword=${encodeURIComponent(addressKeyword.trim())}&page=1&limit=20`);
      setAddressResults(res.data);
      setShowAddressDropdown(true);
    } catch {
      alert('주소 검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsAddressSearching(false);
    }
  };

  const handleAddressSelect = (result: { zipCode: string; roadAddress: string; jibunAddress: string }) => {
    setDeliveryInfo((prev) => ({
      ...prev,
      address: result.roadAddress || result.jibunAddress,
      zipCode: result.zipCode,
    }));
    setAddressKeyword(result.roadAddress || result.jibunAddress);
    setShowAddressDropdown(false);
    setAddressResults([]);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressDropdownRef.current && !addressDropdownRef.current.contains(event.target as Node)) {
        setShowAddressDropdown(false);
      }
    };

    if (showAddressDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddressDropdown]);

  const loadPaypalSdk = (clientId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).paypal) { resolve(); return; }
      const existing = document.querySelector('script[src*="paypal.com/sdk"]');
      if (existing) { existing.addEventListener('load', () => resolve()); return; }
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('PayPal SDK 로드 실패'));
      document.head.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!deliveryInfo.recipientName.trim()) { alert('받는 분 이름을 입력해 주세요.'); return; }
    if (!deliveryInfo.contact.trim()) { alert('연락처를 입력해 주세요.'); return; }
    if (!deliveryInfo.address.trim()) { alert('주소를 입력해 주세요.'); return; }

    const checkoutDataStr = localStorage.getItem('checkoutData');
    if (!checkoutDataStr) { alert('주문 정보를 찾을 수 없습니다. 장바구니로 돌아가 주세요.'); return; }

    let checkoutData: CheckoutData;
    try { checkoutData = JSON.parse(checkoutDataStr); } catch { alert('주문 정보를 불러오는 데 실패했습니다.'); return; }

    const cartItemIds: number[] = checkoutData.cartItemIds ?? [];
    if (cartItemIds.length === 0) { alert('주문할 상품이 없습니다.'); return; }

    const shippingAddress = {
      recipient: deliveryInfo.recipientName,
      phone: deliveryInfo.contact,
      address: [deliveryInfo.address, deliveryInfo.detailAddress].filter(Boolean).join(' '),
      zipCode: deliveryInfo.zipCode,
    };

    // 결제완료 페이지에서 배송지 표시를 위해 checkoutData에 deliveryInfo 저장
    localStorage.setItem('checkoutData', JSON.stringify({
      ...checkoutData,
      deliveryInfo: {
        recipientName: deliveryInfo.recipientName,
        contact: deliveryInfo.contact,
        address: deliveryInfo.address,
        detailAddress: deliveryInfo.detailAddress,
      },
    }));

    setIsSubmitting(true);
    try {
      const prepareRes = await apiFetch<{ data: { paymentOrderId: string; totalAmount: number } }>('/orders/prepare', {
        method: 'POST',
        body: JSON.stringify({ cartItemIds, shippingAddress, paymentMethod: selectedPaymentMethod }),
      });
      const { paymentOrderId, totalAmount } = prepareRes.data;

      localStorage.setItem('payPrepareData', JSON.stringify({
        paymentOrderId, totalAmount, shippingAddress,
        paymentMethod: selectedPaymentMethod, cartItemIds,
      }));

      if (selectedPaymentMethod === 'paypal') {
        let amountUsd = totalAmount / 1300;
        try {
          const rateRes = await apiFetch<{ data: { krwPerUsd: number } }>('/payments/exchange-rate');
          if (rateRes.data.krwPerUsd > 0) amountUsd = totalAmount / rateRes.data.krwPerUsd;
        } catch {}
        paypalAmountUsdRef.current = amountUsd;

        const paypalCfgRes = await apiFetch<{ data: { paypalClientId: string } }>('/payments/paypal-client-id');
        const { paypalClientId } = paypalCfgRes.data;
        if (!paypalClientId) { alert('PayPal 결제 설정이 없습니다.'); return; }

        await loadPaypalSdk(paypalClientId);
        paypalButtonsRenderedRef.current = false;
        setShowPaypalSection(true);

        setTimeout(() => {
          if (paypalButtonsRenderedRef.current || !(window as any).paypal || !paypalContainerRef.current) return;
          paypalContainerRef.current.innerHTML = '';

          (window as any).paypal.Buttons({
            createOrder: async () => {
              const res = await apiFetch<{ data: { paypalOrderId: string; amountUsd?: number } }>('/payments/paypal/create-order', {
                method: 'POST',
                body: JSON.stringify({ amountKrw: totalAmount }),
              });
              if (res.data.amountUsd != null) paypalAmountUsdRef.current = res.data.amountUsd;
              return res.data.paypalOrderId;
            },
            onApprove: async (data: { orderID: string }) => {
              const amountCents = Math.round(paypalAmountUsdRef.current * 100);
              try {
                const confirmRes = await apiFetch<{ data: { orderId: number } }>('/payments/confirm-and-create-order', {
                  method: 'POST',
                  body: JSON.stringify({
                    paymentProvider: 'paypal',
                    paymentKey: data.orderID,
                    amount: amountCents,
                    shippingAddress,
                    paymentMethod: 'paypal',
                    cartItemIds,
                  }),
                });
                const prev = JSON.parse(localStorage.getItem('payPrepareData') || '{}');
                localStorage.setItem('payPrepareData', JSON.stringify({ ...prev, orderId: confirmRes.data.orderId, confirmed: true }));
                router.push(ROUTES.CHECKOUT_COMPLETE);
              } catch {
                alert('PayPal 결제 확인 중 오류가 발생했습니다.');
              }
            },
            onError: () => { alert('PayPal 결제 중 오류가 발생했습니다.'); },
          }).render(paypalContainerRef.current);
          paypalButtonsRenderedRef.current = true;
        }, 100);

      } else {
        let key = tossClientKey;
        if (!key) {
          try {
            const cfgRes = await apiFetch<{ data: { tossClientKey: string } }>('/payments/toss-client-key');
            key = cfgRes.data.tossClientKey;
            setTossClientKey(key);
          } catch {}
        }
        if (!key) { alert('결제 키를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'); return; }

        if (typeof (window as any).TossPayments === 'undefined') {
          alert('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
          return;
        }

        const base = window.location.href.replace(/\/checkout.*/, '');
        const successUrl = `${base}/checkout/complete?success=1&provider=toss`;
        const failUrl = `${base}/checkout/complete?fail=1`;

        try {
          const tossPayments = (window as any).TossPayments(key);
          const payment = tossPayments.payment({ customerKey: (window as any).TossPayments.ANONYMOUS });
          await payment.requestPayment({
            method: 'CARD',
            amount: { currency: 'KRW', value: Math.round(Number(totalAmount)) },
            orderId: paymentOrderId,
            orderName: '유니콘 로봇 결제',
            successUrl,
            failUrl,
            customerName: deliveryInfo.recipientName,
            customerMobilePhone: deliveryInfo.contact.replace(/-/g, ''),
            card: { useEscrow: false, flowMode: 'DEFAULT', useCardPoint: false, useAppCardOnly: false },
          });
        } catch (e: any) {
          if (e?.code !== 'USER_CANCEL') {
            alert('결제창 열기에 실패했습니다. 다시 시도해 주세요.');
          }
        }
      }
    } catch {
      alert('결제 준비 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[50px] items-start pb-[150px] pt-[100px] px-[20px] md:px-[40px] lg:px-[60px] w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[152px] items-start w-full">
          <div className="flex flex-col gap-[50px] items-start w-full lg:w-[885px]">
            <div className="flex flex-col gap-[38px] items-start w-full">
              <div className="flex items-center w-full">
                <div className="flex flex-col items-start justify-center w-[50px] shrink-0">
                  <p className="font-suit font-extralight text-[48px] leading-[1.5] text-[#1f2937]">1</p>
                </div>
                <div className="flex flex-1 flex-col items-start min-w-0">
                  <h2 className="font-suit font-normal text-[32px] leading-[1.5] text-[#1f2937] mb-[8px]">
                    배송정보
                  </h2>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-suit font-light text-[16px] leading-[1.5] text-[#6b7280]">
                      배송정보를 확인하고 내용을 입력해 주세요.
                    </p>
                    <button className="font-suit font-light text-[16px] leading-[1.5] text-[#1f2937] underline hover:opacity-80 transition-opacity">
                      배송정보 추가
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[20px] items-start w-full">
                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start px-[4px] w-full">
                    <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      받는 분
                    </p>
                  </label>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="text"
                      value={deliveryInfo.recipientName}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, recipientName: e.target.value })}
                      placeholder="이름을 입력해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-normal text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start px-[4px] w-full">
                    <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      연락처
                    </p>
                  </label>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="tel"
                      value={deliveryInfo.contact}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, contact: e.target.value })}
                      placeholder="연락처를 입력해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-normal text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start w-full">
                    <p className="font-suit font-semibold text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      주소
                    </p>
                  </label>
                  <div className="relative w-full" ref={addressDropdownRef}>
                    <div className="flex gap-[10px] h-[48px] items-center w-full">
                      <div className="flex flex-1 flex-col gap-[6px] items-start min-w-0">
                        <input
                          type="text"
                          value={addressKeyword}
                          onChange={(e) => setAddressKeyword(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddressSearch(); }}
                          placeholder="주소를 검색해 주세요"
                          className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-normal text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                        />
                      </div>
                      <button
                        onClick={handleAddressSearch}
                        disabled={isAddressSearching}
                        className="bg-white border border-[#3f7bfc] flex h-[48px] items-center justify-center px-[16px] py-[10px] rounded-[4px] shrink-0 hover:opacity-80 transition-opacity disabled:opacity-50"
                      >
                        <p className="font-suit font-semibold text-[14px] leading-[1.35] text-[#3f7bfc] whitespace-nowrap">
                          {isAddressSearching ? '검색 중...' : '주소 검색'}
                        </p>
                      </button>
                    </div>
                    {showAddressDropdown && addressResults.length > 0 && (
                      <div className="absolute top-full left-0 mt-[4px] bg-white border border-[#e5e7eb] rounded-[6px] shadow-lg z-20 w-full max-h-[240px] overflow-y-auto">
                        {addressResults.map((result, index) => (
                          <button
                            key={index}
                            onClick={() => handleAddressSelect(result)}
                            className="w-full flex flex-col items-start px-[16px] py-[10px] hover:bg-[#f3f4f6] transition-colors border-b border-[#e5e7eb] last:border-b-0 first:rounded-t-[6px] last:rounded-b-[6px]"
                          >
                            <p className="font-suit font-normal text-[14px] leading-[1.5] text-[#374151] text-left">
                              {result.roadAddress}
                            </p>
                            {result.jibunAddress && result.jibunAddress !== result.roadAddress && (
                              <p className="font-suit font-normal text-[12px] leading-[1.5] text-[#9ca3af] text-left">
                                {result.jibunAddress}
                              </p>
                            )}
                            {result.zipCode && (
                              <p className="font-suit font-normal text-[12px] leading-[1.5] text-[#6b7280]">
                                우편번호: {result.zipCode}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {showAddressDropdown && addressResults.length === 0 && !isAddressSearching && (
                      <div className="absolute top-full left-0 mt-[4px] bg-white border border-[#e5e7eb] rounded-[6px] shadow-lg z-20 w-full px-[16px] py-[12px]">
                        <p className="font-suit font-normal text-[14px] text-[#9ca3af]">검색 결과가 없습니다.</p>
                      </div>
                    )}
                  </div>
                  {deliveryInfo.address && (
                    <div className="flex items-center gap-[8px] w-full px-[4px]">
                      <p className="font-suit font-normal text-[14px] leading-[1.5] text-[#6b7280]">
                        {deliveryInfo.zipCode && `[${deliveryInfo.zipCode}] `}{deliveryInfo.address}
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="text"
                      value={deliveryInfo.detailAddress}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, detailAddress: e.target.value })}
                      placeholder="상세주소를 입력해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-normal text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <label className="flex gap-[2px] items-start px-[4px] w-full">
                    <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                      배송 요청사항
                    </p>
                  </label>
                  <div className="flex flex-col gap-[6px] items-start w-full">
                    <input
                      type="text"
                      value={deliveryInfo.shippingRequest}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, shippingRequest: e.target.value })}
                      placeholder="배송 시 요청사항을 입력해 주세요"
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-normal text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#abb0ba] border-none outline-none"
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
                  <p className="font-suit font-extralight text-[48px] leading-[1.5] text-[#1f2937]">2</p>
                </div>
                <div className="flex flex-1 flex-col items-start min-w-0">
                  <h2 className="font-suit font-normal text-[32px] leading-[1.5] text-[#1f2937] mb-[8px]">
                    결제방법
                  </h2>
                  <p className="font-suit font-light text-[16px] leading-[1.5] text-[#6b7280]">
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
                          src={withBasePath('/images/paypal.png')}
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
                            ? 'font-semibold text-white'
                            : 'font-normal text-[#747d8d]'
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
                      <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                        카드번호
                      </p>
                    </label>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      <input
                        type="text"
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                        placeholder="16자리 입력"
                        className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-[14px] items-center w-full">
                    <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                      <label className="flex gap-[2px] items-start px-[4px] w-full">
                        <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                          유효기간
                        </p>
                      </label>
                      <div className="flex flex-col gap-[6px] items-start w-full">
                        <input
                          type="text"
                          value={cardInfo.expiryDate}
                          onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: e.target.value })}
                          placeholder="MM/YY"
                          className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                      <label className="flex gap-[2px] items-start px-[4px] w-full">
                        <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                          CVC
                        </p>
                      </label>
                      <div className="flex flex-col gap-[6px] items-start w-full">
                        <input
                          type="text"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                          placeholder="000"
                          className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                      <label className="flex gap-[2px] items-start px-[4px] w-full">
                        <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                          비밀번호
                        </p>
                      </label>
                      <div className="flex flex-col gap-[6px] items-start w-full">
                        <input
                          type="password"
                          value={cardInfo.password}
                          onChange={(e) => setCardInfo({ ...cardInfo, password: e.target.value })}
                          placeholder="앞 2자리"
                          className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
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
                      <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                        입금 은행
                      </p>
                    </label>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      <input
                        type="text"
                        placeholder="은행을 선택해주세요"
                        className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[8px] items-start w-full">
                    <label className="flex gap-[2px] items-start px-[4px] w-full">
                      <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                        입금 계좌번호
                      </p>
                    </label>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      <input
                        type="text"
                        placeholder="계좌번호를 입력해주세요"
                        className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'phone' && (
                <div className="flex flex-col gap-[20px] items-start w-full">
                  <div className="flex flex-col gap-[8px] items-start w-full">
                    <label className="flex gap-[2px] items-start px-[4px] w-full">
                      <p className="font-suit font-normal text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
                        휴대폰 번호
                      </p>
                    </label>
                    <div className="flex flex-col gap-[6px] items-start w-full">
                      <input
                        type="tel"
                        placeholder="010-0000-0000"
                        className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
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
                  <p className="font-suit font-semibold text-[18px] leading-[1.5] text-[#374151] whitespace-nowrap">
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
                      className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full font-suit font-medium text-[16px] leading-[1.35] text-[#374151] placeholder:text-[#bac2d0] border-none outline-none"
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
                      <p className="font-suit font-medium text-[16px] leading-[1.35] text-[#bac2d0]">
                        {deliveryInfo.emailDomain || '선택'}
                      </p>
                      <div className="flex items-center justify-center p-[1.667px] rounded-[6.667px] shrink-0 size-[20px]">
                        <ArrowDownIcon
                          width={8.333}
                          height={8.333}
                          fill="#bac2d0"
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
                            <p className="font-suit font-medium text-[16px] leading-[1.35] text-[#bac2d0] whitespace-nowrap">
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
              <h2 className="font-suit font-medium text-[24px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
                Order Summary
              </h2>
              <div className="h-[1px] w-full bg-[#e5e7eb]" />
              <div className="flex flex-col gap-[16px] items-end w-full">
                <div className="flex items-center justify-between w-full">
                  <p className="font-suit font-light text-[20px] leading-[1.5] text-[#6b7280]">
                    총 상품 가격
                  </p>
                  <p className="font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937]">
                    {new Intl.NumberFormat('ko-KR').format(totalProductPrice)}원
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="font-suit font-light text-[20px] leading-[1.5] text-[#6b7280]">
                    배송비
                  </p>
                  <p className="font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937]">
                    {new Intl.NumberFormat('ko-KR').format(shippingFee)}원
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="font-suit font-light text-[20px] leading-[1.5] text-[#6b7280]">
                    총 할인율
                  </p>
                  <p className="font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937]">
                    {new Intl.NumberFormat('ko-KR').format(discount)}원
                  </p>
                </div>
              </div>
              <div className="h-[1px] w-full bg-[#e5e7eb]" />
              <div className="flex items-center justify-between w-full">
                <p className="font-suit font-light text-[20px] leading-[1.5] text-[#6b7280]">
                  총 결제 예상 금액
                </p>
                <p className="font-suit font-semibold text-[32px] leading-[1.5] text-[#1f2937]">
                  {new Intl.NumberFormat('ko-KR').format(totalPrice)}원
                </p>
              </div>
              <button
                disabled={isSubmitting}
                onClick={handlePayment}
                className="bg-[#1f2937] flex h-[65px] items-center justify-center px-[32px] py-[12px] rounded-[10px] w-full hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <p className="font-suit font-semibold text-[24px] leading-[1.5] text-white text-center whitespace-nowrap">
                  {isSubmitting ? '결제 준비 중...' : `${new Intl.NumberFormat('ko-KR').format(totalPrice)}원 결제하기`}
                </p>
              </button>
              {showPaypalSection && (
                <div className="flex flex-col gap-[12px] w-full pt-[4px]">
                  <p className="font-suit font-normal text-[14px] leading-[1.5] text-[#6b7280]">
                    아래 PayPal 버튼을 클릭하여 결제를 완료해 주세요.
                  </p>
                  <div ref={paypalContainerRef} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-[22px] items-start w-full">
              <h3 className="font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
                구매 진행중인 상품({orderItems.length})
              </h3>
              <div className="flex flex-col gap-[16px] items-start w-full">
                {orderItems.length > 0 ? (
                  orderItems.map((item, index) => (
                    <div key={item.id} className='w-full'>
                      <div className="flex gap-[10px] items-center w-full">
                        <div className="bg-[#f9fafb] flex items-center justify-center rounded-[12px] shrink-0 w-[104px] h-[104px]">
                          {item.imageUrl ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={item.imageUrl.startsWith('http') ? item.imageUrl : withBasePath(item.imageUrl)}
                                alt={item.name}
                                fill
                                unoptimized
                                className="object-cover rounded-[12px]"
                              />
                            </div>
                          ) : (
                            <span className="font-cardo font-medium text-[12px] text-[#1f2937]">UNICORN</span>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col h-[104px] items-start justify-between min-w-0">
                          <div className="flex flex-col items-start w-full">
                            <div className="flex items-center w-full">
                              <h4 className="flex-1 font-suit font-normal text-[20px] leading-[1.5] text-[#1f2937] truncate">
                                {item.name}
                              </h4>
                            </div>
                            <div className="flex gap-[8px] items-center">
                              <p className="font-suit font-normal text-[14px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                                수량 {item.quantity}
                              </p>
                              <Divider orientation="vertical" />
                              <p className="font-suit font-normal text-[14px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                                {item.color?.split('/')[0] ?? ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-end justify-end w-full">
                            <p className="font-suit font-medium text-[20px] leading-[1.5] text-[#1f2937] whitespace-nowrap">
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
                  <p className="font-suit font-light text-[16px] text-[#959ba9]">
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
