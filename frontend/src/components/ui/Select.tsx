'use client';

import { forwardRef, SelectHTMLAttributes, useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { ArrowDownChevronIcon } from './icons/ArrowDownChevronIcon';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, required, error, placeholder, options = [], className, value, onChange, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = useState<string>(value as string || '');
    const isPlaceholder = selectedValue === '';

    useEffect(() => {
      setSelectedValue(value as string || '');
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="flex flex-col gap-[8px] items-start w-full">
        {label && (
          <div className="flex gap-[2px] items-start px-[4px] w-full">
            <label className="font-suit font-medium text-[18px] text-[#374151] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
              {label}
            </label>
            {required && (
              <span className="font-suit font-bold text-[14px] text-[#b59a79] leading-[1.35]">
                *
              </span>
            )}
          </div>
        )}
        <div className="relative w-full">
          <select
            ref={ref}
            className={cn(
              'bg-[#F9FAFB] h-[48px] pl-[16px] pr-[40px] py-[16px] rounded-[6px] w-full',
              'font-suit font-semibold text-[16px] leading-[1]',
              'border-none outline-none appearance-none cursor-pointer',
              'focus:ring-2 focus:ring-[#b59a79] focus:ring-offset-2',
              className
            )}
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              color: isPlaceholder ? '#ABB0BA' : '#121212',
            }}
            value={selectedValue}
            onChange={handleChange}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
            <ArrowDownChevronIcon width={17} height={10} stroke="#959BA9" />
          </div>
        </div>
        {error && (
          <p className="font-suit text-[14px] text-red-500 leading-[1.5]">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
