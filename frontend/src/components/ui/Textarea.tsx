import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  showCounter?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, required, error, maxLength, showCounter = false, className, value, onChange, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0;

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
        <div className="flex flex-col gap-[6px] items-start w-full">
          <div className="bg-[#f9fafb] flex flex-col gap-[6px] items-start p-[16px] rounded-[6px] w-full min-h-[200px]">
            <textarea
              ref={ref}
              className={cn(
                'flex-1 font-suit font-semibold text-[16px] text-[#bac2d0] leading-[1.35] bg-transparent border-none outline-none resize-none w-full',
                'placeholder:text-[#bac2d0]',
                className
              )}
              maxLength={maxLength}
              value={value}
              onChange={onChange}
              {...props}
            />
          </div>
          {showCounter && maxLength && (
            <div className="flex justify-end w-full">
              <p className="font-suit text-[14px] text-[#959ba9] leading-[1.5]">
                {currentLength}/{maxLength}
              </p>
            </div>
          )}
        </div>
        {error && (
          <p className="font-suit text-[14px] text-red-500 leading-[1.5]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
