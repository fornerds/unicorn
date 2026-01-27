import { cn } from '@/utils/cn';

interface HeightIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const HeightIcon = ({
  className,
  width = 18,
  height = 47,
  stroke = 'currentColor',
  strokeWidth = 2,
}: HeightIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 47"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M9 46V1M9 46L1 37M9 46L17 37M9 1L1 10M9 1L17 10"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
