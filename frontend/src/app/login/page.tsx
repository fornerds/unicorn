'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { SocialLoginButton } from '@/components/ui/SocialLoginButton';
import { AtIcon, EyeOffIcon, ViewIcon, ArrowDownIcon, GoogleIcon, NaverIcon, KakaoIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';
import { apiFetch, ApiClientError } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { LoginResponse } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [email, setEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('gmail.com');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'naver' | 'kakao' | null>(null);

  const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com'];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullEmail = `${email}@${emailDomain}`;

    if (!email.trim()) {
      setError('이메일을 입력해 주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: fullEmail, password }),
      });

      // accessToken은 Zustand에 저장, refresh_token은 서버가 Set-Cookie로 자동 설정
      setAccessToken(res.data.accessToken);
      setUser({
        id: '',
        email: res.data.user.email,
        name: res.data.user.name,
        phone: res.data.user.phone,
        marketingAgreed: res.data.user.marketingAgreed,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      router.push(ROUTES.HOME);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('로그인에 실패했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'naver' | 'kakao') => {
    if (socialLoading) return;
    setSocialLoading(provider);
    setError('');
    try {
      const res = await apiFetch<{ data: { url: string; state: string } }>(
        `/auth/oauth/${provider}/authorize-url`,
      );
      window.location.href = res.data.url;
    } catch {
      setError('소셜 로그인을 시작할 수 없습니다. 잠시 후 다시 시도해 주세요.');
      setSocialLoading(null);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-[20px] py-[120px]">
        <div className="flex flex-col gap-[85px] items-center w-full max-w-[458px]">
          <div className="flex items-center justify-center p-[10px] shrink-0">
            <h1 className="font-cardo text-[32px] text-[#1f2937] leading-[normal] whitespace-nowrap">
              UNICORN
            </h1>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-[20px] items-start w-full">
            {error && (
              <div className="w-full px-[16px] py-[12px] bg-red-50 border border-red-200 rounded-[6px]">
                <p className="font-suit font-normal text-[14px] text-red-600 leading-[1.5]">{error}</p>
              </div>
            )}
            <div className="flex flex-col gap-[20px] items-start w-full">
              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start w-full">
                  <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                    이메일
                  </label>
                </div>
                <div className="flex gap-[12px] items-center w-full">
                  <div className="flex flex-1 h-[48px] items-center px-[4px] py-[16px] border-b border-[#BAC2D0] min-h-0 min-w-0">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일 주소"
                      className={`flex-1 font-suit font-medium text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${email ? 'text-[#161616]' : 'text-[#bac2d0]'}`}
                    />
                  </div>
                  <div className="flex items-center justify-center shrink-0 w-[16px] h-[16px]">
                    <AtIcon width={17} height={17} />
                  </div>
                  <div className="flex flex-1 h-[48px] items-center justify-between px-[4px] py-[16px] border-b border-[#BAC2D0] min-h-0 min-w-0">
                    <select
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none appearance-none ${emailDomain ? 'text-[#161616]' : 'text-[#bac2d0]'}`}
                    >
                      {emailDomains.map((domain) => (
                        <option key={domain} value={domain}>
                          {domain}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px]">
                      <ArrowDownIcon width={15} height={15} fill="#bac2d0" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start w-full">
                  <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                    비밀번호
                  </label>
                </div>
                <div className="flex flex-col gap-[4px] items-start w-full">
                  <div className="flex h-[48px] items-center justify-between pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력해 주세요."
                      className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${password ? 'text-[#161616]' : 'text-[#bac2d0]'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px]"
                      aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    >
                      {showPassword ? (
                        <ViewIcon width={15} height={15} stroke="#bac2d0" />
                      ) : (
                        <EyeOffIcon width={15} height={15} stroke="#bac2d0" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>

            <div className="flex items-center justify-between w-full">
              <Toggle
                checked={keepLoggedIn}
                onChange={setKeepLoggedIn}
                label="로그인 상태 유지"
              />
              <Link
                href="/login/forgot-password"
                className="flex items-center justify-center px-[4px] py-[10px] font-suit font-normal text-[16px] text-[#6b7280] leading-[1.6] whitespace-nowrap underline decoration-solid hover:opacity-80 transition-opacity"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          </form>

          <div className="flex flex-col gap-[30px] items-start w-full">
            <div className="flex gap-[12px] items-center w-full">
              <div className="flex flex-1 items-center justify-center">
                <div className="h-0 w-full border-t border-[#959BA9]" />
              </div>
              <p className="font-suit font-normal text-[16px] text-[#6b7280] leading-none shrink-0">
                소셜 계정으로 간편 로그인
              </p>
              <div className="flex flex-1 items-center justify-center">
                <div className="h-0 w-full border-t border-[#959BA9]" />
              </div>
            </div>

            <div className="flex flex-col gap-[12px] items-start justify-center w-full">
              <SocialLoginButton
                provider="google"
                onClick={() => handleSocialLogin('google')}
                disabled={!!socialLoading}
                icon={
                  <Image
                    src="/icons/google.svg"
                    alt="Google logo"
                    width={17}
                    height={17}
                    className="w-[17px] h-[17px]"
                  />
                }
              >
                {socialLoading === 'google' ? '연결 중...' : '구글로 로그인'}
              </SocialLoginButton>
              <SocialLoginButton
                provider="naver"
                onClick={() => handleSocialLogin('naver')}
                disabled={!!socialLoading}
                icon={<NaverIcon width={16} height={16} />}
              >
                {socialLoading === 'naver' ? '연결 중...' : '네이버 로그인'}
              </SocialLoginButton>
              <SocialLoginButton
                provider="kakao"
                onClick={() => handleSocialLogin('kakao')}
                disabled={!!socialLoading}
                icon={<KakaoIcon width={18} height={18} />}
              >
                {socialLoading === 'kakao' ? '연결 중...' : '카카오로 로그인'}
              </SocialLoginButton>
            </div>
          </div>

          <div className="flex gap-[8px] h-[24px] items-center justify-center w-full">
            <p className="font-suit font-regular text-[16px] text-[#4b5563] leading-[1.5] text-center whitespace-nowrap">
              계정이 없으신가요?
            </p>
            <Link
              href={ROUTES.SIGNUP}
              className="font-suit font-medium text-[16px] text-[#1f2937] leading-[1.5] text-center whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              회원가입
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
