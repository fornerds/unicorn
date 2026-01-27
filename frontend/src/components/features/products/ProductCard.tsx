'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import { LikeIcon, LikeIconFilled } from '@/components/ui/icons';
import { useState } from 'react';
import { withBasePath } from '@/utils/assets';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  subCategory: string;
  companyName: string;
  isLiked?: boolean;
}

export const ProductCard = ({
  id,
  name,
  price,
  imageUrl,
  category,
  subCategory,
  companyName,
  isLiked: initialIsLiked = false,
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const formattedPrice = new Intl.NumberFormat('ko-KR').format(price);

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      HOME: 'Home',
      FIREFIGHTING: 'FIREFIGHTING',
      INDUSTRIAL: 'INDUSTRIAL',
      MEDICAL: 'MEDICAL',
      LOGISTICS: 'LOGISTICS',
    };
    return categoryMap[category] || category;
  };

  return (
    <Link
      href={ROUTES.PRODUCT_DETAIL(id)}
      className="bg-[#f9fafb] flex flex-col items-center overflow-hidden pb-[36px] pt-[16px] px-[24px] rounded-[8px] shrink-0 w-[490px] hover:opacity-95 transition-opacity"
    >
      <div className="flex flex-col gap-[20px] items-start w-full">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-1 gap-[2px] items-center min-w-0">
            <p className="font-suit font-medium text-[16px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
              {getCategoryDisplayName(category)}
            </p>
            <div className="w-[8px] h-[8px] relative shrink-0">
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 0.5L5.5 4L2.5 7.5"
                  stroke="#959ba9"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="font-suit font-medium text-[16px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
              {subCategory}
            </p>
          </div>
          <div className="flex items-center justify-center px-[8px] py-[2px] rounded-[99px] shrink-0">
            <p className="font-suit font-extrabold text-[16px] leading-[1.5] text-[#4b5563] whitespace-nowrap">
              {companyName}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end px-[10px] w-[442px]">
          <button
            onClick={handleLikeClick}
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
      <div className="flex h-[390px] items-center justify-center w-full">
        <div className="h-[390px] relative w-[442px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute h-[77.14%] left-[15.99%] top-[11.4%] w-[68.06%]">
              <Image
                src={withBasePath(imageUrl)}
                alt={name}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col font-suit font-medium h-[100px] items-center justify-between text-center w-full">
        <h3 className="flex flex-col justify-center overflow-hidden text-[28px] text-[#1f2937] text-ellipsis w-full whitespace-nowrap">
          <span className="leading-[1.5] overflow-hidden">{name}</span>
        </h3>
        <p className="flex flex-col justify-center text-[22px] text-[#959ba9] w-full">
          <span className="leading-[1.5] whitespace-pre-wrap">{formattedPrice}원</span>
        </p>
      </div>
    </Link>
  );
};
