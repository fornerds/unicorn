'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AtIcon, ArrowDownIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';
import { apiFetch, ApiClientError } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { formatPhoneNumber, stripPhoneFormat } from '@/utils/phone';

interface MeResponse {
  data: {
    email: string;
    name: string;
    phone: string;
    marketingAgreed: boolean;
  };
}

export default function SnsCompletePage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('gmail.com');
  const [phone, setPhone] = useState('');
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) { setErrorMessage('이름을 입력해 주세요.'); return; }
    if (!email.trim()) { setErrorMessage('이메일 주소를 입력해 주세요.'); return; }
    if (!phone.trim()) { setErrorMessage('연락처를 입력해 주세요.'); return; }

    const fullEmail = `${email}@${emailDomain}`;
    const rawPhone = stripPhoneFormat(phone);

    setIsLoading(true);
    try {
      await apiFetch('/auth/sns/complete-profile', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          phone: rawPhone,
          email: fullEmail,
          marketingAgreed,
        }),
      });

      const res = await apiFetch<MeResponse>('/users/me');
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
    } catch (err) {
      if (err instanceof ApiClientError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('회원정보 등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-[20px] py-[120px]">
        <div className="flex flex-col gap-[60px] items-center w-full max-w-[458px]">
          <div className="flex flex-col gap-[12px] items-center">
            <h1 className="font-cardo text-[32px] text-[#1f2937] leading-[normal] whitespace-nowrap">
              UNICORN
            </h1>
            <p className="font-suit font-normal text-[16px] text-[#6b7280] leading-[1.5] text-center">
              처음 로그인하셨습니다. 추가 정보를 입력해 주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] items-start w-full">
            {errorMessage && (
              <div className="w-full px-[16px] py-[12px] bg-red-50 border border-red-200 rounded-[6px]">
                <p className="font-suit font-normal text-[14px] text-red-600 leading-[1.5]">{errorMessage}</p>
              </div>
            )}

            <div className="flex flex-col gap-[20px] items-start w-full">
              {/* 이름 */}
              <div className="flex flex-col gap-[4px] items-start w-full">
                <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5]">
                  이름
                </label>
                <div className="flex h-[48px] items-center px-[4px] py-[16px] border-b border-[#BAC2D0] w-full">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력해 주세요."
                    className={`flex-1 font-suit font-medium text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${name ? 'text-[#161616]' : 'text-[#bac2d0]'}`}
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div className="flex flex-col gap-[4px] items-start w-full">
                <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5]">
                  이메일
                </label>
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
                      className="flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none appearance-none text-[#161616]"
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

              {/* 연락처 */}
              <div className="flex flex-col gap-[4px] items-start w-full">
                <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5]">
                  연락처
                </label>
                <div className="flex h-[48px] items-center px-[4px] py-[16px] border-b border-[#BAC2D0] w-full">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    placeholder="010-0000-0000"
                    className={`flex-1 font-suit font-medium text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${phone ? 'text-[#161616]' : 'text-[#bac2d0]'}`}
                  />
                </div>
              </div>

              {/* 마케팅 동의 */}
              <div className="flex items-center gap-[8px]">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={marketingAgreed}
                  onChange={(e) => setMarketingAgreed(e.target.checked)}
                  className="w-[16px] h-[16px] accent-[#1f2937] cursor-pointer"
                />
                <label
                  htmlFor="marketing"
                  className="font-suit font-normal text-[14px] text-[#6b7280] leading-[1.5] cursor-pointer"
                >
                  마케팅 정보 수신에 동의합니다. (선택)
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '등록 중...' : '회원정보 등록'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
