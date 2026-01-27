'use client';

import { cn } from '@/utils/cn';

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const NewsPagination = ({ currentPage, totalPages, onPageChange }: NewsPaginationProps) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col items-center justify-center pb-[100px] px-[10px] w-full">
      <div className="flex gap-[5px] items-center">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={cn(
            'bg-white border border-[#e5e7eb] flex flex-col h-[32px] items-center justify-center p-[10px] rounded-[8px] w-[30px] transition-colors',
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#f9fafb] cursor-pointer'
          )}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <div
                key={`dots-${index}`}
                className="bg-white border border-[#e5e7eb] flex flex-col h-[32px] items-center justify-center p-[10px] rounded-[8px] w-[30px]"
              >
                <div className="flex gap-[3px] items-center">
                  <div className="w-[2px] h-[2px] bg-[#374151] rounded-full" />
                  <div className="w-[2px] h-[2px] bg-[#374151] rounded-full" />
                  <div className="w-[2px] h-[2px] bg-[#374151] rounded-full" />
                </div>
              </div>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                'flex flex-col h-[32px] items-center justify-center p-[10px] rounded-[8px] w-[30px] transition-colors',
                isActive
                  ? 'bg-[#1F2937]'
                  : 'bg-white border border-[#e5e7eb] hover:bg-[#f9fafb]'
              )}
            >
              <span
                className={cn(
                  'font-suit font-semibold leading-[normal] text-[13px]',
                  isActive ? 'text-white' : 'text-[#374151]'
                )}
              >
                {pageNumber}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={cn(
            'bg-white border border-[#e5e7eb] flex flex-col h-[32px] items-center justify-center p-[10px] rounded-[8px] w-[30px] transition-colors',
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#f9fafb] cursor-pointer'
          )}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
