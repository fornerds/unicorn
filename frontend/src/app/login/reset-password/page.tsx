'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowBackIcon, EyeOffIcon, ViewIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';
import { apiFetch, ApiClientError } from '@/lib/api';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const method = searchParams.get('method');
  const phoneParam = searchParams.get('phone');
  const verifyCodeParam = searchParams.get('verifyCode');
  const emailParam = searchParams.get('email');
  const tokenParam = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword) {
      setError('새 비밀번호를 입력해 주세요.');
      return;
    }
    if (newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      if (method === 'phone' && phoneParam && verifyCodeParam) {
        await apiFetch('/auth/password/find/phone', {
          method: 'POST',
          body: JSON.stringify({
            phone: phoneParam,
            verifyCode: verifyCodeParam,
            newPassword,
          }),
        });
      } else if (method === 'email' && emailParam && tokenParam) {
        await apiFetch('/auth/password/find/email', {
          method: 'POST',
          body: JSON.stringify({
            email: emailParam,
            token: tokenParam,
            newPassword,
          }),
        });
      } else {
        setError('잘못된 접근입니다. 비밀번호 찾기를 다시 시도해 주세요.');
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col">
      <main className="flex-1 flex items-center justify-center px-[20px] py-[120px]">
        <div className="flex flex-col gap-[60px] items-center w-full max-w-[458px]">
          <div className="flex items-center justify-center p-[10px] shrink-0">
            <h1 className="font-cardo text-[32px] text-[#1f2937] leading-[normal] whitespace-nowrap">
              UNICORN
            </h1>
          </div>

          <div className="flex items-center w-full">
            <div className="flex gap-[6px] items-center">
              <Link href={ROUTES.LOGIN} className="flex items-center">
                <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center">
                  <ArrowBackIcon width={20} height={16} stroke="#1F2937" />
                </div>
              </Link>
              <h2 className="font-suit font-normal text-[20px] text-[#1f2937] leading-[1.45] whitespace-nowrap">
                비밀번호 변경
              </h2>
            </div>
          </div>

          {isSuccess ? (
            <div className="flex flex-col gap-[20px] items-center w-full py-[40px]">
              <p className="font-suit font-medium text-[18px] text-[#374151] leading-[1.5] text-center">
                비밀번호가 성공적으로 변경되었습니다.
              </p>
              <p className="font-suit font-normal text-[14px] text-[#6b7280] leading-[1.5] text-center">
                로그인 페이지로 이동합니다...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[40px] items-start w-full">
              {error && (
                <div className="w-full px-[16px] py-[12px] bg-red-50 border border-red-200 rounded-[6px]">
                  <p className="font-suit font-normal text-[14px] text-red-600 leading-[1.5]">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-[16px] items-start w-full">
                <div className="flex flex-col gap-[4px] items-start w-full">
                  <div className="flex items-start w-full">
                    <label className="font-suit font-semibold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                      새 비밀번호 입력
                    </label>
                  </div>
                  <div className="flex h-[48px] items-center justify-between pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호 (8자 이상)"
                      className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${
                        newPassword ? 'text-[#161616]' : 'text-[#bac2d0]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px]"
                      aria-label={showNewPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    >
                      {showNewPassword ? (
                        <ViewIcon width={20} height={20} stroke="#bac2d0" />
                      ) : (
                        <EyeOffIcon width={20} height={20} stroke="#bac2d0" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-[4px] items-start w-full">
                  <div className="flex h-[48px] items-center justify-between pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="새 비밀번호 확인"
                      className={`flex-1 font-suit font-regular text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0] ${
                        confirmPassword ? 'text-[#161616]' : 'text-[#bac2d0]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="flex items-center justify-center shrink-0 w-[20px] h-[20px] p-[1.667px]"
                      aria-label={showConfirmPassword ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
                    >
                      {showConfirmPassword ? (
                        <ViewIcon width={20} height={20} stroke="#bac2d0" />
                      ) : (
                        <EyeOffIcon width={20} height={20} stroke="#bac2d0" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[48px] flex items-center justify-center rounded-[6px] bg-[#161616] text-[#FFF] font-suit font-semibold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? '변경 중...' : '비밀번호 변경하기'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="bg-white flex flex-col min-h-screen items-center justify-center">
        <p className="font-suit text-[#6b7280]">로딩 중...</p>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
