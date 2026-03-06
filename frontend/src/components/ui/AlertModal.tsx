'use client';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const AlertModal = ({ isOpen, onClose, message }: AlertModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[30px] w-[420px] flex flex-col items-center px-[44px] py-[50px] gap-[36px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-[16px]">
          <div className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#f0fdf4]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="font-suit font-semibold text-[18px] text-[#111827] leading-[1.5] text-center whitespace-pre-wrap">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-black flex h-[48px] w-full items-center justify-center px-[32px] py-[12px] rounded-[10px] hover:opacity-90 transition-opacity"
        >
          <p className="font-suit font-bold text-[16px] text-white leading-[1.3]">
            확인
          </p>
        </button>
      </div>
    </div>
  );
};
