'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { LikeIcon, LikeIconFilled } from '@/components/ui/icons';
import { MinusIcon, PlusIcon } from '@/components/ui/icons';
import { WeightIcon, HeightIcon, TimeIcon, BatteryIcon, SpeedIcon } from '@/components/ui/icons';
import { withBasePath } from '@/utils/assets';

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

export const ProductDetailClient = () => {
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
      <div className="flex flex-col gap-[84px] items-start pb-[150px] pt-[60px] px-[20px] md:px-[32px] lg:px-[45px] w-full max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row flex-wrap gap-[22.5px] items-start w-full max-w-[1350px]">
          <div className="flex flex-col gap-[6px] items-start w-full lg:w-[892.5px]">
            <div className="aspect-[3665/2062] relative rounded-[9px] w-full overflow-hidden">
              <Image
                src={withBasePath(mockProduct.images[selectedImageIndex])}
                alt={mockProduct.name}
                fill
                unoptimized
                className="object-cover rounded-[9px]"
              />
            </div>
            <div className="flex items-center justify-start w-full gap-[9px] overflow-x-auto">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative rounded-[6px] overflow-hidden shrink-0 w-[122.25px] h-[105.75px] ${
                    index === selectedImageIndex
                      ? 'border-[1.5px] border-[#1f2937]'
                      : 'border border-[#eaeaea]'
                  }`}
                >
                  <Image
                    src={withBasePath(image)}
                    alt={`${mockProduct.name} ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[46.5px] lg:gap-[245.25px] items-start w-full lg:w-[435px]">
            <div className="flex flex-col gap-[30px] lg:gap-[46.5px] items-start w-full">
              <div className="flex flex-col gap-[15px] items-start w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-1 gap-[2px] items-center min-w-0">
                    <p className="font-suit font-light text-[16px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                      {mockProduct.category}
                    </p>
                    <div className="w-[12px] h-[12px] relative shrink-0">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 3L8 6L4 9"
                          stroke="#959ba9"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="font-suit font-light text-[16px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
                      {mockProduct.subCategory}
                    </p>
                  </div>
                  <div className="flex items-center justify-center px-[8px] py-[2px] rounded-[99px] shrink-0">
                    <p className="font-suit font-bold text-[15px] leading-[1.5] text-[#4b5563] whitespace-nowrap">
                      {mockProduct.companyName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <h1 className="flex flex-1 flex-col font-suit font-normal justify-center max-h-[108px] min-w-0 overflow-hidden text-[24px] text-[#1f2937] text-ellipsis">
                    <span className="leading-[1.5] whitespace-pre-wrap">{mockProduct.name}</span>
                  </h1>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="flex items-center justify-center rounded-[10.667px] w-[24px] h-[24px] hover:opacity-80 transition-opacity"
                    aria-label={isLiked ? '좋아요 취소' : '좋아요'}
                  >
                    {isLiked ? (
                      <LikeIconFilled width={21} height={18} fill="#1F2937" stroke="#1F2937" />
                    ) : (
                      <LikeIcon width={21} height={18} stroke="#1F2937" strokeWidth={0.6875} />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-[10px] items-start w-full">
                <div className="flex items-center py-[6px] w-full">
                  <p className="font-suit font-normal text-[15px] leading-[1.5] text-[#6b7280] whitespace-nowrap">
                    COLOR(3)
                  </p>
                </div>
                <div className="relative w-full" ref={colorDropdownRef}>
                  <button
                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                    className="bg-[#f9fafb] border border-[#e5e7eb] flex items-center px-[15px] py-[10.5px] rounded-[10px] w-full hover:opacity-80 transition-opacity"
                  >
                    <div className="flex gap-[12px] items-center min-w-0 flex-1">
                      <div
                        className="rounded-full shrink-0 w-[24.75px] h-[24.75px] border"
                        style={{
                          backgroundColor: selectedColorData?.value,
                          borderColor: selectedColorData?.borderColor,
                        }}
                      />
                      <p className="flex-1 font-suit font-normal text-[15px] leading-[1.35] text-[#374151] text-left text-ellipsis overflow-hidden whitespace-pre-wrap max-h-[40.5px]">
                        {selectedColorData?.name}
                      </p>
                    </div>
                    <div
                      className={`ml-[12px] flex items-center justify-center p-[1.333px] rounded-[5.333px] w-[16px] h-[16px] shrink-0 transition-transform ${
                        showColorDropdown ? 'rotate-180' : ''
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M0.4375 0.4375L4.9375 5.4375L9.4375 0.4375"
                          stroke="#4B5563"
                          strokeWidth="0.875"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
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
                          className="w-full bg-[#f9fafb] border-b border-[#e5e7eb] last:border-b-0 flex items-center justify-between px-[15px] py-[10.5px] hover:bg-[#f3f4f6] transition-colors first:rounded-t-[10px] last:rounded-b-[10px]"
                        >
                          <div className="flex gap-[12px] items-center min-w-0 flex-1">
                            <div
                              className="rounded-full shrink-0 w-[24.75px] h-[24.75px] border"
                              style={{
                                backgroundColor: color.value,
                                borderColor: color.borderColor,
                              }}
                            />
                            <p className="flex-1 font-suit font-normal text-[15px] leading-[1.35] text-[#374151] text-ellipsis overflow-hidden whitespace-pre-wrap">
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
              <div className="flex gap-[4.5px] h-[30px] items-center justify-end w-full text-[#111827]">
                <p className="flex flex-1 flex-col font-suit font-bold justify-center min-w-0 text-[28.5px] text-right">
                  <span className="leading-[30px] whitespace-pre-wrap">{formattedPrice}</span>
                </p>
                <p className="flex flex-col font-suit font-normal justify-center shrink-0 text-[24px] whitespace-nowrap">
                  <span className="leading-[30px]">₩</span>
                </p>
              </div>
              <div className="flex flex-col gap-[21px] items-end w-full">
                <div className="flex flex-col sm:flex-row gap-[12px] items-stretch sm:items-center w-full">
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] flex gap-[10.156px] h-[48.75px] items-center justify-center px-[14.219px] py-[8.125px] rounded-[8.125px] shrink-0 self-center sm:self-auto">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="flex items-center justify-center w-[16.25px] h-[16.25px] shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <MinusIcon width={12} height={1} stroke="#6b7280" strokeWidth={1} />
                    </button>
                    <p className="font-suit font-medium text-[16.25px] leading-[1.35] text-[#6b7280] text-center shrink-0">
                      {quantity}
                    </p>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="flex items-center justify-center w-[16.25px] h-[16.25px] shrink-0 hover:opacity-80 transition-opacity"
                    >
                      <PlusIcon width={15} height={15} stroke="#6b7280" strokeWidth={1.5} />
                    </button>
                  </div>
                  <button className="flex flex-1 h-[48.75px] items-center justify-center px-[24px] sm:px-[24px] py-[9px] bg-[#f9fafb] border-[0.5px] border-[#e5e7eb] rounded-[7.5px] hover:opacity-80 transition-opacity">
                    <p className="font-suit font-normal text-[15px] leading-[1.3] text-[#6c6c6c] text-center whitespace-nowrap">
                      장바구니
                    </p>
                  </button>
                  <button className="flex flex-1 h-[48.75px] items-center justify-center px-[24px] sm:px-[24px] py-[9px] bg-black rounded-[7.5px] hover:opacity-90 transition-opacity">
                    <p className="font-suit font-semibold text-[15px] leading-[1.3] text-white text-center whitespace-nowrap">
                      구매하기
                    </p>
                  </button>
                </div>
                <div className="flex flex-col md:flex-row font-suit font-light items-start md:items-end justify-between px-[3px] w-full text-[13.5px] text-[#959ba9] gap-[10px] md:gap-0">
                  <div className="flex flex-col gap-[3.75px] items-start w-full md:w-[223.5px]">
                    <p className="leading-[normal] whitespace-pre-wrap">부가세가 포함된 가격입니다.</p>
                    <p className="leading-[normal] whitespace-pre-wrap">추후 배송 관련 안내사항 들어갈 부분</p>
                  </div>
                  <button className="font-suit font-light text-[15px] text-[#374151] underline hover:opacity-80 transition-opacity whitespace-nowrap shrink-0">
                    문의하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-between px-[2px] w-full gap-[20px] lg:gap-0">
          <h2 className="flex flex-col font-suit font-normal justify-center text-[24px] text-[#1f2937] w-full lg:w-[73.5px] shrink-0">
            <span className="leading-[normal] whitespace-pre-wrap">Details</span>
          </h2>
          <div className="flex flex-wrap gap-[20px] md:gap-[40px] lg:gap-[40.5px] items-center px-[9px] py-[7.5px] w-full lg:w-[1041px]">
            <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
              <div className="overflow-clip shrink-0 w-[42px] h-[42px]">
                <WeightIcon width={42} height={42} stroke="#959BA9" strokeWidth={2} fill="#959BA9" />
              </div>
              <div className="flex flex-col gap-[7.5px] items-start min-w-0 flex-1 lg:w-[195px]">
                <p className="font-suit font-medium text-[15px] leading-[1.2] text-[#959ba9] w-full">
                  무게
                </p>
                <p className="font-suit font-semibold text-[18px] leading-[1.5] text-[#374151] w-full">
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
              <div className="overflow-clip shrink-0 w-[42px] h-[42px] flex items-center justify-center">
                <HeightIcon width={18} height={36} stroke="#959BA9" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-[7.5px] items-start min-w-0 flex-1 lg:w-[195px]">
                <p className="font-suit font-medium text-[15px] leading-[1.2] text-[#959ba9] w-full">
                  높이
                </p>
                <p className="font-suit font-semibold text-[18px] leading-[1.5] text-[#374151] w-full">
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
              <div className="overflow-clip shrink-0 w-[42px] h-[42px]">
                <TimeIcon width={42} height={42} stroke="#959BA9" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-[7.5px] items-start min-w-0 flex-1 lg:w-[195px]">
                <p className="font-suit font-medium text-[15px] leading-[1.2] text-[#959ba9] w-full">
                  작동 시간
                </p>
                <p className="font-suit font-semibold text-[18px] leading-[1.5] text-[#374151] w-full">
                  {mockProduct.details.workingTime}
                </p>
              </div>
            </div>
            <div className="flex gap-[20px] md:gap-[40px] items-center shrink-0 min-w-0">
              <div className="overflow-clip shrink-0 w-[42px] h-[42px]">
                <BatteryIcon width={42} height={42} stroke="#959BA9" strokeWidth={2} fill="#959BA9" />
              </div>
              <div className="flex flex-col gap-[7.5px] items-start min-w-0 flex-1 lg:w-[195px]">
                <p className="font-suit font-medium text-[15px] leading-[1.2] text-[#959ba9] w-full">
                  배터리
                </p>
                <p className="font-suit font-semibold text-[18px] leading-[1.5] text-[#374151] w-full">
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
              <div className="overflow-clip shrink-0 w-[42px] h-[42px]">
                <SpeedIcon width={42} height={42} stroke="#959BA9" strokeWidth={2} fill="#959BA9" />
              </div>
              <div className="flex flex-col gap-[7.5px] items-start min-w-0 flex-1 lg:w-[195px]">
                <p className="font-suit font-medium text-[15px] leading-[1.2] text-[#959ba9] w-full">
                  속도
                </p>
                <p className="font-suit font-semibold text-[18px] leading-[1.5] text-[#374151] w-full">
                  {mockProduct.details.speed}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-between px-[6px] w-full text-[#1f2937] gap-[20px] lg:gap-0">
          <h2 className="flex flex-col font-suit font-normal justify-center text-[24px] whitespace-nowrap shrink-0">
            <span className="leading-[normal]">About</span>
          </h2>
          <p className="font-suit font-thin leading-[1.5] text-[16.5px] tracking-[-0.495px] w-full lg:w-[1036.5px] whitespace-pre-wrap">
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
            <p className="font-suit font-light text-[20px] leading-[1.5] text-[#959ba9] text-center whitespace-nowrap">
              {mockProduct.videoTitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
