'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import { LikeIcon, LikeIconFilled } from '@/components/ui/icons';
import { useState } from 'react';
import { withBasePath } from '@/utils/assets';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { LoginModal } from '@/components/ui/LoginModal';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: string;
  companyName: string;
  isLiked?: boolean;
  onLikeToggle?: (id: string, liked: boolean) => void;
}

export const ProductCard = ({
  id,
  name,
  price,
  imageUrl,
  category,
  companyName,
  isLiked: initialIsLiked = false,
  onLikeToggle,
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (isLikeLoading) return;

    // 낙관적 업데이트
    const prevLiked = isLiked;
    setIsLiked(!isLiked);
    setIsLikeLoading(true);

    try {
      const res = await apiFetch<{ data: { likesCount: number; liked: boolean } }>(
        `/products/${id}/like`,
        { method: 'POST' },
      );
      setIsLiked(res.data.liked);
      onLikeToggle?.(id, res.data.liked);
    } catch {
      // 실패 시 롤백
      setIsLiked(prevLiked);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('ko-KR').format(price);

  return (
    <>
    <LoginModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      message={'회원만 이용 가능한 서비스입니다.\n로그인하시겠습니까?'}
    />
    <Link
      href={ROUTES.PRODUCT_DETAIL(id)}
      className="bg-[#f9fafb] flex flex-col items-center overflow-hidden pb-[36px] pt-[16px] px-[24px] rounded-[8px] shrink-0 w-[367px] hover:opacity-95 transition-opacity"
    >
      <div className="flex flex-col gap-[20px] items-start w-full">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-1 gap-[2px] items-center min-w-0">
            <p className="font-suit font-medium text-[14px] leading-[1.5] text-[#959ba9] whitespace-nowrap">
              {category}
            </p>
          </div>
          <div className="flex items-center justify-center px-[8px] py-[2px] rounded-[99px] shrink-0">
            <p className="font-suit font-extrabold text-[14px] leading-[1.5] text-[#4b5563] whitespace-nowrap">
              {companyName}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end px-[10px] w-full">
          <button
            onClick={handleLikeClick}
            disabled={isLikeLoading}
            className="flex items-center justify-center rounded-[10.667px] w-[32px] h-[32px] hover:opacity-80 transition-opacity disabled:opacity-50"
            aria-label={isLiked ? '찜 취소' : '찜하기'}
          >
            {isLiked ? (
              <LikeIconFilled width={29} height={25} fill="#1F2937" stroke="#1F2937" />
            ) : (
              <LikeIcon width={29} height={25} stroke="#1F2937" strokeWidth={0.6875} />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="relative w-full max-w-[320px] aspect-[442/390]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute h-[77.14%] left-[15.99%] top-[11.4%] w-[68.06%]">
              {imageUrl ? (
                <Image
                  src={imageUrl.startsWith('http') ? imageUrl : withBasePath(imageUrl)}
                  alt={name}
                  fill
                  unoptimized
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#f3f4f6] rounded-[8px]">
                  <h1 className="font-cardo font-medium text-[26px] leading-[normal] text-[#1f2937] whitespace-nowrap">
                    UNICORN
                  </h1>
                </div>
              )}
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
    </>
  );
};
