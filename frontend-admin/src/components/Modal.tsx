import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** 제품 상세 미리보기 등 큰 화면용: 'lg' 시 max-w-4xl, 'xl' 시 max-w-5xl */
  size?: 'default' | 'lg' | 'xl';
}

export function Modal({ open, onClose, title, children, size = 'default' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
      />
      <div
        className={`relative w-full rounded-lg bg-white shadow-xl ${size === 'xl' ? 'max-w-5xl' : size === 'lg' ? 'max-w-4xl' : 'max-w-md'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="닫기"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>
        <div className={`overflow-y-auto px-6 py-4 ${size === 'default' ? 'max-h-[70vh]' : 'max-h-[85vh]'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
