'use client';

import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

export default function ResetPasswordCompletePage() {
  return (
    <div className="bg-white flex flex-col">
      <main className="flex-1 flex items-center justify-center px-[20px] py-[120px]">
        <div className="flex flex-col gap-[40px] items-center justify-between w-full max-w-[458px] h-[360px]">
          <div className="flex items-center justify-center p-[10px] shrink-0">
            <h1 className="font-cardo text-[32px] text-[#1f2937] leading-[normal] whitespace-nowrap">
              UNICORN
            </h1>
          </div>

          <div className="flex items-center justify-center w-full">
            <p className="font-suit font-medium text-[24px] text-[#1f2937] leading-[1.5] whitespace-nowrap">
              비밀번호 변경이 완료되었습니다!
            </p>
          </div>

          <div className="flex gap-[8px] h-[24px] items-center justify-center w-full">
            <p className="font-suit font-regular text-[16px] text-[#4b5563] leading-[1.5] text-center whitespace-nowrap">
              바로 로그인하러 가기
            </p>
            <Link
              href={ROUTES.LOGIN}
              className="font-suit font-semibold text-[16px] text-[#1f2937] leading-[1.5] text-center whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              로그인
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
