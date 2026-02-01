'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowBackIcon, EyeOffIcon, ViewIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset password attempt:', { newPassword, confirmPassword });
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
              <h2 className="font-suit font-medium text-[20px] text-[#1f2937] leading-[1.45] whitespace-nowrap">
                비밀번호 변경
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[40px] items-start w-full">
            <div className="flex flex-col gap-[16px] items-start w-full">
              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex items-start w-full">
                  <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
                    새 비밀번호 입력
                  </label>
                </div>
                <div className="flex h-[48px] items-center justify-between pt-[16px] pr-[12px] pb-[16px] pl-[4px] border-b border-[#BAC2D0] w-full">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호"
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
                className="w-full h-[48px] flex items-center justify-center rounded-[6px] bg-[#161616] text-[#FFF] font-suit font-bold text-[18px] leading-[1.5] hover:opacity-90 transition-opacity"
              >
                비밀번호 변경하기
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
