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
      <div className="flex flex-col gap-[4px] items-start w-full">
        {label && (
          <div className="flex gap-[4px] items-start w-full">
            <label className="font-suit font-bold text-[16px] text-[#4b5563] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
              {label}
            </label>
            {required && (
              <span className="font-suit font-bold text-[14px] text-[#b59a79] leading-[1.35]">
                *
              </span>
            )}
          </div>
        )}
        <div className="flex gap-[12px] items-center w-full">
          <div className="flex flex-1 flex-col gap-[6px] items-start min-h-0 min-w-0">
            <div className="bg-[#f9fafb] flex h-[48px] items-center p-[16px] rounded-[6px] w-full">
              <input
                ref={ref}
                className={cn(
                  'flex-1 font-suit font-semibold text-[16px] text-[#bac2d0] leading-[1.35] bg-transparent border-none outline-none placeholder:text-[#bac2d0]',
                  className
                )}
                {...props}
              />
            </div>
          </div>
          {icon && <div className="flex items-center justify-center shrink-0 w-[20px] h-[20px]">{icon}</div>}
        </div>
        {error && (
          <p className="font-suit text-[14px] text-red-500 leading-[1.5]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
