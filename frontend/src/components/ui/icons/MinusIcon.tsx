import { cn } from '@/utils/cn';

interface MinusIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  stroke?: string;
  strokeWidth?: number | string;
}

export const MinusIcon = ({
  className,
  width = 12,
  height = 1,
  stroke = 'currentColor',
  strokeWidth = 1,
}: MinusIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 12 1"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M0.5 0.5H11.1667"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
