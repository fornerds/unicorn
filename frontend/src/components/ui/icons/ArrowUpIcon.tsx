import { cn } from '@/utils/cn';

interface ArrowUpIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const ArrowUpIcon = ({
  className,
  width = 17,
  height = 9,
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: ArrowUpIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 17 9"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M0.75 8.25L8.25 0.75L15.75 8.25"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
