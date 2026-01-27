'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { LikeIcon, LikeIconFilled } from '@/components/ui/icons';
import { MinusIcon, PlusIcon } from '@/components/ui/icons';
import { WeightIcon, HeightIcon, TimeIcon, BatteryIcon, SpeedIcon } from '@/components/ui/icons';
import { ArrowDownIcon } from '@/components/ui/icons';

const mockProduct = {
  id: '1',
  name: 'AURA_AI 가사 휴머노이드',
  price: 85000000,
  category: 'Home',
  subCategory: 'Human',
  companyName: 'Unitree',
  isLiked: false,
  images: [
    '/images/detail01.png',
    '/images/detail02.png',
    '/images/detail03.png',
    '/images/detail04.png',
  ],
  colors: [
    { id: '1', name: '라이트블루/Light Blue', value: '#e6edfc', borderColor: '#c2c9d9' },
    { id: '2', name: '다크그레이/Dark Gray', value: '#4b5563', borderColor: '#374151' },
    { id: '3', name: '화이트/White', value: '#ffffff', borderColor: '#e5e7eb' },
  ],
  details: {
    weight: '450Kg',
    height: '180cm',
    battery: '8시간',
    speed: '5km/h',
    workingTime: '24시간',
  },
  description: `AURA는 첨단 기술과 따뜻한 감성이 결합된 미래형 가정용 휴머노이드 로봇입니다. 기존의 산업용 로봇이나 차가운 기계적 디자인에서 완전히 벗어나, 사용자의 생활 공간과 정서에 완벽하게 조화되도록 설계된 AURA는 단순한 기기가 아닌, 배려하는 가족 구성원을 목표로 합니다. AURA는 첨단 AI 기반의 AURA OS를 탑재하여 가정 내에서의 역할을 수행합니다. 단순 반복 작업을 넘어, 사용자 개개인의 생활 패턴과 요구 사항을 학습하고 예측하는 개인 맞춤형 서비스를 제공합니다.`,
  videoTitle: '가사 보조 로봇 MediBot Pro 실제 작동 영상',
  videoUrl: 'https://www.youtube.com/embed/LTYMWadOW7c?si=pY9NmZ0WB8aY8kh4',
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0].id);
  const [quantity, setQuantity] = useState(100);
  const [isLiked, setIsLiked] = useState(mockProduct.isLiked);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  const selectedColorData = mockProduct.colors.find((c) => c.id === selectedColor);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setShowColorDropdown(false);
      }
    };

    if (showColorDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorDropdown]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const formattedPrice = new Intl.NumberFormat('ko-KR').format(mockProduct.price);

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col gap-[113px] items-start pb-[150px] pt-[20px] px-[20px] md:px-[40px] lg:px-[60px] w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row flex-wrap gap-[30px] items-start w-full">
          <div className="flex flex-col gap-[8px] items-start w-full lg:w-[calc(66.11%-15px)] lg:max-w-[1190px]">
            <div className="aspect-[3665/2062] relative rounded-[12px] w-full overflow-hidden">
              <Image
                src={mockProduct.images[selectedImageIndex]}
                alt={mockProduct.name}
                fill
                className="object-cover rounded-[12px]"
              />
            </div>
            <div className="flex items-center justify-start w-full gap-[10px] overflow-x-auto">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative rounded-[8px] overflow-hidden shrink-0 ${
                    index === selectedImageIndex
                      ? 'border-2 border-[#1f2937]'
                      : 'border border-[#eaeaea]'
                  }`}
                  style={{ 
                    width: 'clamp(120px, 13.7vw, 163px)', 
                    height: index % 2 === 0 ? 'clamp(100px, 12.2vw, 139px)' : 'clamp(102px, 12.4vw, 141px)' 
                  }}
                >
                  <Image
                    src={image}
                    alt={`${mockProduct.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[40px] lg:gap-[327px] items-start w-full lg:w-[calc(33.89%-15px)] lg:max-w-[580px]">
            <div className="flex flex-col gap-[40px] lg:gap-[62px] items-start w-full">
              <div className="flex flex-col gap-[20px] items-start w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-1 gap-[2px] items-center min-w-0">
                    <p className="font-suit font-normal text-[22px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                      {mockProduct.category}
                    </p>
                    <div className="w-[16px] h-[16px] relative shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 4L10 8L5 12"
                          stroke="#959ba9"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="font-suit font-normal text-[22px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                      {mockProduct.subCategory}
                    </p>
                  </div>
                  <div className="flex items-center justify-center px-[8px] py-[2px] rounded-[99px] shrink-0">
                    <p className="font-suit font-extrabold text-[20px] leading-[1.5] text-[#4b5563] whitespace-nowrap">
                      {mockProduct.companyName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <h1 className="flex flex-1 flex-col font-suit font-medium justify-center max-h-[144px] min-w-0 overflow-hidden text-[32px] text-[#1f2937] text-ellipsis">
                    <span className="leading-[1.5] whitespace-pre-wrap">{mockProduct.name}</span>
                  </h1>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="flex items-center justify-center rounded-[10.667px] w-[32px] h-[32px] hover:opacity-80 transition-opacity"
                    aria-label={isLiked ? '좋아요 취소' : '좋아요'}
                  >
                    {isLiked ? (
                      <LikeIconFilled width={29} height={25} fill="#1F2937" stroke="#1F2937" />
                    ) : (
                      <LikeIcon width={29} height={25} stroke="#1F2937" strokeWidth={0.6875} />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-[10px] items-start w-full">
                <div className="flex items-center py-[6px] w-full">
                  <p className="font-suit font-medium text-[20px] leading-[1.5] text-[#6b7280] whitespace-nowrap">
                    COLOR(3)
                  </p>
                </div>
                <div className="relative w-full" ref={colorDropdownRef}>
                  <button
                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                    className="bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-between px-[20px] py-[14px] rounded-[10px] w-full hover:opacity-80 transition-opacity"
                  >
                    <div className="flex gap-[16px] items-center min-w-0 flex-1">
                      <div
                        className="rounded-full shrink-0 w-[33px] h-[33px] border"
                        style={{
                          backgroundColor: selectedColorData?.value,
                          borderColor: selectedColorData?.borderColor,
                        }}
                      />
                      <p className="flex-1 font-suit font-medium text-[20px] leading-[1.35] text-[#374151] text-ellipsis overflow-hidden whitespace-pre-wrap max-h-[54px]">
                        {selectedColorData?.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-center p-[1.333px] rounded-[5.333px] w-[16px] h-[16px] shrink-0">
                      <ArrowDownIcon
                        width={10.667}
                        height={5.333}
                        stroke="#374151"
                        strokeWidth={1.5}
                        className={`transition-transform ${showColorDropdown ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>
                  {showColorDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-[8px] bg-white border border-[#e5e7eb] rounded-[10px] shadow-lg z-10">
                      {mockProduct.colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => {
                            setSelectedColor(color.id);
                            setShowColorDropdown(false);
                          }}
                          className="w-full bg-[#f9fafb] border-b border-[#e5e7eb] last:border-b-0 flex items-center justify-between px-[20px] py-[14px] hover:bg-[#f3f4f6] transition-colors first:rounded-t-[10px] last:rounded-b-[10px]"
                        >
                          <div className="flex gap-[16px] items-center min-w-0 flex-1">
                            <div
                              className="rounded-full shrink-0 w-[33px] h-[33px] border"
                              style={{
                                backgroundColor: color.value,
                                borderColor: color.borderColor,
                              }}
                            />
                            <p className="flex-1 font-suit font-medium text-[20px] leading-[1.35] text-[#374151] text-ellipsis overflow-hidden whitespace-pre-wrap">
                              {color.name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[40px] items-end w-full">
              <div className="flex gap-[6px] h-[40px] items-center justify-end w-full text-[#111827]">
                <p className="flex flex-1 flex-col font-suit font-extrabold justify-center min-w-0 text-[38px] text-right">
                  <span className="leading-[40px] whitespace-pre-wrap">{formattedPrice}</span>
                </p>
                <p className="flex flex-col font-suit font-medium justify-center shrink-0 text-[32px] whitespace-nowrap">
                  <span className="leading-[40px]">₩</span>
                </p>
              </div>
              <div className="flex flex-col gap-[21px] items-end w-full">
                <div className="flex flex-col sm:flex-row gap-[12px] items-stretch sm:items-center w-full">
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] flex gap-[13.542px] h-[65px] items-center justify-center px-[18.958px] py-[10.833px] rounded-[10.833px] shrink-0 self-center sm:self-auto">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="flex items-center justify-center w-[21.667px] h-[21.667px] shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <MinusIcon width={12} height={1} stroke="#6b7280" strokeWidth={1} />
                    </button>
                    <p className="font-suit font-semibold text-[21.67px] leading-[1.35] text-[#6b7280] text-center shrink-0">
                      {quantity}
                    </p>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="flex items-center justify-center w-[21.667px] h-[21.667px] shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <PlusIcon width={15} height={15} stroke="#6b7280" strokeWidth={1.5} />
                    </button>
                  </div>
                  <button className="flex flex-1 h-[65px] items-center justify-center px-[20px] sm:px-[32px] py-[12px] bg-[#f9fafb] border-[0.5px] border-[#e5e7eb] rounded-[10px] hover:opacity-80 transition-opacity">
                    <p className="font-suit font-medium text-[18px] sm:text-[20px] leading-[1.3] text-[#6c6c6c] text-center whitespace-nowrap">
                      장바구니
                    </p>
                  </button>
                  <button className="flex flex-1 h-[65px] items-center justify-center px-[20px] sm:px-[32px] py-[12px] bg-black rounded-[10px] hover:opacity-90 transition-opacity">
                    <p className="font-suit font-bold text-[18px] sm:text-[20px] leading-[1.3] text-white text-center whitespace-nowrap">
                      구매하기
                    </p>
                  </button>
                </div>
                <div className="flex flex-col md:flex-row font-suit font-normal items-start md:items-end justify-between px-[4px] w-full text-[18px] text-[#959ba9] gap-[10px] md:gap-0">
                  <div className="flex flex-col gap-[5px] items-start w-full md:w-[298px]">
                    <p className="leading-[normal] whitespace-pre-wrap">부가세가 포함된 가격입니다.</p>
                    <p className="leading-[normal] whitespace-pre-wrap">추후 배송 관련 안내사항 들어갈 부분</p>
                  </div>
                  <button className="font-suit font-normal text-[20px] text-[#374151] underline hover:opacity-80 transition-opacity whitespace-nowrap shrink-0">
                    문의하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-between px-[2px] w-full gap-[20px] lg:gap-0">
          <h2 className="flex flex-col font-suit font-medium justify-center text-[32px] text-[#1f2937] w-full lg:w-[98px] shrink-0">
            <span className="leading-[normal] whitespace-pre-wrap">Details</span>
          </h2>
          <div className="flex flex-wrap gap-[20px] md:gap-[40px] lg:gap-[54px] items-center px-[12px] py-[10px] w-full lg:w-[calc(100%-98px-54px)]">
            <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
              <div className="overflow-clip shrink-0 w-[56px] h-[56px]">
                <WeightIcon width={56} height={56} stroke="#959BA9" strokeWidth={2} fill="#959BA9" />
              </div>
              <div className="flex flex-col gap-[10px] items-start min-w-0 flex-1 lg:w-[260px]">
                <p className="font-suit font-semibold text-[20px] leading-[1.2] text-[#959ba9] w-full">
                  무게
                </p>
                <p className="font-suit font-bold text-[24px] leading-[1.5] text-[#374151] w-full">
                  {mockProduct.details.weight}
                </p>
              </div>
            </div>
            <div className="hidden lg:flex h-[103px] items-center justify-center shrink-0 w-0">
              <div className="flex-none rotate-90">
                <div className="h-0 w-[103px] border-t border-[#e5e7eb]" />
              </div>
            </div>
            <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
              <div className="overflow-clip shrink-0 w-[56px] h-[56px] flex items-center justify-center">
                <HeightIcon width={18} height={47} stroke="#959BA9" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-[10px] items-start min-w-0 flex-1 lg:w-[260px]">
                <p className="font-suit font-semibold text-[20px] leading-[1.2] text-[#959ba9] w-full">
                  높이
                </p>
                <p className="font-suit font-bold text-[24px] leading-[1.5] text-[#374151] w-full">
                  {mockProduct.details.height}
                </p>
              </div>
            </div>
            <div className="hidden lg:flex h-[103px] items-center justify-center shrink-0 w-0">
              <div className="flex-none rotate-90">
                <div className="h-0 w-[103px] border-t border-[#e5e7eb]" />
              </div>
            </div>
            <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
              <div className="overflow-clip shrink-0 w-[56px] h-[56px]">
                <TimeIcon width={56} height={56} stroke="#959BA9" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-[10px] items-start min-w-0 flex-1 lg:w-[260px]">
                <p className="font-suit font-semibold text-[20px] leading-[1.2] text-[#959ba9] w-full">
                  작동 시간
                </p>
                <p className="font-suit font-bold text-[24px] leading-[1.5] text-[#374151] w-full">
                  {mockProduct.details.workingTime}
                </p>
              </div>
            </div>
            <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
              <div className="overflow-clip shrink-0 w-[56px] h-[56px]">
                <BatteryIcon width={56} height={56} stroke="#959BA9" strokeWidth={2} fill="#959BA9" />
              </div>
              <div className="flex flex-col gap-[10px] items-start min-w-0 flex-1 lg:w-[260px]">
                <p className="font-suit font-semibold text-[20px] leading-[1.2] text-[#959ba9] w-full">
                  배터리
                </p>
                <p className="font-suit font-bold text-[24px] leading-[1.5] text-[#374151] w-full">
                  {mockProduct.details.battery}
                </p>
              </div>
            </div>
            <div className="hidden lg:flex h-[103px] items-center justify-center shrink-0 w-0">
              <div className="flex-none rotate-90">
                <div className="h-0 w-[103px] border-t border-[#e5e7eb]" />
              </div>
            </div>
            <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
              <div className="overflow-clip shrink-0 w-[56px] h-[56px]">
                <SpeedIcon width={56} height={56} stroke="#959BA9" strokeWidth={2} fill="#959BA9" />
              </div>
              <div className="flex flex-col gap-[10px] items-start min-w-0 flex-1 lg:w-[260px]">
                <p className="font-suit font-semibold text-[20px] leading-[1.2] text-[#959ba9] w-full">
                  속도
                </p>
                <p className="font-suit font-bold text-[24px] leading-[1.5] text-[#374151] w-full">
                  {mockProduct.details.speed}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-between px-[6px] w-full text-[#1f2937] gap-[20px] lg:gap-0">
          <h2 className="flex flex-col font-suit font-medium justify-center text-[32px] whitespace-nowrap shrink-0">
            <span className="leading-[normal]">About</span>
          </h2>
          <p className="font-suit font-extralight leading-[1.5] text-[18px] md:text-[20px] lg:text-[22px] tracking-[-0.66px] w-full lg:w-[calc(100%-98px-20px)] whitespace-pre-wrap">
            {mockProduct.description}
          </p>
        </div>

        <div className="flex flex-col items-start w-full">
          <div className="relative w-full rounded-[12px] overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src={mockProduct.videoUrl}
              title={mockProduct.videoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="flex items-center justify-center p-[10px] w-full">
            <p className="font-suit font-normal text-[20px] leading-[1.5] text-[#959ba9] text-center whitespace-nowrap">
              {mockProduct.videoTitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
