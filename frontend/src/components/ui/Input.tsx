import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, required, error, icon, className, ...props }, ref) => {
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
          <div className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full">
            <input
              ref={ref}
              className={cn(
                'flex-1 font-suit font-semibold text-[16px] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#ABB0BA]',
                className
              )}
              style={{
                color: props.value && String(props.value).trim() !== '' ? '#121212' : '#ABB0BA',
              }}
              {...props}
            />
          </div>
        </div>
        {error && (
          <p className="font-suit text-[14px] text-red-500 leading-[1.5]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
