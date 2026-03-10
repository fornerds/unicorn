'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const LoginModal = ({ isOpen, onClose, message }: LoginModalProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onClose();
    router.push(ROUTES.LOGIN);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[30px] w-[420px] flex flex-col items-center px-[44px] py-[50px] gap-[36px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-[12px]">
          <div className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#f0f4ff]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 21C3 17.134 7.02944 14 12 14C16.9706 14 21 17.134 21 21" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-suit font-semibold text-[18px] text-[#111827] leading-[1.5] text-center whitespace-pre-wrap">
            {message || '회원만 이용 가능한 서비스입니다.\n로그인하시겠습니까?'}
          </p>
        </div>
        <div className="flex gap-[12px] w-full">
          <button
            onClick={onClose}
            className="flex-1 h-[48px] border border-[#e5e7eb] bg-[#f9fafb] rounded-[10px] font-suit font-medium text-[16px] text-[#6b7280] hover:opacity-80 transition-opacity"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 h-[48px] bg-[#1f2937] rounded-[10px] font-suit font-bold text-[16px] text-white hover:opacity-90 transition-opacity"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};
