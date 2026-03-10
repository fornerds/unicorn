'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { apiFetch } from '@/lib/api';
import { ROUTES } from '@/utils/constants';

interface MeResponse {
  data: {
    email: string;
    name: string;
    phone: string;
    marketingAgreed: boolean;
  };
}

function SnsCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      // 1. URL 파라미터에서 accessToken 확인 (백엔드가 URL로 전달하는 경우)
      const tokenFromParams =
        searchParams.get('accessToken') || searchParams.get('token');

      if (tokenFromParams) {
        setAccessToken(tokenFromParams);
      } else {
        // 2. 쿠키에서 access_token 확인 (non-httpOnly 쿠키인 경우)
        const cookieMatch = document.cookie.match(/(^|; )access_token=([^;]*)/);
        if (cookieMatch) {
          setAccessToken(decodeURIComponent(cookieMatch[2]));
        }
        // 3. 토큰이 없어도 apiFetch가 401 시 refresh_token 쿠키로 자동 재시도
      }

      try {
        const res = await apiFetch<MeResponse>('/users/me');
        if (!res.data.name || !res.data.phone) {
          router.push(ROUTES.SNS_COMPLETE);
          return;
        }
        setUser({
          id: '',
          email: res.data.email,
          name: res.data.name,
          phone: res.data.phone,
          marketingAgreed: res.data.marketingAgreed,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        router.push(ROUTES.HOME);
      } catch {
        setError('소셜 로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => router.push(ROUTES.LOGIN), 2000);
      }
    };

    handleCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-[16px]">
        <p className="font-suit font-normal text-[18px] text-[#dc2626]">{error}</p>
        <p className="font-suit font-light text-[14px] text-[#959ba9]">
          로그인 페이지로 이동합니다...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-[16px]">
      <p className="font-suit font-normal text-[20px] text-[#1f2937]">
        로그인 처리 중...
      </p>
      <p className="font-suit font-light text-[14px] text-[#959ba9]">
        잠시만 기다려 주세요.
      </p>
    </div>
  );
}

export default function SnsLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white min-h-screen flex items-center justify-center">
          <p className="font-suit font-normal text-[20px] text-[#1f2937]">
            로그인 처리 중...
          </p>
        </div>
      }
    >
      <SnsCallbackHandler />
    </Suspense>
  );
}
