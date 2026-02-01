import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'flex items-center justify-center font-suit font-bold rounded-[6px] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[#161616] text-[#FFFBF4]',
      secondary: 'bg-gray-200 text-gray-700',
      outline: 'bg-transparent border border-gray-300 text-gray-700',
    };
    
    const sizes = {
      sm: 'h-[36px] px-[16px] text-[14px]',
      md: 'h-[48px] px-[24px] text-[18px]',
      lg: 'h-[56px] px-[32px] text-[20px]',
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        <span className="leading-[1.5] overflow-hidden text-ellipsis text-left whitespace-nowrap">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
