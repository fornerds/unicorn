import Image from 'next/image';
import Link from 'next/link';
import { BoxIcon, ShippingIcon, CheckIcon, DomesticArrivalIcon, CustomsIcon, DeliveryTruckIcon, StepDotIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';
import { withBasePath } from '@/utils/assets';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
  ];
}

const ORDER_STEPS = [
  { id: 1, label: '결제 완료', icon: BoxIcon, active: true },
  { id: 2, label: '배송 시작', icon: ShippingIcon, active: true },
  { id: 3, label: '국내 도착', icon: DomesticArrivalIcon, active: true },
  { id: 4, label: '수입 통관', icon: CustomsIcon, active: false },
  { id: 5, label: '배송 중', icon: DeliveryTruckIcon, active: false },
  { id: 6, label: '배송 완료', icon: CheckIcon, active: false },
];

const mockOrderItems = [
  {
    id: 1,
    name: 'AURA_AI 가사 휴머노이드',
    quantity: 1,
    color: '화이트',
    price: 1780000,
    image: '/images/product01.png',
  },
  {
    id: 2,
    name: 'AURA_AI 가사 휴머노이드',
    quantity: 1,
    color: '화이트',
    price: 1780000,
    image: '/images/product01.png',
  },
];

const mockShippingAddress = {
  name: '홍길동',
  phone: '010-1212-3434',
  address: '대전광역시 중구 대종로372번길 22 / 부사동 1층 (35027)',
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const orderNumber = '230988739';
  const orderDate = '2026.01.03';
  const totalProductPrice = 3560000;
  const shippingFee = 100000;
  const discount = 0;
  const totalPrice = totalProductPrice + shippingFee - discount;

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col items-center px-[20px] md:px-[40px] lg:px-[60px] xl:px-[213px] py-[100px] md:py-[120px] lg:py-[150px] w-full max-w-[1920px] mx-auto">
        <div className="flex flex-col gap-[90px] items-start w-full max-w-[580px]">
          <div className="flex flex-col gap-[12px] items-start w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-[10px] items-center text-[14px] text-[#959ba9]">
                <div className="flex gap-[4px] items-center justify-center leading-[20px]">
                  <p className="font-suit font-semibold">주문번호</p>
                  <p className="font-suit font-medium">{orderNumber}</p>
                </div>
                <div className="flex flex-col font-suit font-semibold justify-center whitespace-nowrap">
                  <p className="leading-[1.5]">|</p>
                </div>
                <div className="flex flex-col font-suit font-semibold justify-center whitespace-nowrap">
                  <p className="leading-[1.5]">{orderDate}</p>
                </div>
              </div>
              <Link
                href={ROUTES.CONTACT}
                className="flex h-[36px] items-center justify-center hover:opacity-80 transition-opacity"
              >
                <p className="font-suit font-semibold text-[14px] text-[#959ba9] leading-[1.5] underline">
                  취소문의
                </p>
              </Link>
            </div>
            <h1 className="font-suit font-medium text-[32px] text-[#1f2937] leading-[1.35] w-full">
              주문 상세
            </h1>
          </div>

          <div className="flex flex-col gap-[8px] items-start w-full">
            <div className="flex flex-col items-start px-[42px] py-[10px] w-full">
              <div className="flex items-start w-full relative">
                {ORDER_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.active;
                  const isLast = index === ORDER_STEPS.length - 1;
                  const nextStep = !isLast ? ORDER_STEPS[index + 1] : null;
                  const nextIsActive = nextStep ? nextStep.active : false;
                  const bothActive = isActive && nextIsActive;
                  const iconColor = isActive ? '#374151' : '#BAC2D0';
                  const textColor = isActive ? 'text-[#374151]' : 'text-[#BAC2D0]';
                  const dotColor = isActive ? '#374151' : '#BAC2D0';
                  const isCustomsIcon = step.id === 4;

                  return (
                    <div key={step.id} className="flex items-start flex-1 relative">
                      <div className="flex flex-col gap-[8px] items-center shrink-0 w-[60px] relative">
                        <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: '-18px', transform: 'translate(-50%, -50%)' }}>
                          <StepDotIcon width={9} height={9} stroke={dotColor} strokeWidth={1.5} fill="white" />
                        </div>
                        <div className="flex items-center justify-center w-[24px] h-[24px]">
                          {isCustomsIcon ? (
                            <Icon width={24} height={24} stroke={iconColor} strokeWidth={1.5} fill="white" />
                          ) : (
                            <Icon width={24} height={24} stroke={iconColor} strokeWidth={1.5} />
                          )}
                        </div>
                        <p className={`font-suit font-medium text-[16px] leading-[1.35] text-center min-w-full ${textColor}`}>
                          {step.label}
                        </p>
                      </div>
                      {!isLast && (
                        <div className="flex flex-1 items-start min-w-0 relative">
                          {bothActive ? (
                            <div
                              className="absolute"
                              style={{
                                top: '-18px',
                                left: '-30px',
                                width: 'calc(100% + 60px)',
                                height: '1.5px',
                                background: '#374151',
                              }}
                            />
                          ) : (
                            <div
                              className="absolute h-0"
                              style={{
                                top: '-18px',
                                left: '-30px',
                                width: 'calc(100% + 60px)',
                                borderTop: '1.5px dashed #BAC2D0',
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[70px] items-start w-full">
            <div className="flex flex-col gap-[18px] items-start w-full">
              <h2 className="font-suit font-medium text-[22px] text-[#1f2937] leading-[1.5]">
                주문 상품
              </h2>
              <div className="flex flex-col gap-[16px] items-start w-full">
                {mockOrderItems.map((item, index) => (
                  <div key={item.id} className="w-full">
                    <div className="flex gap-[10px] items-center w-full">
                      <div className="bg-[#f9fafb] flex items-center rounded-[12px] shrink-0">
                        <div className="relative w-[104px] h-[104px]">
                          <Image
                            src={withBasePath(item.image)}
                            alt={item.name}
                            fill
                            className="object-cover rounded-[12px]"
                            unoptimized
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col h-[104px] items-start justify-between">
                        <div className="flex flex-col items-start w-full">
                          <div className="flex items-center w-full">
                            <p className="flex-1 font-suit font-medium text-[20px] text-[#1f2937] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                              {item.name}
                            </p>
                          </div>
                          <div className="flex gap-[8px] items-center">
                            <p className="font-suit font-medium text-[14px] text-[#959ba9] leading-[1.5] whitespace-nowrap">
                              수량 {item.quantity}
                            </p>
                            <div className="flex h-[13px] items-center justify-center w-0">
                              <div className="flex-none rotate-90">
                                <div className="h-0 w-[13px] border-t border-[#959ba9]" />
                              </div>
                            </div>
                            <p className="font-suit font-medium text-[14px] text-[#959ba9] leading-[1.5] whitespace-nowrap">
                              {item.color}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-end justify-end w-full">
                          <p className="font-suit font-semibold text-[20px] text-[#1f2937] leading-[1.5]">
                            {item.price.toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    </div>
                    {index < mockOrderItems.length - 1 && (
                      <div className="h-0 w-full border-t border-[#E5E7EB] mt-[16px]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[18px] items-start w-full">
              <h2 className="font-suit font-medium text-[22px] text-[#1f2937] leading-[1.5]">
                배송지
              </h2>
              <div className="flex flex-col gap-[6px] items-start px-[2px] text-[#4b5563] w-full">
                <p className="font-suit font-medium text-[20px] leading-[24px] max-w-[400px] overflow-hidden text-ellipsis">
                  {mockShippingAddress.name}
                </p>
                <p className="font-suit font-medium text-[16px] leading-[20px] max-w-[400px] overflow-hidden text-ellipsis">
                  {mockShippingAddress.phone}
                </p>
                <p className="font-suit font-medium text-[16px] leading-[20px]">
                  {mockShippingAddress.address}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[18px] items-start rounded-[16px] w-full">
              <h2 className="font-suit font-medium text-[22px] text-[#1f2937] leading-[1.5]">
                결제 금액
              </h2>
              <div className="flex flex-col gap-[10px] items-start px-[2px] w-full">
                <div className="flex flex-col gap-[2px] items-end text-[18px] w-full whitespace-nowrap">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-suit font-regular text-[#959ba9] leading-[1.5]">
                      총 상품 가격
                    </p>
                    <p className="font-suit font-semibold text-[#1f2937] leading-[1.5]">
                      {totalProductPrice.toLocaleString()}원
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-suit font-regular text-[#959ba9] leading-[1.5]">
                      배송비
                    </p>
                    <p className="font-suit font-semibold text-[#1f2937] leading-[1.5]">
                      {shippingFee.toLocaleString()}원
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-suit font-regular text-[#959ba9] leading-[1.5]">
                      총 할인율
                    </p>
                    <p className="font-suit font-semibold text-[#1f2937] leading-[1.5]">
                      {discount.toLocaleString()}원
                    </p>
                  </div>
                </div>
                <div className="h-0 w-full border-t border-[#E5E7EB]" />
                <div className="flex items-center justify-between text-[#1f2937] w-full whitespace-nowrap">
                  <p className="font-suit font-semibold text-[20px] leading-[1.5]">
                    총 결제 금액
                  </p>
                  <p className="font-suit font-bold text-[28px] leading-[1.5]">
                    {totalPrice.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
