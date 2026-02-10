'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

type SortOption = 'latest' | 'popular' | 'recommended';

interface NewsSortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'latest', label: '최신 순' },
  { value: 'popular', label: '인기 순' },
  { value: 'recommended', label: '추천 순' },
];

export const NewsSortDropdown = ({ value, onChange }: NewsSortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = sortOptions.find((option) => option.value === value)?.label || '최신 순';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border-[0.75px] border-[#959ba9] flex gap-[4.5px] items-center overflow-hidden pl-[15px] pr-[12px] py-[4.5px] rounded-[74.25px]"
      >
        <span className="font-suit font-medium leading-[1.35] text-[15px] text-[#6b7280]">
          {selectedLabel}
        </span>
        <div className="flex items-center justify-center p-[1.333px] rounded-[5.333px] w-[9px] h-[9px]">
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            className={cn('transition-transform', isOpen && 'rotate-180')}
          >
            <path
              d="M1.5 3.5L4.5 6.5L7.5 3.5"
              stroke="#6b7280"
              strokeWidth="0.875"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="absolute bg-white border border-[#e5e7eb] flex flex-col gap-[4px] items-center justify-center p-[8px] right-0 rounded-[6px] top-[calc(100%+4px)] z-50 min-w-[120px]">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'flex items-center justify-center overflow-hidden px-[12px] py-[4px] rounded-[6px] w-full transition-colors',
                value === option.value
                  ? 'bg-[#f3f4f6]'
                  : 'hover:bg-[#f9fafb]'
              )}
            >
              <span
                className={cn(
                  'font-suit font-medium leading-[1.35] text-[15px] text-center text-ellipsis whitespace-nowrap w-full',
                  value === option.value ? 'text-[#4b5563]' : 'text-[#6b7280]'
                )}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
