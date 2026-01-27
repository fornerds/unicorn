'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/constants';

export default function MyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-suit font-semibold text-[32px] text-[#1f2937] mb-4">
          마이페이지
        </h1>
        <p className="font-suit text-[16px] text-[#6b7280] mb-8">
          마이페이지 기능은 준비 중입니다.
        </p>
        <button
          onClick={() => router.push(ROUTES.HOME)}
          className="font-suit font-medium text-[16px] text-white bg-[#1f2937] px-6 py-3 rounded-[8px] hover:opacity-90 transition-opacity"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
