import { cn } from '@/utils/cn';

interface CheckIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const CheckIcon = ({
  className,
  width = 20,
  height = 20,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: CheckIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M15.8888 4.76758L7.14996 13.5065L3.17773 9.53425"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
