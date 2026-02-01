import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: 'google' | 'naver' | 'kakao';
  icon?: React.ReactNode;
}

export const SocialLoginButton = ({ provider, icon, className, children, ...props }: SocialLoginButtonProps) => {
  const providerStyles = {
    google: 'bg-[#f9fafe] border border-[#ebebec] text-[#6b7280]',
    naver: 'bg-[#03c75a] text-white',
    kakao: 'bg-[#fee500] text-[#1f2937]',
  };

  return (
    <button
      className={cn(
        'flex gap-[16px] h-[45px] items-center justify-center overflow-hidden px-[35px] rounded-[4px] w-full',
        'font-suit font-semibold text-[16px] leading-[1.5] whitespace-nowrap',
        'transition-opacity hover:opacity-90',
        providerStyles[provider],
        className
      )}
      {...props}
    >
      {icon && <div className="shrink-0 w-[17px] h-[17px] flex items-center justify-center">{icon}</div>}
      <span>{children}</span>
    </button>
  );
};
